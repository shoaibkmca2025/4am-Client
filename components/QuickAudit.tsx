
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Shield, Zap, Target, Loader2, Sparkles, Globe, ArrowRight, Binary, Cpu } from 'lucide-react';

const QuickAudit: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [result, setResult] = useState<null | 'success'>(null);

  useEffect(() => {
    let interval: number;
    if (isScanning) {
      interval = window.setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsScanning(false);
            setResult('success');
            return 100;
          }
          return prev + Math.random() * 8;
        });
      }, 150);
    }
    return () => window.clearInterval(interval);
  }, [isScanning]);

  const handleAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || isScanning) return;
    setIsScanning(true);
    setScanProgress(0);
    setResult(null);
  };

  return (
    <div className="max-w-5xl mx-auto mt-24">
      <div className="glass rounded-[3.5rem] p-10 md:p-14 border border-brand-primary/20 shadow-3xl relative overflow-hidden group">
        {/* Animated Background Scan Line */}
        <AnimatePresence>
          {isScanning && (
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              exit={{ x: '100%' }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-brand-primary/10 to-transparent pointer-events-none skew-x-12 z-0"
            />
          )}
        </AnimatePresence>

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="w-24 h-24 bg-brand-primary/10 rounded-[2.5rem] flex items-center justify-center text-brand-primary shrink-0 border border-brand-primary/20 shadow-inner group-hover:scale-110 transition-transform">
            <Cpu className="w-12 h-12" />
          </div>
          <div className="flex-1 space-y-3 text-center lg:text-left">
            <h3 className="text-3xl font-display font-bold uppercase tracking-tight text-white">AI Tactical Audit.</h3>
            <p className="text-slate-400 text-sm font-medium italic">Input your domain coordinate for a real-time signal and friction analysis.</p>
          </div>
          
          <form onSubmit={handleAudit} className="w-full lg:w-auto flex flex-col md:flex-row gap-5 items-center flex-grow">
            <div className="relative w-full lg:w-72">
              <input 
                type="text" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="DOMAIN_URI"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-7 pr-12 text-sm focus:outline-none focus:border-brand-primary transition-all font-mono text-white placeholder:text-slate-600"
              />
              <Binary className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary/40" />
            </div>
            <button 
              disabled={isScanning}
              className="w-full md:w-auto px-12 py-5 bg-brand-primary text-white rounded-2xl font-bold uppercase tracking-[0.3em] text-[10px] shadow-2xl hover:scale-105 transition-all disabled:opacity-50 flex items-center justify-center gap-4 relative overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10">{isScanning ? `SCANNING ${Math.floor(scanProgress)}%` : "INIT_SCAN"}</span>
              {!isScanning && <ArrowRight className="relative z-10 w-4 h-4" />}
            </button>
          </form>
        </div>

        {/* Audit Results */}
        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-16 pt-16 border-t border-white/5"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { label: 'CONVERSION_FRICTION', value: '7.4 Critical', color: 'text-amber-500', icon: Target, detail: 'Checkout node drop-off detected.' },
                  { label: 'SIGNAL_LATENCY', value: '2.8s TTL', color: 'text-rose-500', icon: Zap, detail: 'Unoptimized assets slowing TTFB.' },
                  { label: 'SECURITY_HARDENING', value: 'VULNERABLE', color: 'text-brand-primary', icon: Shield, detail: 'Header encryption protocols missing.' }
                ].map((stat, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col gap-6 p-8 bg-white/5 rounded-[2rem] border border-white/5 hover:border-brand-primary/20 transition-all group/card"
                  >
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1.5">{stat.label}</p>
                      <p className={`text-2xl font-display font-bold ${stat.color}`}>{stat.value}</p>
                      <p className="text-[10px] text-slate-400 mt-2 italic font-medium">{stat.detail}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12 p-8 bg-brand-primary/10 rounded-[2rem] border border-brand-primary/20 flex flex-col md:flex-row items-center justify-between gap-8"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-white uppercase tracking-tight">Deployment Strategy Ready</p>
                    <p className="text-xs text-slate-400 font-medium">We've generated a 12-page tactical brief to resolve these friction points.</p>
                  </div>
                </div>
                <button 
                  onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-white text-brand-primary font-bold rounded-xl text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
                >
                  DOWNLOAD_BRIEFING
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuickAudit;
