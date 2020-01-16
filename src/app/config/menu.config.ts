import { ROUTER_LINKS_FULL_PATH, ROUTER_LINKS } from './routing.config';

enum SUBMODULES_LEVEL {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
  SIX = 6,
}

export const MODULE_ID = {
  'dashboard': 1000,
  'users': 1101,
  'profile': 1102,
  'freelancers': 1103,
  'vendors': 1104,
  'talent': 1201,
  'individual': 1202,
  'agency': 1203,
  'projects': 1301,
  'pal': 1302,
  'budget': 1303,
  'budgetDetails': 1304,
  'purchaseOrder': 1305,
  'freelancerPO': 1306,
  'vendorPO': 1307,
  'locationPO': 1308,
  'advancePO': 1309,
  'talentPO': 1310,
  'settlement': 1311,
  'paymentOrder': 1312,
  'budgetSettings': 1313,
  'budgetSettingsConfiguration': 1314,
  'budgetSettingsPaymentTerms': 1315,
  'budgetSettingsApprovalHierarchy': 1316,
  'budgetSettingsCurrencies': 1317,
  'masterPurchaseOrder': 1318,
  'masterPaymentOrders': 1319,
  'payments': 1401,
  'locations': 1501,
  'category': 1502,
  'locationList': 1503,
  'review': 1504,
  'scouterAccess': 1505,
  'bidding': 1601,
  'leads': 1602,
  'bids': 1603,
  'dealMasterConfiguration': 1604,
  'dealApprovalHierarchy': 1605,
  'projectMasterConfiguration': 1606,
  'projectApprovalHierarchy': 1607,
  'bidBasicInfo': 1603,
  'bidBusinessTerms': 1603,
  'bidProductionParameters': 1603,
  'bidTalent': 1603,
  'bidEditingAndPost': 1603,
  'bidAicp': 1603,
  'bidPasses': 1603,
  'roles': 1701,
  'presentation': 1018,
  'commercial': 1202,
  'corporate': 1006,
  'entertainment': 1007,
  'settings': 1008,
  'annualContract': 1009,


  'clients': 1019,
  'employee': 1021,
  'projectDetails': 1051,
  'invoice': 1054,
  'configuration': 1056,
  'paymentTerms': 1057,
  'approvalHeirarchy': 1058,
  'currencies': 1059,
};

export const NEW_MODULE_ID = {
  'dashboard': 1000,
  'users': 1101,
  'profile': 1102,
  'freelancers': 1103,
  'vendors': 1104,
  'talent': 1201,
  'individual': 1202,
  'agency': 1203,
  'project': 1301,
  'pal': 1302,
  'budget': 1303,
  'budgetDetails': 1304,
  'purchaseOrder': 1305,
  'freelancerPO': 1306,
  'vendorPO': 1307,
  'locationPO': 1308,
  'advancePO': 1309,
  'talentPO': 1310,
  'settlement': 1311,
  'paymentOrder': 1312,
  'budgetSettings': 1313,
  'budgetSettingsConfiguration': 1314,
  'budgetSettingsPaymentTerms': 1315,
  'budgetSettingsApprovalHierarchy': 1316,
  'budgetSettingsCurrencies': 1317,
  'masterPO': 1401,
  'masterPaymentOrders': 1501,
  'payments': 1601,
  'locations': 1701,
  'categoryList': 1702,
  'locationList': 1703,
  'review': 1704,
  'scouterAccess': 1705,
  'newBid': 1801,
  'leads': 1802,
  'bids': 1803,
  'dealsMasterConfiguration': 1804,
  'dealsApprovalHierarchy': 1805,
  'bidsMasterConfiguration': 1806,
  'bidsApprovalHierarchy': 1807,
  'bidsBasicInfo': 1808,
  'bidsBusinessTerms': 1809,
  'bidsProductionParameters': 1810,
  'bidsTalent': 1811,
  'bidsEditingAndPost': 1812,
  'bidAicp': 1813,
  'bidPasses': 1814
};

