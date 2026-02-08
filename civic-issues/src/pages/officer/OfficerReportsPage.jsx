import React, { useState, useEffect, useCallback } from 'react';
import { getOfficerReports } from '../../api/services/officerService';
import { getErrorMessage } from '../../utils/errorHandler';
import PageContainer from '../../components/layout/PageContainer';
import ReportFilter from '../../components/citizen/ReportFilter';
import ReportList from '../../components/citizen/ReportList';
import Pagination from '../../components/common/Pagination';
import Alert from '../../components/common/Alert';

const OfficerReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({});

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      };

      const response = await getOfficerReports(params);

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
      setError(getErrorMessage(err));
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
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const setPage = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  return (
    <PageContainer
      title="Department Reports"
      subtitle={`${pagination.total || 0} total report${pagination.total !== 1 ? 's' : ''}`}
    >
      {error && (
        <Alert type="error" className="mb-6">
          {error}
        </Alert>
      )}

      {/* Filters */}
      <div className="mb-6">
        <ReportFilter filters={filters} onFilterChange={setFilter} />
      </div>

      {/* Reports list */}
      <ReportList reports={reports} loading={loading} />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
            hasNext={pagination.hasNextPage}
            hasPrev={pagination.hasPreviousPage}
          />
        </div>
      )}
    </PageContainer>
  );
};

export default OfficerReportsPage;