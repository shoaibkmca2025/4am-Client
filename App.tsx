
import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import SmoothScroll from './components/SmoothScroll';
import ScrollProgress from './components/ScrollProgress';
import PageTransition from './components/PageTransition';

const LandingPage = lazy(() => import('./components/LandingPage'));
const ServicePage = lazy(() => import('./components/ServicePage'));
const AIChatbot = lazy(() => import('./components/AIChatbot'));

const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen overflow-x-hidden text-white bg-black">
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 flex flex-col overflow-x-hidden relative">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

const ScrollToTopBtn: React.FC = () => {
  const btnRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const onScroll = () => {
      if (window.scrollY > 600) btn.classList.remove('hidden-btn');
      else btn.classList.add('hidden-btn');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <button
      ref={btnRef}
      className="scroll-top-btn hidden-btn"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path d="M8 13V3M4 7l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
};

function App() {
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
    let timer: number | null = null;
    let idleId: number | null = null;
    const saveData =
      typeof navigator !== 'undefined' && 'connection' in navigator
        ? (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
        : false;

    if (saveData) {
      timer = window.setTimeout(() => setShowChatbot(true), 12000);
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
      if (timer !== null) {
        window.clearTimeout(timer);
      }
      if (idleId !== null && 'cancelIdleCallback' in window) {
        (window as Window & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleId);
      }
    };
  }, []);

  return (
    <Router>
      <div className="grain" aria-hidden="true" />
      <ScrollToTop />
      <SmoothScroll>
        <ScrollProgress />
        <Navbar />
        <LayoutWrapper>
          <Suspense
            fallback={
              <div className="min-h-[60vh] flex items-center justify-center text-sm text-white/30 bg-black">
                Loading…
              </div>
            }
          >
            <PageTransition>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/services/:slug" element={<ServicePage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </PageTransition>
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
  );
}

export default App;
