import React from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="border-t border-white/10 mt-20 bg-black/40 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-2">
                    <div className="text-2xl font-bold tracking-tighter mb-4">
                        <span className="text-white">LUMI</span>
                        <span className="text-[#00ffcc]">CORE</span>
                    </div>
                    <p className="text-gray-400 max-w-sm mb-6">
                        Winner of Hult Prize 2026. Empowering farmers, energizing cities, and saving the planet one window at a time.
                    </p>
                    <div className="flex gap-4">
                        <a 
                            href="https://github.com/SourishSenapati" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-[#00ffcc] transition-colors"
                            aria-label="GitHub"
                        >
                            <Github size={20} />
                        </a>
                        <a 
                            href="https://www.linkedin.com/in/sourish-senapati-0aba921b1/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-[#00ffcc] transition-colors"
                            aria-label="LinkedIn"
                        >
                            <Linkedin size={20} />
                        </a>
                        <a 
                            href="https://x.com/SenapatiSourish" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-[#00ffcc] transition-colors"
                            aria-label="Twitter / X"
                        >
                            <Twitter size={20} />
                        </a>
                    </div>
                </div>
                
                <div>
                    <h4 className="font-bold text-white mb-4">Platform</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li><a href="#technology" className="hover:text-[#00ffcc] transition-colors">Technology</a></li>
                        <li><a href="#impact" className="hover:text-[#00ffcc] transition-colors">Impact Model</a></li>
                        <li><a href="#lcaa" className="hover:text-[#00ffcc] transition-colors">Life Cycle Analysis</a></li>
                    </ul>
                </div>
                
                <div>
                     <h4 className="font-bold text-white mb-4">Connect</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li><a href="mailto:sourishsenapati791@gmail.com" className="hover:text-[#00ffcc] transition-colors">Contact Us</a></li>
                        <li><a href="https://github.com/SourishSenapati" target="_blank" rel="noopener noreferrer" className="hover:text-[#00ffcc] transition-colors">GitHub</a></li>
                        <li><a href="https://www.linkedin.com/in/sourish-senapati-0aba921b1/" target="_blank" rel="noopener noreferrer" className="hover:text-[#00ffcc] transition-colors">LinkedIn</a></li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-white/5 py-6 px-4 md:px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
                    <div>&copy; 2026 Lumicore Inc. All rights reserved.</div>
                    <div className="flex items-center gap-2">
                        <span>Built by</span>
                        <a 
                            href="https://github.com/SourishSenapati" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[#00ffcc] hover:text-white font-semibold transition-colors"
                        >
                            Sourish Senapati
                        </a>
                        <span className="text-gray-700">•</span>
                        <span className="text-pink-500">Made with ❤️</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
