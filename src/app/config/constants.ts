export const DATE_FORMAT_LABEL = 'mm/dd/yyyy';
export const DATE_FORMAT = 'mm/dd/yyyy';
export const CORE_DATE_FORMAT = 'MM/dd/yyyy';
export const LOCAL_STORAGE_CONSTANTS = {
  'userInfo': 'userInfo',
  'landingPage': 'landingPage',
  'rolePermissions': 'rolePermissions',
  'projectId': 'projectID',
  'projectData': 'projectData',
  'projectName': 'projectName',
  'selectedAdvances': 'selectedAdvances',
  'langCode': 'languageCode',
};
export const SESSION_STORAGE_CONSTANTS = {
  'redirectUrl': 'redirectUrl',
}
export class DateFormat {
  public static EN_US_DATEFORMAT = {
    DATE_FORMAT_LABEL: 'mm/dd/yyyy',
    DATE_FORMAT: 'mm/dd/yyyy',
    RANGE_DATE_FORMAT: 'mm-dd-yyyy',
    CORE_DATE_FORMAT: 'MM-dd-yyyy',
    API_DATE_FORMAT: 'MM-dd-yyyy',
    LOCALE_ID: 'en-US'

  };
  public static ES_MX_DATEFORMAT = {
    DATE_FORMAT_LABEL: 'mm/dd/yyyy',
    DATE_FORMAT: 'mm/dd/yyyy',
    RANGE_DATE_FORMAT: 'mm-dd-yyyy',
    CORE_DATE_FORMAT: 'MM-dd-yyyy',
    API_DATE_FORMAT: 'MM-dd-yyyy',
    LOCALE_ID: 'es-MX'

  };
  public static getDateFormat() {
    let dateFormat = DateFormat.EN_US_DATEFORMAT;
    const languageCode = JSON.parse(localStorage.getItem('lslanguageCode'));
    if (languageCode) {
      const langCodeStr = languageCode.replace('-', '_');
      dateFormat = DateFormat[langCodeStr.toUpperCase() + '_' + 'DATEFORMAT'];
    }
    return dateFormat;
  }
}
export const DATE_FORMATS = DateFormat.getDateFormat();
export const DEFAULT_CURRENCY = {
  'id': '5b0c0e85583cd46d06298f41',
  'name': 'MXN'
};
export const DEFAULT_MASTER_CONFIG_CURRENCY = {
  'id': '5b0c0e85583cd46d06298f40',
  'name': 'USD'
};
export const ORIGINAL_CURRENCY = {
  'id': '',
  'text': 'Original'
};
export const DEFAULT_COMPANY = {
  'id': '5b1a7f7c514b1ec6ddb069be',
  'name': 'The Lift'
};
export const STATUS_CODES = {
  'EXPIRED_TOKEN': '403',
  'SUCCESS': '200',
  'CREATED': '201',
  'LINK_EXPIRED': '404'
};
export const CURRENCY_CONVERSION_CONST = {
  'defaultToOthers': 1,
  'othersToDefault': 2,
};
export const DEFAULT_WORKING_CURRENCY = {
  'id': '5b0c0e85583cd46d06298f40',
  'name': 'USD'
};
export const CURRENCY_CHANGE_CONST = {
  'usd': '5b0c0e85583cd46d06298f40',
  'mxn': '5b0c0e85583cd46d06298f41',
};
export const CURRENCY_CONSTANTS = [
  {
    'id': '5afd617ceca343431010eec9',
    'text': 'EUR'
  },
  {
    'id': '5b54c255a6d41473e823590f',
    'text': 'GBP'
  },
  {
    'id': '5b0c0e85583cd46d06298f41',
    'text': 'MXN'
  },
  {
    'id': '5b0c0e85583cd46d06298f40',
    'text': 'USD'
  }
];
export const COOKIES_CONSTANTS = {
  'langCode': 'languageCode',
  'authToken': 'authToken',
  'name': 'name',
  'currency': 'currency',
  'xCurrency': 'x-currency'
};
export const PROJECT_TYPES = {
  'commercial': '5af17798b25ccf5dfa42d5c8',
  'entertainment': '5af17798b25ccf5dfa42d5c7',
  'corporate': '5af17798b25ccf5dfa42d5c9'
};
export const PURCHASE_ORDER_TYPE = {
  'freelancer': 0,
  'vendor': 1,
  'location': 2,
  'talent': 5
};
export const LISTING_TYPE = {
  'purchaseOrder': 1,
  'invoice': 2
};
export const PAYEE_ACCOUNT_INFO = {
  'freelancer': 0,
  'vendor': 1,
  'location': 2,
  'individual': 3,
  'agency': 4,
};
export const FILE_SIZE = {
  'FIFTYMB': 50 * 1024 * 1024,
  'TENMB': 10 * 1024 * 1024,
  'FIVEMB': 5 * 1024 * 1024,
};

export const ROLE_PERMISSION_KEY = 'TheLift123';

export const PROJECT_DIVISION = [
  {
    id: '1',
    text: 'domestic'
  },
  {
    id: '2',
    text: 'international'
  }
];

export const SCOUTER_LIST_ACCESS = [
  // { id: ' ', text: 'All' },
  { id: '1', text: 'Yes' },
  { id: '0', text: 'No' }
];

export const PROJECT_DIVISION_CONST = {
  'domestic': 1,
  'international': 2
};
export const CFDI_CONST = {
  'factura': 0,
  'honorarious': 1
};
export const COMPANY = [
  {
    id: 1,
    name: 'The Lift'
  }, {
    id: 2,
    name: 'Televisa'
  }
];
export const INVOICE_STATUS = [
  {
    id: 0,
    text: 'underreview'
  },
  {
    id: 1,
    text: 'underreview'
  },
  {
    id: 2,
    text: 'approved'
  },
  {
    id: 3,
    text: 'rejected'
  },
  {
    id: 4,
    text: 'cancelled'
  },
];


