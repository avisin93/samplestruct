export const ROUTER_LINKS_FULL_PATH: any = {};
/** admin route */
ROUTER_LINKS_FULL_PATH['admin'] = '/admin';

ROUTER_LINKS_FULL_PATH['home'] = '/home';

/** Login Module */
ROUTER_LINKS_FULL_PATH['login'] = '/login';

/** Registration Module */
ROUTER_LINKS_FULL_PATH['register'] = '/register';

/** Forgot password Module */
ROUTER_LINKS_FULL_PATH['recover'] = '/recover';

/** permissions denied route */
ROUTER_LINKS_FULL_PATH['403'] = ROUTER_LINKS_FULL_PATH['admin'] + '/403';

/** Dashboard Module */
ROUTER_LINKS_FULL_PATH['dashboard'] = ROUTER_LINKS_FULL_PATH['admin'] + '/dashboard';

/** Unauthorized Access Module */
ROUTER_LINKS_FULL_PATH['unauthorized'] = '/unauthorized';
/**INcompatible browser */
ROUTER_LINKS_FULL_PATH['incompatibleBrowser'] = '/browser-not-supported';
/** Activation Module */
ROUTER_LINKS_FULL_PATH['activation'] = '/activation';
ROUTER_LINKS_FULL_PATH['freelancerActivation'] = ROUTER_LINKS_FULL_PATH['activation'] + '/freelancer';
ROUTER_LINKS_FULL_PATH['vendorActivation'] = ROUTER_LINKS_FULL_PATH['activation'] + '/vendor';

/** Users/Actors Module */
ROUTER_LINKS_FULL_PATH['users'] = ROUTER_LINKS_FULL_PATH['admin'] + '/users';
ROUTER_LINKS_FULL_PATH['freelancers'] = ROUTER_LINKS_FULL_PATH['users'] + '/freelancers';
ROUTER_LINKS_FULL_PATH['addFreelancer'] = ROUTER_LINKS_FULL_PATH['freelancers'] + '/add-freelancer';
ROUTER_LINKS_FULL_PATH['editFreelancer'] = ROUTER_LINKS_FULL_PATH['freelancers'] + '/edit-freelancer' + '/%s';
ROUTER_LINKS_FULL_PATH['vendors'] = ROUTER_LINKS_FULL_PATH['users'] + '/vendors';
ROUTER_LINKS_FULL_PATH['addVendor'] = ROUTER_LINKS_FULL_PATH['vendors'] + '/add-vendor';
ROUTER_LINKS_FULL_PATH['editVendor'] = ROUTER_LINKS_FULL_PATH['vendors'] + '/edit-vendor' + '/%s';

/** Profile Module */
ROUTER_LINKS_FULL_PATH['profile'] = ROUTER_LINKS_FULL_PATH['admin'] + '/profile';
ROUTER_LINKS_FULL_PATH['editFreelancerProfile'] = ROUTER_LINKS_FULL_PATH['profile'] + '/edit-freelancer-profile' + '/%s';
ROUTER_LINKS_FULL_PATH['editVendorProfile'] = ROUTER_LINKS_FULL_PATH['profile'] + '/edit-vendor-profile' + '/%s';

/**New bid module */
ROUTER_LINKS_FULL_PATH['bidding'] = ROUTER_LINKS_FULL_PATH['admin'] + '/bidding';
ROUTER_LINKS_FULL_PATH['leads'] = ROUTER_LINKS_FULL_PATH['bidding'] + '/leads';
ROUTER_LINKS_FULL_PATH['bids'] = ROUTER_LINKS_FULL_PATH['bidding'] + '/deals';

/** Projects Module */
ROUTER_LINKS_FULL_PATH['projects'] = ROUTER_LINKS_FULL_PATH['admin'] + '/projects';
ROUTER_LINKS_FULL_PATH['addProject'] = ROUTER_LINKS_FULL_PATH['projects'] + '/add';
ROUTER_LINKS_FULL_PATH['manageProject'] = ROUTER_LINKS_FULL_PATH['projects'] + '/manage' + '/%s';

/** Project details Sub-modules Projects module */
ROUTER_LINKS_FULL_PATH['projectDetails'] = ROUTER_LINKS_FULL_PATH['manageProject'] + '/details';
ROUTER_LINKS_FULL_PATH['assignmentNew'] = ROUTER_LINKS_FULL_PATH['manageProject'] + '/assignment';
ROUTER_LINKS_FULL_PATH['project'] = ROUTER_LINKS_FULL_PATH['projectDetails'] + '/project';

