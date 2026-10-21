"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from 'next/link';
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    import('firebase/auth').then(({ onAuthStateChanged }) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setIsAdmin(!!user);
        setLoading(false);
      });
      return () => unsubscribe();
    });
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-luxury-black flex items-center justify-center text-gold-500">Authenticating...</div>;
  }

  if (!isAdmin) {
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const id = (e.currentTarget.elements.namedItem('id') as HTMLInputElement).value;
      const pwd = (e.currentTarget.elements.namedItem('pwd') as HTMLInputElement).value;
      
      try {
        const { signInWithEmailAndPassword } = await import('firebase/auth');
        // ID ko automatically email format mein convert kar denge
        const email = `${id.toLowerCase()}@admin.com`;
        
        // Pura verification seedha Firebase par hoga, code mein koi password nahi
        await signInWithEmailAndPassword(auth, email, pwd);
      } catch (error) {
        alert("Invalid Admin ID or Password. Server Verification Failed.");
      }
    };

    return (
      <div className="min-h-screen bg-luxury-black flex flex-col items-center justify-center text-white p-6">
        <form onSubmit={handleLogin} className="bg-zinc-900 p-8 border border-white/10 flex flex-col gap-5 w-full max-w-sm shadow-2xl">
          <h1 className="text-2xl font-serif text-gold-500 mb-2 text-center">ADMIN LOGIN</h1>
          <input name="id" type="text" placeholder="Admin ID" required className="bg-black border border-white/20 p-3 text-white focus:border-gold-500 outline-none text-sm tracking-widest" />
          <input name="pwd" type="password" placeholder="Password" required className="bg-black border border-white/20 p-3 text-white focus:border-gold-500 outline-none text-sm tracking-widest" />
          <button type="submit" className="bg-gold-500 text-black font-bold p-3 mt-2 hover:bg-gold-400 transition-colors uppercase tracking-widest text-sm">Secure Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Admin Header */}
      <header className="bg-black border-b border-white/10 p-6 flex justify-between items-center">
        <h1 className="font-serif tracking-widest text-gold-500">SHIVAY <span className="text-white/50 text-sm">ADMIN PANEL</span></h1>
        <button onClick={async () => { await auth.signOut(); setIsAdmin(false); }} className="text-xs text-red-400 hover:text-red-300 transition-colors uppercase tracking-widest">Sign Out</button>
      </header>
      
      <div className="flex">
        {/* Admin Sidebar */}
        <aside className="w-56 min-h-[calc(100vh-80px)] bg-black/50 border-r border-white/5 p-6 flex flex-col justify-between">
          <nav className="flex flex-col gap-4 text-sm tracking-wider">
            <Link href="/admin.panel" className="text-white/70 hover:text-gold-500 transition-colors">Dashboard</Link>
            <Link href="/admin.panel/add" className="text-white/70 hover:text-gold-500 transition-colors">Add Property</Link>
            <Link href="/admin.panel/add-showcase" className="text-white/70 hover:text-gold-500 transition-colors">Add Showcase</Link>
            <Link href="/admin.panel/manage-showcase" className="text-white/70 hover:text-gold-500 transition-colors">Manage Showcase</Link>
          </nav>
          
          <nav className="mt-auto">
            <Link href="/" className="text-gold-500 hover:text-gold-400 text-sm tracking-widest uppercase transition-colors flex items-center gap-2">
              ← Visit Landing Page
            </Link>
          </nav>
        </aside>
        
        {/* Admin Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
