import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { REPORTS } from '../../api/endpoints';
import { getErrorMessage } from '../../utils/errorHandler';
import PageContainer from '../../components/layout/PageContainer';
import Alert from '../../components/common/Alert';
import Loader from '../../components/common/Loader';
import { getSelectedDept } from '../../utils/storage';

const StatisticsPage = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      setError(null);
      try {
        const departmentId = getSelectedDept();
        
        const { data } = await api.get(REPORTS.STATISTICS, {
          headers: departmentId ? { 'X-Department-Id': departmentId } : {},
        });

        if (data?.success && data?.data?.statistics) {
          setStatistics(data.data.statistics);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Statistics fetch error:', err);
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <PageContainer title="Statistics">
        <Alert type="error">{error}</Alert>
      </PageContainer>
    );
  }

  const statusStats = statistics?.byStatus || {};
  const departmentStats = statistics?.byDepartment || [];

  return (
    <PageContainer
      title="Report Statistics"
      subtitle="Department performance overview"
    >
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">{statistics?.total || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Submitted</p>
              <p className="text-2xl font-bold text-gray-900">{statusStats.submitted || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{statusStats.in_progress || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-gray-900">{statusStats.resolved || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="card-title mb-4">Status Distribution</h3>
          <div className="space-y-4">
            {Object.entries(statusStats).map(([status, count]) => {
              const total = statistics?.total || 1;
              const percentage = Math.round((count / total) * 100);
              
              const colorMap = {
                submitted: 'bg-amber-500',
                in_progress: 'bg-orange-500',
                resolved: 'bg-green-500',
                rejected: 'bg-red-500',
              };

              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700 capitalize">
                      {status.replace('_', ' ')}
                    </span>
                    <span className="text-gray-600">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colorMap[status] || 'bg-gray-500'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Department Breakdown */}
        <div className="card">
          <h3 className="card-title mb-4">Reports by Department</h3>
          {departmentStats.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No department data available</p>
          ) : (
            <div className="space-y-3">
              {departmentStats.slice(0, 5).map((dept) => (
                <div key={dept._id} className="flex items-center justify-between gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-semibold text-sm">
                        {dept.code ? dept.code.substring(0, 3) : dept.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{dept.name}</p>
                      <p className="text-xs text-gray-500 truncate">{dept.code}</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-gray-900 flex-shrink-0">{dept.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default StatisticsPage;