export const ACCOUNT_STATUS = {
  ACTIVE:    'active',
  INACTIVE:  'inactive',
  SUSPENDED: 'suspended',
};

export const ACCOUNT_STATUS_META = {
  [ACCOUNT_STATUS.ACTIVE]: {
    label:  'Active',
    colour: 'badge-success',
  },
  [ACCOUNT_STATUS.INACTIVE]: {
    label:  'Inactive',
    colour: 'badge-gray',
  },
  [ACCOUNT_STATUS.SUSPENDED]: {
    label:  'Suspended',
    colour: 'badge-danger',
  },
};