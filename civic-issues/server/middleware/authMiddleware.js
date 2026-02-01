const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {
  HTTP_STATUS,
  ERROR_MESSAGES,
  ACCOUNT_STATUS,
} = require('../utils/constants');
const logger = require('../utils/logger');
const { AppError } = require('./errorMiddleware');

/**
 * =====================================================
 * AUTHENTICATE (REQUIRED)
 * =====================================================
 * Verifies JWT token and attaches user to request
 *
 * Header:
 * Authorization: Bearer <JWT_TOKEN>
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(
        ERROR_MESSAGES.TOKEN_REQUIRED,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const token = authHeader.split('Bearer ')[1];

    if (!token) {
      throw new AppError(
        ERROR_MESSAGES.TOKEN_REQUIRED,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw new AppError(
        ERROR_MESSAGES.INVALID_TOKEN,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // decoded = { userId, role, iat, exp }
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new AppError(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    // Check account status
    if (user.accountStatus !== ACCOUNT_STATUS.ACTIVE) {
      throw new AppError(
        ERROR_MESSAGES.USER_INACTIVE,
        HTTP_STATUS.FORBIDDEN
      );
    }

    // Check soft delete
    if (user.isDeleted) {
      throw new AppError(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    // Attach user to request
    req.user = user;

    logger.auth('JWT verified', user.email, 'SUCCESS');

    next();
  } catch (error) {
    logger.auth(
      'JWT verification failed',
      req.headers.authorization || 'none',
      'FAILED'
    );

    if (error instanceof AppError) {
      return next(error);
    }

    next(
      new AppError(
        ERROR_MESSAGES.INVALID_TOKEN,
        HTTP_STATUS.UNAUTHORIZED
      )
    );
  }
};

/**
 * =====================================================
 * OPTIONAL AUTHENTICATE
 * =====================================================
 * Attaches user if token exists
 * Does NOT fail if token is missing or invalid
 */
const optionalAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      return next();
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return next();
    }

    const user = await User.findById(decoded.userId);

    if (
      user &&
      user.accountStatus === ACCOUNT_STATUS.ACTIVE &&
      !user.isDeleted
    ) {
      req.user = user;
    }

    next();
  } catch (error) {
    // Optional auth must NEVER block request
    next();
  }
};

/**
 * =====================================================
 * IS AUTHENTICATED
 * =====================================================
 * Simple guard: req.user must exist
 */
const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    throw new AppError(
      ERROR_MESSAGES.UNAUTHORIZED,
      HTTP_STATUS.UNAUTHORIZED
    );
  }

  next();
};

module.exports = {
  authenticate,
  optionalAuthenticate,
  isAuthenticated,
};
