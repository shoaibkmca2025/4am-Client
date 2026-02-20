
import React, { useEffect, useState } from 'react';
import { ArrowRight, Shield, Zap, Signal } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Magnetic from './Magnetic';

const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const navigate = useNavigate();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothMouseX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 40, damping: 25 });

  const phrases = [
    'We build scalable software for modern teams.',
    'We design interfaces that stay calm under pressure.',
    'We ship reliable systems that feel effortless to use.'
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
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-24 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
      </div>
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <motion.div
            style={{ opacity: heroOpacity }}
            className="lg:col-span-8 space-y-10"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass border border-zinc-200 dark:border-white/5 shadow-premium backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse shadow-[0_0_10px_#7C3AED]" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                Software studio for teams that care about craft
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl xl:text-8xl font-display font-bold leading-[0.95] tracking-tighter text-zinc-900 dark:text-white heading-interactive">
              Software that feels
              <br />
              <Magnetic strength={10}>
                <span className="heading-gradient heading-gradient-animated">
                  crafted, not generated.
                </span>
              </Magnetic>
            </h1>

            <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 font-light max-w-2xl leading-relaxed">
              We design, build, and ship modern web products for software companies that want a calm, considered experience from first pixel to final deploy.
            </p>
            <div className="space-y-2">
              <p className="hidden sm:block text-sm md:text-base font-mono text-zinc-400">
                <span className="typing-inline">{visibleText}</span>
                <span className="typing-cursor" />
              </p>
              <p className="sm:hidden text-sm font-mono text-zinc-400">
                We build scalable software for modern teams.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 pt-6">
              <Magnetic strength={20}>
                <button
                  onClick={() => navigate('/contact')}
                  className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-signal text-white font-bold rounded-2xl shadow-xl hover:shadow-brand-primary/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-4 group"
                >
                  <span className="text-xs uppercase tracking-[0.2em]">Book a call</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Magnetic>

              <button
                onClick={() => navigate('/services')}
                className="w-full sm:w-auto px-10 py-5 glass text-zinc-900 dark:text-white font-bold rounded-2xl hover:bg-zinc-100 dark:hover:bg-white/5 border border-zinc-200 dark:border-white/10 transition-all flex items-center justify-center"
              >
                <span className="text-xs uppercase tracking-[0.2em]">View services</span>
              </button>
            </div>
          </motion.div>

          <div className="hidden lg:block lg:col-span-4 pl-8">
            <motion.div
              style={{
                x: useTransform(smoothMouseX, (v) => v * 0.015),
                y: useTransform(smoothMouseY, (v) => v * 0.015)
              }}
              className="space-y-4"
            >
              {[
                { icon: Shield, label: 'Security', value: 'ECC_Encrypted', color: 'text-brand-primary' },
                { icon: Signal, label: 'Throughput', value: '1.2ms_Latency', color: 'text-brand-primary' },
                { icon: Zap, label: 'Optimization', value: 'Tier_1_ROI', color: 'text-brand-primary' }
              ].map((item, i) => (
                <div key={i} className="glass px-5 py-4 rounded-[1.25rem] border border-zinc-200 dark:border-white/5 flex items-center gap-4 group hover:border-brand-primary/20 transition-all shadow-premium dark:shadow-premium-dark hover:-translate-x-2">
                  <div className={`w-10 h-10 rounded-xl bg-zinc-50 dark:bg-white/5 flex items-center justify-center ${item.color} shadow-inner`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white font-mono">{item.value}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
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

    </section>
  );
};

export default Hero;
