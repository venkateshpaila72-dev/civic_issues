/**
 * Upload service for handling file uploads.
 * Currently, all uploads go through backend multipart endpoints.
 * This file is a placeholder for future direct Cloudinary uploads if needed.
 */

/**
 * Validate a single file against type and size limits.
 */
export const validateFile = (file, allowedTypes, maxSize) => {
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `Invalid file type: ${file.type}` };
  }

  if (file.size > maxSize) {
    const sizeMB = Math.round(maxSize / (1024 * 1024));
    return { valid: false, error: `File size exceeds ${sizeMB}MB limit` };
  }

  return { valid: true };
};

/**
 * Validate multiple files.
 */
export const validateFiles = (files, allowedTypes, maxSize, maxCount) => {
  if (files.length > maxCount) {
    return { valid: false, error: `Maximum ${maxCount} files allowed` };
  }

  for (const file of files) {
    const result = validateFile(file, allowedTypes, maxSize);
    if (!result.valid) {
      return result;
    }
  }

  return { valid: true };
};