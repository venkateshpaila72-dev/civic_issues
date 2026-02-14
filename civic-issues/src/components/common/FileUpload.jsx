import React, { useRef } from 'react';

/**
 * File upload component with drag & drop support
 */
const FileUpload = ({
  label,
  accept = '*',
  multiple = false,
  files = [],
  onChange,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB default
  error,
}) => {
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    processFiles(selectedFiles);
  };

  const processFiles = (newFiles) => {
    // Validate file count
    if (files.length + newFiles.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files`);
      return;
    }

    // Validate file sizes
    const oversizedFiles = newFiles.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      alert(`Some files exceed the maximum size of ${(maxSize / 1024 / 1024).toFixed(0)}MB`);
      return;
    }

    // Add new files
    onChange([...files, ...newFiles]);
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      {/* Upload Button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="btn btn-secondary"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Choose Files
        </button>
        <span className="text-sm text-gray-500">
          {files.length} / {maxFiles} files selected
        </span>
      </div>

      {/* Hidden Input */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="ml-3 text-red-600 hover:text-red-700 flex-shrink-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Helper Text */}
      <p className="mt-2 text-xs text-gray-500">
        Max {maxFiles} files, up to {(maxSize / 1024 / 1024).toFixed(0)}MB each
      </p>
    </div>
  );
};

export default FileUpload;