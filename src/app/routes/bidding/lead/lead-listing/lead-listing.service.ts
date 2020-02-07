/**
* Component     : LoginService
 
* Creation Date : 3rd Jan 2020
*/

import { Injectable } from '@angular/core';
import { PreBidHttpRequest } from '../../pre-bid-http-request';
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
export class LeadListService {
  private data: any;
  private observable: Observable<any>;

  private user: any;

  /**
  * constructor method is used to initialize members of class
  */
  constructor(private _http: PreBidHttpRequest) {

  }

  getLeadList(params) {
    return this._http.get(API_URL.leads, params);
  }
  createBid(IdObj) {
    return this._http.post(API_URL.bids, IdObj);
  }

}
