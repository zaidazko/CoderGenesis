import React from 'react';
import { AlertTriangle, Database, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

const Features = () => {
  const features = [
    {
      icon: <AlertTriangle className="w-8 h-8 text-orange-500" />,
      title: "Spaghetti Code",
      description: "Without a plan, your AI code assistants write messy, unscalable code."
    },
    {
      icon: <Database className="w-8 h-8 text-amber-500" />,
      title: "Database Hell",
      description: "Guessing your schema leads to painful migrations later."
    },
    {
      icon: <Layers className="w-8 h-8 text-orange-400" />,
      title: "Feature Creep",
      description: "Build what matters. Get a strict MVP spec sheet."
    }
  ];

  return (
    <section id="features" className="py-20 bg-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-space">The Vibecoding Trap</h2>
          <p className="text-gray-400 max-w-2xl mx-auto font-inter">Why skipping the blueprint phase kills your project before it starts.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-2xl bg-gray-900/30 border border-white/5 hover:border-orange-500/50 transition-colors group"
            >
              <div className="mb-6 p-3 bg-orange-900/10 rounded-lg w-fit group-hover:bg-orange-900/20 transition-colors border border-orange-500/10 group-hover:border-orange-500/30">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-space">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed font-inter">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
