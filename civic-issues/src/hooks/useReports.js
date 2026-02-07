import { useState, useEffect, useCallback } from 'react';
import { getMyReports } from '../api/services/reportService';

/**
 * Hook for managing reports list with filtering and pagination.
 * Returns { reports, loading, error, pagination, filters, setFilter, refetch }
 */
const useReports = (initialFilters = {}) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState(initialFilters);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      };

      const response = await getMyReports(params);

      if (response?.success && response?.data) {
        setReports(response.data.reports || []);
        
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Reports fetch error:', err);
      setError(err.message || 'Failed to load reports');
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const setFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to page 1 on filter change
  };

  const setPage = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  return {
    reports,
    loading,
    error,
    pagination,
    filters,
    setFilter,
    setPage,
    refetch: fetchReports,
  };
};

export default useReports;