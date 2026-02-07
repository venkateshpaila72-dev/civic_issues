import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createReport } from '../../api/services/reportService';
import { getErrorMessage } from '../../utils/errorHandler';
import useNotification from '../../hooks/useNotification';
import PageContainer from '../../components/layout/PageContainer';
import Card from '../../components/common/Card';
import ReportForm from '../../components/citizen/ReportForm';
import { SUCCESS } from '../../constants/messages';

const CreateReportPage = () => {
  const navigate = useNavigate();
  const { success, error: showError } = useNotification();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (reportData) => {
    setSubmitting(true);
    try {
      const response = await createReport(reportData);

      if (response?.success) {
        success(SUCCESS.REPORT_CREATED);
        // Redirect to my reports page
        navigate('/citizen/reports');
      } else {
        throw new Error('Failed to create report');
      }
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer
      title="Create Report"
      subtitle="Report a civic issue in your area"
    >
      <div className="max-w-3xl">
        <Card>
          <ReportForm onSubmit={handleSubmit} loading={submitting} />
        </Card>
      </div>
    </PageContainer>
  );
};

export default CreateReportPage;