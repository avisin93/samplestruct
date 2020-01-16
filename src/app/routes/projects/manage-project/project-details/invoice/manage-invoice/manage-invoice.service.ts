/**
* Component     : LoginService
* Author        : Boston Byte LLC
* Creation Date : 20 Aug 2018
*/

import { Injectable } from '@angular/core';
import { HttpRequest, Common } from '@app/common';
import { API_URL } from '@app/config';

/**
* UserService class is used to fetch the users data from the server through webservices
*/

@Injectable()
export class ManageInvoicesService {

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
