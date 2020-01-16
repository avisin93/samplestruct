export const API_URL: any = {};

API_URL['agencyUrl'] = '/agency';
API_URL['projectCategoriesUrl'] = '/filters/category';
API_URL['changeStatus'] = API_URL['agencyUrl'] + '/%s/status';

/**
 * Profile urls
 */
API_URL['profile'] = '/profile';
API_URL['profileFreelancer'] = API_URL['profile'] + '/freelancer';
API_URL['profileVendor'] = API_URL['profile'] + '/vendor';

// Roles module urls
API_URL['roles'] = '/role';
API_URL['fieldAccess'] = API_URL['roles'] + '/%s/field-access';
API_URL['rolesParent'] = API_URL['roles'] + '/parent';
API_URL['rolesAccess'] = API_URL['roles'] + '/%s/access';
API_URL['samplePermissions'] = 'assets/data/roles-advanced-settings.json';

// Talent module full paths
API_URL['individual'] = '/individual';
API_URL['agency'] = '/agency';
API_URL['individualFilterList'] = API_URL['individual'] + '/filters';
API_URL['agencyFilterList'] = API_URL['agency'] + '/filters';


//Talent PO urls
API_URL['talentPO'] = '/talent-purchase-order';
API_URL['talentPOBudgetLines'] = API_URL['talentPO'] + '/budget-line';
API_URL['talentPOCategory'] = API_URL['talentPO'] + '/category';
API_URL['talentPOService'] = API_URL['talentPO'] + '/services';

API_URL['talentPOMedia'] = API_URL['talentPO'] + '/media';
API_URL['talentPORole'] = API_URL['talentPO'] + '/role';
API_URL['talentPOIndividual'] = API_URL['talentPO'] + '/individual';
API_URL['talentPOAgency'] = API_URL['talentPO'] + '/agency';
API_URL['talentPOTerritory'] = API_URL['talentPO'] + '/territory';
/** Freelancer module API url's */
API_URL['freelancerUrl'] = 'freelancer';
API_URL['freelancerStepOneUrl'] = API_URL['freelancerUrl'] + '/activate';
API_URL['freelancerContractApprovalUrl'] = API_URL['freelancerUrl'] + '/contract-approval';
API_URL['freelancerContractRejectionUrl'] = API_URL['freelancerUrl'] + '/contract-rejection';

/** Vendor module API url's */
API_URL['vendorUrl'] = 'vendor';
API_URL['user'] = '/user';
API_URL['vendorContractApprovalUrl'] = API_URL['vendorUrl'] + '/contract-approval';
API_URL['vendorContractRejectionUrl'] = API_URL['vendorUrl'] + '/contract-rejection';
API_URL['vendorActivateURL'] = API_URL['vendorUrl'] + '/activate';
API_URL['stepThreeVendorContractUrl'] = API_URL['vendorUrl'] + '/contract';
API_URL['contractDownload'] = API_URL['user'] + '/contract-download';
API_URL['contractAcceptTerm'] = API_URL['user'] + '/contract-accept-term';
/** Login module user information API url's */
API_URL['userInfoUrl'] = 'sessions/user-info';
API_URL['projectsUrl'] = 'projects';
API_URL['projectsyncUrl'] = API_URL['projectsUrl'] + '/sync';

/**Budget URL */
API_URL['budgetListUrl'] = API_URL['projectsUrl'] + '/%s' + '/budgets';
API_URL['workingUrl'] = '/project-setting/working';

/** Location module API url's */
API_URL['locationCategoriesUrl'] = 'location-categories';
API_URL['manageLocationCategoriesUrl'] = 'location-categories' + '/%s';
API_URL['locationUrl'] = '/location';
API_URL['addLocationNameUrl'] = API_URL['locationUrl'] + '/add';
API_URL['manageLocationUrl'] = API_URL['locationUrl'] + '/%s';
API_URL['locationStatesUrl'] = API_URL['locationUrl'] + '/states';
API_URL['locationCitiesUrl'] = API_URL['locationUrl'] + '/cities';
API_URL['imagesUrl'] = API_URL['manageLocationUrl'] + '/images';
API_URL['locationTagsUrl'] = API_URL['locationUrl'] + '/tags';
API_URL['deleteLocationUrl'] = API_URL['locationUrl'] + '/%s';
API_URL['images1Url'] = '/location-images';
API_URL['scouterLocationAccessListUrl'] = '/location-access';
API_URL['scouterLocationAccessUrl'] = API_URL['scouterLocationAccessListUrl'] + '/%s';
API_URL['reviewListUrl'] = API_URL['locationUrl'] + '/review-search';
API_URL['reviewUrl'] = API_URL['locationUrl'] + '/%s/review';
API_URL['locationZip'] = '/location-zip';
API_URL['zipProjectList'] = API_URL['locationZip'] + '/projects';
API_URL['reviewDataLimitUrl'] = API_URL['locationUrl'] + '/%s' + '/tags';

/**Projects URL */

