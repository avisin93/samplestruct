/**
* Component     : LoginService
 
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
import { HttpRequest, Common } from '@app/common';
import { API_URL } from '@app/config';

/**
* UserService class is used to fetch the users data from the server through webservices
*/

@Injectable()
export class ManagePaymentService {
  private data: any;
  private observable: Observable<any>;

  private user: any;

  constructor(private _http: HttpRequest) {

  }
  //   putInvoiceDetails(id, data) {
  //     return this._http.put(URL_PATHS.invoices + "/" + id, data);
  //   }
  postPaymentDetails(data) {
    return this._http.post(API_URL.payments, data);
  }
  getPaymentHistoryList(data) {
    return this._http.get(API_URL.paymentHistory, data);
  }
  getInvoiceData(invoiceId) {
    return this._http.get(Common.sprintf(API_URL.paymentInvoices, [invoiceId]));
  }

}
