const { body, param, query, validationResult } = require('express-validator');
const {
  USER_ROLES,
  REPORT_STATUS,
  EMERGENCY_TYPES,
  EMERGENCY_STATUS,
} = require('./constants');

/**
 * Validation Rules
 */

// Auth Validation
const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('idToken')
    .notEmpty()
    .withMessage('Firebase ID token is required'),
];

// User Validation
const updateProfileValidation = [
  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  body('phoneNumber')
    .optional()
    .matches(/^[0-9]{10,15}$/)
    .withMessage('Phone number must be 10-15 digits'),
  body('address.street')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Street address too long'),
  body('address.city')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('City name too long'),
  body('address.state')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('State name too long'),
  body('address.pincode')
    .optional()
    .matches(/^[0-9]{5,10}$/)
    .withMessage('Invalid pincode format'),
];

// Department Validation
const createDepartmentValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Department name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Department name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('contactEmail')
    .optional()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('contactPhone')
    .optional()
    .matches(/^[0-9]{10,15}$/)
    .withMessage('Phone number must be 10-15 digits'),
];

const updateDepartmentValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Department name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('contactEmail')
    .optional()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('contactPhone')
    .optional()
    .matches(/^[0-9]{10,15}$/)
    .withMessage('Phone number must be 10-15 digits'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
];

// Report Validation
const createReportValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Report title is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Report description is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('department')
    .notEmpty()
    .withMessage('Department is required')
    .isMongoId()
    .withMessage('Invalid department ID'),
  body('location.coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('Location coordinates must be an array of [longitude, latitude]'),
  body('location.coordinates.*')
    .isFloat()
    .withMessage('Coordinates must be numbers'),
  body('location.address')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Address too long'),
  body('location.landmark')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Landmark too long'),
];

const updateReportStatusValidation = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(Object.values(REPORT_STATUS))
    .withMessage('Invalid status value'),
  body('remarks')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Remarks cannot exceed 500 characters'),
];

const rejectReportValidation = [
  body('rejectionReason')
    .trim()
    .notEmpty()
    .withMessage('Rejection reason is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Rejection reason must be between 10 and 500 characters'),
];

// Emergency Validation
const createEmergencyValidation = [
  body('type')
    .notEmpty()
    .withMessage('Emergency type is required')
    .isIn(Object.values(EMERGENCY_TYPES))
    .withMessage('Invalid emergency type'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Emergency title is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Emergency description is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('contactNumber')
    .notEmpty()
    .withMessage('Contact number is required')
    .matches(/^[0-9]{10,15}$/)
    .withMessage('Contact number must be 10-15 digits'),
  body('location.coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('Location coordinates must be an array of [longitude, latitude]'),
  body('location.coordinates.*')
    .isFloat()
    .withMessage('Coordinates must be numbers'),
  body('location.address')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Address too long'),
  body('location.landmark')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Landmark too long'),
];

const updateEmergencyStatusValidation = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(Object.values(EMERGENCY_STATUS))
    .withMessage('Invalid status value'),
  body('remarks')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Remarks cannot exceed 500 characters'),
];

// Officer Validation
const createOfficerValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  body('phoneNumber')
    .optional()
    .matches(/^[0-9]{10,15}$/)
    .withMessage('Phone number must be 10-15 digits'),
  body('departments')
    .optional()
    .isArray()
    .withMessage('Departments must be an array'),
  body('departments.*')
    .optional()
    .isMongoId()
    .withMessage('Invalid department ID'),
];

const assignDepartmentValidation = [
  body('departmentId')
    .notEmpty()
    .withMessage('Department ID is required')
    .isMongoId()
    .withMessage('Invalid department ID'),
];

// Param Validation
const mongoIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
];

const departmentIdParamValidation = [
  param('departmentId')
    .isMongoId()
    .withMessage('Invalid department ID format'),
];

// Query Validation
const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];

const statusFilterValidation = [
  query('status')
    .optional()
    .isIn(Object.values(REPORT_STATUS))
    .withMessage('Invalid status value'),
];

/**
 * Validation Result Handler
 * Checks for validation errors and returns them
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => ({
      field: error.param,
      message: error.msg,
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errorMessages,
    });
  }

  next();
};

module.exports = {
  // Auth
  registerValidation,
  loginValidation,

  // User
  updateProfileValidation,

  // Department
  createDepartmentValidation,
  updateDepartmentValidation,

  // Report
  createReportValidation,
  updateReportStatusValidation,
  rejectReportValidation,

  // Emergency
  createEmergencyValidation,
  updateEmergencyStatusValidation,

  // Officer
  createOfficerValidation,
  assignDepartmentValidation,

  // Param
  mongoIdValidation,
  departmentIdParamValidation,

  // Query
  paginationValidation,
  statusFilterValidation,

  // Handler
  validate,
};