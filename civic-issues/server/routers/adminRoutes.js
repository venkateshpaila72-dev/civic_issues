const express = require('express');
const router = express.Router();

// Controllers
const {
  createOfficer,
  getAllOfficers,
  getOfficerById,
  updateOfficer,
  updateOfficerStatus,
  assignDepartment,
  removeDepartment,
  getAllReports,
  getAllEmergencies,
  deleteOfficer,
  getAdminDashboard,
} = require('../controllers/adminController');

// Middleware
const { authenticate } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');
const { asyncHandler } = require('../middleware/errorMiddleware');
const {
  createOfficerValidation,
  assignDepartmentValidation,
  mongoIdValidation,
  validate,
} = require('../utils/validators');

/**
 * =====================================================
 * OFFICER MANAGEMENT
 * =====================================================
 */

/**
 * @route   POST /api/admin/officers
 * @desc    Create new officer
 * @access  Private/Admin
 */
router.post(
  '/officers',
  authenticate,
  isAdmin,
  createOfficerValidation,
  validate,
  asyncHandler(createOfficer)
);

/**
 * @route   GET /api/admin/officers
 * @desc    Get all officers (with filters and pagination)
 * @access  Private/Admin
 */
router.get(
  '/officers',
  authenticate,
  isAdmin,
  asyncHandler(getAllOfficers)
);

/**
 * @route   GET /api/admin/officers/:id
 * @desc    Get single officer by ID
 * @access  Private/Admin
 */
router.get(
  '/officers/:id',
  authenticate,
  isAdmin,
  mongoIdValidation,
  validate,
  asyncHandler(getOfficerById)
);

/**
 * @route   PUT /api/admin/officers/:id
 * @desc    Update officer details
 * @access  Private/Admin
 */
router.put(
  '/officers/:id',
  authenticate,
  isAdmin,
  mongoIdValidation,
  validate,
  asyncHandler(updateOfficer)
);

/**
 * @route   PATCH /api/admin/officers/:id/status
 * @desc    Update officer account status
 * @access  Private/Admin
 */
router.patch(
  '/officers/:id/status',
  authenticate,
  isAdmin,
  mongoIdValidation,
  validate,
  asyncHandler(updateOfficerStatus)
);

/**
 * @route   DELETE /api/admin/officers/:id
 * @desc    Delete officer (soft delete)
 * @access  Private/Admin
 */
router.delete(
  '/officers/:id',
  authenticate,
  isAdmin,
  mongoIdValidation,
  validate,
  asyncHandler(deleteOfficer)
);

/**
 * =====================================================
 * DEPARTMENT ASSIGNMENT
 * =====================================================
 */

/**
 * @route   POST /api/admin/officers/:id/departments
 * @desc    Assign department to officer
 * @access  Private/Admin
 */
router.post(
  '/officers/:id/departments',
  authenticate,
  isAdmin,
  mongoIdValidation,
  assignDepartmentValidation,
  validate,
  asyncHandler(assignDepartment)
);

/**
 * @route   DELETE /api/admin/officers/:id/departments/:deptId
 * @desc    Remove department from officer
 * @access  Private/Admin
 */
router.delete(
  '/officers/:id/departments/:deptId',
  authenticate,
  isAdmin,
  asyncHandler(removeDepartment)
);

/**
 * =====================================================
 * AUDIT & OVERSIGHT
 * =====================================================
 */

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get admin dashboard stats
 * @access  Private/Admin
 */
router.get(
  '/dashboard',
  authenticate,
  isAdmin,
  asyncHandler(getAdminDashboard)
);

/**
 * @route   GET /api/admin/reports
 * @desc    Get all reports (audit view)
 * @access  Private/Admin
 */
router.get(
  '/reports',
  authenticate,
  isAdmin,
  asyncHandler(getAllReports)
);

/**
 * @route   GET /api/admin/emergencies
 * @desc    Get all emergencies (oversight view)
 * @access  Private/Admin
 */
router.get(
  '/emergencies',
  authenticate,
  isAdmin,
  asyncHandler(getAllEmergencies)
);

module.exports = router;