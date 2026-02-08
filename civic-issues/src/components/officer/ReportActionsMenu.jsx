import React, { useState, useRef } from 'react';
import useClickOutside from '../../hooks/useClickOutside';
import { REPORT_STATUS, getAllowedTransitions } from '../../constants/reportStatus';

/**
 * Action menu for officer report management.
 * Shows available status transitions based on current status.
 */
const ReportActionsMenu = ({ report, onStatusChange, onReject }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useClickOutside(menuRef, () => setIsOpen(false));

  const allowedTransitions = getAllowedTransitions(report.status);

  const actions = [];

  // Mark as In Progress
  if (allowedTransitions.includes(REPORT_STATUS.IN_PROGRESS)) {
    actions.push({
      label: 'Mark as In Progress',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      onClick: () => {
        onStatusChange(REPORT_STATUS.IN_PROGRESS);
        setIsOpen(false);
      },
      color: 'text-orange-600',
    });
  }

  // Mark as Resolved
  if (allowedTransitions.includes(REPORT_STATUS.RESOLVED)) {
    actions.push({
      label: 'Mark as Resolved',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      onClick: () => {
        onStatusChange(REPORT_STATUS.RESOLVED);
        setIsOpen(false);
      },
      color: 'text-green-600',
    });
  }

  // Reject
  if (allowedTransitions.includes(REPORT_STATUS.REJECTED)) {
    actions.push({
      label: 'Reject Report',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      onClick: () => {
        onReject();
        setIsOpen(false);
      },
      color: 'text-red-600',
    });
  }

  if (actions.length === 0) {
    return null; // No actions available
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-primary"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
        Actions
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm ${action.color} hover:bg-gray-50 transition-colors`}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportActionsMenu;