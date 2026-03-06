
import React, { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from './Hero';
import Services from './Services';
import Projects from './Projects';
import Contact from './Contact';
import Testimonials from './Testimonials';
import StatsSection from './Stats';
import { scrollToSection } from '../utils/scroll';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true, limitCallbacks: true });
const GlobalNetworkBackground = lazy(() => import('./GlobalNetworkBackground'));

const LandingPage: React.FC = () => {
  const location = useLocation();
  const mainRef = useRef<HTMLDivElement>(null);
  const [renderDynamicBackground, setRenderDynamicBackground] = useState(false);

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (!state || !state.scrollTo) return;

    // Small delay to ensure DOM is ready and animations don't interfere with scroll
    setTimeout(() => {
      scrollToSection(state.scrollTo!);
    }, 100);
  }, [location.state]);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isMobile || prefersReducedMotion) return;

    // Keep the first paint lightweight, then mount heavy 3D background.
    const timer = window.setTimeout(() => setRenderDynamicBackground(true), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add(
        {
          desktop: '(min-width: 641px) and (prefers-reduced-motion: no-preference)',
          mobile: '(max-width: 640px) and (prefers-reduced-motion: no-preference)',
          reduced: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const conditions = context.conditions as {
            desktop?: boolean;
            mobile?: boolean;
            reduced?: boolean;
          };

          const sections = gsap.utils.toArray<HTMLElement>('.gsap-section');
          if (!sections.length) return;

          if (conditions.reduced) {
            gsap.set(sections, { opacity: 1, y: 0, clearProps: 'willChange' });
            return;
          }

          if (conditions.mobile) {
            sections.forEach((section, index) => {
              if (index === 0) return;
              gsap.fromTo(
                section,
                { opacity: 0, y: 18 },
                {
                  opacity: 1,
                  y: 0,
                  ease: 'none',
                  force3D: true,
                  scrollTrigger: {
                    trigger: section,
                    start: 'top 92%',
                    end: 'top 70%',
                    scrub: 1,
                  },
                }
              );
            });
            return;
          }

          // Desktop optimization: avoid permanent will-change to save memory
          gsap.set(sections, { opacity: 1, y: 0 });

          // Simple reveal animation for desktop (non-scrubbing for performance)
          sections.forEach((section, index) => {
            if (index === 0) return;
            
            gsap.fromTo(section, 
              { 
                opacity: 0, 
                y: 50 
              },
              {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power2.out",
                force3D: true,
                scrollTrigger: {
                  trigger: section,
                  start: "top 85%",
                  end: "top 50%",
                  toggleActions: "play none none reverse"
                }
              }
            );
          });

          ScrollTrigger.refresh();
        }
      );
    }, mainRef);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0 z-0 overflow-hidden bg-[#050B12] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-[#050B12] via-transparent to-[#050B12]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050B12_100%)] opacity-40" />
      </div>
      {renderDynamicBackground && (
        <Suspense fallback={null}>
          <GlobalNetworkBackground />
        </Suspense>
      )}
      
      <div ref={mainRef} className="relative z-10">
        <div className="gsap-section flex flex-col justify-center">
          <Hero />
        </div>
        
        <div className="gsap-section">
          <StatsSection />
        </div>
        
        <div className="gsap-section">
          <Services />
        </div>
        
        <div className="gsap-section">
          <Projects />
        </div>
        
        <div className="gsap-section">
          <Testimonials />
        </div>
        
        <div className="gsap-section">
          <Contact />
        </div>
      </div>
    </>
  );
};

export default LandingPage;
