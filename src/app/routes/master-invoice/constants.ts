
export const INVOICE_PAYMENT_COUNT = {
    multiple: 5
};

export const INVOICE_APPROVAL_STATUS = {
    all: '',
    generated: 0,
    pending: 1,
    approved: 2,
    rejected: 3,
    cancelled: 4,
    autoapproved: 5
};

export const INVOICE_APPROVAL_ALL_STATUS_ARR = [
    {
        text: 'all',
        id: ''
    },
    {
        text: 'generated',
        id: 0
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
    },
    {
        text: 'auto approved',
        id: 5
    }
];

export const INVOICE_APPROVAL_STATUS_ARR = [
    {
        text: 'approved',
        id: 2
    },
    {
        text: 'cancelled',
        id: 4
    },
    {
        text: 'pending',
        id: 1
    },
    {
        text: 'rejected',
        id: 3
    }
];

export const INVOICE_FOR_TYPES = [
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
        text: 'talent'
    }
];

export const ONHOLD_REASONS = [
    {
        id: '5c90e99c90ca7a3ef42da5da',
        text: 'reason1',
        selected: false
    },
    {
        id: '5c90e9c090ca7a3ef42da5f0',
        text: 'reason2',
        selected: false
    },
    {
        id: '5ca5e8a590ca7a3ef435ef7c',
        text: 'reason3',
        selected: false
    },
    {
        id: '5c90e9e090ca7a3ef42da603',
        text: 'others',
        selected: false
    }
];

export const REJECTION_REASONS = [
    {
        id: '5c90ea4290ca7a3ef42da634',
        text: 'reason1',
        selected: false
    },
    {
        id: '5c90ea5990ca7a3ef42da645',
        text: 'reason2',
        selected: false
    },
    {
        id: '5ca5b84390ca7a3ef435b5f1',
        text: 'reason3',
        selected: false
    },
    {
        id: '5c90ea7890ca7a3ef42da655',
        text: 'others',
        selected: false
    }
];

export const OTHER_REASONS = {
    onhold: '5c90e9e090ca7a3ef42da603',
    rejection: '5c90ea7890ca7a3ef42da655',
};
