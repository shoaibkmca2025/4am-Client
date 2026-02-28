
import React from 'react';
import { ArrowRight } from 'lucide-react';
import HeroScene from './HeroScene';
import { scrollToSection } from '../utils/scroll';

const Hero: React.FC = () => {
  return (
    <section id="home" className="min-h-[85vh] flex items-center justify-center pt-24 pb-16 md:pt-28 md:pb-20 overflow-hidden bg-slate-50 dark:bg-[#020617] transition-colors duration-500">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-brand-dark dark:via-[#050816] dark:to-[#020617] opacity-100 transition-colors duration-500" />
      <div className="container mx-auto px-6 max-w-[1200px] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
          <div className="lg:col-span-7">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full glass border border-zinc-200/80 dark:border-white/10 shadow-premium backdrop-blur-md bg-white/5">
                <span className="w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_10px_#7C3AED]" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                  Digital marketing studio for brands that care about growth
                </span>
              </div>

              <h1 className="text-4xl sm:text-[44px] lg:text-5xl font-display font-bold leading-[1.06] tracking-tight text-slate-900 dark:text-white">
                We Turn Digital Presence
                <br />
                <span className="heading-gradient">
                  Into Real Growth
                </span>
              </h1>

              <p className="text-base text-zinc-700 dark:text-zinc-300 font-light max-w-2xl leading-relaxed">
                Data-driven marketing for real results. We turn attention into predictable revenue through strategic campaigns and high-converting funnels.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => scrollToSection('contact')}
                  className="w-full sm:w-auto min-h-11 px-6 py-3 bg-gradient-to-r from-[#7C3AED] via-[#6366F1] to-[#22D3EE] text-white font-semibold rounded-xl shadow-lg hover:shadow-brand-primary/30 flex items-center justify-center gap-3 group"
                >
                  <span className="text-xs uppercase tracking-[0.2em]">Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => scrollToSection('work')}
                  className="w-full sm:w-auto min-h-11 px-6 py-3 glass text-slate-900 dark:text-white font-semibold rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center"
                >
                  <span className="text-xs uppercase tracking-[0.2em]">View Our Work</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-zinc-200/50 dark:border-white/5">
                <p className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3">
                  Trusted by ambitious brands
                </p>
                <div className="flex items-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
                   {/* Placeholder for logos or text stats if logos unavailable */}
                   <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">120+ Projects Launched</span>
                   <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                   <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">$50M+ Revenue Generated</span>
                   <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                   <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">4.8x Avg ROAS</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 lg:mt-0 lg:col-span-5 pl-0 relative z-20 flex justify-center lg:justify-end">
            <HeroScene />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
