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
export class MasterPOService {
  private data: any;
  private observable: Observable<any>;

  private user: any;

  /**
  * constructor method is used to initialize members of class
  */
  constructor(private _http: HttpRequest) {

  }

  /**
  * This method is used to get Purchase Order list
 * @param searchParams as search parameters
  */
  getpurchaseOrderList(searchParams) {
    return this._http.get(API_URL.masterPO, searchParams);
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
   * This method is used to get Master PO excel file
   * @param searchParams as search parameters
   */
  getMasterExcel(searchParams) {
    return this._http.get(API_URL.masterPOExcel, searchParams);
  }
  approvePo(poId) {
    return this._http.post(Common.sprintf(API_URL.approvePo, [poId]), '');
  }
  rejectPo(poId, approverData) {
    return this._http.post(Common.sprintf(API_URL.rejectPo, [poId]), approverData);
  }
  setPOOnHold(poId, approverUserData) {
    return this._http.patch(Common.sprintf(API_URL.onhold, [poId]), approverUserData);
  }
  approvePayment(poId) {
    return this._http.post(Common.sprintf(API_URL.approveAdvancePayment, [poId]), '');
  }
  rejectPayment(poId, data) {
    return this._http.post(Common.sprintf(API_URL.rejectAdvancePayment, [poId]), data);
  }
}
