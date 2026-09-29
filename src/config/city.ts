export interface CityAnchor {
  name: string;
  lngLat: [number, number]; // [lng, lat]
}

export const CITY = {
  id: 'mumbai',
  name: 'Mumbai',
  center: [72.83, 19.059] as [number, number], // Bandra West start
  zoom: 12.6,
  pitch: 50,
  bearing: -12,
  anchors: [
    { name: 'Marine Drive', lngLat: [72.8236, 18.9433] },
    { name: 'Girgaum Chowpatty', lngLat: [72.8135, 18.9545] },
    { name: 'Gateway of India', lngLat: [72.8340, 18.9226] },
    { name: 'Colaba Causeway', lngLat: [72.8258, 18.9150] },
    { name: 'Kala Ghoda', lngLat: [72.8318, 18.9289] },
    { name: 'Churchgate', lngLat: [72.8264, 18.9322] },
    { name: 'Hanging Gardens', lngLat: [72.8043, 18.9569] },
    { name: 'Lower Parel', lngLat: [72.8256, 18.9944] },
    { name: 'Worli Sea Face', lngLat: [72.8165, 19.0100] },
    { name: 'Shivaji Park', lngLat: [72.8380, 19.0270] },
    { name: 'Bandra Bandstand', lngLat: [72.8190, 19.0425] },
    { name: 'Carter Road', lngLat: [72.8228, 19.0692] },
    { name: 'BKC', lngLat: [72.8690, 19.0670] },
    { name: 'Juhu Beach', lngLat: [72.8266, 19.0985] },
    { name: 'Versova', lngLat: [72.8135, 19.1315] },
    { name: 'Lokhandwala', lngLat: [72.8296, 19.1364] },
    { name: 'Powai lakeside', lngLat: [72.9075, 19.1195] },
    { name: 'Aarey Forest', lngLat: [72.8800, 19.1500] },
    { name: 'Kanheri trail', lngLat: [72.9051, 19.2054] },
    { name: 'Chembur', lngLat: [72.9005, 19.0522] },
  ] as CityAnchor[],
};
