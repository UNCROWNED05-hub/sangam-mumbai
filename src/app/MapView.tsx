import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { Plan } from '../data/plans';
import { CITY } from '../config/city';
import { useAppStore } from '../store/useAppStore';
import {
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

// User starting location: Bandra West, Mumbai [lat, lng]
const USER_LOCATION: [number, number] = [19.059, 72.83];

// Key Mumbai Landmarks for Navigation and Flight
const MUMBAI_LANDMARKS = [
  { name: 'Marine Drive', coords: [18.9433, 72.8236] as [number, number], zoom: 15 },
  { name: 'Bandra Bandstand', coords: [19.0425, 72.8190] as [number, number], zoom: 15.5 },
  { name: 'Gateway of India', coords: [18.9226, 72.8340] as [number, number], zoom: 15.5 },
  { name: 'Worli Sea Face', coords: [19.0100, 72.8165] as [number, number], zoom: 15 },
  { name: 'Juhu Beach', coords: [19.0985, 72.8266] as [number, number], zoom: 15 },
  { name: 'Shivaji Park', coords: [19.0270, 72.8380] as [number, number], zoom: 15.5 },
  { name: 'Kala Ghoda', coords: [18.9289, 72.8318] as [number, number], zoom: 16 },
];

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
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const { effectiveTheme, setTheme, isInvisible } = useAppStore();
  const [activeTourIndex, setActiveTourIndex] = useState<number | null>(null);
  const tourTimerRef = useRef<number | null>(null);

  const isNight = effectiveTheme === 'dark';

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Fix default marker icon issues if needed
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    const map = L.map(mapContainerRef.current, {
      center: USER_LOCATION,
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true,
      fadeAnimation: true,
    });

    mapRef.current = map;

    // Retina Carto Voyager Tiles (Day) or Dark Matter (Night)
    const tileUrl = isNight
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    const tileLayer = L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Layer group for plan markers
    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;

    // Custom HTML Marker for User Location ("You are here")
    const userIcon = L.divIcon({
      className: 'user-location-marker',
      html: `
        <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 26px; height: 26px; border-radius: 9999px; background: rgba(16, 185, 129, 0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 14px; height: 14px; border-radius: 9999px; background: #10B981; border: 2.5px solid #FFFFFF; box-shadow: 0 0 8px rgba(16, 185, 129, 0.8);"></div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const userMarker = L.marker(USER_LOCATION, { icon: userIcon, interactive: false }).addTo(map);
    userMarkerRef.current = userMarker;

    // Invalidate map size after DOM settles
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleResize);

    // Track map center during placeMode
    map.on('move', () => {
      if (placeMode && onPlaceLocationChange) {
        const center = map.getCenter();
        const lngLat: [number, number] = [center.lng, center.lat];
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

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // 2. Day / Night Tile Swap
  useEffect(() => {
    if (!mapRef.current) return;
    const tileUrl = isNight
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    if (tileLayerRef.current) {
      tileLayerRef.current.setUrl(tileUrl);
    }
  }, [isNight]);

  // 3. Render Custom Markers for filteredPlans
  useEffect(() => {
    const map = mapRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer || placeMode) {
      markersLayer?.clearLayers();
      return;
    }

    markersLayer.clearLayers();

    filteredPlans.forEach((plan) => {
      const isSelected = selectedPlanId === plan.id;
      const isHovered = hoveredPlanId === plan.id;
      const lat = plan.place.lngLat[1];
      const lng = plan.place.lngLat[0];

      // Styling based on state
      const bg = isSelected
        ? '#FFB800'
        : plan.startsInMin <= 15 && plan.startsInMin >= -60
        ? '#FFB800'
        : '#FFFFFF';
      const textColor = '#000000';
      const scale = isSelected ? 'scale(1.22)' : isHovered ? 'scale(1.15)' : 'scale(1)';
      const zIndex = isSelected ? 999 : isHovered ? 998 : 100;

      const markerHtml = `
        <div 
          data-plan-id="${plan.id}" 
          style="
            display: inline-flex; 
            align-items: center; 
            gap: 5px; 
            padding: 5px 10px; 
            border-radius: 9999px; 
            background: ${bg}; 
            color: ${textColor}; 
            font-family: inherit; 
            font-size: 12px; 
            font-weight: 900; 
            border: 2px solid #000000; 
            box-shadow: ${isSelected ? '0 0 12px #FFB800, 4px 4px 0px #000' : '3px 3px 0px #000'}; 
            cursor: pointer; 
            transform: ${scale}; 
            transition: transform 0.15s ease, box-shadow 0.15s ease; 
            white-space: nowrap; 
            user-select: none;
          "
        >
          <span style="font-size: 15px; line-height: 1;">${plan.emoji}</span>
          <span style="font-family: monospace; font-size: 11px; line-height: 1;">${plan.goingIds.length}</span>
          <span style="font-size: 10px; font-weight: 800; opacity: 0.85; margin-left: 2px;">${plan.place.area.split(' ')[0]}</span>
        </div>
      `;

      const icon = L.divIcon({
        className: `custom-plan-bubble-${plan.id}`,
        html: markerHtml,
        iconSize: [80, 32],
        iconAnchor: [40, 16],
      });

      const marker = L.marker([lat, lng], { icon, zIndexOffset: zIndex });

      marker.on('click', () => {
        onSelectPlan(plan.id);
      });

      marker.on('mouseover', () => {
        onHoverPlan(plan.id);
      });

      marker.on('mouseout', () => {
        onHoverPlan(null);
      });

      markersLayer.addLayer(marker);
    });
  }, [filteredPlans, selectedPlanId, hoveredPlanId, placeMode, onSelectPlan, onHoverPlan]);

  // 4. Pan to Plan on Selection
  useEffect(() => {
    if (!mapRef.current || !selectedPlanId) return;
    const targetPlan = filteredPlans.find((p) => p.id === selectedPlanId);
    if (!targetPlan) return;

    const lat = targetPlan.place.lngLat[1];
    const lng = targetPlan.place.lngLat[0];

    mapRef.current.flyTo([lat, lng], 15.5, {
      animate: true,
      duration: 1.2,
    });
  }, [selectedPlanId, filteredPlans]);

  // Navigation handlers
  const handleRecenter = useCallback(() => {
    if (!mapRef.current) return;
    stopTour();
    mapRef.current.flyTo(USER_LOCATION, 13.5, { duration: 1.2 });
  }, []);

  const handleZoomIn = useCallback(() => {
    mapRef.current?.zoomIn();
  }, []);

  const handleZoomOut = useCallback(() => {
    mapRef.current?.zoomOut();
  }, []);

  const handleToggleTheme = useCallback(() => {
    setTheme(isNight ? 'day' : 'night');
  }, [isNight, setTheme]);

  // Quick Landmark Flight
  const handleFlyToLandmark = (coords: [number, number], zoom = 15.5) => {
    if (!mapRef.current) return;
    stopTour();
    mapRef.current.flyTo(coords, zoom, { duration: 1.5 });
  };

  // Cinematic Mumbai Tour Autoplay
  const startTour = () => {
    if (!mapRef.current) return;
    let step = 0;
    setActiveTourIndex(0);

    const runStep = () => {
      if (!mapRef.current) return;
      const target = MUMBAI_LANDMARKS[step];
      mapRef.current.flyTo(target.coords, target.zoom, { duration: 2.5 });

      step = (step + 1) % MUMBAI_LANDMARKS.length;
      setActiveTourIndex(step);
      tourTimerRef.current = window.setTimeout(runStep, 4200);
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

  return (
    <div className={`relative w-full h-full overflow-hidden bg-[#E8ECEF] ${className}`}>
      {/* Leaflet DOM Map Container */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Top Mumbai Landmark Quick-Flight Bar */}
      <div className="absolute top-28 sm:top-24 left-1/2 -translate-x-1/2 z-20 pointer-events-auto flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/95 dark:bg-[#0F111A]/95 backdrop-blur-md border-2 border-black/80 dark:border-white/20 shadow-[3px_3px_0px_#000] max-w-[94vw] overflow-x-auto select-none">
        <div className="flex items-center gap-1 px-2 text-[10px] font-black text-amber-500 uppercase tracking-wider font-mono flex-shrink-0">
          <MapPin className="w-3.5 h-3.5 text-rose-500 animate-bounce" />
          <span>MUMBAI:</span>
        </div>

        {MUMBAI_LANDMARKS.map((loc) => (
          <button
            key={loc.name}
            type="button"
            onClick={() => handleFlyToLandmark(loc.coords, loc.zoom)}
            data-cursor="fly"
            className="px-2.5 py-1 rounded-xl text-xs font-black text-gray-900 dark:text-white hover:bg-amber-400 hover:text-black transition-all whitespace-nowrap cursor-pointer"
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

      {/* Place Mode Crosshair (When Host composer is active) */}
      {placeMode && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-30">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-amber-400 flex items-center justify-center animate-spin">
              <Crosshair className="w-6 h-6 text-amber-400" />
            </div>
            <div className="mt-2 px-3 py-1 bg-black text-white text-xs font-bold rounded-full shadow-lg border-2 border-amber-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span>Drag map to place Mumbai pin</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Controls (Recenter, Day/Night, Zoom) */}
      <div className="absolute bottom-6 right-5 flex flex-col gap-2.5 z-30 select-none">
        <button
          onClick={handleRecenter}
          aria-label="Recenter map"
          title="Recenter to your location"
          className="w-11 h-11 rounded-2xl bg-white/95 dark:bg-[#0F111A]/95 backdrop-blur-md text-gray-900 dark:text-white shadow-[3px_3px_0px_#000] border-2 border-black/80 dark:border-white/20 flex items-center justify-center hover:bg-amber-400 hover:text-black active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] transition-all cursor-pointer"
        >
          <Navigation className="w-4 h-4 stroke-[2.5]" />
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
      <div className="absolute bottom-2 left-4 text-[10px] text-gray-700 dark:text-gray-300 bg-white/85 dark:bg-black/85 backdrop-blur-xs px-2.5 py-1 rounded-md border border-black/10 shadow-xs pointer-events-none select-none z-10">
        📍 Mumbai Metropolitan Region • © CARTO © OpenStreetMap
      </div>
    </div>
  );
};
