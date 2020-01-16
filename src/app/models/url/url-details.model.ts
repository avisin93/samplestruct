import { BaseUrl } from './base-url.model';

export class UrlDetails {
  // tslint:disable
  private static exela_getAllClientUrl: string = BaseUrl.$exelaAuthUrl + 'organization/getOrganizationsList'; // @ExelaAuth

  private static exela_getAllProjectsUrl: string = BaseUrl.$exelaAuthUrl + "project/listProjects";//@ExelaAuth
  private static exela_getBasicInfoUrl: string = BaseUrl.$exelaAuthUrl + "user/getBasicInformation"; //@ExelaAuth
  private static exela_createClientUrl: string = BaseUrl.$exelaAuthUrl + "organization/addOrUpdateOrganization"; //@ExelaAuth
  private static getAllThemesUrl: string = BaseUrl.$exelaAuthUrl + "storefront/getAllThemes";
  private static exela_getPasswordRulesUrl: string = BaseUrl.$exelaAuthUrl + "organization/getPasswordRules";//ExelaAuth
  private static exela_updatePasswordRulesUrl: string = BaseUrl.$exelaAuthUrl + "organization/updatePasswordRules";//ExelaAuth
  private static exela_getClientUrl: string = BaseUrl.$exelaAuthUrl + "organization/getOrganizationById"; //@ExelaAuth
  private static exela_assignProductsToClientUrl: string = BaseUrl.$exelaAuthUrl + "organization/addProductToOrganization"; //@ExelaAuth
  private static exela_getClientProductUrl: string = BaseUrl.$exelaAuthUrl + "organization/getProductByOrganizationId"; //@ExelaAuth
  private static exela_addMenuToProductUrl: string = BaseUrl.$exelaAuthUrl + "organization/addMenuToProduct"; //@ExelaAuth
  private static exela_getProductMenuUrl: string = BaseUrl.$exelaAuthUrl + "product/getProductMenu"; //@ExelaAuth
  private static exela_getAllProductsUrl: string = BaseUrl.$exelaAuthUrl + "product/getProductslist"; //@ExelaAuth
  private static exela_getMenuByClientIdAndProductIdUrl: string = BaseUrl.$exelaAuthUrl + "organization/getMenuByOrganizationIdAndProductId"; //@ExelaAuth
  private static exela_getClientRolesUrl: string = BaseUrl.$exelaAuthUrl + "role/getOrganizationRoles"; //@ExelaAuth
  private static exela_addOrUpdateProductUrl: string = BaseUrl.$exelaAuthUrl + "product/addOrUpdateProduct"; //@ExelaAuth
  private static exela_getProductUrl: string = BaseUrl.$exelaAuthUrl + "product/getProductById"; //@ExelaAuth
  private static exela_addOrUpdateMenusUrl: string = BaseUrl.$exelaAuthUrl + "product/addOrUpdateMenus"; //@ExelaAuth
  private static exela_getAllClientUsersUrl: string = BaseUrl.$exelaAuthUrl + "user/list/"; //@ExelaAuth
  private static exela_updateUserUrl: string = BaseUrl.$exelaAuthUrl + "user/updateUser";//@ExelaAuth
  private static exela_blockUnblockUserUrl: string = BaseUrl.$exelaAuthUrl + "user/blockUnblockUser";// ExelaAuth
  private static exela_getUserByUserIdUrl: string = BaseUrl.$exelaAuthUrl + "user/getUserByUserId";// @ExelaAuth
  private static exela_registerUserUrl: string = BaseUrl.$exelaAuthUrl + "user/register";//@ExelaAuth
  private static createBulkUsersUrl: string = BaseUrl.$exelaAuthUrl + "user/createBulkUsers"; //ExelaAuth
  private static exela_addOrUpdateProjectUrl: string = BaseUrl.$exelaAuthUrl + "project/addOrUpdateProject";//@ExelaAuth
  private static exela_getDocTypesUrl: string = BaseUrl.$exelaAuthUrl + "project/getDocTypes";//@ExelaAuth
  private static exela_addOrUpdateProjectDocTypeUrl: string = BaseUrl.$exelaAuthUrl + "project/addOrUpdateProjectDocType";//@ExelaAuth
  private static exela_getProjectByProjectIdUrl: string = BaseUrl.$exelaAuthUrl + "project/getProjectByProjectId";//@ExelaAuth
  private static exela_getQueuesUrl: string = BaseUrl.$exelaAuthUrl + "project/getQueues";//@ExelaAuth
  private static exela_addOrUpdateProjectQueueUrl: string = BaseUrl.$exelaAuthUrl + "project/addOrUpdateProjectQueue";//@ExelaAuth
  private static exela_loginUrl: string = BaseUrl.$exelaAuthUrl + "login"; //@ExelaAuth
  private static exela_OTPLoginUrl: string = BaseUrl.$exelaAuthUrl + "login_with_otp"; //@ExelaAuth
  private static exela_logoutUrl: string = BaseUrl.$exelaAuthUrl + 'user/logout';// ExelaAuth
  private static exela_getUserAttributes: string = BaseUrl.$exelaAuthUrl + 'getUserAttributes'
  private static exela_addOrUpdateUserAttributes: string = BaseUrl.$exelaAuthUrl + 'addOrUpdateUserAttributes'
  private static exela_getOrganizationsByProductCode: string = BaseUrl.$exelaAuthUrl + "organization/getOrganizationsByProductCode";//@ExelaAuth
  // private static getActionListUrl: string = BaseUrl.$boxofficeCoreUrl + "action/getActionList"; //BO2 TODO: Vido
  
