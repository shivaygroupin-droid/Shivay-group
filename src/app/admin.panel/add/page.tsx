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
  
  // Naye Cloudinary States
  const [images, setImages] = useState<string[]>(Array(12).fill(''));
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

 const [formData, setFormData] = useState({
    listingType: "standard",
    title: "",
    price: "",
    location: "",
    type: "houses",
    area: "",
    configuration: "1 BHK",
    beds: "",
    badge: "",
    description: "",
    amenities: "",
    mapEmbed: ""
  });

  

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
        listingType: formData.listingType,
        beds: parseInt(formData.beds) || 0,
        amenities: formData.amenities.split(/[,\n]+/).map(item => item.trim()).filter(Boolean),
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

  {/* Listing Type Toggle */}
        <div className="mb-6 bg-white/5 p-4 rounded border border-white/10">
          <label className="block text-gold-500 text-xs tracking-widest uppercase mb-3">Upload Destination</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-white/80 text-sm cursor-pointer">
              <input type="radio" name="listingType" value="standard" checked={formData.listingType === "standard"} onChange={(e) => setFormData({ ...formData, listingType: e.target.value })} className="accent-gold-500" />
              Standard Property Page
            </label>
            <label className="flex items-center gap-2 text-white/80 text-sm cursor-pointer">
              <input type="radio" name="listingType" value="showcase" checked={formData.listingType === "showcase"} onChange={(e) => setFormData({ ...formData, listingType: e.target.value })} className="accent-gold-500" />
              Showcase Page Only
            </label>
          </div>
        </div>

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-serif mb-8">Add New Property</h2>


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
            <select value={formData.type} onChange={e => {
                let newConfig = "";
                if(e.target.value === 'houses' || e.target.value === 'apartments') newConfig = "1 BHK";
                else if(e.target.value === 'commercial') newConfig = "Office Space";
                else if(e.target.value === 'plots') newConfig = "0 - 500 sq. ft.";
                else if(e.target.value === 'rent & resale') newConfig = "House";
                setFormData({...formData, type: e.target.value, configuration: newConfig, beds: ""});
              }} className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-gold-500 focus:outline-none">
              <option value="houses">Houses</option>
              <option value="apartments">Apartments</option>
              <option value="commercial">Commercial</option>
              <option value="plots">Plots</option>
              <option value="rent & resale">Rent & Resale</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Configuration</label>
            <select value={formData.configuration} onChange={e => setFormData({...formData, configuration: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-gold-500 focus:outline-none">
                {(formData.type === 'houses' || formData.type === 'apartments') && (
                  <>
                    <option value="1 BHK">1 BHK</option>
                    <option value="2 BHK">2 BHK</option>
                    <option value="3 BHK">3 BHK</option>
                    <option value="4 BHK">4 BHK</option>
                    <option value="5+ BHK">5+ BHK</option>
                  </>
                )}
                {formData.type === 'commercial' && (
                  <>
                    <option value="Office Space">Office Space</option>
                    <option value="Retail Shop / Showroom">Retail Shop / Showroom</option>
                    <option value="Commercial Complex">Commercial Complex</option>
                  </>
                )}
                {formData.type === 'plots' && (
                  <>
                    <option value="0 - 500 sq. ft.">0 - 500 sq. ft.</option>
                    <option value="500 - 1,000 sq. ft.">500 - 1,000 sq. ft.</option>
                    <option value="1000 - 10000 sq. ft.">1000 - 10000 sq. ft.</option>
                    <option value="10000 - 100000+ sq. ft.">10000 - 100000+ sq. ft.</option>
                  </>
                )}
                {formData.type === 'rent & resale' && (
                  <>
                    <option value="House">House</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Plot">Plot</option>
                  </>
                )}
            </select>
          </div>
          <div>
             <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Area (sq ft)</label>
             <input type="text" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-gold-500 focus:outline-none" />
          </div>
          {formData.type !== 'plots' && formData.type !== 'commercial' && (
            <div>
               <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Bedrooms</label>
               <input type="number" value={formData.beds} onChange={e => setFormData({...formData, beds: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-gold-500 focus:outline-none" />
            </div>
          )}
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

        <div>
           <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Google Maps Embed URL</label>
           <textarea rows={2} value={formData.mapEmbed} onChange={e => setFormData({...formData, mapEmbed: e.target.value})} placeholder="Paste Google Maps <iframe> code here for EXACT pin" className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-gold-500 focus:outline-none mb-1"></textarea>
           <p className="text-[10px] text-white/40 tracking-wider">Note: For EXACT red pin, go to Google Maps {'>'} Share {'>'} 'Embed a map' {'>'} Copy HTML and paste here. Simple links will only show the general area.</p>
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

