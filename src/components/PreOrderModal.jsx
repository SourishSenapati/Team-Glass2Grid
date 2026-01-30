import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, AlertCircle, TrendingUp, Shield, Zap, Award } from 'lucide-react';

const PreOrderModal = ({ isOpen, onClose, tier }) => {
    const [step, setStep] = useState(1); // 1: Benefits, 2: Form
    const [formType, setFormType] = useState(tier?.tag === 'COMMERCIAL' ? 'b2b' : 'b2c');
    const [formData, setFormData] = useState({
        // Common fields
        name: '',
        email: '',
        phone: '',
        
        // B2C specific
        address: '',
        city: '',
        zipCode: '',
        installationType: 'DIY',
        propertyType: 'Residential',
        
        // B2B specific
        company: '',
        position: '',
        industry: '',
        projectSize: '',
        budget: '',
        timeline: '',
        requirements: ''
    });

    const benefits = [
        {
            icon: TrendingUp,
            title: 'Early Bird Pricing',
            desc: 'Lock in 30% discount on current market price. Price protection for lifetime warranty period.',
            stat: '30% OFF'
        },
        {
            icon: Shield,
            title: 'Extended Warranty',
            desc: 'Pre-order customers get 25-year performance warranty vs. standard 20-year coverage.',
            stat: '25 YEARS'
        },
        {
            icon: Zap,
            title: 'Priority Installation',
            desc: 'Jump the queue. Guaranteed installation within 30 days of product launch (Q3 2026).',
            stat: 'Q3 2026'
        },
        {
            icon: Award,
            title: 'Founding Member Status',
            desc: 'Exclusive access to product upgrades, beta features, and lifetime customer support priority.',
            stat: 'VIP ACCESS'
        }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Here you would integrate with your backend/CRM
        alert('Thank you! Our team will contact you within 24 hours.');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/90 backdrop-blur-md"
                />
                
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0a0a0f] border border-[#00ffcc]/30 rounded-2xl shadow-[0_0_50px_rgba(0,255,204,0.2)]"
                >
                    <button 
                        onClick={onClose}
                        className="sticky top-4 right-4 float-right text-gray-400 hover:text-white transition-colors bg-black/50 p-2 rounded-full backdrop-blur-sm z-20"
                    >
                        <X size={24} />
                    </button>

                    {step === 1 && (
                        <div className="p-6 md:p-10">
                            <div className="mb-8">
                                <div className="inline-block px-4 py-2 bg-[#00ffcc]/10 border border-[#00ffcc]/30 rounded-full mb-4">
                                    <span className="text-[#00ffcc] text-xs font-bold uppercase tracking-widest">Limited Time Offer</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                                    Why Pre-Order {tier?.title}?
                                </h2>
                                <p className="text-gray-400 text-lg">
                                    Join the energy revolution. Be among the first 500 customers to secure exclusive benefits.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                                {benefits.map((benefit, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-[#00ffcc]/30 transition-colors group"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-[#00ffcc]/10 rounded-lg group-hover:bg-[#00ffcc]/20 transition-colors">
                                                <benefit.icon className="text-[#00ffcc]" size={24} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-white font-bold mb-2">{benefit.title}</h3>
                                                <p className="text-gray-400 text-sm leading-relaxed mb-3">{benefit.desc}</p>
                                                <div className="inline-block px-3 py-1 bg-black/60 rounded-full">
                                                    <span className="text-[#00ffcc] text-xs font-mono font-bold">{benefit.stat}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="bg-gradient-to-r from-[#00ffcc]/10 to-transparent border border-[#00ffcc]/20 rounded-xl p-6 mb-8">
                                <div className="flex items-start gap-4">
                                    <AlertCircle className="text-yellow-400 shrink-0" size={24} />
                                    <div>
                                        <h4 className="text-white font-bold mb-2">Limited Availability Risk</h4>
                                        <p className="text-gray-300 text-sm leading-relaxed">
                                            Our first production batch is capped at 500 units due to material supply constraints. 
                                            After pre-orders close, next availability is Q1 2027 at full retail price.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button 
                                    onClick={() => setStep(2)}
                                    className="flex-1 py-4 bg-[#00ffcc] text-black font-bold rounded-xl hover:bg-[#00b399] transition-all shadow-lg shadow-[#00ffcc]/30 hover:shadow-[#00ffcc]/50 flex items-center justify-center gap-2"
                                >
                                    Continue to Order <Check size={20} />
                                </button>
                                <button 
                                    onClick={onClose}
                                    className="px-6 py-4 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-all border border-white/10"
                                >
                                    Maybe Later
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="p-6 md:p-10">
                            <div className="mb-8">
                                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                                    {formType === 'b2b' ? 'Business Inquiry' : 'Customer Details'}
                                </h2>
                                <div className="flex gap-3 mb-6">
                                    <button 
                                        onClick={() => setFormType('b2c')}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${formType === 'b2c' ? 'bg-[#00ffcc] text-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                                    >
                                        Individual Customer
                                    </button>
                                    <button 
                                        onClick={() => setFormType('b2b')}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${formType === 'b2b' ? 'bg-[#00ffcc] text-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                                    >
                                        Business / Commercial
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Common Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 mb-2">
                                            Full Name *
                                        </label>
                                        <input 
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-lg text-white focus:border-[#00ffcc] focus:outline-none transition-colors"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 mb-2">
                                            Email Address *
                                        </label>
                                        <input 
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-lg text-white focus:border-[#00ffcc] focus:outline-none transition-colors"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">
                                        Phone Number *
                                    </label>
                                    <input 
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-lg text-white focus:border-[#00ffcc] focus:outline-none transition-colors"
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>

                                {/* B2B Specific Fields */}
                                {formType === 'b2b' && (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-400 mb-2">
                                                    Company Name *
                                                </label>
                                                <input 
                                                    type="text"
                                                    required
                                                    value={formData.company}
                                                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                                                    className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-lg text-white focus:border-[#00ffcc] focus:outline-none transition-colors"
                                                    placeholder="Acme Corp"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-400 mb-2">
                                                    Your Position *
                                                </label>
                                                <input 
                                                    type="text"
                                                    required
                                                    value={formData.position}
                                                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                                                    className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-lg text-white focus:border-[#00ffcc] focus:outline-none transition-colors"
                                                    placeholder="Facilities Manager"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-400 mb-2">
                                                    Industry Sector *
                                                </label>
                                                <select 
                                                    required
                                                    value={formData.industry}
                                                    onChange={(e) => setFormData({...formData, industry: e.target.value})}
                                                    className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-lg text-white focus:border-[#00ffcc] focus:outline-none transition-colors"
                                                >
                                                    <option value="">Select Industry</option>
                                                    <option value="Tech Park">Tech Park / IT Campus</option>
                                                    <option value="Commercial">Commercial Real Estate</option>
                                                    <option value="Hospitality">Hospitality / Hotels</option>
                                                    <option value="Healthcare">Healthcare Facilities</option>
                                                    <option value="Education">Educational Institutions</option>
                                                    <option value="Manufacturing">Manufacturing / Industrial</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-400 mb-2">
                                                    Project Size (sq.ft) *
                                                </label>
                                                <input 
                                                    type="number"
                                                    required
                                                    value={formData.projectSize}
                                                    onChange={(e) => setFormData({...formData, projectSize: e.target.value})}
                                                    className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-lg text-white focus:border-[#00ffcc] focus:outline-none transition-colors"
                                                    placeholder="10000"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-400 mb-2">
                                                    Budget Range (USD) *
                                                </label>
                                                <select 
                                                    required
                                                    value={formData.budget}
                                                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                                                    className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-lg text-white focus:border-[#00ffcc] focus:outline-none transition-colors"
                                                >
                                                    <option value="">Select Budget</option>
                                                    <option value="<50k">Less than $50,000</option>
                                                    <option value="50k-100k">$50,000 - $100,000</option>
                                                    <option value="100k-500k">$100,000 - $500,000</option>
                                                    <option value="500k-1M">$500,000 - $1 Million</option>
                                                    <option value=">1M">Over $1 Million</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-400 mb-2">
                                                    Preferred Timeline *
                                                </label>
                                                <select 
                                                    required
                                                    value={formData.timeline}
                                                    onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                                                    className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-lg text-white focus:border-[#00ffcc] focus:outline-none transition-colors"
                                                >
                                                    <option value="">Select Timeline</option>
                                                    <option value="Q3 2026">Q3 2026 (Launch)</option>
                                                    <option value="Q4 2026">Q4 2026</option>
                                                    <option value="2027">2027</option>
                                                    <option value="Flexible">Flexible</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-400 mb-2">
                                                Project Requirements & Special Needs
                                            </label>
                                            <textarea 
                                                value={formData.requirements}
                                                onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                                                rows="4"
                                                className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-lg text-white focus:border-[#00ffcc] focus:outline-none transition-colors resize-none"
                                                placeholder="Tell us about your project goals, technical requirements, sustainability targets, etc."
                                            />
                                        </div>
                                    </>
                                )}

                                {/* B2C Specific Fields */}
                                {formType === 'b2c' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-400 mb-2">
                                                Installation Address *
                                            </label>
                                            <input 
                                                type="text"
                                                required
                                                value={formData.address}
                                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                                                className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-lg text-white focus:border-[#00ffcc] focus:outline-none transition-colors"
                                                placeholder="123 Main Street, Apartment 4B"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-400 mb-2">
                                                    City *
                                                </label>
                                                <input 
                                                    type="text"
                                                    required
                                                    value={formData.city}
                                                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                                                    className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-lg text-white focus:border-[#00ffcc] focus:outline-none transition-colors"
                                                    placeholder="San Francisco"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-400 mb-2">
                                                    ZIP Code *
                                                </label>
                                                <input 
                                                    type="text"
                                                    required
                                                    value={formData.zipCode}
                                                    onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                                                    className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-lg text-white focus:border-[#00ffcc] focus:outline-none transition-colors"
                                                    placeholder="94102"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-400 mb-2">
                                                    Property Type *
                                                </label>
                                                <select 
                                                    required
                                                    value={formData.propertyType}
                                                    onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                                                    className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-lg text-white focus:border-[#00ffcc] focus:outline-none transition-colors"
                                                >
                                                    <option value="Residential">Single Family Home</option>
                                                    <option value="Apartment">Apartment / Condo</option>
                                                    <option value="Townhouse">Townhouse</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-400 mb-2">
                                                    Installation Preference *
                                                </label>
                                                <select 
                                                    required
                                                    value={formData.installationType}
                                                    onChange={(e) => setFormData({...formData, installationType: e.target.value})}
                                                    className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-lg text-white focus:border-[#00ffcc] focus:outline-none transition-colors"
                                                >
                                                    <option value="DIY">DIY Installation</option>
                                                    <option value="Professional">Professional Installation</option>
                                                    <option value="Undecided">Not Sure Yet</option>
                                                </select>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10">
                                    <button 
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="px-6 py-3 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-all border border-white/10"
                                    >
                                        Back
                                    </button>
                                    <button 
                                        type="submit"
                                        className="flex-1 py-3 bg-[#00ffcc] text-black font-bold rounded-xl hover:bg-[#00b399] transition-all shadow-lg shadow-[#00ffcc]/30 hover:shadow-[#00ffcc]/50"
                                    >
                                        Submit Pre-Order Inquiry
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PreOrderModal;
