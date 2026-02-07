import { useState, useEffect } from 'react';
import { getActiveDepartments } from '../api/services/departmentService';

/**
 * Hook to fetch active departments.
 * Returns { departments, loading, error, refetch }
 */
const useDepartments = (autoFetch = true) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const fetchDepartments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getActiveDepartments();
      if (response?.success && response?.data?.departments) {
        setDepartments(response.data.departments);
      } else {
        throw new Error('Failed to load departments');
      }
    } catch (err) {
      console.error('Departments fetch error:', err);
      setError(err.message || 'Failed to load departments');
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchDepartments();
    }
  }, []);

  return {
    departments,
    loading,
    error,
    refetch: fetchDepartments,
  };
};

export default useDepartments;