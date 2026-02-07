import React from 'react';
import { Link } from 'react-router-dom';
import ReportStatusBadge from '../shared/ReporStatusbadge';
import DepartmentBadge from '../shared/DepartmentBadge';
import DateFormatter from '../shared/DateFormatter';
import { truncate } from '../../utils/formatters';

/**
 * Report card component for list view.
 */
const ReportCard = ({ report }) => {
  const firstImage = report.media?.images?.[0].url;

  return (
    <Link
      to={`/citizen/reports/${report._id}`}
      className="card hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex gap-4">
        {/* Thumbnail */}
        {firstImage && (
          <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={firstImage}
              alt={report.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-semibold text-gray-900 truncate">
              {report.title}
            </h3>
            <ReportStatusBadge status={report.status} showDot />
          </div>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {truncate(report.description, 150)}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <DepartmentBadge department={report.department} />
            
            <div className="flex items-center gap-1 text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span className="truncate max-w-xs">
                {report.location?.address || 'Location not available'}
              </span>
            </div>

            <DateFormatter date={report.createdAt} className="ml-auto" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ReportCard;