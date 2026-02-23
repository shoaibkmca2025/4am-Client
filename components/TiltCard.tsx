import React, { useEffect, useRef, useState } from 'react';

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxTilt?: number;
  scale?: number;
  glow?: boolean;
  disableOnTouch?: boolean;
}

const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  maxTilt = 8,
  scale = 1.03,
  glow = true,
  disableOnTouch = true,
  ...rest
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [interactive, setInteractive] = useState(true);

  useEffect(() => {
    if (!disableOnTouch) return;
    if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') return;
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    if (isCoarse) {
      setInteractive(false);
    }
  }, [disableOnTouch]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const node = ref.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const percentX = (x / rect.width) * 2 - 1;
    const percentY = (y / rect.height) * 2 - 1;

    const nextTiltX = -(percentY * maxTilt);
    const nextTiltY = percentX * maxTilt;

    setTiltX(nextTiltX);
    setTiltY(nextTiltY);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setTiltX(0);
    setTiltY(0);
    setIsHovered(false);
  };

  const finalScale = isHovered ? scale : 1;
  const transform = interactive
    ? `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${finalScale})`
    : undefined;

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={transform ? { transform } : undefined}
      className={`relative transition-transform duration-300 ease-out ${isHovered ? 'shadow-xl' : ''} ${className}`}
      {...rest}
    >
      {glow && (
        <div
          className={`pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 bg-gradient-to-br from-brand-primary/15 via-transparent to-brand-accent/25 ${
            isHovered ? 'opacity-100' : ''
          }`}
        />
      )}
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
};

export default TiltCard;

