import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  delay?: number;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({ children, as: Component = 'div', className = '', delay = 0 }) => {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (delay) {
              window.setTimeout(() => setIsVisible(true), delay);
            } else {
              setIsVisible(true);
            }
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [delay]);

  const baseClasses = 'transition-all duration-500 ease-out will-change-transform will-change-opacity';
  const stateClasses = isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5';

  return (
    <Component
      ref={ref as any}
      className={`${baseClasses} ${stateClasses} ${className}`}
    >
      {children}
    </Component>
  );
};

export default ScrollReveal;

