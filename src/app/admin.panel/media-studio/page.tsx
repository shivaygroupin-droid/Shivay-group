"use client";
import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function MediaStudioPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [propertyId, setPropertyId] = useState("all");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchData = async () => {
    try {
      const pSnap = await getDocs(collection(db, "properties"));
      setProperties(pSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      
      const mSnap = await getDocs(collection(db, "media"));
      setMediaList(mSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error("Error fetching data", e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatUrl = (url: string) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.split("v=")[1]?.split("&")[0] || url.split("youtu.be/")[1] || url.split("shorts/")[1];
      if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&modestbranding=1`;
    }
    if (url.includes("instagram.com")) {
      const cleanUrl = url.split("?")[0].replace(/\/$/, "");
      return `${cleanUrl}/embed`;
    }
    return url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const finalUrl = formatUrl(videoUrl);
      if (editingId) {
        await updateDoc(doc(db, "media", editingId), {
          title, videoUrl: finalUrl, propertyId, updatedAt: serverTimestamp()
        });
        setMsg("Media successfully updated!");
      } else {
        await addDoc(collection(db, "media"), {
          title, videoUrl: finalUrl, propertyId, createdAt: serverTimestamp()
        });
        setMsg("Media successfully added!");
      }
      setTitle(""); setVideoUrl(""); setPropertyId("all"); setEditingId(null);
      fetchData();
    } catch (error) {
      setMsg("Failed to save media.");
    }
    setLoading(false);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setTitle(item.title);
    setVideoUrl(item.videoUrl);
    setPropertyId(item.propertyId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to permanently delete this media?")) {
      try {
        await deleteDoc(doc(db, "media", id));
        fetchData();
      } catch (e) {
        console.error("Error deleting media", e);
      }
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl text-white font-serif mb-6">Media & Shorts Studio</h1>
      
      {msg && <div className="mb-4 p-3 bg-white/10 text-gold-500 rounded">{msg}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-black/30 p-6 border border-white/5 rounded-sm">
        <div>
          <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Video Title</label>
          <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-black/50 border border-white/10 text-white p-3 rounded-sm" placeholder="e.g. Rajam Villa Tour" />
        </div>
        
        <div>
          <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Video Link (YouTube/Instagram)</label>
          <input required type="url" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="w-full bg-black/50 border border-white/10 text-white p-3 rounded-sm" placeholder="Paste link here..." />
        </div>
        
        <div>
          <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Linked Property</label>
          <select value={propertyId} onChange={e => setPropertyId(e.target.value)} className="w-full bg-black/50 border border-white/10 text-white p-3 rounded-sm appearance-none">
            <option value="all">All Residences / General Viewing</option>
            {properties.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <button disabled={loading} type="submit" className="flex-1 bg-gold-500 text-black py-4 text-xs uppercase tracking-widest font-semibold rounded-sm hover:bg-gold-600 transition-colors">
            {loading ? "Saving..." : editingId ? "Update Media" : "Add Media"}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setTitle(""); setVideoUrl(""); setPropertyId("all"); }} className="flex-1 bg-white/10 text-white py-4 text-xs uppercase tracking-widest font-semibold rounded-sm hover:bg-white/20 transition-colors">
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Media Grid Section */}
      <h2 className="text-xl text-white font-serif mt-16 mb-6">Uploaded Media</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mediaList.map((item) => (
          <div key={item.id} className="bg-black/30 border border-white/10 rounded-sm overflow-hidden flex flex-col">
            <div className="aspect-[9/16] relative bg-luxury-gray">
              <iframe className="w-full h-full object-cover pointer-events-none" src={item.videoUrl} title={item.title}></iframe>
            </div>
            <div className="p-4 flex flex-col gap-1 border-t border-white/5">
              <h3 className="text-white text-sm font-semibold truncate">{item.title}</h3>
              <p className="text-white/50 text-[10px] uppercase tracking-widest">{item.propertyId === 'all' ? 'All Residences' : properties.find(p=>p.id===item.propertyId)?.title || 'Linked'}</p>
            </div>
            <div className="flex border-t border-white/5 mt-auto">
              <button onClick={() => handleEdit(item)} className="flex-1 py-3 text-[10px] tracking-widest uppercase text-gold-500 hover:bg-white/5 transition-colors">Edit</button>
              <div className="w-px bg-white/5" />
              <button onClick={() => handleDelete(item.id)} className="flex-1 py-3 text-[10px] tracking-widest uppercase text-red-400 hover:bg-red-500/5 transition-colors">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}