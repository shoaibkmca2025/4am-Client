
import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import SmoothScroll from './components/SmoothScroll';
import MagneticCursor from './components/MagneticCursor';
import Preloader from './components/Preloader';
import ScrollProgress from './components/ScrollProgress';

// Fire the landing-chunk request the moment the main bundle evaluates —
// in parallel with React's first render — instead of letting Suspense
// discover it a round-trip later. Biggest win on phone connections.
const landingChunk = import('./components/LandingPage');
const LandingPage = lazy(() => landingChunk.catch(() => import('./components/LandingPage')));
const ServicesPage = lazy(() => import('./components/ServicesPage'));
const ServicePage  = lazy(() => import('./components/ServicePage'));
// Platform surfaces — code-split so marketing visitors never download them.
const StudentPortal = lazy(() => import('./components/platform/StudentPortal'));
const AdminPanel    = lazy(() => import('./components/platform/AdminPanel'));
const AIChatbot    = lazy(() => import('./components/AIChatbot'));

const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen overflow-x-hidden text-[#201e1d] bg-[#f5ead8]">
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col overflow-x-hidden relative">
        {children}
      </main>
      <Footer />
    </div>
  </div>
);

// ── Scroll-to-top button with circular progress ring ─────────────────
const ScrollToTopBtn: React.FC = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const radius  = 22;
  const circ    = 2 * Math.PI * radius;

  useEffect(() => {
    const wrap = wrapRef.current;
    const ring = ringRef.current;
    if (!wrap) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        if (window.scrollY > 600) wrap.classList.remove('opacity-0', 'translate-y-3', 'pointer-events-none');
        else wrap.classList.add('opacity-0', 'translate-y-3', 'pointer-events-none');

        if (ring) {
          const scrollable = document.documentElement.scrollHeight - window.innerHeight;
          const progress   = scrollable > 0 ? window.scrollY / scrollable : 0;
          ring.style.strokeDashoffset = String(circ * (1 - progress));
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [circ]);

  return (
    <div
      ref={wrapRef}
      className="fixed bottom-10 left-8 max-md:bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] max-md:left-4 max-md:scale-[0.85] z-[9990] w-11 h-11 flex items-center justify-center opacity-0 translate-y-3 pointer-events-none transition-all duration-400"
    >
      {/* Circular progress ring */}
      <svg
        className="absolute -rotate-90 pointer-events-none"
        style={{ width: '3.5rem', height: '3.5rem', top: '-0.375rem', left: '-0.375rem' }}
        viewBox="0 0 56 56"
        aria-hidden="true"
      >
        <circle cx="28" cy="28" r={radius} fill="none" stroke="rgba(32,30,29,0.12)" strokeWidth="1.5" />
        <circle
          ref={ringRef}
          cx="28" cy="28" r={radius}
          fill="none"
          stroke="#c67139"
          strokeWidth="1.5"
          strokeDasharray={circ}
          strokeDashoffset={circ}
          strokeLinecap="round"
        />
      </svg>
      <button
        className="relative w-11 h-11 rounded-full border border-[#201e1d]/15 bg-[#ebddc5]/95 backdrop-blur flex items-center justify-center text-[#201e1d]/55 hover:bg-[#c67139] hover:text-[#f5ead8] hover:border-[#c67139] transition-colors duration-300"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M8 13V3M4 7l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
};

function App() {
  const [showChatbot, setShowChatbot]     = useState(false);
  const [preloaderDone, setPreloaderDone] = useState(false);

  // Touch devices skip framer-motion's transform entrance animations — the
  // 287 animated elements were the dominant scroll-jank source on phones
  // (measured ~7fps → ~30fps). Elements appear in their final state; opacity
  // still fades. Desktop (fine pointer) keeps every animation unchanged.
  const [reduceMotion] = useState(
    () => typeof window !== 'undefined' &&
      (window.matchMedia('(pointer: coarse)').matches ||
       window.matchMedia('(max-width: 1024px)').matches),
  );

  // Lazy-load chatbot after idle
  useEffect(() => {
    let timer: number | null = null;
    let idleId: number | null = null;
    const saveData =
      typeof navigator !== 'undefined' && 'connection' in navigator
        ? (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
        : false;

    if (saveData) {
      timer = window.setTimeout(() => setShowChatbot(true), 12000);
    } else if (window.matchMedia('(max-width: 768px)').matches) {
      // Phones: keep the main thread free while the visitor starts
      // reading — the chatbot can arrive fashionably late.
      timer = window.setTimeout(() => setShowChatbot(true), 14000);
    } else {
      const requestIdle = (window as Window & {
        requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      }).requestIdleCallback;

      if (requestIdle) {
        idleId = requestIdle(() => setShowChatbot(true), { timeout: 10000 });
      } else {
        timer = window.setTimeout(() => setShowChatbot(true), 6000);
      }
    }

    return () => {
      if (timer !== null) window.clearTimeout(timer);
      if (idleId !== null && 'cancelIdleCallback' in window) {
        (window as Window & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleId);
      }
    };
  }, []);

  return (
    <MotionConfig reducedMotion={reduceMotion ? 'always' : 'never'}>
      {/* Preloader — renders until animation completes */}
      {!preloaderDone && <Preloader onComplete={() => setPreloaderDone(true)} />}

      <Router>
        <div className="grain" aria-hidden="true" />
        <MagneticCursor />
        <ScrollToTop />
        <SmoothScroll>
          <ScrollProgress />
          <Navbar />
          <LayoutWrapper>
            <Suspense
              fallback={
                <div className="min-h-[60vh] flex items-center justify-center text-sm text-[#201e1d]/40 bg-[#f5ead8]">
                  Loading…
                </div>
              }
            >
              <Routes>
                <Route path="/"               element={<LandingPage />} />
                <Route path="/services"       element={<ServicesPage />} />
                <Route path="/services/:slug" element={<ServicePage />} />
                <Route path="/portal"         element={<StudentPortal />} />
                <Route path="/admin"          element={<AdminPanel />} />
                <Route path="*"               element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </LayoutWrapper>
          {showChatbot && (
            <Suspense fallback={null}>
              <AIChatbot />
            </Suspense>
          )}
          <ScrollToTopBtn />
        </SmoothScroll>
      </Router>
    </MotionConfig>
  );
}

export default App;
