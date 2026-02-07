import React, { useRef } from 'react';
import { FILE_COUNT_LIMITS, FILE_SIZE_LABELS, ACCEPT_STRINGS } from '../../constants/fileTypes';
import Button from '../common/Button';

/**
 * Media uploader component with drag-and-drop.
 * Supports images (required), videos (optional), audio (optional).
 */
const MediaUploader = ({ type = 'IMAGE', files = [], onFilesAdd, onFileRemove, error }) => {
  const fileInputRef = useRef(null);

  const maxCount = FILE_COUNT_LIMITS[type];
  const maxSize = FILE_SIZE_LABELS[type];
  const accept = ACCEPT_STRINGS[type];

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      onFilesAdd(selectedFiles);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      onFilesAdd(droppedFiles);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const labels = {
    IMAGE: 'Images',
    VIDEO: 'Videos',
    AUDIO: 'Audio',
  };

  const icons = {
    IMAGE: (
      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    VIDEO: (
      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    AUDIO: (
      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
  };

  return (
    <div>
      {/* Upload area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center
          ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'}
          hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer
        `}
        onClick={() => fileInputRef.current?.click()}
      >
        {icons[type]}
        <p className="mt-2 text-sm font-medium text-gray-700">
          Drop {labels[type].toLowerCase()} here or click to browse
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Max {maxCount} file{maxCount > 1 ? 's' : ''}, up to {maxSize} each
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={maxCount > 1}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Error */}
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}

      {/* File count */}
      {files.length > 0 && (
        <p className="mt-2 text-sm text-gray-600">
          {files.length} / {maxCount} {labels[type].toLowerCase()} selected
        </p>
      )}
    </div>
  );
};

export default MediaUploader;