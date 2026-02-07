import React from 'react';
import { timeAgo, formatDateTime, toISO } from '../../utils/formatters';

/**
 * Date formatter component — shows "2 hours ago" with full date on hover.
 */
const DateFormatter = ({ date, className = '' }) => {
  if (!date) return null;

  return (
    <time
      dateTime={toISO(date)}
      title={formatDateTime(date)}
      className={`text-gray-500 ${className}`}
    >
      {timeAgo(date)}
    </time>
  );
};

export default DateFormatter;