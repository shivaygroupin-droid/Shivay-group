"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function FounderPage() {
  return (
    <div className="min-h-screen bg-luxury-black pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase text-white/50 hover:text-gold-500 transition-colors mb-12">
          <span>←</span> Return to Home
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left Column: Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative h-[600px] w-full bg-luxury-gray border border-white/10"
          >
            {/* Actual Founder Image */}
            <img 
              src="/Shivay-group/image/Kuldeep%20Dhameliya.jpg" 
              alt="Kuldeep Dhameliya" 
              className="w-full h-full object-contain object-center transition-all duration-700" 
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent"></div>
          </motion.div>

          {/* Right Column: Bio */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-gold-500 tracking-[0.2em] text-[10px] uppercase mb-4">Shivay Group / Leadership</p>
            <h1 className="font-serif text-5xl md:text-6xl text-white mb-2">Kuldeep Dhameliya</h1>
            <p className="italic text-white/50 text-lg mb-10">Founder & Real Estate Professional</p>

            <div className="space-y-6 text-white/70 text-sm leading-relaxed mb-12">
              <p>
                Kuldeep Dhameliya is a dedicated real estate professional with a strong vision for delivering excellence and building lasting relationships in the property market. A Civil Engineering graduate from the 2017 batch, he brings valuable technical knowledge and a practical understanding of the real estate industry.
              </p>
              <p>
                Having grown up in Bhavnagar, he has a deep-rooted connection with the region and its evolving property landscape. He entered the real estate sector in 2018 and has since built a remarkable journey based on trust, transparency, and client satisfaction. Over the years, he has facilitated deals involving more than 1,000 properties, helping clients find the right opportunities for their needs and investments.
              </p>
              <p>
                With a cumulative business volume exceeding ₹100 crore, his achievements reflect his dedication, market expertise, and commitment to delivering results. Today, Kuldeep continues to focus on creating valuable real estate opportunities, strengthening client relationships, and building a trusted name in the industry.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-8">
              <div>
                <p className="text-gold-500 font-serif text-3xl mb-1">2017</p>
                <p className="text-[10px] tracking-widest uppercase text-white/40">Civil Engineering</p>
              </div>
              <div>
                <p className="text-gold-500 font-serif text-3xl mb-1">1,000+</p>
                <p className="text-[10px] tracking-widest uppercase text-white/40">Properties Facilitated</p>
              </div>
              <div>
                <p className="text-gold-500 font-serif text-3xl mb-1">2018</p>
                <p className="text-[10px] tracking-widest uppercase text-white/40">Journey Began</p>
              </div>
              <div>
                <p className="text-gold-500 font-serif text-3xl mb-1">₹100 Cr+</p>
                <p className="text-[10px] tracking-widest uppercase text-white/40">Cumulative Volume</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}