import React from 'react';

/**
 * Badge showing department name.
 */
const DepartmentBadge = ({ department, className = '' }) => {
  if (!department) return null;

  const name = typeof department === 'string' ? department : department.name;
  const code = typeof department === 'object' ? department.code : null;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm ${className}`}>
      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
      <span className="font-medium">{name}</span>
      {code && <span className="text-xs text-gray-500">({code})</span>}
    </div>
  );
};

export default DepartmentBadge;