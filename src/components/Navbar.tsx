"use client";
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin.panel');

  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [status, setStatus] = useState('');

  if (isAdminRoute) return null;

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    if (!name || !phone) { setStatus('error'); return; }
    setStatus('submitting');
    
    const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSek653hfcwcbdKU7vGx6gVBCcGeQMOqL7lV5yllD8T8IektPA/formResponse";
    const params = new URLSearchParams();
    params.append("entry.2005620554", name);
    params.append("entry.1166974658", phone);
    if (visitDate) params.append("entry.839337160", visitDate);

    try {
      await fetch(GOOGLE_FORM_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params
      });
      setStatus('success');
      setName(''); setPhone(''); setVisitDate('');
      setTimeout(() => { setStatus(''); setIsTourModalOpen(false); }, 3000);
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <>
    <header className="fixed top-8 left-0 w-full z-50 px-6 flex justify-center">
      <div className="w-full max-w-7xl h-16 bg-luxury-black/50 backdrop-blur-md border border-white/10 flex items-center justify-between px-4 pointer-events-auto">
        <div className="flex items-center gap-4">
          <div className="border border-white/20 p-1.5 flex items-center justify-center">
            <span className="font-serif text-[10px] text-white/70">SG</span>
          </div>
          <Link href="/" className="flex flex-col">
            <span className="font-serif text-xl tracking-widest text-gold-500">SHIVAY GROUP</span>
           <span className="text-[9px] tracking-[0.3em] text-white/50 uppercase">Private Estates</span>
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-8 text-xs tracking-widest uppercase text-white/70 pointer-events-auto">
          <Link href="/properties" className="hover:text-gold-500 transition-colors">Collection</Link>
          <Link href="/showcase" className="hover:text-gold-500 transition-colors">Showcase</Link>
          <Link href="/#our-believe" className="hover:text-gold-500 transition-colors">Our Believe</Link>
          <Link href="/#contact" className="hover:text-gold-500 transition-colors">Contact us</Link>
        </nav>

        <div className="flex items-center gap-6 pointer-events-auto">
          <span className="hidden lg:block text-xs text-white/50 tracking-widest">₹ INR</span>
          <button onClick={() => setIsTourModalOpen(true)} className="hidden lg:flex items-center gap-2 border border-white/20 px-6 py-2 text-xs tracking-widest uppercase hover:bg-white/5 transition-colors pointer-events-auto">
            Request Private Tour <span className="text-gold-500">↗</span>
          </button>
          <button onClick={() => setIsMobileMenuOpen(prev => !prev)} className="lg:hidden p-2 border border-white/20 hover:bg-white/5 transition-colors flex items-center justify-center pointer-events-auto relative z-[60]">
            {isMobileMenuOpen ? <X className="w-5 h-5 text-white/70" /> : <Menu className="w-5 h-5 text-white/70" />}
          </button>
       </div>
      </div>
    </header>

      {/* Mobile Menu Overlay - Moved OUTSIDE header */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed top-24 left-6 right-6 bg-luxury-black/50 backdrop-blur-md border border-white/10 p-6 flex flex-col gap-6 z-[100] shadow-2xl">
           <Link href="/properties" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm tracking-widest uppercase text-white/70 hover:text-gold-500 transition-all duration-300 hover:-translate-y-0.5">Collection</Link>
           <Link href="/showcase" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm tracking-widest uppercase text-white/70 hover:text-gold-500 transition-all duration-300 hover:-translate-y-0.5">Showcase</Link>
           <Link href="/#our-believe" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm tracking-widest uppercase text-white/70 hover:text-gold-500 transition-all duration-300 hover:-translate-y-0.5">Our Believe</Link>
           <Link href="/#contact" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm tracking-widest uppercase text-white/70 hover:text-gold-500 transition-all duration-300 hover:-translate-y-0.5">Contact us</Link>
           <button onClick={() => { setIsMobileMenuOpen(false); setIsTourModalOpen(true); }} className="mt-4 border border-white/20 p-4 text-sm tracking-widest uppercase text-white/70 hover:text-gold-500 hover:border-gold-500 hover:shadow-[0_0_15px_rgba(218,165,32,0.4)] flex justify-between items-center w-full transition-all duration-300 hover:-translate-y-1">
             REQUEST PRIVATE TOUR <span>↗</span>
           </button>
        </div>
      )}

      {isTourModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 pointer-events-auto" onClick={() => setIsTourModalOpen(false)}>
          <div className="bg-[#f9f7f1] w-full max-w-md p-10 relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-6 right-6 text-black/50 hover:text-black text-2xl" onClick={() => setIsTourModalOpen(false)}>&times;</button>
            <p className="text-[#a63732] text-[10px] tracking-widest uppercase mb-4 font-bold">Private Viewing</p>
            <h2 className="font-serif text-4xl text-black mb-8 leading-tight">Let's find a time<br/><span className="italic text-[#d0b48f]">that works for you.</span></h2>
            {status === 'success' ? (
              <div className="text-center py-10 text-green-700 font-bold">Thank you! Your visit request has been received.</div>
            ) : (
              <form className="flex flex-col gap-6" onSubmit={handleFormSubmit}>
                <input type="text" placeholder="Your name" required value={name} onChange={(e) => setName(e.target.value)} className="w-full border-b border-black/20 bg-transparent py-3 text-black placeholder:text-black/40 focus:outline-none focus:border-[#a63732] transition-colors" />
                <input type="tel" placeholder="Phone number" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border-b border-black/20 bg-transparent py-3 text-black placeholder:text-black/40 focus:outline-none focus:border-[#a63732] transition-colors" />
                <input type="date" placeholder="Visit Date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} className="w-full border-b border-black/20 bg-transparent py-3 text-black placeholder:text-black/40 focus:outline-none focus:border-[#a63732] transition-colors" />
                {status === 'error' && <div className="bg-[#f5e6e6] text-[#a63732] text-xs p-4 mt-2">Please enter your name and phone number.</div>}
                <button disabled={status === 'submitting'} type="submit" className="w-full bg-[#bd403a] hover:bg-[#a63732] text-white py-4 text-sm font-medium transition-colors flex justify-center items-center gap-2 mt-4 disabled:opacity-50">
                  {status === 'submitting' ? 'Submitting...' : 'Request my visit'} <span className="text-lg leading-none">↗</span>
                </button>
              </form>
            )}
            <p className="text-center text-black/40 text-[10px] mt-6">We'll call you within one business day.</p>
          </div>
        </div>
      )}
    </>
  );
}