import React from 'react';
import Select from '../common/Select';
import SearchBar from '../common/SearchBar';
import { REPORT_STATUS } from '../../constants/reportStatus';

/**
 * Report filter component with status and search.
 */
const ReportFilter = ({ filters, onFilterChange }) => {
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: REPORT_STATUS.SUBMITTED, label: 'Submitted' },
    { value: REPORT_STATUS.IN_PROGRESS, label: 'In Progress' },
    { value: REPORT_STATUS.RESOLVED, label: 'Resolved' },
    { value: REPORT_STATUS.REJECTED, label: 'Rejected' },
  ];

  return (
    <div className="card">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status filter */}
        <Select
          label="Status"
          name="status"
          value={filters.status || ''}
          onChange={(e) => onFilterChange('status', e.target.value)}
          options={statusOptions}
        />

        {/* Search (future enhancement - not implemented in backend yet) */}
        <div>
          <label className="input-label">Search</label>
          <SearchBar
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            onClear={() => onFilterChange('search', '')}
            placeholder="Search reports..."
          />
        </div>
      </div>
    </div>
  );
};

export default ReportFilter;