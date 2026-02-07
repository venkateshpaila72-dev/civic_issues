import React from 'react';
import Select from '../common/Select';
import useDepartments from '../../hooks/useDepartments';
import Loader from '../common/Loader';

/**
 * Department selector dropdown.
 * Fetches active departments and displays as options.
 */
const DepartmentSelector = ({ value, onChange, error, required = true }) => {
  const { departments, loading, error: fetchError } = useDepartments();

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Loader size="sm" />
        <span className="text-sm text-gray-500">Loading departments...</span>
      </div>
    );
  }

  if (fetchError) {
    return (
      <p className="text-sm text-red-500">Failed to load departments. Please refresh.</p>
    );
  }

  const options = departments.map((dept) => ({
    value: dept._id,
    label: `${dept.name} (${dept.code})`,
  }));

  return (
    <Select
      label="Department"
      name="departmentId"
      value={value}
      onChange={onChange}
      options={options}
      placeholder="Select a department"
      error={error}
      required={required}
      hint="Choose the department responsible for this issue"
    />
  );
};

export default DepartmentSelector;