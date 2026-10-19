"use client";

import Link from "next/link";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
export const runtime = 'edge';

// Data now fetched from Firestore with fallback to ALL_PROPERTIES mock array
const ALL_PROPERTIES = [
  { 
    id: "1", 
    imageFolder: "rajam_villa",
    title: "Rajam Villa", 
    location: "Ankleshwar, Gujarat", 
    type: "houses", 
    area: "500 - 600 sq ft", 
    beds: 3, 
    price: "", 
    badge: "Ready",
    description: "Rajam Villa offers elegant 3 BHK villas designed to blend modern architecture with comfortable family living. Enjoy thoughtfully planned spaces, landscaped surroundings, and a peaceful residential environment. Experience a lifestyle where nature, comfort, and everyday luxury come together.",
    amenities: ["Entrance Gate with Security Cabin", "Watchman Cabin", "CCTV Camera", "Street Lights", "RCC Road", "Garden", "Senior Citizen Sitting Area", "Jogging Track", "Kids Play Area", "Multipurpose Hall", "Indoor Gym", "Indoor Games", "Compound Wall of Campus", "Water from Common Borewell", "Anti-Termite Treatment in All Units"]
  },
  { 
    id: "2", 
    imageFolder: "akshat",
    title: "Akshat bunglows", 
    location: "Ankleshwar, Gujarat", 
    type: "houses", 
    area: "1000 - 1400 sq ft", 
    beds: 3, 
    price: "", 
    badge: "Ready",
    description: "Akshat Bungalows offers thoughtfully planned residential homes designed for comfortable family living.Featuring a practical layout, landscaped surroundings, and essential residential infrastructure, the project combines convenience with modern living. Located on Diva Road, Ankleshwar, it offers a residential setting for families seeking their own home.",
    amenities: ["Garden", "Sitting Area", "RCC Internal Roads", "Street Lights", "Compound Wall", "Drainage Line", "Entrance Gate", "CCTV Cameras"]
  },
  {
    id: "3",
    imageFolder: "shreepad",
    title: "Shreepad Township - 2",
    location: "Andada Village, Ankleshwar",
    type: "Houses",
    area: "Not Mentioned",
    beds: "2 beds",
    price: "Price on Request",
    badge: "New",
    description: "Shreepad Township - 2 offers elegant living spaces designed to blend modern architecture with comfortable family living. Experience a lifestyle where nature, comfort, and everyday luxury come together.",
    amenities: ["Entrance Gate with Security Cabin", "CCTV Camera", "Street Lights", "RCC Road", "Garden", "Kids Play Area"]
  },
  {
    id: "4",
    imageFolder: "ganesh_bliss",
    title: "Ganesh Bliss",
    location: "Ankleshwar, Gujarat",
    type: "Apartments",
    area: "Not Mentioned",
    beds: "2/3 BHK",
    price: "Price on Request",
    badge: "New",
    description: "Ganesh Bliss offers premium apartments designed for modern families. Enjoy thoughtfully planned spaces and a peaceful residential environment.",
    amenities: ["Entrance Gate with Security Cabin", "CCTV Camera", "Street Lights", "Garden", "Elevators", "Parking"]
  }
];

import React from 'react';

