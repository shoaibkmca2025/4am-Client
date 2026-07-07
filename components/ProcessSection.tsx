import React, { useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import RevealText from './RevealText';
import DrawRule from './DrawRule';

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

// Vertical timeline: steps reveal as they enter, and the rail's orange
// fill grows with scroll — scroll-driven, but never hijacks the page.
const ProcessSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef    = useRef<HTMLDivElement>(null);
  const fillRef    = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const list    = listRef.current;
    const fill    = fillRef.current;
    if (!section || !list) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      if (fill) gsap.set(fill, { scaleY: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      // Rail fill follows scroll position through the list
      if (fill) {
        gsap.fromTo(fill, { scaleY: 0 }, {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top center',
          scrollTrigger: {
            trigger: list,
            start: 'top 70%',
            end: 'bottom 45%',
            scrub: 0.6,
          },
        });
      }

      // Steps rise in once as they enter
      gsap.utils.toArray<HTMLElement>('.process-step', list).forEach((step) => {
        gsap.fromTo(step, { y: 44, autoAlpha: 0 }, {
          y: 0, autoAlpha: 1, duration: 0.9, ease: 'expo.out',
          scrollTrigger: { trigger: step, start: 'top 82%', once: true },
        });

        // Dot lights up as its step passes the rail-fill line
        const dot = step.querySelector('.process-dot');
        if (dot) {
          ScrollTrigger.create({
            trigger: step,
            start: 'top 55%',
            onEnter: () => gsap.to(dot, { backgroundColor: '#FF6A3D', scale: 1.25, boxShadow: '0 0 14px rgba(255,106,61,0.65)', duration: 0.35 }),
            onLeaveBack: () => gsap.to(dot, { backgroundColor: 'rgba(255,255,255,0.15)', scale: 1, boxShadow: '0 0 0 rgba(0,0,0,0)', duration: 0.3 }),
          });
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="process" ref={sectionRef} className="relative py-16 md:py-24 bg-transparent border-t border-white/[0.06] overflow-hidden">
      <DrawRule />
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-10">

        {/* ── Header ── */}
        <div className="mb-12 md:mb-16 max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: E }}
            className="text-[10px] md:text-[11px] font-bold tracking-[0.35em] uppercase text-brand-cyan/80 block mb-5"
          >
            05 · How We Work
          </motion.span>
          <RevealText as="h2" className="block text-[9vw] md:text-[5vw] lg:text-[3.8vw] font-black uppercase tracking-[-0.03em] leading-[0.95] text-white">
            FOUR STEPS,
          </RevealText>
          <RevealText as="h2" className="block text-[9vw] md:text-[5vw] lg:text-[3.8vw] font-black uppercase tracking-[-0.03em] leading-[0.95]" wordClassName="text-gradient-tech" delay={0.12}>
            ZERO GUESSWORK
          </RevealText>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: E, delay: 0.2 }}
            className="mt-5 text-white/60 text-base leading-relaxed font-medium"
          >
            A clear, repeatable path from first call to compounding growth —
            you always know exactly where your project stands.
          </motion.p>
        </div>

        {/* ── Timeline ── */}
        <div ref={listRef} className="relative">
          {/* Rail */}
          <div className="absolute left-[7px] md:left-[9px] top-2 bottom-2 w-px bg-white/[0.08]" aria-hidden="true">
            <div
              ref={fillRef}
              className="absolute inset-0 bg-gradient-to-b from-brand-primary via-brand-secondary to-brand-cyan"
              style={{ transform: 'scaleY(0)' }}
            />
          </div>

          {STEPS.map((step) => (
            <div key={step.number} className="process-step relative pl-10 md:pl-16 py-8 md:py-10">
              {/* Dot on the rail */}
              <span
                className="process-dot absolute left-0 md:left-[2px] top-[46px] md:top-[54px] w-[15px] h-[15px] rounded-full bg-white/15 border border-black"
                aria-hidden="true"
              />
              <div className="grid md:grid-cols-[110px_1fr] lg:grid-cols-[160px_1fr] gap-3 md:gap-10 items-start max-w-4xl">
                <div
                  className="text-4xl md:text-6xl font-black leading-none tracking-[-0.04em] text-transparent"
                  style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.25)' }}
                  aria-hidden="true"
                >
                  {step.number}
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-black uppercase tracking-[-0.01em] text-white mb-2.5">
                    {step.title}
                  </h3>
                  <p className="text-white/60 text-sm md:text-base leading-relaxed font-medium max-w-xl">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ProcessSection;
