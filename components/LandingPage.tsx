
import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from './Hero';
import Services from './Services';
import Projects from './Projects';
import Contact from './Contact';
import Testimonials from './Testimonials';
import StatsSection from './Stats';
import { scrollToSection } from '../utils/scroll';

const GlobalNetworkBackground = lazy(() => import('./GlobalNetworkBackground'));
const HOME_PAGE_TITLE = 'Digital Marketing & Software Development | 4AM Global Media';
const HOME_PAGE_DESCRIPTION =
  '4AM Global Media provides digital marketing and software development services including web and mobile app solutions to help businesses grow online.';

const LandingPage: React.FC = () => {
  const location = useLocation();
  const mainRef = useRef<HTMLDivElement>(null);
  const [renderDynamicBackground, setRenderDynamicBackground] = useState(false);
  const [pauseBackground, setPauseBackground] = useState(false);

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (!state || !state.scrollTo) return;

    // Small delay to ensure DOM is ready and animations don't interfere with scroll
    setTimeout(() => {
      scrollToSection(state.scrollTo!);
    }, 100);
  }, [location.state]);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 1024px)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = typeof navigator !== 'undefined' && 'connection' in navigator
      ? (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
      : false;
    const lowCpu = typeof navigator !== 'undefined' && navigator.hardwareConcurrency
      ? navigator.hardwareConcurrency < 4
      : false;

    if (isMobile || prefersReducedMotion || saveData || lowCpu) return;

    // Defer expensive 3D code until the browser is idle to protect initial responsiveness.
    let timeoutId: number | null = null;
    let idleId: number | null = null;
    const requestIdle = (window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
    }).requestIdleCallback;

    if (requestIdle) {
      idleId = requestIdle(() => setRenderDynamicBackground(true), { timeout: 1800 });
    } else {
      timeoutId = window.setTimeout(() => setRenderDynamicBackground(true), 1400);
    }

    return () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
      if (idleId !== null && 'cancelIdleCallback' in window) {
        (window as Window & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleId);
      }
    };
  }, []);

  useEffect(() => {
    if (!renderDynamicBackground) return;
    let stopTimer: number | null = null;

    const handleScroll = () => {
      setPauseBackground(true);
      if (stopTimer !== null) {
        window.clearTimeout(stopTimer);
      }
      stopTimer = window.setTimeout(() => setPauseBackground(false), 140);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (stopTimer !== null) {
        window.clearTimeout(stopTimer);
      }
    };
  }, [renderDynamicBackground]);

  useEffect(() => {
    document.title = HOME_PAGE_TITLE;
    const descriptionTag = document.querySelector('meta[name="description"]');
    if (descriptionTag) {
      descriptionTag.setAttribute('content', HOME_PAGE_DESCRIPTION);
    }
  }, []);

  return (
    <>
      <div className="fixed inset-0 z-0 overflow-hidden bg-[#050B12] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-[#050B12] via-transparent to-[#050B12]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050B12_100%)] opacity-40" />
      </div>
      {renderDynamicBackground && (
        <Suspense fallback={null}>
          <GlobalNetworkBackground paused={pauseBackground} />
        </Suspense>
      )}
      
      <div ref={mainRef} className="relative z-[2]">
        <div className="flex flex-col justify-center">
          <Hero />
        </div>
        
        <div>
          <StatsSection />
        </div>
        
        <div>
          <Services />
        </div>
        
        <div>
          <Projects />
        </div>
        
        <div>
          <Testimonials />
        </div>
        
        <div>
          <Contact />
        </div>
      </div>
    </>
  );
};

export default LandingPage;
