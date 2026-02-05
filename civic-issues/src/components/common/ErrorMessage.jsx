import React from 'react';

/**
 * Displays an error message (typically at the top of a form).
 */
const ErrorMessage = ({ message, className = '' }) => {
  if (!message) return null;

  return (
    <div className={`text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 ${className}`}>
      {message}
    </div>
  );
};

export default ErrorMessage;