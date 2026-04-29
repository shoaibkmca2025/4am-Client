import React, { useRef, useLayoutEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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

  // Horizontal parallax — "IMPACT" drifts left as you scroll through
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgX     = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const titleY  = useTransform(scrollYProgress, [0, 1], ['4%', '-4%']);

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
    <section id="about" ref={sectionRef} className="relative py-20 md:py-32 bg-black border-t border-b border-white/[0.06] overflow-hidden">

      {/* Scroll-linked ghost word — drifts horizontally as you scroll */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{ x: bgX }}
        aria-hidden="true"
      >
        <span
          className="text-[24vw] font-black uppercase leading-none whitespace-nowrap tracking-[-0.05em] text-transparent"
          style={{ WebkitTextStroke: '1px rgba(255,255,255,0.028)' }}
        >
          IMPACT
        </span>
      </motion.div>

      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-10">

        {/* Heading with subtle Y parallax */}
        <motion.div style={{ y: titleY }} className="mb-14 md:mb-24">
          <RevealText as="h2" className="text-[8vw] md:text-[7vw] lg:text-[5.5vw] font-black uppercase tracking-[-0.03em] leading-[0.88] text-white">
            TRANSFORMATIVE
          </RevealText>
          <RevealText as="h2" className="text-[8vw] md:text-[7vw] lg:text-[5.5vw] font-black uppercase tracking-[-0.03em] leading-[0.88] text-transparent" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.15)' }} delay={0.15}>
            IMPACT
          </RevealText>
          <motion.p
            initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.85, ease: E, delay: 0.25 }}
            className="mt-7 text-white/35 text-base md:text-lg leading-relaxed font-medium max-w-xl"
          >
            We are a creative network that delivers meaningful, measurable outcomes for brands across the globe. Our work speaks through numbers.
          </motion.p>
        </motion.div>

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
                className="relative text-[10vw] sm:text-[7vw] md:text-[5vw] lg:text-[4vw] xl:text-[3.5vw] font-black text-white tracking-[-0.04em] tabular-nums leading-none group-hover:text-white/70 transition-colors duration-500"
              >
                0{stat.suffix}
              </div>

              {/* Bar */}
              <div className="mt-5 h-px bg-white/[0.07] overflow-hidden max-w-[90px]">
                <div
                  ref={(el) => { barRefs.current[i] = el; }}
                  className="h-full bg-white/60 origin-left"
                  style={{ transform: 'scaleX(0)' }}
                />
              </div>

              {/* Label */}
              <div className="mt-3 text-[10px] md:text-[11px] font-bold tracking-[0.28em] uppercase text-white/25">
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
