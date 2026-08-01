import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { preloadRobot } from './lib/preloadRobot';

// Start warming the 3D robot assets from the very first moment (idle-gated,
// desktop-only) so it appears sooner instead of only after LandingPage mounts.
preloadRobot('/models/mecha.glb');

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);