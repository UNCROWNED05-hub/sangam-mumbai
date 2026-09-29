import React, { useEffect, useRef, useState, useCallback } from 'react';
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
import { MAP_STYLE_DAY, MUMBAI_WAYPOINTS, MumbaiWaypoint } from '../../config/mapStyles';
import { ArrowRight, Smartphone, X, Compass, Navigation2, MapPin } from 'lucide-react';

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

  const [activeWaypointIndex, setActiveWaypointIndex] = useState(0);
  const [currentCoords, setCurrentCoords] = useState<[number, number]>(MUMBAI_WAYPOINTS[0].center);
  const [storeModalOpen, setStoreModalOpen] = useState(false);

  // Helper to lerp numbers
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  // Jump or Fly to specific Mumbai Landmark
  const flyToMumbaiSector = useCallback((idx: number) => {
    const wp = MUMBAI_WAYPOINTS[idx];
    if (!wp || !mapInstanceRef.current) return;
    setActiveWaypointIndex(idx);
    setCurrentCoords(wp.center);
    mapInstanceRef.current.flyTo({
      center: wp.center,
      zoom: wp.zoom,
      pitch: wp.pitch,
      bearing: wp.bearing,
      duration: 1800,
      essential: true,
    });
  }, []);

  // MapLibre initialization (Retina Carto Raster Day Style, Mumbai Center)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: MAP_STYLE_DAY,
        center: MUMBAI_WAYPOINTS[0].center, // Marine Drive
        zoom: MUMBAI_WAYPOINTS[0].zoom,
        pitch: MUMBAI_WAYPOINTS[0].pitch,
        bearing: MUMBAI_WAYPOINTS[0].bearing,
        interactive: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      map.on('load', () => {
        map.resize();
      });

      const handleResize = () => {
        map.resize();
      };
      window.addEventListener('resize', handleResize);

      // ScrollTrigger waypoint flight across Mumbai
      const heroEl = heroSectionRef.current;
      if (heroEl) {
        ScrollTrigger.create({
          trigger: heroEl,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
          onUpdate: (self) => {
            const p = self.progress; // 0 to 1
            const total = MUMBAI_WAYPOINTS.length - 1;
            const scaled = p * total;
            const index = Math.min(Math.floor(scaled), total - 1);
            const localProgress = scaled - index;

            const w1 = MUMBAI_WAYPOINTS[index];
            const w2 = MUMBAI_WAYPOINTS[index + 1];

            const interpolatedLng = lerp(w1.center[0], w2.center[0], localProgress);
            const interpolatedLat = lerp(w1.center[1], w2.center[1], localProgress);
            const interpolatedZoom = lerp(w1.zoom, w2.zoom, localProgress);
            const interpolatedPitch = lerp(w1.pitch, w2.pitch, localProgress);
            const interpolatedBearing = lerp(w1.bearing, w2.bearing, localProgress);

            if (mapInstanceRef.current) {
              mapInstanceRef.current.jumpTo({
                center: [interpolatedLng, interpolatedLat],
                zoom: interpolatedZoom,
                pitch: interpolatedPitch,
                bearing: interpolatedBearing,
              });
            }

            const currentIdx = Math.round(scaled);
            setActiveWaypointIndex(currentIdx);
            setCurrentCoords([
              parseFloat(interpolatedLng.toFixed(4)),
              parseFloat(interpolatedLat.toFixed(4)),
            ]);
          },
        });
      }

      return () => {
        window.removeEventListener('resize', handleResize);
        map.remove();
      };
    } catch (err) {
      console.warn('Map initialization note:', err);
    }
  }, []);

  // 10 Hero Plan Bubbles placed over Mumbai hotspots
  const heroPlans = plans.slice(0, 10);
  const bubblePositions = [
    { top: '22%', left: '18%' },
    { top: '28%', left: '62%' },
    { top: '16%', left: '78%' },
    { top: '38%', left: '32%' },
    { top: '44%', left: '76%' },
    { top: '54%', left: '16%' },
    { top: '62%', left: '48%' },
    { top: '68%', left: '82%' },
    { top: '32%', left: '88%' },
    { top: '74%', left: '26%' },
  ];

  const currentWp = MUMBAI_WAYPOINTS[activeWaypointIndex] || MUMBAI_WAYPOINTS[0];

  return (
    <section
      ref={heroSectionRef}
      className="relative min-h-[220vh] w-full flex flex-col justify-between"
    >
      {/* Pinned / Sticky Map Viewport (Z-0 so it is 100% visible and vivid) */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden z-0 bg-[#E8ECEF]">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Ambient Map Vignette Edge Shading */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_90px_rgba(15,17,26,0.2)]" />

        {/* Floating Plan Bubbles on Mumbai Canvas */}
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
                  y: [0, -7, 0],
                }}
                transition={{
                  scale: { delay: 0.8 + idx * 0.05, duration: 0.5, ease: [0.175, 0.885, 0.32, 1.275] },
                  opacity: { delay: 0.8 + idx * 0.05, duration: 0.3 },
                  y: { repeat: Infinity, duration: 3.5 + (idx % 3), ease: 'easeInOut', delay: idx * 0.25 },
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

        {/* Live Mumbai Flight Telemetry HUD Bar (Top Center / Right) */}
        <div className="absolute top-20 right-6 sm:right-10 pointer-events-auto z-20 flex flex-col items-end gap-2">
          {/* Active Sector Card */}
          <div className="p-3 sm:p-4 rounded-2xl bg-white/95 dark:bg-[#0F111A]/95 backdrop-blur-md border-2 border-black/80 dark:border-white/20 shadow-[4px_4px_0px_#000] text-right space-y-1">
            <div className="flex items-center justify-end gap-2 text-[10px] font-black tracking-widest uppercase text-amber-500 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>LIVE MUMBAI CAMERA</span>
            </div>
            <p className="font-display font-black text-sm sm:text-base text-gray-950 dark:text-white leading-tight">
              {currentWp.name}
            </p>
            <p className="text-[11px] text-gray-600 dark:text-gray-300 font-medium max-w-xs">
              {currentWp.tagline}
            </p>
            <div className="flex items-center justify-end gap-3 pt-1 text-[10px] font-mono text-gray-500 dark:text-gray-400">
              <span>{currentCoords[1]}° N</span>
              <span>{currentCoords[0]}° E</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">● SCROLL TO FLY</span>
            </div>
          </div>

          {/* Quick Landmark Jump Pills */}
          <div className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-white/90 dark:bg-[#0F111A]/90 backdrop-blur-md border border-black/20 shadow-[2px_2px_0px_#000]">
            {MUMBAI_WAYPOINTS.map((wp, idx) => (
              <button
                key={wp.name}
                type="button"
                onClick={() => flyToMumbaiSector(idx)}
                data-cursor="fly"
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  activeWaypointIndex === idx
                    ? 'bg-amber-400 text-black shadow-xs font-black'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10'
                }`}
              >
                {wp.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Map Attribution */}
        <div className="absolute bottom-3 right-4 text-[10px] text-gray-700 dark:text-gray-300 bg-white/80 dark:bg-black/80 backdrop-blur-xs px-2.5 py-1 rounded-md border border-black/10 shadow-xs pointer-events-none">
          📍 Mumbai Metropolitan Region • © CARTO © OpenStreetMap
        </div>
      </div>

      {/* Hero Foreground Content Overlay */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 min-h-screen flex flex-col justify-end pb-24 pointer-events-none">
        <div className="max-w-3xl pointer-events-auto space-y-6">
          {/* Authentic Local Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/95 dark:bg-[#0F111A]/95 border-2 border-black/90 dark:border-white/20 shadow-[3px_3px_0px_#000]"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <div className="flex items-center gap-1.5 text-xs font-black text-gray-900 dark:text-white">
              <Odometer value={livePeopleOutCount} />
              <span>people on Mumbai streets right now</span>
            </div>
            <span className="text-[10px] bg-amber-400 text-black font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
              BOMBAY LIVE
            </span>
          </motion.div>

          {/* Expressive Editorial Headline */}
          <div className="space-y-1">
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl sm:text-7xl lg:text-[5.4rem] font-black font-display text-gray-950 dark:text-white leading-[0.92] tracking-tight drop-shadow-xs"
              >
                Mumbai is outside.
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ delay: 0.42, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl sm:text-7xl lg:text-[5.4rem] font-black font-display text-amber-500 leading-[0.92] tracking-tight drop-shadow-xs"
              >
                Join the circle.
              </motion.h1>
            </div>
          </div>

          {/* Sub-copy with Mumbai flavor */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
            className="text-base sm:text-lg text-gray-800 dark:text-gray-200 max-w-xl font-medium leading-relaxed bg-white/80 dark:bg-black/60 p-3 rounded-2xl backdrop-blur-xs border border-black/10 dark:border-white/10"
          >
            From sunset cycles on Marine Drive to badminton doubles in Bandra. No feeds, no influencers, no endless group chats. Just open the map and show up.
          </motion.p>

          {/* CTAs with tactile neo-brutalist styling */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex flex-wrap items-center gap-3 pt-2"
          >
            <button
              ref={ctaBtnRef}
              type="button"
              onClick={(e) => openApp(e.clientX, e.clientY)}
              className="px-8 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-sm border-2 border-black shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] transition-all flex items-center gap-2 cursor-pointer"
              data-cursor="open"
            >
              <span>Explore Mumbai Map</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

            <button
              type="button"
              onClick={() => setStoreModalOpen(true)}
              className="px-6 py-4 rounded-2xl bg-white dark:bg-[#0F111A] hover:bg-gray-50 text-gray-900 dark:text-white font-black text-sm border-2 border-black/80 dark:border-white/30 shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] transition-all flex items-center gap-2 cursor-pointer"
              data-cursor="link"
            >
              <Smartphone className="w-4 h-4 text-amber-500" />
              <span>Get the App</span>
            </button>
          </motion.div>

          {/* Mumbai Neighborhood ticker */}
          <div className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300 pt-1">
            <MapPin className="w-3.5 h-3.5 text-amber-500" />
            <span>Active circles across:</span>
            <span className="font-mono text-black dark:text-white font-extrabold underline decoration-amber-400 decoration-2">
              Bandra • Colaba • Worli • Dadar • Juhu • Powai
            </span>
          </div>
        </div>
      </div>

      {/* Get the App Modal */}
      <AnimatePresence>
        {storeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setStoreModalOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm rounded-3xl bg-[#FFFDF7] dark:bg-[#0F111A] p-6 border-2 border-black shadow-[6px_6px_0px_#000] z-10 space-y-4 text-center text-gray-900 dark:text-white"
            >
              <div className="flex items-center justify-between pb-2 border-b border-black/10 dark:border-white/10">
                <span className="font-display font-extrabold text-base">
                  Download {BRAND.name} Mumbai
                </span>
                <button
                  type="button"
                  onClick={() => setStoreModalOpen(false)}
                  className="p-1 rounded-full text-gray-500 hover:text-black dark:hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                Live Mumbai circles, instant real-life meetups. Web app is 100% interactive right now!
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setStoreModalOpen(false);
                    useAppStore.getState().addToast('Demo build: Mumbai Web App is fully active.');
                  }}
                  className="p-3 rounded-2xl bg-white dark:bg-white/5 border-2 border-black hover:border-amber-400 transition-all flex flex-col items-center text-center gap-1 shadow-[2px_2px_0px_#000] cursor-pointer"
                >
                  <span className="text-lg"></span>
                  <span className="text-[11px] font-bold">App Store</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStoreModalOpen(false);
                    useAppStore.getState().addToast('Demo build: Mumbai Web App is fully active.');
                  }}
                  className="p-3 rounded-2xl bg-white dark:bg-white/5 border-2 border-black hover:border-amber-400 transition-all flex flex-col items-center text-center gap-1 shadow-[2px_2px_0px_#000] cursor-pointer"
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
