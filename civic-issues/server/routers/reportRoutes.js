const express = require('express');
const router = express.Router();

// Controllers
const {
  getReportById,
  getAllReports,
  getReportStatistics,
  getNearbyReports,
} = require('../controllers/reportController');

// Middleware
const { authenticate } = require('../middleware/authMiddleware');
const { isOfficerOrAdmin } = require('../middleware/roleMiddleware');
const { asyncHandler } = require('../middleware/errorMiddleware');
const {
  mongoIdValidation,
  validate,
} = require('../utils/validators');

/**
 * =====================================================
 * REPORT STATISTICS (OFFICER/ADMIN ONLY)
 * =====================================================
 */

/**
 * @route   GET /api/reports/statistics
 * @desc    Get report statistics
 * @access  Private/Officer/Admin
 */
router.get(
  '/statistics',
  authenticate,
  isOfficerOrAdmin,
  asyncHandler(getReportStatistics)
);

/**
 * =====================================================
 * NEARBY REPORTS (GEOSPATIAL QUERY)
 * =====================================================
 */

/**
 * @route   GET /api/reports/nearby
 * @desc    Get nearby reports based on GPS coordinates
 * @access  Private (All roles)
 */
router.get(
  '/nearby',
  authenticate,
  asyncHandler(getNearbyReports)
);

/**
 * =====================================================
 * REPORT LISTING & VIEWING (ROLE-BASED)
 * =====================================================
 */

/**
 * @route   GET /api/reports
 * @desc    Get all reports with filters (role-based access)
 * @access  Private (Citizen sees own, Officer sees dept, Admin sees all)
 */
router.get(
  '/',
  authenticate,
  asyncHandler(getAllReports)
);

/**
 * @route   GET /api/reports/:id
 * @desc    Get single report by ID (role-based access)
 * @access  Private (Citizen sees own, Officer sees dept, Admin sees all)
 */
router.get(
  '/:id',
  authenticate,
  mongoIdValidation,
  validate,
  asyncHandler(getReportById)
);

module.exports = router;