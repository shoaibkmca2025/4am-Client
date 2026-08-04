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
      // Move the glow dot with a transform — animating `left` forces layout
      if (glow) glow.style.transform = `translate(${progress * 100}vw, -50%) translateX(-50%)`;
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[2px] pointer-events-none">
      {/* Track */}
      <div className="absolute inset-0 bg-[#201e1d]/[0.06]" />
      {/* Fill bar */}
      <div
        ref={barRef}
        className="absolute inset-0 bg-gradient-to-r from-[#c67139] via-[#7a8a5e] to-[#c67139] origin-left"
        style={{ transform: 'scaleX(0)' }}
      />
      {/* Leading glow dot — positioned purely via transform */}
      <div
        ref={glowRef}
        className="absolute top-1/2 left-0 w-1.5 h-1.5 rounded-full bg-[#c67139] shadow-[0_0_8px_2px_rgba(198,113,57,0.6)]"
        style={{ transform: 'translate(0vw, -50%) translateX(-50%)' }}
      />
    </div>
  );
};

export default ScrollProgress;
