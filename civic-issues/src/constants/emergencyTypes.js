export const EMERGENCY_TYPES = {
  POLICE:   'police',
  MEDICAL:  'medical',
  FIRE:     'fire',
  DISASTER: 'disaster',
};

export const EMERGENCY_STATUS = {
  REPORTED:   'reported',
  RECEIVED:   'received',
  DISPATCHED: 'dispatched',
  RESOLVED:   'resolved',
};

/* Valid forward transitions (mirrors backend) */
export const VALID_EMERGENCY_TRANSITIONS = {
  [EMERGENCY_STATUS.REPORTED]:   [EMERGENCY_STATUS.RECEIVED],
  [EMERGENCY_STATUS.RECEIVED]:   [EMERGENCY_STATUS.DISPATCHED],
  [EMERGENCY_STATUS.DISPATCHED]: [EMERGENCY_STATUS.RESOLVED],
  [EMERGENCY_STATUS.RESOLVED]:   [],   // terminal
};

/* UI labels & colours for emergency types */
export const EMERGENCY_TYPE_META = {
  [EMERGENCY_TYPES.POLICE]: {
    label:      'Police',
    icon:       '🚔',
    colour:     'bg-blue-100 text-blue-700',
    borderCol:  'border-blue-400',
  },
  [EMERGENCY_TYPES.MEDICAL]: {
    label:      'Medical',
    icon:       '🏥',
    colour:     'bg-red-100 text-red-700',
    borderCol:  'border-red-400',
  },
  [EMERGENCY_TYPES.FIRE]: {
    label:      'Fire',
    icon:       '🔥',
    colour:     'bg-orange-100 text-orange-700',
    borderCol:  'border-orange-400',
  },
  [EMERGENCY_TYPES.DISASTER]: {
    label:      'Disaster',
    icon:       '⚠️',
    colour:     'bg-purple-100 text-purple-700',
    borderCol:  'border-purple-400',
  },
};

/* UI labels & colours for emergency statuses */
export const EMERGENCY_STATUS_META = {
  [EMERGENCY_STATUS.REPORTED]: {
    label:     'Reported',
    colour:    'badge-gray',
    dotColour: 'bg-gray-400',
  },
  [EMERGENCY_STATUS.RECEIVED]: {
    label:     'Received',
    colour:    'badge-info',
    dotColour: 'bg-blue-500',
  },
  [EMERGENCY_STATUS.DISPATCHED]: {
    label:     'Dispatched',
    colour:    'badge-warning',
    dotColour: 'bg-amber-500',
  },
  [EMERGENCY_STATUS.RESOLVED]: {
    label:     'Resolved',
    colour:    'badge-success',
    dotColour: 'bg-green-500',
  },
};

/** Dropdown options for the emergency-type selector */
export const EMERGENCY_TYPE_OPTIONS = Object.entries(EMERGENCY_TYPE_META).map(
  ([value, meta]) => ({
    value,
    label: `${meta.icon}  ${meta.label}`,
  })
);

/** Returns next allowed statuses for an officer/admin */
export const getAllowedEmergencyTransitions = (currentStatus) =>
  VALID_EMERGENCY_TRANSITIONS[currentStatus] || [];