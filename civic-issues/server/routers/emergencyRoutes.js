const express = require('express');
const router = express.Router();

// Controllers
const {
  createEmergency,
  getMyEmergencies,
  getEmergencyById,
  updateEmergencyStatus,
  getActiveEmergencies,
} = require('../controllers/emergencyController');

// Middleware
const { authenticate } = require('../middleware/authMiddleware');
const { isCitizen, isOfficerOrAdmin } = require('../middleware/roleMiddleware');
const { asyncHandler } = require('../middleware/errorMiddleware');
const {
  uploadMultiple,
  validateUploadedFiles,
  handleMulterError,
} = require('../middleware/uploadMiddleware');
const {
  createEmergencyValidation,
  updateEmergencyStatusValidation,
  mongoIdValidation,
  validate,
} = require('../utils/validators');

/**
 * =====================================================
 * EMERGENCY CREATION (CITIZEN)
 * =====================================================
 */

/**
 * @route   POST /api/emergency
 * @desc    Create new emergency
 * @access  Private/Citizen
 */
router.post(
  '/',
  authenticate,
  isCitizen,
  uploadMultiple,
  handleMulterError,
  validateUploadedFiles,
  createEmergencyValidation,
  validate,
  asyncHandler(createEmergency)
);

/**
 * @route   GET /api/emergency/my-emergencies
 * @desc    Get citizen's emergencies
 * @access  Private/Citizen
 */
router.get(
  '/my-emergencies',
  authenticate,
  isCitizen,
  asyncHandler(getMyEmergencies)
);

/**
 * =====================================================
 * EMERGENCY VIEWING (ALL ROLES)
 * =====================================================
 */

/**
 * @route   GET /api/emergency/active
 * @desc    Get all active emergencies
 * @access  Private/Officer/Admin
 */
router.get(
  '/active',
  authenticate,
  isOfficerOrAdmin,
  asyncHandler(getActiveEmergencies)
);

/**
 * @route   GET /api/emergency/:id
 * @desc    Get single emergency by ID
 * @access  Private (Citizen/Officer/Admin)
 */
router.get(
  '/:id',
  authenticate,
  mongoIdValidation,
  validate,
  asyncHandler(getEmergencyById)
);

/**
 * =====================================================
 * EMERGENCY STATUS UPDATE (OFFICER)
 * =====================================================
 */

/**
 * @route   PATCH /api/emergency/:id/status
 * @desc    Update emergency status
 * @access  Private/Officer
 */
router.patch(
  '/:id/status',
  authenticate,
  isOfficerOrAdmin,
  mongoIdValidation,
  updateEmergencyStatusValidation,
  validate,
  asyncHandler(updateEmergencyStatus)
);

module.exports = router;