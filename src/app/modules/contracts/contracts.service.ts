import { Injectable } from '@angular/core';
import { RequestService } from '../request.service';
import { HttpParams, HttpHeaders, HttpClient } from '@angular/common/http';
import { StorageService } from '../shared/providers/storage.service';
import { Observable, Subject } from 'rxjs';
import { UrlDetails } from 'src/app/models/url/url-details.model';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  public addMode: boolean;
  public indexOfHighestOpenedTabCommercials: number = 0;
  public indexOfHighestOpenedTabOtherCommercialTerms: number = 0;
  public indexOfHighestOpenedTabSla: number = 0;
  public contractId: string;
  public contractData: any = {};
  public billingCurrency: any;
  public genInfoCurrency: any;
  public genInfoCurrencySubject = new Subject();

  constructor (private requestService: RequestService, private httpService: HttpClient) {}

  addOrUpdateAttribute (id, userAttributes) {
    let body: any = {
      id : id,
      userAttributes : userAttributes
    };

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type','application/json')
      .append('Authorization','Bearer ' + StorageService.get(StorageService.exelaAuthToken));
    this.httpService.post(`${UrlDetails.$exela_addOrUpdateUserAttributes}`,body,{ headers: headers, responseType: 'text' }).toPromise().then(response => {
      return response;
    }).catch(error => {
      return error;
    });
  }
  async getAttributeForContractList () {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type','application/json')
    .append('Authorization','Bearer ' + StorageService.get(StorageService.exelaAuthToken));
    return this.httpService.post(`${UrlDetails.$exela_getUserAttributes}/${StorageService.get(StorageService.userId)}`,
    undefined,{ headers: headers, observe: 'response' }).toPromise().then(response => {
      let list: any = response.body;
      return list.find((item: any) => {
        return item.att_name === 'contact-person-columns';
      });
    }
    ).catch();

  }

  setGenInfoCurrency (genInfoCurrency) {
    this.genInfoCurrency = genInfoCurrency;
    this.genInfoCurrencySubject.next(genInfoCurrency);
  }

  getGenInfoCurrencySubject (): Observable<Object> {
    return this.genInfoCurrencySubject;
  }

  createContract (objectData) {
    return this.requestService.doPOST(
      '/api/contracts',
      objectData,
      'API_CONTRACT'
    );
  }

  documentUploadContractFile (objectData) {
    return this.requestService.doPOSTFile(
      '/api/cm-file/contracts',
      objectData,
      'API_CONTRACT_FILE'
    );
  }

  updateContract (objectData, urlParams) {
    let headers = new HttpHeaders();
    let userEmail = StorageService.get('userEmail');
    headers = headers
      .append('Accept', 'application/json')
      .append('user-id', userEmail.name);
    return this.requestService.doPUT(
      `/api/contracts/${urlParams.contractId}`,
      objectData,
      'API_CONTRACT'
    );
  }

  getContract (urlParams) {
    return this.requestService.doGET(
      `/api/contracts/${urlParams.contractId}`,
      'API_CONTRACT'
    );
  }

  getAllCategories () {
    return this.requestService.doGET(
      '/api/mdm/categories',
      'API_CONTRACT'
    );
  }

  getAllBusinessPartners () {
    return this.requestService.doGET(
      '/api/mdm/business-partners',
      'API_CONTRACT'
    );
  }

  getAllLegalEntities () {
    return this.requestService.doGET(
      '/api/mdm/legal-entities', 'API_CONTRACT'
    );
  }

  getTimePeriods () {
    return this.requestService.doGET(
      '/api/mdm/time-periods',
      'API_CONTRACT'
    );
  }

  getAllRenewalTypes () {
    return this.requestService.doGET(
      '/api/mdm/renewal-types',
      'API_CONTRACT'
    );
  }

  getAllTimeFrequencies () {
    return this.requestService.doGET(
      '/api/mdm/time-frequencies',
      'API_CONTRACT'
    );
  }

  getAllCurrencies () {
    return this.requestService.doGET(
      '/api/mdm/currencies',
      'API_CONTRACT'
    );
  }

  getAllStatus () {
    return this.requestService.doGET(
      '/api/mdm/status',
      'API_CONTRACT'
    );
  }

  getAllIncentiveStatus () {
    return this.requestService.doGET('/api/mdm/incentive-statuses', 'API_CONTRACT');
  }

  getAllEarlyPayDiscStatus () {
    return this.requestService.doGET('/api/mdm/early-payment-discount-statuses', 'API_CONTRACT');
  }

  getAllTerminationStatus () {
    return this.requestService.doGET('/api/mdm/termination-statuses', 'API_CONTRACT');
  }

  getAllTerminationTerm () {
    return this.requestService.doGET('/api/mdm/termination-terms', 'API_CONTRACT');
  }

  searchContractListContracts (params?: HttpParams) {
    return this.requestService.doGET(
      '/api/contracts/search',
      'API_CONTRACT',
      params
    );
  }

  getContractsStagesCountByClientUserDashboardConfiguration (queryParams) {
    return this.requestService.doGET(
      '/api/contracts/stages-count',
      'API_CONTRACT',
      queryParams
    );
  }

  getAllDocumentTypes () {
    return this.requestService.doGET(
      '/api/mdm/document-types',
      'API_CONTRACT'
    );
  }

  getAllColaStatus () {
    return this.requestService.doGET(
      '/api/mdm/cola-statuses',
      'API_CONTRACT'
    );
  }

  getAllPenaltyTypes () {
    return this.requestService.doGET(
      '/api/mdm/penalty-types',
      'API_CONTRACT'
    );
  }

  getAllPenaltyStatuses () {
    return this.requestService.doGET(
      '/api/mdm/penalty-statuses',
      'API_CONTRACT'
    );
  }

  getAllLatePayFeeStatuses () {
    return this.requestService.doGET(
      '/api/mdm/late-pay-fee-statuses',
      'API_CONTRACT'
    );
  }

  getAllTatTypes () {
    return this.requestService.doGET(
      '/api/mdm/tat-types',
      'API_CONTRACT'
    );
  }

  getAllTatStatuses () {
    return this.requestService.doGET(
      '/api/mdm/tat-statuses',
      'API_CONTRACT'
    );
  }

  getAllQualityStatuses () {
    return this.requestService.doGET(
      '/api/mdm/quality-statuses',
      'API_CONTRACT'
    );
  }

  getAllUptimeStatuses () {
    return this.requestService.doGET(
      '/api/mdm/uptime-statuses',
      'API_CONTRACT'
    );
  }

  getAllDocumentsByBusinessPartnerAndStartDate (params: HttpParams) {
    return this.requestService.doGET(
      '/api/contracts/documents/search',
      'API_CONTRACT',
      params
    ).toPromise();
  }

  getClientConfigurations () {
    return this.requestService.doGET(
      '/api/mdm/client-configurations',
      'API_CONTRACT'
    );
  }

  getClientCategories () {
    return this.requestService.doGET(
      '/api/mdm/client/categories',
      'API_CONTRACT'
    );
  }

  getClientBusinessPartners () {
    return this.requestService.doGET(
      '/api/mdm/client/business-partners',
      'API_CONTRACT'
    );
  }

  getClientLegalEntities () {
    return this.requestService.doGET(
      '/api/mdm/client/legal-entities',
      'API_CONTRACT'
    );
  }

  createBusinessPartner (objectData): Observable<Object> {
    return this.requestService.doPOST(
      '/api/mdm/client/business-partners',
      objectData,
      'API_CONTRACT'
    );
  }

  createCategory (objectData): Observable<Object> {
    return this.requestService.doPOST(
      '/api/mdm/client/categories',
      objectData,
      'API_CONTRACT'
    );
  }

  createSubcategory (objectData): Observable<Object> {
    return this.requestService.doPOST(
      '/api/mdm/subcategories',
      objectData,
      'API_CONTRACT'
    );
  }

  createLegalEntity (objectData): Observable<Object> {
    return this.requestService.doPOST(
      '/api/mdm/client/legal-entities',
      objectData,
      'API_CONTRACT'
    );
  }

  createUom (objectData): Observable<Object> {
    return this.requestService.doPOST(
      '/api/mdm/client/uoms',
      objectData,
      'API_CONTRACT'
    );
  }

  createFunction (objectData): Observable<Object> {
    return this.requestService.doPOST(
      '/api/mdm/client/functions',
      objectData,
      'API_CONTRACT'
    );
  }

  createLinkedOpportunity (objectData): Observable<Object> {
    return this.requestService.doPOST(
      '/api/mdm/client/linked-opportunities',
      objectData,
      'API_CONTRACT'
    );
  }

  createService (objectData): Observable<Object> {
    return this.requestService.doPOST(
      '/api/mdm/client/services',
      objectData,
      'API_CONTRACT'
    );
  }

  createSubService (objectData): Observable<Object> {
    return this.requestService.doPOST(
      '/api/mdm/client/subservices',
      objectData,
      'API_CONTRACT'
    );
  }

  createProject (objectData): Observable<Object> {
    return this.requestService.doPOST(
      '/api/mdm/client/projects',
      objectData,
      'API_CONTRACT'
    );
  }

  createDocumentType (objectData): Observable<Object> {
    return this.requestService.doPOST(
      '/api/mdm/document-types',
      objectData,
      'API_CONTRACT'
    );
  }
}