// export const MODULE_ID = {
//   'dashboard': 1020,
//   'users': 1000,
//   'freelancers': 1001,
//   'vendors': 1002,
//   'talent': 1004,
//   'commercial': 1005,
//   'corporate': 1006,
//   'entertainment': 1007,
//   'settings': 1008,
//   'annualContract': 1009,
//   'profile': 1010,
//   'projects': 1011,
//   'brands': 1012,
//   'agencies': 1013,
//   'productionCompanies': 1014,
//   'locations': 1015,
//   'locationList': 1016,
//   'review': 1017,
//   'presentation': 1018,
//   'clients': 1019,
//   'employee': 1021,
//   'payments': 1022,
//   'category': 1023,
//   'bidding': 1024,
//   // 'leads': 1025,
//   // 'bids': 1026,
//   'masterPurchaseOrder': 1027,
//   'scouterAccess': 1028,
//   'masterInvoice': 1029,
//   'individual': 1030,
//   'agency': 1031,
//   'projectDetails': 1051,
//   'budget': 1052,
//   'purchaseOrder': 1053,
//   'invoice': 1054,
//   'settlement': 1055,
//   'configuration': 1056,
//   'paymentTerms': 1057,
//   'approvalHeirarchy': 1058,
//   'currencies': 1059,
//   'pal': 1060,
//   'roles': 1100,
//   // Temprorary Ids
//   'leads': 1025,
//   'bids': 1026,
//   'bidMasterConfiguration': 1024,
//   'bidApprovalHierarchy': 1024,
//   'bidMasterConfigurationBaseChart': 1024,
//   'bidMasterConfigurationRateChart': 1024,
//   'bidBasicInfo': 1024,
//   'bidBusinessTerms': 1024,
//   'bidProductionParameters': 1024,
//   'bidTalent': 1024,
//   'bidEditingAndPost': 1024,
//   'bidAicp': 1024,
//   'bidPasses': 1024

// };

const Dashboard = {
  'text': 'dashboard',
  'link': ROUTER_LINKS_FULL_PATH.dashboard,
  'icon': 'icon-speedometer',
  'moduleId': MODULE_ID.dashboard,
  'canLandingPage': true
};

const Profile = {
  'text': 'profile',
  'link': ROUTER_LINKS_FULL_PATH.profile,
  'icon': 'icon-user',
  'moduleId': MODULE_ID.profile,
  'canLandingPage': true
};

// const Annual_Contract = {
//   'text': 'annualContract',
//   'link': ROUTER_LINKS_FULL_PATH.annualContract,
//   'icon': 'fa fa-folder-open',
//   'moduleId': MODULE_ID.annualContract
// };

/**
 * Start Sub Modules of Project modules
 */
const PAL = {
  'text': 'pal',
  'moduleId': MODULE_ID.pal,
  'subModuleLevel': SUBMODULES_LEVEL.ONE,
  'canLandingPage': false
};

const Budget = {
  'text': 'budget',
  'moduleId': MODULE_ID.budget,
  'subModuleLevel': SUBMODULES_LEVEL.ONE,
  'canLandingPage': false
};

/**
 * Start Sub Modules of Budget Details
 */



const FreelancerPO = {
  'text': 'freelancerPO',
  'moduleId': MODULE_ID.freelancerPO,
  'subModuleLevel': SUBMODULES_LEVEL.FOUR,
  'canLandingPage': false
};

const VendorPO = {
  'text': 'vendorPO',
  'moduleId': MODULE_ID.vendorPO,
  'subModuleLevel': SUBMODULES_LEVEL.FOUR,
  'canLandingPage': false
};

const LocationPO = {
  'text': 'locationPO',
  'moduleId': MODULE_ID.locationPO,
  'subModuleLevel': SUBMODULES_LEVEL.FOUR,
  'canLandingPage': false
};

const AdvancePO = {
  'text': 'advancePO',
  'moduleId': MODULE_ID.advancePO,
  'subModuleLevel': SUBMODULES_LEVEL.FOUR,
  'canLandingPage': false
};

const TalentPO = {
  'text': 'talentPO',
  'moduleId': MODULE_ID.talentPO,
  'subModuleLevel': SUBMODULES_LEVEL.FOUR,
  'canLandingPage': false
};

const PurchaseOrder = {
  'text': 'purchaseOrder',
  'moduleId': MODULE_ID.purchaseOrder,
  'subModuleLevel': SUBMODULES_LEVEL.THREE,
  'canLandingPage': false
};

