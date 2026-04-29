import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface MarqueeProps {
  items: string[];
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
  separator?: string;
  scrollVelocity?: boolean;
}

const Marquee: React.FC<MarqueeProps> = ({
  items,
  speed = 40,
  direction = 'left',
  className = '',
  separator = '·',
  scrollVelocity = true,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const rootRef  = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    // Wait one frame so scrollWidth is measured after fonts/layout settle
    let raf = requestAnimationFrame(() => {
      const half = track.scrollWidth / 2;
      if (half <= 0) return;

      // Seed the start position for right-direction so it doesn't flash
      if (direction === 'right') gsap.set(track, { x: -half });

      const tween = gsap.to(track, {
        x: direction === 'left' ? -half : 0,
        duration: speed,
        ease: 'none',
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((raw: number) => {
            return direction === 'left'
              ? -((-raw % half + half) % half)
              : ((raw + half) % half) - half;
          }),
        },
      });

      // Velocity boost on scroll — stored outside GSAP context for proper cleanup
      if (!scrollVelocity) return;

      let lastY   = window.scrollY;
      let pending: number | null = null;

      const onScroll = () => {
        const curr = window.scrollY;
        const delta = Math.abs(curr - lastY);
        lastY = curr;
        const boost = gsap.utils.clamp(1, 4, 1 + delta / 8);
        tween.timeScale(boost);
        if (pending !== null) clearTimeout(pending);
        pending = window.setTimeout(() => { tween.timeScale(1); pending = null; }, 350);
      };

      window.addEventListener('scroll', onScroll, { passive: true });

      // Store cleanup on the ref so we can access it in the return
      (track as HTMLDivElement & { _cleanup?: () => void })._cleanup = () => {
        tween.kill();
        window.removeEventListener('scroll', onScroll);
        if (pending !== null) clearTimeout(pending);
      };
    });

    return () => {
      cancelAnimationFrame(raf);
      const t = track as HTMLDivElement & { _cleanup?: () => void };
      if (t._cleanup) { t._cleanup(); t._cleanup = undefined; }
    };
  }, [direction, speed, scrollVelocity]);

  const content = items.map((item, i) => (
    <span key={i} className="inline-flex items-center shrink-0">
      <span className="whitespace-nowrap">{item}</span>
      <span className="mx-8 md:mx-14 opacity-20">{separator}</span>
    </span>
  ));

  return (
    <div ref={rootRef} className={`overflow-hidden ${className}`} aria-hidden="true">
      <div ref={trackRef} className="flex will-change-transform">
        {content}
        {content}
        {content}
      </div>
    </div>
  );
};

export default Marquee;
