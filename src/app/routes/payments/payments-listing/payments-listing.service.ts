
import { Injectable } from '@angular/core';
import { HttpRequest, Common } from '@app/common';
import { API_URL, URL_FULL_PATHS } from '@app/config';

/**
* ManageSkiLiftsService class is used to fetch the ski lifts data from the server through webservices
*/
@Injectable()
export class PaymentsListingService {

  /**
  * constructor method is used to initialize members of class
  */
  constructor(private _http: HttpRequest) {
  }

  /**
  ** Common API Call for get Data
  **/
  apiCall(url: string) {
    return this._http.get(url);
  }


  // getInvoicesList() {
  //   return this._http.get(URL_PATHS.paymentsUrl);
  // }

  // Service to get list of projects
  getProjectsList() {
    return this._http.get(API_URL.paymentProjects);
  }
  getBudgetList(projectId) {
    return this._http.get(Common.sprintf(API_URL.projectBudgetTypes, [projectId]));
  }
  getTotal(params: any) {
    return this._http.get(API_URL.paymentTotal, params);
  }
  // Service to get list of all scheduled payments
  getPaymentsList(params: any) {
    return this._http.get(API_URL.payments, params);
  }
  // Service to get details of payment wrt payment ID
  getPaymentDetails(id) {
    return this._http.get(Common.sprintf(API_URL.managePayment, [id]));
  }
  // Service to get details of payments other than the one being edited
  getPaymentHistoryDetails(params: any) {
    return this._http.get(API_URL.paymentHistory, params);
  }
  // Service to update schedule date and amount of payment
  updateSchedule(id, data) {
    return this._http.put(Common.sprintf(API_URL.schedulePayment, [id]), data);
  }
  // Service to update payment and mark as paid
  payConfirmation(id, data) {
    return this._http.put(Common.sprintf(API_URL.makePayment, [id]), data);
  }
  // Service to cancel a particular payment
  cancelPayment(id) {
    return this._http.post(Common.sprintf(API_URL.cancelPayment, [id]), '');
  }


}
