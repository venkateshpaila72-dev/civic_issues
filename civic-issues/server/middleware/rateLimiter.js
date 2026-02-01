const rateLimit = require('express-rate-limit');
const { HTTP_STATUS } = require('../utils/constants');
const { config } = require('../config/config');
const logger = require('../utils/logger');

/**
 * Rate Limiter Configuration
 */

/**
 * General API Rate Limiter
 * Applied to all API routes
 */
const generalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs, // 15 minutes
  max: config.rateLimit.maxRequests, // 100 requests per window
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      success: false,
      message: 'Too many requests from this IP, please try again later.',
    });
  },
});

/**
 * Auth Rate Limiter (stricter)
 * Applied to authentication routes (login, register)
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
  },
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
  handler: (req, res) => {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`);
    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      success: false,
      message: 'Too many authentication attempts, please try again after 15 minutes.',
    });
  },
});

/**
 * Report Creation Rate Limiter
 * Prevent spam report creation
 */
const reportCreationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 reports per hour
  message: {
    success: false,
    message: 'Too many reports created, please try again later.',
  },
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use user ID instead of IP for authenticated users
    return req.user ? req.user._id.toString() : req.ip;
  },
  handler: (req, res) => {
    logger.warn(
      `Report creation rate limit exceeded for user: ${req.user?.email || req.ip}`
    );
    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      success: false,
      message: 'You have created too many reports. Please try again later.',
    });
  },
});

/**
 * Emergency Creation Rate Limiter
 * More lenient than reports (emergencies are urgent)
 */
const emergencyCreationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 emergencies per hour
  message: {
    success: false,
    message: 'Too many emergency reports, please try again later.',
  },
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user ? req.user._id.toString() : req.ip;
  },
  handler: (req, res) => {
    logger.warn(
      `Emergency creation rate limit exceeded for user: ${req.user?.email || req.ip}`
    );
    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      success: false,
      message: 'Too many emergency reports. If this is urgent, please call emergency services.',
    });
  },
});

/**
 * File Upload Rate Limiter
 * Prevent excessive file uploads
 */
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 uploads per hour
  message: {
    success: false,
    message: 'Too many file uploads, please try again later.',
  },
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user ? req.user._id.toString() : req.ip;
  },
  handler: (req, res) => {
    logger.warn(
      `Upload rate limit exceeded for user: ${req.user?.email || req.ip}`
    );
    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      success: false,
      message: 'Too many file uploads. Please try again later.',
    });
  },
});

/**
 * Admin Operations Rate Limiter
 * Prevent excessive admin operations
 */
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests per window (higher for admin)
  message: {
    success: false,
    message: 'Too many admin operations, please try again later.',
  },
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user ? req.user._id.toString() : req.ip;
  },
});

/**
 * Custom Rate Limiter
 * Create custom rate limiter with specific settings
 */
const customLimiter = (windowMs, max, message = 'Too many requests') => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message,
    },
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
    standardHeaders: true,
    legacyHeaders: false,
  });
};

module.exports = {
  generalLimiter,
  authLimiter,
  reportCreationLimiter,
  emergencyCreationLimiter,
  uploadLimiter,
  adminLimiter,
  customLimiter,
};