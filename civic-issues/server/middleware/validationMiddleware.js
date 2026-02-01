const { validationResult } = require('express-validator');
const { HTTP_STATUS } = require('../utils/constants');
const logger = require('../utils/logger');

/**
 * Validation Middleware
 * Checks for validation errors from express-validator
 */
const validationMiddleware = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => ({
      field: error.param || error.path,
      message: error.msg,
      value: error.value,
    }));

    logger.warn(`Validation failed for ${req.method} ${req.path}`);
    logger.debug(`Validation errors: ${JSON.stringify(errorMessages)}`);

    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Validation error',
      errors: errorMessages,
    });
  }

  next();
};

/**
 * Custom validation for specific fields
 */

/**
 * Validate GPS coordinates
 */
const validateCoordinates = (req, res, next) => {
  const { coordinates } = req.body.location || {};

  if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Invalid location coordinates format',
    });
  }

  const [longitude, latitude] = coordinates;

  // Validate longitude (-180 to 180)
  if (isNaN(longitude) || longitude < -180 || longitude > 180) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Longitude must be between -180 and 180',
    });
  }

  // Validate latitude (-90 to 90)
  if (isNaN(latitude) || latitude < -90 || latitude > 90) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Latitude must be between -90 and 90',
    });
  }

  next();
};

/**
 * Validate that at least one image is provided
 */
const validateImagesRequired = (req, res, next) => {
  if (!req.files || !req.files.images || req.files.images.length === 0) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'At least one image is required',
    });
  }

  next();
};

/**
 * Sanitize request body
 * Remove any undefined or null values
 */
const sanitizeBody = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] === undefined || req.body[key] === null) {
        delete req.body[key];
      }
    });
  }

  next();
};

/**
 * Rebuild multipart nested fields
 * Converts:
 *  location[coordinates][0]
 *  location[coordinates][1]
 * Into:
 *  location: { coordinates: [lng, lat] }
 */
const rebuildMultipartFields = (req, res, next) => {

  // Build location object
  if (
    req.body["location[coordinates][0]"] &&
    req.body["location[coordinates][1]"]
  ) {
    req.body.location = {
      coordinates: [
        Number(req.body["location[coordinates][0]"]),
        Number(req.body["location[coordinates][1]"])
      ]
    };
  }

  next();
};


module.exports = {
  validationMiddleware,
  validateCoordinates,
  validateImagesRequired,
  sanitizeBody,
  rebuildMultipartFields
};
