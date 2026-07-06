import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface RevealTextProps {
  children: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  className?: string;
  wordClassName?: string;
  style?: React.CSSProperties;
  stagger?: number;
  delay?: number;
  duration?: number;
  start?: string;
}

const RevealText: React.FC<RevealTextProps> = ({
  children,
  as: Tag = 'span',
  className = '',
  wordClassName = '',
  style,
  stagger = 0.08,
  delay = 0,
  duration = 1.1,
  start = 'top 85%',
}) => {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const inners = root.querySelectorAll<HTMLElement>('.reveal-word-inner');

    if (prefersReducedMotion) {
      gsap.set(inners, { yPercent: 0, autoAlpha: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      // Wipe any stale transform cache left by React StrictMode's dev
      // double-mount — without this the second mount inherits a phantom
      // pixel offset and words stay clipped out of view.
      gsap.set(inners, { clearProps: 'transform,opacity,visibility' });
      gsap.set(inners, { yPercent: 110, autoAlpha: 0 });
      gsap.to(inners, {
        yPercent: 0,
        autoAlpha: 1,
        duration,
        ease: 'expo.out',
        stagger,
        delay,
        onComplete: () => gsap.set(inners, { clearProps: 'willChange' }),
        scrollTrigger: {
          trigger: root,
          start,
          once: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, [children, stagger, delay, duration, start]);

  const words = children.split(/(\s+)/);

  return React.createElement(
    Tag,
    { ref: rootRef, className, style },
    words.map((word, i) => {
      if (/^\s+$/.test(word)) return <React.Fragment key={i}>{word}</React.Fragment>;
      return (
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom"
          style={{ paddingBottom: '0.08em' }}
        >
          <span className={`reveal-word-inner inline-block ${wordClassName}`}>
            {word}
          </span>
        </span>
      );
    })
  );
};

export default RevealText;
