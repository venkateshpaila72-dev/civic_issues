const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { config } = require('./config/config');
const logger = require('./utils/logger');
const { HTTP_STATUS, ERROR_MESSAGES } = require('./utils/constants');

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors());

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP request logging (only in development)
if (config.server.isDevelopment) {
  app.use(
    morgan('dev', {
      stream: {
        write: (message) => logger.info(message.trim()),
      },
    })
  );
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    environment: config.server.nodeEnv,
  });
});

// API base endpoint
app.get('/api', (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Civic Issues Reporting & Emergency Management API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      citizen: '/api/citizen',
      officer: '/api/officer',
      admin: '/api/admin',
      reports: '/api/reports',
      departments: '/api/departments',
      emergency: '/api/emergency',
    },
  });
});

// Routes
app.use('/api/auth', require('./routers/authRoutes'));
app.use('/api/departments', require('./routers/departmentRoutes'));
app.use('/api/admin', require('./routers/adminRoutes'));
app.use('/api/officer', require('./routers/officerRoutes'));
app.use('/api/citizen', require('./routers/citizenRoutes'));
app.use('/api/emergency', require('./routers/emergencyRoutes'));
app.use('/api/reports', require('./routers/reportRoutes'));

// Import error middleware
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// 404 handler - Route not found
app.use(notFound);

// Global error handler
app.use(errorHandler);

module.exports = app;