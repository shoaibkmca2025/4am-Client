
import React from 'react';
import { useLocation } from 'react-router-dom';
import Hero from './Hero';
import Services from './Services';
import Projects from './Projects';
import Contact from './Contact';
import Articles from './Articles';
import Testimonials from './Testimonials';
import StatsSection from './Stats';
import { scrollToSection } from '../utils/scroll';

const LandingPage: React.FC = () => {
  const location = useLocation();

  React.useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (!state || !state.scrollTo) return;

    scrollToSection(state.scrollTo);
  }, [location.state]);

  return (
    <main>
      <Hero />
      <StatsSection />
      <Services />
      <Projects />
      {/* <Articles /> Removed for cleaner SaaS layout */}
      <Testimonials />
      <Contact />
    </main>
  );
};

export default LandingPage;
