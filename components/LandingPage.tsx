import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from './Hero';
import Services from './Services';
import Projects from './Projects';
import Contact from './Contact';
import Testimonials from './Testimonials';
import StatsSection from './Stats';
import NetworkAndTrends from './NetworkAndTrends';
import ProcessSection from './ProcessSection';
import Marquee from './Marquee';
import { scrollToSection } from '../utils/scroll';

const HOME_PAGE_TITLE = 'A Creative Network made for today & tomorrow | 4AM Global Media';
const HOME_PAGE_DESCRIPTION =
  '4AM Global Media provides digital marketing and software development services including web and mobile app solutions to help businesses grow online.';

// Client / partner names shown in the scrolling strip
const CLIENTS = [
  'Nike', 'Spotify', 'Shopify', 'Airbnb', 'Notion', 'Stripe',
  'Linear', 'Figma', 'Vercel', 'Framer', 'Arc', 'Loom',
];

const LandingPage: React.FC = () => {
  const location = useLocation();
  const mainRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (!state || !state.scrollTo) return;
    setTimeout(() => { scrollToSection(state.scrollTo!); }, 100);
  }, [location.state]);

  useEffect(() => {
    document.title = HOME_PAGE_TITLE;
    const descriptionTag = document.querySelector('meta[name="description"]');
    if (descriptionTag) descriptionTag.setAttribute('content', HOME_PAGE_DESCRIPTION);
  }, []);

  return (
    <div ref={mainRef} className="relative z-[2] bg-black">

      <Hero />

      {/* ── Kinetic marquee #1 — after hero ── */}
      <Marquee
        items={['Strategy', 'Design', 'Engineering', 'Growth', 'Brand', 'Content', 'Digital']}
        speed={30}
        className="border-y border-white/[0.06] py-4 md:py-6 text-[9vw] md:text-[5vw] font-black uppercase tracking-[-0.02em] text-white/80"
      />

      <StatsSection />
      <ProcessSection />

      {/* ── Kinetic marquee #2 — between process and services ── */}
      <Marquee
        items={['Accepting New Projects', '4AM Global Media', "Let's Build Something", 'Available Worldwide', 'Est. 2024']}
        speed={45}
        direction="right"
        separator="—"
        className="border-y border-white/[0.06] py-4 md:py-6 text-[4vw] md:text-[2vw] font-black uppercase tracking-[0.08em] text-white/25"
      />

      <Services />
      <Projects />

      {/* ── Clients strip ── */}
      <div className="border-t border-white/[0.06] py-8 md:py-10">
        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-10 mb-5">
          <p className="text-[9px] md:text-[10px] font-bold tracking-[0.4em] uppercase text-white/15">
            Brands We've Worked With
          </p>
        </div>
        <Marquee
          items={CLIENTS}
          speed={55}
          separator="·"
          scrollVelocity={false}
          className="text-[3.5vw] md:text-[1.6vw] font-black uppercase tracking-[0.08em] text-white/12"
        />
      </div>

      <NetworkAndTrends />
      <Testimonials />
      <Contact />
    </div>
  );
};

export default LandingPage;
