import React, { useEffect, useRef } from 'react';

interface ParticleBackgroundProps extends React.HTMLAttributes<HTMLCanvasElement> {
  maxParticles?: number;
  parallaxStrength?: number;
  disabledOnMobile?: boolean;
}

type Particle = {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  baseAlpha: number;
  color: string;
};

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  className = '',
  maxParticles = 80,
  parallaxStrength = 0.04,
  disabledOnMobile = true,
  ...rest
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const scrollOffsetRef = useRef(0);
  const enabledRef = useRef(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarsePointer = window.matchMedia &&
      window.matchMedia('(pointer: coarse)').matches;
    const isSmallScreen = window.innerWidth < 768;

    if (prefersReducedMotion || isCoarsePointer || (disabledOnMobile && isSmallScreen)) {
      enabledRef.current = false;
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const colors = [
      'rgba(129, 140, 248, 1)',
      'rgba(94, 234, 212, 1)',
      'rgba(251, 251, 255, 1)'
    ];

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);

      const area = rect.width * rect.height;
      const density = 0.00005;
      const count = Math.min(maxParticles, Math.max(20, Math.round(area * density)));

      const particles: Particle[] = [];
      for (let i = 0; i < count; i += 1) {
        const radius = 0.8 + Math.random() * 1.6;
        const speed = 0.08 + Math.random() * 0.22;
        const angle = Math.random() * Math.PI * 2;
        particles.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          radius,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          baseAlpha: 0.12 + Math.random() * 0.16,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
      particlesRef.current = particles;
    };

    const handleScroll = () => {
      scrollOffsetRef.current = window.scrollY || window.pageYOffset || 0;
    };

    const draw = () => {
      if (!enabledRef.current) return;
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const maxDist = Math.sqrt(cx * cx + cy * cy) || 1;
      const parallaxOffset = scrollOffsetRef.current * parallaxStrength;

      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) p.x = rect.width + 20;
        if (p.x > rect.width + 20) p.x = -20;
        if (p.y < -20) p.y = rect.height + 20;
        if (p.y > rect.height + 20) p.y = -20;

        const px = p.x;
        const py = p.y + parallaxOffset;
        const dx = px - cx;
        const dy = py - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const fade = 0.4 + 0.6 * (dist / maxDist);
        const alpha = p.baseAlpha * fade;

        ctx.beginPath();
        ctx.fillStyle = p.color.replace(', 1)', `, ${alpha})`);
        ctx.arc(px, py, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationRef.current = window.requestAnimationFrame(draw);
    };

    resize();
    handleScroll();
    animationRef.current = window.requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (animationRef.current !== null) {
        window.cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [maxParticles, parallaxStrength, disabledOnMobile]);

  if (!enabledRef.current) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      {...rest}
    />
  );
};

export default ParticleBackground;

