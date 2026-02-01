require('dotenv').config();
// 🔴 Force model registration
require('./models/User');
require('./models/Department');

const app = require('./app');
const connectDB = require('./config/database');
const logger = require('./utils/logger');
const { validateConfig } = require('./config/config');
const { validateFirebaseConfig } = require('./config/firebase');
const { validateCloudinaryConfig, testCloudinaryConnection } = require('./config/cloudinary');

const PORT = process.env.PORT || 5000;

/**
 * Start the server
 */
const startServer = async () => {
  try {
    // Validate environment configuration
    logger.info('Validating environment configuration...');
    const configValidation = validateConfig();
    
    if (!configValidation.isValid) {
      logger.error(configValidation.message);
      process.exit(1);
    }
    
    logger.success('Environment configuration validated');

    // Validate Firebase configuration
    logger.info('Validating Firebase configuration...');
    if (!validateFirebaseConfig()) {
      logger.error('Firebase configuration validation failed');
      process.exit(1);
    }
    logger.success('Firebase configuration validated');

    // Validate Cloudinary configuration
    logger.info('Validating Cloudinary configuration...');
    if (!validateCloudinaryConfig()) {
      logger.error('Cloudinary configuration validation failed');
      process.exit(1);
    }
    logger.success('Cloudinary configuration validated');

    // Connect to MongoDB
    logger.info('Connecting to MongoDB...');
    await connectDB();
    logger.success('MongoDB connected successfully');

    // Test Cloudinary connection (optional, can be commented out)
    logger.info('Testing Cloudinary connection...');
    const cloudinaryConnected = await testCloudinaryConnection();
    if (cloudinaryConnected) {
      logger.success('Cloudinary connection successful');
    } else {
      logger.warn('Cloudinary connection test failed, but continuing...');
    }

    // Start Express server
    const server = app.listen(PORT, () => {
      logger.success(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      logger.info(`API Base URL: http://localhost:${PORT}/api`);
      logger.info('Press CTRL+C to stop the server');
    });

    // Graceful shutdown handling
    const gracefulShutdown = (signal) => {
      logger.warn(`${signal} signal received: closing HTTP server`);
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    logger.error(error.stack);
    process.exit(1);
  }
};

// Start the server
startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Promise Rejection: ${err.message}`);
  logger.error(err.stack);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  logger.error(err.stack);
  process.exit(1);
});