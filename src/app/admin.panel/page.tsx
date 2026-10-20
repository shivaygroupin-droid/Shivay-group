"use client";

import { useEffect, useState, Suspense } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  type: string;
}

function DashboardContent() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

 const fetchProperties = async () => {
    const MOCK_PROPERTIES = [
      { id: "1", title: "Rajam Villa", location: "Ankleshwar, Gujarat", type: "houses", area: "500 - 600 sq ft", beds: 3, price: "Contact for Price", badge: "Ready" },
      { id: "2", title: "Akshat bunglows", location: "Ankleshwar, Gujarat", type: "houses", area: "1000 - 1400 sq ft", beds: 3, price: "Contact for Price", badge: "Ready" },
      { id: "3", title: "Shreepad Township - 2", location: "Andada Village, Ankleshwar", type: "houses", area: "Not Mentioned", beds: 2, price: "Contact for Price", badge: "New" },
      { id: "4", title: "Ganesh Bliss", location: "GIDC, Ankleshwar", type: "apartments", area: "678–818 sq. ft.", beds: 2, price: "Contact for Price", badge: "Ready" }
    ];
    try {
      const snapshot = await getDocs(collection(db, "properties"));
      const firestoreProperties = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as any[];
      const mockIds = new Set(MOCK_PROPERTIES.map((p) => p.id));
      const uniqueFirestore = firestoreProperties.filter((p) => !mockIds.has(p.id));
      setProperties([...MOCK_PROPERTIES, ...uniqueFirestore] as any);
      setErrorMsg("");
    } catch (error: any) {
      console.error("Error fetching properties:", error);
      setErrorMsg(error.message || "Failed to fetch properties.");
      setProperties(MOCK_PROPERTIES as any);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this property?")) {
      try {
        await deleteDoc(doc(db, "properties", id));
        setProperties(properties.filter((p) => p.id !== id));
      } catch (error) {
        console.error("Error deleting property:", error);
      }
    }
  };

  const filteredProperties = categoryParam
    ? properties.filter((p) => p.type.toLowerCase() === categoryParam.toLowerCase())
    : properties;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-serif">Property Collections</h2>
        <Link
          href="/admin.panel/add"
          className="bg-gold-500 hover:bg-gold-600 text-black px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-colors rounded-sm"
        >
          + Add New Property
        </Link>
     </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { name: 'New Houses', img: '/Shivay-group/image/new-houses.jpg', link: 'houses' },
          { name: 'Apartments', img: '/Shivay-group/image/apartments.jpg', link: 'apartments' },
          { name: 'Commercial', img: '/Shivay-group/image/commercial.jpg', link: 'commercial' },
          { name: 'Plots', img: '/Shivay-group/image/plots.jpg', link: 'plots' }
        ].map((col) => (
          <Link
            href={`/admin.panel/collections/${col.link}`}
            key={col.name}
            className="group relative h-96 block overflow-hidden bg-luxury-gray rounded-sm"
          >
            <Image 
              src={col.img} 
              alt={col.name} 
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/95 via-luxury-black/20 to-transparent z-10" />
            <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
              <p className="text-[10px] tracking-widest uppercase text-gold-500 mb-2">Collection</p>
              <h3 className="font-serif text-2xl mb-1 group-hover:text-gold-400 transition-colors text-white">{col.name}</h3>
              <div className="flex justify-between items-center">
                <p className="text-xs text-white/50">Explore collection</p>
                <span className="text-gold-500 group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div className="text-white/50 p-8">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}