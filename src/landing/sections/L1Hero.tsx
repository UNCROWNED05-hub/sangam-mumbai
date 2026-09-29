import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import { motion, AnimatePresence } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppStore } from '../../store/useAppStore';
import { useRouteTransition } from '../../systems/RouteTransition';
import { useMagnetic } from '../../systems/useMagnetic';
import { PlanBubble } from '../../ui/PlanBubble';
import { Odometer } from '../../ui/Odometer';
import { BRAND } from '../../config/brand';
import { ArrowRight, Smartphone, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface L1HeroProps {
  onScrollProgress?: (progress: number) => void;
}

export const L1Hero: React.FC<L1HeroProps> = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const heroSectionRef = useRef<HTMLDivElement | null>(null);
  const ctaBtnRef = useRef<HTMLButtonElement | null>(null);

  const { plans, livePeopleOutCount, selectPlan } = useAppStore();
  const { openApp } = useRouteTransition();
  useMagnetic(ctaBtnRef, { strength: 0.35, radius: 90 });

  const [cityIndex, setCityIndex] = useState(0);
  const [storeModalOpen, setStoreModalOpen] = useState(false);

  const cities = ['Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Goa'];

  // City ticker interval (every 2.2s)
  useEffect(() => {
    const timer = setInterval(() => {
      setCityIndex((prev) => (prev + 1) % cities.length);
    }, 2200);
    return () => clearInterval(timer);
  }, [cities.length]);

  // MapLibre initialization (Voyager style, non-interactive, drift loop)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
        center: [72.8236, 18.9433], // Marine Drive
        zoom: 13.4,
        pitch: 58,
        bearing: -18,
        interactive: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // Ambient loop 1: slow idle bearing drift (+/-3 deg over 30s)
      let bearingAnim: gsap.core.Tween | null = null;
      map.on('load', () => {
        const obj = { bearing: -18 };
        bearingAnim = gsap.to(obj, {
          bearing: -12,
          duration: 15,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          onUpdate: () => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.setBearing(obj.bearing);
            }
          },
        });
      });

      // ScrollTrigger waypoint flight: Marine Drive -> Bandstand -> Carter Road
      const waypoints = [
        { center: [72.8236, 18.9433], pitch: 58, bearing: -18 },
        { center: [72.8190, 19.0425], pitch: 64, bearing: 8 },
        { center: [72.8228, 19.0692], pitch: 68, bearing: 24 },
      ];

      const heroEl = heroSectionRef.current;
      if (heroEl) {
        ScrollTrigger.create({
          trigger: heroEl,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
          onUpdate: (self) => {
            const p = self.progress;
            // Interpolate camera waypoint
            const targetWp = p < 0.5 ? waypoints[1] : waypoints[2];
            if (mapInstanceRef.current && mapInstanceRef.current.isStyleLoaded()) {
              mapInstanceRef.current.easeTo({
                center: targetWp.center as [number, number],
                pitch: targetWp.pitch,
                bearing: targetWp.bearing,
                duration: 0.1,
              });
            }
          },
        });
      }

      return () => {
        bearingAnim?.kill();
        map.remove();
      };
    } catch {
      // Safe fallback if WebGL is disabled
    }
  }, []);

  // 12 Hero Plan Bubbles
  const heroPlans = plans.slice(0, 12);

  // Approximate relative screen offsets for 12 bubbles radiating across the map
  const bubblePositions = [
    { top: '18%', left: '22%' },
    { top: '24%', left: '58%' },
    { top: '16%', left: '76%' },
    { top: '34%', left: '38%' },
    { top: '42%', left: '72%' },
    { top: '48%', left: '18%' },
    { top: '56%', left: '52%' },
    { top: '64%', left: '80%' },
    { top: '28%', left: '84%' },
    { top: '72%', left: '34%' },
    { top: '38%', left: '12%' },
    { top: '52%', left: '64%' },
  ];

  return (
    <section
      ref={heroSectionRef}
      className="relative min-h-[160vh] w-full flex flex-col justify-between overflow-hidden"
    >
      {/* Background MapLibre Canvas with Voyager style */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden -z-10">
        <div ref={mapContainerRef} className="w-full h-full opacity-85 dark:opacity-40" />

        {/* Floating Plan Bubbles on Hero Map */}
        <div className="absolute inset-0 pointer-events-none">
          {heroPlans.map((plan, idx) => {
            const pos = bubblePositions[idx % bubblePositions.length];
            return (
              <motion.div
                key={plan.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  y: [0, -6, 0],
                }}
                transition={{
                  scale: { delay: 1.2 + idx * 0.04, duration: 0.5, ease: [0.175, 0.885, 0.32, 1.275] },
                  opacity: { delay: 1.2 + idx * 0.04, duration: 0.3 },
                  y: { repeat: Infinity, duration: 4 + (idx % 3), ease: 'easeInOut', delay: idx * 0.2 },
                }}
                className="absolute pointer-events-auto"
                style={{ top: pos.top, left: pos.left }}
              >
                <PlanBubble
                  plan={plan}
                  onClick={(e: any) => {
                    const rect = e?.currentTarget?.getBoundingClientRect();
                    const cx = rect ? rect.left + rect.width / 2 : undefined;
                    const cy = rect ? rect.top + rect.height / 2 : undefined;
                    selectPlan(plan.id);
                    openApp(cx, cy, plan.id);
                  }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Compact MapLibre Attribution */}
        <div className="absolute bottom-2 right-4 text-[10px] text-ink-muted/80 bg-white/40 dark:bg-night/40 backdrop-blur-xs px-2 py-0.5 rounded pointer-events-none">
          © MapLibre © CARTO
        </div>
      </div>

      {/* Hero Foreground Content Overlay */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-6 sm:px-10 min-h-screen flex flex-col justify-end pb-20 pointer-events-none">
        <div className="max-w-3xl pointer-events-auto space-y-6">
          {/* Live People Out Now Chip with Odometer */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/80 dark:bg-night/80 border border-line backdrop-blur-md shadow-pill"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-bougainvillea animate-ping" />
            <div className="flex items-center gap-1.5 text-xs font-bold text-ink dark:text-white">
              <Odometer value={livePeopleOutCount} />
              <span>people are out right now</span>
            </div>
          </motion.div>

          {/* Huge Headline (Reveal per line) */}
          <div className="space-y-1">
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ delay: 0.3, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl sm:text-7xl lg:text-[5.5rem] font-black font-display text-ink dark:text-white leading-[0.92] tracking-tight"
              >
                Someone near you
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ delay: 0.42, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl sm:text-7xl lg:text-[5.5rem] font-black font-display text-ink dark:text-white leading-[0.92] tracking-tight"
              >
                already has a plan.
              </motion.h1>
            </div>
          </div>

          {/* Sub-copy */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-base sm:text-lg text-ink-soft max-w-xl font-normal leading-relaxed"
          >
            Open the map, tap a plan, show up. No feed. No followers. No small talk.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.75, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-3 pt-2"
          >
            <button
              ref={ctaBtnRef}
              type="button"
              onClick={(e) => openApp(e.clientX, e.clientY)}
              className="px-8 py-4 rounded-full bg-marigold hover:bg-marigold-hover text-ink font-black text-sm shadow-pill active:scale-95 transition-all flex items-center gap-2"
              data-cursor="open"
            >
              <span>Open the map</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setStoreModalOpen(true)}
              className="px-6 py-4 rounded-full bg-white/70 dark:bg-night/70 hover:bg-white dark:hover:bg-night text-ink dark:text-white font-bold text-sm border border-line backdrop-blur-sm active:scale-95 transition-all flex items-center gap-2"
              data-cursor="link"
            >
              <Smartphone className="w-4 h-4 text-ink-soft" />
              <span>Get the app</span>
            </button>
          </motion.div>

          {/* Rolling City Ticker */}
          <div className="flex items-center gap-2 text-xs font-semibold text-ink-muted pt-1">
            <span>Plans live today in:</span>
            <div className="relative h-5 overflow-hidden w-28">
              <AnimatePresence mode="wait">
                <motion.span
                  key={cityIndex}
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -15, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute left-0 top-0 text-ink dark:text-white font-bold font-mono"
                >
                  {cities[cityIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Get the App Neutral Modal */}
      <AnimatePresence>
        {storeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setStoreModalOpen(false)}
              className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm rounded-3xl bg-paper dark:bg-night p-6 border border-line shadow-ambient z-10 space-y-4 text-center"
            >
              <div className="flex items-center justify-between pb-2 border-b border-line">
                <span className="font-display font-extrabold text-base text-ink dark:text-white">
                  Download {BRAND.name}
                </span>
                <button
                  type="button"
                  onClick={() => setStoreModalOpen(false)}
                  className="p-1 rounded-full text-ink-muted hover:text-ink dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-ink-soft">
                Neutral store builds. Web version is fully working right now!
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setStoreModalOpen(false);
                    useAppStore.getState().addToast('Demo build: Web app is 100% interactive.');
                  }}
                  className="p-3 rounded-2xl bg-ink/5 dark:bg-white/5 border border-line hover:border-marigold transition-all flex flex-col items-center text-center gap-1"
                >
                  <span className="text-lg"></span>
                  <span className="text-[11px] font-bold">App Store</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStoreModalOpen(false);
                    useAppStore.getState().addToast('Demo build: Web app is 100% interactive.');
                  }}
                  className="p-3 rounded-2xl bg-ink/5 dark:bg-white/5 border border-line hover:border-marigold transition-all flex flex-col items-center text-center gap-1"
                >
                  <span className="text-lg">▶</span>
                  <span className="text-[11px] font-bold">Google Play</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
