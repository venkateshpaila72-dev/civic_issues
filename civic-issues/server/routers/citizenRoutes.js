const express = require('express');
const router = express.Router();
const { rebuildMultipartFields } = require('../middleware/validationMiddleware');

// ============================
// Controllers
// ============================
console.log("CITIZEN ROUTES LOADED");


const {
  createReport,
  getMyReports,
  getReportById,
  getProfile,
  updateProfile,
  getDashboardStats,
} = require('../controllers/citizenController');

// ============================
// Middleware
// ============================
const { authenticate } = require('../middleware/authMiddleware');
const { isCitizen } = require('../middleware/roleMiddleware');
const { asyncHandler } = require('../middleware/errorMiddleware');

const {
  uploadMultiple,
  validateUploadedFiles,
  requireImages,
  handleMulterError,
  uploadProfileImage,
} = require('../middleware/uploadMiddleware');

const {
  createReportValidation,
  updateProfileValidation,
  mongoIdValidation,
  validate,
} = require('../utils/validators');

// =====================================================
// NORMALIZE MULTIPART BODY (IMPORTANT)
// =====================================================
const normalizeReportBody = (req, res, next) => {
  try {
    // Convert coordinates to numbers
    if (req.body?.location?.coordinates) {
      req.body.location.coordinates = [
        Number(req.body.location.coordinates[0]),
        Number(req.body.location.coordinates[1]),
      ];
    }

    next();
  } catch (err) {
    next(err);
  }
};

// =====================================================
// DASHBOARD
// =====================================================

router.get(
  '/dashboard',
  authenticate,
  isCitizen,
  asyncHandler(getDashboardStats)
);

// =====================================================
// REPORT MANAGEMENT
// =====================================================

/**
 * Create new civic issue report
 */
router.post(
  '/reports',
  authenticate,
  isCitizen,

  uploadMultiple,
  handleMulterError,
  validateUploadedFiles,

  rebuildMultipartFields, 

  requireImages,
  createReportValidation,
  validate,
  asyncHandler(createReport)
);


/**
 * Get my reports
 */
router.get(
  '/reports',
  authenticate,
  isCitizen,
  asyncHandler(getMyReports)
);

/**
 * Get report by ID
 */
router.get(
  '/reports/:id',
  authenticate,
  isCitizen,
  mongoIdValidation,
  validate,
  asyncHandler(getReportById)
);

// =====================================================
// PROFILE MANAGEMENT
// =====================================================

/**
 * Get citizen profile
 */
router.get(
  '/profile',
  authenticate,
  isCitizen,
  asyncHandler(getProfile)
);

/**
 * Update profile
 */
router.put(
  '/profile',
  authenticate,
  isCitizen,

  uploadProfileImage,
  handleMulterError,

  updateProfileValidation,
  validate,

  asyncHandler(updateProfile)
);

module.exports = router;
