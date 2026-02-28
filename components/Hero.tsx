
import React from 'react';
import { ArrowRight } from 'lucide-react';
import HeroScene from './HeroScene';
import { scrollToSection } from '../utils/scroll';

const Hero: React.FC = () => {
  return (
    <section id="home" className="min-h-[calc(100vh-96px)] flex items-start justify-center pt-24 pb-16 md:pt-28 md:pb-20 overflow-hidden bg-slate-50 dark:bg-[#020617] transition-colors duration-500">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-brand-dark dark:via-[#050816] dark:to-[#020617] opacity-100 transition-colors duration-500" />
      <div className="container mx-auto px-6 max-w-[1200px] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
          <div className="lg:col-span-7">
            <div className="space-y-6">
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
                Data-driven marketing for real results.
              </p>
              <div className="space-y-2">
                <p className="text-sm font-mono text-zinc-400">
                  We turn attention into predictable revenue.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
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
            </div>
          </div>

          <div className="mt-12 lg:mt-0 lg:col-span-5 pl-0 relative z-20 flex justify-center">
            <div className="scale-[0.6] sm:scale-[0.75] md:scale-[0.85] xl:scale-100 origin-center">
              <HeroScene />
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="glass rounded-2xl border border-zinc-200/70 dark:border-white/10 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-500">
                Live studio metrics
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Signals from recent launches across the 4am client network.
              </p>
            </div>
            <div className="flex flex-wrap gap-5 text-sm font-mono text-zinc-800 dark:text-zinc-100">
              {[
                { label: 'Active campaigns', value: '37' },
                { label: 'Monthly reach', value: '14.2M' },
                { label: 'Avg. ROAS', value: '4.8x' },
                { label: 'Content shipped', value: '312' }
              ].map((metric, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">
                    {metric.label}
                  </span>
                  <span className="text-base font-semibold">
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200/70 dark:border-white/10 overflow-hidden bg-white/70 dark:bg-brand-dark/80">
            <div className="px-4 py-2 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
              <span>Live activity feed</span>
              <span className="text-[9px] text-zinc-400 dark:text-zinc-500">Updates refresh continuously</span>
            </div>
            <div className="relative overflow-hidden">
              <div className="whitespace-nowrap py-3 px-4 text-xs font-mono text-zinc-600 dark:text-zinc-300 overflow-x-auto no-scrollbar">
                <span className="mr-8">New SaaS launch shipped · onboarding flow delivered</span>
                <span className="mr-8">Global ad experiment hit target CPA</span>
                <span className="mr-8">Product marketing site redesigned for higher trial conversions</span>
                <span className="mr-8">Analytics dashboard rolled out to 3 new regions</span>
                <span className="mr-8">Signal review complete · next sprint roadmap locked</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
