import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Shield, Maximize, Zap, Eye } from 'lucide-react';

const MaterialSpec = () => {
  const [activeLayer, setActiveLayer] = useState(1);
  const [viewMode, setViewMode] = useState('default'); // 'default', 'exploded', 'isolated'
  const [rotation, setRotation] = useState({ x: 60, z: -45 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startPos.x;
    const dy = e.clientY - startPos.y;
    
    setRotation(prev => ({
      x: Math.max(0, Math.min(90, prev.x - dy * 0.5)), // Limit X rotation
      z: prev.z + dx * 0.5
    }));
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const layers = [
    {
      id: 0,
      name: "Exterior Protection",
      material: "Low-Iron Soda-Lime Glass",
      metric: "Young's Modulus: 72 GPa",
      specs: [
        { label: "Transmittance", value: ">91% (Visible)" },
        { label: "Hardness", value: "6.5 Mohs" },
        { label: "Durability", value: "ANSI Z97.1 Rated" }
      ],
      description: "Chemically tempered outer shell providing structural integrity and maximizing photon ingress while rejecting infrared heat.",
      color: "bg-blue-400"
    },
    {
      id: 1,
      name: "Active Waveguide Matrix",
      material: "PMMA + Carbon QD Dopant",
      metric: "Refractive Index: 1.49",
      specs: [
        { label: "Stokes Shift", value: "120nm" },
        { label: "Quantum Yield", value: ">85%" },
        { label: "TIR Efficiency", value: "99.8%" }
      ],
      description: "The core engine. Tuned Carbon Dots absorb UV/Blue photons and re-emit them at longer wavelengths. The PMMA matrix acts as a near-perfect optical waveguide.",
      color: "bg-[#00ffcc]"
    },
    {
      id: 2,
      name: "Photovoltaic Edge Interface",
      material: "Monocrystalline Silicon Strips",
      metric: "Conversion Eff: 24.2%",
      specs: [
        { label: "ff (Fill Factor)", value: "0.82" },
        { label: "Temp Coeff", value: "-0.26%/°C" },
        { label: "Architecture", value: "Parallel-Series" }
      ],
      description: "High-density PV strips embedded invisibly in the frame, harvesting the concentrated photon flux delivered by the waveguide.",
      color: "bg-purple-400"
    },
    {
      id: 3,
      name: "Structural Chassis",
      material: "Anodized Aluminum 6061-T6",
      metric: "Yield Strength: 276 MPa",
      specs: [
        { label: "Thermal Cond", value: "167 W/m-K" },
        { label: "Finish", value: "Matte Black/Silver" },
        { label: "Integration", value: "Unitized Curtain Wall" }
      ],
      description: "Aerospace-grade framing providing thermal dissipation for the PV cells and rigid skeletal support for high-rise wind loads.",
      color: "bg-gray-400"
    }
  ];

  return (
    <div className="py-24 relative overflow-hidden">
        {/* Background Tech Mesh */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #00ffcc 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
        </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Material <span className="text-gradient">Composition & Physics</span>
          </h2>
          <p className="text-[var(--text-muted)] max-w-2xl">
            A precise synergy of varying refractive indices and engineered tensility ensures Lumicore is both a fortress and a generator.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Controls */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 pointer-events-none md:pointer-events-auto">
                <div className="bg-black/60 backdrop-blur-md rounded-lg p-1 flex flex-col gap-2 pointer-events-auto">
                    <button 
                        onClick={() => setViewMode('default')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'default' ? 'bg-[#00ffcc] text-black shadow-[0_0_10px_#00ffcc]' : 'text-gray-400 hover:text-white'}`}
                        title="Stacked View"
                    >
                        <Layers size={20} />
                    </button>
                    <button 
                        onClick={() => setViewMode('exploded')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'exploded' ? 'bg-[#00ffcc] text-black shadow-[0_0_10px_#00ffcc]' : 'text-gray-400 hover:text-white'}`}
                        title="Exploded View"
                    >
                        <Maximize size={20} />
                    </button>
                    <button 
                        onClick={() => setViewMode('isolated')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'isolated' ? 'bg-[#00ffcc] text-black shadow-[0_0_10px_#00ffcc]' : 'text-gray-400 hover:text-white'}`}
                        title="Isolate View"
                    >
                        <Eye size={20} />
                    </button>
                </div>
                <div className="mt-2 text-[10px] text-center font-mono text-gray-500 bg-black/40 rounded p-1 backdrop-blur-sm pointer-events-none">
                    DRAG TO ROTATE
                </div>
            </div>

            {/* Interactive Exploded View Diagram - REALISTIC STACKING */}
            <div 
                className={`relative h-[600px] flex flex-col justify-center items-center perspective-1000 group py-12 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {/* Central Axis Line (Only in Exploded Mode) */}
                <AnimatePresence>
                {viewMode === 'exploded' && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 0.3, height: 600 }}
                        exit={{ opacity: 0 }}
                        className="absolute w-[2px] bg-dashed-gradient z-0"
                        style={{ 
                            background: 'linear-gradient(to bottom, transparent, #00ffcc, transparent)',
                            transform: `rotateX(${rotation.x}deg) rotateZ(${rotation.z}deg)`,
                            transformStyle: 'preserve-3d'
                        }}
                    />
                )}
                </AnimatePresence>

                {layers.map((layer, index) => {
                    // Layer-Specific Styling Logic
                    const isGlass = index === 0;
                    const isWaveguide = index === 1;
                    const isPV = index === 2;
                    const isChassis = index === 3;
                    
                    // Animation Logic based on Mode
                    const isIsolated = viewMode === 'isolated';
                    const isActive = activeLayer === index;
                    
                    // Render Order Fix: Sort strictly by index when stacked, but allow pop-out when active
                    let zIndex = (layers.length - index) * 10; 
                    
                    let yPos = index * -40; // Default Stack (Increased gap)
                    let opacity = 1;
                    let scale = 1;

                    if (viewMode === 'exploded') {
                         yPos = index * -150; // Exploded spacing (Much larger gap)
                         if (isActive) {
                             scale = 1.05;
                             zIndex = 100; // Always top when active
                         }
                    } else if (isIsolated) {
                        if (isActive) {
                            yPos = 0; // Center it
                            scale = 1.1;
                            opacity = 1;
                            zIndex = 100;
                        } else {
                            opacity = 0.05; // Ghost others
                            scale = 0.5;
                        }
                    } else {
                        // Default Hover behavior
                        if (isActive) {
                             yPos = index * -60; // Slight pop, closer for realism
                             scale = 1.02;
                             zIndex = 100;
                        } else if (activeLayer !== null) {
                            opacity = 0.6; // Less dimming
                        }
                    }


                    return (
                    <motion.div
                        key={layer.id}
                        initial={{ opacity: 0, rotateX: 60, rotateZ: -45, y: index * -5 }}
                        whileInView={{ opacity: 1 }}
                        animate={{ 
                            y: yPos,
                            z: isActive ? 20 : 0, // Lift active layer in Z space
                            scale: scale,
                            opacity: opacity,
                            rotateX: rotation.x,
                            rotateZ: rotation.z
                        }}
                        transition={{ 
                            type: "spring", stiffness: 120, damping: 20
                        }}
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent drag start interference
                            setActiveLayer(index);
                        }}
                        className={`
                            absolute w-64 h-64 md:w-80 md:h-80 rounded-xl border-[1px]
                            flex items-center justify-center transition-shadow duration-500
                            ${isGlass ? 'bg-blue-50/5 border-blue-200/30 backdrop-blur-[2px] shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]' : ''}
                            ${isWaveguide ? 'bg-[#00ffcc]/10 border-[#00ffcc]/60 shadow-[0_0_60px_rgba(0,255,204,0.15)]' : ''}
                            ${isPV ? 'bg-gray-900/95 border-purple-500/50' : ''}
                            ${isChassis ? 'bg-[#151515] border-gray-700 shadow-2xl' : ''}
                        `}
                        style={{ 
                            zIndex: zIndex,
                            transformStyle: 'preserve-3d',
                            boxShadow: isActive && !isChassis
                                ? `0 0 50px ${isWaveguide ? 'rgba(0, 255, 204, 0.4)' : 'rgba(255, 255, 255, 0.2)'}` 
                                : ''
                         }}
                    >
                        {/* === ELECTRONICS VISUALIZATION (Layer 2) === */}
                        {isPV && (
                            <div className="absolute inset-0 overflow-hidden opacity-60">
                                {/* Simulated PV Cell Grid */}
                                <div className="absolute inset-2 border-2 border-dashed border-purple-500/30 rounded-lg"></div>
                                <svg width="100%" height="100%" className="absolute inset-0">
                                    <pattern id="circuit" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                        <path d="M10 0v20 M0 10h20" stroke="rgba(168, 85, 247, 0.2)" strokeWidth="0.5"/>
                                        <rect x="9" y="9" width="2" height="2" fill="rgba(168, 85, 247, 0.6)"/>
                                    </pattern>
                                    <rect width="100%" height="100%" fill="url(#circuit)" />
                                    {/* Gold Busbars */}
                                    <rect x="10%" y="5%" width="80%" height="2px" fill="#fbbf24" fillOpacity="0.5" />
                                    <rect x="10%" y="95%" width="80%" height="2px" fill="#fbbf24" fillOpacity="0.5" />
                                    <rect x="5%" y="10%" width="2px" height="80%" fill="#fbbf24" fillOpacity="0.5" />
                                    <rect x="95%" y="10%" width="2px" height="80%" fill="#fbbf24" fillOpacity="0.5" />
                                </svg>
                            </div>
                        )}

                        {/* === WAVEGUIDE GLOW (Layer 1) === */}
                        {isWaveguide && (
                             <div className="absolute inset-0 bg-gradient-to-br from-[#00ffcc]/20 to-transparent opacity-50 rounded-xl" />
                        )}

                        {/* Layer Label/Icon */}
                        <div className="transform rotate-180 rotate-x-180 text-center relative z-10"> 
                            <motion.div 
                                animate={{ rotateX: -rotation.x, rotateZ: -rotation.z }} 
                                className="flex flex-col items-center justify-center p-4 rounded-full bg-black/40 backdrop-blur-md border border-white/5"
                            > 
                                {isGlass && <Shield size={32} className="text-blue-200" />}
                                {isWaveguide && <Maximize size={32} className="text-[#00ffcc] drop-shadow-[0_0_10px_rgba(0,255,204,0.8)]" />}
                                {isPV && <Zap size={32} className="text-purple-400" />}
                                {isChassis && <Layers size={32} className="text-gray-400" />}
                            </motion.div>
                        </div>
                        
                        {/* Connecting Line */}
                        <AnimatePresence>
                        {activeLayer === index && (
                             <motion.div 
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: 120, opacity: 1 }}
                                exit={{ width: 0, opacity: 0 }}
                                className="hidden lg:block absolute left-full top-1/2 h-[1px] bg-gradient-to-r from-[#00ffcc] to-transparent origin-left"
                                style={{ transform: `translateY(-50%) rotateZ(${-rotation.z}deg) rotateX(${-rotation.x}deg)` }}
                             />
                        )}
                        </AnimatePresence>
                    </motion.div>
                )})}
            </div>

            {/* Spec Panel */}
            <div className="relative h-full min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeLayer}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="glass-panel p-8 border-l-4 border-l-[#00ffcc]"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-4xl font-mono text-white/20">0{activeLayer + 1}</span>
                            <div>
                                <h3 className="text-2xl font-bold text-white">{layers[activeLayer].name}</h3>
                                <p className={`text-sm font-bold mt-1 ${layers[activeLayer].color.replace('bg-', 'text-')}`}>
                                    {layers[activeLayer].material}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                    <Eye size={16} /> Physical Properties
                                </h4>
                                <p className="text-gray-300 leading-relaxed">
                                    {layers[activeLayer].description}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                                    <div className="text-xs text-gray-500 uppercase">Primary Metric</div>
                                    <div className="text-[#00ffcc] font-mono font-bold mt-1">
                                        {layers[activeLayer].metric}
                                    </div>
                                </div>
                                {layers[activeLayer].specs.map((spec, i) => (
                                    <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/5">
                                        <div className="text-xs text-gray-500 uppercase">{spec.label}</div>
                                        <div className="text-white font-mono mt-1">{spec.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialSpec;
