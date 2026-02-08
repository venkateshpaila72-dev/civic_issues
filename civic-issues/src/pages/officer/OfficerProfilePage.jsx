import React, { useState, useEffect } from 'react';
import { getOfficerProfile, updateOfficerProfile } from '../../api/services/officerService';
import { getErrorMessage } from '../../utils/errorHandler';
import useAuth from '../../hooks/useAuth';
import useNotification from '../../hooks/useNotification';
import PageContainer from '../../components/layout/PageContainer';
import Card from '../../components/common/Card';
import ProfileForm from '../../components/citizen/ProfileForm';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import { SUCCESS } from '../../constants/messages';

const OfficerProfilePage = () => {
    const { updateUser } = useAuth();
    const { success, error: showError } = useNotification();

    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getOfficerProfile();
                if (response?.success && response?.data?.user) {
                    setProfileData(response.data.user);

                }
                else if (response?.success && response?.data?.officer) {
                    setProfileData(response.data.officer);
                }
                else {
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
            const response = await updateOfficerProfile(formData);

            if (response?.success && response?.data?.user) {
                setProfileData(response.data.user);
                updateUser(response.data.user);
                success(SUCCESS.PROFILE_UPDATED);
            }
            else if (response?.success && response?.data?.officer) {
                setProfileData(response.data.officer);
                updateUser(response.data.officer);
                success(SUCCESS.PROFILE_UPDATED);
            }
            else {
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
                    {/* Badge Number (read-only for officers) */}
                    {profileData?.badgeNumber && (
                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-blue-900">Badge Number</p>
                                    <p className="text-lg font-bold text-blue-600">{profileData.badgeNumber}</p>
                                </div>
                            </div>
                        </div>
                    )}

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

export default OfficerProfilePage;