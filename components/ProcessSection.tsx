import React, { useRef, useLayoutEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import RevealText from './RevealText';

gsap.registerPlugin(ScrollTrigger);

const E: [number, number, number, number] = [0.16, 1, 0.3, 1];

const STEPS = [
  {
    number: '01',
    title: 'DISCOVER',
    description:
      'Deep brand and market research to pinpoint your audience, competitive landscape, and the biggest growth levers available.',
  },
  {
    number: '02',
    title: 'STRATEGIZE',
    description:
      'A clear, measurable roadmap — channels, budget, and creative direction all aligned precisely to your business objectives.',
  },
  {
    number: '03',
    title: 'EXECUTE',
    description:
      'Design, engineering, and campaigns shipped at pace. No delays, no compromises, no micromanagement required.',
  },
  {
    number: '04',
    title: 'SCALE',
    description:
      'Continuous optimization and compounding results across every channel as your brand builds unstoppable momentum.',
  },
];

const ProcessSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-linked horizontal drift on the ghost word
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgX = useTransform(scrollYProgress, [0, 1], ['10%', '-10%']);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      // Each step number drifts up at a slightly different rate for parallax depth
      const stepNums = section.querySelectorAll<HTMLElement>('.step-ghost-num');
      stepNums.forEach((el, i) => {
        gsap.to(el, {
          y: -30 - i * 10,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2,
          },
        });
      });

      // Hover on step cards
      const cards = section.querySelectorAll<HTMLElement>('.step-card');
      const cleanups: (() => void)[] = [];
      cards.forEach((card) => {
        const arrow = card.querySelector<HTMLElement>('.step-arrow');
        const onEnter = () => {
          if (arrow) gsap.to(arrow, { x: 5, y: -5, duration: 0.35, ease: 'expo.out' });
        };
        const onLeave = () => {
          if (arrow) gsap.to(arrow, { x: 0, y: 0, duration: 0.3, ease: 'expo.out' });
        };
        card.addEventListener('mouseenter', onEnter);
        card.addEventListener('mouseleave', onLeave);
        cleanups.push(() => {
          card.removeEventListener('mouseenter', onEnter);
          card.removeEventListener('mouseleave', onLeave);
        });
      });

      return () => cleanups.forEach((fn) => fn());
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 md:py-32 bg-black border-t border-white/[0.06] overflow-hidden">

      {/* Scroll-parallax ghost word */}
      <motion.div
        className="absolute inset-0 flex items-end justify-end pr-[5%] pb-[5%] pointer-events-none select-none"
        style={{ x: bgX }}
        aria-hidden="true"
      >
        <span
          className="text-[18vw] font-black uppercase leading-none tracking-[-0.05em] text-transparent"
          style={{ WebkitTextStroke: '1px rgba(255,255,255,0.022)' }}
        >
          PROCESS
        </span>
      </motion.div>

      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-10">

        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14 md:mb-20">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: E }}
              className="text-[10px] md:text-[11px] font-bold tracking-[0.35em] uppercase text-white/25 block mb-5"
            >
              How We Work
            </motion.span>
            <RevealText as="h2" className="block text-[8vw] md:text-[6vw] lg:text-[5vw] font-black uppercase tracking-[-0.03em] leading-[0.9] text-white">
              OUR
            </RevealText>
            <RevealText as="h2" className="block text-[8vw] md:text-[6vw] lg:text-[5vw] font-black uppercase tracking-[-0.03em] leading-[0.9] text-transparent" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.12)' }} delay={0.12}>
              PROCESS
            </RevealText>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: E, delay: 0.2 }}
            className="text-white/30 text-sm md:text-base max-w-sm leading-relaxed font-medium md:text-right md:pb-2"
          >
            Four stages that take a brand from discovery to scale — clear, repeatable, and built to compound over time.
          </motion.p>
        </div>

        {/* Steps */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.13 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-white/[0.06]"
        >
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              variants={{ hidden: { y: 60, opacity: 0 }, show: { y: 0, opacity: 1 } }}
              transition={{ duration: 0.85, ease: E }}
              className="step-card group relative pt-8 md:pt-10 pb-10 md:pb-12 pr-6 lg:pr-10 sm:border-r sm:last:border-r-0 lg:[&:nth-child(3)]:border-r lg:[&:nth-child(2)]:border-r border-white/[0.06] border-b sm:border-b-0 last:border-b-0 hover:bg-white/[0.015] transition-colors duration-500"
            >
              {/* Ghost step number — GSAP scrub drives its Y */}
              <div
                className="step-ghost-num text-[5.5rem] md:text-[6.5rem] font-black text-transparent leading-none tracking-[-0.04em] mb-5 will-change-transform"
                style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.06)' }}
                aria-hidden="true"
              >
                {step.number}
              </div>

              {/* Thin accent line */}
              <div className="w-8 h-px bg-white/15 mb-5 group-hover:w-14 transition-all duration-500" />

              {/* Title */}
              <h3 className="text-lg md:text-xl font-black uppercase tracking-[-0.01em] text-white mb-3 group-hover:text-white/70 transition-colors duration-400">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-white/28 text-[13px] leading-relaxed font-medium">
                {step.description}
              </p>

              {/* Arrow icon */}
              <div className="step-arrow mt-6 w-8 h-8 rounded-full border border-white/[0.07] flex items-center justify-center text-white/25 group-hover:border-white/20 group-hover:text-white/60 transition-colors duration-400">
                <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                  <path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default ProcessSection;
