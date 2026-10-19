"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import React from "react";
import { CheckCircle } from "lucide-react";

const MOCK_PROPERTIES: any[] = [
  { id: "1", title: "Rajam Villa", location: "Ankleshwar, Gujarat", type: "houses", area: "500 - 600 sq ft", beds: 3, price: "Contact for Price", badge: "Ready", description: "", amenities: [], images: [] },
  { id: "2", title: "Akshat bunglows", location: "Ankleshwar, Gujarat", type: "houses", area: "1000 - 1400 sq ft", beds: 3, price: "Contact for Price", badge: "Ready", description: "", amenities: [], images: [] },
  { id: "3", title: "Shreepad Township - 2", location: "Andada Village, Ankleshwar", type: "houses", area: "Not Mentioned", beds: 2, price: "Contact for Price", badge: "New", description: "", amenities: [], images: [] },
  { id: "4", title: "Ganesh Bliss", location: "GIDC, Ankleshwar", type: "apartments", area: "678–818 sq. ft.", beds: 2, price: "Contact for Price", badge: "Ready", description: "", amenities: [], images: [] },
];

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [publishProgress, setPublishProgress] = useState(0);
  const [images, setImages] = useState<string[]>(Array(12).fill(""));
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    title: "", price: "", location: "", type: "houses",
    area: "", beds: "", badge: "", description: "", amenities: "",
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const docRef = doc(db, "properties", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            title: data.title || "",
            price: data.price || "",
            location: data.location || "",
            type: data.type || "houses",
            area: data.area || "",
            beds: String(data.beds || ""),
            badge: data.badge || "",
            description: data.description || "",
            amenities: Array.isArray(data.amenities) ? data.amenities.join(", ") : (data.amenities || ""),
          });
          if (data.images && data.images.length > 0) {
            const filled = [...data.images, ...Array(12).fill("")].slice(0, 12);
            setImages(filled);
          }
        } else {
          // Fallback to mock
          const mock = MOCK_PROPERTIES.find((p) => p.id === id);
          if (mock) {
            setFormData({
              title: mock.title, price: mock.price, location: mock.location,
              type: mock.type, area: mock.area, beds: String(mock.beds),
              badge: mock.badge, description: mock.description || "",
              amenities: Array.isArray(mock.amenities) ? mock.amenities.join(", ") : "",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching property for edit:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingIndex(index);
    const cloudData = new FormData();
    cloudData.append("file", file);
    cloudData.append("upload_preset", "shivay_preset");
    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/qdhwnaig/image/upload", { method: "POST", body: cloudData });
      const data = await res.json();
      if (res.ok && data.secure_url) {
        setImages((prev) => { const n = [...prev]; n[index] = data.secure_url; return n; });
      } else {
        alert(`Cloudinary Error: ${data.error?.message || "Unknown error"}`);
      }
    } catch (error: any) {
      alert(`Network Error: ${error.message}`);
    } finally {
      setUploadingIndex(null);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
    setPublishProgress(0);
    setIsLive(false);
    const interval = setInterval(() => {
      setPublishProgress((prev) => (prev < 90 ? prev + 10 : prev));
    }, 250);
    try {
      const docRef = doc(db, "properties", id);
      await updateDoc(docRef, {
        ...formData,
        beds: parseInt(formData.beds) || 0,
        amenities: formData.amenities.split(",").map((item) => item.trim()),
        images: images.filter((url) => url !== ""),
      });
      clearInterval(interval);
      setPublishProgress(100);
      setIsLive(true);
      setTimeout(() => { router.push("/admin.panel"); }, 1500);
    } catch (error: any) {
      clearInterval(interval);
      setShowModal(false);
      setPublishProgress(0);
      setIsLive(false);
      alert(`Update Failed: ${error.message}`);
    }
  };

  if (loading) return <div className="text-white/50 p-8">Loading property data...</div>;

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-serif mb-2">Edit Property</h2>
      <p className="text-white/40 text-xs tracking-widest uppercase mb-8">ID: {id}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Images Grid */}
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
            <input required type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-gold-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Price</label>
            <input required type="text" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-gold-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Location</label>
            <input required type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-gold-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Type</label>
            <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-gold-500 focus:outline-none">
              <option value="houses">Houses</option>
              <option value="apartments">Apartments</option>
              <option value="penthouses">Penthouses</option>
              <option value="commercial">Commercial</option>
              <option value="plots">Plots</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Area (sq ft)</label>
            <input type="text" value={formData.area} onChange={(e) => setFormData({ ...formData, area: e.target.value })} className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-gold-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Bedrooms</label>
            <input type="number" value={formData.beds} onChange={(e) => setFormData({ ...formData, beds: e.target.value })} className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-gold-500 focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Badge (e.g. Private Release)</label>
          <input type="text" value={formData.badge} onChange={(e) => setFormData({ ...formData, badge: e.target.value })} className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-gold-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Description</label>
          <textarea rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-gold-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Amenities (comma separated)</label>
          <textarea rows={3} value={formData.amenities} onChange={(e) => setFormData({ ...formData, amenities: e.target.value })} className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-gold-500 focus:outline-none" />
        </div>

        <button disabled={showModal} type="submit" className="bg-gold-500 hover:bg-gold-600 text-black px-8 py-4 text-xs font-semibold tracking-wider uppercase transition-colors rounded-sm disabled:opacity-50">
          Save Changes
        </button>
      </form>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-luxury-black border border-white/10 p-12 max-w-sm w-full shadow-2xl flex flex-col items-center">
            {isLive ? (
              <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                <CheckCircle className="w-16 h-16 text-gold-500 mb-6" />
                <h3 className="text-xl font-serif text-white mb-2 tracking-widest uppercase">Changes Saved</h3>
                <p className="text-sm text-white/50 text-center">Property has been successfully updated.</p>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center">
                <div className="text-gold-500 text-3xl font-serif mb-8">{publishProgress}%</div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-6">
                  <div className="h-full bg-gold-500 transition-all duration-300 ease-out" style={{ width: `${publishProgress}%` }} />
                </div>
                <p className="text-xs text-white/50 tracking-widest uppercase animate-pulse">Saving to Network...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}