  private static resetPasswordUrl: string = BaseUrl.$boxofficeCoreUrl + "dmr/resetPassword";
  // tslint:enable
  private static getRolesByProjectCode: string = BaseUrl.$exelaAuthUrl + 'role/getRolesByProjectCode';// @ExelaAuth
  private static saveClientsBrandingUrl: string = BaseUrl.$exelaAuthUrl + 'organization/saveOrganizationsBranding';
  private static saveClientsPromotionalBannerUrl: string = BaseUrl.$exelaAuthUrl + 'organization/saveOrganizationsPromotionalBanner';
  private static saveSelectedThemeUrl: string = BaseUrl.$exelaAuthUrl + 'organization/saveSelectedTheme';
  private static getStoreFrontUrl: string = BaseUrl.$exelaAuthUrl + 'organization/getStoreFront/';
  private static exelaCreateOrUpdateClientProductRoleUrl: string =
      BaseUrl.$exelaAuthUrl + 'role/createOrUpdateOrganizationProductRole'; // @ExelaAuth
  private static exelaGetRoleUrl: string = BaseUrl.$exelaAuthUrl + 'role/getRole'; // @ExelaAuth
  private static getRoleProjectDocType: string = BaseUrl.$exelaAuthUrl + 'role/getRoleProjectDocType'; // ExelaAuth
  private static exelaGetSelectedMenusFromRoleUrl: string = BaseUrl.$exelaAuthUrl + 'role/getSelectedMenusFromRole'; // @ExelaAut;
  private static exelaGetClientAssignedMenusUrl: string = BaseUrl.$exelaAuthUrl + 'role/getOrganizationAssignedMenus'; // @ExelaAuth
  private static exelaAssignMenusToRoleUrl: string = BaseUrl.$exelaAuthUrl + 'role/assignMenusToRole'; // @ExelaAuth
  private static exelaAddOrUpdateProjectQueueAccessUrl: string = BaseUrl.$exelaAuthUrl + 'role/addOrUpdateProjectQueueAccess';// @ExelaAuth
  private static findProjectByroles: string = BaseUrl.$exelaAuthUrl + 'role/findProjectByroles'; // @ExelaAuth
  private static exelaAddUpdateRoleDocTypeFormElement: string = BaseUrl.$exelaAuthUrl + 'role/addUpdateRoleDocTypeFormElement';// @ExelaAuth
  private static exelaGetRoleDocType: string = BaseUrl.$exelaAuthUrl + 'role/getRoleDocType';// @ExelaAuth
  private static exelaGetAllRolesUrl: string = BaseUrl.$exelaAuthUrl + 'role/getAllRoles'; // @ExelaAuth
  private static downloadUsers: string = BaseUrl.$exelaAuthUrl + 'user/downloadUser/'; // @ExelaAuth
  private static updateStoreFrontThemeUrl: string = BaseUrl.$exelaAuthUrl + 'storefront/updateTheme/';
  private static getStoreFrontThemeUrl: string = BaseUrl.$exelaAuthUrl + 'storefront/getTheme/';
  private static saveStoreFrontThemeUrl: string = BaseUrl.$exelaAuthUrl + 'storefront/saveTheme';
  private static exelaChangePasswordUrl: string = BaseUrl.$exelaAuthUrl + 'user/changePassword';// @ExelaAuth
  private static exelaUpdateUserProfileUrl: string = BaseUrl.$exelaAuthUrl + 'user/updateUserProfile';// ExelaAuth

