import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-space">Simple Pricing</h2>
          <p className="text-gray-400 font-inter">Start drafting for free. Upgrade for the full blueprint.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="p-8 rounded-2xl bg-gray-900/20 border border-white/10 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2 font-space">The Sketch</h3>
            <div className="text-4xl font-bold text-white mb-6 font-mono">$0<span className="text-lg text-gray-500 font-sans font-normal">/mo</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              {[
                "Idea Generation & Validation",
                "Basic MVP Feature List",
                "Tech Stack Recommendations",
                "Limit: 3 Projects / Day"
              ].map((item, i) => (
                <li key={i} className="flex items-start text-gray-300">
                  <Check className="w-5 h-5 text-gray-500 mr-3 mt-0.5 shrink-0" />
                  <span className="font-inter text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-lg border border-white/20 text-white font-medium hover:bg-white/5 transition-colors font-space">
              Start Free
            </button>
          </div>

          {/* Pro Plan */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="p-8 rounded-2xl bg-gradient-to-b from-orange-900/10 to-gray-900/20 border border-orange-500/50 flex flex-col relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg font-space tracking-wider">POPULAR</div>
            <h3 className="text-xl font-bold text-white mb-2 font-space">The Architect</h3>
            <div className="text-4xl font-bold text-white mb-6 font-mono">$20<span className="text-lg text-gray-500 font-sans font-normal">/mo</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              {[
                "Everything in Free",
                "Full SQL Database Schema (Ready for Supabase)",
                "Interactive Mermaid.js Architecture Diagrams",
                "Detailed API Contracts & Endpoints",
                "Edge Case & Risk Analysis",
                "Unlimited Projects",
                "Export to PDF/Markdown"
              ].map((item, i) => (
                <li key={i} className="flex items-start text-white">
                  <Check className="w-5 h-5 text-orange-500 mr-3 mt-0.5 shrink-0" />
                  <span className="font-inter text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-lg bg-orange-600 text-white font-medium hover:bg-orange-500 transition-colors shadow-[0_0_20px_rgba(249,115,22,0.3)] font-space">
              Get Pro
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
