import { useState } from 'react';

/**
 * Simple form hook for managing form state and validation.
 *
 * @param {object} initialValues - Initial form values
 * @param {function} validate - Validation function (values) => errors object
 * @returns {{ values, errors, handleChange, handleSubmit, resetForm, setFieldValue, setFieldError }}
 */
const useForm = (initialValues = {}, validate = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setValues((prev) => ({ ...prev, [name]: fieldValue }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const setFieldValue = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const setFieldError = (name, error) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (onSubmit) => async (e) => {
    e.preventDefault();

    // Run validation if provided
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);

      // If errors exist, don't submit
      if (Object.keys(validationErrors).length > 0) {
        return;
      }
    }

    // Call the submit handler
    await onSubmit(values);
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
  };
};

export default useForm;