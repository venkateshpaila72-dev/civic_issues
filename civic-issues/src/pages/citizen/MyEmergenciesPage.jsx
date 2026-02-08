import React, { useState, useEffect, useCallback } from 'react';
import { getMyEmergencies } from '../../api/services/emergencyService';
import { getErrorMessage } from '../../utils/errorHandler';
import PageContainer from '../../components/layout/PageContainer';
import Alert from '../../components/common/Alert';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Badge from '../../components/common/Badge';
import { EMERGENCY_STATUS_META } from '../../constants/emergencyTypes';
import { timeAgo } from '../../utils/formatters';
import { Link } from 'react-router-dom';

const MyEmergenciesPage = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEmergencies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMyEmergencies();

      if (response?.success && response?.data?.emergencies) {
        setEmergencies(response.data.emergencies);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Emergencies fetch error:', err);
      setError(getErrorMessage(err));
      setEmergencies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmergencies();
  }, [fetchEmergencies]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <PageContainer
      title="My Emergencies"
      subtitle={`${emergencies.length} emergency report${emergencies.length !== 1 ? 's' : ''}`}
    >
      {error && (
        <Alert type="error" className="mb-6">
          {error}
        </Alert>
      )}

      {emergencies.length === 0 ? (
        <EmptyState
          title="No emergencies reported"
          message="You haven't reported any emergencies yet"
        />
      ) : (
        <div className="space-y-4">
          {emergencies.map((emergency) => {
            const statusMeta = EMERGENCY_STATUS_META[emergency.status] || EMERGENCY_STATUS_META.reported;

            return (
              <div key={emergency._id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant={statusMeta.colour.replace('badge-', '')}>
                        {statusMeta.label}
                      </Badge>
                      <Badge variant="purple">{emergency.type}</Badge>
                    </div>
                    <p className="text-gray-700">{emergency.description}</p>
                  </div>

                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm text-gray-500">{timeAgo(emergency.createdAt)}</p>
                  </div>
                </div>

                {/* Location */}
                {emergency.location?.address && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {emergency.location.address}
                  </div>
                )}

                {/* Contact Number */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {emergency.contactNumber}
                </div>

                {/* Responding Officer */}
                {emergency.respondingOfficer && (
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      <span>Responding Officer: {emergency.respondingOfficer.fullName}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
};

export default MyEmergenciesPage;