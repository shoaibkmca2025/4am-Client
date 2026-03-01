
import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import AIChatbot from './components/AIChatbot';
import { AuthProvider } from './components/AuthContext';

const LandingPage = lazy(() => import('./components/LandingPage'));
const ServicePage = lazy(() => import('./components/ServicePage'));

const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen selection:bg-brand-primary/20 selection:text-brand-primary overflow-x-hidden bg-brand-bg text-brand-dark">
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 flex flex-col overflow-x-hidden">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
};

function App() {
  return (
      <Router>
      <ScrollToTop />
        <AuthProvider>
          <Navbar />
          <LayoutWrapper>
            <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-sm text-stone-500">Loading 4AM experience…</div>}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/services/:slug" element={<ServicePage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </LayoutWrapper>
          <AIChatbot />
        </AuthProvider>
    </Router>
  );
}

export default App;
