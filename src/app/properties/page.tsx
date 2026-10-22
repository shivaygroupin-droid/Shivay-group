"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Suspense } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Real Data

function PropertiesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get("category");
  const collectionParam = searchParams.get("collection");
  const configParam = searchParams.get("config");
  const locationParam = searchParams.get("location");
  
  const [filter, setFilter] = useState(categoryParam || "all");
  const [allProperties, setAllProperties] = useState<any[]>([]);
  const [isNoResultsModalOpen, setIsNoResultsModalOpen] = useState(false);

  useEffect(() => {
    setFilter(categoryParam || "all");
  }, [categoryParam]);

  // Page hamesha top par khulne ke liye (Issue 7 fix)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryParam, collectionParam, configParam, locationParam]);

  useEffect(() => {
    const fetchLiveProperties = async () => {
      try {
        const snapshot = await getDocs(collection(db, "properties"));
        const firestoreProperties = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as any[];
        const uniqueFirestore = firestoreProperties.filter((p) => p.listingType !== 'showcase');
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
    router.push(newFilter === 'all' ? '/properties' : `/properties?category=${newFilter}`, { scroll: false });
  };

  const normalizedFilter = filter.toLowerCase().trim();
  const actualFilter = normalizedFilter === "new houses" ? "houses" : normalizedFilter;
  
  const filteredProperties = allProperties.filter(p => {
    // 1. Basic Tab Filter Logic
    let matchesTab = normalizedFilter === "all" ? true : p.type.toLowerCase() === actualFilter;

    // 2. Collection Query Filter Logic
    let matchesCollection = true;
    if (collectionParam && collectionParam !== "all") {
      if (collectionParam === "houses_apartments") {
        matchesCollection = (p.type.toLowerCase() === "houses" || p.type.toLowerCase() === "apartments");
      } else {
        matchesCollection = (p.type.toLowerCase() === collectionParam);
      }
    }

    // 3. Configuration Query Filter Logic
    let matchesConfig = true;
    if (configParam && configParam !== "any") {
       // Beds match for houses/apartments or configuration text match for commercial/plots
       let propConfig = p.configuration || (p.beds ? `${p.beds} BHK` : "");
       matchesConfig = propConfig.toLowerCase().includes(configParam.toLowerCase().replace("+", ""));
    }

    // 4. Location Query Filter Logic
    let matchesLocation = true;
    if (locationParam && locationParam !== "any") {
       matchesLocation = p.location && p.location.toLowerCase().includes(locationParam.toLowerCase());
    }

    return (collectionParam || configParam || locationParam) 
      ? (matchesCollection && matchesConfig && matchesLocation) 
      : matchesTab;
  });

  return (
    <div className="min-h-screen bg-luxury-black pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header & Filter */}
        <div className="mb-16 border-b border-white/10 pb-8">
          <p className="text-gold-500 tracking-[0.2em] text-[10px] uppercase mb-4 text-center">03 / Curated Now</p>
          <div className="flex flex-col items-center text-center gap-8">
            <h1 className="font-serif text-5xl md:text-6xl">
              The addresses<br/>
              <span className="italic text-white/80">worth knowing.</span>
            </h1>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 pb-2 text-xs tracking-widest uppercase items-center w-full">
              <button onClick={() => handleFilterClick("all")} className={`${filter === 'all' ? 'text-gold-500 text-sm md:text-base font-bold scale-105' : 'text-white/50 hover:text-white'} transition-all whitespace-nowrap shrink-0`}>All Residences</button>
              <button onClick={() => handleFilterClick("new houses")} className={`${filter === 'new houses' ? 'text-gold-500 text-sm md:text-base font-bold scale-105' : 'text-white/50 hover:text-white'} transition-all whitespace-nowrap shrink-0`}>New Houses</button>
              <button onClick={() => handleFilterClick("apartments")} className={`${filter === 'apartments' ? 'text-gold-500 text-sm md:text-base font-bold scale-105' : 'text-white/50 hover:text-white'} transition-all whitespace-nowrap shrink-0`}>Apartments</button>
              <button onClick={() => handleFilterClick("commercial")} className={`${filter === 'commercial' ? 'text-gold-500 text-sm md:text-base font-bold scale-105' : 'text-white/50 hover:text-white'} transition-all whitespace-nowrap shrink-0`}>Commercial</button>
              <button onClick={() => handleFilterClick("plots")} className={`${filter === 'plots' ? 'text-gold-500 text-sm md:text-base font-bold scale-105' : 'text-white/50 hover:text-white'} transition-all whitespace-nowrap shrink-0`}>Plots</button>
              <button onClick={() => handleFilterClick("rent & resale")} className={`${filter === 'rent & resale' ? 'text-gold-500 text-sm md:text-base font-bold scale-105' : 'text-white/50 hover:text-white'} transition-all whitespace-nowrap shrink-0`}>Rent & Resale</button>
            </div>
          </div>
        </div>

        {/* Dynamic Empty State Popup Modal */}
        {filteredProperties.length === 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-[#1a1a1a] border border-gold-500/20 p-10 max-w-md w-full text-center shadow-2xl rounded-sm">
               <div className="text-gold-500 mb-6 flex justify-center text-4xl">✧</div>
               <h3 className="font-serif text-2xl text-white mb-4">No Matches Found</h3>
               <p className="text-white/60 text-sm leading-relaxed mb-8">
                 Sorry, we currently don't have any properties matching this information. We will add them soon. In the meantime, please check out our other properties.
               </p>
               <button 
                  onClick={() => {
                     setIsNoResultsModalOpen(false);
                     setFilter("all");
                     router.push('/properties');
                  }} 
                  className="w-full bg-gold-500 hover:bg-gold-600 text-black py-4 text-xs font-semibold tracking-widest uppercase transition-colors"
               >
                  Continue
               </button>
            </motion.div>
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
              <Link href={`/property-details?id=${property.id}`} className="block relative h-[400px] overflow-hidden">
                <div className="absolute top-6 left-6 z-10 bg-luxury-black/60 backdrop-blur-md px-3 py-1 text-[10px] tracking-widest uppercase text-white/80">
                The Skyline Collection
              </div>
              <div className="absolute top-6 right-6 z-10 text-[10px] tracking-widest uppercase text-white/50">
                0{idx + 1} / 0{filteredProperties.length}
              </div>
              <img src={(property as any).images && (property as any).images.length > 0 ? (property as any).images[0] : `/Shivay-group/image/${(property as any).imageFolder}/image1.jpg`} alt="Property Main" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex'; }} />
              <div style={{ display: 'none' }} className="absolute inset-0 w-full h-full bg-[#0e0e0e] flex-col items-center justify-center gap-3 select-none z-0">
                <span className="text-gold-500/40 text-[10px] tracking-[0.3em] uppercase">Shivay Group</span>
                <div className="w-8 h-px bg-gold-500/20" />
                <span className="text-white/20 text-[9px] tracking-widest uppercase">Image Unavailable</span>
              </div>
            </Link>
            
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
                
                <div className="flex justify-between items-center mt-8">
                    <Link href={`/property-details?id=${property.id}`} className="text-[10px] tracking-widest uppercase text-white hover:text-gold-500 transition-colors flex items-center gap-2">
                      View Dossier <span>↗</span>
                    </Link>
                    <div className="flex items-center gap-4">
                      <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.location || property.title)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-white/60 hover:text-gold-500 transition-colors group">
                        <span className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center group-hover:border-gold-500 transition-colors">⚲</span> Map
                      </a>
                      <a href={`https://wa.me/9265957050?text=I'm interested in ${property.title}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-[#25D366] hover:text-[#128C7E] transition-colors">
                        <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center">✆</span> WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
            </motion.div>
            </div>
          ))}
        </div>
        
        {/* Commercial & Plots Banners (Outside the Grid Loop) */}
        {(normalizedFilter === 'all' || normalizedFilter === 'commercial') &&
          allProperties.filter(p => p.type?.toLowerCase() === 'commercial').length === 0 && (
           <div className="mt-16 mb-4 w-full">
             <div className="flex items-center gap-6 mb-4">
               <h3 className="text-gold-500 font-serif text-3xl md:text-4xl">Commercial</h3>
               <div className="flex-grow h-[1px] bg-gradient-to-r from-gold-500/50 to-transparent"></div>
             </div>
             <p className="text-white/40 italic tracking-wider text-sm">Exquisite commercial spaces curated for distinction. We will introduce them soon.</p>
           </div>
        )}

        {(normalizedFilter === 'all' || normalizedFilter === 'plots') &&
          allProperties.filter(p => p.type?.toLowerCase() === 'plots').length === 0 && (
           <div className="mt-12 mb-4 border-b border-white/10 pb-4 w-full">
             <div className="flex items-center gap-4">
               <h3 className="text-gold-500 font-serif text-2xl">Plots</h3>
               <div className="h-px flex-1 bg-gradient-to-r from-gold-500/50 to-transparent"></div>
             </div>
             <p className="text-white/40 italic tracking-wider text-sm mt-4">Rare land parcels in landmark locations. We will introduce them soon.</p>
           </div>
        )}

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