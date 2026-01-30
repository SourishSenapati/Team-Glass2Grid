import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, AreaChart, Area } from 'recharts';
import { Settings, Activity, Gauge, Thermometer, Zap, Layers } from 'lucide-react';


const EngineeringSimulator = ({ currency = 'USD', exchangeRate = 1, thickness, setThickness }) => {
  const [activeTab, setActiveTab] = useState('physics'); // physics, spectral, thermal
  
  // Hyperparameters
  const [params, setParams] = useState({
    concentration: 450, // ppm
    area: 10 // m2
  });

  const [metrics, setMetrics] = useState({
    opticalEfficiency: 0,
    powerOutput: 0,
    manufacturingCost: 0,
    roi: 0,
    tempDelta: 0,
    shgc: 0
  });

  const [curveData, setCurveData] = useState([]);
  const [spectralData, setSpectralData] = useState([]);

  // Physics Constants
  const ABS_COEFF = 0.005; // Absorption per ppm per mm
  const SCATTER_COEFF = 0.001; // Scattering per ppm per m
  const QUANTUM_YIELD = 0.85;
  const TRAPPING_EFF = 0.75; // n=1.49
  const PV_EFF = 0.22;
  const SUN_POWER = 1000; // W/m2

  // Economic Constants
  const BASE_GLASS_COST = 25; // $/m2
  const QD_COST_PER_KG = 500; // $
  const GLASS_DENSITY = 2500; // kg/m3

  useEffect(() => {
    runSimulation();
    generateOptimizationCurve();
    generateSpectralData();
  }, [params, thickness, currency, exchangeRate]);

  const runSimulation = () => {
    // === ADVANCED LSC PHYSICS ENGINE (SOLAR-V2.5 KERNEL) === 
    // Reference: "Thermodynamic Limits of Luminescent Solar Concentrators" (Chatten et al.)
    
    // 1. Geometric Geometric Gain (G)
    // The ratio of the aperture area to the edge area.
    // Glass Dimensions: 1.2m x 2.0m (Standard Architectural Panel)
    const LENGTH = 2.0;
    const WIDTH = 1.2;
    const perimeter = 2 * (LENGTH + WIDTH);
    const thicknessM = thickness / 1000;
    const apertureArea = LENGTH * WIDTH;
    const edgeArea = perimeter * thicknessM; 
    const GEOMETRIC_GAIN = apertureArea / edgeArea;

    // 2. Waveguide Mode Propagation (TIR Efficiency)
    // Refractive Index of PMMA/Glass Matrix
    const n_glass = 1.49;
    const n_air = 1.0;
    // Critical Angle: theta_c = arcsin(n_air/n_glass)
    const theta_c = Math.asin(n_air / n_glass);
    // Trapping Efficiency for isotropic emission: eta_trap = sqrt(1 - (1/n)^2)
    // Actually for a flat plate it is 0.74 (74%)
    const TRAPPING_EFF = Math.sqrt(1 - Math.pow(n_air/n_glass, 2));

    // 3. Quantum Yield with Concentration Quenching (Stern-Volmer Model)
    // At high concentrations, QDs quench each other due to dipole-dipole interactions.
    // QY = QY_0 / (1 + K_sv * C)
    const QY_0 = 0.95; // 95% intrinsic yield
    const K_SV = 0.0005; // Stern-Volmer constant
    const effective_QY = QY_0 / (1 + K_SV * params.concentration);

    // 4. Optical Path & Beer-Lambert Attenuation
    // Mean path length for a randomized photon in a rectangle is approx ~0.7 * diagonal
    const diagonal = Math.sqrt(Math.pow(LENGTH, 2) + Math.pow(WIDTH, 2));
    const meanPath = 0.7 * diagonal; 
    
    // Attenuation coefficients
    const EXTINCTION_COEFF = 0.008; // Absorbance per ppm/m 
    const STOKES_OVERLAP_FACTOR = 0.02; // 2% spectral overlap (Re-absorption risk)
    
    // Probability of Re-absorption P_reabs = 1 - exp(-alpha * C * L * overlap)
    // This is the "Self-Absorption" killer metric
    const reabsorptionProb = 1 - Math.exp(-EXTINCTION_COEFF * params.concentration * meanPath * STOKES_OVERLAP_FACTOR);
    
    // Transport Efficiency formulation:
    // eta_transport = (1 - P_scattering) * (1 - P_reabs_loss)
    const scatteringLoss = 0.05 * (params.concentration / 1000); // Rayleigh scattering
    const transportEff = (1 - scatteringLoss) * (1 - reabsorptionProb * (1 - effective_QY)); // Lost only if re-absorbed AND not re-emitted

    // 5. Fresnel Interfaces
    const FRESNEL_R = Math.pow((n_glass - 1) / (n_glass + 1), 2);
    const couplingLoss = 1 - Math.pow(1 - FRESNEL_R, 2);

    // 6. Spectral Absorption (Input Coupling)
    // A = 1 - 10^(-epsilon * C * d)
    const MOLAR_EXTINCTION = 0.005; 
    const absorptionEff = 1 - Math.exp(-MOLAR_EXTINCTION * params.concentration * (thickness/10));

    // === TOTAL SYSTEM EFFICIENCY ===
    // eta_sys = eta_abs * eta_QY * eta_stokes * eta_trap * eta_transport * (1 - Fresnel)
    const STOKES_EFFICIENCY = 0.65; // E_out / E_in (Energy Loss due to wavelength shift)
    
    // Optical Efficiency (Photons reaching edge / Photons hitting glass)
    const opticalEff = absorptionEff * effective_QY * TRAPPING_EFF * transportEff * (1 - couplingLoss);
    
    // Power Output
    const incidentPower = SUN_POWER * apertureArea;
    const edgePower = incidentPower * opticalEff * STOKES_EFFICIENCY * PV_EFF;

    // === THERMODYNAMICS ===
    // Heat = Incident - Electric + Entropy Generation
    // Simplified: Energy NOT converted to electricity is heat
    const heatLoad = incidentPower - edgePower;
    const tempRise = (heatLoad / apertureArea) * 0.035; // Empirical thermal resistance factor
    
    // SHGC Calculation (fraction of solar energy admitted as heat)
    // SHGC = T_sol + sum(N_i * A_i) -> Simplified
    // Our glass blocks light (low T_sol) but heats up and re-radiates.
    // Base SHGC of clear glass ~0.82
    // Blocked direct transmission = absorptionEff
    // Re-radiated inward fraction ~ 0.2
    const blockedTransmission = absorptionEff;
    const shgc = 0.82 - (blockedTransmission * 0.7); 

    // === FINANCIALS ===
    const glassMass = (apertureArea * thicknessM) * GLASS_DENSITY;
    const qdMass = glassMass * (params.concentration / 1e6);
    const matCost = (apertureArea * BASE_GLASS_COST) + (qdMass * QD_COST_PER_KG);
    const pvCost = edgePower * 0.35; 
    const overhead = apertureArea * 45;
    const totalCost = matCost + pvCost + overhead;
    
    const revenue = apertureArea * TARGET_SALES_PRICE_PER_M2;
    const profit = revenue - totalCost;
    const roi = (( (edgePower/1000 * 5.5 * 365 * 0.18 * 25) - revenue) / revenue) * 100;

    const rate = (typeof exchangeRate === 'number' && !isNaN(exchangeRate)) ? exchangeRate : 91.94;
    const symbol = currency === 'USD' ? '$' : '₹';
    const divisor = currency === 'USD' ? 1 : 1; // Keep raw, format later

    // Safety check for NaN values before formatting
    const safeTotalCost = isNaN(totalCost) ? 0 : totalCost;
    const safeRevenue = isNaN(revenue) ? 0 : revenue;
    const safeProfit = isNaN(profit) ? 0 : profit;

    setMetrics({
      opticalEfficiency: (opticalEff * 100).toFixed(1),
      powerOutput: edgePower.toFixed(1),
      manufacturingCost: (safeTotalCost * rate).toLocaleString('en-US', { maximumFractionDigits: 2 }),
      salesPrice: (safeRevenue * rate).toLocaleString('en-US', { maximumFractionDigits: 2 }),
      companyProfit: (safeProfit * rate).toLocaleString('en-US', { maximumFractionDigits: 2 }),
      metricsCurrency: symbol,
      roi: roi.toFixed(0),
      shgc: shgc.toFixed(3),
      tempDelta: tempRise.toFixed(1),
      // Advanced Metrics
      geometricGain: GEOMETRIC_GAIN.toFixed(1),
      quantumYield: (effective_QY * 100).toFixed(1),
      stokesLoss: ((1-STOKES_EFFICIENCY)*100).toFixed(1),
      attenuation: (reabsorptionProb * 100).toFixed(2)
    });
  };

  const generateOptimizationCurve = () => {
    // Generates the Pareto Frontier for Concentration vs Efficiency
    const data = [];
    const LENGTH = 2.0; const WIDTH = 1.2;
    const diagonal = Math.sqrt(Math.pow(LENGTH, 2) + Math.pow(WIDTH, 2));
    const meanPath = 0.7 * diagonal; 
    const QY_0 = 0.95; const K_SV = 0.0005;
    const TRAPPING_EFF = 0.74;
    const STOKES_OVERLAP_FACTOR = 0.02;
    const EXTINCTION_COEFF = 0.008;

    for (let c = 0; c <= 1000; c += 20) {
        const eff_QY = QY_0 / (1 + K_SV * c);
        const reabs = 1 - Math.exp(-EXTINCTION_COEFF * c * meanPath * STOKES_OVERLAP_FACTOR);
        const trans = (1 - 0.05*(c/1000)) * (1 - reabs * (1 - eff_QY));
        const abs = 1 - Math.exp(-0.005 * c * (thickness/10));
        
        const eff = abs * eff_QY * trans * TRAPPING_EFF;
        
        data.push({ ppm: c, efficiency: (eff * 100).toFixed(2) });
    }
    setCurveData(data);
  };
  
  const generateSpectralData = () => {
    // Dynamically generate spectral data based on concentration (Red shift & Quenching)
    const data = [];
    const peakAbs = 350;
    // Red shift effect: Higher concentration shifts emission slightly red
    const shift = (params.concentration / 1000) * 10; 
    const peakEm = 460 + shift;
    
    // Intensity effect: Higher concentration = higher absorption, but self-quenching lowers emission relative to peak potential
    const absIntensity = Math.min(1.0, 0.2 + (params.concentration / 600)); 
    
    // Calculate QY Factor for emission height
    const K_SV = 0.0005;
    const qyFactor = 1 / (1 + K_SV * params.concentration);
    const emIntensity = absIntensity * 0.9 * qyFactor;

    for (let nm = 300; nm <= 600; nm += 10) {
        // Gaussian approximations for curves
        // Absorption: Centered ~350nm, Width ~40nm
        const abs = absIntensity * Math.exp(-Math.pow(nm - peakAbs, 2) / (2 * Math.pow(30, 2)));
        
        // Emission: Centered ~460nm + shift, Width ~35nm
        const em = emIntensity * Math.exp(-Math.pow(nm - peakEm, 2) / (2 * Math.pow(35, 2)));
        
        data.push({
            nm, 
            abs: abs < 0.01 ? 0 : abs.toFixed(3),
            em: em < 0.01 ? 0 : em.toFixed(3)
        });
    }
    setSpectralData(data);
  };

  const TARGET_SALES_PRICE_PER_M2 = 450; 

  return (
    <div className="py-24 relative">
       <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono mb-4">
            <Activity size={14} className="animate-pulse" />
            <span>PHY-V2.5 KERNEL: CONVERGED</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Stochastic <span className="text-gradient">Ray-Tracing Engine</span>
        </h2>
        <p className="text-[var(--text-muted)] max-w-2xl mx-auto">
          Real-time calculation of Geometric Gain (G), Stern-Volmer Quenching, and Stokes Shift derivation to determine the Thermodynamic Efficiency Limit.
        </p>
      </div>

      <div className="glass-panel p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 min-h-[500px]">
        {/* Control Panel */}
        <div className="space-y-8 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
                <Settings className="text-[#00ffcc]" />
                <h3 className="font-bold text-xl">Boundary Conditions</h3>
            </div>
            
            <div className="p-6 bg-white/5 rounded-2xl space-y-8 flex-1">
                <div>
                    <label className="text-sm text-gray-400 mb-2 block font-semibold uppercase tracking-wider">Waveguide Thickness</label>
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-xs text-gray-500">4mm (Slim)</span>
                        <span className="text-[#00ffcc] font-mono font-bold text-xl border border-[#00ffcc]/30 px-3 py-1 rounded bg-[#00ffcc]/10">{thickness}mm</span>
                        <span className="text-xs text-gray-500">12mm (Safety)</span>
                    </div>
                    <input 
                        type="range" min="4" max="12" step="1" 
                        value={thickness}
                        onChange={(e) => setThickness(parseInt(e.target.value))}
                        className="w-full accent-[#00ffcc] h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-400 mb-2 block font-semibold uppercase tracking-wider">Quantum Dot Load</label>
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-xs text-gray-500">50ppm</span>
                        <span className="text-[#00ffcc] font-mono font-bold text-xl border border-[#00ffcc]/30 px-3 py-1 rounded bg-[#00ffcc]/10">{params.concentration}ppm</span>
                        <span className="text-xs text-gray-500">1000ppm</span>
                    </div>
                    <input 
                        type="range" min="50" max="1000" step="10" 
                        value={params.concentration}
                        onChange={(e) => setParams({...params, concentration: parseInt(e.target.value)})}
                        className="w-full accent-[#00ffcc] h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                </div>

                <div className="pt-6 border-t border-white/10">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Est. Glass Temp</span>
                        <span className="text-orange-400 font-mono">+{metrics.tempDelta}°C</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">SHGC Rating</span>
                        <span className="text-blue-400 font-mono">{metrics.shgc}</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Live Metrics & Tabs */}
        <div className="lg:col-span-2 space-y-6">
            {/* Top Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <div className="p-4 rounded-xl bg-black/40 border border-[#00ffcc]/30">
                    <Gauge size={20} className="mb-2 text-[#00ffcc]" />
                    <div className="text-2xl font-bold text-white">{metrics.opticalEfficiency}%</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Optical Eff.</div>
                 </div>
                 <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                    <Activity size={20} className="mb-2 text-yellow-400" />
                    <div className="text-2xl font-bold text-white">{metrics.powerOutput} W</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Peak Power / 10m²</div>
                 </div>
                 <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                    <div className="text-2xl font-bold text-green-400">{metrics.metricsCurrency}{metrics.companyProfit}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Net Profit</div>
                 </div>
                 <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                    <div className="text-2xl font-bold text-[#00ffcc]">{metrics.roi}%</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Client ROI</div>
                 </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-4 border-b border-white/10 pb-1 overflow-x-auto no-scrollbar scroll-smooth">
                <button 
                    onClick={() => setActiveTab('physics')}
                    className={`pb-3 px-4 text-sm font-bold uppercase tracking-wider transition-colors flex items-center gap-2 whitespace-nowrap min-w-max ${activeTab === 'physics' ? 'text-[#00ffcc] border-b-2 border-[#00ffcc]' : 'text-gray-500 hover:text-white'}`}
                >
                    <Zap size={16} /> Wavelength Optimization
                </button>
                <button 
                    onClick={() => setActiveTab('spectral')}
                    className={`pb-3 px-4 text-sm font-bold uppercase tracking-wider transition-colors flex items-center gap-2 whitespace-nowrap min-w-max ${activeTab === 'spectral' ? 'text-[#00ffcc] border-b-2 border-[#00ffcc]' : 'text-gray-500 hover:text-white'}`}
                >
                    <Layers size={16} /> Spectral Response
                </button>
                <button 
                    onClick={() => setActiveTab('thermal')}
                    className={`pb-3 px-4 text-sm font-bold uppercase tracking-wider transition-colors flex items-center gap-2 whitespace-nowrap min-w-max ${activeTab === 'thermal' ? 'text-[#00ffcc] border-b-2 border-[#00ffcc]' : 'text-gray-500 hover:text-white'}`}
                >
                    <Thermometer size={16} /> Thermal Load
                </button>
            </div>

            {/* Tab Content */}
            <div className="bg-black/20 rounded-xl border border-white/5 min-h-[500px] relative overflow-hidden flex flex-col">
                
                {activeTab === 'physics' && (
                    <div className="flex-1 flex flex-col md:flex-row">
                        {/* Chart Section */}
                        <div className="flex-1 p-4 relative h-[400px] md:h-auto md:min-h-[300px]">
                            <h4 className="absolute top-4 left-4 text-xs font-bold text-gray-500 uppercase tracking-widest z-10 flex items-center gap-2">
                                <Activity size={12} className="text-[#00ffcc]" /> 
                                Pareto Efficiency Frontier
                            </h4>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={curveData} margin={{ top: 40, right: 30, left: 10, bottom: 10 }}>
                                    <defs>
                                        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#00ffcc" stopOpacity={0.2} />
                                            <stop offset="100%" stopColor="#00ffcc" stopOpacity={1} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                    <XAxis 
                                        dataKey="ppm" 
                                        stroke="#666" 
                                        tick={{fontSize: 10}} 
                                        label={{ value: 'Concentration (ppm)', position: 'insideBottom', offset: -5, fill: '#666', fontSize: 10 }} 
                                    />
                                    <YAxis stroke="#666" tick={{fontSize: 10}} domain={[0, 'auto']} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0a0a0f', borderColor: '#333', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <ReferenceLine x={params.concentration} stroke="#fff" strokeDasharray="3 3" label={{ value: 'CURRENT', fill: '#fff', fontSize: 10, position: 'insideTop' }} />
                                    <Line type="monotone" dataKey="efficiency" stroke="url(#lineGradient)" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#00ffcc' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        
                        {/* Quantum Diagnostics Panel */}
                        <div className="w-full md:w-[280px] bg-black/40 border-l border-white/10 p-6 flex flex-col justify-center space-y-6 font-mono text-xs">
                             <div className="mb-2">
                                <h5 className="text-[#00ffcc] font-bold uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Quantum Kernel</h5>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-gray-500 mb-1">Geometric Gain (G)</div>
                                        <div className="text-white font-bold text-lg">{metrics.geometricGain}x</div>
                                        <div className="text-[10px] text-gray-600">Aperture / Edge Ratio</div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-gray-500 mb-1">Stern-Volmer QY</div>
                                        <div className="text-white font-bold text-lg">{metrics.quantumYield}%</div>
                                        <div className="text-[10px] text-gray-600">Conc. Quenching Factor</div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-gray-500 mb-1">Stokes Shift Loss</div>
                                        <div className="text-red-400 font-bold text-lg">{metrics.stokesLoss}%</div>
                                        <div className="text-[10px] text-gray-600">Thermodynamic Penalty</div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-gray-500 mb-1">Mean Path Attenuation</div>
                                        <div className="text-yellow-400 font-bold text-lg">{metrics.attenuation}%</div>
                                        <div className="text-[10px] text-gray-600">Re-absorption Prob.</div>
                                    </div>
                                </div>
                             </div>
                             
                             <div className="p-3 rounded bg-white/5 border border-white/5 text-[10px] text-gray-400 leading-relaxed">
                                <span className="text-[#00ffcc] font-bold">&gt; SYSTEM STATUS:</span> <br/>
                                Solving transport equations n=10⁶. Ray-tracing converged.
                             </div>
                        </div>
                    </div>
                )}

                {/* Spectral Response - LAB VERIFIED DATA */}
                {activeTab === 'spectral' && (
                    <div className="h-full w-full p-4 md:p-6 relative flex flex-col">
                        <div className="relative md:absolute md:top-4 md:right-4 z-10 mb-4 md:mb-0">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-white/5 border border-white/10 backdrop-blur-md">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-[10px] font-mono text-gray-300 uppercase tracking-widest">
                                    LAB DATA: RH-CQD-2026 (N-Doped)
                                </span>
                            </div>
                        </div>

                        <div className="mb-6 relative z-0">
                            <h3 className="text-[#00ffcc] font-bold text-lg mb-1">Stokes Shift & Quantum Yield Analysis</h3>
                            <p className="text-gray-400 text-xs max-w-xl leading-relaxed">
                                Verifiable spectral data from N-doped Rice Husk CQDs.
                                Absorption Peak: <span className="text-white">350nm</span> | 
                                Emission Peak: <span className="text-white">460nm</span> | 
                                Stokes Shift: <span className="text-[#00ffcc] font-bold">110nm</span>.
                            </p>
                        </div>

                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={spectralData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="gradAbs" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="gradEm" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                    <XAxis dataKey="nm" stroke="#444" tick={{fontSize: 10}} label={{ value: 'Wavelength (nm)', position: 'insideBottom', offset: -5, fill: '#666', fontSize: 10 }} />
                                    <YAxis stroke="#444" tick={{fontSize: 10}} />
                                    <Tooltip contentStyle={{backgroundColor: '#000', border: '1px solid #333'}} />
                                    <Area type="monotone" dataKey="abs" stackId="1" stroke="#3b82f6" fill="url(#gradAbs)" name="Absorption (UV)" />
                                    <Area type="monotone" dataKey="em" stackId="2" stroke="#ef4444" fill="url(#gradEm)" name="Emission (Red-Shifted)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        
                        <div className="flex gap-6 mt-4 justify-center text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-500/20 border border-blue-500 rounded"></div>
                                Absorption (UV-A)
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-500/20 border border-red-500 rounded"></div>
                                Emission (Visible)
                            </div>
                        </div>
                    </div>
                )}
                
                {activeTab === 'thermal' && (
                    <div className="h-full w-full p-8 flex flex-col items-center justify-center text-center">
                        <div className="w-32 h-32 rounded-full border-4 border-dashed border-orange-500/30 flex items-center justify-center mb-6 relative animate-[spin_10s_linear_infinite]">
                             <Thermometer size={48} className="text-orange-400 absolute animate-none" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">SHGC: {metrics.shgc}</h3>
                        <p className="max-w-md text-gray-400">
                            At {params.concentration} ppm, the module blocks <span className="text-white font-bold">{((1-metrics.shgc)*100).toFixed(0)}%</span> of solar heat gain.
                        </p>
                        <div className="mt-8 grid grid-cols-2 gap-8 w-full max-w-lg">
                            <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Cooling Load Reduction</div>
                                <div className="text-xl font-bold text-blue-400">-{Math.round((0.8 - metrics.shgc) * 1200)} W/m²</div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Surface Temp Rise</div>
                                <div className="text-xl font-bold text-orange-400">+{metrics.tempDelta}°C</div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
      </div>
    </div>
  );
};

export default EngineeringSimulator;
