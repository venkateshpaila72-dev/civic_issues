const cloudinary = require('cloudinary').v2;
const logger = require('../utils/logger');

/**
 * Cloudinary Configuration
 * Used for uploading images, videos, and audio files
 */

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Use HTTPS
});

/**
 * Validate Cloudinary configuration
 * @returns {boolean} - Configuration validity
 */
const validateCloudinaryConfig = () => {
  const config = cloudinary.config();
  const requiredFields = ['cloud_name', 'api_key', 'api_secret'];
  const missingFields = [];

  requiredFields.forEach((field) => {
    if (!config[field]) {
      missingFields.push(field);
    }
  });

  if (missingFields.length > 0) {
    logger.error(`Missing Cloudinary configuration: ${missingFields.join(', ')}`);
    return false;
  }

  logger.info('Cloudinary configuration validated successfully');
  logger.info(`Cloudinary Cloud Name: ${config.cloud_name}`);
  return true;
};

/**
 * Test Cloudinary connection
 * @returns {Promise<boolean>} - Connection status
 */
const testCloudinaryConnection = async () => {
  try {
    await cloudinary.api.ping();
    logger.info('Cloudinary connection successful');
    return true;
  } catch (error) {
    logger.error(`Cloudinary connection failed: ${error.message}`);
    return false;
  }
};

module.exports = {
  cloudinary,
  validateCloudinaryConfig,
  testCloudinaryConnection,
};