import { useEffect, useState } from 'react';

// Returns the id of the section currently occupying the upper viewport.
// Works with GSAP-pinned sections: a pinned element reports rect.top ≈ 0
// for its whole pin duration, so it stays "active" while pinned.
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? '');

  useEffect(() => {
    if (ids.length === 0) return;
    let raf = 0;

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

    const onScroll = () => {
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
