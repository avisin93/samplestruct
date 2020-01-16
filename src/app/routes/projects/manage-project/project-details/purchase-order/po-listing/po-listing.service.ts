/**
* Component     : LoginService
* Author        : Boston Byte LLC
* Creation Date : 3rd August 2017
*/

import { Injectable } from '@angular/core';
import { URL_PATHS, URL_FULL_PATHS } from '@app/config';
import { HttpRequest, Common } from '@app/common';
import { API_URL } from '@app/config/api.config';

/**
* UserService class is used to fetch the users data from the server through webservices
*/

@Injectable()
export class ListPOService {
  /**
  * constructor method is used to initialize members of class
  */
  constructor(private _http: HttpRequest) {

  }
  /**
  * This method is used to get active projects list
  */
  getSuppliers(searchParams) {
    return this._http.get(API_URL.projectSupplierListUrl, searchParams);
  }
  /**
  * this method is used to get valid user accounts data offline(json)
  */
  getPOList(searchParams) {
    return this._http.get(API_URL.purchaseOrderUrl, searchParams);
  }
  removePO(poID) {
    return this._http.post(Common.sprintf(API_URL.cancelPO, [poID]), '');
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
