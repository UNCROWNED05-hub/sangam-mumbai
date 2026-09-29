import React, { useEffect, useState, useMemo } from 'react';
import { getSkyAtProgress } from '../lib/sky';

interface SkyProps {
  progress?: number; // 0 to 1
}

export const Sky: React.FC<SkyProps> = ({ progress = 0 }) => {
  const skyState = getSkyAtProgress(progress);

  // Generate 120 static star positions
  const stars = useMemo(() => {
    return Array.from({ length: 120 }, (_, i) => ({
      id: i,
      x: (Math.sin(i * 99) * 0.5 + 0.5) * 100,
      y: (Math.cos(i * 33) * 0.5 + 0.5) * 85,
      size: (i % 3 === 0 ? 2.5 : i % 2 === 0 ? 1.8 : 1.2),
      delay: (i % 5) * 0.7,
    }));
  }, []);

  // Update root CSS variables
  useEffect(() => {
    document.documentElement.style.setProperty('--sky-top', skyState.topColor);
    document.documentElement.style.setProperty('--sky-bottom', skyState.bottomColor);

    if (skyState.isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.style.setProperty('--ink', '#F3F1FF');
      document.documentElement.style.setProperty('--ink-soft', 'rgba(243, 241, 255, 0.72)');
      document.documentElement.style.setProperty('--surface', '#1D2050');
      document.documentElement.style.setProperty('--line', 'rgba(255, 255, 255, 0.12)');
      document.documentElement.style.setProperty('--shadow-tint', 'rgba(0, 0, 0, 0.35)');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.style.setProperty('--ink', '#14163A');
      document.documentElement.style.setProperty('--ink-soft', 'rgba(20, 22, 58, 0.72)');
      document.documentElement.style.setProperty('--surface', '#FFFFFF');
      document.documentElement.style.setProperty('--line', 'rgba(20, 22, 58, 0.1)');
      document.documentElement.style.setProperty('--shadow-tint', 'rgba(20, 22, 58, 0.08)');
    }
  }, [skyState]);

  // Orb arc calculation across the scroll
  // Low left (p=0), high center (p=0.4), low right (p=1.0)
  const orbX = 15 + progress * 70; // 15% to 85%
  const orbY = 18 + Math.sin(progress * Math.PI) * -12; // arc up to 6%

  return (
    <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden">
      {/* Sky Gradient Background */}
      <div
        className="absolute inset-0 transition-colors duration-300"
        style={{
          background: `linear-gradient(180deg, ${skyState.topColor} 0%, ${skyState.bottomColor} 100%)`,
        }}
      />

      {/* 120 Stars (Opacity synced with nightness) */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{ opacity: skyState.starOpacity }}
      >
        {stars.map((s) => (
          <div
            key={s.id}
            className="absolute rounded-full bg-white shadow-sm animate-pulse"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animationDelay: `${s.delay}s`,
              animationDuration: '3s',
            }}
          />
        ))}
      </div>

      {/* Sun / Moon Orb */}
      <div
        className="absolute transition-all duration-300 rounded-full flex items-center justify-center pointer-events-none"
        style={{
          left: `${orbX}%`,
          top: `${orbY}%`,
          transform: 'translate(-50%, -50%)',
          width: '110px',
          height: '110px',
        }}
      >
        {skyState.orbType === 'sun' ? (
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-300 via-yellow-200 to-white shadow-[0_0_80px_rgba(255,200,50,0.65)] blur-[0.5px]" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-200 via-purple-100 to-white shadow-[0_0_60px_rgba(200,210,255,0.45)] relative overflow-hidden">
            {/* Faint crater texture */}
            <div className="absolute top-3 left-4 w-4 h-4 rounded-full bg-indigo-300/30" />
            <div className="absolute bottom-4 right-3 w-5 h-5 rounded-full bg-indigo-300/25" />
          </div>
        )}
      </div>
    </div>
  );
};
