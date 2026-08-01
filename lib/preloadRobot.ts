// Warms the heavy 3D-robot assets (Spline runtime ~2MB + scene ~1.3MB) as
// early as possible on capable desktops — BUT on idle, so it never competes
// with first paint. Previously this only started inside the lazy-loaded
// LandingPage's effect (after the main bundle AND the landing chunk had
// downloaded, parsed and mounted), which is why the robot appeared so late.
// Firing it from the app entry starts the download ~1–1.5s sooner.
//
// This only warms the browser cache; the robot still MOUNTS in LandingPage.
export const preloadRobot = (sceneUrl: string): void => {
  if (typeof window === 'undefined') return;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  if (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    window.matchMedia('(max-width: 1024px)').matches ||
    window.matchMedia('(pointer: coarse)').matches ||
    (navigator.hardwareConcurrency || 8) < 4 ||
    nav.connection?.saveData
  ) return;

  const start = () => {
    // Scene file — highest priority so bytes are in flight immediately.
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'fetch';
    link.crossOrigin = 'anonymous';
    link.href = sceneUrl;
    link.setAttribute('fetchpriority', 'high');
    document.head.appendChild(link);
    // Runtime chunk — fetch + compile in parallel (same lazy chunk the
    // SplineScene component imports later, so its mount is near-instant).
    import('@splinetool/react-spline').catch(() => { /* retried on mount */ });
  };

  const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
  if (w.requestIdleCallback) w.requestIdleCallback(start, { timeout: 2000 });
  else window.setTimeout(start, 500);
};
