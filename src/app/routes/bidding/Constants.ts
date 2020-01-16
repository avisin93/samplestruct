import { ROUTER_LINKS_FULL_PATH } from '@app/config';

export const DEFAULT_CURRENCY = {
  'id': '5b0c0e85583cd46d06298f40',
  'name': 'USD'
};

export const STATUS_CODES = {
  'PENDING': true,
  'PUBLISH': 2,
  'DRAFT': 1
};

export const ERROR_CODES = {
  'PASS_NOT_FOUND': 404
};



export const TAB_CONST = {
  'basicInfo': 1,
  'businessTerms': 2,
  'productionParameters': 3,
  'talent': 4,
  'editingAndPost': 5,
  'aicp': 6,
  'passes': 7
}
export const TAB_NAME_KEYS = {
  'basicInfo': 'basicInfo',
  'businessTerms': 'businessTerms',
  'productionParameters': 'productionParameters',
  'talent': 'talent',
  'editingAndPost': 'editingAndPost',
  'aicp': 'aicp',
  'passes': 'passes'
}
export const MILEAGE_CONST = [
  { id: 1, text: 'kms' },
  { id: 2, text: 'miles' }
]
export const PERMIT_TYPES_CONST = [
  { id: 1, text: 'standard' },
  { id: 2, text: 'urgentSpecial' }
];
export const MARKUP_INSURANCE = [
  {
    'sectionName': 'Production (A to K)',
    'markup': 10,
    'insurance': 2
  },
  {
    'sectionName': 'Director Creative Fees (L)',
    'markup': 10,
    'insurance': 2
  },
  {
    'sectionName': 'Talent (M)',
    'markup': 10,
    'insurance': 2
  },
  {
    'sectionName': 'Talent Expenses (N)',
    'markup': 10,
    'insurance': 2
  },
  {
    'sectionName': 'Editorial And Post (O & P)',
    'markup': 10,
    'insurance': 2
  }
];

export const CURRENCY_CONSTANTS = [
  {
    'id': '5b0c0e85583cd46d06298f40',
    'text': 'USD'
  },
  {
    'id': '5b0c0e85583cd46d06298f41',
    'text': 'MXN'
  },
  {
    'id': '5b54c255a6d41473e823590f',
    'text': 'GBP'
  },
  {
    'id': '5afd617ceca343431010eec9',
    'text': 'EUR'
  }
];
export const BID_STATUS = [
  {
    text: 'all',
    id: -1
  },
  {
    text: 'inactive',
    id: '0'
  },
  {
    text: 'inProgress',
    id: 1
  },
  {
    text: 'won',
    id: 2
  },
  {
    text: 'lost',
    id: 3
  }
];

export const BID_STATUS_TYPE_CONSTANT = {
  'won': 2,
  'lost': 3,
  'inProgress': 1,
  'inactive': 0
};

export const BIDDING_ROUTER_LINKS_FULL_PATH: any = {};
BIDDING_ROUTER_LINKS_FULL_PATH['manageBid'] = ROUTER_LINKS_FULL_PATH['bids'] + '/manage/%s';
BIDDING_ROUTER_LINKS_FULL_PATH['manageMasterConfiguration'] = ROUTER_LINKS_FULL_PATH['bids'] + '/master-configuration';
BIDDING_ROUTER_LINKS_FULL_PATH['manageBidMasterConfiguration'] = BIDDING_ROUTER_LINKS_FULL_PATH['manageBid'] + '/master-configuration/manage-base-rate';
BIDDING_ROUTER_LINKS_FULL_PATH['manageMasterConfigBaseChart'] = ROUTER_LINKS_FULL_PATH['manageMasterConfiguration'] + '/manage-base-rate';
ROUTER_LINKS_FULL_PATH['manageMasterConfigRateChart'] = BIDDING_ROUTER_LINKS_FULL_PATH['manageMasterConfiguration'] + '/manage-rate-chart';
BIDDING_ROUTER_LINKS_FULL_PATH['biddingBasicInfo'] = BIDDING_ROUTER_LINKS_FULL_PATH['manageBid'] + '/basic-info';
BIDDING_ROUTER_LINKS_FULL_PATH['biddingBuisnessTerms'] = BIDDING_ROUTER_LINKS_FULL_PATH['manageBid'] + '/business-terms';
BIDDING_ROUTER_LINKS_FULL_PATH['biddingproductionParameters'] = BIDDING_ROUTER_LINKS_FULL_PATH['manageBid'] + '/production-parameters';
BIDDING_ROUTER_LINKS_FULL_PATH['biddingTalent'] = BIDDING_ROUTER_LINKS_FULL_PATH['manageBid'] + '/talent';
BIDDING_ROUTER_LINKS_FULL_PATH['bidEditingAndPost'] = BIDDING_ROUTER_LINKS_FULL_PATH['manageBid'] + '/editing-and-post';
BIDDING_ROUTER_LINKS_FULL_PATH['bidAicp'] = BIDDING_ROUTER_LINKS_FULL_PATH['manageBid'] + '/aicp';
BIDDING_ROUTER_LINKS_FULL_PATH['bidPasses'] = BIDDING_ROUTER_LINKS_FULL_PATH['manageBid'] + '/passes';
BIDDING_ROUTER_LINKS_FULL_PATH['manageLead'] = ROUTER_LINKS_FULL_PATH['leads'] + '/manage/%s';
BIDDING_ROUTER_LINKS_FULL_PATH['biddingApprovalHierarchy'] = ROUTER_LINKS_FULL_PATH['bidding'] + '/approval-hierarchy';
BIDDING_ROUTER_LINKS_FULL_PATH['manageBidApprovalHierarchy'] = BIDDING_ROUTER_LINKS_FULL_PATH['manageBid'] + '/approval-hierarchy';

export const BIDDING_ROUTER_LINKS = {
  'bidBasicInfo': 'basic-info',
  'manageBaseRate': 'manage-base-rate',
  'manageRateChart': 'manage-rate-chart',
  'bidEditingAndPost': 'editing-and-post',
  'bidAicp': 'aicp',
  'bidPasses': 'passes',
  'bidBusinessTerms': 'business-terms',
  'bidProductionParameters': 'production-parameters',
  'bidTalent': 'talent',
}