/** Project details Sub-modules Budget Sheets module */
ROUTER_LINKS_FULL_PATH['budgetSheets'] = ROUTER_LINKS_FULL_PATH['manageProject'] + '/budget-sheets';
ROUTER_LINKS_FULL_PATH['manageBudgetSheet'] = ROUTER_LINKS_FULL_PATH['budgetSheets'] + '/manage' + '/%s';
ROUTER_LINKS_FULL_PATH['budgetSheetDetails'] = ROUTER_LINKS_FULL_PATH['manageBudgetSheet'] + '/details';
ROUTER_LINKS_FULL_PATH['budgetSheetSettings'] = ROUTER_LINKS_FULL_PATH['manageBudgetSheet'] + '/settings';
ROUTER_LINKS_FULL_PATH['budgetReport'] = ROUTER_LINKS_FULL_PATH['budgetSheets'] + '/budget-report' + '/%s';
ROUTER_LINKS_FULL_PATH['manageBudgetWorking'] = ROUTER_LINKS_FULL_PATH['budgetSheets'] + '/manage-budget-working' + '/%s';
/** Purchase order Sub-modules of Project details module */
ROUTER_LINKS_FULL_PATH['purchaseOrder'] = ROUTER_LINKS_FULL_PATH['budgetSheetDetails'] + '/po';
ROUTER_LINKS_FULL_PATH['manageFreelancerPO'] = ROUTER_LINKS_FULL_PATH['purchaseOrder'] + '/manage-freelancer' + '/%s';
ROUTER_LINKS_FULL_PATH['manageVendorPO'] = ROUTER_LINKS_FULL_PATH['purchaseOrder'] + '/manage-vendor' + '/%s';
ROUTER_LINKS_FULL_PATH['manageLocationPO'] = ROUTER_LINKS_FULL_PATH['purchaseOrder'] + '/manage-location' + '/%s';
ROUTER_LINKS_FULL_PATH['manageAdvancePO'] = ROUTER_LINKS_FULL_PATH['purchaseOrder'] + '/manage-advance' + '/%s';
ROUTER_LINKS_FULL_PATH['settlePO'] = ROUTER_LINKS_FULL_PATH['purchaseOrder'] + '/settle';
ROUTER_LINKS_FULL_PATH['manageSettlePO'] = ROUTER_LINKS_FULL_PATH['purchaseOrder'] + '/settle' + '/%s';
ROUTER_LINKS_FULL_PATH['manageTalentPO'] = ROUTER_LINKS_FULL_PATH['purchaseOrder'] + '/manage-talent' + '/%s';

ROUTER_LINKS_FULL_PATH['settlement'] = ROUTER_LINKS_FULL_PATH['budgetSheetDetails'] + '/settlement';
ROUTER_LINKS_FULL_PATH['manageSettlement'] = ROUTER_LINKS_FULL_PATH['settlement'] + '/manage' + '/%s';
ROUTER_LINKS_FULL_PATH['advances'] = ROUTER_LINKS_FULL_PATH['budgetSheetDetails'] + '/advances';
ROUTER_LINKS_FULL_PATH['manageFreelancerAdvance'] = ROUTER_LINKS_FULL_PATH['advances'] + '/manage-freelancer' + '/%s';
ROUTER_LINKS_FULL_PATH['manageVendorAdvance'] = ROUTER_LINKS_FULL_PATH['advances'] + '/manage-vendor' + '/%s';
// ROUTER_LINKS_FULL_PATH['settlementList'] = ROUTER_LINKS_FULL_PATH['advances'] + '/settlement';
// ROUTER_LINKS_FULL_PATH['manageSettlement'] = ROUTER_LINKS_FULL_PATH['advances'] + '/manage-settlement' + '/%s';
ROUTER_LINKS_FULL_PATH['assignment'] = ROUTER_LINKS_FULL_PATH['budgetSheetDetails'] + '/assignment';
ROUTER_LINKS_FULL_PATH['invoice'] = ROUTER_LINKS_FULL_PATH['budgetSheetDetails'] + '/invoice';
ROUTER_LINKS_FULL_PATH['paymentOrder'] = ROUTER_LINKS_FULL_PATH['budgetSheetDetails'] + '/payment-order';
// ROUTER_LINKS_FULL_PATH['manageInvoice'] = ROUTER_LINKS_FULL_PATH['invoice'] + '/manage' + '/%s';
ROUTER_LINKS_FULL_PATH['managePaymentOrder'] = ROUTER_LINKS_FULL_PATH['paymentOrder'] + '/manage' + '/%s';
// ROUTER_LINKS_FULL_PATH['viewInvoiceDetails'] = ROUTER_LINKS_FULL_PATH['invoice'] + '/view-invoice-details' + '/%s';
ROUTER_LINKS_FULL_PATH['viewInvoiceDetails'] = ROUTER_LINKS_FULL_PATH['paymentOrder'] + '/view-payment-order-details' + '/%s';
ROUTER_LINKS_FULL_PATH['viewInvoice'] = ROUTER_LINKS_FULL_PATH['invoice'] + '/view' + '/%s';
ROUTER_LINKS_FULL_PATH['projectSettings'] = ROUTER_LINKS_FULL_PATH['manageProject'] + '/settings';
ROUTER_LINKS_FULL_PATH['configuration'] = ROUTER_LINKS_FULL_PATH['budgetSheetSettings'] + '/configuration';
ROUTER_LINKS_FULL_PATH['paymentTerms'] = ROUTER_LINKS_FULL_PATH['budgetSheetSettings'] + '/payment-terms';
ROUTER_LINKS_FULL_PATH['approvalHirerachy'] = ROUTER_LINKS_FULL_PATH['budgetSheetSettings'] + '/approval-hierarchy';
ROUTER_LINKS_FULL_PATH['currencies'] = ROUTER_LINKS_FULL_PATH['budgetSheetSettings'] + '/currencies';

