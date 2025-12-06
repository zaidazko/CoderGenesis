import React from 'react';
import { Terminal } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 text-white font-bold text-lg mb-4 md:mb-0">
            <Terminal className="text-orange-500 w-5 h-5" />
            <span className="font-space text-gray-300">CoderGenesis</span>
          </div>
          
          <div className="flex gap-8 text-sm text-gray-500 font-inter">
            <a href="#" className="hover:text-orange-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-orange-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-orange-400 transition-colors">Twitter</a>
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-600 font-mono">
          Built by Builders for Builders. &copy; {new Date().getFullYear()} CoderGenesis.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
