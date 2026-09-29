import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as maplibregl from 'maplibre-gl';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Plan } from '../data/plans';
import { CITY } from '../config/city';
import { useAppStore } from '../store/useAppStore';
import { PlanBubble } from '../ui/PlanBubble';
import { MAP_STYLE_DAY, MAP_STYLE_NIGHT, MUMBAI_WAYPOINTS } from '../config/mapStyles';
import {
  Compass,
  Moon,
  Sun,
  Plus,
  Minus,
  Navigation,
  EyeOff,
  Crosshair,
  MapPin,
  Play,
  Square,
  Sparkles,
} from 'lucide-react';

interface MapViewProps {
  filteredPlans: Plan[];
  selectedPlanId: string | null;
  hoveredPlanId: string | null;
  onHoverPlan: (id: string | null) => void;
  onSelectPlan: (id: string) => void;
  placeMode?: boolean;
  onPlaceLocationChange?: (lngLat: [number, number], placeName: string) => void;
  className?: string;
}

// User starting location: Bandra West, Mumbai
const USER_LOCATION: [number, number] = [72.83, 19.059];

export const MapView: React.FC<MapViewProps> = ({
  filteredPlans,
  selectedPlanId,
  hoveredPlanId,
  onHoverPlan,
  onSelectPlan,
  placeMode = false,
  onPlaceLocationChange,
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);

  const { theme, effectiveTheme, setTheme, isInvisible } = useAppStore();
  const [currentZoom, setCurrentZoom] = useState(12.6);
  const [is3D, setIs3D] = useState(true);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [activeTourIndex, setActiveTourIndex] = useState<number | null>(null);
  const tourTimerRef = useRef<number | null>(null);

  const [markerContainers, setMarkerContainers] = useState<
    Map<string, { el: HTMLDivElement; marker: maplibregl.Marker }>
  >(new Map());

  const isNight = effectiveTheme === 'dark';
  const isZoomedOut = currentZoom < 11.5;

  // 1. Initialize Map with Carto Retina Raster specification
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    try {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: isNight ? MAP_STYLE_NIGHT : MAP_STYLE_DAY,
        center: USER_LOCATION,
        zoom: 12.8,
        pitch: 52,
        bearing: -14,
        attributionControl: false,
        maxPitch: 65,
      });

      map.on('load', () => {
        setIsMapLoaded(true);
        map.resize();
      });

      map.on('zoom', () => {
        setCurrentZoom(map.getZoom());
      });

      // Handle placeMode drag tracking
      map.on('move', () => {
        if (placeMode && onPlaceLocationChange) {
          const center = map.getCenter();
          const lngLat: [number, number] = [center.lng, center.lat];
          // Find nearest anchor
          let nearest = CITY.anchors[0];
          let minDist = Infinity;
          for (const anchor of CITY.anchors) {
            const dx = anchor.lngLat[0] - lngLat[0];
            const dy = anchor.lngLat[1] - lngLat[1];
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < minDist) {
              minDist = dist;
              nearest = anchor;
            }
          }
          onPlaceLocationChange(lngLat, `Near ${nearest.name}`);
        }
      });

      mapRef.current = map;

      // Attach User Location Marker
      const userEl = document.createElement('div');
      userEl.className = 'user-radar-marker relative pointer-events-none';
      const userMarker = new maplibregl.Marker({ element: userEl })
        .setLngLat(USER_LOCATION)
        .addTo(map);
      userMarkerRef.current = userMarker;

      const handleWindowResize = () => {
        map.resize();
      };
      window.addEventListener('resize', handleWindowResize);

      const resizeObserver = new ResizeObserver(() => {
        map.resize();
      });
      resizeObserver.observe(mapContainerRef.current);

      return () => {
        window.removeEventListener('resize', handleWindowResize);
        resizeObserver.disconnect();
        userMarker.remove();
        map.remove();
        mapRef.current = null;
      };
    } catch (err) {
      console.error('Failed to init MapLibre:', err);
    }
  }, []);

  // 2. Handle Day / Night style changes
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded) return;
    const targetStyle = isNight ? MAP_STYLE_NIGHT : MAP_STYLE_DAY;
    mapRef.current.setStyle(targetStyle);
  }, [isNight, isMapLoaded]);

  // 3. Keep Map Markers in Sync with filteredPlans
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoaded || isZoomedOut || placeMode) {
      // Clear markers if zoomed out or in place mode
      markerContainers.forEach(({ marker, el }) => {
        marker.remove();
        el.remove();
      });
      setMarkerContainers(new Map());
      return;
    }

    const nextContainers = new Map(markerContainers);

    // Remove markers not in filteredPlans
    const currentIds = new Set(filteredPlans.map((p) => p.id));
    nextContainers.forEach(({ marker, el }, id) => {
      if (!currentIds.has(id)) {
        marker.remove();
        el.remove();
        nextContainers.delete(id);
      }
    });

    // Add new markers
    filteredPlans.forEach((plan) => {
      if (!nextContainers.has(plan.id)) {
        const el = document.createElement('div');
        el.className = 'plan-marker-root cursor-pointer transition-transform duration-200 select-none';
        const marker = new maplibregl.Marker({
          element: el,
          anchor: 'bottom',
        })
          .setLngLat(plan.place.lngLat)
          .addTo(map);

        nextContainers.set(plan.id, { el, marker });
      } else {
        const existing = nextContainers.get(plan.id);
        existing?.marker.setLngLat(plan.place.lngLat);
      }
    });

    setMarkerContainers(nextContainers);
  }, [filteredPlans, isMapLoaded, isZoomedOut, placeMode]);

  // 4. Camera Glide when Plan Selected
  useEffect(() => {
    if (!mapRef.current || !selectedPlanId) return;
    const targetPlan = filteredPlans.find((p) => p.id === selectedPlanId);
    if (!targetPlan) return;

    const isDesktop = window.innerWidth >= 1024;
    const padding = isDesktop
      ? { top: 60, bottom: 60, left: 100, right: 440 }
      : { top: 80, bottom: window.innerHeight * 0.55, left: 40, right: 40 };

    mapRef.current.easeTo({
      center: targetPlan.place.lngLat,
      padding,
      zoom: Math.max(mapRef.current.getZoom(), 13.8),
      duration: 750,
      essential: true,
    });
  }, [selectedPlanId, filteredPlans]);

  // Map Controls
  const handleRecenter = useCallback(() => {
    if (!mapRef.current) return;
    stopTour();
    mapRef.current.flyTo({
      center: USER_LOCATION,
      zoom: 13.2,
      pitch: is3D ? 52 : 0,
      bearing: -14,
      duration: 1200,
    });
  }, [is3D]);

  const handleToggle3D = useCallback(() => {
    if (!mapRef.current) return;
    const next3D = !is3D;
    setIs3D(next3D);
    mapRef.current.easeTo({
      pitch: next3D ? 52 : 0,
      duration: 500,
    });
  }, [is3D]);

  const handleToggleTheme = useCallback(() => {
    setTheme(isNight ? 'day' : 'night');
  }, [isNight, setTheme]);

  const handleZoomIn = useCallback(() => {
    if (!mapRef.current) return;
    mapRef.current.zoomIn({ duration: 300 });
  }, []);

  const handleZoomOut = useCallback(() => {
    if (!mapRef.current) return;
    mapRef.current.zoomOut({ duration: 300 });
  }, []);

  // Quick Fly to Mumbai Landmark
  const handleFlyToLandmark = (lngLat: [number, number], zoom = 14.5, pitch = 55, bearing = -15) => {
    if (!mapRef.current) return;
    stopTour();
    mapRef.current.flyTo({
      center: lngLat,
      zoom,
      pitch: is3D ? pitch : 0,
      bearing,
      duration: 1400,
      essential: true,
    });
  };

  // Cinematic Mumbai Autoplay Tour
  const startTour = () => {
    if (!mapRef.current) return;
    let step = 0;
    setActiveTourIndex(0);

    const runStep = () => {
      if (!mapRef.current) return;
      const wp = MUMBAI_WAYPOINTS[step];
      mapRef.current.flyTo({
        center: wp.center,
        zoom: wp.zoom,
        pitch: is3D ? wp.pitch : 0,
        bearing: wp.bearing,
        duration: 3200,
      });

      step = (step + 1) % MUMBAI_WAYPOINTS.length;
      setActiveTourIndex(step);
      tourTimerRef.current = window.setTimeout(runStep, 4500);
    };

    runStep();
  };

  const stopTour = () => {
    if (tourTimerRef.current !== null) {
      window.clearTimeout(tourTimerRef.current);
      tourTimerRef.current = null;
    }
    setActiveTourIndex(null);
  };

  // Compute Area Clusters when zoomed out (<11.5)
  const areaClusters = useMemo(() => {
    if (!isZoomedOut) return [];
    const clusters: { name: string; lngLat: [number, number]; count: number }[] = [];

    CITY.anchors.forEach((anchor) => {
      const nearCount = filteredPlans.filter((p) => {
        const dx = p.place.lngLat[0] - anchor.lngLat[0];
        const dy = p.place.lngLat[1] - anchor.lngLat[1];
        return Math.sqrt(dx * dx + dy * dy) < 0.035;
      }).length;

      if (nearCount > 0) {
        clusters.push({
          name: anchor.name,
          lngLat: anchor.lngLat,
          count: nearCount,
        });
      }
    });

    return clusters;
  }, [isZoomedOut, filteredPlans]);

  return (
    <div className={`relative w-full h-full overflow-hidden bg-[#E8ECEF] ${className}`}>
      {/* MapLibre Canvas */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

      {/* Subtle Map gradient vignette at edges */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_80px_rgba(20,22,58,0.1)] dark:shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />

      {/* Top Mumbai Landmark Quick-Flight Bar */}
      <div className="absolute top-28 sm:top-24 left-1/2 -translate-x-1/2 z-20 pointer-events-auto flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/95 dark:bg-[#0F111A]/95 backdrop-blur-md border-2 border-black/80 dark:border-white/20 shadow-[3px_3px_0px_#000] max-w-[94vw] overflow-x-auto select-none">
        <div className="flex items-center gap-1 px-2 text-[10px] font-black text-amber-500 uppercase tracking-wider font-mono flex-shrink-0">
          <MapPin className="w-3.5 h-3.5 text-rose-500 animate-bounce" />
          <span>MUMBAI:</span>
        </div>

        {[
          { name: 'Marine Drive', coords: [72.8236, 18.9433] as [number, number] },
          { name: 'Bandra Bandstand', coords: [72.8190, 19.0425] as [number, number] },
          { name: 'Gateway of India', coords: [72.8340, 18.9226] as [number, number] },
          { name: 'Worli Sea Face', coords: [72.8165, 19.0100] as [number, number] },
          { name: 'Juhu Beach', coords: [72.8266, 19.0985] as [number, number] },
          { name: 'Shivaji Park', coords: [72.8380, 19.0270] as [number, number] },
        ].map((loc) => (
          <button
            key={loc.name}
            type="button"
            onClick={() => handleFlyToLandmark(loc.coords)}
            data-cursor="fly"
            className="px-2.5 py-1 rounded-xl text-xs font-bold text-gray-900 dark:text-white hover:bg-amber-400 hover:text-black transition-all whitespace-nowrap cursor-pointer"
          >
            {loc.name}
          </button>
        ))}

        {/* Cinematic Tour Toggle */}
        <button
          type="button"
          onClick={activeTourIndex !== null ? stopTour : startTour}
          className={`px-3 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0 ${
            activeTourIndex !== null
              ? 'bg-rose-500 text-white animate-pulse'
              : 'bg-black text-white dark:bg-white dark:text-black hover:bg-amber-400 hover:text-black'
          }`}
        >
          {activeTourIndex !== null ? (
            <>
              <Square className="w-3 h-3 fill-current" />
              <span>Stop Tour</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 fill-current" />
              <span>Tour Mumbai</span>
            </>
          )}
        </button>
      </div>

      {/* Render React Portals into Marker Containers */}
      {!isZoomedOut &&
        !placeMode &&
        Array.from(markerContainers.entries()).map(([id, { el }]) => {
          const plan = filteredPlans.find((p) => p.id === id);
          if (!plan) return null;

          const isSelected = selectedPlanId === plan.id;
          const isHovered = hoveredPlanId === plan.id;
          const isDimmed = selectedPlanId !== null && !isSelected;

          return createPortal(
            <div
              key={plan.id}
              className={`marker-inner transform-gpu transition-all duration-300 ${
                isDimmed ? 'opacity-40 scale-90' : 'opacity-100'
              } ${isHovered ? '-translate-y-2 scale-110 z-50' : 'z-20'}`}
              onMouseEnter={() => onHoverPlan(plan.id)}
              onMouseLeave={() => onHoverPlan(null)}
              onClick={(e) => {
                e.stopPropagation();
                onSelectPlan(plan.id);
              }}
            >
              <PlanBubble
                plan={plan}
                isSelected={isSelected}
                enableExpandOnHover={false}
              />
            </div>,
            el
          );
        })}

      {/* Zoom-out Area Chips (<11.5) */}
      <AnimatePresence>
        {isZoomedOut && !placeMode && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="relative w-full h-full">
              {areaClusters.map((cluster) => {
                if (!mapRef.current) return null;
                const point = mapRef.current.project(cluster.lngLat);
                return (
                  <motion.button
                    key={cluster.name}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={{ type: 'spring', damping: 20 }}
                    onClick={() => handleFlyToLandmark(cluster.lngLat, 13.8)}
                    className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-2xl bg-black text-white dark:bg-white dark:text-black border-2 border-amber-400 shadow-[3px_3px_0px_#000] hover:scale-105 hover:bg-amber-400 hover:text-black transition-all flex items-center gap-1.5 backdrop-blur-md cursor-pointer"
                    style={{ left: point.x, top: point.y }}
                  >
                    <span className="font-black text-xs">{cluster.name}</span>
                    <span className="text-[10px] bg-amber-400 text-black px-1.5 py-0.5 rounded-full font-black">
                      {cluster.count}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* "You are here" Radar Dot (Portal to userMarker element) */}
      {userMarkerRef.current &&
        createPortal(
          <div className="relative flex items-center justify-center">
            {isInvisible ? (
              <div className="relative p-2 rounded-full bg-black/80 dark:bg-white/80 border border-white/40 shadow-soft backdrop-blur-xs flex items-center gap-1.5">
                <EyeOff className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] font-bold text-white pr-1">Invisible</span>
              </div>
            ) : (
              <>
                <span className="absolute w-8 h-8 rounded-full bg-emerald-500/30 animate-ping opacity-75" />
                <span className="absolute w-6 h-6 rounded-full bg-emerald-500/40 animate-pulse" />
                <div className="relative w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-md flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              </>
            )}
          </div>,
          userMarkerRef.current.getElement()
        )}

      {/* Place Mode Crosshair (When Composer Step 3 is active) */}
      {placeMode && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center"
          >
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-amber-400 flex items-center justify-center animate-spin-slow">
              <Crosshair className="w-6 h-6 text-amber-400" />
            </div>
            <div className="mt-2 px-3 py-1 bg-black text-white text-xs font-bold rounded-full shadow-lg border-2 border-amber-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span>Drag map to place Mumbai pin</span>
            </div>
          </motion.div>
        </div>
      )}

      {/* Floating Controls (Recenter, 2D/3D, Day/Night, Zoom) */}
      <div className="absolute bottom-6 right-5 flex flex-col gap-2.5 z-30 select-none">
        <button
          onClick={handleRecenter}
          aria-label="Recenter map"
          title="Recenter to your Mumbai location"
          className="w-11 h-11 rounded-2xl bg-white/95 dark:bg-[#0F111A]/95 backdrop-blur-md text-gray-900 dark:text-white shadow-[3px_3px_0px_#000] border-2 border-black/80 dark:border-white/20 flex items-center justify-center hover:bg-amber-400 hover:text-black active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] transition-all cursor-pointer"
        >
          <Navigation className="w-4 h-4 stroke-[2.5]" />
        </button>

        <button
          onClick={handleToggle3D}
          aria-label="Toggle 3D map pitch"
          title={is3D ? 'Switch to 2D' : 'Switch to 3D'}
          className={`w-11 h-11 rounded-2xl backdrop-blur-md shadow-[3px_3px_0px_#000] border-2 border-black/80 dark:border-white/20 flex items-center justify-center active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] transition-all cursor-pointer font-black text-xs ${
            is3D
              ? 'bg-amber-400 text-black'
              : 'bg-white/95 dark:bg-[#0F111A]/95 text-gray-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/10'
          }`}
        >
          {is3D ? '3D' : '2D'}
        </button>

        <button
          onClick={handleToggleTheme}
          aria-label="Toggle Day / Night map"
          title={isNight ? 'Switch to Day style' : 'Switch to Night style'}
          className="w-11 h-11 rounded-2xl bg-white/95 dark:bg-[#0F111A]/95 backdrop-blur-md text-gray-900 dark:text-white shadow-[3px_3px_0px_#000] border-2 border-black/80 dark:border-white/20 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] transition-all cursor-pointer"
        >
          {isNight ? <Sun className="w-4 h-4 text-amber-400 stroke-[2.5]" /> : <Moon className="w-4 h-4 text-gray-700 stroke-[2.5]" />}
        </button>

        <div className="flex flex-col rounded-2xl bg-white/95 dark:bg-[#0F111A]/95 backdrop-blur-md shadow-[3px_3px_0px_#000] border-2 border-black/80 dark:border-white/20 overflow-hidden">
          <button
            onClick={handleZoomIn}
            aria-label="Zoom in"
            className="w-11 h-10 flex items-center justify-center text-gray-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 active:bg-amber-400 active:text-black transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
          </button>
          <div className="h-0.5 bg-black/10 dark:bg-white/10" />
          <button
            onClick={handleZoomOut}
            aria-label="Zoom out"
            className="w-11 h-10 flex items-center justify-center text-gray-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 active:bg-amber-400 active:text-black transition-all cursor-pointer"
          >
            <Minus className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Map Attribution */}
      <div className="absolute bottom-2 left-4 text-[10px] text-gray-700 dark:text-gray-300 bg-white/85 dark:bg-black/85 backdrop-blur-xs px-2.5 py-1 rounded-md border border-black/10 shadow-xs pointer-events-none select-none">
        📍 Mumbai Metropolitan Region • © CARTO © OpenStreetMap
      </div>
    </div>
  );
};
