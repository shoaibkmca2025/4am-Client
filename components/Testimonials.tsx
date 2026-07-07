import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, MotionConfig } from 'framer-motion';
import { gsap } from 'gsap';
import RevealText from './RevealText';
import DrawRule from './DrawRule';

const testimonials = [
  {
    id: 1,
    quote: 'The 4AM team brought clarity to our growth strategy and execution. They operate like an extension of our internal team.',
    author: 'Sarah J.',
    role: 'Head of Marketing, SaaS Brand',
  },
  {
    id: 2,
    quote: 'We saw a meaningful lift in qualified pipeline within the first quarter. Their data-driven approach changed everything.',
    author: 'Michael R.',
    role: 'Founder, DTC Brand',
  },
  {
    id: 3,
    quote: 'Data, creative, and execution all feel aligned in a way they never did before. Truly transformative partnership.',
    author: 'David K.',
    role: 'Director, B2B Services',
  },
];

const Testimonials: React.FC = () => {
  const [index, setIndex]       = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef  = useRef<HTMLElement>(null);
  const quoteRef    = useRef<HTMLParagraphElement>(null);
  const authorRef   = useRef<HTMLElement>(null);
  const wrapRef     = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);

  // ── 3D flip quote transition ─────────────────────────────────────────
  const animateTo = useCallback((nextIndex: number) => {
    if (isAnimating.current) return;
    const wrap = wrapRef.current;
    if (!wrap) { setIndex(nextIndex); return; }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { setIndex(nextIndex); return; }

    isAnimating.current = true;

    const tl = gsap.timeline({
      onComplete: () => { isAnimating.current = false; },
    });

    // Flip out — rotate on Y axis
    tl.to(wrap, {
      rotateY: 75,
      autoAlpha: 0,
      duration: 0.38,
      ease: 'power2.in',
      transformPerspective: 1200,
      transformOrigin: 'center center',
    })
      .call(() => setIndex(nextIndex))
      .set(wrap, { rotateY: -75 })
      // Flip in
      .to(wrap, {
        rotateY: 0,
        autoAlpha: 1,
        duration: 0.55,
        ease: 'power2.out',
        transformPerspective: 1200,
      });
  }, []);

  // ── Auto-advance ─────────────────────────────────────────────────────
  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      animateTo((index + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(id);
  }, [isPaused, index, animateTo]);

  const handlePrev = useCallback(() => {
    animateTo(index === 0 ? testimonials.length - 1 : index - 1);
  }, [index, animateTo]);

  const handleNext = useCallback(() => {
    animateTo((index + 1) % testimonials.length);
  }, [index, animateTo]);

  const active = testimonials[index];

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="testimonials"
        ref={sectionRef}
        className="relative py-16 md:py-24 bg-transparent border-t border-white/[0.06] overflow-hidden"
      >
        <DrawRule />
        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-10">

          {/* Heading */}
          <div className="mb-10 md:mb-14">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-[10px] md:text-[11px] font-bold tracking-[0.35em] uppercase text-brand-accent/80 block mb-5"
            >
              07 · Client Feedback
            </motion.span>
            <RevealText
              as="h2"
              className="text-[9vw] md:text-[5vw] lg:text-[3.8vw] font-black uppercase tracking-[-0.03em] leading-[0.95] text-white"
            >
              WHAT
            </RevealText>
            <RevealText
              as="h2"
              className="text-[9vw] md:text-[5vw] lg:text-[3.8vw] font-black uppercase tracking-[-0.03em] leading-[0.95]"
              wordClassName="text-gradient-tech"
              delay={0.15}
            >
              THEY SAY
            </RevealText>

            {/* Rating badge pops in */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: 12 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.35 }}
              className="inline-flex items-center gap-2.5 mt-6 rounded-full border border-brand-secondary/30 bg-brand-secondary/10 px-4 py-2"
            >
              <span className="text-brand-secondary text-sm leading-none" aria-hidden="true">★★★★★</span>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-secondary/90">
                5.0 · Loved by clients
              </span>
            </motion.div>
          </div>

          {/* Testimonial body */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Decorative quote mark */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-[150px] md:text-[220px] font-black text-brand-accent/[0.06] leading-none absolute -top-10 -left-4 select-none pointer-events-none"
              aria-hidden="true"
            >
              &ldquo;
            </motion.div>

            {/* 3D-flip quote wrapper */}
            <div
              ref={wrapRef}
              className="relative z-10 min-h-[180px] md:min-h-[220px] flex items-center"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <blockquote>
                <p
                  ref={quoteRef}
                  className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-[1.15] tracking-[-0.02em]"
                >
                  &ldquo;{active.quote}&rdquo;
                </p>
                <footer
                  ref={authorRef}
                  className="mt-8 md:mt-12 flex items-center gap-4"
                >
                  <div className="w-12 h-px bg-white/15" />
                  <div>
                    <div className="text-xs font-bold text-white uppercase tracking-[0.2em]">
                      {active.author}
                    </div>
                    <div className="text-[10px] text-white/50 font-bold tracking-[0.2em] uppercase mt-1">
                      {active.role}
                    </div>
                  </div>
                </footer>
              </blockquote>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6 mt-12 md:mt-16">
              <button
                onClick={handlePrev}
                className="w-12 h-12 rounded-full border border-white/[0.08] flex items-center justify-center text-white/40 hover:bg-white hover:text-black hover:border-white active:scale-90 transition-all duration-300"
                aria-label="Previous"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M12 8H4M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => animateTo(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === index ? 'bg-brand-primary w-8' : 'bg-white/15 w-1.5 hover:bg-white/30'
                    }`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="w-12 h-12 rounded-full border border-white/[0.08] flex items-center justify-center text-white/40 hover:bg-white hover:text-black hover:border-white active:scale-90 transition-all duration-300"
                aria-label="Next"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 8h8M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
};

export default Testimonials;
