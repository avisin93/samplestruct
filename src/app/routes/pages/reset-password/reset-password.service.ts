/**
* Component     : ResetpasswordService
 
* Creation Date : 23 rd May 2018
*/

import { Injectable }    from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpRequest } from '../../../common';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import 'rxjs/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import { URL_PATHS } from '../../../config';
/**
* UserService class is used to fetch the users data from the server through webservices
*/

@Injectable()
export class ResetPasswordService {
  // headerFooter : HeaderFooter[];

  apiUrl = URL_PATHS.resetPassowordUrl;
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
  resetPassowrd(data) {
    return this._http.put(this.apiUrl, data)
  }
}
