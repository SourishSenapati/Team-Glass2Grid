import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const ComparisonChart = ({ currency = 'USD', exchangeRate = 1 }) => {
    const [years] = useState(25);
    const [scenario, setScenario] = useState('base'); // conservative, base, aggressive

    // Financial Parameters based on Sensitivity Analysis
    const getParams = () => {
        switch(scenario) {
            case 'conservative': return { inflation: 0.02, degradation: 0.007, discount: 0.08, label: 'Conservative Warning' };
            case 'aggressive': return { inflation: 0.05, degradation: 0.003, discount: 0.04, label: 'Optimistic Growth' };
            default: return { inflation: 0.035, degradation: 0.005, discount: 0.06, label: 'Standard Projection' };
        }
    };
    
    const params = getParams();

    // Advanced Financial Modeling Constants
    const CAPEX_STD_PER_M2 = 180; 
    const CAPEX_LUMI_PER_M2 = 450; 
    
    const ENERGY_YIELD_KWH_M2 = 120; 
    const UTILITY_RATE_BASE = 0.18; 
    
    // Thermal Modeling
    const SHGC_STD = 0.45; 
    const SHGC_LUMI = 0.25; 
    const COOLING_LOAD_FACTOR = 1500; 
    
    const AREA = 10000; 

    const generateData = () => {
        const data = [];
        let cumStandard = -(CAPEX_STD_PER_M2 * AREA);
        let cumLumi = -(CAPEX_LUMI_PER_M2 * AREA);
        
        // NPV Trackers
        let npvStandard = cumStandard;
        let npvLumi = cumLumi;

        let currentRate = UTILITY_RATE_BASE;
        let efficiency = 1.0;
        
        for (let year = 0; year <= years; year++) {
            if (year > 0) {
                // 1. Cooling Savings (OpEx)
                const coolingDeltaKWh = (SHGC_STD - SHGC_LUMI) * 10 * COOLING_LOAD_FACTOR; 
                const coolingSavings = coolingDeltaKWh * currentRate;
                
                // 2. Generation Revenue
                const generationRevenue = AREA * ENERGY_YIELD_KWH_M2 * efficiency * currentRate;
                
                // Free Cash Flow for Year
                const fcfLumi = generationRevenue + coolingSavings;
                
                // Update Cumulative (Nominal)
                cumLumi += fcfLumi;
                
                // Update NPV (Discounted)
                npvLumi += fcfLumi / Math.pow(1 + params.discount, year);

                // Compounding
                currentRate *= (1 + params.inflation);
                efficiency *= (1 - params.degradation);
            }

            data.push({
                year: `Yr ${year}`,
                Standard: Math.round(cumStandard),
                Lumicore: Math.round(cumLumi),
                NetBenefit: Math.round(cumLumi - cumStandard)
            });
        }

        
        // Convert data if necessary
        const rate = (currency === 'USD' || typeof exchangeRate !== 'number' || isNaN(exchangeRate)) ? 1 : exchangeRate;
        const finalData = data.map(d => ({
            ...d,
            Standard: d.Standard * rate,
            Lumicore: d.Lumicore * rate,
            NetBenefit: d.NetBenefit * rate
        }));

        return { data: finalData, npv: (npvLumi - npvStandard) * rate }; 
    };
    
    const { data, npv } = generateData();
    
    const crossoverYear = data.findIndex(d => d.Lumicore > d.Standard);
    const finalNet = data[data.length - 1].NetBenefit; // This is now safe as strict loop ensures data exists
    const roi = ((finalNet / ((CAPEX_LUMI_PER_M2 * AREA) * (currency === 'USD' ? 1 : (exchangeRate || 1)))) * 100).toFixed(1);

    const isViable = parseFloat(roi) > 15 && crossoverYear > 0 && crossoverYear < 8;

    const [activeView, setActiveView] = useState('analysis'); // 'analysis' | 'pricing'

    // Pricing Tiers Data
    const formatMoney = (amount) => {
        if (currency === 'USD') return `$${amount.toFixed(2)}`;
        // Round to nearest 10 for INR to look cleaner
        const rate = exchangeRate || 91.94;
        const val = amount * rate;
        if (isNaN(val)) return "₹0";
        return `₹${Math.round(val).toLocaleString('en-IN')}`;
    }

    const pricingTiers = [
        {
            title: "G2G-Flex DIY",
            tag: "B2C STARTER",
            price: currency === 'USD' ? "$149" : `₹${Math.round(149 * exchangeRate).toLocaleString()}`,
            unit: "/ kit",
            desc: "Perfect for balconies and apartment windows. 30-min install.",
            features: ["20 sq.ft DIY Retrofit Film", "100W Equivalent Output", "Snap-on Power Clip (USB-C)", "Mobile App Access"],
            highlight: false
        },
        {
            title: "Lumicore Pro",
            tag: "RESIDENTIAL",
            price: currency === 'USD' ? "$28.00" : `₹${Math.round(28 * exchangeRate).toLocaleString()}`,
            unit: "/ sq.ft",
            desc: "Full home integration. Professional installation included.",
            features: ["Custom Cut-to-Size Film", "Whole-Home Inverter Sync", "20-Year Warranty", "Tax Credit Eligible"],
            highlight: true
        },
        {
            title: "Enterprise Grid",
            tag: "COMMERCIAL",
            price: currency === 'USD' ? "$18.50" : `₹${Math.round(18.5 * exchangeRate).toLocaleString()}`,
            unit: "/ sq.ft",
            desc: "Volume tariff for tech parks & skyscrapers (>5,000 sq.ft).",
            features: ["Lowest LCOE ($0.04/kWh)", "BMS/Scada Integration", "HVAC Load Reduction", "ESG Carbon Credits"],
            highlight: false
        }
    ];

  return (
    <div className="py-12 md:py-16">
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
            <div>
                 <h2 className="text-3xl md:text-5xl font-bold mb-2">
                    Commercial <span className="text-[#00ffcc]">Viability</span>
                </h2>
                <p className="text-gray-400 text-sm">
                    From ROI analysis to direct consumer pricing.
                </p>
            </div>
            
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                <button 
                    onClick={() => setActiveView('analysis')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeView === 'analysis' ? 'bg-[#00ffcc] text-black shadow-lg shadow-[#00ffcc]/20' : 'text-gray-400 hover:text-white'}`}
                >
                    B2B Analysis
                </button>
                <button 
                    onClick={() => setActiveView('pricing')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeView === 'pricing' ? 'bg-[#00ffcc] text-black shadow-lg shadow-[#00ffcc]/20' : 'text-gray-400 hover:text-white'}`}
                >
                    B2C Pricing
                </button>
            </div>
        </div>

        {/* B2B ANALYSIS VIEW */}
        {activeView === 'analysis' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-start animate-fade-in"> 
            <div className="lg:col-span-1 space-y-6">
                {/* Mobile-First Controls */}
                <div className="flex flex-col gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-200">Financial Model</h3>
                        <div className="flex bg-black/40 rounded-lg p-1 gap-1">
                            {['conservative', 'base', 'aggressive'].map(s => (
                                <button 
                                    key={s}
                                    onClick={() => setScenario(s)} 
                                    className={`px-3 py-1.5 text-[10px] md:text-xs font-medium uppercase tracking-wider rounded transition-all ${
                                        scenario === s 
                                        ? (s === 'conservative' ? 'bg-red-500/20 text-red-400' : s === 'aggressive' ? 'bg-green-500/20 text-green-400' : 'bg-[#00ffcc]/20 text-[#00ffcc]') 
                                        : 'text-gray-500 hover:text-white'
                                    }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3 font-mono text-sm border-t border-white/5 pt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">Break-Even</span>
                            <span className={`${crossoverYear < 7 ? 'text-[#00ffcc]' : 'text-yellow-400'} font-bold`}>
                                {crossoverYear > -1 ? `Year ${crossoverYear}` : '> 25 Years'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">Net Present Value</span>
                            <span className={`font-bold ${npv > 0 ? 'text-[#00ffcc]' : 'text-red-500'}`}>
                                {npv > 0 ? '+' : ''}{currency === 'USD' ? '$' : '₹'}{(npv / (currency === 'USD' ? 1000000 : 10000000)).toFixed(2)}{currency === 'USD' ? 'M' : 'Cr'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">25y ROI</span>
                            <span className={`font-bold ${parseFloat(roi) > 15 ? 'text-[#00ffcc]' : 'text-yellow-400'}`}>
                                {roi}%
                            </span>
                        </div>
                        {/* New Hype Metric */}
                        <div className="flex justify-between items-center border-t border-white/5 pt-2 mt-2">
                             <span className="text-purple-400 text-xs font-bold uppercase tracking-wider">Market Alpha</span>
                             <span className="font-bold text-white">{(parseFloat(roi) / 8.5).toFixed(1)}x S&P</span>
                        </div>
                    </div>

                    {/* VIABILITY VERDICT */}
                    <div className={`mt-2 p-3 rounded border flex items-center justify-between ${
                        isViable 
                        ? 'bg-green-500/10 border-green-500/30' 
                        : 'bg-yellow-500/10 border-yellow-500/30'
                    }`}>
                        <span className="text-xs uppercase font-bold tracking-widest text-gray-400">Project Viability</span>
                        <span className={`font-bold font-mono ${isViable ? 'text-green-400' : 'text-yellow-400'}`}>
                            {isViable ? 'UNICORN READY 🦄' : 'HIGH RISK'}
                        </span>
                    </div>
                </div>
            </div>
            
            <div className="lg:col-span-2 h-[300px] md:h-[400px] w-full bg-black/20 rounded-xl p-2 md:p-4 border border-white/5 relative">
                 <div className="absolute top-4 right-4 z-10 flex gap-4 text-[10px] md:text-xs font-mono text-gray-500">
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500" /> Standard</div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#00ffcc]" /> Glass2Grid</div>
                 </div>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorLumi" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00ffcc" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#00ffcc" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorStd" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                        <XAxis dataKey="year" stroke="#444" tick={{fontSize: 10}} minTickGap={30} tickLine={false} axisLine={false} />
                        <YAxis stroke="#444" tick={{fontSize: 10}} tickFormatter={(val) => `${currency === 'USD' ? '$' : '₹'}${Math.round(val/(currency === 'USD' ? 1000000 : 10000000))}${currency === 'USD' ? 'M' : 'Cr'}`} tickLine={false} axisLine={false} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#000', borderColor: '#333', borderRadius: '8px', fontSize: '12px' }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value) => [`${currency === 'USD' ? '$' : '₹'}${(value/(currency === 'USD' ? 1000000 : 10000000)).toFixed(2)}${currency === 'USD' ? 'M' : 'Cr'}`, 'Cumulative']}
                        />
                        {crossoverYear > -1 && <ReferenceLine x={`Yr ${crossoverYear}`} stroke="#fff" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'ROI+', fill: '#fff', fontSize: 10, offset: 10 }} />}
                        <Area type="monotone" dataKey="Standard" stroke="#ef4444" fillOpacity={1} fill="url(#colorStd)" strokeWidth={2} name="Standard" />
                        <Area type="monotone" dataKey="Lumicore" stroke="#00ffcc" fillOpacity={1} fill="url(#colorLumi)" strokeWidth={2} name="Glass2Grid" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
        )}

        {/* PRICING VIEW */}
        {activeView === 'pricing' && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                {pricingTiers.map((tier, i) => (
                    <div key={i} className={`relative p-6 rounded-2xl border flex flex-col h-full transition-all hover:scale-105 ${tier.highlight ? 'bg-white/10 border-[#00ffcc] shadow-[0_0_30px_rgba(0,255,204,0.15)]' : 'bg-black/40 border-white/10 hover:border-white/30'}`}>
                        {tier.highlight && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00ffcc] text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                                Most Popular
                            </div>
                        )}
                        <div className="mb-4">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{tier.tag}</span>
                            <h3 className="text-2xl font-bold text-white mt-1">{tier.title}</h3>
                        </div>
                        <div className="mb-6 flex items-baseline gap-1">
                            <span className={`text-4xl font-black ${tier.highlight ? 'text-[#00ffcc]' : 'text-white'}`}>{tier.price}</span>
                            <span className="text-sm text-gray-400 font-medium">{tier.unit}</span>
                        </div>
                        <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                            {tier.desc}
                        </p>
                        <div className="space-y-3 mb-8 flex-1">
                            {tier.features.map((feat, j) => (
                                <div key={j} className="flex items-start gap-3">
                                    <div className={`mt-1 w-4 h-4 rounded-full flex items-center justify-center ${tier.highlight ? 'bg-[#00ffcc]/20 text-[#00ffcc]' : 'bg-gray-800 text-gray-400'}`}>
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                                    </div>
                                    <span className="text-sm text-gray-300">{feat}</span>
                                </div>
                            ))}
                        </div>
                        <button className={`w-full py-3 rounded-lg font-bold text-sm tracking-wide transition-all ${tier.highlight ? 'bg-[#00ffcc] text-black hover:bg-[#00ccxa]' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                            {tier.highlight ? 'PRE-ORDER NOW' : 'CONTACT SALES'}
                        </button>
                    </div>
                ))}
             </div>
        )}

    </div>
  );
};

export default ComparisonChart;
