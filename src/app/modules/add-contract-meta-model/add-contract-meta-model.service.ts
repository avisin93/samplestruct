import { Injectable } from '@angular/core';
import { RequestService } from '../request.service';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class AddContractMetaModelService {

  constructor (
    private requestService: RequestService
  ) {}

  getAddContractMetaModel (): Observable<Object> {
    return this.requestService.doGET(
      `/api/contracts/add-contract-meta-model`,
      'API_CONTRACT'
    );
  }

  createAddContractMetaModelTab (urlParams, objectData): Observable<Object> {
    return this.requestService.doPOST(
      `/api/contracts/add-contract-meta-model/${urlParams.addContractMetaModelId}/add-contract-meta-model-tab`,
      objectData,
      'API_CONTRACT'
    );
  }

  updateAddContractMetaModelTab (urlParams, objectData): Observable<Object> {
    return this.requestService.doPUT(
      `/api/contracts/add-contract-meta-model/${urlParams.addContractMetaModelId}/add-contract-meta-model-tab/${urlParams.addContractMetaModelTabId}`,
      objectData,
      'API_CONTRACT'
    );
  }

  updateAddContractMetaModelTabs (urlParams, objectData): Observable<Object> {
    return this.requestService.doPUT(
      `/api/contracts/add-contract-meta-model/${urlParams.addContractMetaModelId}/add-contract-meta-model-tabs`,
      objectData,
      'API_CONTRACT'
    );
  }

  deleteAddContractMetaModelTab (urlParams): Observable<Object> {
    return this.requestService.doDELETE(
      `/api/contracts/add-contract-meta-model/${urlParams.addContractMetaModelId}/add-contract-meta-model-tab/${urlParams.addContractMetaModelTabId}`,
      'API_CONTRACT'
    );
  }

  createAddContractMetaModelSubtab (urlParams, objectData): Observable<Object> {
    return this.requestService.doPOST(
      `/api/contracts/add-contract-meta-model/${urlParams.addContractMetaModelId}/add-contract-meta-model-tab/${urlParams.addContractMetaModelTabId}/add-contract-meta-model-subtab`,
      objectData,
      'API_CONTRACT'
    );
  }

  updateAddContractMetaModelTabSubtab (urlParams, objectData): Observable<Object> {
    return this.requestService.doPUT(
      `/api/contracts/add-contract-meta-model/${urlParams.addContractMetaModelId}/add-contract-meta-model-tab/${urlParams.addContractMetaModelTabId}/add-contract-meta-model-subtab/${urlParams.addContractMetaModelSubtabId}`,
      objectData,
      'API_CONTRACT'
    );
  }

  deleteAddContractMetaModelSubtab (urlParams): Observable<Object> {
    return this.requestService.doDELETE(
      `/api/contracts/add-contract-meta-model/${urlParams.addContractMetaModelId}/add-contract-meta-model-tab/${urlParams.addContractMetaModelTabId}/add-contract-meta-model-subtab/${urlParams.addContractMetaModelSubtabId}`,
      'API_CONTRACT'
    );
  }

  updateAddContractMetaModelTabSubtabs (urlParams, objectData): Observable<Object> {
    return this.requestService.doPUT(
      `/api/contracts/add-contract-meta-model/${urlParams.addContractMetaModelId}/add-contract-meta-model-tab/${urlParams.addContractMetaModelTabId}/add-contract-meta-model-subtabs`,
      objectData,
      'API_CONTRACT'
    );
  }

  updateAddContractMetaModelTabSubtabFields (urlParams, objectData): Observable<Object> {
    return this.requestService.doPUT(
      `/api/contracts/add-contract-meta-model/${urlParams.addContractMetaModelId}/add-contract-meta-model-tab/${urlParams.addContractMetaModelTabId}/add-contract-meta-model-subtab/${urlParams.addContractMetaModelSubtabId}/add-contract-meta-model-subtab-fields`,
      objectData,
      'API_CONTRACT'
    );
  }

  resetFieldsForMetaContractTab (urlParams, objectData): Observable<Object> {
    return this.requestService.doPUT(
      `/api/contracts/reset-fields-for-tab/${urlParams.addContractMetaModelId}/add-contract-meta-model-tab/${urlParams.addContractMetaModelTabId}`,
      objectData,
      'API_CONTRACT'
    );
  }

  getAllCurrencies () {
    return this.requestService.doGET(
      '/api/mdm/currencies',
      'API_CONTRACT'
    );
  }

  private addContractMetaModel = new Subject<any>();
  addContractMetaModelChange$ = this.addContractMetaModel.asObservable();
  changedTabs (response: any) {
    this.addContractMetaModel.next(response);
  }

  private showPanels = new Subject<any>();
  showPanelsChange$ = this.showPanels.asObservable();
  changedPanels (response: any) {
    this.showPanels.next(response);
  }

  private selectedIndexSubtab = new Subject<any>();
  newSubTabChange$ = this.selectedIndexSubtab.asObservable();
  changedSubtab (response: any) {
    this.selectedIndexSubtab.next(response);
  }

  private isDefaultTab = new Subject<any>();
  isDefaultTabChange$ = this.isDefaultTab.asObservable();
  changedIsDefaultTab (response: any) {
    this.isDefaultTab.next(response);
  }

  private componentMethodCallSource = new Subject<any>();

  // Observable string streams
  componentMethodCalledForTab$ = this.componentMethodCallSource.asObservable();

  // Service message commands
  callOpenDialogForTab () {
    this.componentMethodCallSource.next();
  }

  getClientConfigurations () {
    return this.requestService.doGET(
      '/api/mdm/client-configurations',
      'API_CONTRACT'
    );
  }
}
