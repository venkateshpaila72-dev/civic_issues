import React from 'react';
import { REPORT_STATUS_META } from '../../constants/reportStatus';
import { formatDateTime } from '../../utils/formatters';

/**
 * Timeline showing report status history.
 */
const ReportTimeline = ({ report }) => {
  if (!report) return null;

  // Build timeline from statusHistory or current status
  const timeline = report.statusHistory || [
    {
      status: report.status,
      timestamp: report.updatedAt || report.createdAt,
      updatedBy: report.assignedOfficer || null,
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">Status Timeline</h3>
      
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

        {/* Timeline items */}
        <div className="space-y-6">
          {timeline.map((item, index) => {
            const meta = REPORT_STATUS_META[item.status] || REPORT_STATUS_META.submitted;
            const isLatest = index === timeline.length - 1;

            return (
              <div key={index} className="relative pl-10">
                {/* Dot */}
                <div className={`absolute left-0 top-1 w-8 h-8 rounded-full flex items-center justify-center ${isLatest ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <div className={`w-3 h-3 rounded-full ${meta.dotColour}`} />
                </div>

                {/* Content */}
                <div className={`${isLatest ? 'bg-blue-50' : 'bg-white'} border border-gray-200 rounded-lg p-4`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-semibold ${isLatest ? 'text-blue-900' : 'text-gray-900'}`}>
                      {meta.label}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDateTime(item.timestamp)}
                    </span>
                  </div>

                  {item.updatedBy && (
                    <p className="text-sm text-gray-600">
                      Updated by: {item.updatedBy.fullName || 'Officer'}
                    </p>
                  )}

                  {item.reason && (
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Reason:</span> {item.reason}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReportTimeline;