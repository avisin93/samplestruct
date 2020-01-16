export const PO_APPROVAL_CONST = {
  all: '',
  generated: 0,
  pending: 1,
  approved: 2,
  rejected: 3,
  cancelled: 4,
  autoapproved: 5
};

export const PO_STATUS_CONST = [
  {
    text: 'all',
    id: ''
  },
  {
    text: 'pending',
    id: 1
  },
  {
    text: 'approved',
    id: 2
  },
  {
    text: 'rejected',
    id: 3
  },
  {
    text: 'cancelled',
    id: 4
  }
];
export const PO_FOR_TYPE_LABELS_CONST = [
  {
    id: 0,
    text: 'freelancer'

  },
  {
    id: 1,
    text: 'vendor',

  },
  {
    id: 2,
    text: 'location',

  },
  {
    id: 3,
    text: 'advance',

  },
  {
    id: 5,
    text: 'talent',

  }
];


export const PO_FOR_SUPPLIER_LABELS_CONST = [
  {
    id: 0,
    text: 'freelancer'

  },
  {
    id: 1,
    text: 'vendor',

  },
  {
    id: 2,
    text: 'location',

  },
  {
    id: 3,
    text: 'individual',

  },
  {
    id: 4,
    text: 'agency',

  },
  {
    id: 5,
    text: 'talent',

  }
];
export const PO_FOR_TYPE_CONST = [
  {
    id: 0,
    text: 'freelancer'

  },
  {
    id: 1,
    text: 'vendor',

  },
  {
    id: 2,
    text: 'location',

  },
  {
    id: 3,
    text: 'advance',

  },
  {
    id: 5,
    text: 'talent',

  }
];
export const PURCHASE_ORDER_CONST = {
  freelancer: 0,
  vendor: 1,
  location: 2,
  advance: 3,
  talent: 5
};
export const PAYMENT_APPROVAL_CONSTANTS = {
  scheduled: 0,
  overdue: 1,
  paid: 2,
  cancelled: 3,
  rejected: 4
};
export const PAYMENT_STATUS_CONST = [
  {
    text: 'scheduled',
    id: 0
  },
  {
    text: 'overdue',
    id: 1
  },
  {
    text: 'paid',
    id: 2
  },
  {
    text: 'cancelled',
    id: 3
  },
  {
    text: 'rejected',
    id: 4
  }
];
export const PAYMENT_HEIRARCHY_STATUS_CONST = [
  {
    text: 'pending',
    id: 1
  },
  {
    text: 'approved',
    id: 2
  },
  {
    text: 'rejected',
    id: 3
  },
  {
    text: 'cancelled',
    id: 4
  }
];
export const ONHOLD_REASONS = [
  {
    id: '5c8b5bfd90ca7a3ef42b1592',
    text: 'reason1',
    selected: false
  },
  {
    id: '5c8b5c0990ca7a3ef42b159c',
    text: 'reason2',
    selected: false
  },
  {
    id: '5c8b5c1490ca7a3ef42b15a4',
    text: 'reason3',
    selected: false
  },
  {
    id: '5c8b5c1d90ca7a3ef42b15aa',
    text: 'reason4',
    selected: false
  },
  {
    id: '5c8b5c2690ca7a3ef42b15c3',
    text: 'reason5',
    selected: false
  },
  {
    id: '5c8b5c2f90ca7a3ef42b15e7',
    text: 'reason6',
    selected: false
  },
  {
    id: '5c8b5c4190ca7a3ef42b1614',
    text: 'reason7',
    selected: false
  },
  {
    id: '5c8b5c4990ca7a3ef42b1633',
    text: 'others',
    selected: false
  }
];
export const REJECTION_REASONS = [
  {
    id: '5c8b5e6a90ca7a3ef42b19c0',
    text: 'rejectionReason1',
    selected: false
  },
  {
    id: '5c8b5e7590ca7a3ef42b19e9',
    text: 'rejectionReason2',
    selected: false
  },
  {
    id: '5c8b5e7c90ca7a3ef42b1a06',
    text: 'rejectionReason3',
    selected: false
  },
  {
    id: '5c8b5e8490ca7a3ef42b1a13',
    text: 'rejectionReason4',
    selected: false
  },
  {
    id: '5c8b5e8c90ca7a3ef42b1a1a',
    text: 'rejectionReason5',
    selected: false
  },
  {
    id: '5c8b5e9490ca7a3ef42b1a22',
    text: 'others',
    selected: false
  }
];
export const OTHER_REASONS = {
  onhold: '5c8b5c4990ca7a3ef42b1633',
  rejection: '5c8b5e9490ca7a3ef42b1a22',
};

export const YEARS = [
  { id: 0, text: '0' },
  { id: 1, text: '1' },
  { id: 2, text: '2' },
  { id: 3, text: '3' },
  { id: 4, text: '4' },
  { id: 5, text: '5' },
  { id: 6, text: '6' },
  { id: 7, text: '7' },
  { id: 8, text: '8' },
  { id: 9, text: '9' },
  { id: 10, text: '10' },
  { id: 11, text: '11' },
  { id: 12, text: '12' },
];
export const MONTHS = [
  { id: 0, text: '0' },
  { id: 1, text: '1' },
  { id: 2, text: '2' },
  { id: 3, text: '3' },
  { id: 4, text: '4' },
  { id: 5, text: '5' },
  { id: 6, text: '6' },
  { id: 7, text: '7' },
  { id: 8, text: '8' },
  { id: 9, text: '9' },
  { id: 10, text: '10' },
  { id: 11, text: '11' },
];
export const WEEKS = [
  { id: 0, text: '0' },
  { id: 1, text: '1' },
  { id: 2, text: '2' },
  { id: 3, text: '3' },
  { id: 4, text: '4' },
];
