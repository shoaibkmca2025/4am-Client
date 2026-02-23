import React, { useEffect, useRef, useState } from 'react';

interface ParallaxLayerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  strength?: number;
  disabledOnMobile?: boolean;
}

const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  children,
  className = '',
  strength = 0.4,
  disabledOnMobile = true,
  style,
  ...rest
}) => {
  const [offset, setOffset] = useState(0);
  const [enabled, setEnabled] = useState(true);
  const frameRef = useRef<number | null>(null);
  const pendingRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const isSmallScreen = window.innerWidth < 768;

    if (prefersReducedMotion || isCoarsePointer || (disabledOnMobile && isSmallScreen)) {
      setEnabled(false);
      return;
    }

    const handleScroll = () => {
      if (!enabled) return;
      const y = window.scrollY || window.pageYOffset || 0;
      pendingRef.current = y;

      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(() => {
          frameRef.current = null;
          if (pendingRef.current !== null) {
            setOffset(pendingRef.current * strength);
          }
        });
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [enabled, strength, disabledOnMobile]);

  const transform = enabled ? `translate3d(0, ${offset}px, 0)` : undefined;

  return (
    <div
      {...rest}
      style={{
        ...(style || {}),
        transform
      }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </div>
  );
};

export default ParallaxLayer;

