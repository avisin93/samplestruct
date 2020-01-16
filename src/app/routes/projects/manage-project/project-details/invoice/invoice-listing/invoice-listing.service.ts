
import { Injectable } from '@angular/core';
import { HttpRequest, Common } from '@app/common';
import { API_URL } from '@app/config';
/**
* UserService class is used to fetch the users data from the server through webservices
*/

@Injectable()
export class InvoiceListService {

  /**
  * constructor method is used to initialize members of class
  */
  constructor(private _http: HttpRequest) {

  }
  /**
   * [getInvoiceList method use to get list of invoices from webservice
   * @param  searchParams are extra parameters passing along with request
   * @return              invoices URL
   */
  getInvoiceList(searchParams) {
    return this._http.get(API_URL.invoiceUrl, searchParams);
  }
  /**
   * invoiceGetById use to get details of particular invoice
   * @param  invoiceID of which we want details
   * @return service response
   */
  invoiceGetById(invoiceID) {
    return this._http.get(Common.sprintf(API_URL.invoiceUrl, [invoiceID]));
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
    return this._http.get(Common.sprintf(API_URL.paymentsUrl, []), params);
  }

  approveInvoice(invoiceId) {
    return this._http.post(Common.sprintf(API_URL.approveInvoiceUrl, [invoiceId]), "");
  }
  rejectInvoice(invoiceId, approverData) {
    return this._http.post(Common.sprintf(API_URL.rejectInvoiceUrl, [invoiceId]), approverData);
  }
  setInvoiceOnHold(invoiceId, approverData) {
    return this._http.patch(Common.sprintf(API_URL.onHoldInvoiceUrl, [invoiceId]), approverData);
  }
 getSuppliers(searchParams) {
  return this._http.get(API_URL.projectSupplierListUrl, searchParams);
}
}
