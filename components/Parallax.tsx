import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ParallaxProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  rotate?: number;
  scale?: [number, number];
  style?: React.CSSProperties;
}

const Parallax: React.FC<ParallaxProps> = ({
  children,
  speed = 0.3,
  className = '',
  as: Tag = 'div',
  rotate = 0,
  scale,
  style,
}) => {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tween: gsap.TweenVars = {
        yPercent: -speed * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      };
      if (rotate) tween.rotate = rotate;
      if (scale) {
        gsap.fromTo(
          el,
          { scale: scale[0] },
          {
            scale: scale[1],
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      }
      gsap.to(el, tween);
    }, el);

    return () => ctx.revert();
  }, [speed, rotate, scale]);

  return React.createElement(
    Tag,
    { ref, className: `will-change-transform ${className}`, style },
    children
  );
};

export default Parallax;
