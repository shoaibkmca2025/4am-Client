
import React from 'react';
import Hero from './Hero';
import TargetAudience from './TargetAudience';
import Services from './Services';
import Projects from './Projects';
import Articles from './Articles';
import NetworkMarquee from './NetworkMarquee';
import Contact from './Contact';
import ROICalculator from './ROICalculator';
import QuickAudit from './QuickAudit';
import Process from './Process';
import Testimonials from './Testimonials';

const LandingPage: React.FC = () => {
  return (
    <main>
      <Hero />

      <QuickAudit />
      <Services />
      <Process />
      <TargetAudience />

      <Projects />
      <ROICalculator />
      <Testimonials />
      <Articles />
      <NetworkMarquee />
      <Contact />
    </main>
  );
};

export default LandingPage;
