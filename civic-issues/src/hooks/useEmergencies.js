import { useState, useEffect, useCallback } from 'react';
import { getMyEmergencies } from '../api/services/emergencyService';

/**
 * Hook for managing emergencies list.
 * Returns { emergencies, loading, error, refetch }
 */
const useEmergencies = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEmergencies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMyEmergencies();

      if (response?.success && response?.data) {
        setEmergencies(response.data.emergencies || []);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Emergencies fetch error:', err);
      setError(err.message || 'Failed to load emergencies');
      setEmergencies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmergencies();
  }, [fetchEmergencies]);

  return {
    emergencies,
    loading,
    error,
    refetch: fetchEmergencies,
  };
};

export default useEmergencies;