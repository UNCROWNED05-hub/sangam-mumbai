import React, { useState, useEffect, useRef } from 'react';
import { SmoothScroll } from '../systems/SmoothScroll';
import { Sky } from '../systems/Sky';
import { ScrollRail } from '../systems/ScrollRail';
import { Navbar } from './Navbar';
import { Preloader } from '../systems/Preloader';
import { useRouteTransition } from '../systems/RouteTransition';
import { ArrowRight, Compass, ShieldCheck, Zap } from 'lucide-react';
import { BRAND } from '../config/brand';

export const Landing: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [preloaderDone, setPreloaderDone] = useState(false);
  const { openApp } = useRouteTransition();

  // Track global scroll progress (0 to 1) for the sky system and scroll rail
  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      const progress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <SmoothScroll>
      {/* Preloader sequence (plays once per session) */}
      <Preloader onComplete={() => setPreloaderDone(true)} />

      {/* Dynamic Sky Background with Sun/Moon Orb & Stars */}
      <Sky progress={scrollProgress} />

      {/* Floating Glass Pill Navigation */}
      <Navbar />

      {/* Desktop Scroll Clock Rail */}
      <ScrollRail progress={scrollProgress} />

      {/* Landing Page Content Container */}
      <div className="relative min-h-[400vh] w-full max-w-6xl mx-auto px-4 sm:px-6 pt-32 pb-24 z-10 flex flex-col justify-between">
        {/* L1 Placeholder / Hero test */}
        <section id="hero-preview" className="min-h-[85vh] flex flex-col justify-end pb-12">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 dark:bg-night/60 border border-line backdrop-blur-md">
              <span className="w-2.5 h-2.5 rounded-full bg-bougainvillea animate-ping" />
              <span className="text-xs font-bold text-ink dark:text-white">
                12,804 people out right now in Mumbai
              </span>
            </div>

            <h1 className="text-5xl sm:text-7xl font-black font-display tracking-tight text-ink dark:text-white leading-[0.95]">
              Someone near you <br />
              <span className="text-marigold">already has a plan.</span>
            </h1>

            <p className="text-lg text-ink-soft max-w-xl leading-relaxed">
              Open the map, tap a plan, show up. No feed. No followers. No small talk.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={(e) => openApp(e.clientX, e.clientY)}
                className="px-8 py-4 rounded-full bg-marigold hover:bg-marigold-hover text-ink font-extrabold text-base shadow-pill active:scale-95 transition-all flex items-center gap-2"
                data-cursor="open"
              >
                <span>Open the map</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Demo Scroll Benchmarks for Phase 1 verification */}
        <div className="space-y-48 py-20 text-center opacity-80 font-bold text-sm">
          <div className="p-8 rounded-3xl bg-white/40 dark:bg-night/40 border border-line max-w-lg mx-auto backdrop-blur-sm">
            <span>Scroll Stage: Dawn turning to Noon (Sky: #CFE0FF to #FFF3C4)</span>
          </div>

          <div className="p-8 rounded-3xl bg-white/40 dark:bg-night/40 border border-line max-w-lg mx-auto backdrop-blur-sm">
            <span>Scroll Stage: Golden Hour to Dusk (#FFD08A to #4B3FA6)</span>
          </div>

          <div className="p-8 rounded-3xl bg-white/40 dark:bg-night/40 border border-line max-w-lg mx-auto backdrop-blur-sm">
            <span>Scroll Stage: Midnight (#0B0E2A to #1A1F5A) • Ink flips to Light!</span>
          </div>
        </div>

        {/* Footer Jump */}
        <section className="text-center pt-24 border-t border-line">
          <h2 className="text-4xl sm:text-6xl font-black font-display text-ink dark:text-white">
            Go outside.
          </h2>
          <button
            type="button"
            onClick={(e) => openApp(e.clientX, e.clientY)}
            className="mt-6 px-8 py-4 rounded-full bg-marigold text-ink font-bold text-sm shadow-pill"
            data-cursor="open"
          >
            Open the map
          </button>
        </section>
      </div>
    </SmoothScroll>
  );
};
