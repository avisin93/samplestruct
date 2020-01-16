

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
/**
* UserService class is used to fetch the users data from the server through webservices
*/

@Injectable()
export class AddVendorService {
  apiUrl = URL_PATHS.addVendor;
  private data: any;
  private observable: Observable<any>;


  /**
  * constructor method is used to initialize members of class
  */
  constructor(private _http: HttpRequest) {

  }

  /**
  * Admin Add vendor
  */
  _addVendor(userData) {
    return this._http.post(this.apiUrl, userData);
  }
 
  /**
  * logout method is used to logut user
  */
  // logout() {
  //   var body = "";
  //   return this._http.post(this.logoutapiUrl, body)
  // }
  /**
  * this method is used to get valid user accounts data offline(json)
  */
  // getValidAccountsJson() {
  //   return this._http.getJsonData(this.validAccountsUrl)
  // }

}
