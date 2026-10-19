import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Shivay Group | Private Estates",
  description: "Curated exceptional homes, rare land and landmark addresses.",
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