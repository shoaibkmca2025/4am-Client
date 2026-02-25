
import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Magnetic from './Magnetic';
import ScrollReveal from './ScrollReveal';
import SpotlightSection from './SpotlightSection';
import ParallaxLayer from './ParallaxLayer';
import ParticleBackground from './ParticleBackground';
import HeroScene from './HeroScene';

const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const navigate = useNavigate();

  const phrases = [
    'We turn attention into predictable revenue.',
    'We build visibility that compounds over time.',
    'We help brands ship campaigns that actually convert.'
  ];

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [visibleText, setVisibleText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const full = phrases[phraseIndex];
    const isComplete = !isDeleting && visibleText === full;
    const isCleared = isDeleting && visibleText === '';

    let delay = 60;

    if (isComplete) {
      delay = 1200;
      setTimeout(() => setIsDeleting(true), delay);
      return;
    }

    if (isCleared) {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
      return;
    }

    if (isDeleting) {
      delay = 40;
    }

    const timeout = setTimeout(() => {
      setVisibleText((current) =>
        isDeleting ? current.slice(0, -1) : full.slice(0, current.length + 1)
      );
    }, delay);

    return () => clearTimeout(timeout);
  }, [phrases, phraseIndex, visibleText, isDeleting]);

  return (
    <SpotlightSection className="min-h-screen flex items-center justify-center pt-20 pb-8 sm:pt-28 sm:pb-20 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-brand-dark dark:via-[#050816] dark:to-[#020617]">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <ParticleBackground className="absolute inset-0" maxParticles={90} parallaxStrength={0.02} />
        <ParallaxLayer strength={0.18} className="w-full h-full">
          <div className="hero-orb hero-orb-1" />
        </ParallaxLayer>
        <ParallaxLayer strength={0.24} className="w-full h-full">
          <div className="hero-orb hero-orb-2" />
        </ParallaxLayer>
        <ParallaxLayer strength={0.32} className="w-full h-full">
          <div className="hero-orb hero-orb-3" />
        </ParallaxLayer>
      </div>
      <div className="container mx-auto px-6 max-w-[1200px] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <ScrollReveal className="lg:col-span-7">
            <motion.div style={{ opacity: heroOpacity }} className="space-y-10">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass border border-zinc-200/80 dark:border-white/10 shadow-premium backdrop-blur-md bg-white/5">
                <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse shadow-[0_0_10px_#7C3AED]" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                  Digital marketing studio for brands that care about growth
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-display font-bold leading-[1.02] tracking-tight text-slate-900 dark:text-white heading-interactive">
                We Turn Digital Presence
                <br />
                <Magnetic strength={10}>
                  <span className="heading-gradient heading-gradient-animated">
                    Into Real Growth
                  </span>
                </Magnetic>
              </h1>

              <p className="text-lg md:text-xl text-zinc-700 dark:text-zinc-300 font-light max-w-2xl leading-relaxed">
                Data-driven marketing for real results.
              </p>
              <div className="space-y-2">
                <p className="hidden sm:block text-sm md:text-base font-mono text-zinc-400">
                  <span className="typing-inline">{visibleText}</span>
                  <span className="typing-cursor" />
                </p>
                <p className="sm:hidden text-sm font-mono text-zinc-400">
                  Data-driven marketing for real results.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 pt-6">
                <Magnetic strength={20}>
                  <button
                    onClick={() => navigate('/contact')}
                    className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-[#7C3AED] via-[#6366F1] to-[#22D3EE] text-white font-bold rounded-2xl shadow-xl hover:shadow-brand-primary/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-4 group"
                  >
                    <span className="text-xs uppercase tracking-[0.2em]">Get Started</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Magnetic>

                <button
                  onClick={() => navigate('/work')}
                  className="w-full sm:w-auto px-10 py-5 glass text-slate-900 dark:text-white font-bold rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200 dark:border-white/10 transition-all flex items-center justify-center"
                >
                  <span className="text-xs uppercase tracking-[0.2em]">View Our Work</span>
                </button>
              </div>
            </motion.div>
          </ScrollReveal>

          <ScrollReveal className="mt-12 lg:mt-0 lg:col-span-5 pl-0 relative z-20 flex justify-center">
            <div className="scale-[0.6] sm:scale-[0.75] md:scale-[0.85] xl:scale-100 origin-center">
              <HeroScene />
            </div>
          </ScrollReveal>
        </div>

        <div className="mt-10 space-y-4">
          <div className="glass rounded-3xl border border-zinc-200/70 dark:border-white/10 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-500">
                Live studio metrics
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Signals from recent launches across the 4am client network.
              </p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm font-mono text-zinc-800 dark:text-zinc-100">
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

          <div className="rounded-3xl border border-zinc-200/70 dark:border-white/10 overflow-hidden bg-white/70 dark:bg-brand-dark/80">
            <div className="px-4 py-2 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
              <span>Live activity feed</span>
              <span className="text-[9px] text-zinc-400 dark:text-zinc-500">Updates refresh continuously</span>
            </div>
            <div className="relative overflow-hidden">
              <div className="animate-marquee whitespace-nowrap py-3 px-4 text-xs font-mono text-zinc-600 dark:text-zinc-300">
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
    </SpotlightSection>
  );
};

export default Hero;
