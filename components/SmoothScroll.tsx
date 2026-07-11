import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SmoothScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    ScrollTrigger.config({
      ignoreMobileResize: true,
    });

    // ── Touch devices: fully native scrolling ────────────────────────
    // Lenis only smooths WHEEL input (syncTouch is off), so on phones its
    // rAF pipeline is pure per-frame overhead — and a second scroll
    // source that can fight the native one. ScrollTrigger listens to the
    // window directly instead.
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) {
      const rafId = requestAnimationFrame(() => ScrollTrigger.refresh());
      const handleAnchor = (e: Event) => {
        const target = e.target as HTMLElement;
        const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
        if (!anchor) return;
        const id = anchor.getAttribute('href');
        if (!id || id === '#') return;
        const el = document.querySelector(id);
        if (!el) return;
        e.preventDefault();
        window.scrollTo({
          top: (el as HTMLElement).getBoundingClientRect().top + window.scrollY - 80,
          behavior: 'smooth',
        });
      };
      document.addEventListener('click', handleAnchor);
      return () => {
        cancelAnimationFrame(rafId);
        document.removeEventListener('click', handleAnchor);
      };
    }

    // ── Desktop: Lenis smooth wheel ──────────────────────────────────
    const lenis = new Lenis({
      // Slightly longer glide + softer lerp for a silkier feel.
      duration: 1.25,
      easing: (t: number) => 1 - Math.pow(1 - t, 4), // easeOutQuart
      lerp: 0.075,
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: false,
    });

    // Bridge Lenis scroll position → GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Refresh after Lenis takes over so pin spacers are recalculated correctly
    const rafId = requestAnimationFrame(() => ScrollTrigger.refresh());

    const handleAnchor = (e: Event) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -80 });
    };
    document.addEventListener('click', handleAnchor);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('click', handleAnchor);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;
