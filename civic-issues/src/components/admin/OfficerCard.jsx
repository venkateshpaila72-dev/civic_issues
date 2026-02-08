import React from 'react';
import Badge from '../common/Badge';
import { ACCOUNT_STATUS_META } from '../../constants/accountStatus';

/**
 * Officer card with actions.
 */
const OfficerCard = ({ officer, onEdit, onToggleStatus }) => {
  const statusMeta = ACCOUNT_STATUS_META[officer.accountStatus] || ACCOUNT_STATUS_META.active;
  const isActive = officer.accountStatus === 'active';

  return (
    <div className="card">
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          {officer.profileImage ? (
            <img src={officer.profileImage} alt={officer.fullName} className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-lg font-bold text-blue-600">
              {officer.fullName?.charAt(0)?.toUpperCase()}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate">{officer.fullName}</h3>
            <Badge variant={statusMeta.colour.replace('badge-', '')}>
              {statusMeta.label}
            </Badge>
          </div>
          <p className="text-sm text-gray-500">{officer.email}</p>
          <p className="text-sm text-gray-600 font-mono mt-1">Badge: {officer.badgeNumber}</p>
        </div>
      </div>

      {/* Assigned Departments */}
      {officer.assignedDepartments && officer.assignedDepartments.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-500 mb-2">Assigned Departments</p>
          <div className="flex flex-wrap gap-2">
            {officer.assignedDepartments.map((dept) => (
              <span
                key={dept._id || dept}
                className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
              >
                {dept.name || dept.code || dept}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-gray-100">
        <button
          onClick={onEdit}
          className="flex-1 btn-secondary text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>

        <button
          onClick={onToggleStatus}
          className={`flex-1 text-sm ${isActive ? 'btn-warning' : 'btn-success'}`}
        >
          {isActive ? 'Deactivate' : 'Activate'}
        </button>
      </div>
    </div>
  );
};

export default OfficerCard;