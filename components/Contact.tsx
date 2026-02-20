
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Loader2, Zap, DollarSign, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Contact: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setTimeout(() => setStatus('success'), 1500);
  };

  return (
    <section id="contact" className="py-24 md:py-48 relative bg-white dark:bg-brand-dark overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 xl:gap-32 items-start">
          
          <div className="space-y-16">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-[1px] bg-brand-primary" />
                <span className="text-brand-primary font-mono font-bold tracking-[0.5em] uppercase text-xs">Let’s talk</span>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-zinc-900 dark:text-white tracking-tighter leading-[1.05]">
                A calm space
                <br />
                to plan ambitious software.
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-lg md:text-xl font-light leading-relaxed max-w-lg mt-8 border-l-2 border-zinc-200 dark:border-white/10 pl-8">
                Tell us where your product is today
                <br />
                and we’ll map the next steps.
              </p>
            </div>

            <div className="space-y-6">
              {[
                { label: 'Email', value: 'contact@4amglobal.media', icon: Mail },
                { label: 'Phone', value: '+1 (555) 426-9000', icon: Phone },
                { label: 'Location', value: 'Global / Remote team', icon: MapPin },
              ].map((item) => (
                <div key={item.label} className="group flex items-center gap-6 p-8 glass rounded-[2.5rem] border border-zinc-200 dark:border-white/5 hover:border-brand-primary/20 transition-all shadow-premium">
                  <div className="w-14 h-14 rounded-2xl bg-brand-primary/5 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all duration-500">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-[0.2em] mb-1">{item.label}</h4>
                    <p className="text-lg font-bold text-zinc-900 dark:text-white font-display">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="glass rounded-[3.5rem] p-10 md:p-14 border border-zinc-200 dark:border-white/10 shadow-premium dark:shadow-premium-dark h-full">
              {status === 'success' ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-full py-24 text-center">
                  <div className="w-24 h-24 bg-emerald-500/10 rounded-3xl flex items-center justify-center mb-10 border border-emerald-500/20">
                    <Zap className="w-12 h-12 text-emerald-500" />
                  </div>
                  <h3 className="text-4xl font-display font-bold text-zinc-900 dark:text-white mb-6 uppercase tracking-tighter">Signal Received.</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 mb-12 max-w-sm font-medium">Our growth architects will analyze your coordinates and reach out within 24 hours.</p>
                  <button onClick={() => setStatus('idle')} className="text-brand-primary font-bold uppercase tracking-[0.3em] text-[10px] hover:underline">Transmit New Data</button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                      <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest ml-1">Full name</label>
                      <input required type="text" className="w-full bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 rounded-2xl px-8 py-5 text-sm focus:outline-none focus:border-brand-primary transition-all text-zinc-900 dark:text-white" placeholder="How should we address you?" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest ml-1">Work email</label>
                      <input required type="email" className="w-full bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 rounded-2xl px-8 py-5 text-sm focus:outline-none focus:border-brand-primary transition-all text-zinc-900 dark:text-white" placeholder="name@domain.com" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                      <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest ml-1">What do you need help with?</label>
                      <div className="relative">
                        <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <select className="w-full bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 rounded-2xl pl-16 pr-8 py-5 text-xs font-bold focus:outline-none focus:border-brand-primary appearance-none text-zinc-900 dark:text-white cursor-pointer">
                          <option>Select an option</option>
                          <option>New product or platform</option>
                          <option>Revamp an existing product</option>
                          <option>Brand and marketing site</option>
                          <option>Ongoing product partnership</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest ml-1">Estimated budget</label>
                      <div className="relative">
                        <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <select className="w-full bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 rounded-2xl pl-16 pr-8 py-5 text-xs font-bold focus:outline-none focus:border-brand-primary appearance-none text-zinc-900 dark:text-white cursor-pointer">
                          <option>Select a range</option>
                          <option>$5k – $20k</option>
                          <option>$20k – $100k</option>
                          <option>$100k+</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest ml-1">Project details</label>
                    <textarea required rows={5} className="w-full bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 rounded-2xl px-8 py-5 text-sm focus:outline-none focus:border-brand-primary transition-all text-zinc-900 dark:text-white resize-none" placeholder="Share context, timelines, and what a great outcome would look like." />
                  </div>

                  <button 
                    disabled={status === 'submitting'}
                    className="w-full py-6 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-signal text-white font-bold rounded-2xl shadow-xl hover:shadow-brand-primary/50 hover:-translate-y-1 transition-all flex items-center justify-center gap-6 text-xs uppercase tracking-[0.3em] active:scale-95 disabled:opacity-50"
                  >
                    {status === 'submitting' ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                      <>
                        Send message
                        <Zap className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
