import React from 'react';
import { Link } from 'react-router-dom';
import { getOfficerDashboard } from '../../api/services/officerService';
import useStatistics from '../../hooks/useStatistics';
import PageContainer from '../../components/layout/PageContainer';
import DashboardStatsGrid from '../../components/officer/DashboardStatsGrid';
import ReportList from '../../components/citizen/ReportList';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';

const OfficerDashboardPage = () => {
  const { stats, loading, error } = useStatistics(getOfficerDashboard);

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

  const reportsData = {
    total: stats?.stats?.totalReports || 0,
    pending: stats?.stats?.submittedReports || 0,
    inProgress: stats?.stats?.inProgressReports || 0,
    resolved: stats?.stats?.resolvedReports || 0,
  };

  const recentReports = stats?.recentReports || [];

  return (
    <PageContainer
      title="Officer Dashboard"
      subtitle="Manage reports for your department"
      actions={
        <Link to="/officer/reports">
          <Button variant="primary">View All Reports</Button>
        </Link>
      }
    >
      {/* Stats Grid */}
      <div className="mb-8">
        <DashboardStatsGrid stats={reportsData} />
      </div>

      {/* Recent Reports */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Reports</h3>
          <Link to="/officer/reports" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all
          </Link>
        </div>

        {recentReports.length > 0 ? (
          <div className="space-y-4">
            {recentReports.slice(0, 5).map((report) => (
              <Link
                key={report._id}
                to={`/officer/reports/${report._id}`}
                className="block p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{report.title}</h4>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-1">{report.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span>Citizen: {report.citizen?.fullName}</span>
                      <span>•</span>
                      <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`badge badge-${report.status === 'resolved' ? 'success' : report.status === 'in_progress' ? 'warning' : 'gray'}`}>
                      {report.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No recent reports</p>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default OfficerDashboardPage;