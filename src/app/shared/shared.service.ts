import { Injectable } from '@angular/core';
import { HttpRequest, Common } from '@app/common';
import { URL_PATHS, URL_FULL_PATHS, API_URL } from '@app/config';
@Injectable()
export class SharedService {
  apiUrl = URL_PATHS.currencyUrl;
  operationUrl = URL_PATHS.operationModeUrl;
  projectURL = URL_PATHS.projectTypesUrl;
  rolePermissionsUrl = '';
  currencyUrl = '';
  operationModeUrl = '';
  constructor(private _http: HttpRequest) {

  }

  /**
  ** Common API Call for get Data
  **/
  apiCall(url: string, params?) {
    if (params) {
      return this._http.get(url, params);
    } else {
      return this._http.get(url);
    }
  }

  /**
  *  method used to get the role permissions data
  */
  getRolePermissions(rolePermissionsUrl) {
    return this._http.getJsonData(rolePermissionsUrl);
  }

  /**
  ** Get the list of Currency types
  **/
  getCurrencies() {
    return this.apiCall(this.apiUrl);
  }
  /**
  ** Get the list of Currency types
  **/
  getModesOfOperation() {
    return this.apiCall(this.operationUrl);
  }
  /**
  ** Get the list of Currency types
  **/
  getProjectTypes() {
    return this.apiCall(this.projectURL);
  }
  /**
  ** Get the list of Currency types
  **/
  getProjectCategories(typeId, params: any = {}) {
    return this.apiCall(URL_PATHS.projectCategoriesUrl + typeId, params);
  }
  /**
  ** Get the list of Currency types
  **/
  getThirdPartyVendors() {
    return this.apiCall(URL_PATHS.thirdPartyVendorsUrl);
  }

  getContractFile() {
    return this._http.get(URL_FULL_PATHS.contractDownload);
  }
  uploadFile(data) {
    return this._http.postMultipartData(URL_PATHS.fileUrl, data);
  }
  uploadLocationImages(data) {
    return this._http.post(URL_PATHS.locationImageUrl, data);
  }
  checkActivatonLink(data) {
    return this._http.post(URL_PATHS.checkActivationLink, data);
  }
  getCompanies() {
    return this.apiCall(URL_PATHS.companyUrl);
  }
  getBudgetTypes() {
    return this.apiCall(URL_PATHS.budgetTypesUrl);
  }
  getPODefaultValues() {
    return this.apiCall(URL_PATHS.poUrl + '/' + URL_PATHS.poDefaultValueUrl);
  }
  getPOBudgetLine(projectId, purchaseOrderFor) {
    return this.apiCall(URL_PATHS.budgetLine + projectId + '/' + purchaseOrderFor);
  }
  getAdvanceBudgetLine(projectId, purchaseOrderFor) {
    return this.apiCall(URL_PATHS.advancebudgetLine + projectId + '/' + purchaseOrderFor);
  }
  getPOFreelancers(budgetLineId) {
    return this.apiCall(URL_PATHS.poFreelancerUrl + '/' + budgetLineId);
  }
  getReuestedByFreelancers() {
    return this.apiCall(URL_PATHS.requestedByFreelancerUrl);
  }
  getProjectCurrencies(projectId) {
    return this.apiCall(URL_PATHS.projectsUrl + '/' + projectId + '/' + URL_PATHS.projectCurrenciesUrl);
  }

  getPOLocations(params) {
    return this.apiCall(URL_PATHS.poLocations, params);
  }
  getLocationScouter() {
    return this.apiCall(URL_PATHS.locationScouter);
  }

  getAdvancesBudgetLine(projectId, advancesFor) {
    return this.apiCall(URL_PATHS.advancesBudgetLineUrl + '/' + projectId + '/' + advancesFor);
  }
  getAdvancesFreelancers(budgetLineId) {
    return this.apiCall(URL_PATHS.advancesFreelancerUrl + '/' + budgetLineId);
  }
  getAdvancesVendors(budgetLineId) {
    return this.apiCall(URL_PATHS.advancesVendorUrl + '/' + budgetLineId);
  }
  getMasterLocations(projectId) {
    return this.apiCall(URL_PATHS.masterLocationsUrl + '/' + projectId);
  }
  getAdvanceSettleBudgetLines(projectId) {
    return this.apiCall(URL_PATHS.advanceSettlementUrl + '/' + projectId + '/' + URL_PATHS.budgetLines);
  }

  checkDefaultCurrencyAdded(projectId) {
    return this.apiCall(URL_PATHS.projectSettingUrl + '/' + URL_PATHS.currencyValidationUrl + '/' + projectId);
  }

  getAccessRolePermissionDetails(id) {
    return this._http.get(Common.sprintf(API_URL['rolesAccess'], [id]));
  }

}