  // lexicon
  private static addOrUpdatedLexiconUrl: string = BaseUrl.$listenUrl + 'lexicon/addOrUpdateLexicon'; // add Or Update Lexicon
  private static saveLexiconUrl: string = BaseUrl.$listenUrl + 'lexicon/saveLexicon'; // save
  private static getLexiconUrl: string = BaseUrl.$listenUrl + 'lexicon/getLexicon'; // getLexicon
  private static deactivateLexiconUrl: string = BaseUrl.$listenUrl + 'lexicon/deactivateLexicon'; // deactivateLexicon
  private static deleteLexiconUrl: string = BaseUrl.$listenUrl + 'lexicon/deleteLexicon'; // delete
  private static activateLexiconUrl: string = BaseUrl.$listenUrl + 'lexicon/activateLexicon'; // activate
  private static uploadLexiconFile: string = BaseUrl.$listenUrl + 'lexicon/upload';

  // rule-setup (nQube)
  private static saveRuleUrl: string = BaseUrl.$nQubeUrl + 'rule/saveRule'; // save
  private static saveRuleCriteriaQueryUrl: string = BaseUrl.$nQubeUrl + 'rule/saveRuleCriteriaQuery'; // saveRuleCriteriaQuery
  private static getRuleURL: string = BaseUrl.$nQubeUrl + 'rule/getRule'; // getRuleGroup
  private static getRuleByIdURL: string = BaseUrl.$nQubeUrl + 'rule/getRuleById'; // getRuleGroup
  private static deactivateRuleUrl: string = BaseUrl.$nQubeUrl + 'rule/deactivateRule'; // deactivateRule
  private static deleteRuleUrl: string = BaseUrl.$nQubeUrl + 'rule/deleteRule'; // delete
  private static activateRuleUrl: string = BaseUrl.$nQubeUrl + 'rule/activateRule'; // activate
  private static addOrUpdateRuleUrl: string = BaseUrl.$nQubeUrl + 'rule/addOrUpdateRule'; // add Or Update Rule
  private static executeRuleUrl: string = BaseUrl.$nQubeUrl + 'rule/executeRule';
  private static PDFtoPNGUrl: string = BaseUrl.$nQubeUrl + 'rule/getImage';
  private static saveModifiedPDFUrl: string = BaseUrl.$nQubeUrl + 'rule/savepdf';

  // rule-Group (nQube)
  private static addOrUpdateRuleGroupUrl: string = BaseUrl.$nQubeUrl + 'ruleGroup/addOrUpdateRuleGroup'; // add Or Update Lexicon
  private static saveRuleGroupUrl: string = BaseUrl.$nQubeUrl + 'ruleGroup/saveRuleGroup'; // save
  private static getRuleGroupURL: string = BaseUrl.$nQubeUrl + 'ruleGroup/getRuleGroup'; // getRuleGroup
  private static getActiveRuleGroupURL: string = BaseUrl.$nQubeUrl + 'ruleGroup/getActiveRuleGroup'; // getActiveRuleGroup
  private static deactivateRuleGroupUrl: string = BaseUrl.$nQubeUrl + 'ruleGroup/deactivateRuleGroup'; // deactivateRuleGroup
  private static deleteRuleGroupUrl: string = BaseUrl.$nQubeUrl + 'ruleGroup/deleteRuleGroup'; // delete
  private static activateRuleGroupUrl: string = BaseUrl.$nQubeUrl + 'ruleGroup/activateRuleGroup'; // activate
  private static checkDepedentRuleGroups: string = BaseUrl.$nQubeUrl + 'ruleGroup/checkDepedentRuleGroups';