/** location Module */
ROUTER_LINKS_FULL_PATH['locations'] = ROUTER_LINKS_FULL_PATH['admin'] + '/locations';
ROUTER_LINKS_FULL_PATH['locationsView'] = ROUTER_LINKS_FULL_PATH['locations'] + '/view';
ROUTER_LINKS_FULL_PATH['review'] = ROUTER_LINKS_FULL_PATH['locations'] + '/review';
ROUTER_LINKS_FULL_PATH['manageReview'] = ROUTER_LINKS_FULL_PATH['review'] + '/manage' + '/%s';

ROUTER_LINKS_FULL_PATH['presentation'] = ROUTER_LINKS_FULL_PATH['locations'] + '/presentation';
ROUTER_LINKS_FULL_PATH['manageLocation'] = ROUTER_LINKS_FULL_PATH['locationsView'] + '/manage-location' + '/%s';
ROUTER_LINKS_FULL_PATH['category'] = ROUTER_LINKS_FULL_PATH['locations'] + '/category';
ROUTER_LINKS_FULL_PATH['scouters'] = ROUTER_LINKS_FULL_PATH['locations'] + '/scouter';
ROUTER_LINKS_FULL_PATH['viewFreelancerPO'] = '/view-freelancer' + '/%s';
ROUTER_LINKS_FULL_PATH['viewVendorPO'] = '/view-vendor' + '/%s';
ROUTER_LINKS_FULL_PATH['viewAdvancePO'] = '/view-advance' + '/%s';
ROUTER_LINKS_FULL_PATH['viewLocationPO'] = '/view-location' + '/%s';
ROUTER_LINKS_FULL_PATH['payment'] = ROUTER_LINKS_FULL_PATH['budgetSheetDetails'] + '/payment';
ROUTER_LINKS_FULL_PATH['managePayment'] = ROUTER_LINKS_FULL_PATH['payment'] + '/manage' + '/%s';
ROUTER_LINKS_FULL_PATH['viewPO'] = '/view-po' + '/%s';
ROUTER_LINKS_FULL_PATH['viewInvoice'] = '/view-payment-order' + '/%s';

/** 
*Payment Module routes
*/
ROUTER_LINKS_FULL_PATH['payments'] = ROUTER_LINKS_FULL_PATH['admin'] + '/payments';

/**
 * Talent module Routes
 */
ROUTER_LINKS_FULL_PATH['talent'] = ROUTER_LINKS_FULL_PATH['admin'] + '/talent';
ROUTER_LINKS_FULL_PATH['agency'] = ROUTER_LINKS_FULL_PATH['talent'] + '/agency';
ROUTER_LINKS_FULL_PATH['individual'] = ROUTER_LINKS_FULL_PATH['talent'] + '/individual';

/**
 * Master Purchase order
 */
ROUTER_LINKS_FULL_PATH['masterPO'] = ROUTER_LINKS_FULL_PATH['admin'] + '/purchase-order';

/**
 * Master Invoice routes
 */
ROUTER_LINKS_FULL_PATH['masterPaymentOrder'] = ROUTER_LINKS_FULL_PATH['admin'] + '/payment-order';


/**
 *  Roles module Routes
 */
ROUTER_LINKS_FULL_PATH['roles'] = ROUTER_LINKS_FULL_PATH['admin'] + '/roles';
ROUTER_LINKS_FULL_PATH['manageRoles'] =  ROUTER_LINKS_FULL_PATH['roles'] + '/manage';


