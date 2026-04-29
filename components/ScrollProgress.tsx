import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const ScrollProgress: React.FC = () => {
  const barRef  = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar  = barRef.current;
    const glow = glowRef.current;
    if (!bar) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const quickTo = gsap.quickTo(bar, 'scaleX', {
      duration: reduced ? 0 : 0.12,
      ease: 'none',
    });

    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress   = scrollable > 0 ? window.scrollY / scrollable : 0;
      quickTo(progress);
      // Move the glow dot to the leading edge
      if (glow) glow.style.left = `${progress * 100}%`;
    };

    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[1px] pointer-events-none">
      {/* Track */}
      <div className="absolute inset-0 bg-white/[0.04]" />
      {/* Fill bar */}
      <div
        ref={barRef}
        className="absolute inset-0 bg-white/70 origin-left"
        style={{ transform: 'scaleX(0)' }}
      />
      {/* Leading glow dot */}
      <div
        ref={glowRef}
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white shadow-[0_0_6px_2px_rgba(255,255,255,0.6)]"
        style={{ left: '0%' }}
      />
    </div>
  );
};

export default ScrollProgress;