  // model-setup (nQube)
  private static saveModelSetupUrl: string = BaseUrl.$nQubeUrl + 'modelSetup/saveModelSetup'; // save
  private static getModelSetupURL: string = BaseUrl.$nQubeUrl + 'modelSetup/getModelSetup'; // getRuleGroup
  private static deactivateModelSetupUrl: string = BaseUrl.$nQubeUrl + 'modelSetup/deactivateModelSetup'; // deactivateLexicon
  private static deleteModelSetupUrl: string = BaseUrl.$nQubeUrl + 'modelSetup/deleteModelSetup'; // delete
  private static activateModelSetupUrl: string = BaseUrl.$nQubeUrl + 'modelSetup/activateModelSetup'; // activate
  private static addOrUpdateModelSetupUrl: string = BaseUrl.$nQubeUrl + 'modelSetup/addOrUpdateModelSetup'; // add Or Update Lexicon
  private static getModelList: string = BaseUrl.$nQubeUrl + 'modelSetup/activeModels';
  private static uploadExecutionFile: string = BaseUrl.$nQubeUrl + 'modelSetup/execute';
  private static onlyUpdateModelSetup: string = BaseUrl.$nQubeUrl + 'modelSetup/onlyUpdateModelSetup';
  private static uploadSelectedFile: string = BaseUrl.$nQubeUrl + 'rule/uploadFile';
  private static checkDepedentModels: string = BaseUrl.$nQubeUrl + 'modelSetup/checkModels';

  // model-assignment (nQube)
  private static saveAssignmentModel: string = BaseUrl.$nQubeUrl + 'model-assignment/addModel'; // save assignment model;
  private static getAllAssignmentModels: string = BaseUrl.$nQubeUrl + 'model-assignment/getModels'; // get all assignment models;
  private static updateAssignmentModel: string = BaseUrl.$nQubeUrl + 'model-assignment/update'; // update assignment model
  private static deleteAssignmentModel: string = BaseUrl.$nQubeUrl + 'model-assignment/delete'; // delete assignmnet model
  private static getProjectList: string = BaseUrl.$nQubeUrl + 'model-assignment/getProjectList'; // get Project list;

  private static getClientList: string = BaseUrl.$nQubeUrl + 'model-assignment/OrganizationList';
  private static getAutoRoutingDetailsUrl: string = BaseUrl.$boxofficeCoreUrl + 'routing/getAutoRoutingDetails/'; // BO2
  private static getAutoRoutingListUrl: string = BaseUrl.$boxofficeCoreUrl + 'routing/getAutoRoutingList'; // BO2
  private static saveAutoRoutingDetailsUrl: string = BaseUrl.$boxofficeCoreUrl + 'routing/saveAutoRoutingDetails'; // BO2
  private static getAutoRoutingConditionsUrl: string = BaseUrl.$boxofficeCoreUrl + 'routing/getAutoRoutingConditions/'; // BO2
  private static updateAutoRoutingRulePriorityUrl: string = BaseUrl.$boxofficeCoreUrl + 'routing/updateAutoRoutingRulePriority'; // BO2

  // ReachOut
  private static mailAdminInboxNavigatorSummaryUrl: string = BaseUrl.$boxofficeCoreUrl + 'dmr/mailAdminNavigatorSummary'; // @BO2

  private static lookupMailAdmin: string = BaseUrl.$exelaAuthUrl + 'user/lookupUserWithRole';
  private static getMailTemplateImages: string = BaseUrl.$cmCoreUrl + 'api/reachout/notificationTemplates/images'; // BO2

  // Contract Management
  private static createAddContractMetaModel: string = BaseUrl.$cmCoreUrl + 'api/contracts/add-contract-meta-model';
  private static updateAddContractMetaModel: string = BaseUrl.$cmCoreUrl + 'api/contracts/add-contract-meta-model';

  public static get $exela_getAllClientUrl (): string {
    return this.exela_getAllClientUrl;
  }

  public static get $getRolesByProjectCode (): string {
    return this.getRolesByProjectCode;
  }

