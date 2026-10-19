"use client";

import { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react"; // Success icon ke liye

export default function AddProperty() {
  const router = useRouter();
  // Naye modal ke states
  const [publishProgress, setPublishProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  
  // Naye Cloudinary States
  const [images, setImages] = useState<string[]>(Array(12).fill(''));
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    location: "",
    type: "houses",
    area: "",
    beds: "",
    badge: "",
    description: "",
    amenities: ""
  });

  const handleBrochureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAiLoading(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append("brochure", file);

      // Call our Next.js API route that interacts with Document AI
      const response = await fetch("/api/process-brochure", {
        method: "POST",
        body: formDataObj,
      });

      if (!response.ok) throw new Error("Failed to process brochure");

     const data = await response.json();
      
      // Auto-fill form fields
      setFormData(prev => ({
        ...prev,
        title: data.title || prev.title,
        price: data.price || prev.price,
        location: data.location || prev.location,
        type: data.type || prev.type,
        area: data.area || prev.area,
        beds: data.beds || prev.beds,
        badge: data.badge || prev.badge,
        description: data.description || prev.description,
        amenities: data.amenities && data.amenities.length > 0 ? data.amenities.join(", ") : prev.amenities,
      }));

      alert("Form auto-filled successfully using Gemini AI!");
    } catch (error) {
      console.error(error);
      alert("Error processing brochure. Please enter details manually.");
    } finally {
      setAiLoading(false);
    }
  };

  // Naya Cloudinary Upload Logic
  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIndex(index);
    const cloudData = new FormData();
    cloudData.append("file", file);
    cloudData.append("upload_preset", "shivay_preset");

    try {
      // Cloud name fixed: qdhwnaig
      const res = await fetch("https://api.cloudinary.com/v1_1/qdhwnaig/image/upload", {
        method: "POST",
        body: cloudData,
      });
      const data = await res.json();
      
      if (res.ok && data.secure_url) {
        setImages(prev => {
          const newArr = [...prev];
          newArr[index] = data.secure_url;
          return newArr;
        });
      } else {
        console.error("Cloudinary Error Data:", data);
        alert(`Cloudinary Error: ${data.error?.message || "Unknown error"}`);
      }
    } catch (error: any) {
      alert(`Network Error: ${error.message}`);
    } finally {
      setUploadingIndex(null);
      e.target.value = ''; 
    }
  };

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Sabse pehle strict check: Kya Admin sach mein logged in hai?
    if (!auth.currentUser) {
      alert("Permission Denied: You must be logged in as Admin to publish properties.");
      return; // Agar login nahi hai, toh yahin rok do, aage modal open hi mat karo
    }

    setShowModal(true);
    setPublishProgress(0);
    setIsLive(false);

    // Premium progress bar (90% tak)
    const interval = setInterval(() => {
      setPublishProgress(prev => (prev < 90 ? prev + 10 : prev));
    }, 250);

    try {
      // Direct await use karenge taaki Firebase ka real response pakad sakein
      await addDoc(collection(db, "properties"), {
        ...formData,
        beds: parseInt(formData.beds) || 0,
        amenities: formData.amenities.split(",").map(item => item.trim()),
        images: images.filter(url => url !== ''),
        createdAt: new Date()
      });
      
      // Agar yahan tak code aaya, matlab 100% database mein save ho chuka hai
      clearInterval(interval);
      setPublishProgress(100);
      setIsLive(true);
      
      setTimeout(() => {
        router.push("/admin.panel");
      }, 1500);

    } catch (error: any) {
      // Agar Firebase ne reject kiya (permission denied ya network issue)
      clearInterval(interval);
      setShowModal(false);
      setPublishProgress(0);
      setIsLive(false);
      console.error("Firebase Error:", error);
      alert(`Upload Failed: ${error.message}`);
    }
  }; 

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-serif mb-8">Add New Property</h2>

      {/* AI Brochure Upload */}
      <div className="bg-gold-500/10 border border-gold-500/30 p-6 rounded-sm mb-8">
        <h3 className="text-gold-500 text-sm tracking-widest uppercase mb-2">Smart Auto-Fill (Document AI)</h3>
        <p className="text-white/60 text-sm mb-4">Upload a PDF brochure to automatically extract and fill property details below.</p>
        <input 
          type="file" 
          accept="application/pdf"
          onChange={handleBrochureUpload}
          disabled={aiLoading}
          className="block w-full text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-semibold file:bg-gold-500 file:text-black hover:file:bg-gold-600 disabled:opacity-50"
        />
        {aiLoading && <p className="text-gold-400 mt-4 text-xs animate-pulse">Analyzing brochure with AI...</p>}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Property Images Grid */}
        <div>
          <h3 className="text-white text-sm tracking-widest uppercase mb-4">Property Images (Max 12)</h3>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-8">
            {images.map((imgUrl, i) => (
              <label key={i} className="aspect-square border border-dashed border-white/20 bg-white/5 flex items-center justify-center hover:border-gold-500 cursor-pointer transition-colors text-white/30 hover:text-gold-500 relative overflow-hidden">
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(i, e)} />
                {uploadingIndex === i ? (
                  <span className="text-[10px] text-gold-500 animate-pulse uppercase tracking-widest">Uploading</span>
                ) : imgUrl ? (
                  <img src={imgUrl} alt={`Upload ${i}`} className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
                ) : (
                  <span className="text-2xl">+</span>
                )}
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Title</label>
            <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-gold-500 focus:outline-none" />
          </div>
          <div>
             <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Price</label>
             <input required type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-gold-500 focus:outline-none" />
          </div>
          <div>
             <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Location</label>
             <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-gold-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Type</label>
            <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-gold-500 focus:outline-none">
              <option value="houses">Houses</option>
              <option value="apartments">Apartments</option>
              <option value="penthouses">Penthouses</option>
              <option value="commercial">Commercial</option>
              <option value="plots">Plots</option>
            </select>
          </div>
          <div>
             <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Area (sq ft)</label>
             <input type="text" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-gold-500 focus:outline-none" />
          </div>
          <div>
             <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Bedrooms</label>
             <input type="number" value={formData.beds} onChange={e => setFormData({...formData, beds: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-gold-500 focus:outline-none" />
          </div>
        </div>

        <div>
           <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Badge (e.g. Private Release)</label>
           <input type="text" value={formData.badge} onChange={e => setFormData({...formData, badge: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-gold-500 focus:outline-none" />
        </div>

        <div>
           <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Description</label>
           <textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-gold-500 focus:outline-none"></textarea>
        </div>
        
        <div>
           <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Amenities (comma separated)</label>
           <textarea rows={3} value={formData.amenities} onChange={e => setFormData({...formData, amenities: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-gold-500 focus:outline-none"></textarea>
        </div>

        <button disabled={showModal} type="submit" className="bg-gold-500 hover:bg-gold-600 text-black px-8 py-4 text-xs font-semibold tracking-wider uppercase transition-colors rounded-sm disabled:opacity-50">
          Publish Listing
        </button>
      </form>

      {/* Premium Luxury Progress Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-luxury-black border border-white/10 p-12 max-w-sm w-full shadow-2xl flex flex-col items-center">
            {isLive ? (
              <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                <CheckCircle className="w-16 h-16 text-gold-500 mb-6" />
                <h3 className="text-xl font-serif text-white mb-2 tracking-widest uppercase">Property Live</h3>
                <p className="text-sm text-white/50 text-center">Your listing has been successfully published to the portfolio.</p>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center">
                <div className="text-gold-500 text-3xl font-serif mb-8">{publishProgress}%</div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-6">
                  <div 
                    className="h-full bg-gold-500 transition-all duration-300 ease-out"
                    style={{ width: `${publishProgress}%` }}
                  />
                </div>
                <p className="text-xs text-white/50 tracking-widest uppercase animate-pulse">
                  Deploying to Network...
                </p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
