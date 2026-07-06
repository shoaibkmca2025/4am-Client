import React, { useEffect, useRef, useState } from 'react';

// ── Scroll-reactive ambient background ──────────────────────────────
// A fixed Canvas 2D layer behind all landing sections:
//  · faint dot-grid that parallax-drifts with scroll
//  · particle constellation with proximity lines (the "network")
//  · data pulses that travel along connections
//  · scroll velocity stretches particles into motion streaks
//  · tint follows the active color-grade zone via the `4am:accent`
//    CustomEvent dispatched from LandingPage
// Opts out entirely on mobile, reduced-motion, save-data, and weak CPUs.

export const ACCENT_EVENT = '4am:accent';

const GRID_STEP = 52;
const LINK_DIST = 150;
const DPR_CAP = 1.5;

type RGB = [number, number, number];

const hexToRgb = (hex: string): RGB => {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  depth: number; // 0.35–1 — parallax factor + brightness
}

interface Pulse {
  ax: number; ay: number; bx: number; by: number;
  t: number; speed: number;
}

const ScrollCanvasBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);

  // Gate + idle-defer, matching the project's performance pattern
  useEffect(() => {
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(max-width: 768px)').matches ||
      (navigator.hardwareConcurrency || 8) < 4 ||
      nav.connection?.saveData
    ) return;

    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let idleId: number | undefined;
    let timeoutId: number | undefined;
    if (w.requestIdleCallback) {
      idleId = w.requestIdleCallback(() => setEnabled(true), { timeout: 2500 });
    } else {
      timeoutId = window.setTimeout(() => setEnabled(true), 1800);
    }
    return () => {
      if (idleId !== undefined && w.cancelIdleCallback) w.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // ── State ──
    const count = Math.round(Math.min(85, (width * height) / 24000));
    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.16,
      vy: (Math.random() - 0.5) * 0.16,
      r: 0.8 + Math.random() * 1.4,
      depth: 0.35 + Math.random() * 0.65,
    }));
    const pulses: Pulse[] = [];

    let tint: RGB = hexToRgb('#FF6A3D');
    let target: RGB = tint;
    const onAccent = (e: Event) => {
      const hex = (e as CustomEvent<string>).detail;
      if (hex) target = hexToRgb(hex);
    };
    window.addEventListener(ACCENT_EVENT, onAccent);

    let lastScroll = window.scrollY;
    let velocity = 0; // smoothed px/frame
    let gridDrift = 0;
    let lastPulse = 0;
    let raf = 0;
    let running = true;

    const onVisibility = () => {
      running = document.visibilityState === 'visible';
      if (running) { raf = requestAnimationFrame(frame); }
    };
    document.addEventListener('visibilitychange', onVisibility);

    const frame = (now: number) => {
      if (!running) return;

      // Scroll velocity (smoothed, decays to 0 at rest)
      const sy = window.scrollY;
      velocity += ((sy - lastScroll) - velocity) * 0.12;
      lastScroll = sy;
      const speed = Math.min(Math.abs(velocity), 60);
      const energy = speed / 60; // 0–1

      // Tint eases toward the active zone accent
      tint = tint.map((c, i) => c + (target[i] - c) * 0.04) as RGB;
      const [tr, tg, tb] = tint.map(Math.round);

      ctx.clearRect(0, 0, width, height);

      // ── Dot grid, parallax-drifting against scroll ──
      gridDrift = (sy * 0.12) % GRID_STEP;
      const gridAlpha = 0.035 + energy * 0.03;
      ctx.fillStyle = `rgba(${tr},${tg},${tb},${gridAlpha})`;
      for (let gx = (width % GRID_STEP) / 2; gx < width; gx += GRID_STEP) {
        for (let gy = -gridDrift; gy < height; gy += GRID_STEP) {
          ctx.fillRect(gx, gy, 1.5, 1.5);
        }
      }

      // ── Particles ──
      const drift = velocity * 0.05;
      for (const p of particles) {
        p.x += p.vx * (1 + energy * 2);
        p.y += p.vy * (1 + energy * 2) - drift * p.depth;
        if (p.x < -10) p.x = width + 10; else if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10; else if (p.y > height + 10) p.y = -10;
      }

      // Proximity lines
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK_DIST * LINK_DIST) continue;
          const alpha = (1 - Math.sqrt(d2) / LINK_DIST) * (0.10 + energy * 0.08);
          ctx.strokeStyle = `rgba(${tr},${tg},${tb},${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Particle dots — streak into lines while scrolling fast
      for (const p of particles) {
        const alpha = (0.25 + 0.35 * p.depth) * (0.7 + energy * 0.3);
        const streak = velocity * 0.9 * p.depth;
        if (Math.abs(streak) > 3) {
          ctx.strokeStyle = `rgba(${tr},${tg},${tb},${alpha * 0.8})`;
          ctx.lineWidth = p.r * 1.2;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(p.x, p.y - streak);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgba(${tr},${tg},${tb},${alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ── Data pulses along the network ──
      if (now - lastPulse > 2200 && pulses.length < 3) {
        const a = particles[(Math.random() * particles.length) | 0];
        let best: Particle | null = null;
        let bestD = Infinity;
        for (const b of particles) {
          if (b === a) continue;
          const d = (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
          if (d < bestD && d < (LINK_DIST * 2.2) ** 2) { bestD = d; best = b; }
        }
        if (best) {
          pulses.push({ ax: a.x, ay: a.y, bx: best.x, by: best.y, t: 0, speed: 0.008 + Math.random() * 0.008 });
          lastPulse = now;
        }
      }
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pu = pulses[i];
        pu.t += pu.speed * (1 + energy * 1.5);
        if (pu.t >= 1) { pulses.splice(i, 1); continue; }
        const px = pu.ax + (pu.bx - pu.ax) * pu.t;
        const py = pu.ay + (pu.by - pu.ay) * pu.t;
        const fade = Math.sin(pu.t * Math.PI);
        ctx.fillStyle = `rgba(${tr},${tg},${tb},${0.7 * fade})`;
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(255,255,255,${0.35 * fade})`;
        ctx.beginPath();
        ctx.arc(px, py, 1, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener(ACCENT_EVENT, onAccent);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.55 }}
      aria-hidden="true"
    />
  );
};

export default ScrollCanvasBackground;
