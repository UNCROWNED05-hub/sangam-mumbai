import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RouteTransitionProvider } from './systems/RouteTransition';
import { Cursor } from './systems/Cursor';
import { Grain } from './systems/Grain';
import { ToastContainer } from './ui/Toast';
import { Landing } from './landing/Landing';
import { AppShell } from './app/AppShell';
import { useSimulation } from './store/useSimulation';

export function App() {
  // Start deterministic simulation
  useSimulation(true);

  return (
    <BrowserRouter>
      <RouteTransitionProvider>
        {/* Liquid Custom Cursor for Fine Pointers */}
        <Cursor />

        {/* Subtle Grain Overlay */}
        <Grain />

        {/* Global Toast Notifications */}
        <ToastContainer />

        {/* Route Tree */}
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/app/*" element={<AppShell />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </RouteTransitionProvider>
    </BrowserRouter>
  );
}

export default App;
