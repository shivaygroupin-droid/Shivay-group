"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Suspense } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Real Data
const MOCK_PROPERTIES = [
  { id: "1", imageFolder: "rajam_villa", title: "Rajam Villa", location: "Ankleshwar, Gujarat", type: "houses", area: "500 - 600 sq ft", beds: 3, price: "", badge: "Ready" },
  { id: "2", imageFolder: "akshat", title: "Akshat bunglows", location: "Ankleshwar, Gujarat", type: "houses", area: "1000 - 1400 sq ft", beds: 3, price: "", badge: "Ready" },
  { id: "3", imageFolder: "shreepad", title: "Shreepad Township - 2", location: "Andada Village, Ankleshwar", type: "houses", area: "Not Mentioned", beds: 2, price: "", badge: "New" },
  { id: "4", imageFolder: "ganesh_bliss", title: "Ganesh Bliss", location: "GIDC, Ankleshwar", type: "apartments", area: "678–818 sq. ft.", beds: 2, price: "", badge: "Ready" }
];

function PropertiesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get("category");
  
 const [filter, setFilter] = useState(categoryParam || "all");
  const [allProperties, setAllProperties] = useState<any[]>([]);

  useEffect(() => {
    setFilter(categoryParam || "all");
  }, [categoryParam]);

  useEffect(() => {
    const fetchLiveProperties = async () => {
      try {
        const snapshot = await getDocs(collection(db, "properties"));
        const firestoreProperties = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as any[];
        const mockIds = new Set(MOCK_PROPERTIES.map((p) => p.id));
        const uniqueFirestore = firestoreProperties.filter((p) => p.listingType === 'showcase');
        const TYPE_ORDER = ["houses", "apartments", "commercial", "plots"];
        const merged = [...uniqueFirestore];
        merged.sort((a, b) => {
          const ai = TYPE_ORDER.indexOf(a.type?.toLowerCase()) ?? 99;
          const bi = TYPE_ORDER.indexOf(b.type?.toLowerCase()) ?? 99;
          return ai - bi;
        });
        setAllProperties(merged);
      } catch (error) {
        console.error("Failed to fetch live properties:", error);
        // Fall back to mock data silently — MOCK_PROPERTIES remains in state
      }
    };
    fetchLiveProperties();
  }, []);

  const handleFilterClick = (newFilter: string) => {
    setFilter(newFilter);
    router.push(newFilter === 'all' ? '/showcase' : `/showcase?category=${newFilter}`, { scroll: false });
  };

  const normalizedFilter = filter.toLowerCase().trim();
  const actualFilter = normalizedFilter === "new houses" ? "houses" : normalizedFilter;
  const filteredProperties = normalizedFilter === "all" ? allProperties : allProperties.filter(p => p.type.toLowerCase() === actualFilter);

  return (
    <div className="min-h-screen bg-luxury-black pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header & Filter */}
        <div className="mb-16 border-b border-white/10 pb-8">
          <p className="text-gold-500 tracking-[0.2em] text-[10px] uppercase mb-4 text-center">03 / Curated Now</p>
          <div className="flex flex-col items-center text-center gap-8">
            <h1 className="font-serif text-5xl md:text-6xl">
              Our Legacy<br/>
              <span className="italic text-white/80">Delivered projects.</span>
            </h1>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 pb-2 text-xs tracking-widest uppercase items-center w-full">
              <button onClick={() => handleFilterClick("all")} className={`${filter === 'all' ? 'text-gold-500 text-sm md:text-base font-bold scale-105' : 'text-white/50 hover:text-white'} transition-all whitespace-nowrap shrink-0`}>All Residences</button>
              <button onClick={() => handleFilterClick("new houses")} className={`${filter === 'new houses' ? 'text-gold-500 text-sm md:text-base font-bold scale-105' : 'text-white/50 hover:text-white'} transition-all whitespace-nowrap shrink-0`}>Houses</button>
              <button onClick={() => handleFilterClick("apartments")} className={`${filter === 'apartments' ? 'text-gold-500 text-sm md:text-base font-bold scale-105' : 'text-white/50 hover:text-white'} transition-all whitespace-nowrap shrink-0`}>Apartments</button>
              <button onClick={() => handleFilterClick("commercial")} className={`${filter === 'commercial' ? 'text-gold-500 text-sm md:text-base font-bold scale-105' : 'text-white/50 hover:text-white'} transition-all whitespace-nowrap shrink-0`}>Commercial</button>
              <button onClick={() => handleFilterClick("plots")} className={`${filter === 'plots' ? 'text-gold-500 text-sm md:text-base font-bold scale-105' : 'text-white/50 hover:text-white'} transition-all whitespace-nowrap shrink-0`}>Plots</button>
              <button onClick={() => handleFilterClick("rent & resale")} className={`${filter === 'rent & resale' ? 'text-gold-500 text-sm md:text-base font-bold scale-105' : 'text-white/50 hover:text-white'} transition-all whitespace-nowrap shrink-0`}>Rent & Resale</button>
            </div>
          </div>
        </div>

        {/* Dynamic Empty State for Specific Categories */}
        {filteredProperties.length === 0 && filter !== "all" && (
          <div className="py-20 text-center col-span-full border border-white/10 bg-[#111]">
            <p className="text-gold-500 font-serif text-2xl mb-2">Private Collection In Progress</p>
            <p className="text-white/40 text-sm tracking-widest uppercase">No properties available currently. We will add exclusive listings soon.</p>
          </div>
        )}

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProperties.map((property, idx) => (
            <div key={property.id} className="contents">
              {(normalizedFilter === 'all' ? (idx === 0 || property.type !== filteredProperties[idx - 1].type) : idx === 0) && (
                <div className="col-span-1 md:col-span-2 mt-8 mb-4 w-full flex items-center gap-6">
                   <h3 className="text-gold-500 font-serif text-3xl md:text-4xl capitalize">{property.type === 'houses' ? 'New Houses' : property.type}</h3>
                   <div className="flex-grow h-[1px] bg-gradient-to-r from-gold-500/50 to-transparent"></div>
                </div>
              )}
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-luxury-gray border border-white/5"
            >
              <div className="block relative h-[300px] overflow-hidden select-none cursor-default">
                <div className="absolute top-6 left-6 z-10 bg-luxury-black/60 backdrop-blur-md px-3 py-1 text-[10px] tracking-widest uppercase text-white/80">
                The Skyline Collection
              </div>
              <div className="absolute top-6 right-6 z-10 text-[10px] tracking-widest uppercase text-white/50">
                0{idx + 1} / 0{filteredProperties.length}
              </div>
              <img src={(property as any).images && (property as any).images.length > 0 ? (property as any).images[0] : `/Shivay-group/image/${(property as any).imageFolder}/image1.jpg`} alt="Property Main" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gold-500 text-[10px] tracking-widest uppercase mb-2">{property.type}</p>
                    <h3 className="font-serif text-2xl">{property.title}</h3>
                    <p className="text-white/50 text-sm mt-1">{property.location}</p>
                  </div>
                  <p className="font-serif text-xl text-gold-400">{property.price}</p>
                </div>
                
                <div className="flex justify-between items-end border-t border-white/10 pt-6 mt-6">
                  <div className="flex gap-6 text-xs text-white/70">
                    <span className="flex items-center gap-2">▱ {property.area}</span>
                    {property.beds > 0 && <span className="flex items-center gap-2">⛏ {property.beds} beds</span>}
                  </div>
                  <span className="text-[9px] tracking-[0.2em] uppercase text-white/40 flex items-center gap-2">
                    <span className="w-1 h-1 bg-gold-500 rounded-full"></span> {property.badge}
                  </span>
                </div>
                
                <div className="flex justify-between items-center mt-6">
                    <span className="text-[10px] tracking-widest uppercase text-white/40 select-none">
                      Showcase Only
                    </span>
                    <a href={`https://wa.me/9265957050?text=I'm interested in ${property.title}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-[#25D366] hover:text-[#128C7E] transition-colors">
                      <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center">✆</span> WhatsApp
                    </a>
                </div>
              </div>
            </motion.div>
            </div>
          ))}
       </div>
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-luxury-black pt-20 flex items-center justify-center text-gold-500 tracking-widest">LOADING...</div>}>
      <PropertiesContent />
    </Suspense>
  );
}