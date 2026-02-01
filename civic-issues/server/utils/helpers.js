const { REPORT_STATUS, EMERGENCY_STATUS } = require('./constants');

/**
 * Sanitize user object (remove sensitive data)
 * @param {object} user - User object
 * @returns {object} - Sanitized user object
 */
const sanitizeUser = (user) => {
  const userObj = user.toObject ? user.toObject() : user;
  
  // Remove sensitive fields
  delete userObj.firebaseUid;
  delete userObj.__v;
  
  return userObj;
};

/**
 * Generate random string
 * @param {number} length - String length
 * @returns {string} - Random string
 */
const generateRandomString = (length = 10) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

/**
 * Format phone number
 * @param {string} phone - Phone number
 * @returns {string} - Formatted phone number
 */
const formatPhoneNumber = (phone) => {
  if (!phone) return null;
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Return formatted number
  return cleaned;
};

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} - Validation result
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number
 * @returns {boolean} - Validation result
 */
const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^[0-9]{10,15}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

/**
 * Validate GPS coordinates
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @returns {boolean} - Validation result
 */
const isValidCoordinates = (latitude, longitude) => {
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

/**
 * Calculate distance between two GPS coordinates (Haversine formula)
 * @param {number} lat1 - First point latitude
 * @param {number} lon1 - First point longitude
 * @param {number} lat2 - Second point latitude
 * @param {number} lon2 - Second point longitude
 * @returns {number} - Distance in kilometers
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
};

/**
 * Convert degrees to radians
 * @param {number} degrees - Degrees
 * @returns {number} - Radians
 */
const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Paginate query results
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {object} - Skip and limit values
 */
const getPagination = (page = 1, limit = 10) => {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const skip = (pageNum - 1) * limitNum;
  
  return {
    skip,
    limit: limitNum,
    page: pageNum,
  };
};

/**
 * Format pagination response
 * @param {number} total - Total items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {object} - Pagination metadata
 */
const getPaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};

/**
 * Validate report status transition
 * @param {string} currentStatus - Current status
 * @param {string} newStatus - New status
 * @returns {boolean} - Validation result
 */
const isValidStatusTransition = (currentStatus, newStatus) => {
  const validTransitions = {
    [REPORT_STATUS.SUBMITTED]: [
      REPORT_STATUS.IN_PROGRESS,
      REPORT_STATUS.REJECTED,
    ],
    [REPORT_STATUS.IN_PROGRESS]: [
      REPORT_STATUS.RESOLVED,
      REPORT_STATUS.REJECTED,
    ],
    [REPORT_STATUS.RESOLVED]: [], // Final state
    [REPORT_STATUS.REJECTED]: [], // Final state
  };
  
  return validTransitions[currentStatus]?.includes(newStatus) || false;
};

/**
 * Validate emergency status transition
 * @param {string} currentStatus - Current status
 * @param {string} newStatus - New status
 * @returns {boolean} - Validation result
 */
const isValidEmergencyStatusTransition = (currentStatus, newStatus) => {
  const validTransitions = {
    [EMERGENCY_STATUS.REPORTED]: [
      EMERGENCY_STATUS.RECEIVED,
    ],
    [EMERGENCY_STATUS.RECEIVED]: [
      EMERGENCY_STATUS.DISPATCHED,
    ],
    [EMERGENCY_STATUS.DISPATCHED]: [
      EMERGENCY_STATUS.RESOLVED,
    ],
    [EMERGENCY_STATUS.RESOLVED]: [], // Final state
  };
  
  return validTransitions[currentStatus]?.includes(newStatus) || false;
};

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Sleep/delay function
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} - Promise that resolves after delay
 */
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Get time difference in human-readable format
 * @param {Date} date - Date to compare
 * @returns {string} - Human-readable time difference
 */
const getTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval + ' year' + (interval > 1 ? 's' : '') + ' ago';
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval + ' month' + (interval > 1 ? 's' : '') + ' ago';
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + ' day' + (interval > 1 ? 's' : '') + ' ago';
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + ' hour' + (interval > 1 ? 's' : '') + ' ago';
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval + ' minute' + (interval > 1 ? 's' : '') + ' ago';
  
  return Math.floor(seconds) + ' second' + (Math.floor(seconds) > 1 ? 's' : '') + ' ago';
};

module.exports = {
  sanitizeUser,
  generateRandomString,
  formatPhoneNumber,
  isValidEmail,
  isValidPhoneNumber,
  isValidCoordinates,
  calculateDistance,
  getPagination,
  getPaginationMeta,
  isValidStatusTransition,
  isValidEmergencyStatusTransition,
  formatFileSize,
  sleep,
  getTimeAgo,
};