
import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './components/AuthContext';

const LandingPage = lazy(() => import('./components/LandingPage'));
const ServicePage = lazy(() => import('./components/ServicePage'));
const AIChatbot = lazy(() => import('./components/AIChatbot'));

const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen selection:bg-brand-primary/20 selection:text-brand-primary overflow-x-hidden text-white">
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 flex flex-col overflow-x-hidden relative z-10">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
};

function App() {
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
    // Delay non-critical chatbot code to protect first contentful rendering.
    const timer = window.setTimeout(() => setShowChatbot(true), 1800);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <Navbar />
        <LayoutWrapper>
          <Suspense
            fallback={
              <div className="min-h-[60vh] flex items-center justify-center text-sm text-stone-500">
                Loading 4AM experience…
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/services/:slug" element={<ServicePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </LayoutWrapper>
        {showChatbot && (
          <Suspense fallback={null}>
            <AIChatbot />
          </Suspense>
        )}
      </AuthProvider>
    </Router>
  );
}

export default App;
