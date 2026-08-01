// Warms the 3D-robot assets (the ~6.9MB Draco/WebP mecha model + the
// three/fiber/drei runtime chunk) as early as possible on capable desktops
// — but on idle, so it never competes with first paint. This only warms the
// browser cache; the robot still MOUNTS in LandingPage.
export const preloadRobot = (modelUrl: string): void => {
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
    // Model file — highest priority so bytes are in flight immediately.
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'fetch';
    link.crossOrigin = 'anonymous';
    link.href = modelUrl;
    link.setAttribute('fetchpriority', 'high');
    document.head.appendChild(link);
    // Runtime chunk — importing the component warms three/fiber/drei AND runs
    // its top-level useGLTF.preload(), so the model + decoder start too.
    import('../components/MechaRobot').catch(() => { /* retried on mount */ });
  };

  const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
  if (w.requestIdleCallback) w.requestIdleCallback(start, { timeout: 2000 });
  else window.setTimeout(start, 500);
};