const Settlement = {
  'text': 'settlement',
  'moduleId': MODULE_ID.settlement,
  'subModuleLevel': SUBMODULES_LEVEL.THREE,
  'canLandingPage': false
};

const PaymentOrder = {
  'text': 'paymentOrder',
  'moduleId': MODULE_ID.paymentOrder,
  'subModuleLevel': SUBMODULES_LEVEL.THREE,
  'canLandingPage': false
};

/**
 * End Sub Modules of Budget Details Module
 */

const BudgetDetails = {
  'text': 'budgetDetails',
  'moduleId': MODULE_ID.budgetDetails,
  'subModuleLevel': SUBMODULES_LEVEL.TWO,
  'canLandingPage': false
};


/**
 * Start Sub Modules of Budget Details
 */
const BudgetSettingsConfiguration = {
  'text': 'configuration',
  'moduleId': MODULE_ID.budgetSettingsConfiguration,
  'subModuleLevel': SUBMODULES_LEVEL.THREE,
  'canLandingPage': false
};

const BudgetSettingsPaymentTerms = {
  'text': 'paymentTerms',
  'moduleId': MODULE_ID.budgetSettingsPaymentTerms,
  'subModuleLevel': SUBMODULES_LEVEL.THREE,
  'canLandingPage': false
};

const BudgetSettingsApprovalHierarchy = {
  'text': 'approvalHierarchy',
  'moduleId': MODULE_ID.budgetSettingsApprovalHierarchy,
  'subModuleLevel': SUBMODULES_LEVEL.THREE,
  'canLandingPage': false
};

const BudgetSettingsCurrencies = {
  'text': 'currencies',
  'moduleId': MODULE_ID.budgetSettingsCurrencies,
  'subModuleLevel': SUBMODULES_LEVEL.THREE,
  'canLandingPage': false
};

/**
 * End Sub Modules of Budget Settings
 */


const BudgetSettings = {
  'text': 'budgetSettings',
  'moduleId': MODULE_ID.budgetSettings,
  'subModuleLevel': SUBMODULES_LEVEL.TWO,
  'canLandingPage': false
};

/**
 * End Sub Modules of Project module
 */

const Projects = {
  'text': 'projects',
  'link': ROUTER_LINKS_FULL_PATH.projects,
  'icon': 'icon-badge',
  'moduleId': MODULE_ID.projects,
  'canLandingPage': true
};

/**
 * Start Sub Modules of Users Module
 */
const Freelancers = {
  'text': 'freelancers',
  'link': ROUTER_LINKS_FULL_PATH.freelancers,
  // 'icon': 'icon-user',
  'moduleId': MODULE_ID.freelancers,
  'subModuleLevel': SUBMODULES_LEVEL.ONE,
  'canLandingPage': true
};

const Vendors = {
  'text': 'vendors',
  'link': ROUTER_LINKS_FULL_PATH.vendors,
  // 'icon': 'fa fa-institution',
  'moduleId': MODULE_ID.vendors,
  'subModuleLevel': SUBMODULES_LEVEL.ONE,
  'canLandingPage': true
};

/**
 * End Sub Modules of Users Module
 */

const Users = {
  'text': 'users',
  'link': ROUTER_LINKS_FULL_PATH.users,
  'icon': 'icon-user',
  'moduleId': MODULE_ID.users,
  'submenu': [Freelancers, Vendors],
  'canLandingPage': false
};

const Agency = {
  'text': 'agency',
  'link': ROUTER_LINKS_FULL_PATH.agency,
  // 'icon': 'icon-user',
  'moduleId': MODULE_ID.agency,
  'subModuleLevel': SUBMODULES_LEVEL.ONE,
  'canLandingPage': true
};

const Individual = {
  'text': 'individual',
  'link': ROUTER_LINKS_FULL_PATH.individual,
  // 'icon': 'icon-user',
  'moduleId': MODULE_ID.individual,
  'subModuleLevel': SUBMODULES_LEVEL.ONE,
  'canLandingPage': true
};

const Talent = {
  'text': 'talent',
  'link': ROUTER_LINKS_FULL_PATH.talent,
  'icon': 'icon-user',
  'moduleId': MODULE_ID.talent,
  'submenu': [Agency, Individual],
  'canLandingPage': false
};

