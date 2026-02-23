
import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackgroundParticles from './components/BackgroundParticles';
import ScrollToTop from './components/ScrollToTop';
import SmoothScroll from './components/SmoothScroll';
import AIChatbot from './components/AIChatbot';
import { ThemeProvider, useTheme } from './components/ThemeContext';
import { AuthProvider } from './components/AuthContext';
import { ArticleProvider } from './components/ArticleContext';
import { motion, useScroll, useSpring } from 'framer-motion';
import PageTransition from './components/PageTransition';

const LandingPage = lazy(() => import('./components/LandingPage'));
const ServicesPage = lazy(() => import('./components/ServicesPage'));
const ServiceDetail = lazy(() => import('./components/ServiceDetail'));
const WorkPage = lazy(() => import('./components/WorkPage'));
const InsightsPage = lazy(() => import('./components/InsightsPage'));
const ContactPage = lazy(() => import('./components/ContactPage'));

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
  const { isFading } = useTheme();

  return (
    <div
      className={`min-h-screen selection:bg-brand-primary/20 selection:text-brand-primary overflow-x-hidden transition-all duration-300 ease-in-out ${
        isFading ? 'opacity-80' : 'opacity-100'
      }`}
    >
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
                <PageTransition>
                  <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-sm text-zinc-500">Loading 4AM experience…</div>}>
                    <Routes>
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/services" element={<ServicesPage />} />
                      <Route path="/services/:id" element={<ServiceDetail />} />
                      <Route path="/work" element={<WorkPage />} />
                      <Route path="/insights" element={<InsightsPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Suspense>
                </PageTransition>
              </LayoutWrapper>
            </SmoothScroll>
          </ThemeProvider>
        </ArticleProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
