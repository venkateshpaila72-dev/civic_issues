import { useState, useCallback } from 'react';
import { validateFile } from '../utils/validation';
import { createPreviewURL, revokePreviewURL} from '../utils/fileUtils';
import { getFileCategory } from '../constants/fileTypes';
import { FILE_COUNT_LIMITS } from '../constants/fileTypes';

/**
 * Hook for managing file uploads with validation and preview.
 * Returns { files, previews, addFiles, removeFile, clearFiles, error }
 */
const useFileUpload = (fileType = 'IMAGE') => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState(null);

  const maxCount = FILE_COUNT_LIMITS[fileType];

  const addFiles = useCallback((newFiles) => {
    const fileArray = Array.from(newFiles);

    // Check count limit
    if (files.length + fileArray.length > maxCount) {
      setError(`Maximum ${maxCount} ${fileType.toLowerCase()}(s) allowed`);
      return;
    }

    // Validate each file
    const validFiles = [];
    const newPreviews = [];

    for (const file of fileArray) {
      const validation = validateFile(file);
      
      if (!validation.valid) {
        setError(validation.error);
        return;
      }

      const category = getFileCategory(file.type);
      if (category !== fileType) {
        setError(`Please select ${fileType.toLowerCase()} files only`);
        return;
      }

      validFiles.push(file);

      // Create preview URL for images/videos
      if (fileType === 'IMAGE' || fileType === 'VIDEO') {
        newPreviews.push(createPreviewURL(file));
      } else {
        newPreviews.push(null);
      }
    }

    setFiles((prev) => [...prev, ...validFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);
    setError(null);
  }, [files, fileType, maxCount]);

  const removeFile = useCallback((index) => {
    // Revoke preview URL
    if (previews[index] && previews[index].startsWith('blob:')) {
      revokePreviewURL(previews[index]);
    }

    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setError(null);
  }, [previews]);

  const clearFiles = useCallback(() => {
    // Revoke all preview URLs
    previews.forEach((url) => {
      if (url && url.startsWith('blob:')) {
        revokePreviewURL(url);
      }
    });

    setFiles([]);
    setPreviews([]);
    setError(null);
  }, [previews]);

  return {
    files,
    previews,
    addFiles,
    removeFile,
    clearFiles,
    error,
  };
};

export default useFileUpload;