  public static get $exela_getAllProjectsUrl (): string {
    return this.exela_getAllProjectsUrl;
  }

  public static get $exela_getBasicInfoUrl (): string {
    return this.exela_getBasicInfoUrl;
  }

  public static get $exela_createClientUrl (): string {
    return this.exela_createClientUrl;
  }

  public static get $saveClientsBrandingUrl (): string {
    return this.saveClientsBrandingUrl;
  }

  public static get $saveClientsPromotionalBannerUrl (): string {
    return this.saveClientsPromotionalBannerUrl;
  }

  public static get $getAllThemesUrl (): string {
    return this.getAllThemesUrl;
  }

  public static get $saveSelectedThemeUrl (): string {
    return this.saveSelectedThemeUrl;
  }

  public static get $getStoreFrontUrl (): string {
    return this.getStoreFrontUrl;
  }

  public static get $exela_getPasswordRulesUrl (): string {
    return this.exela_getPasswordRulesUrl;
  }

  public static get $exela_updatePasswordRulesUrl (): string {
    return this.exela_updatePasswordRulesUrl;
  }

  public static get $exela_getClientUrl (): string {
    return this.exela_getClientUrl;
  }

  public static get $exela_assignProductsToClientUrl (): string {
    return this.exela_assignProductsToClientUrl;
  }

  public static get $exela_getClientProductUrl (): string {
    return this.exela_getClientProductUrl;
  }

  public static get $exela_addMenuToProductUrl (): string {
    return this.exela_addMenuToProductUrl;
  }

  public static get $exela_getProductMenuUrl (): string {
    return this.exela_getProductMenuUrl;
  }

  public static get $exela_getMenuByClientIdAndProductIdUrl (): string {
    return this.exela_getMenuByClientIdAndProductIdUrl;
  }

  public static get $exela_getAllProductsUrl (): string {
    return this.exela_getAllProductsUrl;
  }

  public static get $exela_getClientRolesUrl (): string {
    return this.exela_getClientRolesUrl;
  }

  public static get $exelaCreateOrUpdateClientProductRoleUrl (): string {
    return this.exelaCreateOrUpdateClientProductRoleUrl;
  }

  public static get $exelaGetRoleUrl (): string {
    return this.exelaGetRoleUrl;
  }

  public static get $getRoleProjectDocType (): string {
    return this.getRoleProjectDocType;
  }

  public static get $exelaGetSelectedMenusFromRoleUrl (): string {
    return this.exelaGetSelectedMenusFromRoleUrl;
  }

  public static get $exelaGetClientAssignedMenusUrl (): string {
    return this.exelaGetClientAssignedMenusUrl;
  }

  public static get $exelaAssignMenusToRoleUrl (): string {
    return this.exelaAssignMenusToRoleUrl;
  }

  public static get $exelaAddOrUpdateProjectQueueAccessUrl (): string {
    return this.exelaAddOrUpdateProjectQueueAccessUrl;
  }

  public static get $findProjectByroles (): string {
    return this.findProjectByroles;
  }

  public static get $exelaAddUpdateRoleDocTypeFormElement (): string {
    return this.exelaAddUpdateRoleDocTypeFormElement;
  }

  public static get $exelaGetRoleDocType (): string {
    return this.exelaGetRoleDocType;
  }

  public static get $exelaGetAllRolesUrl (): string {
    return this.exelaGetAllRolesUrl;
  }
  public static get $exela_addOrUpdateProductUrl (): string {
    return this.exela_addOrUpdateProductUrl;
  }

  public static get $exela_getProductUrl (): string {
    return this.exela_getProductUrl;
  }

  public static get $exela_addOrUpdateMenusUrl (): string {
    return this.exela_addOrUpdateMenusUrl;
  }

  public static get $exela_getAllClientUsersUrl (): string {
    return this.exela_getAllClientUsersUrl;
  }

  public static get $exela_updateUserUrl (): string {
    return this.exela_updateUserUrl;
  }

  public static get $downloadUsers (): string {
    return this.downloadUsers;
  }

  public static get $exela_blockUnblockUserUrl (): string {
    return this.exela_blockUnblockUserUrl;
  }

