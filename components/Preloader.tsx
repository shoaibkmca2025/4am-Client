import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const rootRef    = useRef<HTMLDivElement>(null);
  const barRef     = useRef<HTMLDivElement>(null);
  const textRef    = useRef<HTMLDivElement>(null);
  const pctRef     = useRef<HTMLSpanElement>(null);

  // Remove the instant HTML splash the moment React has committed this
  // (visually identical) preloader to the DOM — runs before paint, so
  // the swap never exposes a black frame.
  useLayoutEffect(() => {
    document.getElementById('boot-splash')?.remove();
  }, []);

  useEffect(() => {
    const root    = rootRef.current;
    const bar     = barRef.current;
    const text    = textRef.current;
    if (!root || !bar || !text) return;

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

    // Keep the branded moment but never make visitors wait: the whole
    // sequence clears in ~1s instead of 2.6s.
    tl.to(obj, {
      val: 100,
      duration: 0.6,
      ease: 'power2.inOut',
      onUpdate() {
        const v = Math.round(obj.val);
        if (pctRef.current) pctRef.current.textContent = `${v}%`;
        gsap.set(bar, { scaleX: obj.val / 100 });
      },
    })
      .to(text, { autoAlpha: 0, y: -24, duration: 0.25, ease: 'power2.in' }, '-=0.2')
      // Slide the whole branded panel up to wipe-reveal the hero.
      .to(root, { yPercent: -100, duration: 0.6, ease: 'expo.inOut' }, '-=0.1');

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
    </div>
  );
};

export default Preloader;
