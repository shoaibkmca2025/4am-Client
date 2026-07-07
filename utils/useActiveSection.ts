import { useEffect, useState } from 'react';

// Returns the id of the section currently occupying the upper viewport.
// Works with GSAP-pinned sections: a pinned element reports rect.top ≈ 0
// for its whole pin duration, so it stays "active" while pinned.
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? '');

  useEffect(() => {
    if (ids.length === 0) return;
    let raf = 0;
    let lastRun = 0;

    const measure = () => {
      const threshold = window.innerHeight * 0.4;
      // Pick the section whose top is closest to (but above) the threshold —
      // independent of the order ids were passed in.
      let current = ids[0];
      let bestTop = -Infinity;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= threshold && top > bestTop) {
          bestTop = top;
          current = id;
        }
      }
      setActive(current);
    };

    // Throttle to ~6 checks/second: eight getBoundingClientRect calls per
    // scroll frame force layout reads mid-scroll; an active-section
    // indicator doesn't need frame-perfect precision.
    const onScroll = () => {
      const now = performance.now();
      if (now - lastRun < 160) return;
      lastRun = now;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    measure();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(',')]);

  return active;
}
