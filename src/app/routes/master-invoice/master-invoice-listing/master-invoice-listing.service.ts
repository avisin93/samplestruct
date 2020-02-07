/**
* Component     : LoginService
 
* Creation Date : 3rd Jan 2020
*/

import { Injectable } from '@angular/core';
import { HttpRequest, Common } from '@app/common';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import 'rxjs/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import { API_URL } from '@app/config';

/**
* UserService class is used to fetch the users data from the server through webservices
*/

@Injectable()
export class MasterInvoiceListingService {
  private data: any;
  private observable: Observable<any>;

  private user: any;

  /**
  * constructor method is used to initialize members of class
  */
  constructor(private _http: HttpRequest) {

  }

  /**
  * This method is used to get active projects list
  */
  getActiveProjects() {
    return this._http.get(API_URL.poProjects);
  }

  /**
  * This method is used to get active projects list
  */
  getSuppliers(searchParams) {
    return this._http.get(API_URL.projectSupplierListUrl, searchParams);
  }

  /**
   * [getInvoiceList method use to get list of invoices from webservice
   * @param  searchParams are extra parameters passing along with request
   * @return              invoices URL
   */
  getInvoiceList(searchParams) {
    return this._http.get(API_URL.masterInvoice, searchParams);
  }

  /**
   * Delets invoice for the passed invoiceId
   * @param invoiceId as for which the invoice id is to be removed
   */
  removeInvoice(invoiceId) {
    return this._http.post(Common.sprintf(API_URL.removeInvoiceUrl, [invoiceId]), '');
  }

  /**
   * Gets payment list as per the query params
   * @param params
   */
  getPaymentsList(params: any) {
    return this._http.get(Common.sprintf(API_URL.payments, []), params);
  }

  approveInvoice(invoiceId) {
    return this._http.post(Common.sprintf(API_URL.approveInvoiceUrl, [invoiceId]), '');
  }
  rejectInvoice(invoiceId, approverData) {
    return this._http.post(Common.sprintf(API_URL.rejectInvoiceUrl, [invoiceId]), approverData);
  }
  setInvoiceOnHold(invoiceId, approverData) {
    return this._http.patch(Common.sprintf(API_URL.onHoldInvoiceUrl, [invoiceId]), approverData);
  }
}
