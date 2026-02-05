import React from 'react';

/**
 * Displays a success message (typically at the top of a form).
 */
const SuccessMessage = ({ message, className = '' }) => {
  if (!message) return null;

  return (
    <div className={`text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 ${className}`}>
      {message}
    </div>
  );
};

export default SuccessMessage;