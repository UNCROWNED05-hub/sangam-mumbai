import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RouteTransitionProvider } from './systems/RouteTransition';
import { Cursor } from './systems/Cursor';
import { Grain } from './systems/Grain';
import { ToastContainer } from './ui/Toast';
import { Landing } from './landing/Landing';
import { AppShell } from './app/AppShell';
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

        {/* Route Tree */}
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/app/*" element={<AppShell />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/safety" element={<InfoPage />} />
          <Route path="/guidelines" element={<InfoPage />} />
          <Route path="/terms" element={<InfoPage />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </RouteTransitionProvider>
    </BrowserRouter>
  );
}

export default App;
