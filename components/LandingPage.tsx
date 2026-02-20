
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

      {/* Quick Audit sits safely below Hero */}
      <div className="container mx-auto px-6 py-12">
        <QuickAudit />
      </div>

      <div id="services">
        <Services />
      </div>

      <Process />

      <TargetAudience />

      <div id="projects">
        <Projects />
      </div>

      <ROICalculator />

      <Testimonials />

      <Articles />

      <NetworkMarquee />

      <div id="contact">
        <Contact />
      </div>
    </main>
  );
};

export default LandingPage;
