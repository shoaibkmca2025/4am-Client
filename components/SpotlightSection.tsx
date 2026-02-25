import React, { useEffect, useRef, useState } from 'react';

interface SpotlightSectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

const SpotlightSection = React.forwardRef<HTMLElement, SpotlightSectionProps>(({ children, className = '', ...rest }, ref) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const frameRef = useRef<number | null>(null);
  const pendingRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

    if (prefersReducedMotion || isCoarsePointer) {
      setEnabled(false);
    }

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    if (!enabled) return;

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    pendingRef.current = { x, y };

    if (frameRef.current === null) {
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        if (pendingRef.current) {
          setCoords(pendingRef.current);
        }
      });
    }
  };

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    if (!enabled) return;
    setVisible(true);
    handleMouseMove(event);
  };

  const handleMouseLeave = () => {
    if (!enabled) return;
    setVisible(false);
  };

  const opacity = visible && enabled ? 1 : 0;
  const backgroundImage = enabled
    ? `radial-gradient(circle at ${coords.x}px ${coords.y}px, rgba(108,99,255,0.22), transparent 40%)`
    : undefined;

  return (
    <section
      {...rest}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-300"
        style={{
          opacity,
          backgroundImage,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          mixBlendMode: 'soft-light'
        }}
      />
      {children}
    </section>
  );
});

export default SpotlightSection;

