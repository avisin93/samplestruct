/**
* Component     : LoginService
* Author        : Boston Byte LLC
* Creation Date : 3rd August 2017
*/

import { Injectable } from '@angular/core';
import { HttpRequest, Common } from '@app/common';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import 'rxjs/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import { URL_FULL_PATHS, API_URL } from '@app/config';

/**
* UserService class is used to fetch the users data from the server through webservices
*/

@Injectable()
export class ListWorkingService {

  /**
  * constructor method is used to initialize members of class
  */
  constructor(private _http: HttpRequest) {

  }
  /**
   * this method is used to get working list data
   */
  getWorkingListData(projectId) {
    return this._http.get(API_URL.workingUrl + '/' + projectId);
  }
  putWorkingList(projectId, data) {
    return this._http.put(API_URL.workingUrl + '/' + projectId, data);
  }

}
