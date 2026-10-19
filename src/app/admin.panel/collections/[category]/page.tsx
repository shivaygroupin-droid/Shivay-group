"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import React from "react";
export const runtime = 'edge';

const MOCK_PROPERTIES: any[] = [
  { id: "1", title: "Rajam Villa", location: "Ankleshwar, Gujarat", type: "houses", price: "Contact for Price", badge: "Ready", images: [], imageFolder: "rajam_villa" },
  { id: "2", title: "Akshat bunglows", location: "Ankleshwar, Gujarat", type: "houses", price: "Contact for Price", badge: "Ready", images: [], imageFolder: "akshat" },
  { id: "3", title: "Shreepad Township - 2", location: "Andada Village, Ankleshwar", type: "houses", price: "Contact for Price", badge: "New", images: [], imageFolder: "shreepad" },
  { id: "4", title: "Ganesh Bliss", location: "GIDC, Ankleshwar", type: "apartments", price: "Contact for Price", badge: "Ready", images: [], imageFolder: "ganesh_bliss" },
];

export default function CollectionPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = React.use(params);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const snapshot = await getDocs(collection(db, "properties"));
        const firestoreProperties = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as any[];
        const mockIds = new Set(MOCK_PROPERTIES.map((p) => p.id));
        const uniqueFirestore = firestoreProperties.filter((p) => !mockIds.has(p.id));
        const all = [...MOCK_PROPERTIES, ...uniqueFirestore];
        setProperties(all.filter((p) => p.type?.toLowerCase() === category.toLowerCase()));
      } catch (error) {
        console.error("Error fetching:", error);
        setProperties(MOCK_PROPERTIES.filter((p) => p.type?.toLowerCase() === category.toLowerCase()));
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [category]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, "properties", deleteTarget.id));
      setProperties((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (error) {
      console.error("Error deleting property:", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      {/* Premium Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4" onClick={() => setDeleteTarget(null)}>
          <div className="bg-[#0e0e0e] border border-white/10 w-full max-w-sm shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Property Preview */}
            <div className="h-44 bg-luxury-gray relative overflow-hidden">
              {deleteTarget.images && deleteTarget.images.length > 0 ? (
                <img src={deleteTarget.images[0]} alt={deleteTarget.title} className="w-full h-full object-cover opacity-70" />
              ) : deleteTarget.imageFolder ? (
                <img src={`/image/${deleteTarget.imageFolder}/image1.jpg`} alt={deleteTarget.title} className="w-full h-full object-cover opacity-70" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-black/60">
                  <span className="text-gold-500/40 text-[10px] tracking-widest uppercase">Shivay Group</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <p className="text-gold-500 text-[9px] tracking-widest uppercase mb-1">{deleteTarget.type}</p>
                <h3 className="font-serif text-white text-xl">{deleteTarget.title}</h3>
                <p className="text-white/50 text-xs">{deleteTarget.location}</p>
              </div>
            </div>
            {/* Confirmation Text */}
            <div className="p-8">
              <p className="text-[10px] tracking-[0.2em] uppercase text-red-400/80 mb-3">Permanent Action</p>
              <h2 className="font-serif text-2xl text-white mb-2">Remove this listing?</h2>
              <p className="text-white/40 text-sm leading-relaxed mb-8">This will permanently delete <span className="text-white/70 font-medium">{deleteTarget.title}</span> from the Firestore database. This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 text-xs font-semibold tracking-widest uppercase transition-colors disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Yes, Delete"}
                </button>
                <button
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                  className="flex-1 border border-white/20 hover:border-white/40 text-white/70 hover:text-white py-3 text-xs tracking-widest uppercase transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/admin.panel" className="text-white/40 text-xs tracking-widest uppercase hover:text-white mb-2 inline-block">← Back to Collections</Link>
          <h2 className="text-2xl font-serif capitalize">{category === "houses" ? "New Houses" : category}</h2>
        </div>
        <Link href="/admin.panel/add" className="bg-gold-500 hover:bg-gold-600 text-black px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-colors rounded-sm">
          + Add New Property
        </Link>
      </div>

      {loading ? (
        <p className="text-white/50">Loading properties...</p>
      ) : properties.length === 0 ? (
        <div className="py-20 text-center border border-white/10 bg-black/20">
          <p className="text-gold-500 font-serif text-2xl mb-2">No Properties Yet</p>
          <p className="text-white/40 text-sm tracking-widest uppercase">Add your first property to this collection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((prop) => (
            <div key={prop.id} className="group bg-black/30 border border-white/10 hover:border-white/20 transition-colors rounded-sm overflow-hidden">
              <Link href={`/admin.panel/edit/${prop.id}`} className="block">
                <div className="h-48 bg-luxury-gray relative overflow-hidden">
                  {prop.images && prop.images.length > 0 ? (
                    <img src={prop.images[0]} alt={prop.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : prop.imageFolder ? (
                    <img src={`/image/${prop.imageFolder}/image1.jpg`} alt={prop.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-[#0e0e0e]">
                      <span className="text-gold-500/40 text-[9px] tracking-widest uppercase">Shivay Group</span>
                      <div className="w-6 h-px bg-gold-500/20" />
                      <span className="text-white/20 text-[8px] tracking-widest uppercase">No Image</span>
                    </div>
                  )}
                  <span className="absolute top-3 right-3 bg-luxury-black/80 text-gold-500 text-[9px] tracking-widest uppercase px-2 py-1">{prop.badge}</span>
                </div>
                <div className="p-5 pb-3">
                  <p className="text-gold-500 text-[9px] tracking-widest uppercase mb-1">{prop.type}</p>
                  <h3 className="font-serif text-lg mb-1">{prop.title}</h3>
                  <p className="text-white/50 text-xs mb-3">{prop.location}</p>
                  <div className="flex justify-between items-center border-t border-white/10 pt-3">
                    <p className="text-gold-400 text-sm">{prop.price}</p>
                  </div>
                </div>
              </Link>
              {/* Action Row */}
              <div className="flex border-t border-white/5">
                <Link href={`/admin.panel/edit/${prop.id}`} className="flex-1 py-3 text-center text-[9px] tracking-widest uppercase text-gold-500 hover:text-gold-400 hover:bg-white/5 transition-colors">
                  Edit
                </Link>
                <div className="w-px bg-white/5" />
                <button
                  onClick={() => setDeleteTarget(prop)}
                  className="flex-1 py-3 text-center text-[9px] tracking-widest uppercase text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}