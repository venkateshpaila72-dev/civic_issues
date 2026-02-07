import React, { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../../api/services/citizenService';
import { getErrorMessage } from '../../utils/errorHandler';
import useAuth from '../../hooks/useAuth';
import useNotification from '../../hooks/useNotification';
import PageContainer from '../../components/layout/PageContainer';
import Card from '../../components/common/Card';
import ProfileForm from '../../components/citizen/ProfileForm';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import { SUCCESS } from '../../constants/messages';

const CitizenProfilePage = () => {
  const { updateUser } = useAuth();
  const { success, error: showError } = useNotification();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        if (response?.success && response?.data?.user) {
          setProfileData(response.data.user);
        } else {
          throw new Error('Failed to load profile');
        }
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const response = await updateProfile(formData);

      if (response?.success && response?.data?.user) {
        // Update local profile state
        setProfileData(response.data.user);

        // Update auth context
        updateUser(response.data.user);

        // Show success notification
        success(SUCCESS.PROFILE_UPDATED);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <PageContainer title="Profile">
        <Alert type="error">{error}</Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Profile"
      subtitle="Manage your account information"
    >
      <div className="max-w-2xl">
        <Card>
          <ProfileForm
            initialData={profileData}
            onSubmit={handleSubmit}
            loading={submitting}
          />
        </Card>
      </div>
    </PageContainer>
  );
};

export default CitizenProfilePage;