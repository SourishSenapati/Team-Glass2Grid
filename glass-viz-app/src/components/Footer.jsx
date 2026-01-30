import React from 'react';

const Footer = () => {
    return (
        <footer className="border-t border-white/10 mt-20 bg-black/40 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-2">
                    <div className="text-2xl font-bold tracking-tighter mb-4">
                        <span className="text-white">LUMI</span>
                        <span className="text-[#00ffcc]">CORE</span>
                    </div>
                    <p className="text-gray-400 max-w-sm">
                        Winner of Hult Prize 2026. Empowering farmers, energizing cities, and saving the planet one window at a time.
                    </p>
                </div>
                
                <div>
                    <h4 className="font-bold text-white mb-4">Platform</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li><a href="#" className="hover:text-[#00ffcc]">Technology</a></li>
                        <li><a href="#" className="hover:text-[#00ffcc]">Impact Model</a></li>
                        <li><a href="#" className="hover:text-[#00ffcc]">Farmers Program</a></li>
                    </ul>
                </div>
                
                <div>
                     <h4 className="font-bold text-white mb-4">Connect</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li><a href="#" className="hover:text-[#00ffcc]">Contact Us</a></li>
                        <li><a href="#" className="hover:text-[#00ffcc]">Investor Relations</a></li>
                        <li><a href="#" className="hover:text-[#00ffcc]">Twitter / X</a></li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-white/5 py-6 text-center text-xs text-gray-600">
                &copy; 2026 Lumicore Inc. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
