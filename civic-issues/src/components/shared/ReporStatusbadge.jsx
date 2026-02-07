import React from 'react';
import { REPORT_STATUS_META } from '../../constants/reportStatus';
import Badge from '../common/Badge';

/**
 * Badge showing report status with color coding.
 */
const ReportStatusBadge = ({ status, showDot = false, className = '' }) => {
  const meta = REPORT_STATUS_META[status] || REPORT_STATUS_META.submitted;

  const variant = meta.colour.replace('badge-', '');

  return (
    <Badge variant={variant} className={className}>
      {showDot && (
        <span className={`w-2 h-2 rounded-full ${meta.dotColour} mr-1.5`} />
      )}
      {meta.label}
    </Badge>
  );
};

export default ReportStatusBadge;