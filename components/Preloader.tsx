import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const rootRef    = useRef<HTMLDivElement>(null);
  const barRef     = useRef<HTMLDivElement>(null);
  const textRef    = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const pctRef     = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root    = rootRef.current;
    const bar     = barRef.current;
    const text    = textRef.current;
    const curtain = curtainRef.current;
    if (!root || !bar || !text || !curtain) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { onComplete(); return; }

    document.body.style.overflow = 'hidden';

    const obj = { val: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        onComplete();
      },
    });

    tl.to(obj, {
      val: 100,
      duration: 1.4,
      ease: 'power2.inOut',
      onUpdate() {
        const v = Math.round(obj.val);
        if (pctRef.current) pctRef.current.textContent = `${v}%`;
        gsap.set(bar, { scaleX: obj.val / 100 });
      },
    })
      .to(text, { autoAlpha: 0, y: -24, duration: 0.35, ease: 'power2.in' }, '-=0.3')
      .to(curtain, { yPercent: -100, duration: 0.85, ease: 'expo.inOut' }, '-=0.1');

    return () => {
      tl.kill();
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  return (
    <div ref={rootRef} className="fixed inset-0 z-[10000] bg-black flex items-center justify-center">
      <div ref={textRef} className="text-center select-none px-8">
        <div className="text-[16vw] sm:text-[18vw] font-black text-white tracking-[-0.05em] uppercase leading-none">
          4AM
        </div>
        <div className="mt-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10 overflow-hidden relative">
            <div
              ref={barRef}
              className="absolute inset-0 bg-white origin-left"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>
          <span
            ref={pctRef}
            className="text-[11px] font-bold tracking-[0.18em] text-white/35 tabular-nums w-10 text-right"
          >
            0%
          </span>
        </div>
        <p className="mt-3 text-[9px] font-bold tracking-[0.45em] uppercase text-white/18">
          Loading Experience
        </p>
      </div>

      {/* Curtain slides up to reveal the page */}
      <div ref={curtainRef} className="absolute inset-0 bg-black pointer-events-none" />
    </div>
  );
};

export default Preloader;
