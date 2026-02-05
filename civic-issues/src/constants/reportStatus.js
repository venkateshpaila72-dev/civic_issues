export const REPORT_STATUS = {
  SUBMITTED:   'submitted',
  IN_PROGRESS: 'in_progress',
  RESOLVED:    'resolved',
  REJECTED:    'rejected',
};

/* Valid forward transitions (same logic as backend helpers.js) */
export const VALID_REPORT_TRANSITIONS = {
  [REPORT_STATUS.SUBMITTED]:   [REPORT_STATUS.IN_PROGRESS, REPORT_STATUS.REJECTED],
  [REPORT_STATUS.IN_PROGRESS]: [REPORT_STATUS.RESOLVED,    REPORT_STATUS.REJECTED],
  [REPORT_STATUS.RESOLVED]:    [],   // terminal
  [REPORT_STATUS.REJECTED]:    [],   // terminal
};

/* UI labels & colours (Tailwind class names) */
export const REPORT_STATUS_META = {
  [REPORT_STATUS.SUBMITTED]: {
    label: 'Submitted',
    colour: 'badge-gray',
    dotColour: 'bg-gray-400',
  },
  [REPORT_STATUS.IN_PROGRESS]: {
    label: 'In Progress',
    colour: 'badge-warning',
    dotColour: 'bg-amber-500',
  },
  [REPORT_STATUS.RESOLVED]: {
    label: 'Resolved',
    colour: 'badge-success',
    dotColour: 'bg-green-500',
  },
  [REPORT_STATUS.REJECTED]: {
    label: 'Rejected',
    colour: 'badge-danger',
    dotColour: 'bg-red-500',
  },
};

/** Returns the allowed next statuses the officer can pick */
export const getAllowedTransitions = (currentStatus) =>
  VALID_REPORT_TRANSITIONS[currentStatus] || [];