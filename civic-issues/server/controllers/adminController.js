const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Department = require('../models/Department');
const Report = require('../models/Report');
const {
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  USER_ROLES,
} = require('../utils/constants');
const { sanitizeUser } = require('../utils/helpers');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorMiddleware');
const { getPagination, getPaginationMeta } = require('../utils/helpers');

/**
 * @desc    Create new officer
 * @route   POST /api/admin/officers
 * @access  Private/Admin
 */
const createOfficer = async (req, res, next) => {
  try {
    const { email, fullName, password, phoneNumber, departments } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);

    if (existingUser) {
      throw new AppError(
        ERROR_MESSAGES.USER_ALREADY_EXISTS,
        HTTP_STATUS.CONFLICT
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Validate departments if provided
    let validatedDepartments = [];
    if (departments && Array.isArray(departments)) {
      for (const deptId of departments) {
        const dept = await Department.findById(deptId);
        if (!dept || dept.isDeleted) {
          throw new AppError(
            `Department ${deptId} not found`,
            HTTP_STATUS.NOT_FOUND
          );
        }
        validatedDepartments.push(deptId);
      }
    }

    // Create officer
    const officer = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      fullName,
      phoneNumber: phoneNumber || null,
      role: USER_ROLES.OFFICER,
      authProvider: 'local',
      accountStatus: 'active',
      assignedDepartments: validatedDepartments,
    });

    // Update department stats
    for (const deptId of validatedDepartments) {
      const dept = await Department.findById(deptId);
      dept.stats.assignedOfficers += 1;
      await dept.save();
    }

    logger.success(`Officer created: ${officer.email} by ${req.user.email}`);

    // Populate departments for response
    const populatedOfficer = await User.findById(officer._id).populate(
      'assignedDepartments',
      'name code'
    );

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.OFFICER_CREATED,
      data: {
        officer: sanitizeUser(populatedOfficer),
      },
    });
  } catch (error) {
    logger.error(`Create officer error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get all officers
 * @route   GET /api/admin/officers
 * @access  Private/Admin
 */
const getAllOfficers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, accountStatus, search } = req.query;

    // Build filter
    const filter = {
      role: USER_ROLES.OFFICER,
      isDeleted: false,
    };

    if (accountStatus) {
      filter.accountStatus = accountStatus;
    }

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Pagination
    const { skip, limit: limitNum } = getPagination(page, limit);

    // Get officers
    const officers = await User.find(filter)
      .populate('assignedDepartments', 'name code')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .select('-password');

    // Get total count
    const total = await User.countDocuments(filter);

    // Pagination meta
    const pagination = getPaginationMeta(total, parseInt(page), limitNum);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        officers: officers.map((officer) => sanitizeUser(officer)),
        pagination,
      },
    });
  } catch (error) {
    logger.error(`Get all officers error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get single officer by ID
 * @route   GET /api/admin/officers/:id
 * @access  Private/Admin
 */
const getOfficerById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const officer = await User.findById(id)
      .populate('assignedDepartments', 'name code')
      .select('-password');

    if (!officer || officer.role !== USER_ROLES.OFFICER || officer.isDeleted) {
      throw new AppError(
        ERROR_MESSAGES.OFFICER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        officer: sanitizeUser(officer),
      },
    });
  } catch (error) {
    logger.error(`Get officer by ID error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Update officer details
 * @route   PUT /api/admin/officers/:id
 * @access  Private/Admin
 */
const updateOfficer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fullName, phoneNumber, email } = req.body;

    const officer = await User.findById(id);

    if (!officer || officer.role !== USER_ROLES.OFFICER || officer.isDeleted) {
      throw new AppError(
        ERROR_MESSAGES.OFFICER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    // Check if new email already exists
    if (email && email !== officer.email) {
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        throw new AppError(
          ERROR_MESSAGES.USER_ALREADY_EXISTS,
          HTTP_STATUS.CONFLICT
        );
      }
      officer.email = email.toLowerCase();
    }

    // Update fields
    if (fullName) officer.fullName = fullName;
    if (phoneNumber !== undefined) officer.phoneNumber = phoneNumber;

    await officer.save();

    logger.success(`Officer updated: ${officer.email} by ${req.user.email}`);

    const populatedOfficer = await User.findById(officer._id).populate(
      'assignedDepartments',
      'name code'
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.OFFICER_UPDATED,
      data: {
        officer: sanitizeUser(populatedOfficer),
      },
    });
  } catch (error) {
    logger.error(`Update officer error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Update officer account status
 * @route   PATCH /api/admin/officers/:id/status
 * @access  Private/Admin
 */
const updateOfficerStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { accountStatus } = req.body;

    const officer = await User.findById(id);

    if (!officer || officer.role !== USER_ROLES.OFFICER || officer.isDeleted) {
      throw new AppError(
        ERROR_MESSAGES.OFFICER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    officer.accountStatus = accountStatus;
    await officer.save();

    logger.success(
      `Officer status updated to ${accountStatus}: ${officer.email} by ${req.user.email}`
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: `Officer account ${accountStatus}`,
      data: {
        officer: sanitizeUser(officer),
      },
    });
  } catch (error) {
    logger.error(`Update officer status error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Assign department to officer
 * @route   POST /api/admin/officers/:id/departments
 * @access  Private/Admin
 */
const assignDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { departmentId } = req.body;

    const officer = await User.findById(id);

    if (!officer || officer.role !== USER_ROLES.OFFICER || officer.isDeleted) {
      throw new AppError(
        ERROR_MESSAGES.OFFICER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    // Check if department exists
    const department = await Department.findById(departmentId);

    if (!department || department.isDeleted) {
      throw new AppError(
        ERROR_MESSAGES.DEPARTMENT_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    // Check if already assigned
    if (officer.isAssignedToDepartment(departmentId)) {
      throw new AppError(
        'Officer already assigned to this department',
        HTTP_STATUS.CONFLICT
      );
    }

    // Assign department
    officer.assignedDepartments.push(departmentId);
    await officer.save();

    // Update department stats
    department.stats.assignedOfficers += 1;
    await department.save();

    logger.success(
      `Department ${department.name} assigned to officer ${officer.email} by ${req.user.email}`
    );

    const populatedOfficer = await User.findById(officer._id).populate(
      'assignedDepartments',
      'name code'
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.DEPARTMENT_ASSIGNED,
      data: {
        officer: sanitizeUser(populatedOfficer),
      },
    });
  } catch (error) {
    logger.error(`Assign department error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Remove department from officer
 * @route   DELETE /api/admin/officers/:id/departments/:deptId
 * @access  Private/Admin
 */
const removeDepartment = async (req, res, next) => {
  try {
    const { id, deptId } = req.params;

    const officer = await User.findById(id);

    if (!officer || officer.role !== USER_ROLES.OFFICER || officer.isDeleted) {
      throw new AppError(
        ERROR_MESSAGES.OFFICER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    // Check if assigned
    if (!officer.isAssignedToDepartment(deptId)) {
      throw new AppError(
        'Officer not assigned to this department',
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Remove department
    officer.assignedDepartments = officer.assignedDepartments.filter(
      (dept) => dept.toString() !== deptId.toString()
    );
    await officer.save();

    // Update department stats
    const department = await Department.findById(deptId);
    if (department) {
      department.stats.assignedOfficers = Math.max(
        0,
        department.stats.assignedOfficers - 1
      );
      await department.save();
    }

    logger.success(
      `Department ${deptId} removed from officer ${officer.email} by ${req.user.email}`
    );

    const populatedOfficer = await User.findById(officer._id).populate(
      'assignedDepartments',
      'name code'
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.DEPARTMENT_REMOVED,
      data: {
        officer: sanitizeUser(populatedOfficer),
      },
    });
  } catch (error) {
    logger.error(`Remove department error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get all reports (audit view)
 * @route   GET /api/admin/reports
 * @access  Private/Admin
 */
const getAllReports = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, department, search } = req.query;

    // Build filter
    const filter = { isDeleted: false };

    if (status) {
      filter.status = status;
    }

    if (department) {
      filter.department = department;
    }

    if (search) {
      filter.$or = [
        { reportId: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
      ];
    }

    // Pagination
    const { skip, limit: limitNum } = getPagination(page, limit);

    // Get reports
    const reports = await Report.find(filter)
      .populate('citizen', 'fullName email phoneNumber')
      .populate('department', 'name code')
      .populate('assignedOfficer', 'fullName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count
    const total = await Report.countDocuments(filter);

    // Pagination meta
    const pagination = getPaginationMeta(total, parseInt(page), limitNum);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        reports,
        pagination,
      },
    });
  } catch (error) {
    logger.error(`Get all reports error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Delete officer (soft delete)
 * @route   DELETE /api/admin/officers/:id
 * @access  Private/Admin
 */
const deleteOfficer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const officer = await User.findById(id);

    if (!officer || officer.role !== USER_ROLES.OFFICER || officer.isDeleted) {
      throw new AppError(
        ERROR_MESSAGES.OFFICER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    // Update department stats before deletion
    for (const deptId of officer.assignedDepartments) {
      const dept = await Department.findById(deptId);
      if (dept) {
        dept.stats.assignedOfficers = Math.max(
          0,
          dept.stats.assignedOfficers - 1
        );
        await dept.save();
      }
    }

    // Soft delete
    officer.isDeleted = true;
    officer.accountStatus = 'inactive';
    await officer.save();

    logger.success(`Officer deleted: ${officer.email} by ${req.user.email}`);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Officer deleted successfully',
    });
  } catch (error) {
    logger.error(`Delete officer error: ${error.message}`);
    next(error);
  }
};

module.exports = {
  createOfficer,
  getAllOfficers,
  getOfficerById,
  updateOfficer,
  updateOfficerStatus,
  assignDepartment,
  removeDepartment,
  getAllReports,
  deleteOfficer,
};