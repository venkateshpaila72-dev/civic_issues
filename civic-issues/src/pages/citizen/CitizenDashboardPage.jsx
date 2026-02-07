import React from 'react';
import { Link } from 'react-router-dom';
import { getDashboard } from '../../api/services/citizenService';
import useStatistics from '../../hooks/useStatistics';
import PageContainer from '../../components/layout/PageContainer';
import DashboardStatsCard from '../../components/citizen/DashboardStatsCard';
import RecentReportsWidget from '../../components/citizen/RecentReportsWidget';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';

const CitizenDashboardPage = () => {
  const { stats, loading, error } = useStatistics(getDashboard);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <PageContainer title="Dashboard">
        <Alert type="error">{error}</Alert>
      </PageContainer>
    );
  }

  const reportsData = stats?.reports || {};
  const emergenciesData = stats?.emergencies || {};
  const recentReports = stats?.recentReports || [];

  return (
    <PageContainer
      title="Dashboard"
      subtitle="Overview of your civic reports and emergencies"
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
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardStatsCard
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          count={reportsData.total || 0}
          label="Total Reports"
          color="blue"
        />

        <DashboardStatsCard
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          count={reportsData.pending || 0}
          label="Pending Reports"
          color="amber"
        />

        <DashboardStatsCard
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          count={reportsData.resolved || 0}
          label="Resolved Reports"
          color="green"
        />

        <DashboardStatsCard
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
          count={emergenciesData.total || 0}
          label="Emergencies"
          color="red"
        />
      </div>

      {/* Recent Reports Widget */}
      <RecentReportsWidget reports={recentReports} />
    </PageContainer>
  );
};

export default CitizenDashboardPage;