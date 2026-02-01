const Report = require('../models/Report');
const Department = require('../models/Department');
const Emergency = require('../models/Emergency');
const {
  HTTP_STATUS,
  ERROR_MESSAGES,
  REPORT_STATUS,
} = require('../utils/constants');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorMiddleware');
const { getPagination, getPaginationMeta } = require('../utils/helpers');
const { isValidStatusTransition } = require('../utils/helpers');

/**
 * @desc    Select department for officer session
 * @route   POST /api/officer/select-department
 * @access  Private/Officer
 */
const selectDepartment = async (req, res, next) => {
  try {
    const { departmentId } = req.body;

    // Validate department exists
    const department = await Department.findById(departmentId);

    if (!department || department.isDeleted) {
      throw new AppError(
        ERROR_MESSAGES.DEPARTMENT_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    // Validate department is active
    if (!department.isActiveDepartment()) {
      throw new AppError(
        ERROR_MESSAGES.DEPARTMENT_INACTIVE,
        HTTP_STATUS.FORBIDDEN
      );
    }

    // Validate officer is assigned to this department
    if (!req.user.isAssignedToDepartment(departmentId)) {
      throw new AppError(
        ERROR_MESSAGES.DEPARTMENT_NOT_ASSIGNED,
        HTTP_STATUS.FORBIDDEN
      );
    }

    logger.success(
      `Officer ${req.user.email} selected department: ${department.name}`
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Department selected successfully',
      data: {
        selectedDepartment: {
          _id: department._id,
          name: department.name,
          code: department.code,
          description: department.description,
        },
      },
    });
  } catch (error) {
    logger.error(`Select department error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get reports for officer's department
 * @route   GET /api/officer/reports
 * @access  Private/Officer
 */
const getDepartmentReports = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;

    // Department ID from header (set by validateDepartmentSelection middleware)
    const departmentId = req.selectedDepartment._id;

    // Build filter
    const filter = {
      department: departmentId,
      isDeleted: false,
    };

    if (status) {
      filter.status = status;
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
        department: {
          _id: req.selectedDepartment._id,
          name: req.selectedDepartment.name,
          code: req.selectedDepartment.code,
        },
      },
    });
  } catch (error) {
    logger.error(`Get department reports error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get single report by ID
 * @route   GET /api/officer/reports/:id
 * @access  Private/Officer
 */
const getReportById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const report = await Report.findById(id)
      .populate('citizen', 'fullName email phoneNumber')
      .populate('department', 'name code')
      .populate('assignedOfficer', 'fullName email')
      .populate('statusHistory.changedBy', 'fullName email');

    if (!report || report.isDeleted) {
      throw new AppError(
        ERROR_MESSAGES.REPORT_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    // Validate officer has access to this report's department
    if (!req.user.isAssignedToDepartment(report.department._id)) {
      throw new AppError(
        ERROR_MESSAGES.REPORT_ACCESS_DENIED,
        HTTP_STATUS.FORBIDDEN
      );
    }

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
 * @desc    Update report status
 * @route   PATCH /api/officer/reports/:id/status
 * @access  Private/Officer
 */
const updateReportStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    const report = await Report.findById(id).populate('department', 'name code');

    if (!report || report.isDeleted) {
      throw new AppError(
        ERROR_MESSAGES.REPORT_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    // Validate officer has access to this report's department
    if (!req.user.isAssignedToDepartment(report.department._id)) {
      throw new AppError(
        ERROR_MESSAGES.REPORT_ACCESS_DENIED,
        HTTP_STATUS.FORBIDDEN
      );
    }

    // Validate status transition
    if (!isValidStatusTransition(report.status, status)) {
      throw new AppError(
        ERROR_MESSAGES.INVALID_STATUS_TRANSITION,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Cannot update if already resolved or rejected
    if (!report.canBeUpdated()) {
      throw new AppError(
        'Cannot update resolved or rejected reports',
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Update status
    const oldStatus = report.status;
    report.status = status;

    // Assign officer if not already assigned
    if (!report.assignedOfficer) {
      report.assignedOfficer = req.user._id;
    }

    // Add to status history
    report.statusHistory.push({
      status,
      changedBy: req.user._id,
      changedAt: new Date(),
      remarks: remarks || null,
    });

    // Set resolved timestamp if resolved
    if (status === REPORT_STATUS.RESOLVED) {
      report.resolvedAt = new Date();
    }

    await report.save();

    // Update department stats
    const department = await Department.findById(report.department._id);
    if (department) {
      if (status === REPORT_STATUS.RESOLVED) {
        department.stats.activeReports = Math.max(
          0,
          department.stats.activeReports - 1
        );
        department.stats.resolvedReports += 1;
      }
      await department.save();
    }

    logger.success(
      `Report ${report.reportId} status updated from ${oldStatus} to ${status} by ${req.user.email}`
    );

    // Fetch updated report with populated fields
    const updatedReport = await Report.findById(report._id)
      .populate('citizen', 'fullName email phoneNumber')
      .populate('department', 'name code')
      .populate('assignedOfficer', 'fullName email');

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Report status updated successfully',
      data: {
        report: updatedReport,
      },
    });
  } catch (error) {
    logger.error(`Update report status error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Reject report with reason
 * @route   POST /api/officer/reports/:id/reject
 * @access  Private/Officer
 */
const rejectReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    if (!rejectionReason || rejectionReason.trim().length < 10) {
      throw new AppError(
        ERROR_MESSAGES.REJECTION_REASON_REQUIRED,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const report = await Report.findById(id).populate('department', 'name code');

    if (!report || report.isDeleted) {
      throw new AppError(
        ERROR_MESSAGES.REPORT_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    // Validate officer has access
    if (!req.user.isAssignedToDepartment(report.department._id)) {
      throw new AppError(
        ERROR_MESSAGES.REPORT_ACCESS_DENIED,
        HTTP_STATUS.FORBIDDEN
      );
    }

    // Cannot reject if already resolved or rejected
    if (!report.canBeUpdated()) {
      throw new AppError(
        'Cannot reject resolved or rejected reports',
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Update report
    report.status = REPORT_STATUS.REJECTED;
    report.rejectionReason = rejectionReason;
    report.rejectedBy = req.user._id;
    report.rejectedAt = new Date();

    if (!report.assignedOfficer) {
      report.assignedOfficer = req.user._id;
    }

    // Add to status history
    report.statusHistory.push({
      status: REPORT_STATUS.REJECTED,
      changedBy: req.user._id,
      changedAt: new Date(),
      remarks: rejectionReason,
    });

    await report.save();

    // Update department stats
    const department = await Department.findById(report.department._id);
    if (department) {
      department.stats.activeReports = Math.max(
        0,
        department.stats.activeReports - 1
      );
      await department.save();
    }

    logger.success(
      `Report ${report.reportId} rejected by ${req.user.email}: ${rejectionReason}`
    );

    // Fetch updated report
    const updatedReport = await Report.findById(report._id)
      .populate('citizen', 'fullName email phoneNumber')
      .populate('department', 'name code')
      .populate('assignedOfficer', 'fullName email')
      .populate('rejectedBy', 'fullName email');

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Report rejected successfully',
      data: {
        report: updatedReport,
      },
    });
  } catch (error) {
    logger.error(`Reject report error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get officer dashboard stats
 * @route   GET /api/officer/dashboard
 * @access  Private/Officer
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const departmentId = req.selectedDepartment._id;

    // Get report counts by status
    const totalReports = await Report.countDocuments({
      department: departmentId,
      isDeleted: false,
    });

    const submittedReports = await Report.countDocuments({
      department: departmentId,
      status: REPORT_STATUS.SUBMITTED,
      isDeleted: false,
    });

    const inProgressReports = await Report.countDocuments({
      department: departmentId,
      status: REPORT_STATUS.IN_PROGRESS,
      isDeleted: false,
    });

    const resolvedReports = await Report.countDocuments({
      department: departmentId,
      status: REPORT_STATUS.RESOLVED,
      isDeleted: false,
    });

    const rejectedReports = await Report.countDocuments({
      department: departmentId,
      status: REPORT_STATUS.REJECTED,
      isDeleted: false,
    });

    // Get officer's handled reports
    const myHandledReports = await Report.countDocuments({
      department: departmentId,
      assignedOfficer: req.user._id,
      isDeleted: false,
    });

    // Get recent reports (last 5)
    const recentReports = await Report.find({
      department: departmentId,
      isDeleted: false,
    })
      .populate('citizen', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('reportId title status createdAt');

    // Get active emergencies count
    const activeEmergencies = await Emergency.countDocuments({
      status: { $ne: 'resolved' },
      isDeleted: false,
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        stats: {
          totalReports,
          submittedReports,
          inProgressReports,
          resolvedReports,
          rejectedReports,
          myHandledReports,
          activeEmergencies,
        },
        recentReports,
        department: {
          _id: req.selectedDepartment._id,
          name: req.selectedDepartment.name,
          code: req.selectedDepartment.code,
        },
      },
    });
  } catch (error) {
    logger.error(`Get dashboard stats error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get all emergencies (cross-department)
 * @route   GET /api/officer/emergencies
 * @access  Private/Officer
 */
const getAllEmergencies = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, type, status } = req.query;

    // Build filter
    const filter = { isDeleted: false };

    if (type) {
      filter.type = type;
    }

    if (status) {
      filter.status = status;
    }

    // Pagination
    const { skip, limit: limitNum } = getPagination(page, limit);

    // Get emergencies
    const emergencies = await Emergency.find(filter)
      .populate('reportedBy', 'fullName email phoneNumber')
      .populate('respondedBy', 'fullName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count
    const total = await Emergency.countDocuments(filter);

    // Pagination meta
    const pagination = getPaginationMeta(total, parseInt(page), limitNum);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        emergencies,
        pagination,
      },
    });
  } catch (error) {
    logger.error(`Get all emergencies error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get officer profile
 * @route   GET /api/officer/profile
 * @access  Private/Officer
 */
const getProfile = async (req, res, next) => {
  try {
    const officer = await require('../models/User')
      .findById(req.user._id)
      .populate('assignedDepartments', 'name code')
      .select('-password');

    if (!officer) {
      throw new AppError(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        officer,
      },
    });
  } catch (error) {
    logger.error(`Get officer profile error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Update officer profile
 * @route   PUT /api/officer/profile
 * @access  Private/Officer
 */
const updateProfile = async (req, res, next) => {
  try {
    const { fullName, phoneNumber, address } = req.body;

    const User = require('../models/User');
    const officer = await User.findById(req.user._id);

    if (!officer) {
      throw new AppError(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    // Update fields
    if (fullName) officer.fullName = fullName;
    if (phoneNumber !== undefined) officer.phoneNumber = phoneNumber;
    
    if (address) {
      officer.address = {
        street: address.street || officer.address?.street,
        city: address.city || officer.address?.city,
        state: address.state || officer.address?.state,
        pincode: address.pincode || officer.address?.pincode,
      };
    }

    // Upload profile image if provided
    if (req.file) {
      const { uploadImage } = require('../services/cloudinary');
      const { CLOUDINARY_FOLDERS } = require('../utils/constants');
      const result = await uploadImage(req.file.buffer, CLOUDINARY_FOLDERS.PROFILES);
      officer.profileImage = result.url;
    }

    await officer.save();

    logger.success(`Officer profile updated: ${officer.email}`);

    // Populate departments for response
    const updatedOfficer = await User.findById(officer._id)
      .populate('assignedDepartments', 'name code')
      .select('-password');

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        officer: updatedOfficer,
      },
    });
  } catch (error) {
    logger.error(`Update officer profile error: ${error.message}`);
    next(error);
  }
};

module.exports = {
  selectDepartment,
  getDepartmentReports,
  getReportById,
  updateReportStatus,
  rejectReport,
  getDashboardStats,
  getAllEmergencies,
  getProfile,
  updateProfile,
};