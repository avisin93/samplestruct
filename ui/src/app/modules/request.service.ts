import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { StorageService } from './shared/providers/storage.service';

let TypeApi = {
  API_SCHEDULE: environment.cmScheduler,
  API_CONTRACT: environment.cmCore,
  API_CONTRACT_FILE: environment.cmFile
};

@Injectable()
export class RequestService {
  constructor (private http: HttpClient, private router: Router) {}

  doGET (urlBE: string, typeApi: string, params?: HttpParams) {
    let headers = new HttpHeaders();
    let userEmail = StorageService.get('userEmail');
    const organizationCode = StorageService.get('organizationCode');
    headers = this.appendJWTToken(headers);
    headers = headers
      .append('Accept', 'application/json')
      .append('user-id', userEmail)
      .append('Organization-Code', organizationCode);
    return this.http
      .get(TypeApi[typeApi] + urlBE, { headers: headers, params: params })
      .pipe(
        catchError(err => {
          return this.errorHandler(err);
        })
      );
  }

  doGETFile (urlBE: string, typeApi: string, params?: HttpParams, responseType?) {
    let headers = new HttpHeaders();
    let userEmail = StorageService.get('userEmail');
    const organizationCode = StorageService.get('organizationCode');
    headers = this.appendJWTToken(headers);
    headers = headers
      .append('Accept', 'application/json')
      .append('user-id', userEmail)
      .append('Organization-Code', organizationCode);
    return this.http
      .get(TypeApi[typeApi] + urlBE, { observe: 'response', headers: headers, params: params, responseType: responseType })
      .pipe(
        catchError(err => {
          return this.errorHandler(err);
        })
      );
  }

  doPOST (urlBE: string, body: JSON, typeApi: string, params?: HttpParams, organizationCodeClientInit?: string) {
    let headers = new HttpHeaders();
    let userEmail = StorageService.get('userEmail');
    const organizationCode = StorageService.get('organizationCode');
    headers = this.appendJWTToken(headers);
    headers = headers
      .append('Accept', 'application/json')
      .append('user-id', userEmail)
      .append('Organization-Code', organizationCode !== 'undefined' ? organizationCode : organizationCodeClientInit);
    return this.http
      .post(TypeApi[typeApi] + urlBE, body, {
        headers: headers,
        params: params
      })
      .pipe(
        catchError(err => {
          return this.errorHandler(err);
        })
      );
  }

  doPOSTFile (urlBE: string, formData: FormData, typeApi: string, params?: HttpParams) {
    let headers = new HttpHeaders();
    let userEmail = StorageService.get('userEmail');
    const organizationCode = StorageService.get('organizationCode');
    headers = this.appendJWTToken(headers);
    headers = headers
      .append('Accept', 'application/json')
      .append('enctype', 'multipart/form-data')
      .append('Organization-Code', organizationCode)
      .append('user-id', userEmail);
    return this.http
      .post(TypeApi[typeApi] + urlBE, formData, {
        headers: headers,
        params: params
      })
      .pipe(
        catchError(err => {
          return this.errorHandler(err);
        })
      );
  }

  doPUT (urlBE: string, body: JSON, typeApi: string, params?: HttpParams) {
    let headers = new HttpHeaders();
    let userEmail = StorageService.get('userEmail');
    const organizationCode = StorageService.get('organizationCode');
    headers = this.appendJWTToken(headers);
    headers = headers
      .append('Accept', 'application/json')
      .append('Organization-Code', organizationCode)
      .append('user-id', userEmail);
    return this.http
      .put(TypeApi[typeApi] + urlBE, body, { headers: headers, params: params })
      .pipe(
        catchError(err => {
          return this.errorHandler(err);
        })
      );
  }

  doDELETE (urlBE: string, typeApi: string, params?: HttpParams) {
    let headers = new HttpHeaders();
    let userEmail = StorageService.get('userEmail');
    const organizationCode = StorageService.get('organizationCode');
    headers = this.appendJWTToken(headers);
    headers = headers
      .append('Organization-Code', organizationCode)
      .append('user-id', userEmail);
    return this.http
      .delete(TypeApi[typeApi] + urlBE, { headers: headers, params: params })
      .pipe(
        catchError(err => {
          return this.errorHandler(err);
        })
      );
  }

  errorHandler (err) {
    let errorMsg = '';
    if (err.error instanceof ErrorEvent) {
      errorMsg = 'An error occurred: ' + err.error.message;
    } else {
      errorMsg =
        'Server returned code: ' +
        err.status +
        ', error message is: ' +
        err.message;
    }

    console.log(errorMsg);
    return throwError(err);
  }

  appendJWTToken (header: HttpHeaders) {
    return header.append('Authorization', 'Bearer ' + StorageService.get(StorageService.exelaAuthToken));
  }
}
