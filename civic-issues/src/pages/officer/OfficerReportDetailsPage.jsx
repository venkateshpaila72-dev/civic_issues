import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOfficerReportById, updateReportStatus as updateStatusAPI, rejectReport as rejectReportAPI } from '../../api/services/officerService';
import { getErrorMessage } from '../../utils/errorHandler';
import useNotification from '../../hooks/useNotification';
import PageContainer from '../../components/layout/PageContainer';
import ReportDetailsView from '../../components/shared/ReportDetailsView';
import ReportActionsMenu from '../../components/officer/ReportActionsMenu';
import RejectReportModal from '../../components/officer/RejectReportModal';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import { SUCCESS } from '../../constants/messages';

const OfficerReportDetailsPage = () => {
  const { id } = useParams();
  const { success, error: showError } = useNotification();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const fetchReport = async () => {
    try {
      const response = await getOfficerReportById(id);
      if (response?.success && response?.data?.report) {
        setReport(response.data.report);
      } else {
        throw new Error('Report not found');
      }
    } catch (err) {
      if(err?.response?.status === 403) {
        setError('You do not have permission to view this report.');
      } else {
        setError(getErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      const response = await updateStatusAPI(id, newStatus);

      if (response?.success) {
        success(SUCCESS.REPORT_UPDATED);
        // Refresh report data
        await fetchReport();
      } else {
        throw new Error('Failed to update status');
      }
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setUpdating(false);
    }
  };

  const handleReject = async (reason) => {
    setUpdating(true);
    try {
      const response = await rejectReportAPI(id, reason);

      if (response?.success) {
        success(SUCCESS.REPORT_REJECTED);
        setShowRejectModal(false);
        // Refresh report data
        await fetchReport();
      } else {
        throw new Error('Failed to reject report');
      }
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <PageContainer title="Report Details">
        <Alert type="error">{error}</Alert>
        <div className="mt-4">
          <Link to="/officer/reports">
            <Button variant="secondary">Back to Reports</Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Report Details"
      actions={
        <div className="flex gap-3">
          <ReportActionsMenu
            report={report}
            onStatusChange={handleStatusChange}
            onReject={() => setShowRejectModal(true)}
          />
          <Link to="/officer/reports">
            <Button variant="secondary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </Button>
          </Link>
        </div>
      }
    >
      <ReportDetailsView report={report} />

      {/* Reject Modal */}
      <RejectReportModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleReject}
        loading={updating}
      />
    </PageContainer>
  );
};

export default OfficerReportDetailsPage;