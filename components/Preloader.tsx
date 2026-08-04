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

    // Hard failsafe: if ANYTHING stalls the GSAP ticker on this device
    // (throttled tab, broken rAF, low-power mode), never leave the page
    // scroll-locked — force-unlock and hand off after 2.6s regardless.
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      document.body.style.overflow = '';
      onComplete();
    };
    const failsafe = window.setTimeout(finish, 2600);

    const obj = { val: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        window.clearTimeout(failsafe);
        finish();
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
      window.clearTimeout(failsafe);
      tl.kill();
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  return (
    <div ref={rootRef} className="fixed inset-0 z-[10000] bg-[#1d1d1d] flex items-center justify-center">
      <div ref={textRef} className="text-center select-none px-8 w-[80vw] max-w-[420px]">
        <img
          src="/logo-full.png"
          alt="4AM Global Media"
          width={1423}
          height={1423}
          className="mx-auto w-[62vw] max-w-[280px] h-auto"
        />
        <div className="mt-4 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/12 overflow-hidden relative">
            <div
              ref={barRef}
              className="absolute inset-0 bg-gradient-to-r from-[#c67139] to-[#e8a24a] origin-left"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>
          <span
            ref={pctRef}
            className="text-[11px] font-semibold tracking-[0.18em] text-white/45 tabular-nums w-10 text-right"
          >
            0%
          </span>
        </div>
        <p className="mt-3 text-[9px] font-semibold tracking-[0.45em] uppercase text-white/35">
          Loading Experience
        </p>
      </div>
    </div>
  );
};

export default Preloader;
