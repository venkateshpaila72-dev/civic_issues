import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import TextArea from '../common/TextArea';
import Button from '../common/Button';
import { ERROR } from '../../constants/messages';

/**
 * Department creation/edit form.
 */
const DepartmentForm = ({ initialData = null, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        code: initialData.code || '',
        description: initialData.description || '',
        contactEmail: initialData.contactEmail || '',
        contactPhone: initialData.contactPhone || '',
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

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = ERROR.REQUIRED('Department name');
    }

    if (!formData.code.trim()) {
      newErrors.code = ERROR.REQUIRED('Department code');
    } else if (!/^[A-Z_]+$/.test(formData.code)) {
      newErrors.code = 'Code must be uppercase letters and underscores only';
    }

    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = ERROR.EMAIL_INVALID;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: formData.name.trim(),
      code: formData.code.trim().toUpperCase(),
      description: formData.description.trim() || undefined,
      contactEmail: formData.contactEmail.trim() || undefined,
      contactPhone: formData.contactPhone.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Department Name"
        name="name"
        placeholder="e.g., Sanitation Department"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
      />

      <Input
        label="Department Code"
        name="code"
        placeholder="e.g., SANITATION"
        value={formData.code}
        onChange={handleChange}
        error={errors.code}
        hint="Uppercase letters and underscores only"
        required
      />

      <TextArea
        label="Description"
        name="description"
        placeholder="Brief description of department responsibilities"
        value={formData.description}
        onChange={handleChange}
        rows={3}
      />

      <Input
        label="Contact Email"
        name="contactEmail"
        type="email"
        placeholder="dept@civic.gov"
        value={formData.contactEmail}
        onChange={handleChange}
        error={errors.contactEmail}
      />

      <Input
        label="Contact Phone"
        name="contactPhone"
        type="tel"
        placeholder="9876543210"
        value={formData.contactPhone}
        onChange={handleChange}
      />

      <div className="flex gap-3 pt-4">
        {onCancel && (
          <Button type="button" variant="secondary" fullWidth onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" fullWidth loading={loading}>
          {initialData ? 'Update Department' : 'Create Department'}
        </Button>
      </div>
    </form>
  );
};

export default DepartmentForm;