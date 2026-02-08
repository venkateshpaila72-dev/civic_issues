import React, { useState } from 'react';
import Modal from '../common/Modal';
import TextArea from '../common/TextArea';
import Button from '../common/Button';
import { ERROR } from '../../constants/messages';

/**
 * Modal for rejecting a report with a reason.
 */
const RejectReportModal = ({ isOpen, onClose, onConfirm, loading }) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError(ERROR.REQUIRED('Rejection reason'));
      return;
    }

    onConfirm(reason.trim());
  };

  const handleClose = () => {
    setReason('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Reject Report" size="md">
      <div className="space-y-4">
        <p className="text-gray-600">
          Please provide a reason for rejecting this report. This will be visible to the citizen.
        </p>

        <TextArea
          label="Rejection Reason"
          name="reason"
          placeholder="Explain why this report is being rejected..."
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            if (error) setError('');
          }}
          error={error}
          rows={4}
          required
        />

        <div className="flex gap-3 pt-4">
          <Button variant="secondary" fullWidth onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" fullWidth onClick={handleSubmit} loading={loading}>
            Reject Report
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RejectReportModal;