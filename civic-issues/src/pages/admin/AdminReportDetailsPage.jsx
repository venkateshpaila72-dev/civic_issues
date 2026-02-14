import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { REPORTS } from '../../api/endpoints';
import { ADMIN_ROUTES } from '../../constants/routes';
import { getErrorMessage } from '../../utils/errorHandler';
import PageContainer from '../../components/layout/PageContainer';
import ReportDetailsView from '../../components/shared/ReportDetailsView';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import Badge from '../../components/common/Badge';

const AdminReportDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await api.get(REPORTS.BY_ID(id));

        if (data?.success && data?.data?.report) {
          setReport(data.data.report);
        } else {
          throw new Error('Report not found');
        }
      } catch (err) {
        console.error('Fetch report error:', err);
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <PageContainer title="Report Audit">
        <Alert type="error">{error}</Alert>
        <div className="mt-4">
          <Link to={ADMIN_ROUTES.REPORTS_AUDIT}>
            <Button variant="secondary">Back to Reports</Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Report Audit Details"
      subtitle={
        <div className="flex items-center gap-3 mt-2">
          <span className="text-gray-600">Read-only audit view</span>
          {report?.reportId && (
            <Badge variant="gray">{report.reportId}</Badge>
          )}
        </div>
      }
      actions={
        <div className="flex gap-3">
          <Link to={ADMIN_ROUTES.REPORTS_AUDIT}>
            <Button variant="secondary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Audit
            </Button>
          </Link>
        </div>
      }
    >
      {/* Admin-specific information panel */}
      <div className="card mb-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-1">Admin Audit View</h3>
            <p className="text-sm text-blue-700">
              This is a read-only view for administrative oversight. You can view all report details, 
              but cannot make changes. Officers manage report status and assignments.
            </p>
          </div>
        </div>
      </div>

      {/* Report metadata for admin */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Submitted By</div>
          <div className="font-semibold text-gray-900">
            {report?.citizen?.fullName || 'Unknown'}
          </div>
          {report?.citizen?.email && (
            <div className="text-sm text-gray-500">{report.citizen.email}</div>
          )}
        </div>

        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Department</div>
          <div className="font-semibold text-gray-900">
            {report?.department?.name || 'N/A'}
          </div>
          {report?.department?.code && (
            <div className="text-sm text-gray-500">{report.department.code}</div>
          )}
        </div>

        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Assigned Officer</div>
          <div className="font-semibold text-gray-900">
            {report?.assignedOfficer?.fullName || 'Not assigned'}
          </div>
          {report?.assignedOfficer?.email && (
            <div className="text-sm text-gray-500">{report.assignedOfficer.email}</div>
          )}
        </div>
      </div>

      {/* Main report details */}
      <ReportDetailsView report={report} />

      {/* Status History */}
      {report?.statusHistory && report.statusHistory.length > 0 && (
        <div className="card mt-6">
          <h3 className="card-title mb-4">Status History</h3>
          <div className="space-y-3">
            {report.statusHistory.map((history, index) => (
              <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-gray-600">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="gray">{history.status}</Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(history.changedAt).toLocaleString()}
                    </span>
                  </div>
                  {history.remarks && (
                    <p className="text-sm text-gray-600">{history.remarks}</p>
                  )}
                  {history.changedBy && (
                    <p className="text-xs text-gray-500 mt-1">
                      Changed by: {history.changedBy.fullName || 'System'}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default AdminReportDetailsPage;