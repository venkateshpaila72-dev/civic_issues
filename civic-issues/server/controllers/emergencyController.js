const Emergency = require('../models/Emergency');
const {
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  CLOUDINARY_FOLDERS,
  EMERGENCY_STATUS,
} = require('../utils/constants');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorMiddleware');
const { getPagination, getPaginationMeta } = require('../utils/helpers');
const { uploadImage, uploadVideo, uploadAudio } = require('../services/cloudinary');
const { reverseGeocode } = require('../services/locationService');
const { isValidEmergencyStatusTransition } = require('../utils/helpers');

/**
 * @desc    Create new emergency
 * @route   POST /api/emergency
 * @access  Private/Citizen
 */
const createEmergency = async (req, res, next) => {
  try {
    const { type, title, description, contactNumber, location, landmark } = req.body;

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

    // Upload media files (optional for emergencies)
    const media = {
      images: [],
      videos: [],
      audio: [],
    };

    if (req.files) {
      // Upload images
      if (req.files.images && req.files.images.length > 0) {
        for (const file of req.files.images) {
          const result = await uploadImage(file.buffer, CLOUDINARY_FOLDERS.EMERGENCIES);
          media.images.push({
            url: result.url,
            publicId: result.publicId,
          });
        }
      }

      // Upload videos
      if (req.files.videos && req.files.videos.length > 0) {
        for (const file of req.files.videos) {
          const result = await uploadVideo(file.buffer, CLOUDINARY_FOLDERS.EMERGENCIES);
          media.videos.push({
            url: result.url,
            publicId: result.publicId,
          });
        }
      }

      // Upload audio
      if (req.files.audio && req.files.audio.length > 0) {
        for (const file of req.files.audio) {
          const result = await uploadAudio(file.buffer, CLOUDINARY_FOLDERS.EMERGENCIES);
          media.audio.push({
            url: result.url,
            publicId: result.publicId,
          });
        }
      }
    }

    // Create emergency
    const emergency = await Emergency.create({
      reportedBy: req.user._id,
      type,
      title,
      description,
      contactNumber,
      location: {
        type: 'Point',
        coordinates: coordinates,
        address: address,
        landmark: landmark || null,
      },
      media,
      status: EMERGENCY_STATUS.REPORTED,
      priority: 'high', // Emergencies default to high priority
    });

    logger.success(`Emergency created: ${emergency.emergencyId} by ${req.user.email}`);

    // Populate for response
    const populatedEmergency = await Emergency.findById(emergency._id)
      .populate('reportedBy', 'fullName email phoneNumber');

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.EMERGENCY_CREATED,
      data: {
        emergency: populatedEmergency,
      },
    });
  } catch (error) {
    logger.error(`Create emergency error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get citizen's emergencies
 * @route   GET /api/emergency/my-emergencies
 * @access  Private/Citizen
 */
const getMyEmergencies = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, type, status } = req.query;

    // Build filter
    const filter = {
      reportedBy: req.user._id,
      isDeleted: false,
    };

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
    logger.error(`Get my emergencies error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get single emergency by ID
 * @route   GET /api/emergency/:id
 * @access  Private (Citizen/Officer/Admin)
 */
const getEmergencyById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const emergency = await Emergency.findById(id)
      .populate('reportedBy', 'fullName email phoneNumber')
      .populate('respondedBy', 'fullName email')
      .populate('statusHistory.changedBy', 'fullName email');

    if (!emergency || emergency.isDeleted) {
      throw new AppError(
        ERROR_MESSAGES.EMERGENCY_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    // Citizens can only view their own emergencies
    if (
      req.user.role === 'citizen' &&
      emergency.reportedBy._id.toString() !== req.user._id.toString()
    ) {
      throw new AppError(
        'Access denied',
        HTTP_STATUS.FORBIDDEN
      );
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        emergency,
      },
    });
  } catch (error) {
    logger.error(`Get emergency by ID error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Update emergency status
 * @route   PATCH /api/emergency/:id/status
 * @access  Private/Officer
 */
const updateEmergencyStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    const emergency = await Emergency.findById(id);

    if (!emergency || emergency.isDeleted) {
      throw new AppError(
        ERROR_MESSAGES.EMERGENCY_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    // Validate status transition
    if (!isValidEmergencyStatusTransition(emergency.status, status)) {
      throw new AppError(
        'Invalid status transition',
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Update status
    const oldStatus = emergency.status;
    emergency.status = status;

    // Assign officer if not already assigned
    if (!emergency.respondedBy) {
      emergency.respondedBy = req.user._id;
    }

    // Add to status history
    emergency.statusHistory.push({
      status,
      changedBy: req.user._id,
      changedAt: new Date(),
      remarks: remarks || null,
    });

    await emergency.save();

    logger.success(
      `Emergency ${emergency.emergencyId} status updated from ${oldStatus} to ${status} by ${req.user.email}`
    );

    // Populate for response
    const updatedEmergency = await Emergency.findById(emergency._id)
      .populate('reportedBy', 'fullName email phoneNumber')
      .populate('respondedBy', 'fullName email');

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.EMERGENCY_UPDATED,
      data: {
        emergency: updatedEmergency,
      },
    });
  } catch (error) {
    logger.error(`Update emergency status error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get all active emergencies
 * @route   GET /api/emergency/active
 * @access  Private/Officer/Admin
 */
const getActiveEmergencies = async (req, res, next) => {
  try {
    const emergencies = await Emergency.find({
      status: {
        $in: [
          EMERGENCY_STATUS.REPORTED,
          EMERGENCY_STATUS.RECEIVED,
          EMERGENCY_STATUS.DISPATCHED,
        ],
      },
      isDeleted: false,
    })
      .populate('reportedBy', 'fullName email phoneNumber')
      .populate('respondedBy', 'fullName email')
      .sort({ priority: -1, createdAt: -1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        emergencies,
        count: emergencies.length,
      },
    });
  } catch (error) {
    logger.error(`Get active emergencies error: ${error.message}`);
    next(error);
  }
};

module.exports = {
  createEmergency,
  getMyEmergencies,
  getEmergencyById,
  updateEmergencyStatus,
  getActiveEmergencies,
};