const { USER_ROLES, HTTP_STATUS, ERROR_MESSAGES } = require('../utils/constants');
const { AppError } = require('./errorMiddleware');
const Department = require('../models/Department');
const logger = require('../utils/logger');

/**
 * Department Validation Middleware
 * CRITICAL: Validates that officers can only access their assigned departments
 */

/**
 * Validate department selection (from header or body)
 * REQUIRED for officer login and department-specific operations
 */
const validateDepartmentSelection = async (req, res, next) => {
  try {
    // Only apply to officers
    if (!req.user || req.user.role !== USER_ROLES.OFFICER) {
      return next();
    }

    // Get department ID from header or body
    const departmentId = req.headers['x-department-id'] || req.body.departmentId || req.query.departmentId;

    if (!departmentId) {
      throw new AppError(
        ERROR_MESSAGES.DEPARTMENT_SELECTION_REQUIRED,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Check if department exists and is active
    const department = await Department.findById(departmentId);

    if (!department) {
      throw new AppError(ERROR_MESSAGES.DEPARTMENT_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    if (!department.isActiveDepartment()) {
      throw new AppError(ERROR_MESSAGES.DEPARTMENT_INACTIVE, HTTP_STATUS.FORBIDDEN);
    }

    // Check if officer is assigned to this department
    if (!req.user.isAssignedToDepartment(departmentId)) {
      logger.warn(
        `Officer ${req.user.email} attempted to access unassigned department ${department.name}`
      );
      
      throw new AppError(
        ERROR_MESSAGES.DEPARTMENT_NOT_ASSIGNED,
        HTTP_STATUS.FORBIDDEN
      );
    }

    // Attach department to request
    req.selectedDepartment = department;

    logger.debug(
      `Department validated: ${department.name} for officer ${req.user.email}`
    );

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Validate officer has access to specific department
 * Used when officer tries to access department-specific resources
 */
const validateDepartmentAccess = (departmentIdField = 'departmentId') => {
  return async (req, res, next) => {
    try {
      // Only apply to officers
      if (!req.user || req.user.role !== USER_ROLES.OFFICER) {
        return next();
      }

      // Get department ID from params, body, or query
      const departmentId =
        req.params[departmentIdField] ||
        req.body[departmentIdField] ||
        req.query[departmentIdField];

      if (!departmentId) {
        throw new AppError('Department ID is required', HTTP_STATUS.BAD_REQUEST);
      }

      // Check if officer is assigned to this department
      if (!req.user.isAssignedToDepartment(departmentId)) {
        logger.warn(
          `Officer ${req.user.email} attempted to access reports from unassigned department ${departmentId}`
        );
        
        throw new AppError(
          ERROR_MESSAGES.INVALID_DEPARTMENT_ACCESS,
          HTTP_STATUS.FORBIDDEN
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Extract department from report and validate officer access
 * Used when officer tries to update a specific report
 */
const validateReportDepartmentAccess = async (req, res, next) => {
  try {
    // Only apply to officers
    if (!req.user || req.user.role !== USER_ROLES.OFFICER) {
      return next();
    }

    // Report should be attached to req by previous middleware
    if (!req.report) {
      throw new AppError(ERROR_MESSAGES.REPORT_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const reportDepartmentId = req.report.department._id || req.report.department;

    // Check if officer is assigned to the report's department
    if (!req.user.isAssignedToDepartment(reportDepartmentId)) {
      logger.warn(
        `Officer ${req.user.email} attempted to update report from unassigned department`
      );
      
      throw new AppError(
        ERROR_MESSAGES.INVALID_DEPARTMENT_ACCESS,
        HTTP_STATUS.FORBIDDEN
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Ensure department exists and is active
 * General validation for any department-related operation
 */
const validateDepartmentExists = async (req, res, next) => {
  try {
    const departmentId =
      req.params.departmentId ||
      req.params.id ||
      req.body.departmentId ||
      req.body.department;

    if (!departmentId) {
      throw new AppError('Department ID is required', HTTP_STATUS.BAD_REQUEST);
    }

    const department = await Department.findById(departmentId);

    if (!department) {
      throw new AppError(ERROR_MESSAGES.DEPARTMENT_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    // Attach department to request for use in controller
    req.department = department;

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Validate department is active
 * Used for creating reports or emergencies
 */
const validateDepartmentIsActive = (req, res, next) => {
  if (!req.department) {
    throw new AppError(ERROR_MESSAGES.DEPARTMENT_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  if (!req.department.isActiveDepartment()) {
    throw new AppError(ERROR_MESSAGES.DEPARTMENT_INACTIVE, HTTP_STATUS.FORBIDDEN);
  }

  next();
};

module.exports = {
  validateDepartmentSelection,
  validateDepartmentAccess,
  validateReportDepartmentAccess,
  validateDepartmentExists,
  validateDepartmentIsActive,
};