/**
* Component     : LoginService
* Author        : Boston Byte LLC
* Creation Date : 20 Aug 2018
*/

import { Injectable } from '@angular/core';
// import { Http, Response } from '@angular/http';


import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import 'rxjs/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import { HttpRequest, Common } from '../../../../../../common';
import { URL_PATHS, API_URL } from '../../../../../../config';

/**
* UserService class is used to fetch the users data from the server through webservices
*/

@Injectable()
export class ViewInvoiceDetailsService {
  private data: any;
  private observable: Observable<any>;

  private user: any;

  constructor(private _http: HttpRequest) {

  }

  getPurchaseOrder(id) {
    return this._http.get(Common.sprintf(API_URL.managePurchaseOrderUrl, [id]));
  }
  putInvoiceDetails(id, data) {
    return this._http.put(Common.sprintf(API_URL.manageInvoiceUrl, [id]), data);
  }
  postInvoiceDetails(data) {
    return this._http.post(API_URL.invoiceUrl, data);
  }
  getInvoiceHistoryList(params) {
    return this._http.get(API_URL.invoicesHistoryUrl, params);
  }
  getInvoiceData(invoiceId) {
    return this._http.get(Common.sprintf(API_URL.manageInvoiceUrl, [invoiceId]));
  }
}
