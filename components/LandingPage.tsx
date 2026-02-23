
import React from 'react';
import { Check } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Hero from './Hero';
import Services from './Services';
import Projects from './Projects';
import Testimonials from './Testimonials';
import ScrollReveal from './ScrollReveal';
import ParallaxLayer from './ParallaxLayer';
import ParticleBackground from './ParticleBackground';

const StatsSection: React.FC = () => {
  const stats = [
    { label: 'Projects launched', value: 120, suffix: '+' },
    { label: 'Average client growth', value: 3.4, suffix: 'x' },
    { label: 'Campaign reach', value: 18, suffix: 'M' }
  ];

  const [values, setValues] = React.useState(stats.map(() => 0));

  React.useEffect(() => {
    const duration = 1200;
    const frameRate = 24;
    const totalFrames = Math.round((duration / 1000) * frameRate);
    let frame = 0;

    const interval = window.setInterval(() => {
      frame += 1;
      const progress = Math.min(frame / totalFrames, 1);

      setValues(
        stats.map((stat) =>
          Number((stat.value * progress).toFixed(stat.value % 1 === 0 ? 0 : 1))
        )
      );

      if (progress === 1) {
        window.clearInterval(interval);
      }
    }, 1000 / frameRate);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section id="about" className="py-24 bg-gradient-to-b from-slate-50 via-white to-transparent dark:from-brand-dark dark:via-[#050816] dark:to-transparent">
      <div className="container mx-auto px-6 max-w-[1200px]">
        <ScrollReveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
          <div>
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-500">
              Results / Stats
            </p>
            <h2 className="mt-3 text-2xl md:text-3xl font-display font-semibold text-slate-900 dark:text-white">
              Numbers from 4AM Global Media clients
            </h2>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md">
            We focus on visibility that converts: measurable lifts in traffic, trust,
            and qualified pipeline for founders and teams.
          </p>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <ScrollReveal
              key={stat.label}
              delay={index * 80}
              className="glass rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-6 py-8 flex flex-col gap-2"
            >
              <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                {stat.label}
              </span>
              <span className="text-3xl md:text-4xl font-display font-semibold text-slate-900 dark:text-white">
                {values[index]}
                {stat.suffix}
              </span>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const CallToActionSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="contact" className="relative py-24 overflow-hidden bg-gradient-to-r from-slate-50 via-white to-slate-100 dark:from-[#1e1b4b] dark:via-[#0f172a] dark:to-[#0b1120] transition-colors duration-500">
      <ParticleBackground className="pointer-events-none absolute inset-0" maxParticles={60} parallaxStrength={0.03} />
      <ParallaxLayer strength={0.2} className="pointer-events-none absolute inset-0 -z-10">
        <div className="w-[140%] h-full bg-gradient-to-r from-brand-primary/10 via-transparent to-brand-accent/10 translate-y-[-10%]" />
      </ParallaxLayer>
      <div className="container mx-auto px-6 max-w-[1200px] relative z-10">
        <ParallaxLayer strength={0.12} className="pointer-events-none absolute inset-x-0 -top-16 h-56">
          <div className="absolute left-[6%] top-0 w-64 h-64 rounded-full bg-brand-primary/30 blur-3xl opacity-60" />
          <div className="absolute right-[4%] bottom-[-2rem] w-72 h-72 rounded-full bg-brand-accent/30 blur-3xl opacity-55" />
        </ParallaxLayer>
        <ScrollReveal className="flex justify-center">
          <div className="relative w-full max-w-4xl">
            <div className="cta-border-animated rounded-[2.1rem] p-[1px]">
              <div className="glass relative rounded-[2rem] border border-zinc-200/60 bg-white/90 dark:border-white/10 dark:bg-white/5 backdrop-blur-xl px-8 md:px-12 py-12 md:py-16 flex flex-col items-center text-center gap-6 shadow-[0_24px_70px_rgba(15,23,42,0.55)]">
                <p className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-500">
                  Call to action
                </p>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-semibold text-slate-900 dark:text-white">
                  Ready to grow your brand?
                </h2>
                <p className="max-w-2xl text-sm md:text-base text-zinc-600 dark:text-zinc-300">
                  Book a strategy session with the 4AM Global Media team and get a clear, data-backed
                  roadmap for your next stage of growth.
                </p>
                <button
                  onClick={() => navigate('/contact')}
                  className="mt-2 inline-flex items-center justify-center px-10 py-4 rounded-2xl bg-gradient-to-r from-[#7C3AED] via-[#6366F1] to-[#22D3EE] bg-[length:200%_200%] bg-[position:0%_50%] text-white text-xs font-bold uppercase tracking-[0.2em] shadow-lg shadow-brand-primary/40 hover:shadow-[0_0_30px_rgba(99,102,241,0.55)] hover:scale-[1.05] hover:bg-[position:100%_50%] transition-all duration-300"
                >
                  Get Free Consultation
                </button>
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-[11px] text-zinc-500 dark:text-zinc-400">
                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                      <Check className="w-3 h-3" />
                    </span>
                    <span className="font-mono uppercase tracking-[0.18em]">Free consultation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                      <Check className="w-3 h-3" />
                    </span>
                    <span className="font-mono uppercase tracking-[0.18em]">No commitment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                      <Check className="w-3 h-3" />
                    </span>
                    <span className="font-mono uppercase tracking-[0.18em]">Expert growth insights</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

const LandingPage: React.FC = () => {
  const location = useLocation();

  React.useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (!state || !state.scrollTo) return;

    const id = state.scrollTo;
    const timeout = window.setTimeout(() => {
      const element = document.getElementById(id);
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const offset = rect.top + window.scrollY - 88;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }, 120);

    return () => window.clearTimeout(timeout);
  }, [location.state]);

  return (
    <main>
      <Hero />
      <Services />
      <StatsSection />
      <Projects />
      <Testimonials />
      <CallToActionSection />
    </main>
  );
};

export default LandingPage;
