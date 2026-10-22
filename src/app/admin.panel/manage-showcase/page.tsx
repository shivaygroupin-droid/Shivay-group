"use client";
import { useState, useEffect } from "react";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function ManageShowcasePage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchShowcaseProperties = async () => {
      try {
        const snapshot = await getDocs(collection(db, "properties"));
        const showcaseList = snapshot.docs
          .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
          .filter((item: any) => item.listingType === "showcase");
        setProperties(showcaseList);
      } catch (error) {
        console.error("Error fetching showcase properties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShowcaseProperties();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, "properties", deleteTarget.id));
      setProperties(prev => prev.filter(p => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert("Failed to delete property.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-serif text-3xl text-gold-500 mb-2">Showcase Portfolio Management</h1>
          <p className="text-white/50 text-sm">Manage published showcase listings</p>
        </div>
        <Link href="/admin.panel/add-showcase" className="bg-gold-500 text-black px-6 py-3 text-xs font-semibold tracking-wider uppercase rounded-sm hover:bg-gold-600 transition-colors">
          + Add Showcase
        </Link>
      </div>
      
      {loading ? (
        <div className="text-white/50 animate-pulse">Loading properties...</div>
      ) : properties.length === 0 ? (
        <div className="border border-white/5 bg-white/5 p-8 text-center text-white/50 rounded">
          No showcase properties uploaded yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {properties.map((prop) => (
            <div key={prop.id} className="bg-black/50 border border-white/5 overflow-hidden rounded group hover:border-gold-500/50 transition-colors">
              <div className="h-48 relative overflow-hidden bg-[#111]">
                 <img src={prop.images?.[0] || "/placeholder.jpg"} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                 <div className="absolute top-4 left-4 bg-black/80 px-2 py-1 text-[10px] text-gold-500 uppercase tracking-widest rounded border border-gold-500/30">
                   {prop.type}
                 </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl text-white font-serif mb-1">{prop.title}</h3>
                <p className="text-white/50 text-xs mb-4">{prop.location}</p>
                <div className="flex gap-4">
                  <Link href={`/admin.panel/edit?id=${prop.id}`} className="flex-1 text-center bg-white/10 hover:bg-white/20 text-white text-xs tracking-widest uppercase py-2 rounded transition-colors">
                    Edit
                  </Link>
                  <button onClick={() => setDeleteTarget(prop)} className="flex-1 text-center bg-red-900/50 hover:bg-red-900 text-red-200 text-xs tracking-widest uppercase py-2 rounded border border-red-500/30 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {deleteTarget && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-[#111] border border-red-900/50 p-6 rounded max-w-sm w-full">
              <h3 className="text-white font-serif text-xl mb-2">Delete Property?</h3>
              <p className="text-white/50 text-sm mb-6">Are you sure you want to permanently delete "{deleteTarget.title}"? This action cannot be undone.</p>
              <div className="flex gap-4">
                <button onClick={() => setDeleteTarget(null)} disabled={deleting} className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 text-xs tracking-widest uppercase rounded transition-colors disabled:opacity-50">
                  Cancel
                </button>
                <button onClick={handleDelete} disabled={deleting} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 text-xs tracking-widest uppercase rounded transition-colors disabled:opacity-50">
                  {deleting ? 'Deleting...' : 'Confirm Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}