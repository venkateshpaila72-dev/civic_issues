import { useState, useEffect } from 'react';

/**
 * Generic statistics hook.
 * Pass in a fetcher function that returns statistics data.
 *
 * @param {function} fetcherFn - Async function that fetches statistics
 * @param {boolean} autoFetch - Whether to fetch on mount (default: true)
 * @returns {{ stats, loading, error, refetch }}
 */
const useStatistics = (fetcherFn, autoFetch = true) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetcherFn();
      if (response?.success && response?.data) {
        setStats(response.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Statistics fetch error:', err);
      setError(err.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchStats();
    }
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};

export default useStatistics;