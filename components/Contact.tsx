
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Loader2, Zap, DollarSign, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TiltCard from './TiltCard';

const Contact: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setTimeout(() => setStatus('success'), 1500);
  };

  return (
    <section id="contact" className="py-16 md:py-20 relative bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-brand-dark dark:via-brand-obsidian dark:to-brand-dark overflow-hidden">
      <div className="pointer-events-none absolute -top-32 right-[-2%] sm:right-[-10%] w-[420px] h-[420px] bg-gradient-to-br from-brand-primary/20 via-brand-accent/15 to-brand-signal/20 rounded-full blur-3xl opacity-70" />
      <div className="pointer-events-none absolute -bottom-40 left-[-2%] sm:left-[-20%] w-[520px] h-[520px] bg-gradient-to-tr from-brand-primary/15 via-transparent to-brand-accent/25 rounded-full blur-3xl opacity-70" />

      <div className="container mx-auto px-6 max-w-[1200px] relative z-10">
        <div className="max-w-2xl mx-auto text-center mb-8 md:mb-10">
          <p className="text-[11px] font-mono font-bold tracking-[0.3em] text-brand-primary uppercase mb-3">
            Let’s talk
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-[32px] font-display font-semibold tracking-tight text-zinc-900 dark:text-white mb-4">
            Let’s build something ambitious.
          </h2>
          <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
            Share a bit about your team, your timelines, and what a great outcome looks like. We’ll reply with a clear next step.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-10 items-start">
          <div className="space-y-5">
            <div className="glass rounded-2xl p-5 md:p-6 border border-zinc-200/70 dark:border-white/10 shadow-premium dark:shadow-premium-dark bg-white/80 dark:bg-brand-obsidian/80 backdrop-blur-xl">
              <p className="text-[11px] font-mono font-bold tracking-[0.25em] text-zinc-500 dark:text-zinc-400 uppercase mb-4">
                Contact details
              </p>
              <div className="flex flex-col divide-y divide-zinc-100/80 dark:divide-white/10">
                {[
                  { label: 'Email', value: '4amhustles@gmail.com', icon: Mail },
                  { label: 'Phone', value: '+91 90005 98600', icon: Phone },
                  { label: 'Location', value: 'Global / Remote team', icon: MapPin },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-4 py-4 first:pt-1 last:pb-1"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-[0.18em] mb-1">
                        {item.label}
                      </p>
                      <p className="text-sm md:text-base font-semibold text-zinc-900 dark:text-white">
                        {item.label === 'Phone' ? (
                          <a href="tel:+919000598600" className="hover:text-brand-primary transition-colors">
                            {item.value}
                          </a>
                        ) : (
                          item.value
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <TiltCard className="relative" maxTilt={8} scale={1.02} glow={false}>
            <div className="pointer-events-none absolute -inset-2 bg-gradient-to-br from-brand-primary/30 via-brand-accent/25 to-brand-signal/30 opacity-70 blur-2xl" />
            <div className="relative glass rounded-2xl p-6 md:p-6 border border-zinc-200 dark:border-white/10 shadow-premium dark:shadow-premium-dark bg-white/90 dark:bg-brand-obsidian/95 backdrop-blur-xl">
              {status === 'success' ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-full py-10 text-center">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20">
                    <Zap className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-zinc-900 dark:text-white mb-4 uppercase tracking-tight">Signal Received.</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-sm font-medium">Our growth architects will analyze your coordinates and reach out within 24 hours.</p>
                  <button onClick={() => setStatus('idle')} className="text-brand-primary font-bold uppercase tracking-[0.3em] text-[10px] hover:underline">Transmit New Data</button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest ml-1">Full name</label>
                      <input required type="text" className="w-full bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 rounded-2xl px-4 py-3 text-base focus:outline-none focus:border-brand-primary transition-all text-zinc-900 dark:text-white" placeholder="How should we address you?" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest ml-1">Work email</label>
                      <input required type="email" className="w-full bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 rounded-2xl px-4 py-3 text-base focus:outline-none focus:border-brand-primary transition-all text-zinc-900 dark:text-white" placeholder="name@domain.com" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest ml-1">What do you need help with?</label>
                      <div className="relative">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <select className="w-full bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 rounded-2xl pl-12 pr-4 py-3 text-base font-semibold focus:outline-none focus:border-brand-primary appearance-none text-zinc-900 dark:text-white cursor-pointer">
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
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <select className="w-full bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 rounded-2xl pl-12 pr-4 py-3 text-base font-semibold focus:outline-none focus:border-brand-primary appearance-none text-zinc-900 dark:text-white cursor-pointer">
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
                    <textarea required rows={5} className="w-full bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 rounded-2xl px-4 py-3 text-base focus:outline-none focus:border-brand-primary transition-all text-zinc-900 dark:text-white resize-none" placeholder="Share context, timelines, and what a great outcome would look like." />
                  </div>

                  <button 
                    disabled={status === 'submitting'}
                    className="w-full py-[10px] bg-gradient-to-r from-brand-primary via-brand-accent to-brand-signal text-white font-semibold rounded-xl shadow-lg hover:shadow-brand-primary/30 transition-all flex items-center justify-center gap-4 text-xs uppercase tracking-[0.3em] active:scale-95 disabled:opacity-50"
                  >
                    {status === 'submitting' ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>
                        Send message
                        <Zap className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
};

export default Contact;
