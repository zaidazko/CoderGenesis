import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-black">
      {/* Industrial Grid Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_800px_at_50%_-30%,#f9731620,transparent)]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5 }}
             className="inline-block mb-4 px-3 py-1 border border-orange-500/30 rounded-full bg-orange-500/10 text-orange-400 text-xs font-mono tracking-wider"
          >
            AI ARCHITECT V1.0
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 font-space"
          >
            Where Code <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-300">Begins</span>.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto font-inter"
          >
            Stop staring at a blank editor. Generate the complete Engineering Blueprint—Schemas, API Specs, and Flowcharts—before you write a single line of code.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center gap-4"
          >
            <Link to="/playground">
              <button className="px-8 py-4 bg-orange-600 text-white rounded-lg font-bold text-lg hover:bg-orange-500 transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] font-space cursor-pointer">
                Draft Your App Free
              </button>
            </Link>
            <button className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-lg font-bold text-lg hover:bg-white/5 transition-all font-space cursor-pointer">
              View Demo
            </button>
          </motion.div>
        </div>

        {/* Visual Placeholder - Construction/Blueprint Style */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 mx-auto max-w-5xl"
          style={{ perspective: '1000px' }}
        >
          <div className="relative bg-gray-900/80 backdrop-blur border border-orange-500/20 rounded-xl overflow-hidden aspect-video shadow-[0_20px_50px_-12px_rgba(249,115,22,0.1)] transform rotate-x-6">
             {/* Tech Overlay Lines */}
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50"></div>
             
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-8 p-8 w-full h-full opacity-80">
                   {/* Mock Mermaid Flowchart */}
                   <div className="border border-orange-500/20 rounded bg-black/60 p-6 flex flex-col items-center justify-center space-y-4 relative overflow-hidden">
                      <div className="absolute top-2 left-2 text-[10px] text-orange-500 font-mono">FIG_1: FLOW_LOGIC</div>
                      <div className="w-32 h-10 border border-orange-400/60 rounded bg-orange-900/10 flex items-center justify-center text-xs text-orange-300 font-mono">User_Input</div>
                      <div className="w-0.5 h-6 bg-orange-500/50"></div>
                      <div className="w-32 h-10 border border-amber-400/60 rounded bg-amber-900/10 flex items-center justify-center text-xs text-amber-300 font-mono">Process_Data</div>
                      <div className="w-0.5 h-6 bg-orange-500/50"></div>
                       <div className="w-32 h-10 border border-orange-400/60 rounded bg-orange-900/10 flex items-center justify-center text-xs text-orange-300 font-mono">Save_DB</div>
                   </div>
                   
                   {/* Mock SQL Table */}
                   <div className="border border-orange-500/20 rounded bg-black/60 p-6 font-mono text-xs text-gray-400 relative">
                      <div className="absolute top-2 left-2 text-[10px] text-orange-500 font-mono">FIG_2: SCHEMA_DEF</div>
                      <div className="mt-4 space-y-3">
                        <div className="flex justify-between border-b border-gray-800 pb-2">
                            <span className="text-orange-200">id</span>
                            <span className="text-gray-500">UUID PRIMARY KEY</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-800 pb-2">
                            <span className="text-orange-200">user_id</span>
                            <span className="text-gray-500">VARCHAR(255)</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-800 pb-2">
                            <span className="text-orange-200">project_data</span>
                            <span className="text-gray-500">JSONB</span>
                        </div>
                        <div className="flex justify-between pb-2">
                            <span className="text-orange-200">created_at</span>
                            <span className="text-gray-500">TIMESTAMP</span>
                        </div>
                      </div>
                      <div className="absolute bottom-4 right-4 text-orange-500/50 text-[10px]">READ_ONLY</div>
                   </div>
                </div>
             </div>
             {/* Glow overlay */}
             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