  public static get $exela_getUserByUserIdUrl (): string {
    return this.exela_getUserByUserIdUrl;
  }

  public static get $exela_registerUserUrl (): string {
    return this.exela_registerUserUrl;
  }

  public static get $createBulkUsersUrl (): string {
    return this.createBulkUsersUrl;
  }

  public static get $updateThemeUrl (): string {
    return this.updateStoreFrontThemeUrl;
  }

  public static get $getStoreFrontTheme (): string {
    return this.getStoreFrontThemeUrl;
  }

  public static get $saveThemeUrl (): string {
    return this.saveStoreFrontThemeUrl;
  }

  public static get $exela_addOrUpdateProjectUrl (): string {
    return this.exela_addOrUpdateProjectUrl;
  }

  public static get $exela_getDocTypesUrl (): string {
    return this.exela_getDocTypesUrl;
  }

  public static get $exela_addOrUpdateProjectDocTypeUrl (): string {
    return this.exela_addOrUpdateProjectDocTypeUrl;
  }

  public static get $exela_getProjectByProjectIdUrl (): string {
    return this.exela_getProjectByProjectIdUrl;
  }

  public static get $exela_getQueuesUrl (): string {
    return this.exela_getQueuesUrl;
  }

  public static get $exela_addOrUpdateProjectQueueUrl (): string {
    return this.exela_addOrUpdateProjectQueueUrl;
  }

  public static get $exela_loginUrl (): string {
    return this.exela_loginUrl;
  }

  public static get $exela_OTPLoginUrl (): string {
    return this.exela_OTPLoginUrl;
  }

  public static get $exela_logoutUrl (): string {
    return this.exela_logoutUrl;
  }

  public static get $exela_getUserAttributes (): string {
    return this.exela_getUserAttributes;
  }

  public static get $exela_addOrUpdateUserAttributes (): string {
    return this.exela_addOrUpdateUserAttributes;
  }

  public static get $exela_changePasswordUrl (): string {
    return this.exelaChangePasswordUrl;
  }

  public static get $exela_updateUserProfileUrl (): string {
    return this.exelaUpdateUserProfileUrl;
  }

  // public static get $getActionListUrl (): string {
  //   return this.getActionListUrl;
  // }

  public static get $getClientListUrl (): string {
    return this.getClientList;
  }

  public static get $resetPasswordUrl (): string {
    return this.resetPasswordUrl;
  }

  /** Start Lexicon */
  public static get $saveLexiconUrl (): string {
    return this.saveLexiconUrl;
  }

  public static get $addOrUpdatedLexiconUrl (): string {
    return this.addOrUpdatedLexiconUrl;
  }

  public static get $getLexiconUrl (): string {
    return this.getLexiconUrl;
  }

  public static get $deactivateLexiconUrl (): string {
    return this.deactivateLexiconUrl;
  }

  public static get $deleteLexiconUrl (): string {
    return this.deleteLexiconUrl;
  }

  public static get $activateLexiconUrl (): string {
    return this.activateLexiconUrl;
  }

  public static get $uploadLexiconFileUrl (): string {
    return this.uploadLexiconFile;
  }
  /** End Lexicon */

  /** Start Rule (nQube) */
  public static get $saveRuleUrl (): string {
    return this.saveRuleUrl;
  }

  public static get $getRuleUrl (): string {
    return this.getRuleURL;
  }

  public static get $addOrUpdateRuleUrl (): string {
    return this.addOrUpdateRuleUrl;
  }

  public static get $deactivateRuleUrl (): string {
    return this.deactivateRuleUrl;
  }

  public static get $deleteRuleUrl (): string {
    return this.deleteRuleUrl;
  }

  public static get $activateRuleUrl (): string {
    return this.activateRuleUrl;
  }

  public static get $saveRuleCriteriaQueryUrl (): string {
    return this.saveRuleCriteriaQueryUrl;
  }

  public static get $getExecuteRuleUrl (): string {
    return this.executeRuleUrl;
  }

  public static get $getPDFtoPNGUrl (): string {
    return this.PDFtoPNGUrl;
  }

  public static get $getSaveModifiedPDFUrl (): string {
    return this.saveModifiedPDFUrl;
  }

