
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import ServicesPage from './components/ServicesPage';
import ServiceDetail from './components/ServiceDetail';
import WorkPage from './components/WorkPage';
import InsightsPage from './components/InsightsPage';
import ContactPage from './components/ContactPage';
import Footer from './components/Footer';
import BackgroundParticles from './components/BackgroundParticles';
import ScrollToTop from './components/ScrollToTop';
import SmoothScroll from './components/SmoothScroll';
import AIChatbot from './components/AIChatbot';
import { ThemeProvider } from './components/ThemeContext';
import { AuthProvider } from './components/AuthContext';
import { ArticleProvider } from './components/ArticleContext';
import { motion, useScroll, useSpring } from 'framer-motion';

const ScrollIndicator: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-brand-primary z-[200] origin-left shadow-[0_0_15px_rgba(37,99,235,0.5)]"
      style={{ scaleX }}
    />
  );
};

const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen transition-colors duration-500 selection:bg-brand-primary/20 selection:text-brand-primary overflow-x-hidden">
      <ScrollIndicator />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 flex flex-col overflow-x-hidden">
          {children}
        </main>

        <Footer />
      </div>

      <AIChatbot />
      <BackgroundParticles />
    </div>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <ArticleProvider>
          <ThemeProvider>
            <SmoothScroll>
              <LayoutWrapper>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/services/:id" element={<ServiceDetail />} />
                  <Route path="/work" element={<WorkPage />} />
                  <Route path="/insights" element={<InsightsPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </LayoutWrapper>
            </SmoothScroll>
          </ThemeProvider>
        </ArticleProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