export default function PropertyDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);

  const [property, setProperty] = React.useState<any>(ALL_PROPERTIES.find(p => p.id === id) || null);
  const [loadingProperty, setLoadingProperty] = React.useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const [currentImgIndex, setCurrentImgIndex] = React.useState(0);
  const [isTourModalOpen, setIsTourModalOpen] = React.useState(false);

  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [visitDate, setVisitDate] = React.useState('');
  const [status, setStatus] = React.useState('');

  React.useEffect(() => {
    const fetchProperty = async () => {
      try {
        const docRef = doc(db, "properties", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProperty({ id: docSnap.id, ...docSnap.data() });
        } else {
          // Firestore doc not found — keep mock fallback already set in useState
        }
      } catch (error) {
        console.error("Firestore fetch failed, using mock fallback:", error);
      } finally {
        setLoadingProperty(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loadingProperty) return <div className="min-h-screen bg-luxury-black pt-20 pb-32 flex items-center justify-center text-white/50">Loading...</div>;
  if (!property) return <div className="min-h-screen bg-luxury-black pt-20 pb-32 flex items-center justify-center text-white">Information Unavailable</div>;

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    if (!name || !phone) { setStatus('error'); return; }
    setStatus('submitting');
    
    const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSek653hfcwcbdKU7vGx6gVBCcGeQMOqL7lV5yllD8T8IektPA/formResponse";
    const formData = new FormData();
    formData.append("entry.2005620554", name);
    formData.append("entry.1166974658", phone);
    if (visitDate) formData.append("entry.839337160", visitDate);

    try {
      await fetch(GOOGLE_FORM_URL, { method: "POST", mode: "no-cors", body: formData });
      setStatus('success');
      setName(''); setPhone(''); setVisitDate('');
      setTimeout(() => { setStatus(''); setIsTourModalOpen(false); }, 3000);
    } catch (error) {
      setStatus('error');
    }
  };

  const images: string[] =
    property.images && property.images.length > 0
      ? property.images
      : [
          `/image/${property.imageFolder}/image1.jpg`,
          `/image/${property.imageFolder}/image2.jpg`,
          `/image/${property.imageFolder}/image3.jpg`,
        ];

  const nextImage = (e: any) => { e.stopPropagation(); setCurrentImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1)); };
  const prevImage = (e: any) => { e.stopPropagation(); setCurrentImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1)); };

  return (
    <div className="min-h-screen bg-luxury-black pt-20 pb-32">
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md" onClick={() => setIsPreviewOpen(false)}>
          <button className="absolute top-8 right-8 text-white/70 hover:text-white text-4xl" onClick={() => setIsPreviewOpen(false)}>&times;</button>
          <button className="absolute left-8 text-white/70 hover:text-white text-6xl px-4" onClick={prevImage}>&#8249;</button>
          <img src={images[currentImgIndex]} alt="Preview" className="w-full h-full max-h-[85vh] max-w-[85vw] object-contain" onClick={(e) => e.stopPropagation()} />
          <button className="absolute right-8 text-white/70 hover:text-white text-6xl px-4" onClick={nextImage}>&#8250;</button>
        </div>
      )}

      {isTourModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 pointer-events-auto" onClick={() => setIsTourModalOpen(false)}>
          <div className="bg-[#f9f7f1] w-full max-w-md p-10 relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-6 right-6 text-black/50 hover:text-black text-2xl" onClick={() => setIsTourModalOpen(false)}>&times;</button>
            <p className="text-[#a63732] text-[10px] tracking-widest uppercase mb-4 font-bold">Private Viewing</p>
            <h2 className="font-serif text-4xl text-black mb-8 leading-tight">Let's find a time<br/><span className="italic text-[#d0b48f]">that works for you.</span></h2>
            {status === 'success' ? (
              <div className="text-center py-10 text-green-700 font-bold">Thank you! Your visit request has been received.</div>
            ) : (
              <form className="flex flex-col gap-6" onSubmit={handleFormSubmit}>
                <input type="text" placeholder="Your name" required value={name} onChange={(e) => setName(e.target.value)} className="w-full border-b border-black/20 bg-transparent py-3 text-black placeholder:text-black/40 focus:outline-none focus:border-[#a63732] transition-colors" />
                <input type="tel" placeholder="Phone number" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border-b border-black/20 bg-transparent py-3 text-black placeholder:text-black/40 focus:outline-none focus:border-[#a63732] transition-colors" />
                <input type="date" placeholder="Visit Date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} className="w-full border-b border-black/20 bg-transparent py-3 text-black placeholder:text-black/40 focus:outline-none focus:border-[#a63732] transition-colors" />
                {status === 'error' && <div className="bg-[#f5e6e6] text-[#a63732] text-xs p-4 mt-2">Please enter your name and phone number.</div>}
                <button disabled={status === 'submitting'} type="submit" className="w-full bg-[#bd403a] hover:bg-[#a63732] text-white py-4 text-sm font-medium transition-colors flex justify-center items-center gap-2 mt-4 disabled:opacity-50">
                  {status === 'submitting' ? 'Submitting...' : 'Request my visit'} <span className="text-lg leading-none">↗</span>
                </button>
              </form>
            )}
            <p className="text-center text-black/40 text-[10px] mt-6">We'll call you within one business day.</p>
          </div>
        </div>
      )}

     {/* Hero Gallery */}
      <div className="h-[70vh] flex gap-2 p-2">
        <div className="w-2/3 h-full relative cursor-pointer group overflow-hidden" onClick={() => { setCurrentImgIndex(0); setIsPreviewOpen(true); }}>
          {images[0] ? (
            <img src={images[0]} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display='none'; (e.currentTarget.nextElementSibling as HTMLElement).style.display='flex'; }} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Main Hero" />
          ) : null}
          <div style={{ display: images[0] ? 'none' : 'flex' }} className="w-full h-full bg-[#0e0e0e] border border-white/5 flex-col items-center justify-center gap-3 select-none">
            <span className="text-gold-500/40 text-[10px] tracking-[0.3em] uppercase">Shivay Group</span>
            <div className="w-8 h-px bg-gold-500/20" />
            <span className="text-white/20 text-[9px] tracking-widest uppercase">Image Unavailable</span>
          </div>
        </div>
        <div className="w-1/3 flex flex-col gap-2 h-full">
          <div className="flex-1 relative cursor-pointer group overflow-hidden" onClick={() => { setCurrentImgIndex(1); setIsPreviewOpen(true); }}>
            {images[1] ? (
              <img src={images[1]} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display='none'; (e.currentTarget.nextElementSibling as HTMLElement).style.display='flex'; }} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Gallery 1" />
            ) : null}
            <div style={{ display: images[1] ? 'none' : 'flex' }} className="w-full h-full bg-[#0e0e0e] border border-white/5 flex-col items-center justify-center gap-2 select-none">
              <span className="text-gold-500/30 text-[9px] tracking-[0.3em] uppercase">Shivay Group</span>
              <div className="w-6 h-px bg-gold-500/15" />
              <span className="text-white/15 text-[8px] tracking-widest uppercase">Image Unavailable</span>
            </div>
          </div>
          <div className="flex-1 relative cursor-pointer group overflow-hidden" onClick={() => { setCurrentImgIndex(2); setIsPreviewOpen(true); }}>
            {images[2] ? (
              <img src={images[2]} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display='none'; (e.currentTarget.nextElementSibling as HTMLElement).style.display='flex'; }} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Gallery 2" />
            ) : null}
            <div style={{ display: images[2] ? 'none' : 'flex' }} className="w-full h-full bg-[#0e0e0e] border border-white/5 flex-col items-center justify-center gap-2 select-none">
              <span className="text-gold-500/30 text-[9px] tracking-[0.3em] uppercase">Shivay Group</span>
              <div className="w-6 h-px bg-gold-500/15" />
              <span className="text-white/15 text-[8px] tracking-widest uppercase">Image Unavailable</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 grid md:grid-cols-3 gap-16">
        
        {/* Main Details */}
        <div className="md:col-span-2">
          <p className="text-gold-500 text-[10px] tracking-widest uppercase mb-4">{property.type} · {property.badge}</p>
          <h1 className="font-serif text-5xl md:text-7xl mb-4">{property.title}</h1>
          <p className="text-white/60 text-lg mb-12">{property.location}</p>
          
          <div className="flex gap-12 border-y border-white/10 py-8 mb-12">
            <div>
              <p className="text-[10px] tracking-widest uppercase text-white/40 mb-2">Internal Area</p>
              <p className="text-xl font-serif">{property.area}</p>
            </div>
            <div>
              <p className="text-[10px] tracking-widest uppercase text-white/40 mb-2">Bedrooms</p>
              <p className="text-xl font-serif">{property.beds} Suites</p>
            </div>
            <div>
              <p className="text-[10px] tracking-widest uppercase text-white/40 mb-2">Status</p>
              <p className="text-xl font-serif text-gold-400">Ready</p>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-xs tracking-[0.2em] uppercase text-white/50 mb-6">The Narrative</h2>
            <p className="text-white/70 text-lg leading-relaxed">{property.description}</p>
          </div>

          <div className="mb-16">
            <h2 className="text-xs tracking-[0.2em] uppercase text-white/50 mb-6">Amenities & Specifications</h2>
            <ul className="grid grid-cols-2 gap-4">
              {property.amenities?.map((item: string, idx: number) => (
                <li key={idx} className="flex items-center gap-3 text-white/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500"></span> {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
             <h2 className="text-xs tracking-[0.2em] uppercase text-white/50 mb-6">Coordinates</h2>
             <div className="w-full h-[400px] bg-[#e3e1d9] border border-black/10 flex flex-col items-center justify-center gap-3 relative overflow-hidden" style={{ backgroundImage: "repeating-linear-gradient(45deg, #00000008, #00000008 1px, transparent 1px, transparent 30px)" }}>
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md relative z-10">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#bd403a]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <h3 className="font-serif text-2xl text-black relative z-10">Location preview</h3>
                <p className="text-black/60 text-sm relative z-10">{property.location}</p>
                <p className="text-black/40 text-[10px] tracking-widest uppercase mt-2 relative z-10">Interactive Map Coming Soon</p>
             </div>
          </div>
        </div>
        
        {/* Sidebar / Sticky CTA */}
        <div className="relative">
          <div className="sticky top-32 bg-luxury-gray border border-white/5 p-8">
             <p className="text-[10px] tracking-widest uppercase text-white/50 mb-2">Guidance Value</p>
             <p className="font-serif text-4xl text-gold-400 mb-8">{property.price}</p>
             
             <button onClick={() => setIsTourModalOpen(true)} className="w-full bg-gold-400 hover:bg-gold-500 text-luxury-black py-4 text-xs font-semibold tracking-widest uppercase transition-colors mb-4">
               Request Private Tour
             </button>
             
             <a href={`https://wa.me/9265957050?text=I'm interested in ${property.title}`} target="_blank" rel="noopener noreferrer" className="w-full border border-white/20 hover:bg-[#25D366]/10 hover:border-[#25D366]/30 text-white py-4 text-xs tracking-widest uppercase transition-colors flex items-center justify-center gap-2">
               <span className="text-[#25D366]">✆</span> Chat on WhatsApp
             </a>
             
             <div className="mt-8 pt-8 border-t border-white/10">
               <p className="text-xs text-white/50 leading-relaxed text-center">
                 To maintain exclusivity, exact coordinates and full floor plans are shared post private consultation.
               </p>
             </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
