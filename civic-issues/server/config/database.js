const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const options = {
      // Modern connection options
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
      // Connection pool settings
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
      
      // Automatic reconnection
      retryWrites: true,
      retryReads: true,
    };

    const conn = await mongoose.connect(process.env.MONGO_URI, options);

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    logger.info(`Database Name: ${conn.connection.name}`);

    // Connection event listeners
    mongoose.connection.on('connected', () => {
      logger.info('Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      logger.error(`Mongoose connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('Mongoose disconnected from MongoDB');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('Mongoose connection closed due to app termination');
      process.exit(0);
    });

  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error.message}`);
    logger.error(`Stack Trace: ${error.stack}`);
    process.exit(1);
  }
};

module.exports = connectDB;