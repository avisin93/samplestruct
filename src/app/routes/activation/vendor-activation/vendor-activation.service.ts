

import { Injectable } from '@angular/core';
// import { Http, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { HttpRequest } from '@app/common';
import { API_URL } from '@app/config';

/**
* UserService class is used to fetch the users data from the server through webservices
*/

@Injectable()
export class VendorActivationService {

  /**
  * constructor method is used to initialize members of class
  */
  constructor(private _http: HttpRequest) {

  }

  /**
  * Activate vendor
  */
  activateVendor(obj, token) {
    return this._http.post(API_URL.vendorActivateURL + '/' + token, obj);
  }

  getVendor(id) {
    return this._http.get(API_URL.profileVendor);
  }

  updateVendor(vendorData, id) {
    return this._http.put(API_URL.profileVendor, JSON.stringify(vendorData));
  }
  postStepThreeData(data: any) {
    return this._http.post(API_URL.stepThreeVendorContractUrl, JSON.stringify(data));
  }
  getUserInfo() {
    return this._http.get(API_URL.userInfoUrl);
  }
  acceptContractTerm() {
    return this._http.patch(API_URL.contractAcceptTerm, '');
  }

}
