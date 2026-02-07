import React from 'react';
import ReportStatusBadge from './ReporStatusbadge';
import DepartmentBadge from './DepartmentBadge';
import DateFormatter from './DateFormatter';
import ReportMediaGallery from './ReportMediaGallery';
import LocationMap from './LocationMap';
import ReportTimeline from './ReportTimeline';

/**
 * Complete report details view.
 */
const ReportDetailsView = ({ report }) => {
  if (!report) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {report.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3">
              <ReportStatusBadge status={report.status} showDot />
              <DepartmentBadge department={report.department} />
              <DateFormatter date={report.createdAt} className="text-sm" />
            </div>
          </div>
        </div>

        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap">
            {report.description}
          </p>
        </div>
      </div>

      {/* Media */}
      {report.media && (
        <div className="card pt-7">
          <h3 className="font-semibold text-gray-900 mb-4">
            Attachments
          </h3>
          <ReportMediaGallery media={report.media} />
        </div>
      )}

      {/* Location */}
      {report.location && (
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">
            Location
          </h3>
          <LocationMap location={report.location} />
        </div>
      )}

      {/* Timeline */}
      <div className="card">
        <ReportTimeline report={report} />
      </div>

      {/* Metadata */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4">
          Report Information
        </h3>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="font-medium text-gray-500">Report ID</dt>
            <dd className="text-gray-900 mt-1">{report._id}</dd>
          </div>

          <div>
            <dt className="font-medium text-gray-500">Created</dt>
            <dd className="text-gray-900 mt-1">
              {new Date(report.createdAt).toLocaleString('en-IN')}
            </dd>
          </div>

          <div>
            <dt className="font-medium text-gray-500">Last Updated</dt>
            <dd className="text-gray-900 mt-1">
              {new Date(report.updatedAt).toLocaleString('en-IN')}
            </dd>
          </div>

          {report.assignedOfficer && (
            <div>
              <dt className="font-medium text-gray-500">Assigned Officer</dt>
              <dd className="text-gray-900 mt-1">
                {report.assignedOfficer.fullName}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
};

export default ReportDetailsView;
