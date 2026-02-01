const express = require('express');
const router = express.Router();

// Controllers
const {
  createDepartment,
  getAllDepartments,
  getActiveDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  toggleDepartmentStatus,
  getDepartmentStats,
} = require('../controllers/departmentController');

// Middleware
const { authenticate } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');
const { asyncHandler } = require('../middleware/errorMiddleware');
const {
  createDepartmentValidation,
  updateDepartmentValidation,
  mongoIdValidation,
  validate,
} = require('../utils/validators');

/**
 * @route   POST /api/departments
 * @desc    Create new department
 * @access  Private/Admin
 */
router.post(
  '/',
  authenticate,
  isAdmin,
  createDepartmentValidation,
  validate,
  asyncHandler(createDepartment)
);

/**
 * @route   GET /api/departments
 * @desc    Get all departments (with filters and pagination)
 * @access  Public
 */
router.get(
  '/',
  asyncHandler(getAllDepartments)
);

/**
 * @route   GET /api/departments/active
 * @desc    Get all active departments (simplified list)
 * @access  Public
 */
router.get(
  '/active',
  asyncHandler(getActiveDepartments)
);

/**
 * @route   GET /api/departments/:id
 * @desc    Get single department by ID
 * @access  Public
 */
router.get(
  '/:id',
  mongoIdValidation,
  validate,
  asyncHandler(getDepartmentById)
);

/**
 * @route   PUT /api/departments/:id
 * @desc    Update department
 * @access  Private/Admin
 */
router.put(
  '/:id',
  authenticate,
  isAdmin,
  mongoIdValidation,
  updateDepartmentValidation,
  validate,
  asyncHandler(updateDepartment)
);

/**
 * @route   DELETE /api/departments/:id
 * @desc    Delete department (soft delete)
 * @access  Private/Admin
 */
router.delete(
  '/:id',
  authenticate,
  isAdmin,
  mongoIdValidation,
  validate,
  asyncHandler(deleteDepartment)
);

/**
 * @route   PATCH /api/departments/:id/toggle-status
 * @desc    Toggle department active status
 * @access  Private/Admin
 */
router.patch(
  '/:id/toggle-status',
  authenticate,
  isAdmin,
  mongoIdValidation,
  validate,
  asyncHandler(toggleDepartmentStatus)
);

/**
 * @route   GET /api/departments/:id/stats
 * @desc    Get department statistics
 * @access  Private/Admin
 */
router.get(
  '/:id/stats',
  authenticate,
  isAdmin,
  mongoIdValidation,
  validate,
  asyncHandler(getDepartmentStats)
);

module.exports = router;