const axios = require('axios');
const logger = require('../utils/logger');

/**
 * Reverse geocode coordinates to address using Nominatim API
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @returns {Promise<string>} - Formatted address
 */
const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse`,
      {
        params: {
          lat: latitude,
          lon: longitude,
          format: 'json',
          addressdetails: 1,
        },
        headers: {
          'User-Agent': 'CivicIssuesApp/1.0',
        },
      }
    );

    if (response.data && response.data.display_name) {
      return response.data.display_name;
    }

    return null;
  } catch (error) {
    logger.warn(`Reverse geocoding failed: ${error.message}`);
    return null; // Don't fail the request if geocoding fails
  }
};

/**
 * Format coordinates for display
 * @param {Array<number>} coordinates - [longitude, latitude]
 * @returns {string} - Formatted coordinates
 */
const formatCoordinates = (coordinates) => {
  if (!coordinates || coordinates.length !== 2) {
    return 'Unknown location';
  }

  const [longitude, latitude] = coordinates;
  return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
};

/**
 * Validate coordinates
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @returns {boolean} - Valid or not
 */
const validateCoordinates = (latitude, longitude) => {
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  return (
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
};

module.exports = {
  reverseGeocode,
  formatCoordinates,
  validateCoordinates,
};