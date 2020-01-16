/**
* Component     : LoginService
* Author        : Boston Byte LLC
* Creation Date : 3rd August 2017
*/

import { Injectable } from '@angular/core';
import { HttpRequest } from '@app/common';
import { API_URL } from '@app/config/api.config';

/**
* UserService class is used to fetch the users data from the server through webservices
*/

@Injectable()
export class AddPOService {

  /**
  * constructor method is used to initialize members of class
  */
  constructor(private _http: HttpRequest) {

  }

  /**
  * this method is used to get valid user accounts data offline(json)
  */
  getBudgetLine(projectID) {
    return this._http.get(API_URL.budgetLine + '/' + projectID + '/' + 1);
  }
  getPOTreeStructure(budgetlineID) {
    return this._http.get(API_URL.budgetLine + '/' + budgetlineID);
  }
  getPOVendor(searchParams) {
    return this._http.get(API_URL.poVendors, searchParams);
  }
  getPODefaultDetails() {
    return this._http.get(API_URL.defaultValueURL);
  }
  getRequestedBy() {
    return this._http.get(API_URL.reqByValues);
  }
  postPOData(vendorPOData) {
    return this._http.post(API_URL.poVendorUrl, JSON.stringify(vendorPOData));
  }
  getVendorPObyID(id) {
    return this._http.get(API_URL.poVendorUrl + '/' + id);
  }
  putPOData(data, id) {
    return this._http.put(API_URL.poVendorUrl + '/' + id, JSON.stringify(data));
  }
}
