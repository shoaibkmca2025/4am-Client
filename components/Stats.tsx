import React, { useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import RevealText from './RevealText';

gsap.registerPlugin(ScrollTrigger);

const E: [number, number, number, number] = [0.16, 1, 0.3, 1];

const STATS = [
  { label: 'Projects Delivered', value: 120, suffix: '+',  bar: 0.80 },
  { label: 'Average Growth',     value: 3.4, suffix: 'x',  bar: 0.70 },
  { label: 'Campaign Reach',     value: 18,  suffix: 'M+', bar: 0.90 },
  { label: 'Client Retention',   value: 95,  suffix: '%',  bar: 0.95 },
];

const StatsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const numRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const barRefs    = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      STATS.forEach((stat, i) => {
        const el  = numRefs.current[i];
        const bar = barRefs.current[i];
        if (!el) return;
        const isDecimal = stat.value % 1 !== 0;

        if (reduced) {
          el.textContent = `${stat.value}${stat.suffix}`;
          if (bar) gsap.set(bar, { scaleX: stat.bar });
          return;
        }

        el.textContent = `0${stat.suffix}`;
        const proxy = { val: 0 };
        gsap.to(proxy, {
          val: stat.value, duration: 2.4, ease: 'power3.out',
          onUpdate: () => {
            el.textContent = `${isDecimal ? proxy.val.toFixed(1) : Math.round(proxy.val)}${stat.suffix}`;
          },
          onComplete: () => {
            // Satisfying little pop when the number lands
            gsap.fromTo(el, { scale: 1 }, {
              scale: 1.06, duration: 0.16, yoyo: true, repeat: 1,
              ease: 'power2.out', transformOrigin: 'left bottom',
            });
          },
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });

        if (bar) {
          gsap.fromTo(bar, { scaleX: 0 }, {
            scaleX: stat.bar, duration: 2.4, ease: 'expo.out', transformOrigin: 'left center',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          });
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative py-16 md:py-24 bg-transparent border-t border-b border-white/[0.06] overflow-hidden">

      {/* Static ghost word — quiet background texture, no scroll drift */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <span
          className="text-[24vw] font-black uppercase leading-none whitespace-nowrap tracking-[-0.05em] text-transparent"
          style={{ WebkitTextStroke: '1px rgba(255,255,255,0.028)' }}
        >
          IMPACT
        </span>
      </div>

      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-10">

        <div className="mb-10 md:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: E }}
            className="text-[10px] md:text-[11px] font-bold tracking-[0.35em] uppercase text-brand-primary/80 block mb-5"
          >
            01 · Impact
          </motion.span>
          <RevealText as="h2" className="text-[9vw] md:text-[5vw] lg:text-[3.8vw] font-black uppercase tracking-[-0.03em] leading-[0.95] text-white">
            TRANSFORMATIVE
          </RevealText>
          <RevealText as="h2" className="text-[9vw] md:text-[5vw] lg:text-[3.8vw] font-black uppercase tracking-[-0.03em] leading-[0.95]" wordClassName="text-gradient-brand" delay={0.15}>
            IMPACT
          </RevealText>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.85, ease: E, delay: 0.25 }}
            className="mt-6 text-white/60 text-base leading-relaxed font-medium max-w-lg"
          >
            We are a creative network that delivers meaningful, measurable outcomes for brands across the globe. Our work speaks through numbers.
          </motion.p>
        </div>

        {/* Stats grid — Dentsu-style large numbers */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } }}
          className="grid grid-cols-2 md:grid-cols-4 border-t border-white/[0.06]"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              variants={{ hidden: { y: 50, opacity: 0, scale: 0.95 }, show: { y: 0, opacity: 1, scale: 1 } }}
              transition={{ duration: 0.9, ease: E }}
              className="stat-item group relative pt-8 md:pt-12 pb-10 pr-5 md:pr-10 lg:pr-16 border-r border-white/[0.06] last:border-r-0 even:border-r-0 md:even:border-r [&:nth-child(n+3)]:border-t [&:nth-child(n+3)]:pt-8 md:[&:nth-child(n+3)]:border-t-0"
            >
              {/* Hover fill */}
              <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Number */}
              <div
                ref={(el) => { numRefs.current[i] = el; }}
                className="relative text-[11vw] md:text-[5.5vw] lg:text-[4vw] font-black text-white tracking-[-0.04em] tabular-nums leading-none group-hover:text-white/70 transition-colors duration-500"
              >
                0{stat.suffix}
              </div>

              {/* Bar */}
              <div className="mt-5 h-px bg-white/[0.07] overflow-hidden max-w-[90px]">
                <div
                  ref={(el) => { barRefs.current[i] = el; }}
                  className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary origin-left"
                  style={{ transform: 'scaleX(0)' }}
                />
              </div>

              {/* Label */}
              <div className="mt-3 text-[10px] md:text-[11px] font-bold tracking-[0.28em] uppercase text-white/50">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default StatsSection;
