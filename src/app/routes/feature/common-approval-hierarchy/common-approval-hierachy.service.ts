/**
* Component     : LoginService
* Author        : Boston Byte LLC
* Creation Date : 3rd August 2017
*/

import { Injectable } from '@angular/core';
import { HttpRequest, Common } from '@app/common';
import { API_URL } from '@app/config/api.config';

/**
* UserService class is used to fetch the users data from the server through webservices
*/

@Injectable()
export class CommonApprovalHierarchyService {
  /**
  * constructor method is used to initialize members of class
  */
  constructor(private _http: HttpRequest) {

  }
  approve(id, url) {
    return this._http.post(Common.sprintf(url, [id]), '');
  }
  reject(id, approverData, url) {
    return this._http.post(Common.sprintf(url, [id]), approverData);
  }
  setOnHold(id, approverUserData, url) {
    return this._http.patch(Common.sprintf(url, [id]), approverUserData);
  }
}
