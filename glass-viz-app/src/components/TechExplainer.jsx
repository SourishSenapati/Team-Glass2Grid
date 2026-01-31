import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Recycle, Sun, BatteryCharging, Zap, X } from 'lucide-react';

const TechExplainer = () => {
    const steps = [
        {
            icon: Recycle,
            step: "01",
            title: "Biomass Feedstock Acquisition",
            subtitle: "Sustainable Sourcing & Circular Economy",
            desc: "Lumicore establishes a rigorous supply chain by collecting silica-rich agricultural residues, specifically rice husk and sugarcane bagasse, directly from partner cooperative networks.",
            techDetails: [
                {
                    label: "Traceable Supply Chain",
                    title: "Blockchain-Verified Logistics",
                    desc: "Implementation of blockchain-enabled ledger allows for granular tracking of every biomass batch from specific cooperative farms to our processing facility. This ensures 100% adherence to fair-trade practices and validates the 'waste' status of the feedstock, preventing incentive for primary crop diversion."
                },
                {
                    label: "High Silica Content (>20%)",
                    title: "Biogenic Silica Precursor",
                    desc: "Rice husk is a unique biogenic material containing 15-20% silica (SiO2) by weight in its natural state, which rises to >90% upon calcination. This biogenic silica is amorphous and highly reactive, making it an ideal, low-energy precursor for hydrothermal synthesis compared to energy-intensive quartz sand mining."
                },
                {
                    label: "Carbon Sequestration",
                    title: "Net-Negative Emissions",
                    desc: "By preventing the open-field burning of rice husks—a common practice releasing CO2, methane, and particulate matter—we effectively lock the carbon into our building materials. The net lifecycle analysis indicates a carbon-negative process, as the avoided emissions exceed the manufacturing energy footprint."
                },
                {
                    label: "Farmer Revenue Stream",
                    title: "Waste-to-Wealth Model",
                    desc: "We monetize agricultural waste, creating a secondary income channel for rural agrarian communities. This model provides financial stability to farmers while securing our raw material supply at stable, decoupled-from-market prices."
                }
            ],
            color: "text-green-400",
            borderColor: "border-green-400/30",
            bgGradient: "from-green-400/10 to-transparent"
        },

        {
            icon: Zap,
            step: "02",
            title: "Hybrid Material Synthesis",
            subtitle: "Upcycling Waste with Engineered Precision",
            desc: "We combine agricultural waste-derived carbon with engineered additives to create a robust hybrid material that overcomes the limitations of pure biomass-derived dots.",
            techDetails: [
                {
                    label: "Hybrid Design Philosophy",
                    title: "The Best of Both Worlds",
                    desc: "Pure waste-derived materials often suffer from low brightness. We use agricultural waste as the sustainable carbon backbone while integrating safe performance enhancers to ensure commercial-grade efficiency and stability."
                },
                {
                    label: "Performance Enhancers",
                    title: "Dopants & Stabilizers",
                    desc: "We introduce Nitrogen dopants to drastically improve light emission efficiency and Red-Emissive Stabilizers to reduce re-absorption losses, ensuring the material performs reliably in real-world conditions."
                },
                {
                    label: "Durability Engineering",
                    title: "UV-Protective Shield",
                    desc: "To prevent degradation from harsh sunlight, we incorporate UV-protective nanoparticles into the hybrid matrix, extending the operational lifetime of the glass to match industry standards (20+ years)."
                },
                {
                    label: "Non-Toxic Chemistry",
                    title: "Bio-Compatible Materials",
                    desc: "Our hybrid carbon-based materials remain free from toxic heavy metals like Cadmium or Lead, ensuring safety for residential deployment and simplifying end-of-life recycling."
                }
            ],
            color: "text-yellow-400",
            borderColor: "border-yellow-400/30",
            bgGradient: "from-yellow-400/10 to-transparent"
        },
        {
            icon: Sun,
            step: "03",
            title: "Photon Management",
            subtitle: "Stokes Shift & Total Internal Reflection",
            desc: "The core physics of Lumicore relies on the 'Stokes Shift'—the difference between absorption and emission spectra. Our CQDs aggressively absorb high-energy UV and blue photons and re-emit them as lower-energy red/IR photons.",
            techDetails: [
                {
                    label: "Large Stokes Shift (>100nm)",
                    title: "Eliminating Re-Absorption",
                    desc: "A large spectral distance between absorption and emission peaks (>100nm) is critical. It ensures that the emitted light (red-shifted) does not overlap with the absorption spectrum of the CQDs, effectively eliminating 're-absorption losses' as the light travels through the glass waveguide."
                },
                {
                    label: "TIR Trapping Efficiency",
                    title: "Total Internal Reflection",
                    desc: "TIR occurs when light traveling in a higher index medium (Glass n=1.5) hits the boundary of a lower medium (Air n=1.0) beyond the critical angle (~42°). Our matrix orientation maximizes isotropic emission within this 'trapping cone', guiding >75% of photons to the edge."
                },
                {
                    label: "Waveguiding Mode Control",
                    title: "Loss Minimization",
                    desc: "The glass substrate acts as a multimode waveguide. We strictly control surface roughness and matrix homogeneity to prevent scattering, which would cause light to escape the waveguide face. This ensures photons travel significant distances (up to 2m) with minimal attenuation."
                },
                {
                    label: "Self-Absorption Suppression",
                    title: "Frank-Condon Shift",
                    desc: "By engineering a shift in the electronic density of states of our CQDs, we ensure the emission state is energetically distinct from the ground state absorption. This creates a virtual 'one-way valve' for photons."
                }
            ],
            color: "text-cyan-400",
            borderColor: "border-cyan-400/30",
            bgGradient: "from-cyan-400/10 to-transparent"
        },
        {
            icon: BatteryCharging,
            step: "04",
            title: "Edge-Coupled Generation",
            subtitle: "High-Concentration Photovoltaic Conversion",
            desc: "Once the photons reach the edge of the glass, they are harvested by frame-integrated, high-efficiency monocrystalline silicon photovoltaic strips.",
            techDetails: [
                {
                    label: "Geometric Gain Factor",
                    title: "Area Ratio Amplification",
                    desc: "Gain (G) is the ratio of collecting area (window) to generating area (edges). For a 1m² window with 5mm thickness, the ratio is 200:1. This concentration effect drastically amplifies photon flux at the edge, reducing silicon usage by 95%."
                },
                {
                    label: "Edge-Mounted Mono-Si Cells",
                    title: "Spectral Matching",
                    desc: "We utilize high-efficiency Monocrystalline Silicon strips diced for edge mounting. These cells are optimized for the specific red-shifted spectrum emitted by our CQDs, operating at a higher efficiency point than under standard AM1.5 global spectrum."
                },
                {
                    label: "Frame Integration",
                    title: "Invisible Power",
                    desc: "PV strips are hermetically sealed within the structural aluminum framing (mullions/transoms). This protects them from weathering and mechanical damage while making the electrical components completely invisible to building occupants."
                },
                {
                    label: "Thermal Dissipation Chassis",
                    title: "Passive Cooling",
                    desc: "Concentrating light also concentrates heat. The aluminum frame acts as a massive heat sink, passively dissipating thermal energy. This keeps cells at optimal operating temperatures prevents voltage drop without active cooling."
                }
            ],
            color: "text-purple-400",
            borderColor: "border-purple-400/30",
            bgGradient: "from-purple-400/10 to-transparent"
        },
        {
            icon: BatteryCharging,
            step: "05",
            title: "Smart Building Integration",
            subtitle: "Self-Powered IoT Ecosystem",
            desc: "The energy harvested by our windows directly powers critical building intelligence systems, creating a decentralized, self-sustaining sensor network.",
            techDetails: [
                {
                    label: "Air Quality Monitoring",
                    title: "Healthier Interiors",
                    desc: "Continuous power for CO2, PM2.5, and VOC sensors allows buildings to autonomously regulate ventilation, ensuring optimal indoor air quality for occupants without manual intervention."
                },
                {
                    label: "Occupancy & Automation",
                    title: "Responsive Spaces",
                    desc: "Self-powered occupancy sensors enable granular lighting and HVAC control, turning off systems in empty rooms to further reduce building energy consumption."
                },
                {
                    label: "Zero-Maintenance Infrastructure",
                    title: "No Wires, No Batteries",
                    desc: "By generating power locally at the window edge, we eliminate the need for expensive copper wiring runs or the labor-intensive replacement of thousands of sensor batteries."
                }
            ],
            color: "text-blue-400",
            borderColor: "border-blue-400/30",
            bgGradient: "from-blue-400/10 to-transparent"
        }
    ];

    const [expanded, setExpanded] = useState({});
    const [activeDetail, setActiveDetail] = useState(null);

    const toggleExpand = (index) => {
        setExpanded(prev => ({ ...prev, [index]: !prev[index] }));
    };

    return (
        <div className="py-24 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-[#0a0a0f] to-black opacity-80 z-0" />

            {/* Detail Overlay */}
            <AnimatePresence>
                {activeDetail && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setActiveDetail(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div 
                            layoutId={`detail-${activeDetail.label}`}
                            className="bg-[#0a0a0f] border border-[#00ffcc]/30 rounded-2xl p-6 md:p-8 max-w-2xl w-full relative z-10 shadow-[0_0_50px_rgba(0,255,204,0.1)] overflow-y-auto max-h-[90vh]"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <button 
                                onClick={() => setActiveDetail(null)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-20 bg-[#0a0a0f]/50 p-1 rounded-full backdrop-blur-sm"
                            >
                                <X size={24} />
                            </button>
                            
                            <div className="mb-2 text-[#00ffcc] text-xs font-bold uppercase tracking-widest border border-[#00ffcc]/30 px-3 py-1 rounded-full inline-block">
                                Technical Deep Dive
                            </div>
                            
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{activeDetail.title}</h3>
                            <h4 className="text-gray-400 font-mono text-sm mb-6 uppercase border-b border-white/10 pb-4">{activeDetail.label}</h4>
                            
                            <p className="text-gray-300 leading-relaxed text-base md:text-lg">
                                {activeDetail.desc}
                            </p>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            
            <div className="relative z-10 container mx-auto px-4">
                <div className="text-center mb-20">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block mb-4 px-4 py-1 rounded-full border border-[#00ffcc] text-[#00ffcc] text-xs font-bold tracking-widest uppercase bg-[#00ffcc]/10"
                    >
                        Scientific Methodology
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Integrated <span className="text-gradient">Photonics Architecture</span>
                    </h2>
                    <p className="text-[var(--text-muted)] max-w-3xl mx-auto text-lg leading-relaxed">
                        Our proprietary Luminescent Solar Concentrator (LSC) technology decouples light collection from electricity generation, enabling transparent energy harvesting through a sophisticated four-stage process.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative">
                    {/* Timeline Line (Desktop only) */}
                    <div className="hidden md:block absolute left-1/2 top-40 bottom-20 w-px bg-gradient-to-b from-[#00ffcc]/0 via-[#00ffcc]/30 to-[#00ffcc]/0 -translate-x-1/2" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className={`relative ${index % 2 === 0 ? "md:text-right md:pr-12" : "md:text-left md:pl-12"} mb-12 last:mb-0`} 
                        >
                            {/* Center Dot */}
                            <div className="hidden md:flex absolute top-6 -right-[24px] w-4 h-4 rounded-full border-[3px] border-[#0a0a0f] bg-[#00ffcc] z-20 shadow-[0_0_15px_#00ffcc]
                                items-center justify-center transform
                                data-[side=left]:-right-[26px] data-[side=right]:-left-[26px]"
                                data-side={index % 2 === 0 ? "left" : "right"}
                            />

                            {/* Card */}
                            <div className={`glass-panel p-6 md:p-8 hover:border-opacity-50 transition-all group h-full border ${step.borderColor} relative overflow-hidden`}>
                                {/* Hover Gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${step.bgGradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                                
                                <div className={`flex items-start gap-4 mb-4 ${index % 2 === 0 ? "md:flex-row-reverse" : "flex-row"}`}>
                                    <div className={`p-3 md:p-4 rounded-xl bg-white/5 ${step.color} shadow-lg backdrop-blur-sm shrink-0 z-10`}>
                                        <step.icon size={28} strokeWidth={1.5} />
                                    </div>
                                    <div className="flex-1 min-w-0 relative">
                                        {/* Watermark Number */}
                                        <span className={`absolute -top-6 ${index % 2 === 0 ? "md:-right-4 right-auto left-0" : "-left-4"} text-7xl font-black opacity-[0.07] ${step.color} font-mono select-none pointer-events-none`}>
                                            {step.step}
                                        </span>
                                        {/* Title */}
                                        <h3 className="text-xl md:text-2xl font-bold text-white relative z-10 leading-tight pt-2">{step.title}</h3>
                                        <h4 className={`text-xs font-bold uppercase tracking-wider ${step.color} opacity-80 mt-1 relative z-10`}>{step.subtitle}</h4>
                                    </div>
                                </div>
                                
                                {/* Description with Read More */}
                                <div className="relative mb-6">
                                    <p className={`text-gray-300 leading-relaxed text-sm md:text-base font-light transition-all ${expanded[index] ? '' : 'line-clamp-3'}`}>
                                        {step.desc}
                                    </p>
                                    <button 
                                        onClick={() => toggleExpand(index)}
                                        className={`text-xs font-bold uppercase tracking-wider mt-2 hover:text-white transition-colors ${step.color.replace('text-', 'text-')}`}
                                    >
                                        {expanded[index] ? 'Read Less' : 'Read More'}
                                    </button>
                                </div>

                                <div className={`flex flex-wrap gap-2 ${index % 2 === 0 ? "md:justify-end" : "justify-start"}`}>
                                    {step.techDetails.map((detail, i) => (
                                        <motion.button
                                            key={i}
                                            layoutId={`detail-${detail.label}`}
                                            onClick={() => setActiveDetail(detail)}
                                            className="px-2 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] md:text-xs font-bold text-gray-400 hover:text-white hover:border-[#00ffcc] hover:bg-[#00ffcc]/10 transition-all cursor-pointer text-left"
                                        >
                                            {detail.label}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

        {/* Visual Summary Block - PHYSICS TELEMETRY */}
        <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 glass-panel p-1 rounded-3xl overflow-hidden max-w-6xl mx-auto"
        >
             <div className="bg-[#050505] rounded-[22px] p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00ffcc] opacity-5 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="flex flex-col md:flex-row items-end justify-between mb-8 border-b border-white/10 pb-6 gap-4">
                    <div>
                        <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                             <span className="w-2 h-2 bg-[#00ffcc] rounded-full animate-pulse" />
                             Physics Simulation Kernel
                        </h3>
                        <p className="text-gray-400 text-sm font-mono uppercase tracking-wider">Real-time Photon Dynamics & Loss Analysis</p>
                    </div>
                    <div className="text-right hidden md:block">
                        <div className="text-[#00ffcc] font-mono text-xs">v2.5.1 STABLE</div>
                        <div className="text-gray-600 font-mono text-xs">Monte Carlo Ray Tracing: ACTIVE</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                     <div className="p-5 rounded-xl bg-white/5 border border-white/5 relative group hover:border-[#00ffcc]/30 transition-colors">
                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-2 group-hover:text-[#00ffcc]">Geometric Gain (G)</div>
                        <div className="text-3xl font-mono font-bold text-white mb-1">5.2<span className="text-sm text-gray-500">x</span></div>
                        <div className="text-[10px] text-gray-600">Aperture / Edge Area Ratio</div>
                     </div>
                     
                     <div className="p-5 rounded-xl bg-white/5 border border-white/5 relative group hover:border-yellow-400/30 transition-colors">
                         <div className="text-xs text-gray-500 uppercase tracking-widest mb-2 group-hover:text-yellow-400">Stokes Shift</div>
                         <div className="text-3xl font-mono font-bold text-white mb-1">128<span className="text-sm text-gray-500">nm</span></div>
                        <div className="text-[10px] text-gray-600">Absorption-Emission Delta</div>
                     </div>

                     <div className="p-5 rounded-xl bg-white/5 border border-white/5 relative group hover:border-blue-400/30 transition-colors">
                         <div className="text-xs text-gray-500 uppercase tracking-widest mb-2 group-hover:text-blue-400">Mean Free Path</div>
                         <div className="text-3xl font-mono font-bold text-white mb-1">18.5<span className="text-sm text-gray-500">cm</span></div>
                        <div className="text-[10px] text-gray-600">Pre-Attenuated Travel</div>
                     </div>

                     <div className="p-5 rounded-xl bg-white/5 border border-white/5 relative group hover:border-purple-400/30 transition-colors">
                         <div className="text-xs text-gray-500 uppercase tracking-widest mb-2 group-hover:text-purple-400">Optical Efficiency</div>
                         <div className="text-3xl font-mono font-bold text-white mb-1">6.8<span className="text-sm text-gray-500">%</span></div>
                        <div className="text-[10px] text-gray-600">LSC System Total Yield</div>
                     </div>
                </div>

                <div className="mt-6 flex justify-between items-center text-[10px] text-gray-700 font-mono border-t border-white/5 pt-4">
                    <span>*Calculated using Stern-Volmer quenching model at 500ppm load.</span>
                    <span className="hidden md:inline">RUN_ID: 8872-WX-LUMICORE</span>
                </div>
            </div>
        </motion.div>

      </div>
    </div>
  );
};

export default TechExplainer;
