/**
* Component     : LoginService
* Author        : Boston Byte LLC
* Creation Date : 23rd May 2018
*/

import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpRequest } from '@app/common';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import 'rxjs/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import { URL_PATHS } from '@app/config';
/**
* UserService class is used to fetch the users data from the server through webservices
*/

@Injectable()
export class RecoverService {
  // headerFooter : HeaderFooter[];

  //apiUrl = "sessions/forgotPassword";
  finalApiUrl: any = URL_PATHS.forgotPasswordUrl;
  private data: any;
  private observable: Observable<any>;

  private user: any;

  /**
  * constructor method is used to initialize members of class
  */
  constructor(private _http: HttpRequest) {
  }

  /**
  * validateUserData method is used to validate users data..
  */
  validateUserData(email) {
    return this._http.get(this.finalApiUrl, email);
  }

}
