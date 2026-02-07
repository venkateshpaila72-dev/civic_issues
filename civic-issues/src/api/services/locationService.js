/**
 * Location service for geocoding and reverse geocoding.
 * Uses OpenStreetMap Nominatim API (no API key required).
 */

const NOMINATIM_URL = import.meta.env.VITE_NOMINATIM_API_URL || 'https://nominatim.openstreetmap.org';

/**
 * Reverse geocode: lat/lng → human-readable address
 */
export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await fetch(
      `${NOMINATIM_URL}/reverse?lat=${lat}&lon=${lng}&format=json`,
      {
        headers: {
          'Accept-Language': 'en',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Geocoding failed');
    }

    const data = await response.json();
    return data.display_name || null;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
};

/**
 * Forward geocode: address → lat/lng (if needed in future)
 */
export const forwardGeocode = async (address) => {
  try {
    const response = await fetch(
      `${NOMINATIM_URL}/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
      {
        headers: {
          'Accept-Language': 'en',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Geocoding failed');
    }

    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }
    return null;
  } catch (error) {
    console.error('Forward geocoding error:', error);
    return null;
  }
};