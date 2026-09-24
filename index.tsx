import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

// NOTE: this used to call preloadRobot('/models/mecha.glb'), which pulled
// 7.0MB of model plus a 188KB Draco decoder on every desktop visit. Nothing
// renders <MechaRobot> any more — the organic redesign replaced it with
// SculptureBackground (the watch calibre), and the preload was left behind.
// components/MechaRobot.tsx, lib/preloadRobot.ts and public/models/mecha.glb
// are now unreferenced; they can be deleted whenever the robot is confirmed
// dead for good.

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