
import React, { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from './Hero';
import Services from './Services';
import Projects from './Projects';
import Contact from './Contact';
import Testimonials from './Testimonials';
import StatsSection from './Stats';
import GlobalNetworkBackground from './GlobalNetworkBackground';
import { scrollToSection } from '../utils/scroll';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true, limitCallbacks: true });

const LandingPage: React.FC = () => {
  const location = useLocation();
  const mainRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (!state || !state.scrollTo) return;

    // Small delay to ensure DOM is ready and animations don't interfere with scroll
    setTimeout(() => {
      scrollToSection(state.scrollTo!);
    }, 100);
  }, [location.state]);

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
      <GlobalNetworkBackground />
      
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
