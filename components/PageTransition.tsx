import React, { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';

const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const tl = gsap.timeline();
    tl.set(overlay, { yPercent: 100, autoAlpha: 1 })
      .to(overlay, { yPercent: 0, duration: 0.55, ease: 'expo.inOut' })
      .to(overlay, { yPercent: -100, duration: 0.55, ease: 'expo.inOut', delay: 0.1 })
      .set(overlay, { autoAlpha: 0 });
  }, [location.pathname]);

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9995] bg-black pointer-events-none opacity-0"
        aria-hidden="true"
      />
      {children}
    </>
  );
};

export default PageTransition;
