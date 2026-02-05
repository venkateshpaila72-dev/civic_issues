import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import { ERROR } from '../../constants/messages';
import { isValidPassword, passwordsMatch } from '../../utils/validation';

/**
 * Reset Password page (accessed via email link with token).
 * Backend does NOT have this endpoint yet, so this is UI-only.
 * Will be functional once backend adds /auth/reset-password endpoint.
 */
const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ password: '', passwordConfirm: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.password) {
      newErrors.password = ERROR.REQUIRED('Password');
    } else if (!isValidPassword(formData.password)) {
      newErrors.password = ERROR.PASSWORD_WEAK;
    }

    if (formData.password && !passwordsMatch(formData.password, formData.passwordConfirm)) {
      newErrors.passwordConfirm = ERROR.PASSWORD_MISMATCH;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // TODO: Call backend /auth/reset-password once implemented
    // For now, just redirect to login
    navigate('/login');
  };

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create new password</h2>
        <p className="mt-1 text-sm text-gray-600">Enter your new password below</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="New Password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          hint="At least 6 characters"
          required
        />

        <Input
          label="Confirm Password"
          name="passwordConfirm"
          type="password"
          placeholder="••••••••"
          value={formData.passwordConfirm}
          onChange={handleChange}
          error={errors.passwordConfirm}
          required
        />

        <Button type="submit" variant="primary" fullWidth>
          Reset password
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700">
          Back to Sign in
        </Link>
      </p>
    </Card>
  );
};

export default ResetPasswordPage;