// const Commercial = {
//   'text': 'commercial',
//   'link': ROUTER_LINKS_FULL_PATH.commercial,
//   // 'icon': 'icon-user',
//   'moduleId': MODULE_ID.commercial
// };

// const Corporate = {
//   'text': 'corporate',
//   'link': ROUTER_LINKS_FULL_PATH.corporate,
//   // 'icon': 'icon-user',
//   'moduleId': MODULE_ID.corporate
// };

// const Entertainment = {
//   'text': 'entertainment',
//   'link': ROUTER_LINKS_FULL_PATH.entertainment,
//   // 'icon': 'icon-user',
//   'moduleId': MODULE_ID.entertainment
// };

// const Settings = {
//   'text': 'settings',
//   'link': ROUTER_LINKS_FULL_PATH.settings,
//   'icon': 'fa fa-cogs',
//   'moduleId': MODULE_ID.settings,
//   'submenu': [Corporate, Commercial, Entertainment]
// };

// const Brands = {
//   'text': 'brands',
//   'link': ROUTER_LINKS_FULL_PATH.brands,
//   // 'icon': 'icon-location-pin',
//   'moduleId': MODULE_ID.brands
// };
// const Agencies = {
//   'text': 'agencies',
//   'link': ROUTER_LINKS_FULL_PATH.agencies,
//   // 'icon': 'icon-user',
//   'moduleId': MODULE_ID.agencies
// };
// const Production_Companies = {
//   'text': 'productionCompanies',
//   'link': ROUTER_LINKS_FULL_PATH.productionCompanies,
//   // 'icon': 'icon-user',
//   'moduleId': MODULE_ID.productionCompanies
// };

// const Clients = {
//   'text': 'clients',
//   'link': ROUTER_LINKS_FULL_PATH.entertainment,
//   'icon': 'icon-people',
//   'moduleId': MODULE_ID.entertainment,
//   'submenu': [Brands, Agencies, Production_Companies]
// };

/**
 * Sub Menu of Locations
 */
const LocationList = {
  'text': 'locationList',
  'link': ROUTER_LINKS_FULL_PATH.locationsView,
  'moduleId': MODULE_ID.locationList,
  'subModuleLevel': SUBMODULES_LEVEL.ONE,
  'canLandingPage': true
};

/**
 * Sub Menu of Locations
 */
const Review = {
  'text': 'review',
  'link': ROUTER_LINKS_FULL_PATH.review,
  'moduleId': MODULE_ID.review,
  'subModuleLevel': SUBMODULES_LEVEL.ONE,
  'canLandingPage': true
};

/**
 * Sub Menu of Locations
 */
// const Presentation = {
//   'text': 'presentation',
//   'link': ROUTER_LINKS_FULL_PATH.presentation,
//   'moduleId': MODULE_ID.presentation
// };

/**
 * Sub Menu of Locations
 */
const CategoryList = {
  'text': 'categoryList',
  'link': ROUTER_LINKS_FULL_PATH.category,
  'moduleId': MODULE_ID.category,
  'subModuleLevel': SUBMODULES_LEVEL.ONE,
  'canLandingPage': true
};

/**
 * Sub Menu of Locations
 */
const ScouterAccess = {
  'text': 'scouterAccess',
  'link': ROUTER_LINKS_FULL_PATH.scouters,
  'moduleId': MODULE_ID.scouterAccess,
  'subModuleLevel': SUBMODULES_LEVEL.ONE,
  'canLandingPage': true
};

/**
 * Main Menu of Locations
 */
const Locations = {
  'text': 'locations',
  'link': ROUTER_LINKS_FULL_PATH.locations,
  'icon': 'icon-location-pin',
  'moduleId': MODULE_ID.locations,
  'submenu': [CategoryList, LocationList, Review, ScouterAccess],
  'canLandingPage': false
};

/**
 * Main Menu of Master Purchase Orders
 */
const MasterPurchaseOrder = {
  'text': 'po',
  'link': ROUTER_LINKS_FULL_PATH.masterPO,
  'icon': 'fa fa-book',
  'moduleId': MODULE_ID.masterPurchaseOrder,
  'canLandingPage': true
};

/**
 * Main Menu of Master Payment Orders
 */
