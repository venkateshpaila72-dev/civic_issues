const Report = require('../models/Report');
const Emergency = require('../models/Emergency');
const Department = require('../models/Department');
const User = require('../models/User');
const {
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  CLOUDINARY_FOLDERS,
} = require('../utils/constants');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorMiddleware');
const { getPagination, getPaginationMeta } = require('../utils/helpers');
const { uploadMultipleFiles, uploadImage } = require('../services/cloudinary');
const { reverseGeocode } = require('../services/locationService');

/**
 * @desc    Create new civic issue report
 * @route   POST /api/citizen/reports
 * @access  Private/Citizen
 */
const createReport = async (req, res, next) => {
  try {
    const { title, description, department, location, landmark } = req.body;

    // Validate department exists and is active
    const dept = await Department.findById(department);

    if (!dept || dept.isDeleted) {
      throw new AppError(
        ERROR_MESSAGES.DEPARTMENT_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    if (!dept.isActiveDepartment()) {
      throw new AppError(
        ERROR_MESSAGES.DEPARTMENT_INACTIVE,
        HTTP_STATUS.FORBIDDEN
      );
    }

    // Parse location
    const locationData = typeof location === 'string' ? JSON.parse(location) : location;
    const coordinates = locationData.coordinates;

    if (!coordinates || coordinates.length !== 2) {
      throw new AppError(
        ERROR_MESSAGES.LOCATION_REQUIRED,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Reverse geocode if address not provided
    let address = locationData.address;
    if (!address) {
      address = await reverseGeocode(coordinates[1], coordinates[0]);
    }

    // Upload media files
    const media = {
      images: [],
      videos: [],
      audio: [],
    };

    if (req.files) {
      // Upload images
      if (req.files.images && req.files.images.length > 0) {
        for (const file of req.files.images) {
          const result = await uploadImage(file.buffer, CLOUDINARY_FOLDERS.REPORTS);
          media.images.push({
            url: result.url,
            publicId: result.publicId,
          });
        }
      }

      // Upload videos
      if (req.files.videos && req.files.videos.length > 0) {
        const { uploadVideo } = require('../services/cloudinary');
        for (const file of req.files.videos) {
          const result = await uploadVideo(file.buffer, CLOUDINARY_FOLDERS.REPORTS);
          media.videos.push({
            url: result.url,
            publicId: result.publicId,
          });
        }
      }

      // Upload audio
      if (req.files.audio && req.files.audio.length > 0) {
        const { uploadAudio } = require('../services/cloudinary');
        for (const file of req.files.audio) {
          const result = await uploadAudio(file.buffer, CLOUDINARY_FOLDERS.REPORTS);
          media.audio.push({
            url: result.url,
            publicId: result.publicId,
          });
        }
      }
    }

    // At least one image required
    if (media.images.length === 0) {
      throw new AppError(
        ERROR_MESSAGES.MEDIA_REQUIRED,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Create report
    const report = await Report.create({
      citizen: req.user._id,
      department: department,
      title,
      description,
      location: {
        type: 'Point',
        coordinates: coordinates, // [longitude, latitude]
        address: address,
        landmark: landmark || null,
      },
      media,
      status: 'submitted',
    });

    // Update department stats
    await dept.incrementReportCount();

    logger.success(`Report created: ${report.reportId} by ${req.user.email}`);

    // Populate department for response
    const populatedReport = await Report.findById(report._id)
      .populate('department', 'name code')
      .populate('citizen', 'fullName email phoneNumber');

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.REPORT_CREATED,
      data: {
        report: populatedReport,
      },
    });
  } catch (error) {
    logger.error(`Create report error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get all reports by citizen
 * @route   GET /api/citizen/reports
 * @access  Private/Citizen
 */
const getMyReports = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, department } = req.query;

    // Build filter
    const filter = {
      citizen: req.user._id,
      isDeleted: false,
    };

    if (status) {
      filter.status = status;
    }

    if (department) {
      filter.department = department;
    }

    // Pagination
    const { skip, limit: limitNum } = getPagination(page, limit);

    // Get reports
    const reports = await Report.find(filter)
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
    logger.error(`Get my reports error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get single report by ID
 * @route   GET /api/citizen/reports/:id
 * @access  Private/Citizen
 */
const getReportById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const report = await Report.findById(id)
      .populate('department', 'name code')
      .populate('citizen', 'fullName email phoneNumber')
      .populate('assignedOfficer', 'fullName email')
      .populate('rejectedBy', 'fullName email')
      .populate('statusHistory.changedBy', 'fullName email');

    if (!report || report.isDeleted) {
      throw new AppError(
        ERROR_MESSAGES.REPORT_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    // Verify citizen owns this report
    if (report.citizen._id.toString() !== req.user._id.toString()) {
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
 * @desc    Get citizen profile
 * @route   GET /api/citizen/profile
 * @access  Private/Citizen
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    logger.error(`Get profile error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Update citizen profile
 * @route   PUT /api/citizen/profile
 * @access  Private/Citizen
 */
const updateProfile = async (req, res, next) => {
  try {
    const { fullName, phoneNumber, address } = req.body;

    const user = await User.findById(req.user._id);

    // Update fields
    if (fullName) user.fullName = fullName;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (address) {
      user.address = {
        street: address.street || user.address?.street,
        city: address.city || user.address?.city,
        state: address.state || user.address?.state,
        pincode: address.pincode || user.address?.pincode,
      };
    }

    // Upload profile image if provided
    if (req.file) {
      const result = await uploadImage(req.file.buffer, CLOUDINARY_FOLDERS.PROFILES);
      user.profileImage = result.url;
    }

    await user.save();

    logger.success(`Profile updated: ${user.email}`);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.PROFILE_UPDATED,
      data: {
        user,
      },
    });
  } catch (error) {
    logger.error(`Update profile error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get citizen dashboard stats
 * @route   GET /api/citizen/dashboard
 * @access  Private/Citizen
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const citizenId = req.user._id;

    // Get report counts by status
    const totalReports = await Report.countDocuments({
      citizen: citizenId,
      isDeleted: false,
    });

    const submittedReports = await Report.countDocuments({
      citizen: citizenId,
      status: 'submitted',
      isDeleted: false,
    });

    const inProgressReports = await Report.countDocuments({
      citizen: citizenId,
      status: 'in_progress',
      isDeleted: false,
    });

    const resolvedReports = await Report.countDocuments({
      citizen: citizenId,
      status: 'resolved',
      isDeleted: false,
    });

    const rejectedReports = await Report.countDocuments({
      citizen: citizenId,
      status: 'rejected',
      isDeleted: false,
    });

    // Get recent reports (last 5)
    const recentReports = await Report.find({
      citizen: citizenId,
      isDeleted: false,
    })
      .populate('department', 'name code')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('reportId title status createdAt');

    // Get emergency count
    const totalEmergencies = await Emergency.countDocuments({
      reportedBy: citizenId,
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
          totalEmergencies,
        },
        recentReports,
      },
    });
  } catch (error) {
    logger.error(`Get dashboard stats error: ${error.message}`);
    next(error);
  }
};

module.exports = {
  createReport,
  getMyReports,
  getReportById,
  getProfile,
  updateProfile,
  getDashboardStats,
};