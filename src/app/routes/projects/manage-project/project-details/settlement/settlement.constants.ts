export const SETTLEMENT_APPROVAL_CONST = {
    all:'',
    draft: 0,
    pending: 1,
    approved: 2,
    rejected: 3,
    settled: 4,
    cancelled: 5
}

export const SETTLEMENT_STATUS_CONST = [
    {
        text: 'all',
        id: ''
    },
    {
        text: 'draft',
        id: 0
    },
    {
        text: 'pending',
        id: 1
    },
    {
        text: 'settled',
        id: 4
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
        id: 5
    }
]
export const SETTLEMENT_FOR_TYPE_CONST = [
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
        text: 'productionCoordinator',

    }
]
export const PURCHASE_ORDER_CONST = {
    freelancer: 0,
    vendor: 1,
    location: 2,
    advance: 3
}

export const SETTLE_FILE_TYPES = [
    { 'type': 'jpeg' },
    { 'type': 'jpg' },
    { 'type': 'bmp' },
    { 'type': 'png' },
    { 'type': 'pdf' }
  ];
