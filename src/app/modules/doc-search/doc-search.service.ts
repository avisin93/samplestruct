import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { RequestService } from '../request.service';
import { StorageService } from '../shared/providers/storage.service';
import { UrlDetails } from 'src/app/models/url/url-details.model';

@Injectable({
  providedIn: 'root'
})
export class DocSearchService {
  constructor (private requestService: RequestService,private httpService: HttpClient) {}

  searchDocSearchContractsDocuments (params?: HttpParams) {
    return this.requestService.doGET(
      '/api/contracts/documents/search',
      'API_CONTRACT',
      params
    );
  }

  deleteContract (urlParams) {
    return this.requestService.doDELETE(
      `/api/contracts/${urlParams.contractId}/documents/${urlParams.documentId}`,
      'API_CONTRACT'
    );
  }

  deleteContractsDocuments (contractDocHashMap) {
    return this.requestService.doPUT(
      '/api/contracts/documents/del',
      contractDocHashMap,
      'API_CONTRACT'
    );
  }

  getChildrenFromRootDocument (params: HttpParams) {
    return this.requestService.doGET(
      '/api/documents/children',
      'API_CONTRACT',
      params
    );
  }

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
        return item.att_name === 'doc-search-columns';
      });
    }
    ).catch();
  }

  getUploadedDocument (params: HttpParams, responseType) {
    return this.requestService.doGETFile(
      '/api/cm-file/contracts/documents/download',
      'API_CONTRACT_FILE',
      params,
      responseType
    );
  }

  getUploadedDocumentInZip (params: HttpParams, responseType) {
    return this.requestService.doGETFile(
      '/api/cm-file/contracts/documents/download-zip',
      'API_CONTRACT_FILE',
      params,
      responseType
    );
  }

  getAllStatus () {
    return this.requestService.doGET(
      '/api/mdm/status',
      'API_CONTRACT'
    );
  }
}