const MasterInvoice = {
  'text': 'paymentOrder',
  'link': ROUTER_LINKS_FULL_PATH.masterPaymentOrder,
  'icon': 'fa fa-clipboard',
  'moduleId': MODULE_ID.masterPaymentOrders,
  'canLandingPage': true
};

/**
 * Main Menu of Payments
 */
const Payments = {
  'text': 'payments',
  'link': ROUTER_LINKS_FULL_PATH.payments,
  'icon': 'fa fa-usd',
  'moduleId': MODULE_ID.payments,
  'canLandingPage': true
};

/**
 * Sub Menu of Lead List
 */
const LeadList = {
  'text': 'leadList',
  'link': ROUTER_LINKS_FULL_PATH.leads,
  // 'icon': 'icon-user',
  'moduleId': MODULE_ID.leads,
  'subModuleLevel': SUBMODULES_LEVEL.ONE,
  'canLandingPage': true
};



/**
 * Start Sub modules of Bid  module
 */


const DealMasterConfiguration = {
  'text': 'dealMasterConfiguration',
  'moduleId': MODULE_ID.dealMasterConfiguration,
  'subModuleLevel': SUBMODULES_LEVEL.TWO,
  'canLandingPage': false
};

const DealApprovalHierarchy = {
  'text': 'dealApprovalHierarchy',
  'moduleId': MODULE_ID.dealApprovalHierarchy,
  'subModuleLevel': SUBMODULES_LEVEL.TWO,
  'canLandingPage': false
};
const ProjectMasterConfiguration = {
  'text': 'projectMasterConfiguration',
  'moduleId': MODULE_ID.projectMasterConfiguration,
  'subModuleLevel': SUBMODULES_LEVEL.TWO,
  'canLandingPage': false
};

const ProjectApprovalHierarchy = {
  'text': 'projectApprovalHierarchy',
  'moduleId': MODULE_ID.projectApprovalHierarchy,
  'subModuleLevel': SUBMODULES_LEVEL.TWO,
  'canLandingPage': false
};
/**
 * End Sub modules of Bid  module
 */


/**
 * Sub Menu of Bid List
 */
const BidList = {
  'text': 'bidList',
  'link': ROUTER_LINKS_FULL_PATH.bids,
  // 'icon': 'fa fa-institution',
  'moduleId': MODULE_ID.bids,
  'subModuleLevel': SUBMODULES_LEVEL.ONE,
  'canLandingPage': true
};

/**
 * Main Menu of Bidding
 */
const Bidding = {
  'text': 'bidding',
  'link': ROUTER_LINKS_FULL_PATH.bidding,
  'icon': 'fa fa-gavel',
  'moduleId': MODULE_ID.bidding,
  'submenu': [LeadList, BidList],
  'canLandingPage': false
};

const Roles = {
  'text': 'roles',
  'link': ROUTER_LINKS_FULL_PATH.roles,
  'icon': 'icon-key',
  'moduleId': MODULE_ID.roles,
  'canLandingPage': true
};


export const MENU_CONFIG = [
  Dashboard,
  Bidding,
  Profile,
  Users,
  Talent,
  Projects,
  MasterPurchaseOrder,
  MasterInvoice,
  Payments,
  // Settings,
  Locations,
  Roles
];


export const MENU_CONFIG_ALL_MENUS = [
  Dashboard,
  Bidding,
  LeadList,
  BidList,
  DealMasterConfiguration,
  DealApprovalHierarchy,
  ProjectMasterConfiguration,
  ProjectApprovalHierarchy,
  Profile,
  Users,
  Freelancers,
  Vendors,
  Talent,
  Agency,
  Individual,
  Projects,
  PAL,
  Budget,
  BudgetDetails,
  PurchaseOrder,
  AdvancePO,
  FreelancerPO,
  LocationPO,
  TalentPO,
  VendorPO,
  Settlement,
  PaymentOrder,
  BudgetSettings,
  BudgetSettingsConfiguration,
  BudgetSettingsPaymentTerms,
  BudgetSettingsApprovalHierarchy,
  BudgetSettingsCurrencies,
  MasterPurchaseOrder,
  MasterInvoice,
  Payments,
  Locations,
  CategoryList,
  LocationList,
  Review,
  ScouterAccess,
  Roles
];
