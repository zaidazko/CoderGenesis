import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, FileJson, Cpu, FileCode } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <FileCode className="w-6 h-6 text-orange-400" />,
      title: "Input Idea",
      desc: "User types \"Tinder for Dog Walkers.\""
    },
    {
      icon: <Cpu className="w-6 h-6 text-amber-400" />,
      title: "AI Architecting",
      desc: "System analyzes requirements..."
    },
    {
      icon: <FileJson className="w-6 h-6 text-orange-500" />,
      title: "Get The Genesis File",
      desc: "User gets the SQL, JSON Spec, and Visual Diagrams."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-black relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-900/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-space">How It Works</h2>
          <p className="text-gray-400 font-inter">From concept to blueprint in seconds.</p>
        </div>

        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-orange-500/30 to-transparent -translate-y-1/2 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gray-900 border border-orange-500/30 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(249,115,22,0.1)] z-10">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-space">{step.title}</h3>
                <p className="text-gray-400 font-inter">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
