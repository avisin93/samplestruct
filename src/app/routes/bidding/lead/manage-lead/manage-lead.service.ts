/**
* Component     : LoginService
 
* Creation Date : 3rd Jan 2020
*/

import { Injectable } from '@angular/core';
import {  Common } from '@app/common';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import 'rxjs/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import {  API_URL } from '@app/config';
import { PreBidHttpRequest } from '../../pre-bid-http-request';

/**
* UserService class is used to fetch the users data from the server through webservices
*/

@Injectable()
export class ManageLeadService {
  private data: any;
  private observable: Observable<any>;

  private user: any;

  /**
  * constructor method is used to initialize members of class
  */
  constructor(private _http: PreBidHttpRequest) {

  }

  /**
  * this method is used to get valid user accounts data offline(json)
  */
  getLeadData(id) {
    return this._http.get(Common.sprintf(API_URL.manageLead, [id]));
  }
  /**
  * this method is used to get valid user accounts data offline(json)
  */
  putPostLeadData(data, id?) {
    if (id) {
      return this._http.put(Common.sprintf(API_URL.manageLead, [id]), data);
    } else {
      return this._http.post(API_URL.leads, data);
    }
  }
  getCurrencies() {
    return this._http.get(API_URL.currency);
  }

  getOrganizationsList(params) {
    return this._http.get(API_URL.organizations, params);
  }
  getContactPersonsList(params) {
    return this._http.get(API_URL.contactPersons, params);

  }
  addOrganizationName(name) {
    return this._http.post(API_URL.organizations, name);
  }
  addContactPersonName(name) {
    return this._http.post(API_URL.contactPersons, name);
  }
}
