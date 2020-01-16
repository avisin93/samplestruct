/**
* Component     : LoginService
* Author        : Boston Byte LLC
* Creation Date : 3rd August 2017
*/

import { Injectable } from '@angular/core';
import { Common } from '@app/common';
import { API_URL } from '@app/config';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import 'rxjs/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import { HttpHeaders } from '@angular/common/http';
import { PreBidHttpRequest } from '../../pre-bid-http-request';

/**
* UserService class is used to fetch the users data from the server through webservices
*/

@Injectable()
export class PassesService {
  private data: any;
  private observable: Observable<any>;
  private httpHeaders: HttpHeaders;

  private user: any;

  /**
  * constructor method is used to initialize members of class
  */
  constructor(private _http: PreBidHttpRequest) {

  }

  /**
  * this method is used to get passes list
  */
  getPassesList(searchParams) {
    return this._http.get(API_URL.passes, searchParams);
  }
  /**
    * this method is used to get passes dropdown list
    */
  getPassDropdown(projectId) {

    return this._http.get(API_URL.filterPass + '/' + projectId);
  }
  /**
    * this method is used to create new pass
    */
  createPassCopy(requestPass) {
    return this._http.post(API_URL.passes, requestPass);
  }
  /**
  * this method is used to convert deal into project
  */
  convertToProject(projectId, passId) {
    return this._http.post(Common.sprintf(API_URL.convertToProject, [projectId, passId]), '');
  }
  /**
  * this method is used to check project name already exists  or not
  */
  checkProjectAlreadyExistsOrNot(projectId, passId) {
    return this._http.get(API_URL.checkProjectExistsOrNot + '/' + projectId + '/' + passId);
  }
}
