import React from 'react';
import ReportCard from './ReportCard';
import EmptyState from '../common/EmptyState';
import SkeletonLoader from '../common/SkeletonLoader';

/**
 * List of reports with loading and empty states.
 */
const ReportList = ({ reports = [], loading = false }) => {
  if (loading) {
    return <SkeletonLoader type="card" count={3} />;
  }

  if (reports.length === 0) {
    return (
      <EmptyState
        title="No reports found"
        message="You haven't created any reports yet, or none match your filters."
        action="Create Report"
        onAction={() => window.location.href = '/citizen/reports/create'}
      />
    );
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <ReportCard key={report._id} report={report} />
      ))}
    </div>
  );
};

export default ReportList;