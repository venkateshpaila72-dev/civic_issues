import React from 'react';
import { useNavigate } from 'react-router-dom';
import { OFFICER_ROUTES } from '../../constants/routes';
import Loader from '../common/Loader';
import EmptyState from '../common/EmptyState';
import Badge from '../common/Badge';
import { REPORT_STATUS_META } from '../../constants/reportStatus';
import { timeAgo } from '../../utils/formatters';

const OfficerReportList = ({ reports, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader size="lg" />
      </div>
    );
  }

  if (!reports || reports.length === 0) {
    return (
      <EmptyState
        title="No reports found"
        message="No reports match your current filters, or there are no reports assigned to your department."
      />
    );
  }

  const handleReportClick = (reportId) => {
    navigate(OFFICER_ROUTES.REPORT_DETAIL(reportId));
  };

  return (
    <div className="space-y-4">
      {reports.map((report) => {
        const statusMeta = REPORT_STATUS_META[report.status] || REPORT_STATUS_META.submitted;

        return (
          <div
            key={report._id}
            onClick={() => handleReportClick(report._id)}
            className="card hover:shadow-lg transition-shadow cursor-pointer"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant={statusMeta.colour.replace('badge-', '')}>
                    {statusMeta.label}
                  </Badge>
                  {report.priority && report.priority !== 'medium' && (
                    <Badge variant={report.priority === 'high' || report.priority === 'critical' ? 'red' : 'gray'}>
                      {report.priority}
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{report.title}</h3>
                <p className="text-gray-700 line-clamp-2">{report.description}</p>
              </div>

              <div className="flex-shrink-0 text-right">
                <p className="text-sm text-gray-500">{timeAgo(report.createdAt)}</p>
                {report.reportId && (
                  <p className="text-xs text-gray-400 mt-1">{report.reportId}</p>
                )}
              </div>
            </div>

            {/* Media indicator */}
            {report.mediaCount > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{report.mediaCount} attachment{report.mediaCount !== 1 ? 's' : ''}</span>
              </div>
            )}

            {/* Location */}
            {report.location?.address && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span className="truncate">{report.location.address}</span>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center gap-4 pt-3 border-t border-gray-100 text-sm">
              {/* Citizen info */}
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Citizen: {report.citizen?.fullName || 'Unknown'}</span>
              </div>

              {/* Department */}
              {report.department && (
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>{report.department.name}</span>
                </div>
              )}

              {/* Assigned officer */}
              {report.assignedOfficer && (
                <div className="flex items-center gap-2 text-blue-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <span>Assigned: {report.assignedOfficer.fullName}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OfficerReportList;