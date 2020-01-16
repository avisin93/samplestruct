import { Injectable } from '@angular/core';
import { RequestService } from '../request.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { StorageService } from '../shared/providers/storage.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContractsMetaService {
  public addMode: boolean;
  public contractId: string;
  public contractData: any = {};

  constructor (private requestService: RequestService) {}

  createContractMeta (objectData) {
    return this.requestService.doPOST(
      '/api/contracts-meta',
      objectData,
      'API_CONTRACT'
    );
  }

  updateContractMeta (objectData, urlParams) {
    return this.requestService.doPUT(
      `/api/contracts-meta/${urlParams.contractId}`,
      objectData,
      'API_CONTRACT'
    );
  }

  deleteContractMetaProp (urlParams, query) {
    return this.requestService.doDELETE(
      `/api/contracts-meta/${urlParams.contractId}/${urlParams.uuid}?tab=${query.tab}&subtab=${query.subtab}`,
      'API_CONTRACT'
    );
  }

  getContractMeta (urlParams) {
    return this.requestService.doGET(
      `/api/contracts-meta/${urlParams.contractId}`,
      'API_CONTRACT'
    );
  }

  getAddContractMetaModel (): Observable<Object> {
    return this.requestService.doGET(
      `/api/contracts/add-contract-meta-model`,
      'API_CONTRACT'
    );
  }

  getAllCurrencies () {
    return this.requestService.doGET(
      '/api/mdm/currencies',
      'API_CONTRACT'
    );
  }

  getTimePeriods () {
    return this.requestService.doGET(
      '/api/mdm/time-periods',
      'API_CONTRACT'
    );
  }

  createDocumentContractMetaFile (data, urlParams) {
    return this.requestService.doPOSTFile(
      `/api/cm-file/contracts/${urlParams.contractId}`,
      data,
      'API_CONTRACT_FILE'
    );
  }

  updateDocumentContractMetaFile (data, urlParams) {
    return this.requestService.doPUT(
      `/api/contracts-meta/${urlParams.contractId}/documents/${urlParams.documentId}`,
      data,
      'API_CONTRACT'
    );
  }

  deleteDocument (urlParams) {
    return this.requestService.doDELETE(
      `/api/contracts-meta/${urlParams.contractId}/documents/${urlParams.documentId}`,
      'API_CONTRACT'
    );
  }

  getAllDocumentsByBusinessPartnerAndStartDate (params: HttpParams) {
    return this.requestService.doGET(
      '/api/contracts-meta/documents/search',
      'API_CONTRACT',
      params
    );
  }

  getClientConfigurations () {
    return this.requestService.doGET(
      '/api/mdm/client-configurations',
      'API_CONTRACT'
    );
  }

  addClientObject (objectData) {
    return this.requestService.doPOST(
      '/api/mdm/client/object',
      objectData,
      'API_CONTRACT'
    );
  }
}
