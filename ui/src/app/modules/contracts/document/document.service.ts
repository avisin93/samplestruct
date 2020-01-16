import { Injectable } from '@angular/core';
import { RequestService } from '../../request.service';
import { HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  constructor (private requestService: RequestService) {}

  private valueSource = new Subject<boolean>();
  public valueUpdate$ = this.valueSource.asObservable();

  putValue (value: boolean) {
    return value;
  }

  getAllDocumentsForContract (urlParams) {
    return this.requestService.doGET(
      `/api/contracts/${urlParams.contractId}/documents`,
      'API_CONTRACT'
    );
  }

  createDocumentContractFile (data, urlParams) {
    return this.requestService.doPOSTFile(
      `/api/cm-file/contracts/${urlParams.contractId}`,
      data,
      'API_CONTRACT_FILE'
    );
  }

  updateDocument (data, urlParams) {
    return this.requestService.doPUT(
      `/api/contracts/${urlParams.contractId}/documents/${urlParams.documentId}`,
      data,
      'API_CONTRACT'
    );
  }

  updateDocumentComment (comment, commentId) {
    return this.requestService.doPUT(
      `/api/documents/comment/${commentId}`,
      comment,
      'API_CONTRACT'
    );
  }

  deleteDocumentComment (commentId) {
    return this.requestService.doDELETE(
      `/api/documents/comment/${commentId}`,
      'API_CONTRACT'
    );
  }

  deleteDocument (urlParams) {
    return this.requestService.doDELETE(
      `/api/contracts/${urlParams.contractId}/documents/${urlParams.documentId}`,
      'API_CONTRACT'
    );
  }

  deleteDocuments (urlParams, params) {
    return this.requestService.doDELETE(
      `/api/contracts/${urlParams.contractId}/documents`,
      'API_CONTRACT',
      params
    );
  }

  emitEvent (event: boolean) {
    this.putValue(event);
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
}
