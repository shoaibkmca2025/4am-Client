
import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Target, ArrowRight } from 'lucide-react';

const StrategicMap: React.FC = () => {
  const roadmap = [
    { page: 'Home', goal: 'High-level overview and brand identity.' },
    { page: 'Services', goal: 'Detailed breakdown of Dev, SEO, and Marketing.' },
    { page: 'Portfolio', goal: 'Deep dives into successful projects.' },
    { page: 'Process', goal: 'Building transparency and setting expectations.' },
    { page: 'Contact', goal: 'Lead capture form with project budget/type fields.' },
  ];

  return (
    <section className="py-24 bg-brand-obsidian relative overflow-hidden transition-colors duration-500">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent_70%)]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 flex items-center gap-4">
            <div className="w-12 h-[1px] bg-brand-primary" />
            <span className="text-brand-primary font-mono font-bold tracking-[0.4em] uppercase text-[10px]">
              02 // OPERATIONAL_MAP
            </span>
          </div>

          <div className="glass rounded-[2rem] border border-white/5 dark:border-white/10 overflow-hidden shadow-2xl">
            <div className="grid grid-cols-12 p-8 border-b border-white/5 bg-white/5">
              <div className="col-span-4 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Page_Node</div>
              <div className="col-span-8 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Primary_Mission_Goal</div>
            </div>

            <div className="divide-y divide-white/5">
              {roadmap.map((item, idx) => (
                <motion.div 
                  key={item.page}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="grid grid-cols-12 p-8 hover:bg-white/[0.02] transition-colors group cursor-default"
                >
                  <div className="col-span-4 flex items-center gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_8px_#3B82F6]" />
                    <span className="text-lg md:text-xl font-display font-bold text-white uppercase tracking-tight group-hover:text-brand-primary transition-colors">
                      {item.page}
                    </span>
                  </div>
                  <div className="col-span-8 flex items-center">
                    <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed group-hover:text-slate-200 transition-colors">
                      {item.goal}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-8 bg-brand-primary/5 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <Terminal className="w-4 h-4 text-brand-primary" />
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">System Architecture Synchronized</span>
              </div>
              <button 
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 text-[10px] font-bold text-brand-primary hover:underline uppercase tracking-widest group"
              >
                Inquire Protocol <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StrategicMap;
