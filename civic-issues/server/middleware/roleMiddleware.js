const { USER_ROLES, HTTP_STATUS, ERROR_MESSAGES } = require('../utils/constants');
const { AppError } = require('./errorMiddleware');
const logger = require('../utils/logger');

/**
 * Role-based Access Control Middleware
 */

/**
 * Check if user has required role(s)
 * @param {string|Array} allowedRoles - Single role or array of allowed roles
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
    }

    // Check if user role is in allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      logger.warn(
        `Access denied for user ${req.user.email} with role ${req.user.role}. Required: ${allowedRoles.join(', ')}`
      );
      
      throw new AppError(ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN);
    }

    logger.debug(`Access granted for ${req.user.role}: ${req.user.email}`);
    next();
  };
};

/**
 * Check if user is a citizen
 */
const isCitizen = (req, res, next) => {
  if (!req.user) {
    throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
  }

  if (req.user.role !== USER_ROLES.CITIZEN) {
    throw new AppError(ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN);
  }

  next();
};

/**
 * Check if user is an officer
 */
const isOfficer = (req, res, next) => {
  if (!req.user) {
    throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
  }

  if (req.user.role !== USER_ROLES.OFFICER) {
    throw new AppError(ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN);
  }

  next();
};

/**
 * Check if user is an admin
 */
const isAdmin = (req, res, next) => {
  if (!req.user) {
    throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
  }

  if (req.user.role !== USER_ROLES.ADMIN) {
    throw new AppError(ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN);
  }

  next();
};

/**
 * Check if user is either officer or admin
 */
const isOfficerOrAdmin = (req, res, next) => {
  if (!req.user) {
    throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
  }

  const allowedRoles = [USER_ROLES.OFFICER, USER_ROLES.ADMIN];

  if (!allowedRoles.includes(req.user.role)) {
    throw new AppError(ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN);
  }

  next();
};

/**
 * Check if user owns the resource (for citizens)
 * Validates that req.params.id or req.body.citizenId matches req.user._id
 */
const isResourceOwner = (req, res, next) => {
  if (!req.user) {
    throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
  }

  // Get resource ID from params or body
  const resourceUserId = req.params.userId || req.body.citizenId || req.params.id;

  if (!resourceUserId) {
    throw new AppError('Resource ID not found', HTTP_STATUS.BAD_REQUEST);
  }

  // Check if user owns the resource
  if (req.user._id.toString() !== resourceUserId.toString()) {
    logger.warn(
      `User ${req.user.email} attempted to access resource owned by ${resourceUserId}`
    );
    
    throw new AppError(ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN);
  }

  next();
};

/**
 * Check if user is active
 */
const isActiveUser = (req, res, next) => {
  if (!req.user) {
    throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
  }

  if (!req.user.isActive()) {
    throw new AppError(ERROR_MESSAGES.USER_INACTIVE, HTTP_STATUS.FORBIDDEN);
  }

  next();
};

module.exports = {
  authorize,
  isCitizen,
  isOfficer,
  isAdmin,
  isOfficerOrAdmin,
  isResourceOwner,
  isActiveUser,
};