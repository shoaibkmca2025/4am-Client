import React, { useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
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
  const sectionRef    = useRef<HTMLElement>(null);
  const trackRef      = useRef<HTMLDivElement>(null);
  const progressRef   = useRef<HTMLDivElement>(null);
  const stepNumRef    = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track   = trackRef.current;
    if (!section || !track) return;

    const reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    if (reduced || isMobile) {
      // Mobile: subtle stagger entrance for vertical cards
      const cards = section.querySelectorAll<HTMLElement>('.step-card');
      cards.forEach((card, i) => {
        gsap.fromTo(card,
          { y: 40, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.9, delay: i * 0.1, ease: 'expo.out',
            scrollTrigger: { trigger: card, start: 'top 88%', once: true } }
        );
      });
      return;
    }

    const cleanups: (() => void)[] = [];

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.step-card', track);

      // Initial state
      gsap.set(cards, { opacity: 0.25, scale: 0.93 });
      if (cards[0]) gsap.set(cards[0], { opacity: 1, scale: 1 });

      // Horizontal pin-and-scroll
      const mainST = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${track.scrollWidth - window.innerWidth + window.innerHeight * 0.3}`,
        pin: true,
        anticipatePin: 1,
        scrub: 1.2,
        invalidateOnRefresh: true,
        onUpdate(self) {
          // Move track horizontally
          const x = -self.progress * (track.scrollWidth - window.innerWidth);
          gsap.set(track, { x });

          // Progress bar
          if (progressRef.current) {
            progressRef.current.style.transform = `scaleX(${self.progress})`;
          }

          // Active step counter
          const numCards = cards.length;
          const activeIndex = Math.min(Math.floor(self.progress * numCards), numCards - 1);
          if (stepNumRef.current) {
            stepNumRef.current.textContent = `0${activeIndex + 1}`;
          }

          // Card highlight
          cards.forEach((card, i) => {
            const isActive = i === activeIndex;
            gsap.to(card, {
              opacity: isActive ? 1 : 0.25,
              scale: isActive ? 1 : 0.93,
              duration: 0.4,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          });
        },
      });

      // Hover on cards (pointer events still work since cards don't move during hover)
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

    }, section);

    return () => { ctx.revert(); cleanups.forEach((fn) => fn()); };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-black border-t border-white/[0.06] overflow-hidden"
    >
      {/* ── Header ── */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-10 pt-20 md:pt-24 pb-6 md:pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-6 md:mb-8">
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
            <RevealText
              as="h2"
              className="block text-[8vw] md:text-[6vw] lg:text-[5vw] font-black uppercase tracking-[-0.03em] leading-[0.9] text-white"
            >
              OUR
            </RevealText>
            <RevealText
              as="h2"
              className="block text-[8vw] md:text-[6vw] lg:text-[5vw] font-black uppercase tracking-[-0.03em] leading-[0.9] text-transparent"
              style={{ WebkitTextStroke: '2px rgba(255,255,255,0.12)' }}
              delay={0.12}
            >
              PROCESS
            </RevealText>
          </div>
          <div className="flex flex-col items-end gap-3">
            <motion.p
              initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: E, delay: 0.2 }}
              className="text-white/30 text-sm md:text-base max-w-sm leading-relaxed font-medium md:text-right"
            >
              Four stages that take a brand from discovery to scale — clear, repeatable, and built to compound over time.
            </motion.p>
            {/* Step counter (desktop only) */}
            <div className="hidden md:flex items-center gap-2 text-[11px] font-bold tracking-[0.25em] text-white/20 uppercase">
              <span ref={stepNumRef}>01</span>
              <span className="text-white/10">/ 04</span>
            </div>
          </div>
        </div>

        {/* Progress bar (desktop) */}
        <div className="hidden md:block h-px bg-white/[0.06] overflow-hidden">
          <div
            ref={progressRef}
            className="h-full bg-white/40 origin-left"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>
      </div>

      {/* ── Mobile vertical cards ── */}
      <div className="block md:hidden px-6 pb-16">
        {STEPS.map((step, i) => (
          <div
            key={step.number}
            className="step-card border-t border-white/[0.06] py-10 group"
          >
            <div
              className="text-[5rem] font-black text-transparent leading-none tracking-[-0.04em] mb-5"
              style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.06)' }}
              aria-hidden="true"
            >
              {step.number}
            </div>
            <div className="w-8 h-px bg-white/15 mb-5" />
            <h3 className="text-lg font-black uppercase tracking-[-0.01em] text-white mb-3">
              {step.title}
            </h3>
            <p className="text-white/28 text-[13px] leading-relaxed font-medium">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      {/* ── Desktop horizontal track ── */}
      <div
        ref={trackRef}
        className="hidden md:flex h-[65vh] will-change-transform"
        style={{ width: `${STEPS.length * 100}vw` }}
      >
        {STEPS.map((step, i) => (
          <div
            key={step.number}
            className="step-card shrink-0 flex items-center px-[8vw] md:px-[6vw] lg:px-[8vw]"
            style={{ width: '100vw' }}
          >
            <div className="max-w-xl">
              {/* Ghost number */}
              <div
                className="step-ghost-num text-[8rem] md:text-[10rem] font-black text-transparent leading-none tracking-[-0.04em] mb-6 will-change-transform"
                style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.07)' }}
                aria-hidden="true"
              >
                {step.number}
              </div>
              {/* Accent line */}
              <div className="w-12 h-px bg-white/20 mb-6 group-hover:w-20 transition-all duration-500" />
              {/* Title */}
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-[-0.02em] text-white mb-5">
                {step.title}
              </h3>
              {/* Description */}
              <p className="text-white/35 text-base md:text-lg leading-relaxed font-medium max-w-md">
                {step.description}
              </p>
              {/* Arrow */}
              <div className="step-arrow mt-8 w-10 h-10 rounded-full border border-white/[0.08] flex items-center justify-center text-white/30">
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProcessSection;
