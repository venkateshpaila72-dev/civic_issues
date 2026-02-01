const Report = require('../models/Report');
const {
  HTTP_STATUS,
  ERROR_MESSAGES,
  USER_ROLES,
} = require('../utils/constants');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorMiddleware');
const { getPagination, getPaginationMeta } = require('../utils/helpers');

/**
 * @desc    Get single report by ID (role-based access)
 * @route   GET /api/reports/:id
 * @access  Private (Citizen/Officer/Admin)
 */
const getReportById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const report = await Report.findById(id)
      .populate('citizen', 'fullName email phoneNumber')
      .populate('department', 'name code')
      .populate('assignedOfficer', 'fullName email')
      .populate('rejectedBy', 'fullName email')
      .populate('statusHistory.changedBy', 'fullName email');

    if (!report || report.isDeleted) {
      throw new AppError(
        ERROR_MESSAGES.REPORT_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    // Role-based access control
    const userRole = req.user.role;
    const userId = req.user._id.toString();

    if (userRole === USER_ROLES.CITIZEN) {
      // Citizens can only view their own reports
      if (report.citizen._id.toString() !== userId) {
        throw new AppError(
          ERROR_MESSAGES.REPORT_ACCESS_DENIED,
          HTTP_STATUS.FORBIDDEN
        );
      }
    } else if (userRole === USER_ROLES.OFFICER) {
      // Officers can only view reports from their assigned departments
      if (!req.user.isAssignedToDepartment(report.department._id)) {
        throw new AppError(
          ERROR_MESSAGES.REPORT_ACCESS_DENIED,
          HTTP_STATUS.FORBIDDEN
        );
      }
    }
    // Admins can view all reports (no restriction)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        report,
      },
    });
  } catch (error) {
    logger.error(`Get report by ID error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get all reports with filters (role-based)
 * @route   GET /api/reports
 * @access  Private (Citizen/Officer/Admin)
 */
const getAllReports = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      department,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    // Build base filter
    const filter = { isDeleted: false };

    // Role-based filtering
    const userRole = req.user.role;

    if (userRole === USER_ROLES.CITIZEN) {
      // Citizens can only see their own reports
      filter.citizen = req.user._id;
    } else if (userRole === USER_ROLES.OFFICER) {
      // Officers can only see reports from their assigned departments
      if (req.user.assignedDepartments && req.user.assignedDepartments.length > 0) {
        filter.department = { $in: req.user.assignedDepartments };
      } else {
        // Officer has no departments - return empty
        return res.status(HTTP_STATUS.OK).json({
          success: true,
          data: {
            reports: [],
            pagination: {
              total: 0,
              page: parseInt(page),
              limit: parseInt(limit),
              totalPages: 0,
              hasNextPage: false,
              hasPreviousPage: false,
            },
          },
        });
      }
    }
    // Admins see all reports (no additional filter)

    // Apply query filters
    if (status) {
      filter.status = status;
    }

    if (department) {
      // For officers, department filter must be within their assigned departments
      if (userRole === USER_ROLES.OFFICER) {
        if (req.user.isAssignedToDepartment(department)) {
          filter.department = department;
        } else {
          throw new AppError(
            ERROR_MESSAGES.DEPARTMENT_NOT_ASSIGNED,
            HTTP_STATUS.FORBIDDEN
          );
        }
      } else {
        filter.department = department;
      }
    }

    if (search) {
      filter.$or = [
        { reportId: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Pagination
    const { skip, limit: limitNum } = getPagination(page, limit);

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Get reports
    const reports = await Report.find(filter)
      .populate('citizen', 'fullName email phoneNumber')
      .populate('department', 'name code')
      .populate('assignedOfficer', 'fullName email')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    // Get total count
    const total = await Report.countDocuments(filter);

    // Pagination meta
    const pagination = getPaginationMeta(total, parseInt(page), limitNum);

    logger.info(`${userRole} ${req.user.email} fetched ${reports.length} reports`);

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
 * @desc    Get report statistics (Admin/Officer)
 * @route   GET /api/reports/statistics
 * @access  Private (Officer/Admin)
 */
const getReportStatistics = async (req, res, next) => {
  try {
    const userRole = req.user.role;

    // Build filter based on role
    let filter = { isDeleted: false };

    if (userRole === USER_ROLES.OFFICER) {
      // Officers see stats only for their departments
      if (req.user.assignedDepartments && req.user.assignedDepartments.length > 0) {
        filter.department = { $in: req.user.assignedDepartments };
      } else {
        // No departments assigned
        return res.status(HTTP_STATUS.OK).json({
          success: true,
          data: {
            statistics: {
              total: 0,
              byStatus: {},
              byDepartment: [],
            },
          },
        });
      }
    }
    // Admins see all (no filter)

    // Get total count
    const total = await Report.countDocuments(filter);

    // Get counts by status
    const byStatus = await Report.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get counts by department
    const byDepartment = await Report.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'departments',
          localField: '_id',
          foreignField: '_id',
          as: 'department',
        },
      },
      {
        $unwind: '$department',
      },
      {
        $project: {
          _id: 1,
          name: '$department.name',
          code: '$department.code',
          count: 1,
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Format status counts
    const statusStats = {};
    byStatus.forEach((item) => {
      statusStats[item._id] = item.count;
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        statistics: {
          total,
          byStatus: statusStats,
          byDepartment,
        },
      },
    });
  } catch (error) {
    logger.error(`Get report statistics error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get nearby reports (geospatial query)
 * @route   GET /api/reports/nearby
 * @access  Private (All roles)
 */
const getNearbyReports = async (req, res, next) => {
  try {
    const { longitude, latitude, maxDistance = 5000 } = req.query;

    if (!longitude || !latitude) {
      throw new AppError(
        'Longitude and latitude are required',
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const lng = parseFloat(longitude);
    const lat = parseFloat(latitude);

    if (isNaN(lng) || isNaN(lat)) {
      throw new AppError(
        'Invalid coordinates',
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Build base filter
    let filter = { isDeleted: false };

    // Role-based filtering
    const userRole = req.user.role;

    if (userRole === USER_ROLES.CITIZEN) {
      filter.citizen = req.user._id;
    } else if (userRole === USER_ROLES.OFFICER) {
      if (req.user.assignedDepartments && req.user.assignedDepartments.length > 0) {
        filter.department = { $in: req.user.assignedDepartments };
      } else {
        return res.status(HTTP_STATUS.OK).json({
          success: true,
          data: { reports: [] },
        });
      }
    }

    // Geospatial query
    const reports = await Report.find({
      ...filter,
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          $maxDistance: parseInt(maxDistance), // in meters
        },
      },
    })
      .populate('citizen', 'fullName email')
      .populate('department', 'name code')
      .limit(20);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        reports,
        searchCenter: {
          longitude: lng,
          latitude: lat,
        },
        maxDistance: parseInt(maxDistance),
      },
    });
  } catch (error) {
    logger.error(`Get nearby reports error: ${error.message}`);
    next(error);
  }
};

module.exports = {
  getReportById,
  getAllReports,
  getReportStatistics,
  getNearbyReports,
};