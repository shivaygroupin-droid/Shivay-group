export const runtime = "edge"; 

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    // --- STEP 1: Read the uploaded PDF ---
    const formData = await req.formData();
    const file = formData.get("brochure") as File;

    if (!file) {
      return NextResponse.json({ error: "No brochure provided" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY is missing." }, { status: 500 });
    }

    // --- STEP 2: Convert PDF to base64 ---
    const arrayBuffer = await file.arrayBuffer();
    const base64Pdf = Buffer.from(arrayBuffer).toString("base64");

    // --- STEP 3: Send to Gemini to extract property data ---
    const prompt = `You are a real estate data extraction assistant. 
Analyze this property brochure.
Extract all relevant property details and return ONLY a valid JSON object with these exact keys:
{
  "title": "string (property name)",
  "price": "string (price or 'Contact for Price')",
  "location": "string (full address or area)",
  "type": "string (one of: houses, apartments, penthouses, commercial, plots)",
  "area": "string (size in sq ft or sq meters)",
  "beds": "string (number of bedrooms)",
  "badge": "string (status like 'Ready', 'New', 'Under Construction')",
  "description": "string (2-3 sentence luxury property description)",
  "amenities": ["array", "of", "amenity", "strings"]
}
Return raw JSON only, no markdown formatting.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        prompt,
        {
          inlineData: {
            data: base64Pdf,
            mimeType: file.type || "application/pdf"
          }
        }
      ],
      config: {
        responseMimeType: "application/json",
      }
    });

    // --- STEP 4: Parse Gemini's JSON response ---
    const rawText = response.text || "{}";
    let extracted: any = {};
    try {
      extracted = JSON.parse(rawText);
    } catch {
      const cleaned = rawText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      try {
        extracted = JSON.parse(cleaned);
      } catch {
        console.error("Could not parse Gemini response as JSON:", rawText);
        extracted = { description: rawText };
      }
    }

    // --- STEP 5: Return extraction to the frontend ---
    return NextResponse.json({
      title: extracted.title || "",
      price: extracted.price || "",
      location: extracted.location || "",
      type: extracted.type || "houses",
      area: extracted.area || "",
      beds: extracted.beds || "",
      badge: extracted.badge || "",
      description: extracted.description || "",
      amenities: Array.isArray(extracted.amenities) ? extracted.amenities : [],
    });

  } catch (error: any) {
    console.error("Brochure Processing Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process brochure" },
      { status: 500 }
    );
  }
}