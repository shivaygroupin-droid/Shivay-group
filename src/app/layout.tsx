import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  metadataBase: new URL('https://shivaygroups.in'),
  title: "Shivay Group | Premium Real Estate & Private Estates",
  description: "Shivay Group curates exceptional homes, rare land, and landmark addresses for those who choose to live deliberately.",
  keywords: ["real estate", "luxury homes", "premium estates", "Shivay Group properties", "exclusive land"],
  openGraph: {
    title: "Shivay Group | Private Estates",
    description: "Curated exceptional homes, rare land, and landmark addresses.",
    url: "https://shivaygroups.in",
    siteName: "Shivay Group",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth overflow-x-hidden w-screen max-w-[100vw]">
      <body className={`${inter.variable} ${playfair.variable} antialiased bg-luxury-black text-foreground overflow-x-hidden w-screen max-w-[100vw] relative`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}