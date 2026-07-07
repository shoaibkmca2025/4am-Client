import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { scrollToSection, scrollToTop } from '../utils/scroll';
import { useActiveSection } from '../utils/useActiveSection';

// Right-edge dot navigation for the landing page. Shows where you are
// on the (very long) scroll journey and jumps to any section in one click.
const SECTIONS = [
  { id: 'home',         label: 'Intro' },
  { id: 'about',        label: 'Impact' },
  { id: 'services',     label: 'Services' },
  { id: 'engineering',  label: 'Engineering' },
  { id: 'growth',       label: 'Growth' },
  { id: 'process',      label: 'Process' },
  { id: 'work',         label: 'Work' },
  { id: 'contact',      label: 'Contact' },
];

const IDS = SECTIONS.map((s) => s.id);

const SectionNav: React.FC = () => {
  const active = useActiveSection(IDS);
  const rootRef = useRef<HTMLElement>(null);

  // Gentle entrance once the page has settled
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      gsap.set(root, { autoAlpha: 1 });
      return;
    }
    const tween = gsap.fromTo(
      root,
      { autoAlpha: 0, x: 16 },
      { autoAlpha: 1, x: 0, duration: 0.9, ease: 'expo.out', delay: 1.4 },
    );
    return () => { tween.kill(); };
  }, []);

  const jump = (id: string) => {
    if (id === 'home') scrollToTop();
    else scrollToSection(id);
  };

  return (
    <nav
      ref={rootRef}
      className="fixed right-5 xl:right-7 top-1/2 -translate-y-1/2 z-[9980] hidden lg:flex flex-col items-end gap-3 opacity-0"
      aria-label="Page sections"
    >
      {SECTIONS.map((s) => {
        const isActive = s.id === active;
        return (
          <button
            key={s.id}
            onClick={() => jump(s.id)}
            className="group flex items-center gap-3 py-0.5"
            aria-label={`Go to ${s.label}`}
            aria-current={isActive ? 'true' : undefined}
          >
            <span
              className={`text-[9px] font-bold tracking-[0.25em] uppercase transition-all duration-300 ${
                isActive
                  ? 'text-brand-secondary opacity-100 translate-x-0'
                  : 'text-white/40 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
              }`}
            >
              {s.label}
            </span>
            <span
              className={`rounded-full transition-all duration-400 ${
                isActive
                  ? 'w-5 h-[7px] bg-gradient-to-r from-brand-primary to-brand-secondary shadow-[0_0_10px_rgba(255,106,61,0.5)]'
                  : 'w-[7px] h-[7px] bg-white/15 group-hover:bg-white/50'
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
};

export default SectionNav;
