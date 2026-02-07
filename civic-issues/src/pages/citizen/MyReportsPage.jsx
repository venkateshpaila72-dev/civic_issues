import React from 'react';
import { Link } from 'react-router-dom';
import useReports from '../../hooks/useReports';
import PageContainer from '../../components/layout/PageContainer';
import ReportFilter from '../../components/citizen/ReportFilter';
import ReportList from '../../components/citizen/ReportList';
import Pagination from '../../components/common/Pagination';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

const MyReportsPage = () => {
  const { reports, loading, error, pagination, filters, setFilter, setPage } = useReports();

  return (
    <PageContainer
      title="My Reports"
      subtitle={`${pagination.total || 0} total report${pagination.total !== 1 ? 's' : ''}`}
      actions={
        <Link to="/citizen/reports/create">
          <Button variant="primary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Report
          </Button>
        </Link>
      }
    >
      {/* Error */}
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

export default MyReportsPage;