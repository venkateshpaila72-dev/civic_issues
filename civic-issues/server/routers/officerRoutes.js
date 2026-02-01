const express = require('express');
const router = express.Router();

// Controllers
const {
  selectDepartment,
  getDepartmentReports,
  getReportById,
  updateReportStatus,
  rejectReport,
  getDashboardStats,
  getAllEmergencies,
  getProfile,
  updateProfile,
} = require('../controllers/officerController');

// Middleware
const { authenticate } = require('../middleware/authMiddleware');
const { isOfficer } = require('../middleware/roleMiddleware');
const { validateDepartmentSelection } = require('../middleware/departmentMiddleware');
const { asyncHandler } = require('../middleware/errorMiddleware');
const {
  uploadSingleImage,
  handleMulterError,
  uploadProfileImage,
} = require('../middleware/uploadMiddleware');
const {
  assignDepartmentValidation,
  updateReportStatusValidation,
  rejectReportValidation,
  updateProfileValidation,
  mongoIdValidation,
  validate,
} = require('../utils/validators');

/**
 * =====================================================
 * DEPARTMENT SELECTION (Option B - Your Choice)
 * =====================================================
 */

/**
 * @route   POST /api/officer/select-department
 * @desc    Select department for officer session
 * @access  Private/Officer
 */
router.post(
  '/select-department',
  authenticate,
  isOfficer,
  assignDepartmentValidation,
  validate,
  asyncHandler(selectDepartment)
);

/**
 * =====================================================
 * DASHBOARD
 * =====================================================
 */

/**
 * @route   GET /api/officer/dashboard
 * @desc    Get officer dashboard stats
 * @access  Private/Officer (requires X-Department-Id header)
 */
router.get(
  '/dashboard',
  authenticate,
  isOfficer,
  validateDepartmentSelection,
  asyncHandler(getDashboardStats)
);

/**
 * =====================================================
 * REPORT MANAGEMENT
 * =====================================================
 */

/**
 * @route   GET /api/officer/reports
 * @desc    Get department reports
 * @access  Private/Officer (requires X-Department-Id header)
 */
router.get(
  '/reports',
  authenticate,
  isOfficer,
  validateDepartmentSelection,
  asyncHandler(getDepartmentReports)
);

/**
 * @route   GET /api/officer/reports/:id
 * @desc    Get single report by ID
 * @access  Private/Officer
 */
router.get(
  '/reports/:id',
  authenticate,
  isOfficer,
  mongoIdValidation,
  validate,
  asyncHandler(getReportById)
);

/**
 * @route   PATCH /api/officer/reports/:id/status
 * @desc    Update report status
 * @access  Private/Officer
 */
router.patch(
  '/reports/:id/status',
  authenticate,
  isOfficer,
  mongoIdValidation,
  updateReportStatusValidation,
  validate,
  asyncHandler(updateReportStatus)
);

/**
 * @route   POST /api/officer/reports/:id/reject
 * @desc    Reject report with reason
 * @access  Private/Officer
 */
router.post(
  '/reports/:id/reject',
  authenticate,
  isOfficer,
  mongoIdValidation,
  rejectReportValidation,
  validate,
  asyncHandler(rejectReport)
);

/**
 * =====================================================
 * EMERGENCY MANAGEMENT
 * =====================================================
 */

/**
 * @route   GET /api/officer/emergencies
 * @desc    Get all emergencies (cross-department)
 * @access  Private/Officer
 */
router.get(
  '/emergencies',
  authenticate,
  isOfficer,
  asyncHandler(getAllEmergencies)
);

/**
 * =====================================================
 * PROFILE MANAGEMENT
 * =====================================================
 */

/**
 * @route   GET /api/officer/profile
 * @desc    Get officer profile
 * @access  Private/Officer
 */
router.get(
  '/profile',
  authenticate,
  isOfficer,
  asyncHandler(getProfile)
);

/**
 * @route   PUT /api/officer/profile
 * @desc    Update officer profile
 * @access  Private/Officer
 */
router.put(
  '/profile',
  authenticate,
  isOfficer,
  uploadProfileImage,
  handleMulterError,
  updateProfileValidation,
  validate,
  asyncHandler(updateProfile)
);

module.exports = router;