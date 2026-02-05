import L from 'leaflet';

/* ─── Default map config (from .env, with fallbacks) ─── */
export const MAP_CONFIG = {
  tileURL:     import.meta.env.VITE_MAP_TILE_URL     || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: import.meta.env.VITE_MAP_ATTRIBUTION  || '© OpenStreetMap contributors',
  defaultLat:  parseFloat(import.meta.env.VITE_MAP_DEFAULT_LAT)  || 17.385,   // Hyderabad
  defaultLng:  parseFloat(import.meta.env.VITE_MAP_DEFAULT_LNG)  || 78.4867,
  defaultZoom: parseInt(import.meta.env.VITE_MAP_DEFAULT_ZOOM, 10) || 13,
  minZoom:     parseInt(import.meta.env.VITE_MAP_MIN_ZOOM,     10) || 3,
  maxZoom:     parseInt(import.meta.env.VITE_MAP_MAX_ZOOM,     10) || 19,
};

/** Default centre as [lat, lng] — react-leaflet uses this order */
export const DEFAULT_CENTER = [MAP_CONFIG.defaultLat, MAP_CONFIG.defaultLng];

/* ─── GeoJSON ↔ [lat, lng] conversions ─── */

/**
 * Backend stores GeoJSON: { type: 'Point', coordinates: [lng, lat] }
 * React-Leaflet needs [lat, lng].
 */
export const geoToLatLng = (geoPoint) => {
  if (!geoPoint?.coordinates) return DEFAULT_CENTER;
  return [geoPoint.coordinates[1], geoPoint.coordinates[0]];
};

/**
 * [lat, lng] → GeoJSON point object
 */
export const latLngToGeo = (lat, lng) => ({
  type: 'Point',
  coordinates: [lng, lat],  // GeoJSON = [longitude, latitude]
});

/* ─── Custom Leaflet icons ─── */

const iconBase = {
  iconSize:    [30, 40],
  iconAnchor:  [15, 40],
  popupAnchor: [0, -35],
};

/** Default blue marker icon */
export const defaultIcon = L.divIcon({
  ...iconBase,
  className: '',
  html: `<svg width="30" height="40" viewBox="0 0 30 40" fill="none">
    <path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 15 25 15 25s15-14.5 15-25C30 6.7 23.3 0 15 0z" fill="#2563eb"/>
    <circle cx="15" cy="15" r="6" fill="white"/>
  </svg>`,
});

/** Red marker — for emergencies */
export const emergencyIcon = L.divIcon({
  ...iconBase,
  className: '',
  html: `<svg width="30" height="40" viewBox="0 0 30 40" fill="none">
    <path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 15 25 15 25s15-14.5 15-25C30 6.7 23.3 0 15 0z" fill="#dc2626"/>
    <circle cx="15" cy="15" r="6" fill="white"/>
  </svg>`,
});

/** Green marker — resolved reports */
export const resolvedIcon = L.divIcon({
  ...iconBase,
  className: '',
  html: `<svg width="30" height="40" viewBox="0 0 30 40" fill="none">
    <path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 15 25 15 25s15-14.5 15-25C30 6.7 23.3 0 15 0z" fill="#16a34a"/>
    <circle cx="15" cy="15" r="6" fill="white"/>
  </svg>`,
});

/** Amber marker — in-progress reports */
export const inProgressIcon = L.divIcon({
  ...iconBase,
  className: '',
  html: `<svg width="30" height="40" viewBox="0 0 30 40" fill="none">
    <path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 15 25 15 25s15-14.5 15-25C30 6.7 23.3 0 15 0z" fill="#d97706"/>
    <circle cx="15" cy="15" r="6" fill="white"/>
  </svg>`,
});

/** Pick the right icon by report status string */
export const getReportIcon = (status) => {
  switch (status) {
    case 'resolved':    return resolvedIcon;
    case 'in_progress': return inProgressIcon;
    case 'rejected':    return emergencyIcon;   // red
    default:            return defaultIcon;     // submitted → blue
  }
};

/* ─── Nominatim reverse geocoding ─── */
const NOMINATIM_URL = import.meta.env.VITE_NOMINATIM_API_URL || 'https://nominatim.openstreetmap.org';

/**
 * Given lat/lng, returns a readable address string (or null on failure).
 */
export const reverseGeocode = async (lat, lng) => {
  try {
    const res = await fetch(
      `${NOMINATIM_URL}/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    return data?.displayname || null;
  } catch {
    return null;
  }
};