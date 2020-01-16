export const PO_APPROVAL_STATUS_CONST = {
  0: 'generated',
  1: 'pending',
  2: 'approved',
  3: 'rejected',
  4: 'cancelled',
  5: 'autoapproved',
  6: 'selfPending'
};

export const PO_APPROVAL_CONST = {
  generated: 0,
  pending: 1,
  approved: 2,
  rejected: 3,
  cancelled: 4,
  autoapproved: 5,
  selfPending: 6
};

export const MASTER_PAYMENT_STATUS_CONST = {
  0: 'scheduled',
  1: 'overdue',
  2: 'paid',
  3: 'cancelled',
  4: 'rejected'
};



export const MASTER_PAYMENT_APPROVAL_CONST = {
  all: '',
  generated: 0,
  pending: 1,
  approved: 2,
  cancelled: 3,
  rejected: 4,
  autoapproved: 5
};
export const PURCHASE_FOR_ORDER_CONST = {
  0: 'freelancer',
  1: 'vendor',
  2: 'location',
  3: 'advance',
  4: 'adjustment',
  5: 'talent'
};
export const SUPPLIER_TYPE_CONSTANTS = [
  // {
  //   'id': ' ',
  //   'text': 'all'
  // },
  {
    'id': '3',
    'text': 'advance'
  },
  {
    'id': '0',
    'text': 'freelancer'
  },
  {
    'id': '2',
    'text': 'location'
  },
  {
    'id': '5',
    'text': 'talent'
  },
  {
    'id': '1',
    'text': 'vendor'
  }
];

export const STATUS_CONSTANTS = [
  // {
  //   'id': ' ',
  //   'text': 'all'
  // },
  {
    'id': '2',
    'text': 'approved'
  },
  {
    'id': '4',
    'text': 'cancelled'
  },
  {
    'id': '1',
    'text': 'pending'
  },
  {
    'id': '3',
    'text': 'rejected'
  }, {
    'id': '6',
    'text': 'selfPending'
  }
];
