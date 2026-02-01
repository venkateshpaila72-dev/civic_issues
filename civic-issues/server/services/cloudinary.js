const { cloudinary } = require('../config/cloudinary');
const { CLOUDINARY_FOLDERS } = require('../utils/constants');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorMiddleware');

/**
 * Upload image to Cloudinary
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {string} folder - Cloudinary folder (reports, emergencies, profiles)
 * @returns {Promise<object>} - { url, publicId }
 */
const uploadImage = async (fileBuffer, folder = CLOUDINARY_FOLDERS.REPORTS) => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'image',
          transformation: [
            { width: 1200, height: 1200, crop: 'limit' }, // Max dimensions
            { quality: 'auto:good' }, // Auto quality optimization
          ],
        },
        (error, result) => {
          if (error) {
            logger.error(`Cloudinary image upload error: ${error.message}`);
            reject(new AppError('Image upload failed', 500));
          } else {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            });
          }
        }
      );

      uploadStream.end(fileBuffer);
    });
  } catch (error) {
    logger.error(`Upload image error: ${error.message}`);
    throw new AppError('Image upload failed', 500);
  }
};

/**
 * Upload video to Cloudinary
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {string} folder - Cloudinary folder
 * @returns {Promise<object>} - { url, publicId }
 */
const uploadVideo = async (fileBuffer, folder = CLOUDINARY_FOLDERS.REPORTS) => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'video',
          transformation: [
            { width: 1280, height: 720, crop: 'limit' },
            { quality: 'auto' },
          ],
        },
        (error, result) => {
          if (error) {
            logger.error(`Cloudinary video upload error: ${error.message}`);
            reject(new AppError('Video upload failed', 500));
          } else {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            });
          }
        }
      );

      uploadStream.end(fileBuffer);
    });
  } catch (error) {
    logger.error(`Upload video error: ${error.message}`);
    throw new AppError('Video upload failed', 500);
  }
};

/**
 * Upload audio to Cloudinary
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {string} folder - Cloudinary folder
 * @returns {Promise<object>} - { url, publicId }
 */
const uploadAudio = async (fileBuffer, folder = CLOUDINARY_FOLDERS.REPORTS) => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'video', // Cloudinary treats audio as video
        },
        (error, result) => {
          if (error) {
            logger.error(`Cloudinary audio upload error: ${error.message}`);
            reject(new AppError('Audio upload failed', 500));
          } else {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            });
          }
        }
      );

      uploadStream.end(fileBuffer);
    });
  } catch (error) {
    logger.error(`Upload audio error: ${error.message}`);
    throw new AppError('Audio upload failed', 500);
  }
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @param {string} resourceType - 'image', 'video', 'raw'
 * @returns {Promise<void>}
 */
const deleteFile = async (publicId, resourceType = 'image') => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    logger.debug(`Deleted file from Cloudinary: ${publicId}`);
  } catch (error) {
    logger.error(`Delete file error: ${error.message}`);
    // Don't throw error, just log it
  }
};

/**
 * Upload multiple files
 * @param {Array} files - Array of file objects with buffer and type
 * @param {string} folder - Cloudinary folder
 * @returns {Promise<Array>} - Array of { url, publicId }
 */
const uploadMultipleFiles = async (files, folder = CLOUDINARY_FOLDERS.REPORTS) => {
  try {
    const uploadPromises = files.map((file) => {
      if (file.mimetype.startsWith('image/')) {
        return uploadImage(file.buffer, folder);
      } else if (file.mimetype.startsWith('video/')) {
        return uploadVideo(file.buffer, folder);
      } else if (file.mimetype.startsWith('audio/')) {
        return uploadAudio(file.buffer, folder);
      }
    });

    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    logger.error(`Upload multiple files error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  uploadImage,
  uploadVideo,
  uploadAudio,
  deleteFile,
  uploadMultipleFiles,
};