  public static get $getRuleByIdUrl (): string {
    return this.getRuleByIdURL;
  }
  /** End Rule (nQube) */

  /** Start Rule Group (nQube) */
  public static get $saveRuleGroupUrl (): string {
    return this.saveRuleGroupUrl;
  }

  public static get $addOrUpdateRuleGroupUrl (): string {
    return this.addOrUpdateRuleGroupUrl;
  }

  public static get $getRuleGroupUrl (): string {
    return this.getRuleGroupURL;
  }

  public static get $getActiveRuleGroupUrl (): string {
    return this.getActiveRuleGroupURL;
  }

  public static get $deactivateRuleGroupUrl (): string {
    return this.deactivateRuleGroupUrl;
  }

  public static get $deleteRuleGroupUrl (): string {
    return this.deleteRuleGroupUrl;
  }

  public static get $activateRuleGroupUrl (): string {
    return this.activateRuleGroupUrl;
  }

  public static get $checkDepedentRuleGroupsUrl (): string {
    return this.checkDepedentRuleGroups;
  }
  /** End Rule Group (nQube) */

  /** Start Model Setup (nQube) */
  public static get $getModelListUrl (): string {
    return this.getModelList;
  }

  public static get $uploadExecutionFileUrl (): string {
    return this.uploadExecutionFile;
  }

  public static get $getModelSetupUrl (): string {
    return this.getModelSetupURL;
  }

  public static get $saveModelSetupUrl (): string {
    return this.saveModelSetupUrl;
  }

  public static get $addOrUpdateModelSetupUrl (): string {
    return this.addOrUpdateModelSetupUrl;
  }

  public static get $deactivateModelSetupUrl (): string {
    return this.deactivateModelSetupUrl;
  }

  public static get $deleteModelSetupUrl (): string {
    return this.deleteModelSetupUrl;
  }

  public static get $activateModelSetupUrl (): string {
    return this.activateModelSetupUrl;
  }

  public static get $uploadSelectedFileUrl (): string {
    return this.uploadSelectedFile;
  }

  public static get $onlyUpdateModelSetupUrl (): string {
    return this.onlyUpdateModelSetup;
  }

  public static get $checkDepedentModelsUrl (): string {
    return this.checkDepedentModels;
  }
  /** End Model Setup (nQube) */

  /** Start Model Assignment (nQube) */
  public static get $getAllAssignmentModelsUrl (): string {
    return this.getAllAssignmentModels;
  }

  public static get $saveAssignmentModelUrl (): string {
    return this.saveAssignmentModel;
  }

  public static get $updateAssignmentModelUrl (): string {
    return this.updateAssignmentModel;
  }

  public static get $deleteAssignmentModelUrl (): string {
    return this.deleteAssignmentModel;
  }

  public static get $getProjectListUrl (): string {
    return this.getProjectList;
  }
  /** End Model Assignment (nQube) */

  /** Start Autorouting (nQube) */
  public static get $getAutoRoutingListUrl (): string {
    return this.getAutoRoutingListUrl;
  }
  public static get $getAutoRoutingDetailsUrl (): string {
    return this.getAutoRoutingDetailsUrl;
  }
  public static get $saveAutoRoutingUrl (): string {
    return this.saveAutoRoutingDetailsUrl;
  }
  public static get $getAutoRoutingConditions (): string {
    return this.getAutoRoutingConditionsUrl;
  }

  public static get $updateAutoRoutingRulePriority (): string {
    return this.updateAutoRoutingRulePriorityUrl;
  }

  public static get $mailAdminInboxNavigatorSummaryUrl (): string {
    return this.mailAdminInboxNavigatorSummaryUrl;
  }

  public static get $lookupMailAdmin (): string {
    return this.lookupMailAdmin;
  }
  /** End Autorouting (nQube) */

  public static get $getMailTemplateImagesUrl (): string {
    return this.getMailTemplateImages;
  }

  public static get $createAddContractMetaModel (): string {
    return this.createAddContractMetaModel;
  }

  public static get $updateAddContractMetaModel (): string {
    return this.updateAddContractMetaModel;
  }

  public static get $exela_getOrganizationsByProductCode (): string {
    return this.exela_getOrganizationsByProductCode;
  }
}
