import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getReportById } from '../../api/services/reportService';
import { getErrorMessage } from '../../utils/errorHandler';
import PageContainer from '../../components/layout/PageContainer';
import ReportDetailsView from '../../components/shared/ReportDetailsView';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';

const ReportDetailsPage = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await getReportById(id);
        if (response?.success && response?.data?.report) {
          setReport(response.data.report);
        } else {
          throw new Error('Report not found');
        }
      } catch (err) {
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
      <PageContainer title="Report Details">
        <Alert type="error">{error}</Alert>
        <div className="mt-4">
          <Link to="/citizen/reports">
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
        <Link to="/citizen/reports">
          <Button variant="secondary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Reports
          </Button>
        </Link>
      }
    >
      <ReportDetailsView report={report} />
    </PageContainer>
  );
};

export default ReportDetailsPage;