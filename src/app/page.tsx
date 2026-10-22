"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Home() {
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);
  const [searchCollection, setSearchCollection] = useState("all");
  const [searchConfig, setSearchConfig] = useState("any");
  const [searchLocation, setSearchLocation] = useState("any");
  const [totalInventory, setTotalInventory] = useState(0);
  const [reels, setReels] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const propsSnapshot = await getDocs(collection(db, "properties"));
        setTotalInventory(propsSnapshot.docs.length);
        
        const mediaSnapshot = await getDocs(collection(db, "media"));
        setReels(mediaSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-luxury-black pb-20 overflow-x-hidden w-full max-w-full">
      {/* Hero Section */}
      <section className="relative h-[90vh] w-full max-w-full">
        <div className="absolute inset-0">
          <Image
            src="/image/main-dashbaord.jpg"
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
         <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/40 to-transparent" />
        </div>
        
        <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-24">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="max-w-3xl"
          >
           <p className="text-gold-500 tracking-[0.2em] text-xs uppercase mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500"></span>
              The Private Collection - 2026
            </p>
            <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tight mb-8 text-left text-white drop-shadow-md">
              A finer way<br />
              <span className="italic pr-2">to come home.</span><br />
            </h1>
            <p className="text-white/70 max-w-md mb-12 text-sm leading-relaxed mt-4">
              Shivay Group curates exceptional homes, rare land, and landmark addresses for those who choose to live deliberately.
            </p>
            
            <div className="flex items-center gap-6">
              <Link href="/properties" className="bg-gold-500 hover:bg-gold-600 text-luxury-black px-8 py-4 text-xs font-semibold tracking-widest uppercase transition-colors flex items-center gap-2">
                Explore the Collection <span>→</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Private Search Console (Mock) */}
      <section className="max-w-7xl mx-auto px-6 -mt-20 relative z-10">
        <div className="bg-luxury-dark border border-white/10 p-8 rounded-sm">
          <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
            <h2 className="text-xs tracking-[0.2em] uppercase text-white/50 flex items-center gap-2">
              <span className="text-gold-500">⧉</span> Private Search Console
            </h2>
            <span className="text-xs tracking-[0.2em] uppercase text-white/50">Live Inventory - {totalInventory}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-white/40 mb-2">Collection</label>
              <select 
                value={searchCollection}
                onChange={(e) => { setSearchCollection(e.target.value); setSearchConfig("any"); }}
                className="w-full bg-transparent border-b border-white/20 pb-2 pl-2 pr-8 text-sm focus:outline-none focus:border-gold-500 appearance-none text-white cursor-pointer">
                <option value="all" className="bg-[#1a1a1a] text-white py-2">All Residences</option>
                <option value="houses" className="bg-[#1a1a1a] text-white py-2">New Houses</option>
                <option value="apartments" className="bg-[#1a1a1a] text-white py-2">Apartments</option>
                <option value="commercial" className="bg-[#1a1a1a] text-white py-2">Commercial Properties</option>
                <option value="plots" className="bg-[#1a1a1a] text-white py-2">Plots</option>
                <option value="rent & resale" className="bg-[#1a1a1a] text-white py-2">Rent & Resale</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-white/40 mb-2">Configuration</label>
              <select
                value={searchConfig}
                onChange={(e) => setSearchConfig(e.target.value)}
                className="w-full bg-transparent border-b border-white/20 pb-2 pl-2 pr-8 text-sm focus:outline-none focus:border-gold-500 appearance-none text-white cursor-pointer">
                <option value="any" className="bg-[#1a1a1a] text-white py-2">Any configuration</option>
                {(searchCollection === "all" || searchCollection === "houses" || searchCollection === "apartments") && (
                  <>
                    <option value="1 BHK" className="bg-[#1a1a1a] text-white py-2">1 BHK</option>
                    <option value="2 BHK" className="bg-[#1a1a1a] text-white py-2">2 BHK</option>
                    <option value="3 BHK" className="bg-[#1a1a1a] text-white py-2">3 BHK</option>
                    <option value="4 BHK" className="bg-[#1a1a1a] text-white py-2">4 BHK</option>
                    <option value="5+ BHK" className="bg-[#1a1a1a] text-white py-2">5+ BHK</option>
                  </>
                )}
                {searchCollection === "commercial" && (
                  <>
                    <option value="Office Space" className="bg-[#1a1a1a] text-white py-2">Office Space</option>
                    <option value="Retail Shop / Showroom" className="bg-[#1a1a1a] text-white py-2">Retail Shop / Showroom</option>
                    <option value="Commercial Complex" className="bg-[#1a1a1a] text-white py-2">Commercial Complex</option>
                  </>
                )}
                {searchCollection === "plots" && (
                  <>
                    <option value="0 - 500 sq. ft." className="bg-[#1a1a1a] text-white py-2">0 - 500 sq. ft.</option>
                    <option value="500 - 1,000 sq. ft." className="bg-[#1a1a1a] text-white py-2">500 - 1,000 sq. ft.</option>
                    <option value="1000 - 10000 sq. ft." className="bg-[#1a1a1a] text-white py-2">1000 - 10000 sq. ft.</option>
                    <option value="10000 - 100000+ sq. ft." className="bg-[#1a1a1a] text-white py-2">10000 - 100000+ sq. ft.</option>
                  </>
                )}
                {searchCollection === "rent & resale" && (
                  <>
                    <option value="House" className="bg-[#1a1a1a] text-white py-2">House</option>
                    <option value="Apartment" className="bg-[#1a1a1a] text-white py-2">Apartment</option>
                    <option value="Commercial" className="bg-[#1a1a1a] text-white py-2">Commercial</option>
                    <option value="Plot" className="bg-[#1a1a1a] text-white py-2">Plot</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-white/40 mb-2">Location</label>
              <select 
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full bg-transparent border-b border-white/20 pb-2 pl-2 pr-8 text-sm focus:outline-none focus:border-gold-500 appearance-none text-white cursor-pointer">
                <option value="any" className="bg-[#111] text-white">Any location</option>
                <option value="Ankleshwar" className="bg-[#111] text-white">Ankleshwar</option>
                <option value="Bharuch" className="bg-[#111] text-white">Bharuch</option>
              </select>
            </div>
            <div className="flex items-end">
              <Link href={`/properties?collection=${encodeURIComponent(searchCollection)}&config=${encodeURIComponent(searchConfig)}&location=${encodeURIComponent(searchLocation)}`} className="w-full bg-gold-400 hover:bg-gold-500 text-luxury-black text-center py-3 text-xs tracking-widest uppercase font-semibold transition-colors">
                Find Residences →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Point of View */}
      <section className="w-full bg-zinc-900 mt-24 py-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16">
        <div>
          <p className="text-gold-500 tracking-[0.2em] text-xs uppercase mb-8 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500"></span>
              01 / The Point of View
            </p>
            <h2 className="font-serif text-4xl md:text-7xl leading-tight mb-8 text-white">
              Space is the<br />
              <span className="italic text-white/80 pr-2 md:whitespace-nowrap">ultimate signature.</span>
            </h2>
            <p className="text-white/70 max-w-md mb-12 text-base md:text-lg leading-relaxed mt-4">
              Shivay Group curates exceptional homes, rare land, and landmark addresses for those who choose to live deliberately.
            </p>
        </div>
        <div className="flex flex-row md:flex-col justify-between h-full w-full md:w-fit ml-auto md:pr-12 gap-8">
            <div>
              <div className="text-gold-500 mb-4 text-3xl">✧</div>
              <h3 className="text-xs md:text-sm tracking-widest uppercase text-white/70 leading-relaxed">Design<br/>Integrity</h3>
            </div>
            <div>
              <div className="text-gold-500 mb-4 text-3xl">⊛</div>
              <h3 className="text-xs md:text-sm tracking-widest uppercase text-white/70 leading-relaxed">Rare<br/>Coordinates</h3>
            </div>
            <div>
              <div className="text-gold-500 mb-4 text-3xl">🛡</div>
              <h3 className="text-xs md:text-sm tracking-widest uppercase text-white/70 leading-relaxed">Private<br/>Counsel</h3>
            </div>
        </div>
      </div>
      </section>

      {/* Collections */}
      <section id="collection" className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex justify-between items-end mb-16">
          <div>
            <p className="text-gold-500 tracking-[0.2em] text-[10px] uppercase mb-4">02 / 05</p>
            <h2 className="font-serif text-5xl md:text-6xl">Choose your<br/><span className="italic text-white/80">kind of extraordinary.</span></h2>
          </div>
          <p className="max-w-sm text-white/50 text-sm leading-relaxed hidden md:block">
            Not every address should be found. Our private collections are edited around how you want to feel, move and arrive.
          </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { title: 'New Houses', img: '/image/new-houses.jpg' },
          { title: 'Apartments', img: '/image/apartments.jpg' },
          { title: 'Commercial', img: '/image/commercial.jpg' },
          { title: 'Plots', img: '/image/plots.jpg' },
          { title: 'Rent & Resale', img: '/image/Rent & Resale.jpg' }
        ].map((collection, idx) => (
          <Link href={`/properties?category=${encodeURIComponent(collection.title.toLowerCase())}`} key={idx} className="group relative h-96 block overflow-hidden bg-luxury-gray">
            <Image 
              src={collection.img}
              alt={collection.title} 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/95 via-luxury-black/20 to-transparent z-10" />
            <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
              <p className="text-[10px] tracking-widest uppercase text-gold-500 mb-2">Collection</p>
              <h3 className="font-serif text-2xl mb-1 group-hover:text-gold-400 transition-colors text-white">{collection.title}</h3>
              <div className="flex justify-between items-center">
                  <p className="text-xs text-white/50">Explore collection</p>
                  <span className="text-gold-500 group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Cinematic Viewings: Shorts & Reels Slider */}
      <section className="w-full max-w-7xl mx-auto px-6 py-16 md:py-24 border-t border-white/5">
        <p className="text-gold-500 tracking-[0.2em] text-[10px] uppercase mb-4">03 / Cinematic Viewings</p>
        <div className="flex justify-between items-end mb-12">
          <h2 className="font-serif text-4xl md:text-5xl text-white">
            Shorts & Reels<br/>
            <span className="italic text-white/80 text-3xl md:text-4xl">Experience the architecture.</span>
          </h2>
        </div>

        <div className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-8 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-thumb]:bg-gold-500/40 hover:[&::-webkit-scrollbar-thumb]:bg-gold-500 [&::-webkit-scrollbar-thumb]:rounded-full">
          
          {reels.map((reel) => {
            const isInsta = reel.videoUrl?.includes("instagram.com");
            const btnColor = isInsta ? "bg-[#E1306C] hover:bg-[#C13584] text-white" : "bg-gold-500 hover:bg-gold-600 text-black";
            const tagColor = isInsta ? "text-[#E1306C]" : "text-gold-500";
            const routeLink = reel.propertyId && reel.propertyId !== "all" ? `/property-details?id=${reel.propertyId}` : "/properties";

            return (
              <div key={reel.id} className="snap-start shrink-0 w-[240px] md:w-[280px] aspect-[9/16] relative bg-luxury-gray border border-white/10 rounded-sm overflow-hidden group">
                <iframe className="w-full h-full object-cover pointer-events-auto bg-black" src={reel.videoUrl} title={reel.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                {isInsta && <div className="absolute bottom-0 left-0 w-full h-24 bg-[#fafafa] z-0 pointer-events-none"></div>}
                
                <div className={`absolute bottom-0 left-0 w-full p-4 pointer-events-none z-10 ${isInsta ? 'bg-luxury-black border-t border-white/10' : 'bg-gradient-to-t from-luxury-black via-luxury-black/60 to-transparent'}`}>
                  <h3 className="font-serif text-white text-lg mb-1 drop-shadow-md">{reel.title}</h3>
                  <p className={`text-[10px] tracking-widest uppercase mb-4 ${tagColor}`}>{isInsta ? "Instagram Reel" : "YouTube Short"}</p>
                </div>
                
                <Link href={routeLink} className={`absolute bottom-4 right-4 z-20 px-4 py-2 text-[10px] tracking-widest uppercase font-semibold transition-colors ${btnColor}`}>
                  View Property
                </Link>
              </div>
            );
          })}

        </div>
      </section>

      {/* Values & Beliefs Section */}
      <section id="our-believe" className="w-full max-w-7xl mx-auto px-6 py-16 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Graphic Area (Arched Shape) */}
          <div className="bg-[#111215] border border-white/5 p-10 md:p-14 flex flex-col justify-center w-full max-w-md mx-auto md:mx-0 shadow-2xl">
            <div className="text-gold-500 font-serif text-5xl mb-6 leading-none">“</div>
            <h3 className="font-serif text-3xl md:text-4xl text-white leading-tight mb-12">
              Our role is simple: to make the search feel as rare as the address.
            </h3>
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 border border-gold-500/20 flex items-center justify-center text-gold-500 font-serif text-sm">AV</div>
              <div>
                <div className="text-white text-base">Mira Vance</div>
                <div className="text-gold-500 text-[10px] tracking-[0.2em] uppercase mt-1">Private Property Advisor</div>
              </div>
            </div>
          </div>

          {/* Right Text Content */}
          <div className="flex flex-col justify-center">
            <p className="text-gold-500 tracking-[0.2em] text-xs uppercase mb-6 font-semibold">Shivay Group / 8+ Years</p>
            <h2 className="font-serif text-5xl md:text-6xl leading-[1.1] mb-8 text-white">
              We believe the<br />best luxury is<br />
              <span className="italic text-gold-500">belonging.</span>
            </h2>
            <p className="text-white/70 text-sm leading-relaxed max-w-md mb-10">
              Thoughtful planning, honest materials and the small rituals that make a house feel like home.
            </p>
            <Link href="/founder" className="inline-flex items-center gap-2 text-sm tracking-wide text-white hover:text-gold-500 transition-colors w-fit pb-1 border-b border-transparent hover:border-gold-500">
              Meet the Visionary Behind the Legacy <span className="text-gold-500">↗</span>
            </Link>
         </div>
        </div>

        {/* Bottom Features Banner */}
        <div className="mt-12 md:mt-24 grid grid-cols-3 gap-4 md:gap-8 p-4 md:p-6 bg-[#111111] border border-white/10 rounded-sm">
          <div className="flex flex-col md:flex-row gap-2 md:gap-5 items-center md:items-start text-center md:text-left">
            <div className="text-gold-500 mt-0.5">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-2 tracking-wide">Private viewings</h4>
              <p className="text-white/50 text-xs leading-relaxed">See a home at your own pace</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:gap-5 items-center md:items-start text-center md:text-left">
            <div className="text-gold-500 mt-0.5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-2 tracking-wide">Personal guidance</h4>
              <p className="text-white/50 text-xs leading-relaxed">Talk to a property advisor</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:gap-5 items-center md:items-start text-center md:text-left">
            <div className="text-gold-500 mt-0.5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-2 tracking-wide">Homes with intent</h4>
              <p className="text-white/50 text-xs leading-relaxed">Made for how you live</p>
            </div>
          </div>
        </div>
      </section>

        {/* Statistics Section (Untouched Data) */}
      <section className="w-full max-w-7xl mx-auto px-6 py-24 border-t border-white/5 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div>
            <h3 className="text-gold-500 font-serif text-5xl mb-4">8+</h3>
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/50">Years of Excellence</p>
          </div>
          <div>
            <h3 className="text-gold-500 font-serif text-5xl mb-4">100Cr+</h3>
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/50">Property Volume</p>
          </div>
          <div>
            <h3 className="text-gold-500 font-serif text-5xl mb-4">1500+</h3>
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/50">Residences Sold</p>
          </div>
          <div>
            <h3 className="text-gold-500 font-serif text-5xl mb-4">10</h3>
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/50">Global Awards</p>
          </div>
        </div>
      </section>

      {/* Luxury Footer (Matching Screenshot 1) */}
      <footer id="contact" className="bg-[#0a0a0a] pt-24 pb-8 border-t border-white/10 w-full relative overflow-hidden">
        {/* Subtle gold wave effect for premium feel */}
        <div className="absolute bottom-0 left-0 w-full h-64 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#d4af37]/10 via-[#0a0a0a]/0 to-[#0a0a0a]/0 pointer-events-none"></div>

        <div className="max-w-[1400px] w-full mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-y-16 gap-x-8 xl:gap-x-12 relative z-10">
          
          {/* Column 1: Logo & Info */}
          <div className="md:col-span-2 lg:col-span-3 flex flex-col items-center md:items-start text-center md:text-left gap-6 lg:pr-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <svg className="w-12 h-12 text-gold-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L2 12h3v8h14v-8h3L12 3zm-2 17H7v-6h3v6zm6 0h-3v-6h3v6z"/>
              </svg>
              <div className="flex flex-col items-center md:items-start">
                <span className="font-serif text-2xl tracking-widest text-gold-500 leading-none">SHIVAY GROUP</span>
                <span className="text-[9px] tracking-[0.3em] text-white/50 uppercase mt-2">Private Estates</span>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mt-2 max-w-xs md:max-w-md">
              Curating exceptional homes and landmark addresses for a better tomorrow.
            </p>
            <div className="w-12 h-[2px] bg-gold-500 my-2"></div>
            
            <p className="font-serif italic text-gold-500 text-3xl mt-6">Your Dream Home<br/>Our Priority</p>
          </div>

          {/* Column 2: CONTACT */}
          <div className="md:col-span-1 lg:col-span-3 flex flex-col items-center md:items-start text-center md:text-left gap-8 w-full">
            <h3 className="text-gold-500 tracking-[0.2em] text-sm uppercase font-semibold">Contact</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4 w-full">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500/20 to-transparent flex items-center justify-center text-gold-500 shrink-0">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                <div>
                  <p className="text-white/40 text-[10px] md:text-[11px] uppercase tracking-wider mb-1 mt-1 md:mt-0">Call / WhatsApp</p>
                  <p className="text-white/90 text-xs md:text-sm">9265957050</p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500/20 to-transparent flex items-center justify-center text-gold-500 shrink-0">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
                <div className="md:pr-2">
                  <p className="text-white/40 text-[10px] md:text-[11px] uppercase tracking-wider mb-1 mt-1 md:mt-0">Email Us</p>
                  <p className="text-white/90 text-[10px] md:text-sm break-all">Shivaygroup.in@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: ADDRESS */}
          <div className="md:col-span-1 lg:col-span-2 flex flex-col items-center md:items-start text-center md:text-left gap-8 w-full">
            <h3 className="text-gold-500 tracking-[0.2em] text-sm uppercase font-semibold">Address</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4 w-full">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500/20 to-transparent flex items-center justify-center text-gold-500 shrink-0">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
                <div className="md:pr-4">
                  <p className="text-white/40 text-[10px] md:text-[11px] uppercase tracking-wider mb-1 mt-1 md:mt-0">Visit Our Office</p>
                  <p className="text-white/90 text-[10px] md:text-sm leading-relaxed">Ankleshwar, Gujarat<br className="hidden md:block"/>393002</p>
                </div>
              </div>
              
              <div className="hidden md:block w-full h-[1px] bg-white/10 my-1"></div>
              
              <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500/20 to-transparent flex items-center justify-center text-gold-500 shrink-0">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>
                </div>
                <div className="pt-1 flex flex-col items-center md:items-start">
                  <p className="text-white/40 text-[10px] md:text-[11px] uppercase tracking-wider mb-1 mt-1 md:mt-0">Our Location</p>
                  <a href="https://maps.app.goo.gl/77uNK3A8hr4g4W5b6" target="_blank" rel="noopener noreferrer" className="text-white/90 text-xs md:text-sm flex items-center gap-2 hover:text-gold-500 transition-colors">View on Map <span className="hidden md:inline">→</span></a>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: QUICK LINKS */}
          <div className="md:col-span-1 lg:col-span-2 flex flex-col items-center md:items-start text-center md:text-left gap-6 w-full">
            <h3 className="text-gold-500 tracking-[0.2em] text-sm uppercase font-semibold">Quick Links</h3>
            <ul className="flex flex-row md:flex-col justify-center items-center md:items-start gap-x-8 gap-y-5 w-full">
              <li className="w-auto md:w-full"><Link href="/" className="text-white/70 hover:text-gold-500 transition-colors flex items-center justify-center md:justify-between text-sm">Home <span className="text-white/30 text-xs hidden md:block">→</span></Link></li>
              <li className="w-auto md:w-full"><Link href="/#our-believe" className="text-white/70 hover:text-gold-500 transition-colors flex items-center justify-center md:justify-between text-sm">Our Believe <span className="text-white/30 text-xs hidden md:block">→</span></Link></li>
              <li className="w-auto md:w-full"><Link href="/properties" className="text-white/70 hover:text-gold-500 transition-colors flex items-center justify-center md:justify-between text-sm">Properties <span className="text-white/30 text-xs hidden md:block">→</span></Link></li>
            </ul>
          </div>

          {/* Column 5: SOCIAL MEDIA */}
          <div className="md:col-span-1 lg:col-span-2 flex flex-col items-center md:items-start text-center md:text-left gap-6">
            <h3 className="text-gold-500 tracking-[0.2em] text-sm uppercase font-semibold">Social Media</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-2 max-w-xs md:max-w-none">Follow us for latest updates and new properties.</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <a href="https://www.instagram.com/shivay_group_?utm_source=ig_web_button_share_sheet&vrfl=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded border border-white/20 flex items-center justify-center text-white/60 hover:text-gold-500 hover:border-gold-500 transition-colors shrink-0">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://www.facebook.com/people/Shivay-Group/61581884530435/?rdid=oIrOZiQ3wMbJRZhu&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1Ea265SnfX%2F" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded border border-white/20 flex items-center justify-center text-white/60 hover:text-gold-500 hover:border-gold-500 transition-colors shrink-0">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://www.youtube.com/@ShivayGroup7877" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded border border-white/20 flex items-center justify-center text-white/60 hover:text-gold-500 hover:border-gold-500 transition-colors shrink-0">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
              <a href="https://www.linkedin.com/in/shivay-group-b0a013433/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded border border-white/20 flex items-center justify-center text-white/60 hover:text-gold-500 hover:border-gold-500 transition-colors shrink-0">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="max-w-[1400px] w-full mx-auto px-6 md:px-12 mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-xs relative z-10">
          <div>© 2026 Shivay Group. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <span className="w-px h-3 bg-white/20"></span>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            
            {/* Scroll to Top Button */}
            <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="ml-4 w-10 h-10 rounded-full border border-gold-500 text-gold-500 flex items-center justify-center hover:bg-gold-500 hover:text-black transition-colors cursor-pointer shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
            </a>
          </div>
        </div>
      </footer>

      {/* Coming Soon Notification Popup */}
      {isComingSoonOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 pointer-events-auto" onClick={() => setIsComingSoonOpen(false)}>
          <div className="bg-[#1a1a1a] border border-white/20 rounded-md p-6 max-w-xs w-full text-center relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors" onClick={() => setIsComingSoonOpen(false)}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
            <div className="text-gold-500 mb-3 flex justify-center">
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
            <h3 className="text-white font-serif text-xl mb-2">Update</h3>
            <p className="text-white/60 text-sm">We will add this link soon.</p>
          </div>
        </div>
      )}

    </div>
  );
}