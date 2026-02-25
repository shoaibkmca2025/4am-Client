
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Articles from './Articles';
import { Sparkles, Radio, Zap } from 'lucide-react';

const InsightsPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-36 pb-20 relative overflow-hidden bg-slate-50 dark:bg-brand-obsidian transition-colors duration-500">
      <div className="absolute top-1/4 -left-24 w-64 h-64 bg-brand-primary/10 blur-[80px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto mb-12 text-center flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 mb-8 glass px-4 py-1.5 rounded-full border border-brand-primary/20"
          >
            <Radio className="w-3 h-3 text-brand-primary animate-pulse" />
            <span className="text-brand-primary font-mono font-bold tracking-[0.2em] uppercase text-[9px]">Neural_Feed: High_Priority</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tight uppercase leading-[1.1] mb-6 heading-interactive"
          >
            TECHNICAL <br/>
            <span className="heading-gradient heading-gradient-animated glow-text">
              INTELLIGENCE.
            </span>
          </motion.h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 font-light max-w-2xl mx-auto leading-relaxed italic mb-10">
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
