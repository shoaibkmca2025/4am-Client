import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

// The 3D robot/sculpture backdrop was replaced by the pencil-sketch scroll
// sequence (components/SketchScrollHero.tsx), so nothing mounts MechaRobot
// any more. Preloading its ~6.9MB model here would only steal bandwidth from
// the frame sequence that is actually on screen. `lib/preloadRobot.ts` is
// kept for whenever the 3D surface comes back.

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