const Department = require('../models/Department');
const {
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} = require('../utils/constants');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorMiddleware');
const { getPagination, getPaginationMeta } = require('../utils/helpers');

/**
 * @desc    Create new department
 * @route   POST /api/departments
 * @access  Private/Admin
 */
const createDepartment = async (req, res, next) => {
  try {
    const { name, description, contactEmail, contactPhone, icon } = req.body;

    // Check if department already exists
    const existingDept = await Department.findByName(name);

    if (existingDept) {
      throw new AppError(
        ERROR_MESSAGES.DEPARTMENT_ALREADY_EXISTS,
        HTTP_STATUS.CONFLICT
      );
    }

    // Create department
    const department = await Department.create({
      name,
      description: description || null,
      contactEmail: contactEmail || null,
      contactPhone: contactPhone || null,
      icon: icon || null,
      createdBy: req.user._id,
      isActive: true,
    });

    logger.success(`Department created: ${department.name} by ${req.user.email}`);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.DEPARTMENT_CREATED,
      data: {
        department,
      },
    });
  } catch (error) {
    logger.error(`Create department error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get all departments
 * @route   GET /api/departments
 * @access  Public
 */
const getAllDepartments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, isActive, search } = req.query;

    // Build filter
    const filter = { isDeleted: false };

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
      ];
    }

    // Pagination
    const { skip, limit: limitNum } = getPagination(page, limit);

    // Get departments
    const departments = await Department.find(filter)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limitNum)
      .select('-__v');

    // Get total count
    const total = await Department.countDocuments(filter);

    // Pagination meta
    const pagination = getPaginationMeta(total, parseInt(page), limitNum);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        departments,
        pagination,
      },
    });
  } catch (error) {
    logger.error(`Get all departments error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get active departments (simplified list)
 * @route   GET /api/departments/active
 * @access  Public
 */
const getActiveDepartments = async (req, res, next) => {
  try {
    const departments = await Department.findActive();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        departments,
      },
    });
  } catch (error) {
    logger.error(`Get active departments error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get single department by ID
 * @route   GET /api/departments/:id
 * @access  Public
 */
const getDepartmentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const department = await Department.findById(id);

    if (!department || department.isDeleted) {
      throw new AppError(
        ERROR_MESSAGES.DEPARTMENT_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        department,
      },
    });
  } catch (error) {
    logger.error(`Get department by ID error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Update department
 * @route   PUT /api/departments/:id
 * @access  Private/Admin
 */
const updateDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, contactEmail, contactPhone, icon, isActive } = req.body;

    const department = await Department.findById(id);

    if (!department || department.isDeleted) {
      throw new AppError(
        ERROR_MESSAGES.DEPARTMENT_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    // Check if new name already exists (if name is being changed)
    if (name && name !== department.name) {
      const existingDept = await Department.findByName(name);

      if (existingDept) {
        throw new AppError(
          ERROR_MESSAGES.DEPARTMENT_ALREADY_EXISTS,
          HTTP_STATUS.CONFLICT
        );
      }

      department.name = name;
    }

    // Update fields
    if (description !== undefined) department.description = description;
    if (contactEmail !== undefined) department.contactEmail = contactEmail;
    if (contactPhone !== undefined) department.contactPhone = contactPhone;
    if (icon !== undefined) department.icon = icon;
    if (isActive !== undefined) department.isActive = isActive;

    department.updatedBy = req.user._id;

    await department.save();

    logger.success(`Department updated: ${department.name} by ${req.user.email}`);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.DEPARTMENT_UPDATED,
      data: {
        department,
      },
    });
  } catch (error) {
    logger.error(`Update department error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Delete department (soft delete)
 * @route   DELETE /api/departments/:id
 * @access  Private/Admin
 */
const deleteDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const department = await Department.findById(id);

    if (!department || department.isDeleted) {
      throw new AppError(
        ERROR_MESSAGES.DEPARTMENT_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    // Soft delete
    department.isDeleted = true;
    department.isActive = false;
    department.updatedBy = req.user._id;

    await department.save();

    logger.success(`Department deleted: ${department.name} by ${req.user.email}`);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.DEPARTMENT_DELETED,
    });
  } catch (error) {
    logger.error(`Delete department error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Toggle department active status
 * @route   PATCH /api/departments/:id/toggle-status
 * @access  Private/Admin
 */
const toggleDepartmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const department = await Department.findById(id);

    if (!department || department.isDeleted) {
      throw new AppError(
        ERROR_MESSAGES.DEPARTMENT_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    // Toggle status
    department.isActive = !department.isActive;
    department.updatedBy = req.user._id;

    await department.save();

    logger.success(
      `Department ${department.isActive ? 'activated' : 'deactivated'}: ${department.name} by ${req.user.email}`
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: `Department ${department.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        department,
      },
    });
  } catch (error) {
    logger.error(`Toggle department status error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get department statistics
 * @route   GET /api/departments/:id/stats
 * @access  Private/Admin
 */
const getDepartmentStats = async (req, res, next) => {
  try {
    const { id } = req.params;

    const department = await Department.findById(id);

    if (!department || department.isDeleted) {
      throw new AppError(
        ERROR_MESSAGES.DEPARTMENT_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        stats: department.stats,
        department: {
          _id: department._id,
          name: department.name,
          code: department.code,
        },
      },
    });
  } catch (error) {
    logger.error(`Get department stats error: ${error.message}`);
    next(error);
  }
};

module.exports = {
  createDepartment,
  getAllDepartments,
  getActiveDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  toggleDepartmentStatus,
  getDepartmentStats,
};