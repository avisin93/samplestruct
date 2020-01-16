import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { HttpRequest, HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class HttpService {

  constructor (private http: HttpClient, private httpClient: HttpClient, private router: Router) { }

  getAll (url: string): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    headers = this.appendJWTToken(headers);
    return this.http.get(url,{ headers: headers });
  }

  get (url: string, value: any): Observable<any> {
    let headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
      'Access-Control-Allow-Credentials': 'true' });
    headers = this.appendJWTToken(headers);

    if (value['secrete_key']) {
      headers.append('secrete_key', value['secrete_key']);
    }
    delete(value.secrete_key);

    return this.http.post(url, value, { headers: headers });
  }

  getAllFacility (url: string): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers = this.appendJWTToken(headers);
    return this.http.post(
      url,
      StorageService.get(StorageService.organizationId),
      { headers: headers }
    );
  }

  save (url: string, value: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    headers = this.appendJWTToken(headers);
    if (value['secrete_key']) {
      headers = headers.append('secrete_key', value['secrete_key']);
      delete(value.secrete_key);
    }
    if (value['old_secrete_key']) {
      headers = headers.append('old_secrete_key', value['old_secrete_key']);
      delete(value.old_secrete_key);
    }

    return this.http.post(url, value, { headers: headers });
  }

  saveAndReturnObserve (url: string, value: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    headers = this.appendJWTToken(headers);
    if (value['secrete_key']) {
      headers = headers.append('secrete_key', value['secrete_key']);
      delete(value.secrete_key);
    }
    if (value['old_secrete_key']) {
      headers = headers.append('old_secrete_key', value['old_secrete_key']);
      delete(value.old_secrete_key);
    }

    return this.http.post(url, value, { headers: headers, observe: 'response' });
  }

  upload (url: string, files: Array<File>,postObject): Observable<any> {
    const formData: any = new FormData();
    formData.append('organizationId',postObject.organizationId);
    formData.append('folderId',postObject.folderId);
    formData.append('userName',postObject.userName);
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i], files[i]['name']);
    }
    const req = new HttpRequest('POST', url, formData, {
      reportProgress: true,
      responseType: 'json'
    }
    );
    return this.httpClient.request(req);
  }

  delete (url: string, value: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    headers = this.appendJWTToken(headers);
    return this.http.post(url, value, { headers: headers });
  }

  update (url: string, value: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    headers = this.appendJWTToken(headers);
    return this.http.post(url, value, { headers: headers });
  }

  remove (url: string, value: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers = this.appendJWTToken(headers);
    return this.http.post(url, value, { headers: headers });
  }

  findById (url: string, value: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    headers = this.appendJWTToken(headers);
    return this.http.post(url, value, { headers: headers });
  }

  uploadUsers (url: string, data: any) {
    return this.http.post(url, data);
  }

  getAllUsers (url: string, organizationId): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    headers = this.appendJWTToken(headers);
    return this.http.post(url, organizationId);
  }

  appendJWTToken (header: HttpHeaders) {
    return header.append('Authorization', 'Bearer ' + StorageService.get(StorageService.exelaAuthToken));
  }

  getFile (url: string): Observable<any> {
    let headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
      'Access-Control-Allow-Credentials': 'true' // TODO:Vido Ovo je bilo tipa boolean a ne string
    });
    headers = this.appendJWTToken(headers);
    return this.http.get(url);
  }

  uploadFile (url: string, formData): Observable<any> {
    const req = new HttpRequest('POST', url, formData, {
      reportProgress: true,
      responseType: 'json'
    }
    );
    return this.httpClient.request(req);
  }
}
