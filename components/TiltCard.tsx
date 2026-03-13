import React, { useEffect, useRef, useState } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number; // How much tilt (default 15)
  perspective?: number; // CSS perspective (default 1000)
}

const TiltCard: React.FC<TiltCardProps> = ({ 
  children, 
  className = "", 
  intensity = 15,
  perspective = 1000
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInteractive, setIsInteractive] = useState(false);
  const frameRef = useRef<number | null>(null);
  const pendingRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const applyTilt = (xRatio: number, yRatio: number, animated: boolean) => {
    if (!ref.current) return;
    const rotateX = -yRatio * intensity;
    const rotateY = xRatio * intensity;
    ref.current.style.transition = animated
      ? 'transform 260ms cubic-bezier(0.22, 1, 0.36, 1)'
      : 'none';
    ref.current.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  useEffect(() => {
    const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setIsInteractive(supportsHover && !prefersReducedMotion);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    
    // Calculate mouse position relative to the card center (-0.5 to 0.5)
    const width = rect.width;
    const height = rect.height;
    
    const mouseXRelative = (e.clientX - rect.left) / width - 0.5;
    const mouseYRelative = (e.clientY - rect.top) / height - 0.5;

    pendingRef.current = { x: mouseXRelative, y: mouseYRelative };
    if (frameRef.current !== null) return;

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      applyTilt(pendingRef.current.x, pendingRef.current.y, false);
    });
  };

  const handleMouseLeave = () => {
    applyTilt(0, 0, true);
  };

  useEffect(() => {
    if (!isInteractive && ref.current) {
      ref.current.style.transform = 'none';
      ref.current.style.transition = 'none';
    }

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isInteractive]);

  return (
    <div
      ref={ref}
      onMouseMove={isInteractive ? handleMouseMove : undefined}
      onMouseLeave={isInteractive ? handleMouseLeave : undefined}
      style={{ transformStyle: isInteractive ? 'preserve-3d' : 'flat' }}
      className={`relative ${className}`}
    >
      {children}
    </div>
  );
};

export default TiltCard;