export const CATEGORY_TYPE_CONST = {
  'category': 1,
  'location': 2
}


export const LANGUAGE_CODES = {
  'en_US': 'en-US',
  'es_MX': 'es-MX'
};
export const DEFAULT_LANGUAGE = LANGUAGE_CODES.en_US;

export const AVAILABLE_LANGUAGES = [
  { code: LANGUAGE_CODES.en_US, text: 'English' },
  { code: LANGUAGE_CODES.es_MX, text: 'Spanish' }
];

export const ACTION_TYPES = {
  'ADD': 'create',
  'VIEW': 'view',
  'EDIT': 'edit',
  'DELETE': 'delete',
  'CLONE': 'clone',
  'STATUS': 'status',
  'SAVE': 'save',
  'SAVEANDPREVIEW': 'saveAndPreview',
  'PUBLISH': 'publish',
  'IMPORT': 'import'
};

export const UI_ACCESS_PERMISSION_CONST = {
  'advancedSettings': 'advancedSettings',
  'disableFields': 'disableFields',
  'subModules': 'subModules',
  'disableActions': 'disableActions',
  'removeFields': 'removeFields',
  'removeTabs': 'removeTabs',
  'removeActions': 'removeActions'
};

export const Status = {
  'deactive': 0,
  'active': 1,
  'published': 2
};
export const State = {
  'deactivated': 'deactivated',
  'activated': 'activated',
  'published': 'published',
  'unpublished': 'unpublished'
};
export const TAG_NAME_TEXTAREA = "TEXTAREA";

export class CustomTableConfig {
  public static sortBy: String = '';
  public static sortDirection: String = 'desc';
  public static pageSize: Number = 20;
  public static pageNumber: Number = 1;
  public static totalCount: Number = 0;
  public static totalPages: Number = 0;
  public static maxPageLinkSize: Number = 10;
  public static maxSize: Number = 5;
  public static locationItemsPerPage: Number = 15;
}
export const MEDIA_TYPES = {
  'IMAGES': 1,
  'VIDEOS': 2,
  'DOCUMENTS': 3
};

export const MEDIA_SIZES = {
  'IMAGES_IN_KB': 2048,
  'IMAGES_IN_MB': '2 MB',
  'DOCUMENTS_IN_KB': 1024,
  'DOCUMENTS_IN_MB': '10 MB',
  'BYTES_50MB': 50 * 1024 * 1024,
  'BYTES_10MB': 10 * 1024 * 1024
};
export const ng2TableConfig = {
  paging: true,
  sorting: { columns: this.columns },
  filtering: { filterString: '' },
  className: ['table-striped', 'table-bordered', 'mb-0', 'd-table-fixed']
};
export const VENDOR_TYPE = [
  {
    id: 1,
    text: 'individual'
  },
  {
    id: 2,
    text: 'company'
  }

];

export const SETTLEMENT_TYPE = [
  {
    id: 0,
    text: 'freelancer'
  },
  {
    id: 1,
    text: 'vendor'
  }
  // ,
  // {
  //   id: 2,
  //   text: 'Talent'
  // }
];

