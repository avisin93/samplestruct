/**
* Component     : LoginService
 
* Creation Date : 3rd Jan 2020
*/

import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import 'rxjs/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import { HttpHeaders } from '@angular/common/http';
import {  API_URL } from '@app/config';
import { PreBidHttpRequest } from '../pre-bid-http-request';

/**
* UserService class is used to fetch the users data from the server through webservices
*/

@Injectable()
export class ListBiddingService {
  private data: any;
  private observable: Observable<any>;
  private httpHeaders : HttpHeaders;
  private user: any;

  /**
  * constructor method is used to initialize members of class
  */
  constructor(private _http: PreBidHttpRequest) {

  }

  /**
  * this method is used to get bid listing data from the server
  */
  getBiddingList(searchParams) {
    return this._http.get(API_URL.bids, searchParams);
  }

}
