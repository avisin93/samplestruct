

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
export class VendorListService {
  apiUrl = API_URL.vendorUrl;
  private data: any;
  private observable: Observable<any>;


  /**
  * constructor method is used to initialize members of class
  */
  constructor(private _http: HttpRequest) {

  }
  search(searchParam) {
    return this._http.get(this.apiUrl, searchParam);
  }
  /**
  * Admin Vendor list
  */
  getVendorList(userData) {
    return this._http.get(this.apiUrl, userData);
  }

  changeStatus(id) {
    return this._http.patch(API_URL.vendorUrl + '/' + id, '');
  }

}