export const SETTLEMENT_STATUS = [
  {
    id: -1,
    text: 'all'
  },
  {
    id: 3,
    text: 'cancelled'
  },
  {
    id: 1,
    text: 'draft'
  },
  {
    id: 2,
    text: 'settled'
  },
  {
    id: 0,
    text: 'pending'
  }
];
export const SETTLEMENT_STATUS_CONST = {
  'draft': 1,
  'settled': 2,
  'cancelled': 3
};
export const PURCHASE_ORDER_CONST = {
  freelancer: 0,
  vendor: 1,
  location: 2,
  advance: 3,
  talent: 5
};
export const ADVANCES_FOR_CONST = {
  freelancer: 0,
  vendor: 1
};
export const ROLES = [
  {
    roleId: '5ae2b1662e2ef00a92ded8ae',
    name: 'Admin'
  },
  {
    roleId: '5b0bed0b583cd46d062976b3',
    name: 'Freelancer'
  },
  {
    roleId: '5b0bed14583cd46d062976b9',
    name: 'Vendor'
  },
  {
    roleId: '4',
    name: 'International Product Head Dashboard'
  },
  {
    roleId: '5b1a2163514b1ec6ddafd722',
    name: 'CEO'
  },
  {
    roleId: '5b1a2170514b1ec6ddafd72e',
    name: 'CFO'
  },
  {
    roleId: '5b31ea957c32fb1e88e7965b',
    name: 'CCO'
  },
  {
    roleId: '5b31eab97c32fb1e88e7965c',
    name: 'Accountant'
  },
  {
    roleId: '5b238e85736608ac641207ea',
    name: 'Employee'
  },
  {
    roleId: '5b31eb8a7c32fb1e88e79660',
    name: 'Location Scouter'
  },
  {
    roleId: '5b3b1f69c2e8a9388ace300d',
    name: 'Production Coordinator'
  },
  {
    roleId: '9',
    name: 'Talent Dashboard',
  },
  {
    roleId: '10',
    name: 'Project Coordinator'
  },
  {
    roleId: '5b31ebb67c32fb1e88e79661',
    name: 'Producer'
  },
  {
    roleId: '5b31ebb67c32fb1e88e79661',
    name: 'Public Relations'
  },
  {
    roleId: '5c78deaf90ca7a3ef4241d53',
    name: 'Production Manager'
  },
  {
    roleId: '5b31ea8b7c32fb1e88e7965a',
    name: 'Director'
  },
  {
    roleId: '5b6d694f8f7c059ce705cc6a',
    name: 'Location Admin'
  },
  {
    roleId: '10',
    name: 'Project Coordinator'
  },
  {
    roleId: '5c63bf6590ca7a3ef41b976f',
    name: 'Presales'
  },
  {
    roleId: '5c63befd90ca7a3ef41b96fb',
    name: 'Public Relations'
  },
  {
    roleId: '5c88a42290ca7a3ef4297ff5',
    name: 'Associate Accountant'
  },
  {
    roleId: '5ccfff1eb146749b1569f856',
    name: 'Talent Manager'
  }
];
export const MAP_URLS = {
  STREET_VIEW_SMALL: 'https://maps.googleapis.com/maps/api/streetview?size=640x400&key=AIzaSyD2w0tbOzyLnI6RUkJQbfGQEwDeWyPiUXo&',
  STREET_VIEW_LARGE: 'https://maps.googleapis.com/maps/api/streetview?size=640x400&key=AIzaSyD2w0tbOzyLnI6RUkJQbfGQEwDeWyPiUXo&'
};
export const ROLES_CONST = {
  'headOfMarketing': '5ca2fce290ca7a3ef434535b',
  'HRcoordinator': '5ca2fcf890ca7a3ef43453a1',
  'headOfHR': '5ca2fd1390ca7a3ef43453b6',
  'officeCoordinator': '5ca2fd2590ca7a3ef43453be',
  'headOfOffice': '5ca2fd4d90ca7a3ef43453d6',
  'entertainmentCoordinator': '5ca2fd6f90ca7a3ef4345418',
  'headOfEntertainment': '5ca2fd8390ca7a3ef4345445',
  'admin': '5ae2b1662e2ef00a92ded8ae',
  'freelancer': '5b0bed0b583cd46d062976b3',
  'vendor': '5b0bed14583cd46d062976b9',
  'ceo': '5b1a2163514b1ec6ddafd722',
  'cfo': '5b1a2170514b1ec6ddafd72e',
  'cco': '5b31ea957c32fb1e88e7965b',
  'accountant': '5b31eab97c32fb1e88e7965c',
  'accountantInternalAuditor': '5b46f23679ef78a85573a14e',
  'productionController': '5b31ea827c32fb1e88e79659',
  'talent': '9',
  'producer': '5b31ebb67c32fb1e88e79661',
  'productionCoordinator': '5b3b1f69c2e8a9388ace300d',
  'employee': '5b238e85736608ac641207ea',
  'locationScouter': '5b31eb8a7c32fb1e88e79660',
  'director': '5b31ea8b7c32fb1e88e7965a',
  'locationAdmin': '5b6d694f8f7c059ce705cc6a',
  'projectCoordinator': '10',
  'presales': '5c63bf6590ca7a3ef41b976f',
  'publicRelations': '5c63befd90ca7a3ef41b96fb',
  'productionManager': '5c78deaf90ca7a3ef4241d53',
  'associateAccountant': '5c88a42290ca7a3ef4297ff5',
  'companyController': '5ca2fc5490ca7a3ef4345302',
  'bidderSenior': '5ca2fc6790ca7a3ef434530a',
  'headOfBidding': '5ca2fc8490ca7a3ef434531f',
  'researcherSenior': '5ca2fc9990ca7a3ef434532e',
  'headOfResearch': '5ca2fcb090ca7a3ef434533a',
  'marketingCoordinator': '5ca2fccc90ca7a3ef4345351',
  'talentManager': '5ccfff1eb146749b1569f856'
};
// export const ROLES_CONST = [
//   {admin: '5ae2b1662e2ef00a92ded8ae'},
//   {freelancer: '5b0bed0b583cd46d062976b3'},
//   {vendor: '5b0bed14583cd46d062976b9'},
//   {internationalProductHead: '4'},
//   {ceo: '5'},
//   {cfo: '6'},
//   {accountant: '7'},
//   'production': '5b3b1f69c2e8a9388ace300d',
//   'talent': '9',
//   'projectCoordinator': '10',
//   'producer':'5b31ebb67c32fb1e88e79661',
//   'productionCoordinator':'5b3b1f69c2e8a9388ace300d'
// ]
export const OPERATION_MODES = [
  {
    value: 1,
    name: 'Wire transfer'
  },
  {
    value: 2,
    name: 'Cash'
  },
  {
    value: 3,
    name: 'Cheque'
  },
  {
    value: 4,
    name: 'Credit card'
  }
];
export const CONTRACT_STATUS = [
  {
    id: 1,
    text: 'approved'
  },
  {
    id: 4,
    text: 'accepted'
  },
  {
    id: 5,
    text: 'notAccepted'
  }
];
export const LOCATION_TYPES = [
  {
    id: 1,
    text: 'private'
  },
  {
    id: 0,
    text: 'public'
  }
];
export const DEDUCTION_TYPES = [
  {
    id: 0,
    text: 'deductible'
  },
  {
    id: 1,
    text: 'nonDeductible'
  }
];

// {
//   value: 0,
//   name: 'expiredContracts'
// },

export const CONTRACT_STATUS_CONST = {
  'activeContracts': 1,
  'expiredContracts': 0,
  'pendingContracts': 2,
  'rejectedContracts': 3
};
export const ADVANCES_FOR_TYPE = [
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

  }
];

