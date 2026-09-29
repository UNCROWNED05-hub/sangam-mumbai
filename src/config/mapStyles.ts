/**
 * 100% Free, High-Resolution Tile Specifications for Mumbai Maps.
 * ZERO API Key Required, ZERO Watermarks.
 */

export const FREE_TILE_SERVERS = {
  // OpenStreetMap standard - world's most popular free open map
  osm: {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
  },
  // Esri World Street Map - crisp global cartography, no watermark
  esriStreet: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: '© Esri, HERE, Garmin, USGS',
    maxZoom: 19,
  },
  // Esri Dark Gray Canvas - sleek dark night style, no watermark
  esriDark: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: '© Esri, HERE',
    maxZoom: 16,
  },
  // OpenStreetMap Humanitarian
  osmHot: {
    url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors, Humanitarian OpenStreetMap Team',
    maxZoom: 19,
  },
};

export interface MumbaiWaypoint {
  name: string;
  tagline: string;
  coords: [number, number]; // [lat, lng]
  zoom: number;
}

export const MUMBAI_WAYPOINTS: MumbaiWaypoint[] = [
  {
    name: 'Marine Drive & Chowpatty',
    tagline: "The Queen's Necklace • Sunset Sea Breeze",
    coords: [18.9433, 72.8236],
    zoom: 15,
  },
  {
    name: 'Gateway of India & Colaba',
    tagline: 'Historic Harbor • Yacht Club & Heritage Walk',
    coords: [18.9226, 72.8340],
    zoom: 15.5,
  },
  {
    name: 'Worli Sea Face & Sea Link',
    tagline: 'Bandra-Worli Cable Stay • Ocean Waves',
    coords: [19.0100, 72.8165],
    zoom: 15,
  },
  {
    name: 'Bandra Bandstand & Mannat',
    tagline: 'Sunset Rock Promenade • Cultural Epicenter',
    coords: [19.0425, 72.8190],
    zoom: 15.5,
  },
  {
    name: 'Carter Road & Juhu Beach',
    tagline: 'Seaside Joggers, Cutting Chai & Pav Bhaji',
    coords: [19.0692, 72.8228],
    zoom: 15,
  },
];
