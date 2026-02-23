
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Projects from './Projects';
import { Terminal, Database, Code2 } from 'lucide-react';

const WorkPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-48 relative overflow-hidden bg-white dark:bg-brand-dark transition-colors duration-500">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_70%_30%,rgba(37,99,235,0.05),transparent_70%)] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-[1200px] mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="w-12 h-[1px] bg-brand-primary" />
            <span className="text-brand-primary font-mono font-bold tracking-[0.5em] uppercase text-xs">Node_Archive</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-slate-900 dark:text-white tracking-tight uppercase leading-[1.02] mb-10 heading-interactive"
          >
            DEPLOYMENT <br/>
            <span className="heading-gradient heading-gradient-animated">
              CHRONICLES.
            </span>
          </motion.h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
            {[
              { label: 'Total Deployments', value: '124+', icon: Database },
              { label: 'Market Velocity', value: '9.2x', icon: Terminal },
              { label: 'Node Uptime', value: '99.9%', icon: Code2 },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="glass px-6 py-5 rounded-[1.75rem] border border-white/40 dark:border-white/5 h-full flex flex-col justify-between"
              >
                <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary mb-4">
                  <stat.icon className="w-5 h-5" />
                </div>
                <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-display font-bold">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <Projects />
      </div>
    </div>
  );
};

export default WorkPage;