API_URL['purchaseOrderUrl'] = '/purchase-order';
API_URL['advance'] = 'advance';
API_URL['cancelPO'] = API_URL['purchaseOrderUrl'] + '/%s' + '/cancel';
API_URL['approvePo'] = API_URL['purchaseOrderUrl'] + '/%s' + '/approve';
API_URL['rejectPo'] = API_URL['purchaseOrderUrl'] + '/%s' + '/reject';
API_URL['onhold'] = API_URL['purchaseOrderUrl'] + '/%s' + '/pending';
API_URL['approveAdvancePayment'] = API_URL['purchaseOrderUrl'] + '/%s' + '/payment/approve';
API_URL['rejectAdvancePayment'] = API_URL['purchaseOrderUrl'] + '/%s' + '/payment/reject';
API_URL['defaultValueURL'] = API_URL['purchaseOrderUrl'] + '/default-value';
API_URL['poAdvance'] = API_URL['purchaseOrderUrl'] + '/advance';
API_URL['poVendorUrl'] = API_URL['purchaseOrderUrl'] + '/vendor';
API_URL['poFreelancerUrl'] = API_URL['purchaseOrderUrl'] + '/freelancer';
API_URL['poLocationUrl'] = API_URL['purchaseOrderUrl'] + '/location';
API_URL['poSettlementUrl'] = '/posettlement';
API_URL['poSettlementCancelUrl'] = API_URL['poSettlementUrl'] + '/%s' + '/cancel';
API_URL['purchaseOrderUrlContractAcceptance'] = API_URL['purchaseOrderUrl'] + '/project-contract-acceptance';
API_URL['purchaseOrderUrlPALAcceptance'] = API_URL['projectsUrl'] + '/%s/project-assignment-letter';

/** common/filter API url's */
API_URL['filters'] = '/filters';
API_URL['companyUrl'] = API_URL['filters'] + '/company';
API_URL['budgetTypesUrl'] = API_URL['filters'] + '/budget-types';
API_URL['projectBudgetTypes'] = API_URL['filters'] + '/project-budget-types/%s';
API_URL['paymentProjects'] = API_URL['filters'] + '/payment-projects';
API_URL['budgetLine'] = API_URL['filters'] + '/po-budget-line';
API_URL['poVendors'] = API_URL['filters'] + '/purchase-order-vendor';
API_URL['reqByValues'] = API_URL['filters'] + '/requested-by/vendor';
API_URL['poFilterFreelancerUrl'] = API_URL['filters'] + '/purchase-order-freelancer';
API_URL['poProductionCoordinatorUrl'] = API_URL['filters'] + '/purchase-order-production-co-ordinator';
API_URL['poProjects'] = API_URL['filters'] + '/po-projects';
API_URL['suppliers'] = API_URL['filters'] + '/freelancer-vendor';
API_URL['currency'] = API_URL['filters'] + '/currency';
API_URL['file'] = '/file';
API_URL['projectSupplierListUrl'] = '/filters/suppliers';

/** Master PO module API urls */
API_URL['masterPO'] = API_URL['purchaseOrderUrl'] + '/master';
API_URL['masterPOExcel'] = API_URL['masterPO'] + '/export';

/** Master Invoice module API urls */
API_URL['masterInvoice'] = '/invoices/master';

/** Payments module API urls */
API_URL['payments'] = '/payments';
API_URL['managePayment'] = API_URL['payments'] + '/%s';
API_URL['paymentHistory'] = API_URL['payments'] + '/payment-history';
API_URL['paymentInvoices'] = API_URL['payments'] + '/invoices/%s';
API_URL['paymentTotal'] = API_URL['payments'] + '/payments-sum';
API_URL['schedulePayment'] = API_URL['payments'] + '/%s/schedule';
API_URL['makePayment'] = API_URL['payments'] + '/%s/pay';
API_URL['cancelPayment'] = API_URL['payments'] + '/%s/cancel';

/** Bidding module API urls */
API_URL['bids'] = '/projects';
API_URL['manageProjectInputs'] = 'projectInputs' + '/%s';
API_URL['passes'] = '/passes';
API_URL['passesInfo'] = API_URL['passes'] + '/info' + '/%s';
API_URL['pipedrive'] = '/pipedrive';
API_URL['organizations'] = API_URL['pipedrive'] + '/organizations';
API_URL['contactPersons'] = API_URL['pipedrive'] + '/persons';
API_URL['leads'] = '/leads';
API_URL['manageLead'] = API_URL['leads'] + '/%s';
API_URL['masterConfiguration'] = '/master-configuration';
API_URL['projectMasterConfiguration'] = '/project-master-configuration';
API_URL['masterConfigurationApprovalHierarchy'] = '/master-configuration/approval-hierarchy';
API_URL['projectMasterConfigurationApprovalHierarchy'] = '/project-master-configuration/approval-hierarchy';
API_URL['filterPass'] = API_URL['filters'] + '/all-pass';
API_URL['preBidRoles'] = API_URL['filters'] + '/roles/prebid';
API_URL['preBidUsers'] = API_URL['filters'] + '/users';
API_URL['convertToProject'] = API_URL['bids'] + '/%s' + '/convert' + '/%s';
API_URL['checkProjectExistsOrNot'] = API_URL['bids'] + '/check';

/** Invoice module API urls */
API_URL['managePurchaseOrderUrl'] = '/purchase-order/%s';
API_URL['invoiceUrl'] = '/invoices';
API_URL['manageInvoiceUrl'] = API_URL['invoiceUrl'] + '/%s';
API_URL['invoicesHistoryUrl'] = API_URL['invoiceUrl'] + '/history';
API_URL['removeInvoiceUrl'] = API_URL['invoiceUrl'] + '/%s' + '/cancel';
API_URL['paymentsUrl'] = '/payments';
API_URL['approveInvoiceUrl'] = API_URL['invoiceUrl'] + '/%s' + '/approve';
API_URL['rejectInvoiceUrl'] = API_URL['invoiceUrl'] + '/%s' + '/reject';
API_URL['onHoldInvoiceUrl'] = API_URL['invoiceUrl'] + '/%s' + '/pending';

/** view po module API url's */
API_URL['viewPO'] = API_URL['purchaseOrderUrl'] + '/view';
API_URL['downloadPo'] = API_URL['purchaseOrderUrl'] + '/generate-pdf';

/** view invoice module API url's */
API_URL['downloadInvoice'] = API_URL['invoiceUrl'] + '/generate-pdf';


API_URL['logout'] = 'sessions/logout';

