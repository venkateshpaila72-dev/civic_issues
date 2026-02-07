import React from 'react';
import { formatFileSize } from '../../utils/formatters';
import { getExtension } from '../../utils/fileUtils';

/**
 * Preview grid for uploaded media files.
 */
const MediaPreview = ({ files = [], previews = [], onRemove, type = 'IMAGE' }) => {
  if (files.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {files.map((file, index) => (
        <div key={index} className="relative group">
          {/* Preview */}
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
            {type === 'IMAGE' && previews[index] && (
              <img
                src={previews[index]}
                alt={file.name}
                className="w-full h-full object-cover"
              />
            )}

            {type === 'VIDEO' && previews[index] && (
              <video
                src={previews[index]}
                className="w-full h-full object-cover"
                controls={false}
              />
            )}

            {type === 'AUDIO' && (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
            )}
          </div>

          {/* File info overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-xs">
            <p className="truncate font-medium">{file.name}</p>
            <p className="text-gray-300">{formatFileSize(file.size)}</p>
          </div>

          {/* Remove button */}
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="absolute top-2 right-2 w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Remove"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default MediaPreview;