import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Truck, Factory, Recycle, Activity, Play, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const LCAAModel = ({ currency = 'USD', exchangeRate = 1 }) => {
    const [isTraining, setIsTraining] = useState(false);
    const [progress, setProgress] = useState(0);
    const [optimizationData, setOptimizationData] = useState([]);
    const [converged, setConverged] = useState(false);

    // Physics / Environmental Constants
    const DENSITY_GLASS = 2500; // kg/m^3
    const DENSITY_PMMA = 1180; // kg/m^3
    const DENSITY_ALUMINUM = 2700; // kg/m^3

    const EE_GLASS = 15; // MJ/kg (Embodied Energy)
    const EE_PMMA = 80; // MJ/kg
    const EE_ALUMINUM = 155; // MJ/kg

    const CO2_GLASS = 0.85; // kgCO2/kg
    const CO2_PMMA = 4.5; // kgCO2/kg
    const CO2_ALUMINUM = 11.2; // kgCO2/kg

    // State for Simulation
    const [params, setParams] = useState({
        area: 1000, // m2
        thickness: 8, // mm
        gridIntensity: 0.45, // kgCO2/kWh (Global Avg)
        transportDist: 500, // km
        lifespan: 30, // years
    });

    // Calculated Metrics
    const [metrics, setMetrics] = useState({
        totalMass: 0,
        embodiedCarbon: 0,
        energyPayback: 0,
        netCarbon: 0
    });

    useEffect(() => {
        calculateLCAA();
    }, [params]);

    const calculateLCAA = () => {
        // 1. Material Physics
        const vol_glass = params.area * (params.thickness / 1000) * 0.95; // 95% Glass
        const vol_pmma = params.area * (params.thickness / 1000) * 0.05; // 5% Interlayer
        
        const mass_glass = vol_glass * DENSITY_GLASS;
        const mass_pmma = vol_pmma * DENSITY_PMMA;
        const mass_frame = params.area * 5; // approx 5kg/m2 framing

        // 2. Embodied Carbon (Cradle-to-Gate)
        const ec_material = (mass_glass * CO2_GLASS) + (mass_pmma * CO2_PMMA) + (mass_frame * CO2_ALUMINUM);
        const ec_transport = (mass_glass + mass_pmma + mass_frame) * (params.transportDist / 1000) * 0.06; // 0.06 kgCO2/ton-km
        
        const total_ec = ec_material + ec_transport;

        // 3. Operational Offset (Physics-Informed Yield)
        // Using average 120 kWh/m2/yr from Engineering Sim
        const annual_gen = params.area * 120; 
        const annual_offset = annual_gen * params.gridIntensity;

        // 4. Energy Payback Time (EPBT)
        // Embodied Energy (MJ) -> kWh (1 kWh = 3.6 MJ)
        const total_ee_mj = (mass_glass * EE_GLASS) + (mass_pmma * EE_PMMA) + (mass_frame * EE_ALUMINUM);
        const total_ee_kwh = total_ee_mj / 3.6;
        const epbt = total_ee_kwh / annual_gen;

        setMetrics({
            totalMass: (mass_glass + mass_pmma + mass_frame).toFixed(0),
            embodiedCarbon: (total_ec / 1000).toFixed(1), // Tonnes
            energyPayback: epbt.toFixed(2),
            netCarbon: ((annual_offset * params.lifespan) - total_ec)/1000 // Net saved in Tonnes
        });
    };

    const runTraining = () => {
        setIsTraining(true);
        setConverged(false);
        setProgress(0);
        const data = [];
        let currentEc = metrics.embodiedCarbon * 1.5; // Start high

        let step = 0;
        const interval = setInterval(() => {
            step++;
            const reduction = Math.exp(-step * 0.1) * (Math.random() * 0.5);
            currentEc = Math.max(metrics.embodiedCarbon, currentEc - reduction);
            
            data.push({ epoch: step, carbon: currentEc });
            setOptimizationData([...data]);
            setProgress(step);

            if (step >= 50) {
                clearInterval(interval);
                setIsTraining(false);
                setConverged(true);
            }
        }, 50);
    };

    return (
        <div className="py-16 md:py-24 relative overflow-hidden bg-black/40">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                    
                    {/* Left Panel: Inputs & Theory */}
                    <div>
                         <div className="flex items-center gap-3 mb-6">
                            <Leaf className="text-green-400" size={32} />
                            <h2 className="text-3xl font-bold">LCAA <span className="text-gray-500">Model</span></h2>
                         </div>
                         <p className="text-gray-400 mb-8">
                             Physics-aware Life Cycle Assessment Analysis. Calculates precise environmental impact based on material stoichiometry and grid topology.
                         </p>

                         <div className="space-y-6 bg-white/5 p-6 rounded-xl border border-white/10">
                            <div>
                                <label className="flex justify-between text-xs font-bold uppercase text-gray-500 mb-2">
                                    <span>Grid Carbon Intensity</span>
                                    <span className="text-white">{params.gridIntensity} kg/kWh</span>
                                </label>
                                <input 
                                    type="range" min="0.1" max="1.0" step="0.05"
                                    value={params.gridIntensity}
                                    onChange={(e) => setParams({...params, gridIntensity: parseFloat(e.target.value)})}
                                    className="w-full accent-green-400 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                            
                            <div>
                                <label className="flex justify-between text-xs font-bold uppercase text-gray-500 mb-2">
                                    <span>Logistics Distance</span>
                                    <span className="text-white">{params.transportDist} km</span>
                                </label>
                                <input 
                                    type="range" min="100" max="5000" step="100"
                                    value={params.transportDist}
                                    onChange={(e) => setParams({...params, transportDist: parseInt(e.target.value)})}
                                    className="w-full accent-green-400 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                             <div className="pt-4 border-t border-white/10">
                                <button 
                                    onClick={runTraining}
                                    disabled={isTraining}
                                    className={`w-full py-3 rounded-lg font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all
                                        ${isTraining ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' : 
                                          converged ? 'bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30' : 
                                          'bg-white/10 hover:bg-white/20 text-white'}`}
                                >
                                    {isTraining ? <Activity className="animate-spin" size={18} /> : 
                                     converged ? <Recycle size={18} /> : 
                                     <Play size={18} />}
                                    {isTraining ? 'Training Optimizer...' : 
                                     converged ? 'Retrain Network' : 
                                     'Train LCAA Network'}
                                </button>
                             </div>
                         </div>
                    </div>

                    {/* Middle: Visualization */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Simulation Screen */}
                        <div className="bg-black/80 rounded-2xl border border-white/10 h-[300px] md:h-[400px] relative overflow-hidden flex flex-col p-4 md:p-6">
                            
                            {!optimizationData.length ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
                                    <Activity size={48} className="mb-4" />
                                    <p className="font-mono text-sm">AWAITING TRAINING DATA STREAM...</p>
                                </div>
                            ) : (
                                <div className="h-full w-full">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-xs font-bold text-green-400 uppercase tracking-widest flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                            Gradient Descent Loss (Carbon)
                                        </h4>
                                        <span className="font-mono text-xs text-gray-500">EPOCH: {progress}/50</span>
                                    </div>
                                    <ResponsiveContainer width="100%" height="85%">
                                        <AreaChart data={optimizationData}>
                                            <defs>
                                                <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                            <XAxis dataKey="epoch" stroke="#444" tick={{fontSize: 10}} />
                                            <YAxis stroke="#444" tick={{fontSize: 10}} domain={['dataMin', 'auto']} />
                                            <Tooltip contentStyle={{backgroundColor: '#111', border: '1px solid #333'}} />
                                            <Area type="monotone" dataKey="carbon" stroke="#4ade80" fillOpacity={1} fill="url(#colorCarbon)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </div>

                        {/* Result Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Embodied Carbon</div>
                                <div className="text-2xl font-bold text-white">{metrics.embodiedCarbon} <span className="text-xs font-normal text-gray-400">tCO2e</span></div>
                            </div>
                             <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Energy Payback</div>
                                <div className="text-2xl font-bold text-green-400">{metrics.energyPayback} <span className="text-xs font-normal text-gray-400">yrs</span></div>
                            </div>
                             <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Net Lifetime Offset</div>
                                <div className="text-2xl font-bold text-blue-400">{metrics.netCarbon.toFixed(1)} <span className="text-xs font-normal text-gray-400">tCO2e</span></div>
                            </div>
                             <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">System Mass</div>
                                <div className="text-2xl font-bold text-gray-300">{(metrics.totalMass/1000).toFixed(1)} <span className="text-xs font-normal text-gray-400">mT</span></div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default LCAAModel;
