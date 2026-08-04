import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const MagneticCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!hasFinePointer || prefersReducedMotion) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring) return;

    let posX = window.innerWidth / 2;
    let posY = window.innerHeight / 2;
    let rafId = 0;

    const dotQuick = {
      x: gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' }),
      y: gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' }),
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

    // ── Cursor modes ─────────────────────────────────────────────────
    let hoveredEl: HTMLElement | null = null;
    let currentMode: 'default' | 'interactive' | 'view' = 'default';

    const setDefault = () => {
      currentMode = 'default';
      hoveredEl = null;
      gsap.to(ring, { scale: 1, duration: 0.3, ease: 'power3.out' });
      gsap.to(dot, { scale: 1, duration: 0.22, ease: 'power3.out' });
      if (label) gsap.to(label, { autoAlpha: 0, duration: 0.18 });
    };

    const setInteractive = (el: HTMLElement) => {
      currentMode = 'interactive';
      hoveredEl = el;
      gsap.to(ring, { scale: 2.2, duration: 0.3, ease: 'power3.out' });
      gsap.to(dot, { scale: 0, duration: 0.18, ease: 'power3.out' });
      if (label) gsap.to(label, { autoAlpha: 0, duration: 0.15 });
    };

    const setView = (el: HTMLElement) => {
      currentMode = 'view';
      hoveredEl = el;
      gsap.to(ring, { scale: 3.5, duration: 0.35, ease: 'power3.out' });
      gsap.to(dot, { scale: 0, duration: 0.18, ease: 'power3.out' });
      if (label) gsap.to(label, { autoAlpha: 1, duration: 0.25, ease: 'power3.out' });
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const projectCard = target.closest('.project-card') as HTMLElement | null;
      const interactive = projectCard
        ? null
        : (target.closest('a, button, [data-magnetic], [role="button"], input, textarea') as HTMLElement | null);

      if (projectCard && projectCard !== hoveredEl) {
        setView(projectCard);
      } else if (interactive && interactive !== hoveredEl) {
        setInteractive(interactive);
      } else if (!projectCard && !interactive && hoveredEl) {
        setDefault();
      }
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver);
    document.addEventListener('pointerleave', setDefault);

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: posX, y: posY });
    if (label) gsap.set(label, { autoAlpha: 0 });
    gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3, delay: 0.2 });

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('pointerleave', setDefault);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Outer ring — enlarges on interactive, scales to 3.5× on project cards */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-10 w-10 rounded-full border border-[#201e1d]/45 opacity-0 flex items-center justify-center"
      >
        <span
          ref={labelRef}
          className="text-[7px] font-bold tracking-[0.18em] uppercase text-[#201e1d] select-none"
        >
          VIEW
        </span>
      </div>

      {/* Inner dot — hides when ring is enlarged */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 rounded-full bg-[#c67139] opacity-0"
      />
    </>
  );
};

export default MagneticCursor;
