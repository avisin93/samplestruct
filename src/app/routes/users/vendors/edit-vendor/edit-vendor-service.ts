

import { Injectable } from '@angular/core';
// import { Http, Response } from '@angular/http';
import { HttpRequest } from '../../../../common';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import 'rxjs/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import { URL_PATHS } from '../../../../config';
import { API_URL } from '@app/config/api.config';
/**
* UserService class is used to fetch the users data from the server through webservices
*/

@Injectable()
export class EditVendorService {
  apiUrl = URL_PATHS.addVendor;
  private data: any;
  private observable: Observable<any>;


  /**
  * constructor method is used to initialize members of class
  */
  constructor(private _http: HttpRequest) {

  }

  /**
  * Admin get vendor
  */
  getVendor(id, isProfileUrl: boolean = false) {
    const apiUrl = isProfileUrl ? API_URL.profileVendor : API_URL.vendorUrl + '/' + id;
    return this._http.get(apiUrl);
  }
  /**
   * Admin put vendor
   */
  updateVendor(vendorData, id, isProfileUrl: boolean = false) {
    const apiUrl = isProfileUrl ? API_URL.profileVendor : API_URL.vendorUrl + '/' + id;
    return this._http.put(apiUrl, vendorData);
  }
  approveContract(id, data) {
    return this._http.put(API_URL.vendorContractApprovalUrl + '/' + id, JSON.stringify(data));
  }

  rejectContract(id, data) {
    return this._http.put(API_URL.vendorContractRejectionUrl + '/' + id, JSON.stringify(data));
  }

}
