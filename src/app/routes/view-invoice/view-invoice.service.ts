/**
* Component     : LoginService
 
* Creation Date : 22 Aug 2018
*/

import { Injectable } from '@angular/core';
// import { Http, Response } from '@angular/http';


import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import 'rxjs/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import { HttpRequest, Common } from '../../common';
import {  API_URL } from '../../config';

/**
* UserService class is used to fetch the users data from the server through webservices
*/

@Injectable()
export class ViewInvoicesService {

  constructor(private _http: HttpRequest) {

  }
  getInvoiceById(id) {
    return this._http.get(Common.sprintf(API_URL.manageInvoiceUrl, [id]));
  }
  getPObyId(id) {
    return this._http.get(API_URL.viewPO + '/' + id);
  }
  downloadInvoice(id) {
    return this._http.get(API_URL.downloadInvoice + '/' + id);
  }
}
