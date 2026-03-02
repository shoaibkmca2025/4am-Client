
import React from 'react';
import { useLocation } from 'react-router-dom';
import Hero from './Hero';
import Services from './Services';
import Projects from './Projects';
import Contact from './Contact';
import Testimonials from './Testimonials';
import StatsSection from './Stats';
import GlobalNetworkBackground from './GlobalNetworkBackground';
import { scrollToSection } from '../utils/scroll';

const LandingPage: React.FC = () => {
  const location = useLocation();

  React.useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (!state || !state.scrollTo) return;

    scrollToSection(state.scrollTo);
  }, [location.state]);

  return (
    <>
      <GlobalNetworkBackground />
      <div className="relative z-10">
        <Hero />
        <StatsSection />
        <Services />
        <Projects />
        <Testimonials />
        <Contact />
      </div>
    </>
  );
};

export default LandingPage;
