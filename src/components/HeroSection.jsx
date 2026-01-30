import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Wind, Leaf } from 'lucide-react';

const HeroSection = ({ onContactClick }) => {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden py-24 gap-12">
      {/* Background Gradient/Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00ffcc] opacity-10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 max-w-5xl"
      >
        <div className="inline-block mb-4 px-4 py-1 rounded-full border border-[var(--color-primary)] text-[var(--color-primary)] text-sm font-semibold tracking-wider uppercase bg-opacity-20 bg-[#00ffcc22]">
          Building Integrated Photovoltaics (BIPV) Systems
        </div>
        
        <h1 className="text-4xl md:text-7xl font-extrabold mb-6 leading-tight">
          Advanced Luminescent <br />
          <span className="text-gradient">Solar Concentrator Glazing</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-[var(--text-muted)] mb-10 max-w-3xl mx-auto h-relaxed">
          <span className="text-white font-semibold">Lumicore</span> engineers high-performance optical interfaces that convert agricultural biomass into scalable, energy-generating architectural glass, minimizing embodied carbon while maximizing operational efficiency.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <a href="#technology" className="px-8 py-4 bg-[#00ffcc] text-black text-lg font-bold rounded-xl shadow-[0_0_20px_rgba(0,255,204,0.4)] hover:shadow-[0_0_40px_rgba(0,255,204,0.6)] hover:scale-105 transition-all cursor-pointer">
            View Technical Specs
          </a>
          <button 
            onClick={onContactClick}
            className="px-8 py-4 border border-white/20 text-white text-lg font-bold rounded-xl hover:bg-white/10 transition-all backdrop-blur-md cursor-pointer"
          >
            LCCA Model Request
          </button>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="hidden md:block absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
      >
        <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest">System Architecture</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 13l5 5 5-5M7 6l5 5 5-5"/></svg>
        </div>
      </motion.div>

      {/* Stats/Floating Cards */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="relative w-full max-w-5xl px-4 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <StatCard icon={Leaf} title="Feedstock Optimization" value="100% Upcycled Biomass" color="text-green-400" />
        <StatCard icon={Sun} title="Optical Transmittance" value="~80% VLT" color="text-yellow-400" />
        <StatCard icon={Wind} title="Carbon Abatement" value="2.4 Tons/Year" color="text-blue-400" />
      </motion.div>
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value, color }) => (
  <div className="glass-panel p-6 flex items-center gap-4 hover:bg-white/5 transition-colors">
    <div className={`p-3 rounded-lg bg-white/5 ${color}`}>
      <Icon size={24} />
    </div>
    <div className="text-left">
      <p className="text-sm text-[var(--text-muted)]">{title}</p>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  </div>
);

export default HeroSection;
