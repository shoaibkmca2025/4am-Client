
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Articles from './Articles';
import { Sparkles, Radio, Zap } from 'lucide-react';

const InsightsPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-48 relative overflow-hidden bg-slate-50 dark:bg-brand-obsidian transition-colors duration-500">
      <div className="absolute top-1/4 -left-24 w-96 h-96 bg-brand-primary/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto mb-20 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-4 mb-8 glass px-6 py-2 rounded-full border border-brand-primary/20"
          >
            <Radio className="w-4 h-4 text-brand-primary animate-pulse" />
            <span className="text-brand-primary font-mono font-bold tracking-[0.3em] uppercase text-[10px]">Neural_Feed: High_Priority</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-6xl md:text-7xl font-display font-bold text-slate-900 dark:text-white tracking-tighter uppercase leading-[0.85] mb-10 heading-interactive"
          >
            TECHNICAL <br/>
            <span className="heading-gradient heading-gradient-animated glow-text">
              INTELLIGENCE.
            </span>
          </motion.h1>

          <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-light max-w-3xl mx-auto leading-relaxed italic mb-16">
            Elite research logs and technical blueprints synchronized from the 4AM Global knowledge clusters.
          </p>

          <div className="flex justify-center gap-12">
             <div className="flex items-center gap-3">
               <Zap className="w-4 h-4 text-brand-signal" />
               <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Real-Time Sync</span>
             </div>
             <div className="flex items-center gap-3">
               <Sparkles className="w-4 h-4 text-brand-accent" />
               <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">AI Grounded</span>
             </div>
          </div>
        </div>

        <Articles />
      </div>
    </div>
  );
};

export default InsightsPage;
