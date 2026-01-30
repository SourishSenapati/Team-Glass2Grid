import React, { useState, useEffect } from 'react';
import HeroSection from './components/HeroSection';
import TechExplainer from './components/TechExplainer';
import MaterialSpec from './components/MaterialSpec';
import EngineeringSimulator from './components/EngineeringSimulator';
import LCAAModel from './components/LCAAModel';
import ImpactCalculator from './components/ImpactCalculator';
import ComparisonChart from './components/ComparisonChart';
import Footer from './components/Footer';
import ContactModal from './components/ContactModal';
import ParticleBackground from './components/ParticleBackground';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [exchangeRate, setExchangeRate] = useState(91.94); // Fallback
  const [thickness, setThickness] = useState(8); // Shared state for thickness

  useEffect(() => {
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
      .then(res => res.json())
      .then(data => {
        if(data && data.rates && data.rates.INR) {
            setExchangeRate(Number(data.rates.INR));
        }
      })
      .catch(err => console.warn("Rate fetch failed", err));
  }, []);

  const safeRate = isNaN(exchangeRate) ? 91.94 : exchangeRate;

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 glass-panel m-2 md:m-4 flex justify-between items-center max-w-7xl mx-auto backdrop-blur-md bg-black/20">
        <div className="text-2xl font-bold tracking-tighter">
          <span className="text-white">LUMI</span>
          <span className="text-[#00ffcc]">CORE</span>
        </div>
        <div className="hidden md:flex gap-6 text-sm font-medium text-gray-300">
          <a href="#technology" className="hover:text-[#00ffcc] transition-colors">Technology</a>
          <a href="#materials" className="hover:text-[#00ffcc] transition-colors">Engineering</a>
          <a href="#lcaa" className="hover:text-[#00ffcc] transition-colors">Life Cycle</a>
          <a href="#impact" className="hover:text-[#00ffcc] transition-colors">Impact Model</a>
          <a href="#financials" className="hover:text-[#00ffcc] transition-colors">Financials</a>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#00ffcc] text-black px-5 py-2 rounded-full font-bold hover:bg-[#00b386] transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          Get in Touch
        </button>
      </nav>

      <main className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto space-y-24">
        <HeroSection onContactClick={() => setIsModalOpen(true)} />
        
        <section id="technology" className="scroll-mt-24">
          <TechExplainer />
        </section>

        <section id="materials" className="scroll-mt-24">
          <MaterialSpec />
        </section>

        <section id="simulator" className="scroll-mt-24">
          <EngineeringSimulator 
            currency={currency} 
            exchangeRate={safeRate} 
            thickness={thickness}
            setThickness={setThickness}
          />
        </section>

        <section id="lcaa" className="scroll-mt-24">
          <LCAAModel 
            currency={currency} 
            exchangeRate={safeRate} 
            thickness={thickness}
          />
        </section>
        
        <section id="impact" className="scroll-mt-24">
          <ImpactCalculator currency={currency} setCurrency={setCurrency} exchangeRate={safeRate} />
        </section>

        <section id="financials" className="scroll-mt-24">
          <ComparisonChart currency={currency} exchangeRate={safeRate} />
        </section>
      </main>

      <Footer />
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default App;

