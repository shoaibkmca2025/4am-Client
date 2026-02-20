import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Users, Target, ArrowRight, Zap } from 'lucide-react';

const ROICalculator: React.FC = () => {
  const [traffic, setTraffic] = useState(5000);
  const [convRate, setConvRate] = useState(1.5);
  const [avgTicket, setAvgTicket] = useState(500);

  const currentRevenue = (traffic * (convRate / 100) * avgTicket);
  const optimizedConvRate = convRate * 1.8; // Assume 80% improvement
  const projectedRevenue = (traffic * (optimizedConvRate / 100) * avgTicket);
  const uplift = projectedRevenue - currentRevenue;

  return (
    <section className="py-32 relative overflow-hidden bg-white dark:bg-brand-obsidian">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-[1px] bg-brand-primary" />
                <span className="text-brand-primary font-mono font-bold tracking-[0.4em] uppercase text-xs">Profit Intelligence</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-display font-bold text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
                Calculate <br /> Your <span className="text-brand-primary">Uplink.</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed max-w-md">
                Stop guessing. See exactly how our optimization engine translates into scalable revenue for your specific business model.
              </p>

              <div className="space-y-10 pt-8">
                <div className="space-y-4">
                  <div className="flex justify-between text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
                    <label>Monthly Traffic</label>
                    <span className="text-brand-primary">{traffic.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" min="1000" max="100000" step="1000"
                    value={traffic} onChange={(e) => setTraffic(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 dark:bg-white/5 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
                    <label>Current Conv. Rate</label>
                    <span className="text-brand-primary">{convRate}%</span>
                  </div>
                  <input 
                    type="range" min="0.1" max="10" step="0.1"
                    value={convRate} onChange={(e) => setConvRate(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 dark:bg-white/5 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
                    <label>Avg. Order Value</label>
                    <span className="text-brand-primary">${avgTicket}</span>
                  </div>
                  <input 
                    type="range" min="10" max="5000" step="50"
                    value={avgTicket} onChange={(e) => setAvgTicket(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 dark:bg-white/5 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                  />
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-10 bg-brand-primary/10 blur-[120px] rounded-full" />
              <div className="relative glass rounded-[3rem] p-10 md:p-16 border border-white/40 dark:border-white/10 shadow-3xl text-center">
                <div className="w-20 h-20 bg-brand-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-10 text-brand-primary">
                  <TrendingUp className="w-10 h-10" />
                </div>
                
                <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.4em] mb-4">Projected_Monthly_Growth</p>
                <motion.h3 
                  key={uplift}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-5xl md:text-7xl font-display font-bold text-brand-primary tracking-tighter mb-8"
                >
                  +${Math.round(uplift).toLocaleString()}
                </motion.h3>

                <div className="grid grid-cols-2 gap-4 mb-12">
                  <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
                    <p className="text-[8px] font-mono text-slate-400 uppercase mb-2">New Conv. Rate</p>
                    <p className="text-xl font-bold">{optimizedConvRate.toFixed(1)}%</p>
                  </div>
                  <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
                    <p className="text-[8px] font-mono text-slate-400 uppercase mb-2">ROI Potential</p>
                    <p className="text-xl font-bold text-emerald-500">80% ↑</p>
                  </div>
                </div>

                <button 
                  onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold uppercase tracking-[0.3em] text-xs shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-4"
                >
                  Capture This Growth
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="mt-6 text-[8px] font-mono text-slate-400 uppercase tracking-widest">Calculated using 4AM Optimized Delivery Logic</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ROICalculator;