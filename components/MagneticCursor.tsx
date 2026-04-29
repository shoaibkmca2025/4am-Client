import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const MagneticCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!hasFinePointer || prefersReducedMotion) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let posX = window.innerWidth / 2;
    let posY = window.innerHeight / 2;
    let rafId = 0;

    const dotQuick = {
      x: gsap.quickTo(dot,  'x', { duration: 0.12, ease: 'power3.out' }),
      y: gsap.quickTo(dot,  'y', { duration: 0.12, ease: 'power3.out' }),
    };
    const ringQuick = {
      x: gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' }),
      y: gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' }),
    };

    const onMove = (e: PointerEvent) => {
      posX = e.clientX;
      posY = e.clientY;
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        dotQuick.x(posX);
        dotQuick.y(posY);
        ringQuick.x(posX);
        ringQuick.y(posY);
        rafId = 0;
      });
    };

    let hoveredEl: HTMLElement | null = null;
    const enlargeRing = (el: HTMLElement) => {
      hoveredEl = el;
      gsap.to(ring, { scale: 2.2, duration: 0.3, ease: 'power3.out' });
      gsap.to(dot,  { scale: 0,   duration: 0.18, ease: 'power3.out' });
    };
    const restoreRing = () => {
      hoveredEl = null;
      gsap.to(ring, { scale: 1,   duration: 0.3,  ease: 'power3.out' });
      gsap.to(dot,  { scale: 1,   duration: 0.22, ease: 'power3.out' });
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, [data-magnetic], [role="button"], input, textarea') as HTMLElement | null;
      if (interactive && interactive !== hoveredEl) enlargeRing(interactive);
      else if (!interactive && hoveredEl) restoreRing();
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver);

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: posX, y: posY });
    gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3, delay: 0.2 });

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseover', onOver);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-10 w-10 rounded-full border border-white/50 opacity-0"
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 rounded-full bg-white opacity-0"
      />
    </>
  );
};

export default MagneticCursor;
