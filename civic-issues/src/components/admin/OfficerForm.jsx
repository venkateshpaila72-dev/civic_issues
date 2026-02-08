import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import useDepartments from '../../hooks/useDepartments';
import { ERROR } from '../../constants/messages';
import { isGmail, isValidPassword } from '../../utils/validation';

/**
 * Officer creation/edit form.
 */
const OfficerForm = ({ initialData = null, onSubmit, onCancel, loading }) => {
  const { departments } = useDepartments();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    badgeNumber: '',
    departments: [],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        email: initialData.email || '',
        password: '', // Never pre-fill password
        fullName: initialData.fullName || '',
        phoneNumber: initialData.phoneNumber || '',
        badgeNumber: initialData.badgeNumber || '',
        departments: initialData.departments?.map(d => d._id || d) || [],
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleDepartmentSelect = (e) => {
    const deptId = e.target.value;
    if (deptId && !formData.departments.includes(deptId)) {
      setFormData((prev) => ({
        ...prev,
        departments: [...prev.departments, deptId],
      }));
    }
  };

  const removeDepartment = (deptId) => {
    setFormData((prev) => ({
      ...prev,
      departments: prev.departments.filter(id => id !== deptId),
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = ERROR.REQUIRED('Email');
    } else if (!isGmail(formData.email)) {
      newErrors.email = ERROR.GMAIL_ONLY;
    }

    // Password required only for new officers
    if (!initialData) {
      if (!formData.password) {
        newErrors.password = ERROR.REQUIRED('Password');
      } else if (!isValidPassword(formData.password)) {
        newErrors.password = ERROR.PASSWORD_WEAK;
      }
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = ERROR.REQUIRED('Full name');
    }

    if (!formData.badgeNumber.trim()) {
      newErrors.badgeNumber = ERROR.REQUIRED('Badge number');
    }

    if (formData.departments.length === 0) {
      newErrors.departments = 'At least one department is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      email: formData.email.trim().toLowerCase(),
      fullName: formData.fullName.trim(),
      badgeNumber: formData.badgeNumber.trim(),
      departments: formData.departments,
    };

    if (formData.phoneNumber.trim()) {
      payload.phoneNumber = formData.phoneNumber.trim();
    }

    // Only include password if it's set (creating new or changing password)
    if (formData.password) {
      payload.password = formData.password;
    }

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="officer@gmail.com"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        hint="Only Gmail addresses allowed"
        required
        disabled={!!initialData} // Email cannot be changed
      />

      {!initialData && (
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          hint="At least 6 characters"
          required
        />
      )}

      <Input
        label="Full Name"
        name="fullName"
        placeholder="John Officer"
        value={formData.fullName}
        onChange={handleChange}
        error={errors.fullName}
        required
      />

      <Input
        label="Badge Number"
        name="badgeNumber"
        placeholder="OFF-001"
        value={formData.badgeNumber}
        onChange={handleChange}
        error={errors.badgeNumber}
        required
      />

      <Input
        label="Phone Number"
        name="phoneNumber"
        type="tel"
        placeholder="9876543210"
        value={formData.phoneNumber}
        onChange={handleChange}
      />

      {/* Department Assignment */}
      <div>
        <label className="input-label">
          Assigned Departments <span className="text-red-500 ml-0.5">*</span>
        </label>
        
        <Select
          name="departmentSelect"
          value=""
          onChange={handleDepartmentSelect}
          options={departments
            .filter(d => !formData.departments.includes(d._id))
            .map(d => ({ value: d._id, label: `${d.name} (${d.code})` }))
          }
          placeholder="Add a department..."
        />

        {errors.departments && (
          <p className="input-error-msg">{errors.departments}</p>
        )}

        {/* Selected departments */}
        {formData.departments.length > 0 && (
          <div className="mt-3 space-y-2">
            {formData.departments.map((deptId) => {
              const dept = departments.find(d => d._id === deptId);
              if (!dept) return null;

              return (
                <div
                  key={deptId}
                  className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <span className="text-sm font-medium text-blue-900">
                    {dept.name} ({dept.code})
                  </span>
                  <button
                    type="button"
                    onClick={() => removeDepartment(deptId)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        {onCancel && (
          <Button type="button" variant="secondary" fullWidth onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" fullWidth loading={loading}>
          {initialData ? 'Update Officer' : 'Create Officer'}
        </Button>
      </div>
    </form>
  );
};

export default OfficerForm;