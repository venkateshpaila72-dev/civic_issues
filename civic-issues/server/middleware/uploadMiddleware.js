const multer = require('multer');
const {
  ALLOWED_FILE_TYPES,
  FILE_SIZE_LIMITS,
  HTTP_STATUS,
  ERROR_MESSAGES,
} = require('../utils/constants');
const { AppError } = require('./errorMiddleware');
const logger = require('../utils/logger');

/**
 * =====================================================
 * MULTER CONFIG
 * =====================================================
 */

const storage = multer.memoryStorage();

/**
 * File filter (DO NOT validate field name here)
 */
const fileFilter = (req, file, cb) => {
  const mimetype = file.mimetype;

  const isImage = ALLOWED_FILE_TYPES.IMAGE.includes(mimetype);
  const isVideo = ALLOWED_FILE_TYPES.VIDEO.includes(mimetype);
  const isAudio = ALLOWED_FILE_TYPES.AUDIO.includes(mimetype);

  if (!isImage && !isVideo && !isAudio) {
    return cb(
      new AppError(
        `Invalid file type: ${mimetype}`,
        HTTP_STATUS.BAD_REQUEST
      ),
      false
    );
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: FILE_SIZE_LIMITS.VIDEO, // max allowed (50MB)
    files: 10,
  },
});

/**
 * =====================================================
 * UPLOAD MIDDLEWARES
 * =====================================================
 */

/**
 * Used for REPORT creation (images/videos/audio)
 */
const uploadMultiple = upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'videos', maxCount: 2 },
  { name: 'audio', maxCount: 2 },
]);

/**
 * Used for REPORT images only
 */
const uploadImages = upload.array('images', 5);

/**
 * ✅ USED FOR OFFICER PROFILE IMAGE
 * Field name: profileImage
 */
const uploadProfileImage = upload.single('profileImage');

/**
 * =====================================================
 * FILE SIZE VALIDATION
 * =====================================================
 */

const validateUploadedFiles = (req, res, next) => {
  try {
    if (!req.files && !req.file) return next();

    // Normalize files
    const files = req.files || { profileImage: [req.file] };

    if (files.images) {
      files.images.forEach((file) => {
        if (file.size > FILE_SIZE_LIMITS.IMAGE) {
          throw new AppError(
            `Image exceeds ${FILE_SIZE_LIMITS.IMAGE / 1024 / 1024}MB`,
            HTTP_STATUS.BAD_REQUEST
          );
        }
      });
    }

    if (files.profileImage) {
      files.profileImage.forEach((file) => {
        if (file.size > FILE_SIZE_LIMITS.IMAGE) {
          throw new AppError(
            `Profile image exceeds ${FILE_SIZE_LIMITS.IMAGE / 1024 / 1024}MB`,
            HTTP_STATUS.BAD_REQUEST
          );
        }
      });
    }

    if (files.videos) {
      files.videos.forEach((file) => {
        if (file.size > FILE_SIZE_LIMITS.VIDEO) {
          throw new AppError(
            `Video exceeds ${FILE_SIZE_LIMITS.VIDEO / 1024 / 1024}MB`,
            HTTP_STATUS.BAD_REQUEST
          );
        }
      });
    }

    if (files.audio) {
      files.audio.forEach((file) => {
        if (file.size > FILE_SIZE_LIMITS.AUDIO) {
          throw new AppError(
            `Audio exceeds ${FILE_SIZE_LIMITS.AUDIO / 1024 / 1024}MB`,
            HTTP_STATUS.BAD_REQUEST
          );
        }
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * At least one image required (reports)
 */
const requireImages = (req, res, next) => {
  if (!req.files || !req.files.images || req.files.images.length === 0) {
    throw new AppError(
      ERROR_MESSAGES.MEDIA_REQUIRED,
      HTTP_STATUS.BAD_REQUEST
    );
  }
  next();
};

/**
 * =====================================================
 * MULTER ERROR HANDLER
 * =====================================================
 */

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    logger.error(`Multer error: ${err.message}`);

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message:
          'Unexpected file field. Use profileImage (profile) or images/videos/audio (reports)',
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  next(err);
};

module.exports = {
  // report uploads
  uploadMultiple,
  uploadImages,

  // profile upload
  uploadProfileImage,

  // validators
  validateUploadedFiles,
  requireImages,
  handleMulterError,
};
