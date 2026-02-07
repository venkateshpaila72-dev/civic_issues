import React from 'react';
import { Link } from 'react-router-dom';
import { REPORT_STATUS_META } from '../../constants/reportStatus';
import { timeAgo } from '../../utils/formatters';
import Badge from '../common/Badge';
import EmptyState from '../common/EmptyState';

/**
 * Widget showing recent reports on citizen dashboard.
 */
const RecentReportsWidget = ({ reports = [] }) => {
  if (!reports || reports.length === 0) {
    return (
      <div className="card">
        <h3 className="card-title mb-4">Recent Reports</h3>
        <EmptyState
          title="No reports yet"
          message="Create your first report to track civic issues"
          action="Create Report"
          onAction={() => window.location.href = '/citizen/reports/create'}
        />
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Recent Reports</h3>
        <Link to="/citizen/reports" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View all
        </Link>
      </div>

      <div className="space-y-3">
        {reports.slice(0, 3).map((report) => {
          const statusMeta = REPORT_STATUS_META[report.status] || REPORT_STATUS_META.submitted;

          return (
            <Link
              key={report._id}
              to={`/citizen/reports/${report._id}`}
              className="block p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{report.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {timeAgo(report.createdAt)}
                  </p>
                </div>
                <Badge variant={statusMeta.colour.replace('badge-', '')} className="flex-shrink-0">
                  {statusMeta.label}
                </Badge>
              </div>

              {report.description && (
                <p className="text-sm text-gray-600 mt-2 truncate">
                  {report.description}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default RecentReportsWidget;