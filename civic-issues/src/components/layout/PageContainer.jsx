import React from 'react';

/**
 * Page container — wraps page content with consistent padding and title.
 */
const PageContainer = ({ title, subtitle, actions, children, className = '' }) => {
  return (
    <div className={`page-container ${className}`}>
      {/* Page header */}
      {(title || actions) && (
        <div className="flex items-center justify-between mb-6">
          <div>
            {title && <h1 className="page-title">{title}</h1>}
            {subtitle && <p className="page-subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
      )}

      {/* Page content */}
      {children}
    </div>
  );
};

export default PageContainer;