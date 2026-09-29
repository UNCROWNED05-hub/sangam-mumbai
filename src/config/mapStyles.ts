import type { StyleSpecification } from 'maplibre-gl';

/**
 * 100% Reliable Retina (@2x) Carto Raster Map Specifications.
 * These load in milliseconds, require zero external font pbf downloads,
 * avoid WebGL shader compilation failures, and display crisp Mumbai streets,
 * coastlines, landmarks, and ocean waters.
 */

export const MAP_STYLE_DAY: StyleSpecification = {
  version: 8,
  sources: {
    'carto-voyager': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
        'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
        'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
        'https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
      ],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors, © CARTO',
    },
  },
  layers: [
    {
      id: 'carto-voyager-layer',
      type: 'raster',
      source: 'carto-voyager',
      minzoom: 0,
      maxzoom: 20,
    },
  ],
};

export const MAP_STYLE_NIGHT: StyleSpecification = {
  version: 8,
  sources: {
    'carto-dark': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
        'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
        'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
        'https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
      ],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors, © CARTO',
    },
  },
  layers: [
    {
      id: 'carto-dark-layer',
      type: 'raster',
      source: 'carto-dark',
      minzoom: 0,
      maxzoom: 20,
    },
  ],
};

export interface MumbaiWaypoint {
  name: string;
  tagline: string;
  center: [number, number];
  zoom: number;
  pitch: number;
  bearing: number;
}

export const MUMBAI_WAYPOINTS: MumbaiWaypoint[] = [
  {
    name: 'Marine Drive & Chowpatty',
    tagline: "The Queen's Necklace • Sunset Sea Breeze",
    center: [72.8236, 18.9433],
    zoom: 14.2,
    pitch: 58,
    bearing: -22,
  },
  {
    name: 'Gateway of India & Colaba',
    tagline: 'Historic Harbor • Yacht Club & Heritage Walk',
    center: [72.8340, 18.9226],
    zoom: 15.0,
    pitch: 62,
    bearing: 25,
  },
  {
    name: 'Worli Sea Face & Sea Link',
    tagline: 'Bandra-Worli Cable Stay • Ocean Waves',
    center: [72.8165, 19.0100],
    zoom: 14.6,
    pitch: 60,
    bearing: -15,
  },
  {
    name: 'Bandra Bandstand & Mannat',
    tagline: 'Sunset Rock Promenade • Cultural Epicenter',
    center: [72.8190, 19.0425],
    zoom: 15.2,
    pitch: 65,
    bearing: 18,
  },
  {
    name: 'Carter Road & Juhu Beach',
    tagline: 'Seaside Joggers, Cutting Chai & Pav Bhaji',
    center: [72.8228, 19.0692],
    zoom: 14.8,
    pitch: 62,
    bearing: -10,
  },
];
