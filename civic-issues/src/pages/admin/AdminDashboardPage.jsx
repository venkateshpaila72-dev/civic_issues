import React from 'react';
import { Link } from 'react-router-dom';
import { getAdminDashboard } from '../../api/services/adminService';
import useStatistics from '../../hooks/useStatistics';
import PageContainer from '../../components/layout/PageContainer';
import DashboardStatsCard from '../../components/admin/DashboardStatsCard';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';

const AdminDashboardPage = () => {
  const { stats, loading, error } = useStatistics(getAdminDashboard);

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

  const departmentsData = stats?.departments || {};
  const officersData = stats?.officers || {};
  const reportsData = stats?.reports || {};
  const emergenciesData = stats?.emergencies || {};

  return (
    <PageContainer
      title="Admin Dashboard"
      subtitle="System-wide overview and management"
    >
      {/* Departments & Officers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link to="/admin/departments">
          <DashboardStatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
            count={departmentsData.total || 0}
            label="Departments"
            color="blue"
            trend={`${departmentsData.active || 0} active`}
          />
        </Link>

        <Link to="/admin/officers">
          <DashboardStatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            count={officersData.total || 0}
            label="Officers"
            color="purple"
            trend={`${officersData.active || 0} active`}
          />
        </Link>

        <Link to="/admin/reports">
          <DashboardStatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            count={reportsData.total || 0}
            label="Total Reports"
            color="amber"
            trend={`${reportsData.pending || 0} pending`}
          />
        </Link>

        <Link to="/admin/emergencies">
          <DashboardStatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
            count={emergenciesData.total || 0}
            label="Emergencies"
            color="red"
            trend={`${emergenciesData.active || 0} active`}
          />
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="card-title mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link to="/admin/departments" className="block p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">Manage Departments</p>
                  <p className="text-xs text-gray-500">Create, edit, and activate departments</p>
                </div>
              </div>
            </Link>

            <Link to="/admin/officers" className="block p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">Manage Officers</p>
                  <p className="text-xs text-gray-500">Create officers and assign departments</p>
                </div>
              </div>
            </Link>

            <Link to="/admin/reports" className="block p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">Audit Reports</p>
                  <p className="text-xs text-gray-500">View all system reports</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title mb-4">System Status</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Resolved Reports</span>
                <span className="font-medium text-gray-900">
                  {reportsData.resolved || 0} / {reportsData.total || 0}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{
                    width: `${reportsData.total > 0 ? ((reportsData.resolved || 0) / reportsData.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Active Departments</span>
                <span className="font-medium text-gray-900">
                  {departmentsData.active || 0} / {departmentsData.total || 0}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{
                    width: `${departmentsData.total > 0 ? ((departmentsData.active || 0) / departmentsData.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Active Officers</span>
                <span className="font-medium text-gray-900">
                  {officersData.active || 0} / {officersData.total || 0}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500"
                  style={{
                    width: `${officersData.total > 0 ? ((officersData.active || 0) / officersData.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default AdminDashboardPage;