export const ROUTER_LINKS = {
  'locations': '/location',
  'projects': '/projects',
  'editLocation': '/manageLocation',
  'talent': '/users/talent',
  'commercial': '/settings/commercial',
  'corporate': '/settings/corporate',
  'entertainment': '/settings/entertainment',
  'settings': '/settings',
  'annualContract': '/annual-contract',
  'project': 'project',
  'brands': '/clients/brands',
  'agencies': '/clients/agencies',
  'productionCompanies': '/clients/production-companies',
  'clients': '/clients',
  'locationlist': '/locations/view',
  'manageLocation': '/locations/view/manage-location',
  'review': '/locations/review',
  'manageReview': '/locations/review/manage',
  'presentation': '/locations/presentation',
  'locationView': '/location/location-list/location-view',
  'manage-location': '/location/manage-location/manage-location',
  'presentation-list': '/location/presentation/presentation-list',
  'manage-presentation': '/location/manage-presentation/manage-presentation',
  'configuration': 'configuration',
  'paymentTerms': 'payment-terms',
  'approvalHirerachy': 'approval-hierarchy',
  'addProject': '/projects/add-project',
  'manageProject': '/projects/manage-project',
  'projectDetails': 'project-details',
  'purchaseOrder2': 'details/po',
  'purchaseOrderList': 'list',
  'purchaseOrder': 'po',
  'assignment': 'assignment',
  'purchaseOrderFreelancer': 'purchase-order-freelancer',
  'purchaseOrderLocation': 'purchase-order-location',
  'purchaseOrderVendor': 'purchase-order-vendor',
  'purchaseOrderAdvance': 'purchase-order-advance',
  'purchaseOrderTalent': 'purchase-order-talent',
  'projectDetails2': 'details/project',
  'projectSettings': 'settings',
  'currencies': 'currencies',
  'managepurchaseOrderLocation': 'manage-location',
  'manageSettlement': 'manage-settlement',
  'advancesList': 'advances-list',
  'settlementList': 'settlement',
  'advancesFreelancer': 'manage-freelancer',
  'advancesLocation': 'manage-location',
  'advancesVendor': 'manage-vendor',
  'advancesTalent': 'manage-talent',
  'advances': 'advances',
  'invoice': 'invoice',
  'paymentOrder': 'payment-order',
  'manageInvoice': 'manage-invoice',
  'viewInvoice': 'view-invoice',
  'viewVendorPO': 'view-vendor-po',
  'viewAdvancePO': 'view-advance-po',
  'viewFreelancerPO': 'view-freelancer-po',
  'invoiceListing': 'invoice-listing',
  'settlePO': 'settle-po',
  'login': '/login',
  'register': '/register',
  'recover': '/recover',
  'dashboard': '/dashboard',
  'users': '/users',
  'manage-users': '/users/manage-users',
  'edit-user': '/users/edit-user',
  'freelancer-activation': '/users/activation',
  'activation': '/users/activation',
  'vendor-activation': '/users/vendors/vendor-activation',
  'manageVendor': '/users/vendors/manage-vendor',
  'addVendor': '/users/vendors/add-vendor',
  'editVendor': '/users/vendors/edit-vendor',
  'freelancers': '/users/freelancers',
  'addFreelancer': '/users/freelancers/add-freelancer',
  'editFreelancer': '/users/freelancers/edit-freelancer',
  'vendors': '/users/vendors',
  'payment': 'payment',
  'managePayment': 'manage-payment',
  'paymentListing': 'payment-listing',
  'payments': '/payments',
  'paymentsReference': 'payments',
  'managePayments': 'manage-payments',
  'paymentsListing': 'payments-listing',
  'budgetSheets': 'budget-sheets',
  'details': 'details',
  'budgetDetails': 'details',
  'budgetSettings': 'settings',
  'bidding': '/bidding',
  'manageBid': '/manage',
  'bidBasicInfo': 'basic-info',
  'bidAdvanceInfo': '/advance-info',
  'bidCalculatorSheet': '/calculator-sheet',
  'bidAicpSheet': '/aicp-sheet',
  'manageBaseRate': 'manage-base-rate',
  'manageRateChart': 'manage-rate-chart',
  'bidEditingAndPost': 'editing-and-post',
  'bidAicp': 'aicp',
  'bidPasses': 'passes',
  'bidBusinessTerms': 'business-terms',
  'bidProductionParameters': 'production-parameters',
  'bidTalent': 'talent',
  'settlement': 'settlement',
};
