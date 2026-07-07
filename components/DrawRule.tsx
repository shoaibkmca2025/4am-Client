import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// A hairline that draws itself across the section top as it scrolls into
// view — replaces static borders with a subtle "the page is alive" cue.
const DrawRule: React.FC<{ className?: string }> = ({ className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(el, { scaleX: 1 });
      return;
    }
    const tween = gsap.fromTo(el, { scaleX: 0 }, {
      scaleX: 1,
      duration: 1.4,
      ease: 'expo.out',
      transformOrigin: 'left center',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, []);

  return (
    <div className={`absolute top-0 left-0 right-0 h-px pointer-events-none ${className}`} aria-hidden="true">
      <div
        ref={ref}
        className="h-full w-full bg-gradient-to-r from-brand-primary/50 via-white/15 to-transparent"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
};

export default DrawRule;
