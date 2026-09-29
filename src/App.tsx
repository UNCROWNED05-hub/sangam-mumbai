import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RouteTransitionProvider } from './systems/RouteTransition';
import { Cursor } from './systems/Cursor';
import { Grain } from './systems/Grain';
import { ToastContainer } from './ui/Toast';
import { UnifiedHome } from './pages/UnifiedHome';
import { PartnersPage } from './pages/PartnersPage';
import { InfoPage } from './pages/InfoPage';
import { CommandPalette } from './systems/CommandPalette';
import { EasterEggs } from './systems/EasterEggs';
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

        {/* Global Command Palette (Ctrl+K) */}
        <CommandPalette />

        {/* Easter Eggs (Konami Code Emoji Rain) */}
        <EasterEggs />

        {/* Single Localhost Unified Route Tree */}
        <Routes>
          <Route path="/" element={<UnifiedHome initialMode="app" />} />
          <Route path="/app/*" element={<UnifiedHome initialMode="app" />} />
          <Route path="/landing" element={<UnifiedHome initialMode="landing" />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/safety" element={<InfoPage />} />
          <Route path="/guidelines" element={<InfoPage />} />
          <Route path="/terms" element={<InfoPage />} />
          <Route path="*" element={<UnifiedHome initialMode="app" />} />
        </Routes>
      </RouteTransitionProvider>
    </BrowserRouter>
  );
}

export default App;
