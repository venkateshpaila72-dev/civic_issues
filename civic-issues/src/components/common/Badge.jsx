import React from 'react';

/**
 * Badge component for status indicators.
 * Variant: primary, success, warning, danger, gray
 */
const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    danger:  'badge-danger',
    gray:    'badge-gray',
  };

  return (
    <span className={`badge ${variants[variant] || variants.gray} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;