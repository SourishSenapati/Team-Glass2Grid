import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, DollarSign, CloudLightning, Users } from 'lucide-react';

const ImpactCalculator = ({ currency, setCurrency, exchangeRate }) => {
  const [inputs, setInputs] = useState({
    buildingType: 'skyscraper', // skyscraper, airport, commercial
    glassArea: 10000, // m2
    sunlightHours: 5.5, // hrs/day
    electricityRate: 0.18 // $/kWh
  });

  const [results, setResults] = useState({
    energyGenerated: 0,
    costSavings: 0,
    carbonOffset: 0,
    farmerRevenue: 0,
    capex: 0,
    payback: 0
  });

  // Constants
  const POWER_PER_M2 = 0.12; // 120W per m2 (120 kWh/m2/yr normalized)
  const HVAC_SAVINGS_FACTOR = 0.25; // kWh saved per m2 via insulation
  const CO2_PER_KWH = 0.45; // kg
  const HUSK_PER_M2 = 8; // kg of husk needed per m2 of glass
  const FARMER_PRICE_PER_KG = 0.15; // $ paid to farmer
  const CAPEX_PER_M2 = 450; // $450/m2 installed (premium)

  useEffect(() => {
    calculateImpact();
  }, [inputs, currency, exchangeRate]);

  const formatCurrency = (amount) => {
    if (currency === 'USD') {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    } else {
        // INR Formatting explanation: 
        // < 1 Lakh: Normal
        // > 1 Lakh: 1,00,000
        // > 1 Crore: 1,00,00,000
        const rate = exchangeRate || 91.94;
        const val = amount * rate;
        if (isNaN(val)) return "₹0";
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
    }
  };

  const calculateImpact = () => {
    // 1. Energy Generation
    // Annual kWh = Area * Power_Rating * Sun_Factor (simplified normalized yield)
    // Detailed: 120 kWh/m2/year average yield
    const yearlyEnergy = inputs.glassArea * 120 * (inputs.sunlightHours / 5.0); // scaled by sun hours

    // 2. Financial Savings
    // Base calculation in USD
    const directSavingsUSD = yearlyEnergy * inputs.electricityRate;
    // HVAC Savings (Approximation: 25 kWh/m2 saved annually)
    const hvacSavingsUSD = inputs.glassArea * 25 * inputs.electricityRate; 
    const totalAnnualSavingsUSD = directSavingsUSD + hvacSavingsUSD;

    // 3. CAPEX & Payback
    const totalCapexUSD = inputs.glassArea * CAPEX_PER_M2;
    // Simple Payback = CAPEX / Annual Savings
    // Note: This is simple payback, not discounted.
    const paybackYears = totalCapexUSD / totalAnnualSavingsUSD;

    // 4. Carbon Offset
    const co2 = (yearlyEnergy * CO2_PER_KWH) / 1000; // Tons

    // 5. Social Impact
    const farmerRevUSD = inputs.glassArea * HUSK_PER_M2 * FARMER_PRICE_PER_KG;

    setResults({
      energyGenerated: Math.round(yearlyEnergy).toLocaleString(),
      costSavings: formatCurrency(totalAnnualSavingsUSD),
      carbonOffset: co2.toFixed(1),
      farmerRevenue: formatCurrency(farmerRevUSD),
      capex: currency === 'USD' 
          ? `$${(totalCapexUSD / 1000000).toFixed(1)}M` 
          : `₹${((totalCapexUSD * (exchangeRate || 91.94)) / 10000000).toFixed(2)}Cr`, // Show Crores for INR
      payback: paybackYears.toFixed(1)
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  return (
    <div className="py-16">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Project <span className="text-[#00ffcc]">Feasibility Model</span>
        </h2>
        <p className="text-gray-400">Input site-specific parameters to generate operational forecasts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 glass-panel p-4 md:p-8">
        
        {/* Controls */}
        <div className="space-y-8 relative z-20">
          <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg border border-white/10">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Currency</span>
            <div className="flex gap-1">
                <button
                    onClick={() => setCurrency('USD')}
                    className={`px-3 py-1 text-xs font-bold rounded transition-all ${currency === 'USD' ? 'bg-[#00ffcc] text-black' : 'text-gray-500 hover:text-white'}`}
                >
                    USD ($)
                </button>
                <button
                    onClick={() => setCurrency('INR')}
                    className={`px-3 py-1 text-xs font-bold rounded transition-all ${currency === 'INR' ? 'bg-[#00ffcc] text-black' : 'text-gray-500 hover:text-white'}`}
                >
                    INR (₹)
                </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/5 relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-r from-[#00ffcc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <label className="text-xs font-bold text-[#00ffcc] uppercase tracking-widest mb-3 block">Building Topology</label>
             <div className="grid grid-cols-3 gap-2 relative z-10">
                {['commercial', 'skyscraper', 'airport'].map((type) => (
                    <button
                        key={type}
                        onClick={() => setInputs(prev => ({...prev, buildingType: type, glassArea: type === 'skyscraper' ? 15000 : type === 'airport' ? 30000 : 5000}))}
                        className={`py-3 px-2 text-xs font-bold uppercase tracking-wider rounded border transition-all ${inputs.buildingType === type ? 'bg-[#00ffcc] text-black border-[#00ffcc]' : 'bg-black/40 text-gray-400 border-white/10 hover:border-white/30'}`}
                    >
                        {type}
                    </button>
                ))}
             </div>
          </div>

          <div>
             <div className="flex justify-between items-end mb-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Surface Area</label>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold font-mono text-white">{inputs.glassArea.toLocaleString()}</span>
                    <span className="text-xs text-gray-500 font-mono">m²</span>
                </div>
             </div>
             <input 
               type="range" 
               min="1000" max="50000" step="1000"
               value={inputs.glassArea}
               onChange={(e) => setInputs({...inputs, glassArea: parseInt(e.target.value)})}
               className="w-full accent-[#00ffcc] h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer hover:bg-gray-700 transition-colors"
             />
             <div className="flex justify-between text-[10px] text-gray-600 font-mono mt-1 uppercase">
                <span>Small Office</span>
                <span>Mega-Structure</span>
             </div>
          </div>

          <div>
            <div className="flex justify-between items-end mb-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Solar Irradiance</label>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold font-mono text-yellow-400">{inputs.sunlightHours}</span>
                    <span className="text-xs text-gray-500 font-mono">hrs/day</span>
                </div>
            </div>
            <input 
              type="range" 
              name="sunlightHours"
              min="2" max="10" step="0.1"
              value={inputs.sunlightHours}
              onChange={handleInputChange}
              className="w-full accent-yellow-400 h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer hover:bg-gray-700 transition-colors"
            />
          </div>

          <div>
            <div className="flex justify-between items-end mb-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Local Utility Rate</label>
                 <div className="flex items-baseline gap-1">
                    <span className="text-lg font-mono text-gray-300">{currency === 'USD' ? '$' : '₹'}</span>
                    <span className="text-2xl font-bold font-mono text-white">
                        {currency === 'USD' ? inputs.electricityRate.toFixed(2) : (inputs.electricityRate * (exchangeRate || 91.94)).toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">/kWh</span>
                </div>
            </div>
            <input 
              type="range" 
              name="electricityRate"
              min="0.05" max="0.50" step="0.01"
              value={inputs.electricityRate}
              onChange={handleInputChange}
              className="w-full accent-green-400 h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer hover:bg-gray-700 transition-colors"
            />
             <div className="text-[10px] text-gray-600 font-mono mt-1 text-right w-full">
                Rate calculated in {currency}
             </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard 
                icon={CloudLightning} 
                label="Annual Generation" 
                value={`${results.energyGenerated} kWh`}
                subtext="Base Load Offset"
                color="text-yellow-400"
            />
            <ResultCard 
                icon={DollarSign} 
                label="Operational Savings" 
                value={results.costSavings}
                subtext="Energy + HVAC Offset / Yr"
                color="text-green-400"
            />
            <ResultCard 
                icon={Calculator} 
                label="Project CAPEX" 
                value={results.capex}
                subtext={`@ $${CAPEX_PER_M2}/m² Installed`}
                color="text-red-400"
            />
             <ResultCard 
                icon={Users} 
                label="Farmer Revenue" 
                value={results.farmerRevenue}
                subtext="Direct Agrarian Injection"
                color="text-purple-400"
            />
        </div>
      </div>
    </div>
  );
};

const ResultCard = ({ icon: Icon, label, value, subtext, color }) => (
    <motion.div 
        key={value}
        initial={{ scale: 0.95, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/5 border border-white/10 p-6 rounded-xl flex flex-col justify-between hover:border-[#00ffcc]/30 transition-colors"
    >
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-full bg-black/40 ${color}`}>
                <Icon size={24} />
            </div>
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Projected</span>
        </div>
        <div>
            <h3 className="text-3xl font-bold mb-1">{value}</h3>
            <p className="text-sm text-gray-400 font-medium">{label}</p>
            <div className="mt-3 text-xs text-gray-600 border-t border-white/5 pt-3">
                {subtext}
            </div>
        </div>
    </motion.div>
);

export default ImpactCalculator;