export const PAID_TYPES = [
  {
    label: 'selfPaid',
    value: '1'
  },
  {
    label: 'thirdParty',
    value: '2'
  }
];
export const PAID_TYPES_CONST = {
  'selfPaid': '1',
  'thirdParty': '2'
};
export const PAYMENT_TYPES_CONST = {
  'domestic': 1,
  'international': 2
};
export const PAYMENT_TYPES = [
  {
    label: 'domestic',
    value: '1'
  },
  {
    label: 'international',
    value: '2'
  }
];

export const CLASSIFICATION = [
  {
    id: 1,
    text: 'levelOne'

  },
  {
    id: 2,
    text: 'levelTwo',
  },
  {
    id: 3,
    text: 'levelThree',
  }
];

export const PROJECT_TYPES_ARR = [
  {
    text: 'commercial',
    id: '5af17798b25ccf5dfa42d5c8'
  },
  {
    text: 'corporate',
    id: '5af17798b25ccf5dfa42d5c9'
  },
  {
    text: 'entertainment',
    id: '5af17798b25ccf5dfa42d5c7'
  }
];

export const OPERATION_TYPES_ARR = [
  {
    id: '5b051d49ec27fe059b2390b6',
    text: 'cash'
  },
  {
    id: '5b051d78ec27fe059b2390be',
    text: 'creditCard'
  },
  {
    id: '5b051d2eec27fe059b2390a9',
    text: 'cheque'
  },
  {
    id: '5b051d60ec27fe059b2390b8',
    text: 'wireTransfer'
  }
];

export const CURRENCIES = [
  {
    name: 'US dollars',
    value: '1'
  },
  {
    name: 'Pounds',
    value: '2'
  },
  {
    name: 'Euros',
    value: '3'
  },
  {
    name: 'Mexican peso',
    value: '4'
  }
];

export const DOCUMENT_TYPES = {
  constancia: 1,
  ttd: 2,
  repID: 3,
  byLaw: 4,
  addressConfirmation: 5,
  imss: 6,
  others: 7,
  passport: 8
};

export const INVOICE_STATUS_FLAG = {
  underreview: 1,
  approved: 2,
  disapproved: 3,
  cancelled: 4,
  autoapproved: 5
};
export const PO_APPROVAL_CONST = {
  generated: 0,
  pending: 1,
  approved: 2,
  disapproved: 3,
  cancelled: 4,
  autoapproved: 5
};
export const PASSES_STATUS_CONST = {
  draft: 0,
  published: 1
};
export const PRE_BID_FLAG = 'preBidFlag';

