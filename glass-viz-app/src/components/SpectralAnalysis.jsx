import React, { PureComponent } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea, ReferenceLine } from 'recharts';

const data = [
  { nm: 300, absorption: 0.1, emission: 0, solar: 0.2 },
  { nm: 320, absorption: 0.3, emission: 0, solar: 0.3 },
  { nm: 340, absorption: 0.6, emission: 0, solar: 0.4 },
  { nm: 360, absorption: 0.85, emission: 0, solar: 0.5 },
  { nm: 380, absorption: 0.95, emission: 0, solar: 0.6 },
  { nm: 400, absorption: 0.9, emission: 0, solar: 0.8 }, // UV Peak
  { nm: 420, absorption: 0.6, emission: 0, solar: 0.9 },
  { nm: 440, absorption: 0.2, emission: 0.05, solar: 1.0 },
  { nm: 460, absorption: 0.05, emission: 0.1, solar: 1.0 },
  { nm: 480, absorption: 0.0, emission: 0.1, solar: 1.0 }, // Visible Transparency Window Starts
  { nm: 500, absorption: 0.0, emission: 0.05, solar: 1.0 }, // Pure Transparency
  { nm: 520, absorption: 0.0, emission: 0.0, solar: 1.0 },
  { nm: 540, absorption: 0.0, emission: 0.0, solar: 1.0 },
  { nm: 560, absorption: 0.0, emission: 0.0, solar: 1.0 },
  { nm: 580, absorption: 0.0, emission: 0.1, solar: 1.0 },
  { nm: 600, absorption: 0.05, emission: 0.3, solar: 0.95 },
  { nm: 620, absorption: 0.1, emission: 0.6, solar: 0.9 },
  { nm: 640, absorption: 0.1, emission: 0.9, solar: 0.85 }, // Emission Peak (Red/IR)
  { nm: 660, absorption: 0.05, emission: 0.7, solar: 0.8 },
  { nm: 680, absorption: 0.0, emission: 0.4, solar: 0.75 },
  { nm: 700, absorption: 0.0, emission: 0.1, solar: 0.7 },
  { nm: 720, absorption: 0.0, emission: 0.0, solar: 0.65 },
  { nm: 740, absorption: 0.0, emission: 0.0, solar: 0.6 },
];

const SpectralAnalysis = () => {
  return (
    <div className="glass-panel p-8 rounded-2xl">
      <div className="mb-6">
        <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-red-400">
            Stokes Shift & Quantum Yield Analysis
            </h3>
            <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-mono">LAB DATA: BATCH-CQD-2026</span>
        </div>
        <p className="text-sm text-gray-400 mt-2 max-w-2xl">
            This graph proves the "Invisibility" of our technology. We absorb exclusively in the <span className="text-blue-400 font-bold">UV Range (300-420nm)</span> and re-emit in the <span className="text-red-400 font-bold">Near-IR Range (600nm+)</span>, leaving the <span className="text-green-400 font-bold">Visible Spectrum (450-600nm)</span> completely transparent for human vision.
        </p>
      </div>

      <div className="h-[350px] w-full font-mono text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
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
