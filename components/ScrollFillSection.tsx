import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Dentsu-style pinned "scrollytelling" statement: the section pins in place and
// scroll progress scrubs each word from an outline (stroke-only) state to a
// solid white fill, one word at a time. See LandingPage for placement.
const STATEMENT =
  'We turn ambitious ideas into digital products and campaigns that scale across the globe.';

// Words rendered larger / emphasised (matched case-insensitively, punctuation-stripped).
const EMPHASIS = new Set(['digital', 'scale', 'globe']);

const ScrollFillSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const fills = gsap.utils.toArray<HTMLElement>('.fill-layer', section);
    const label = section.querySelector('.fill-label');

    if (reduced) {
      gsap.set(fills, { opacity: 1 });
      if (label) gsap.set(label, { autoAlpha: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(fills, { opacity: 0 });

      // Intro: the small eyebrow label rises in when the section enters.
      if (label) {
        gsap.from(label, {
          y: 24,
          autoAlpha: 0,
          duration: 0.9,
          ease: 'expo.out',
          scrollTrigger: { trigger: section, start: 'top 70%', once: true },
        });
      }

      // Pinned scrub: words fill in sequence across the scroll distance.
      gsap.to(fills, {
        opacity: 1,
        ease: 'none',
        stagger: 0.5,
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=140%',
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const words = STATEMENT.split(' ');

  return (
    <section
      ref={sectionRef}
      className="relative bg-transparent border-y border-white/[0.06] overflow-hidden"
      aria-label="Our promise"
    >
      <div className="min-h-screen flex flex-col justify-center py-20 md:py-28">
        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-10">

          {/* Eyebrow label */}
          <div className="fill-label mb-8 md:mb-14 flex items-center gap-4">
            <span className="h-px w-10 md:w-16 bg-white/20" />
            <span className="text-[10px] md:text-[11px] font-bold tracking-[0.4em] uppercase text-white/40">
              What We Do
            </span>
          </div>

          {/* Outline → fill headline */}
          <h2
            ref={headlineRef}
            className="text-[9vw] md:text-[6.5vw] lg:text-[5.5vw] font-black uppercase tracking-[-0.03em] leading-[1.02] max-w-[16ch]"
            aria-label={STATEMENT}
          >
            {words.map((word, i) => {
              const clean = word.replace(/[^a-z]/gi, '').toLowerCase();
              const emphasised = EMPHASIS.has(clean);
              return (
                <span
                  key={i}
                  aria-hidden="true"
                  className={`relative inline-block mr-[0.25em] ${emphasised ? 'italic' : ''}`}
                >
                  {/* Outline base — always visible */}
                  <span
                    className="text-transparent"
                    style={{ WebkitTextStroke: '1px rgba(255,255,255,0.22)' }}
                  >
                    {word}
                  </span>
                  {/* Fill layer — scrubbed in on scroll */}
                  <span
                    className={`fill-layer absolute inset-0 ${
                      emphasised ? 'text-brand-primary' : 'text-white'
                    }`}
                  >
                    {word}
                  </span>
                </span>
              );
            })}
          </h2>

        </div>
      </div>
    </section>
  );
};

export default ScrollFillSection;
