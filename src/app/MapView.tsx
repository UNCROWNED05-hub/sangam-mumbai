import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as maplibregl from 'maplibre-gl';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Plan } from '../data/plans';
import { CITY } from '../config/city';
import { useAppStore } from '../store/useAppStore';
import { PlanBubble } from '../ui/PlanBubble';
import {
  Compass,
  Layers,
  Moon,
  Sun,
  Plus,
  Minus,
  Navigation,
  EyeOff,
  Crosshair,
  MapPin,
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

const CARTO_VOYAGER = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';
const CARTO_DARK = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

// User fake location: Bandra West
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
  const [markerContainers, setMarkerContainers] = useState<Map<string, { el: HTMLDivElement; marker: maplibregl.Marker }>>(
    new Map()
  );

  const isNight = effectiveTheme === 'dark';
  const isZoomedOut = currentZoom < 11.8;

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: isNight ? CARTO_DARK : CARTO_VOYAGER,
      center: USER_LOCATION,
      zoom: 12.6,
      pitch: 50,
      bearing: -12,
      attributionControl: false,
      maxPitch: 65,
    });

    map.on('load', () => {
      setIsMapLoaded(true);
      // Attempt 3D building fill-extrusion if layer exists
      try {
        if (map.getSource('carto-vector') || map.getSource('composite')) {
          // Subtle styling
        }
      } catch {
        // Silently skip
      }
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

    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      userMarker.remove();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // 2. Handle Day / Night style changes
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded) return;
    const targetStyle = isNight ? CARTO_DARK : CARTO_VOYAGER;
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
        // Update position if needed
        const existing = nextContainers.get(plan.id);
        existing?.marker.setLngLat(plan.place.lngLat);
      }
    });

    setMarkerContainers(nextContainers);
  }, [filteredPlans, isMapLoaded, isZoomedOut, placeMode]);

  // 4. Camera Padding when Plan Selected
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
      zoom: Math.max(mapRef.current.getZoom(), 13.5),
      duration: 650,
      essential: true,
    });
  }, [selectedPlanId, filteredPlans]);

  // Map Controls
  const handleRecenter = useCallback(() => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: USER_LOCATION,
      zoom: 13,
      pitch: is3D ? 50 : 0,
      bearing: -12,
      duration: 1000,
    });
  }, [is3D]);

  const handleToggle3D = useCallback(() => {
    if (!mapRef.current) return;
    const next3D = !is3D;
    setIs3D(next3D);
    mapRef.current.easeTo({
      pitch: next3D ? 50 : 0,
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

  // Compute Area Clusters when zoomed out (<11.8)
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

  const handleFlyToArea = (lngLat: [number, number]) => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: lngLat,
      zoom: 13.8,
      duration: 1100,
    });
  };

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* MapLibre WebGL container */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

      {/* Subtle Map gradient vignette at edges */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_80px_rgba(20,22,58,0.12)] dark:shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />

      {/* Render React Portal Portals into Marker Containers */}
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

      {/* Zoom-out Area Chips (<11.8) */}
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
                    onClick={() => handleFlyToArea(cluster.lngLat)}
                    className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full bg-ink/90 dark:bg-night/90 text-white border border-marigold/60 shadow-lg hover:scale-105 hover:bg-marigold hover:text-ink transition-all flex items-center gap-1.5 backdrop-blur-md cursor-pointer"
                    style={{ left: point.x, top: point.y }}
                  >
                    <span className="font-bold text-xs">{cluster.name}</span>
                    <span className="text-[10px] bg-marigold text-ink px-1.5 py-0.5 rounded-full font-black">
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
              <div className="relative p-2 rounded-full bg-ink/70 dark:bg-night/80 border border-white/40 shadow-soft backdrop-blur-xs flex items-center gap-1.5">
                <EyeOff className="w-4 h-4 text-marigold" />
                <span className="text-[10px] font-bold text-white pr-1">Invisible</span>
              </div>
            ) : (
              <>
                {/* Ripple rings */}
                <span className="absolute w-8 h-8 rounded-full bg-lagoon/30 animate-ping opacity-75" />
                <span className="absolute w-6 h-6 rounded-full bg-lagoon/40 animate-pulse" />
                {/* Core dot */}
                <div className="relative w-4 h-4 rounded-full bg-lagoon border-2 border-white shadow-md flex items-center justify-center">
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
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-marigold flex items-center justify-center animate-spin-slow">
              <Crosshair className="w-6 h-6 text-marigold" />
            </div>
            <div className="mt-2 px-3 py-1 bg-ink text-white text-xs font-bold rounded-full shadow-lg border border-marigold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-marigold animate-bounce" />
              <span>Drag map to place pin</span>
            </div>
          </motion.div>
        </div>
      )}

      {/* Floating Glass Controls (Recenter, 2D/3D, Day/Night, Zoom) */}
      <div className="absolute bottom-6 right-5 flex flex-col gap-2.5 z-30 select-none">
        <button
          onClick={handleRecenter}
          aria-label="Recenter map"
          title="Recenter to your location"
          className="w-10 h-10 rounded-full bg-white/85 dark:bg-night/85 backdrop-blur-md text-ink dark:text-white shadow-soft border border-black/5 dark:border-white/10 flex items-center justify-center hover:bg-marigold hover:text-ink active:scale-95 transition-all"
        >
          <Navigation className="w-4 h-4" />
        </button>

        <button
          onClick={handleToggle3D}
          aria-label="Toggle 3D map pitch"
          title={is3D ? 'Switch to 2D' : 'Switch to 3D'}
          className={`w-10 h-10 rounded-full backdrop-blur-md shadow-soft border border-black/5 dark:border-white/10 flex items-center justify-center active:scale-95 transition-all ${
            is3D
              ? 'bg-marigold text-ink font-bold text-xs'
              : 'bg-white/85 dark:bg-night/85 text-ink dark:text-white text-xs font-bold hover:bg-black/5 dark:hover:bg-white/10'
          }`}
        >
          {is3D ? '3D' : '2D'}
        </button>

        <button
          onClick={handleToggleTheme}
          aria-label="Toggle Day / Night map"
          title={isNight ? 'Switch to Day style' : 'Switch to Night style'}
          className="w-10 h-10 rounded-full bg-white/85 dark:bg-night/85 backdrop-blur-md text-ink dark:text-white shadow-soft border border-black/5 dark:border-white/10 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all"
        >
          {isNight ? <Sun className="w-4 h-4 text-marigold" /> : <Moon className="w-4 h-4 text-ink-soft" />}
        </button>

        <div className="flex flex-col rounded-2xl bg-white/85 dark:bg-night/85 backdrop-blur-md shadow-soft border border-black/5 dark:border-white/10 overflow-hidden">
          <button
            onClick={handleZoomIn}
            aria-label="Zoom in"
            className="w-10 h-9 flex items-center justify-center text-ink dark:text-white hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
          <div className="h-px bg-black/5 dark:bg-white/10" />
          <button
            onClick={handleZoomOut}
            aria-label="Zoom out"
            className="w-10 h-9 flex items-center justify-center text-ink dark:text-white hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Compact Map Attribution */}
      <div className="absolute bottom-2 left-4 text-[10px] text-ink-muted/80 bg-white/40 dark:bg-night/40 backdrop-blur-xs px-2 py-0.5 rounded pointer-events-none select-none">
        © MapLibre © CARTO
      </div>
    </div>
  );
};
