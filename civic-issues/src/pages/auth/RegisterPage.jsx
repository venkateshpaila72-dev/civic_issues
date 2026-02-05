import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { register as registerAPI } from '../../api/services/authService';
import { getErrorMessage } from '../../utils/errorHandler';
import { ERROR } from '../../constants/messages';
import { isGmail, isValidPassword, passwordsMatch, isValidPhone } from '../../utils/validation';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import ErrorMessage from '../../components/common/ErrorMessage';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phoneNumber: '',
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = ERROR.REQUIRED('Full name');
    }

    if (!formData.email.trim()) {
      newErrors.email = ERROR.REQUIRED('Email');
    } else if (!isGmail(formData.email)) {
      newErrors.email = ERROR.GMAIL_ONLY;
    }

    if (!formData.password) {
      newErrors.password = ERROR.REQUIRED('Password');
    } else if (!isValidPassword(formData.password)) {
      newErrors.password = ERROR.PASSWORD_WEAK;
    }

    if (formData.password && !passwordsMatch(formData.password, formData.passwordConfirm)) {
      newErrors.passwordConfirm = ERROR.PASSWORD_MISMATCH;
    }

    if (formData.phoneNumber && !isValidPhone(formData.phoneNumber)) {
      newErrors.phoneNumber = ERROR.PHONE_INVALID;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.toLowerCase(),
        password: formData.password,
      };

      if (formData.phoneNumber.trim()) {
        payload.phoneNumber = formData.phoneNumber.trim();
      }

      const response = await registerAPI(payload);

      if (response?.success && response?.data?.token && response?.data?.user) {
        login(response.data.token, response.data.user);
        navigate('/citizen/dashboard', { replace: true });
      } else {
        setGeneralError('Registration failed. Please try again.');
      }
    } catch (error) {
      setGeneralError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create an account</h2>
        <p className="mt-1 text-sm text-gray-600">Join us to report civic issues</p>
      </div>

      {generalError && <ErrorMessage message={generalError} className="mb-4" />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          name="fullName"
          placeholder="John Doe"
          value={formData.fullName}
          onChange={handleChange}
          error={errors.fullName}
          required
        />

        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="you@gmail.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          hint="Only Gmail addresses are allowed"
          required
        />

        <Input
          label="Phone Number"
          name="phoneNumber"
          type="tel"
          placeholder="9876543210"
          value={formData.phoneNumber}
          onChange={handleChange}
          error={errors.phoneNumber}
          hint="Optional — 10-15 digits"
        />

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

        <Button type="submit" variant="primary" fullWidth loading={loading}>
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700">
          Sign in
        </Link>
      </p>
    </Card>
  );
};

export default RegisterPage;