export const ADVANCES_STATUS_CONST = [
  {
    text: 'all',
    id: '-1'
  },
  {
    text: 'underReview',
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
export const PO_STATUS_CONST = [
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
export const INVOICE_FOR = {
  freelancer: 0,
  vendor: 1,
  location: 2,
};
export const ADVANCE_PO_FOR = {
  freelancer: 0,
  vendor: 1,
  productionCoordinator: 2,
};
export const PAYMENT_FOR = {
  freelancer: 0,
  vendor: 1,
  location: 2,
  advance: 3,
  adjustment: 4,
  talent: 5
};

export const INVOICE_TYPE_CONST = [

  {
    text: 'freelancer',
    id: 0
  },
  {
    text: 'vendor',
    id: 1
  },
  {
    text: 'location',
    id: 2
  },
  {
    text: 'talent',
    id: 5
  }
];
export const INVOICE_STATUS_CONST = [
  {
    text: 'all',
    id: -1
  },
  {
    text: 'underReview',
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

export const ADVANCES_STATUS_FLAG = {
  generated: 0,
  underreview: 1,
  approved: 2,
  disapproved: 3,
  cancelled: 4,
  autoappved: 5
};

export const PAYMENT_STATUS = [
  {
    id: 0,
    text: 'scheduled'
  },
  {
    id: 1,
    text: 'overdue'
  },
  {
    id: 2,
    text: 'paid'
  },
  {
    id: 3,
    text: 'cancelled'
  },
  {
    id: 5,
    text: 'multiple'
  }
];

export const ERROR_CODES = {
  approvalHierarchyNotSet:400,
  duplicate_entry: 601
}
export const EVENT_TYPES = {
  'roleAccessPermission': 'roleAccessPermission',
  'loginEvent': 'login',
  'languageEvent': 'language',
  'currencyEvent': 'currency',
  'updateBudgetWokingBreadcrumbEvent': 'updateBudgetWokingBreadcrumbEvent',
  'updateProfileEvent': 'updateProfile',
  'errorDisplayEvent': 'errorDisplayEvent',
  'syncWholeProject': 'syncWholeProject',
  'currencyConversionEvent': 'currencyConversion',
  'projectDetailsEvent': 'projectDetails',
  'backToListEvent': 'backToList',
  'showBudgetModalEvent': 'showBudgetModal',
  'addBudgetEvent': 'addBudget',
  'refreshBudgetListEvent': 'refreshBudgetList',
  'manageBudgetEvent': 'manageBudget',
  'currencyResetEvent': 'currencyReset',
  'enableAddBudgetEvent': 'enableAddBudget',
  'closeModal': 'closeModal',
  'updateBidEvent': 'updateBid',
  'bidDetailsEvent': 'bidDetails',
  'budgetReportEvent': 'budgetReport',
  'budgetTableEvent': 'budgetTableEvent',
  'generateAICPEvent': 'generateAICP',
  'logoutEvent': 'logout',
  'backToMasterPO': 'backToMasterPO',
  'masterPO': 'masterPO',
  'approve': 'approve',
  'reject': 'reject',
  'onHold': 'onHold',
  'modalOpen': 'modalOpen'
};
export const ROOT_PATHS = {
  jsonFiles: 'assets/data/',
  lift: 'thelift/',
  pdfFiles: './assets/pdf/'
};
export const CONTRACT_TEMPLATE_TYPEID = 1;
export const URL_FULL_PATHS: any = {};
/**user contract url paths*/
URL_FULL_PATHS['user'] = '/user';
URL_FULL_PATHS['contractDownload'] = URL_FULL_PATHS['user'] + '/contract-download';
URL_FULL_PATHS['contractAcceptTerm'] = URL_FULL_PATHS['user'] + '/contract-accept-term';
/**projects module url paths*/
URL_FULL_PATHS['projectsUrl'] = '/projects';
URL_FULL_PATHS['syncProjectUrl'] = URL_FULL_PATHS['projectsUrl'] + '/%s' + '/sync' + '/%s';
URL_FULL_PATHS['BudgetDetailsUrl'] = URL_FULL_PATHS['projectsUrl'] + '/%s' + '/budgets' + '/%s';
URL_FULL_PATHS['invoices'] = '/invoices';
URL_FULL_PATHS['manageInvoices'] = '/invoices/%s';
URL_FULL_PATHS['removeInvoiceUrl'] = URL_FULL_PATHS['invoices'] + '/%s' + '/cancel';
URL_FULL_PATHS['paymentsUrl'] = '/payments';
URL_FULL_PATHS['purchaseOrderUrl'] = '/purchase-order';
URL_FULL_PATHS['managePurchaseOrderUrl'] = '/purchase-order/%s';
URL_FULL_PATHS['viewPurchaseOrder'] = URL_FULL_PATHS['purchaseOrderUrl'] + '/view/%s';
URL_FULL_PATHS['aicpUrl'] = URL_FULL_PATHS['BudgetDetailsUrl'] + '/aicp-view';
URL_FULL_PATHS['invoicesHistory'] = '/invoices/history';
URL_FULL_PATHS['projectsListUrl'] = 'filters/projects';
URL_FULL_PATHS['paymentProjectsListUrl'] = 'filters/payment-projects';
URL_FULL_PATHS['masterConFigCurrencyURL'] = 'filters/currency';
URL_FULL_PATHS['projectMasterConfigurationURL'] = '/project-master-configuration';
URL_FULL_PATHS['projectMasterConfigurationApprovalHeirarchyURL'] = URL_FULL_PATHS['projectMasterConfigurationURL'] + '/approval-hierarchy/%s';
URL_FULL_PATHS['projectMasterConfigurationApprovalHeirarchyURL1'] = URL_FULL_PATHS['projectMasterConfigurationURL'] + '/approval-hierarchy';

URL_FULL_PATHS['masterConfiguration'] = '/master-configuration';
URL_FULL_PATHS['masterConfigurationApprovalHeirarchyURL'] = URL_FULL_PATHS['masterConfiguration'] + '/approval-hierarchy';
URL_FULL_PATHS['poMasterUrl'] = '/purchase-order/master';
URL_FULL_PATHS['invoiceMasterUrl'] = '/invoices/master';
URL_FULL_PATHS['activeProjectsUrl'] = '/filters/po-projects';
URL_FULL_PATHS['supplierListUrl'] = '/filters/freelancer-vendor';
URL_FULL_PATHS['masterPOExcelUrl'] = '/purchase-order/master/export';
URL_FULL_PATHS['paymentsTotalUrl'] = '/payments/payments-sum';
URL_FULL_PATHS['approvePo'] = URL_FULL_PATHS['purchaseOrderUrl'] + '/%s' + '/approve';
URL_FULL_PATHS['rejectPo'] = URL_FULL_PATHS['purchaseOrderUrl'] + '/%s' + '/reject';
URL_FULL_PATHS['onhold'] = URL_FULL_PATHS['purchaseOrderUrl'] + '/%s' + '/pending';
URL_FULL_PATHS['approveInvoice'] = URL_FULL_PATHS['invoices'] + '/%s' + '/approve';
URL_FULL_PATHS['rejectInvoice'] = URL_FULL_PATHS['invoices'] + '/%s' + '/reject';
URL_FULL_PATHS['onHoldInvoice'] = URL_FULL_PATHS['invoices'] + '/%s' + '/pending';
URL_FULL_PATHS['approveAdvancePayment'] = URL_FULL_PATHS['purchaseOrderUrl'] + '/%s' + '/payment/approve';
URL_FULL_PATHS['rejectAdvancePayment'] = URL_FULL_PATHS['purchaseOrderUrl'] + '/%s' + '/payment/reject';
URL_FULL_PATHS['preBidRolesURL'] = '/filters/roles/prebid',
URL_FULL_PATHS['preBidUserURL'] =  'filters/users',

URL_FULL_PATHS['budgetListUrl'] = URL_FULL_PATHS['projectsUrl'] + '/%s' + '/budgets';

/**Bid module url paths*/
URL_FULL_PATHS['dealsURL'] = '/projects';
URL_FULL_PATHS['projectInputs'] = 'projectInputs' + '/%s';
URL_FULL_PATHS['passesListUrl'] = '/passes';
URL_FULL_PATHS['talentURL'] = '/talent';
URL_FULL_PATHS['editingAndPostURL'] = '/editingAndPost';
URL_FULL_PATHS['passesURL'] = '/passes';
URL_FULL_PATHS['passesInfoURL'] = URL_FULL_PATHS['passesURL'] + '/info';
URL_FULL_PATHS['organizationListURL'] = '/pipedrive/organizations';
URL_FULL_PATHS['contactPersonsListURL'] = '/pipedrive/persons';
URL_FULL_PATHS['leadsURL'] = '/leads';
URL_FULL_PATHS['leadsDetailsURL'] = URL_FULL_PATHS['leadsURL'] + '/%s';
URL_FULL_PATHS['createBidURL'] = '/projects';
URL_FULL_PATHS['convertToProject'] = URL_FULL_PATHS['dealsURL'] + '/%s' +'/convert' + '/%s';

/** LOcation module url Paths */
URL_FULL_PATHS['locationCategories'] = 'location-categories';
URL_FULL_PATHS['manageLocationCategories'] = 'location-categories' + '/%s';
URL_FULL_PATHS['location'] = '/location';
URL_FULL_PATHS['addLocationName'] = URL_FULL_PATHS['location'] + '/add';
URL_FULL_PATHS['manageLocation'] = URL_FULL_PATHS['location'] + '/%s';
URL_FULL_PATHS['locationsUrl'] = '/location';
URL_FULL_PATHS['locationStates'] = URL_FULL_PATHS['locationsUrl'] + '/states';
URL_FULL_PATHS['locationCities'] = URL_FULL_PATHS['locationsUrl'] + '/cities';
URL_FULL_PATHS['images'] = URL_FULL_PATHS['manageLocation'] + '/images';
URL_FULL_PATHS['locationTags'] = URL_FULL_PATHS['locationsUrl'] + '/tags';
URL_FULL_PATHS['deleteLocationUrl'] = URL_FULL_PATHS['location'] + '/%s';
URL_FULL_PATHS['images1'] = '/location-images';
URL_FULL_PATHS['workingUrl'] = '/project-setting/working/%s';
URL_FULL_PATHS['scouterLocationAccessListURL'] = '/location-access';
URL_FULL_PATHS['scouterLocationAccessURL'] = URL_FULL_PATHS['scouterLocationAccessListURL'] + '/%s';


URL_FULL_PATHS['budgetTypesURL'] = 'filters/project-budget-types/%s';
URL_FULL_PATHS['paymentUrl'] = 'payments';
URL_FULL_PATHS['paymentDetailsUrl'] = URL_FULL_PATHS['paymentUrl'] + '/%s';
URL_FULL_PATHS['paymentHistoryURL'] = URL_FULL_PATHS['paymentUrl'] + '/payment-history';
URL_FULL_PATHS['updatePaymentsScheduleURL'] = URL_FULL_PATHS['paymentUrl'] + '/%s/schedule';
URL_FULL_PATHS['paymentsPayConfirmationURL'] = URL_FULL_PATHS['paymentUrl'] + '/%s/pay';
URL_FULL_PATHS['cancelPaymentsURL'] = URL_FULL_PATHS['paymentUrl'] + '/%s/cancel';

// download PO and Invoice URL

URL_FULL_PATHS['downloadPoURL'] = URL_FULL_PATHS['purchaseOrderUrl'] + '/generate-pdf/%s';
URL_FULL_PATHS['downloadInvoiceURL'] = URL_FULL_PATHS['invoices'] + '/generate-pdf/%s';


/**
 * Talent URL
 */
URL_FULL_PATHS['agencyURL'] = 'agency';
URL_FULL_PATHS['changeStatus'] = URL_FULL_PATHS['agencyURL'] + '/%s/status';
//Master invoice export to excel URls
URL_FULL_PATHS['exportMasterInvoices'] = URL_FULL_PATHS['invoices'] + '/master/export';

export const URL_PATHS = {
  'advancedSettingsSampleURL': ROOT_PATHS.jsonFiles + 'role-permissions/roles-advanced-settings.json',
  'headOfMarketingURL': ROOT_PATHS.jsonFiles + 'role-permissions/head-of-marketing.json',
  'HRcoordinatorURL': ROOT_PATHS.jsonFiles + 'role-permissions/HR-coordinator.json',
  'headOfHRURL': ROOT_PATHS.jsonFiles + 'role-permissions/head-of-HR.json',
  'officeCoordinatorURL': ROOT_PATHS.jsonFiles + 'role-permissions/office-coordinator.json',
  'headOfOfficeUrl': ROOT_PATHS.jsonFiles + 'role-permissions/head-of-office.json',
  'entertainmentCoordinatorUrl': ROOT_PATHS.jsonFiles + 'role-permissions/entertainment-coordinator.json',
  'headOfEntertainmentUrl': ROOT_PATHS.jsonFiles + 'role-permissions/head-of-entertainment.json',
  'talentManagerPermissions': ROOT_PATHS.jsonFiles + 'role-permissions/talent-manager.json',

  'freelancerProjectsUrl': ROOT_PATHS.jsonFiles + 'projects-list/freelancer-projects-list.json',
  'vendorProjectsUrl': ROOT_PATHS.jsonFiles + 'projects-list/vendor-projects-list.json',
  'freelancersListUrl': ROOT_PATHS.jsonFiles + 'list-freelancer.json',
  'freelancerContractUrl': ROOT_PATHS.pdfFiles + 'FreelancerContract.pdf',
  'freelancerRolePermissionsUrl': ROOT_PATHS.jsonFiles + 'role-permissions/freelancer-role-permissions.json',
  'vendorPermissionURL': ROOT_PATHS.jsonFiles + 'role-permissions/vendor-dashboard.json',
  'productionCoordinatorPermissionUrl': ROOT_PATHS.jsonFiles + 'role-permissions/production-coordinator.json',
  'accountantPermissionUrl': ROOT_PATHS.jsonFiles + 'role-permissions/accountant.json',
  'adminPermissionUrl': ROOT_PATHS.jsonFiles + 'role-permissions/admin.json',
  'producerUrl': ROOT_PATHS.jsonFiles + 'role-permissions/producer-permissions.json',
  'ceoPermissionsUrl': ROOT_PATHS.jsonFiles + 'role-permissions/ceo-dashboard-role.json',
  'cfoPermissionsUrl': ROOT_PATHS.jsonFiles + 'role-permissions/cfo-dashboard-role.json',
  'ccoPermissionsUrl': ROOT_PATHS.jsonFiles + 'role-permissions/cco.json',
  'employeePermissionsUrl': ROOT_PATHS.jsonFiles + 'role-permissions/employee.json',
  'directorPermissionsUrl': ROOT_PATHS.jsonFiles + 'role-permissions/director.json',
  'accountantInternalAuditorPermissionsUrl': ROOT_PATHS.jsonFiles + 'role-permissions/accountant-internal-auditor.json',
  'locationScouterPermissionsUrl': ROOT_PATHS.jsonFiles + 'role-permissions/location-scouter.json',
  'productionControllerPermissionsUrl': ROOT_PATHS.jsonFiles + 'role-permissions/production-controller.json',
  'locationAdminPermissionsUrl': ROOT_PATHS.jsonFiles + 'role-permissions/location-admin.json',
  'presalesPermissionsUrl': ROOT_PATHS.jsonFiles + 'role-permissions/presales.json',
  'filterPass': '/filters/all-pass',
  'publicRelationsPermissions': ROOT_PATHS.jsonFiles + 'role-permissions/public-relations.json',
  'productionManagerPermissions': ROOT_PATHS.jsonFiles + 'role-permissions/production-manager.json',
  'associateAccountantPermissions': ROOT_PATHS.jsonFiles + 'role-permissions/associate-accountant.json',
  'defaultPermissions': ROOT_PATHS.jsonFiles + 'role-permissions/default-role.json',
  'companyControllerPermissions': ROOT_PATHS.jsonFiles + 'role-permissions/company-controller.json',
  'bidderSeniorPermissions': ROOT_PATHS.jsonFiles + 'role-permissions/bidder-senior.json',
  'headOfBiddingPermissions': ROOT_PATHS.jsonFiles + 'role-permissions/head-of-bidding.json',
  'researcherSeniorPermissions': ROOT_PATHS.jsonFiles + 'role-permissions/researcher-senior.json',
  'headOfResearchPermissions': ROOT_PATHS.jsonFiles + 'role-permissions/head-of-research.json',
  'marketingCoordinatorPermissions': ROOT_PATHS.jsonFiles + 'role-permissions/marketing-coordinator.json',
  'loginUrl': 'sessions/login',
  'logOutUrl': 'sessions/logout',
  'forgotPasswordUrl': 'sessions/forgot-password',
  'resetPassowordUrl': 'sessions/reset-password',
  'currencyUrl': 'filters/currency',
  'operationModeUrl': 'filters/mode-of-operations',
  'projectTypesUrl': 'filters/project-type',
  'projectCategoriesUrl': 'filters/category/',
  'budgetTypesUrl': 'filters/budget-types',
  'fileUrl': 'file',
  'templatesUrl': 'template/',
  'locationUrl': 'location',
  'locationImageUrl': 'location-images',
  'locationCategoriesUrl': '/location-categories',
  'stepOneUrl': 'freelancer/activate',
  'stepThreeFreelancerUrl': 'freelancer/contract',
  'thirdPartyVendorsUrl': 'filters/third-party-vendors',
  'addVendor': 'vendor',
  'getVendor': 'vendor/',
  'listSettlement': 'settlement',
  'vendorActivate': 'vendor/activate/',
  'stepThreeVendorUrl': 'vendor/contract',
  'checkActivationLink': 'sessions/verify-token',
  'userInfoUrl': 'sessions/user-info',
  'projectsUrl': 'projects',
  'passesListUrl': '/passes',
  'companyUrl': 'filters/company',
  'freelancerUrl': 'freelancer',
  'poUrl': '/purchase-order',
  'budgetLine': 'filters/po-budget-line/',
  'advancebudgetLine': 'filters/advances-budget-line/',
  'budgetTypes': 'filters/project-budget-types',
  'poVendors': '/filters/purchase-order-vendor/',
  'poDefaultValues': '/purchase-order/default-value',
  'reqByValues': '/filters/requested-by/vendor',
  'poFreelancerUrl': 'filters/purchase-order-freelancer',
  'poProductionCoordinatorUrl': '/filters/purchase-order-production-co-ordinator',
  'requestedByFreelancerUrl': 'filters/requested-by/freelancer',
  'poDefaultValueUrl': 'default-value',
  'userURL': 'filters/users',
  'roleVisibilityURL': 'filters/roles/employee',
  'paymentsTermsUrl': 'payment-term',
  'projectSettingUrl': 'project-setting',
  'approvalHierarchy': 'approval-hierarchy',
  'otherDocumentsUrl': 'other-documents',
  'roles': 'filters/roles',
  'configuration': 'configuration',
  'palUrl': 'project-assignment-letter',
  'pcaUrl': 'project-contract-acceptance',
  'projectsyncUrl': 'projects/sync',
  'projectCurrenciesUrl': 'currencies',
  'cancelPO': 'cancel',
  'currencyConversionsUrl': 'currency-conversions',
  'locationsUrl': '/location',
  'locationStates': '/location/states',
  'locationCities': '/location/cities',
  'images': 'images',
  'locationTags': '/location/tags',
  'reviewListUrl': '/location/review-search',
  'review': 'review',
  'poLocations': '/filters/locations',
  'locationScouter': '/filters/location-scouters',
  'advance': 'advance',
  'advances': 'advances',
  'advancesBudgetLineUrl': 'filters/advances-budget-line',
  'advancesFreelancerUrl': 'filters/advances-freelancer',
  'advancesVendorUrl': 'filters/advances-vendor',
  'subLocationsUrl': 'sub-locations',
  'masterLocationsUrl': 'filters/master-location-po',
  'advanceSettlementUrl': 'advance-settles',
  'budgetLines': 'budget-lines',
  'invoices': '/invoices',
  'invoicesHistory': '/invoices/history',
  'currencyValidationUrl': 'currency-validation',
  'paymentsUrl': 'payments',
  'paymentHistory': 'payment-history',
  'paymentHistoryURL': 'payments/payment-history',
  'schedulePaymentsUrl': 'payments/invoices',
  'poViewUrl': '/purchase-order/view',
  'poSettlementUrl': '/posettlement',
  'budgetListUrl': '/budgets',
  'manageReviewListUrl': ROOT_PATHS.jsonFiles + 'review-list.json',

};

export const defaultDatepickerOptions = {
  openSelectorTopOfInput: false,
  showSelectorArrow: false,
  showClearDateBtn: false,
  dateFormat: DATE_FORMAT,
  disableUntil: { year: 0, month: 0, day: 0 },
  disableSince: { year: 0, month: 0, day: 0 },
  editableDateField: false,
  inline: false,
  openSelectorOnInputClick: true
};
export const defaultDateRangepickerOptions = {
  dateFormat: DATE_FORMAT,
  inline: false,
  editableDateRangeField: false,
  openSelectorOnInputClick: true
};
export const defaultDisabledDatepickerOptions = {
  openSelectorTopOfInput: false,
  showSelectorArrow: false,
  showClearDateBtn: false,
  dateFormat: DATE_FORMAT,
  disableUntil: { year: 0, month: 0, day: 0 },
  disableSince: { year: 0, month: 0, day: 0 },
  editableDateField: false,
  inline: false,
  openSelectorOnInputClick: true,
  componentDisabled: true
};

export const CONSTANCIA_OPINION_FILE_TYPES = [
  { 'type': 'pdf' }
];

// tslint:disable-next-line:max-line-length
export const ACCEPT_ATTACHMENT_FILE_FORMATS = '.xls,.xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,image/jpeg,image/jpg,image/png,image/bmp,application/pdf,text/plain,text/csv,application/vnd.ms-powerpoint,application/msword,,application/rtf,application/vnd.ms-excel,application/vnd.ms-excel.sheet.binary.macroEnabled.12,.ppt,.pptx,.doc,.docx,.rtf,.csv,.xlsb';

export const FILE_TYPES = [
  { 'type': 'jpeg' },
  { 'type': 'jpg' },
  { 'type': 'bmp' },
  { 'type': 'png' },
  { 'type': 'pdf' },
  { 'type': 'csv' },
  { 'type': 'doc' },
  { 'type': 'docx' },
  { 'type': 'ppt' },
  { 'type': 'pptx' },
  { 'type': 'rtf' },
  { 'type': 'txt' },
  { 'type': 'xls' },
  { 'type': 'xlsx' },
  { 'type': 'xlsb' }
];
export const PRESENTATION_FILE_TYPES = [

  { 'type': 'ppt' },
  { 'type': 'pptx' },

];
export const DOC_FILE_TYPES = [

  { 'type': 'doc' },
  { 'type': 'docx' },
  { 'type': 'txt' }

];
export const IMAGE_FILE_TYPES = [
  { 'type': 'jpeg' },
  { 'type': 'jpg' },
  { 'type': 'bmp' },
  { 'type': 'png' },

];
export const PDF_FILE_TYPES = [

  { 'type': 'pdf' }

];

export const SPREADSHEET_FILE_TYPES = [
  { 'type': 'csv' },
  { 'type': 'rtf' },
  { 'type': 'xls' },
  { 'type': 'xlsx' },
  { 'type': 'xlsb' }
];
export const BUDGET_SHEET_FILE_TYPES = [
  { 'type': 'xls' },
  { 'type': 'xlsx' },
  { 'type': 'xlsb' }
];

export const LOCATION_IMAGES_FILE_TYPE = [
  { 'type': 'jpeg' },
  { 'type': 'jpg' },
  { 'type': 'bmp' },
  { 'type': 'png' },
];
export const TALENT_TYPES = [
  {
    text: 'agency',
    id: 2
  },
  {
    text: 'individual',
    id: 1
  }
];
export const ZIP_NAME_TYPES_ARR = [
  {
    text: 'selectProject',
    id: 1
  },
  {
    text: 'other',
    id: 2
  }

];

export const ZIP_TYPES_ARR = {
  projectName: 1,
  other: 2

};
// export const ACCEPTED_FILE_TYPES = {

//   'type': 'application/vnd.ms-powerpoint,application/msword',
//   'type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//   'type': 'application/rtf',
//   'type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
//   'type': 'text/csv',
//   'type': ' application/vnd.ms-excel.sheet.binary.macroEnabled.12',
//   'type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
//   'type': 'image/jpeg',
//   'type': 'image/jpg',
//   'type': 'image/png',
//   'type': 'image/bmp',
//   'type': 'application/pdf',
//   'type': 'text/plain',
//   'type': 'application/vnd.ms-excel',
//   'type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

// }

export const DEFAULT_GALLERY_OPTIONS = [{
  image: false,
  thumbnails: false,
  previewCloseOnClick: true,
  previewCloseOnEsc: true,
  previewKeyboardNavigation: true,
  previewSwipe: true,
  // fullWidth:true
}];
