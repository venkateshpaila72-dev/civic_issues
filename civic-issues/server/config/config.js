require('dotenv').config();

/**
 * General Application Configuration
 * Centralized configuration for the entire application
 */

const config = {
  // Server Configuration
  server: {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
  },

  // Database Configuration
  database: {
    uri: process.env.MONGO_URI,
  },

  // Firebase Configuration
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY,
    projectId: process.env.FIREBASE_PROJECT_ID,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  },

  // Cloudinary Configuration
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    expire: process.env.JWT_EXPIRE || '7d',
  },

  // CORS Configuration
  /*cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  },*/

  // Rate Limiting Configuration
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },

  // File Upload Configuration
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
    maxFiles: parseInt(process.env.MAX_FILES) || 5,
  },

  // Pagination Configuration
  pagination: {
    defaultPage: 1,
    defaultLimit: 10,
    maxLimit: 100,
  },
};

/**
 * Validate required environment variables
 * @returns {object} - Validation result with status and missing fields
 */
const validateConfig = () => {
  const requiredEnvVars = [
    'MONGO_URI',
    'FIREBASE_API_KEY',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_AUTH_DOMAIN',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
  ];

  const missingVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingVars.length > 0) {
    return {
      isValid: false,
      missingVars,
      message: `Missing required environment variables: ${missingVars.join(', ')}`,
    };
  }

  return {
    isValid: true,
    missingVars: [],
    message: 'All required environment variables are present',
  };
};

module.exports = {
  config,
  validateConfig,
};