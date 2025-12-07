import React from 'react';
import { Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tight group cursor-pointer">
            <Terminal className="text-orange-500 w-6 h-6 group-hover:text-orange-400 transition-colors" />
            <span className="font-space">CoderGenesis</span>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#features" className="hover:text-orange-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-orange-400 transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-orange-400 transition-colors">Pricing</a>
          </div>

          {/* CTA */}
          <div>
            <Link to="/playground">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(249, 115, 22, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2 bg-orange-600 text-white rounded-lg font-medium text-sm hover:bg-orange-500 transition-colors shadow-[0_0_10px_rgba(249,115,22,0.3)] font-space"
              >
                Generate Blueprint
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
