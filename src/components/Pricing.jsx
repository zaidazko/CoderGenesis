import React, { useState } from 'react';
import { Check, Lock, Zap, Rocket, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  // Pricing constants
  const MONTHLY_PRICE = 9;
  const ANNUAL_PRICE = 90; // $7.50/mo equivalent (2 months free)
  const MONTHLY_EQUIVALENT = (ANNUAL_PRICE / 12).toFixed(2); // $7.50

  return (
    <section id="pricing" className="py-20 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-space">
            Simple Pricing
          </h2>
          <p className="text-gray-400 font-inter">
            Start drafting for free. Upgrade for the full blueprint.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-sm font-medium transition-colors ${!isAnnual ? 'text-white' : 'text-gray-500'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              isAnnual ? 'bg-orange-600' : 'bg-gray-700'
            }`}
          >
            <motion.div
              animate={{ x: isAnnual ? 28 : 4 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
            />
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium transition-colors ${isAnnual ? 'text-white' : 'text-gray-500'}`}>
              Yearly
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold font-mono">
              2 MONTHS FREE
            </span>
          </div>
        </div>

        {/* 2 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Free Plan */}
          <div className="p-8 rounded-2xl bg-gray-900/20 border border-white/10 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2 font-space">Free</h3>
            {/* Fixed height to match Pro plan pricing area */}
            <div className="h-[72px] mb-2">
              <div className="text-4xl font-bold text-white font-mono">
                $0<span className="text-lg text-gray-500 font-sans font-normal">/mo</span>
              </div>
              <p className="text-sm opacity-0 mt-1">Placeholder</p>
            </div>
            <p className="text-sm text-gray-500 mb-6 font-inter">3 blueprints per month</p>
            
            {/* AI Model Badge */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 mb-6">
              <Zap className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-sm font-mono">Gemini 2.5 Flash Lite</span>
            </div>
            
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-3 text-gray-300">
                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-sm">App Manifest (PRD)</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-sm">File Structure</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-sm">System Architecture</span>
              </li>
              
              <li className="pt-2" />
              
              <li className="flex items-center gap-3 text-gray-600">
                <Lock className="w-5 h-5 text-gray-700 shrink-0" />
                <span className="text-sm">Database Schema</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <Lock className="w-5 h-5 text-gray-700 shrink-0" />
                <span className="text-sm">Cost Analysis</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <Lock className="w-5 h-5 text-gray-700 shrink-0" />
                <span className="text-sm">Edit & Refine</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <Lock className="w-5 h-5 text-gray-700 shrink-0" />
                <span className="text-sm">Export Options</span>
              </li>
            </ul>

            <button className="w-full py-3 rounded-lg border border-white/20 text-white font-medium hover:bg-white/5 transition-colors font-space">
              Start Building
            </button>
          </div>

          {/* Pro Plan */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="p-8 rounded-2xl bg-gradient-to-b from-orange-900/20 to-gray-900/20 border-2 border-orange-500/50 flex flex-col relative overflow-hidden shadow-[0_0_40px_rgba(249,115,22,0.1)]"
          >
            <div className="absolute top-0 right-0 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg font-space tracking-wider">
              POPULAR
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2 font-space">Pro</h3>
            
            {/* Dynamic Price Display - Fixed height to prevent layout shift */}
            <div className="mb-2 h-[72px]">
              <motion.div
                key={isAnnual ? 'annual' : 'monthly'}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="text-4xl font-bold text-white font-mono"
              >
                ${isAnnual ? ANNUAL_PRICE : MONTHLY_PRICE}
                <span className="text-lg text-gray-500 font-sans font-normal">
                  /{isAnnual ? 'year' : 'mo'}
                </span>
              </motion.div>
              <p className={`text-sm font-inter mt-1 transition-opacity duration-200 ${isAnnual ? 'text-emerald-400 opacity-100' : 'opacity-0'}`}>
                Equivalent to ${MONTHLY_EQUIVALENT}/mo
              </p>
            </div>
            
            <p className="text-sm text-gray-500 mb-6 font-inter">100 blueprints per month</p>
            
            {/* AI Model Badge - Highlighted */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-500/10 border border-orange-500/30 mb-6">
              <Rocket className="w-4 h-4 text-orange-500" />
              <span className="text-orange-400 text-sm font-bold font-mono">Gemini 3 Pro</span>
              <Sparkles className="w-3 h-3 text-orange-500 ml-auto" />
            </div>
            
            <ul className="space-y-3 mb-8 flex-1">
              {/* Free Features Included */}
              <li className="flex items-center gap-3 text-gray-300">
                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-sm">App Manifest (PRD)</span>
                <span className="text-[10px] bg-gray-700/50 text-gray-400 px-1.5 py-0.5 rounded font-mono">FREE</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-sm">File Structure</span>
                <span className="text-[10px] bg-gray-700/50 text-gray-400 px-1.5 py-0.5 rounded font-mono">FREE</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-sm">System Architecture</span>
                <span className="text-[10px] bg-gray-700/50 text-gray-400 px-1.5 py-0.5 rounded font-mono">FREE</span>
              </li>
              
              <li className="pt-2" />
              
              {/* Pro Exclusive - Highlighted */}
              <li className="flex items-center gap-3 text-white">
                <Check className="w-5 h-5 text-orange-500 shrink-0" />
                <span className="text-sm font-medium">Full Database Schema</span>
                <span className="text-[10px] bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded font-mono">PRO</span>
              </li>
              <li className="flex items-center gap-3 text-white">
                <Check className="w-5 h-5 text-orange-500 shrink-0" />
                <span className="text-sm font-medium">Cost Analysis Breakdown</span>
                <span className="text-[10px] bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded font-mono">PRO</span>
              </li>
              <li className="flex items-center gap-3 text-white">
                <Check className="w-5 h-5 text-orange-500 shrink-0" />
                <span className="text-sm font-medium">Edit & Refine</span>
                <span className="text-[10px] bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded font-mono">PRO</span>
              </li>
              <li className="flex items-center gap-3 text-white">
                <Check className="w-5 h-5 text-orange-500 shrink-0" />
                <span className="text-sm font-medium">Export (PDF, MD, JSON)</span>
                <span className="text-[10px] bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded font-mono">PRO</span>
              </li>
            </ul>

            <button className="w-full py-3 rounded-lg bg-orange-600 text-white font-medium hover:bg-orange-500 transition-colors shadow-[0_0_20px_rgba(249,115,22,0.3)] font-space">
              Upgrade to Pro
            </button>
          </motion.div>

        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs mt-8 font-inter">
          All plans include unlimited project storage · Cancel anytime
        </p>
      </div>
    </section>
  );
};

export default Pricing;
