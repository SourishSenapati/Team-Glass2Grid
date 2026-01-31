import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea, ReferenceLine } from 'recharts';
import { spectralData } from '../data/spectralData';

const SpectralAnalysis = () => {
  const [material, setMaterial] = useState('riceHusk');

  const chartData = useMemo(() => {
    const raw = spectralData[material];
    const dataPoints = [];
    
    // Generate data range 300nm to 800nm step 10
    const getVal = (arr, nm) => {
        const point = arr.find(p => Math.abs(p.nm - nm) < 10);
        return point ? point.val : 0;
    };
    
    // Simple Gaussian-ish Solar approx
    const getSolar = (nm) => {
        if (nm < 400) return 0.2 + (nm-300)/100 * 0.6;
        if (nm < 500) return 0.8 + (nm-400)/100 * 0.2;
        if (nm < 700) return 1.0 - (nm-500)/200 * 0.3;
        return 0.7;
    };

    for (let nm = 300; nm <= 800; nm += 20) {
        // Interpolate or find nearest
        // Finding exact or implementing simple linear interp would be better but nearest neighbor is fine for viz
        let abs = 0;
        let em = 0;
        
        // Find nearest neighbor in raw data
        const absPoint = raw.absorption.reduce((prev, curr) => Math.abs(curr.nm - nm) < Math.abs(prev.nm - nm) ? curr : prev);
        if (Math.abs(absPoint.nm - nm) <= 20) abs = absPoint.val;

        const emPoint = raw.emission.reduce((prev, curr) => Math.abs(curr.nm - nm) < Math.abs(prev.nm - nm) ? curr : prev);
        if (Math.abs(emPoint.nm - nm) <= 20) em = emPoint.val;

        dataPoints.push({
            nm,
            absorption: abs,
            emission: em,
            solar: getSolar(nm)
        });
    }
    return dataPoints;
  }, [material]);

  return (
    <div className="glass-panel p-8 rounded-2xl">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-red-400">
                Stokes Shift & Quantum Yield Analysis
                </h3>
                <div className="flex gap-2 mt-2">
                    <button 
                        onClick={() => setMaterial('riceHusk')}
                        className={`text-[10px] font-mono px-2 py-1 rounded border ${material === 'riceHusk' ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'border-white/10 text-gray-500'}`}
                    >
                        RICE-HUSK-CQD
                    </button>
                    <button 
                        onClick={() => setMaterial('bagasse')}
                        className={`text-[10px] font-mono px-2 py-1 rounded border ${material === 'bagasse' ? 'bg-green-500/20 border-green-500 text-green-400' : 'border-white/10 text-gray-500'}`}
                    >
                        BAGASSE-CQD
                    </button>
                </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-mono">LAB DATA: {material === 'riceHusk' ? 'RH-2026-X' : 'BG-2026-Y'}</span>
        </div>
        <p className="text-sm text-gray-400 mt-2 max-w-2xl">
            This graph proves the "Invisibility" of our technology. We absorb exclusively in the <span className="text-blue-400 font-bold">UV Range (300-420nm)</span> and re-emit in the <span className="text-red-400 font-bold">Near-IR Range (600nm+)</span>, leaving the <span className="text-green-400 font-bold">Visible Spectrum (450-600nm)</span> completely transparent for human vision.
        </p>
      </div>

      <div className="h-[350px] w-full font-mono text-xs">
        <ResponsiveContainer width="100%" height="100%" minHeight={200}>
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
            <defs>
              <linearGradient id="colorAbs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorEmit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f87171" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis 
                dataKey="nm" 
                stroke="#666" 
                tick={{fill: '#888'}}
                label={{ value: 'Wavelength (nm)', position: 'bottom', fill: '#888', offset: 0 }} 
            />
            <YAxis hide />
            <Tooltip 
                contentStyle={{ backgroundColor: '#000', borderColor: '#333' }}
                itemStyle={{ color: '#fff' }}
            />
            
            {/* Reference Areas regarding the visible spectrum */}
            <ReferenceArea x1={450} x2={600} strokeOpacity={0} fill="#00ffcc" fillOpacity={0.05} />
            
            <Area 
                type="monotone" 
                dataKey="absorption" 
                stackId="1" 
                stroke="#60a5fa" 
                fill="url(#colorAbs)" 
                name="UV Absorption (Input)"
            />
            <Area 
                type="monotone" 
                dataKey="emission" 
                stackId="2" 
                stroke="#f87171" 
                fill="url(#colorEmit)" 
                name="Stokes Emission (Output)"
            />
            
            {/* Annotations */}
            <ReferenceLine x={400} stroke="#60a5fa" strokeDasharray="3 3" label={{ position: 'top', value: 'Harvesting', fill: '#60a5fa', fontSize: 10}} />
            <ReferenceLine x={640} stroke="#f87171" strokeDasharray="3 3" label={{ position: 'top', value: 'Generating', fill: '#f87171', fontSize: 10}} />
            <ReferenceLine x={525} stroke="none" label={{ position: 'insideTop', value: 'VISIBLE TRANSPARENCY WINDOW', fill: '#00ffcc', fontSize: 10, fontWeight: 'bold'}} />

          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6 text-center border-t border-white/10 pt-6">
        <div>
            <div className="text-2xl font-bold text-blue-400">120nm</div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500">Stokes Shift Delta</div>
        </div>
        <div>
            <div className="text-2xl font-bold text-white">0%</div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500">Self-Absorption Overlap</div>
        </div>
        <div>
            <div className="text-2xl font-bold text-[#00ffcc]">92%</div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500">Peak VLT (Visible Light Transmittance)</div>
        </div>
      </div>
    </div>
  );
};

export default SpectralAnalysis;
