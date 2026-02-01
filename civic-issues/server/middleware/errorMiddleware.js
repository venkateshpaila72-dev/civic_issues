const logger = require('../utils/logger');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../utils/constants');
const { config } = require('../config/config');

/**
 * Custom Error Class
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error Handler Middleware
 * Centralized error handling for the entire application
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;

  // Log error
  logger.error(`Error: ${error.message}`);
  
  if (config.server.isDevelopment) {
    logger.error(`Stack: ${err.stack}`);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error.message = 'Resource not found';
    error.statusCode = HTTP_STATUS.NOT_FOUND;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    error.message = `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' already exists`;
    error.statusCode = HTTP_STATUS.CONFLICT;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    error.message = errors.join(', ');
    error.statusCode = HTTP_STATUS.BAD_REQUEST;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = ERROR_MESSAGES.INVALID_TOKEN;
    error.statusCode = HTTP_STATUS.UNAUTHORIZED;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token has expired';
    error.statusCode = HTTP_STATUS.UNAUTHORIZED;
  }

  // Firebase auth errors
  if (err.message && err.message.includes('INVALID_ID_TOKEN')) {
    error.message = ERROR_MESSAGES.INVALID_TOKEN;
    error.statusCode = HTTP_STATUS.UNAUTHORIZED;
  }

  if (err.message && err.message.includes('TOKEN_EXPIRED')) {
    error.message = 'Token has expired';
    error.statusCode = HTTP_STATUS.UNAUTHORIZED;
  }

  // Send response
  res.status(error.statusCode).json({
    success: false,
    message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    ...(config.server.isDevelopment && {
      error: err,
      stack: err.stack,
    }),
  });
};

/**
 * Not Found Handler
 */
const notFound = (req, res, next) => {
  const error = new AppError(
    `Route not found - ${req.originalUrl}`,
    HTTP_STATUS.NOT_FOUND
  );
  next(error);
};

/**
 * Async Handler Wrapper
 * Wraps async route handlers to catch errors
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  AppError,
  errorHandler,
  notFound,
  asyncHandler,
};