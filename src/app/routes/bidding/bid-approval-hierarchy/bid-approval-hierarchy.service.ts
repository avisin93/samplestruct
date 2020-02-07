/**
* Component     : LoginService
 
* Creation Date : 3rd Jan 2020
*/

import { Injectable } from '@angular/core';
// import { Http, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import 'rxjs/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import { URL_PATHS, URL_FULL_PATHS, API_URL } from '../../../config';
import { HttpRequest, Common } from '../../../common';
import { PreBidHttpRequest } from '../pre-bid-http-request';

/**
* UserService class is used to fetch the users data from the server through webservices
*/

@Injectable()
export class BiddingApprovalHierarchyService {
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
  getApprovalHierarchy(projectId) {
    if (projectId) {
      return this._http.get(API_URL.projectMasterConfigurationApprovalHierarchy + "/" + projectId);
    } else {
      return this._http.get(API_URL.masterConfigurationApprovalHierarchy);
    }
  }
  getRoles() {
    return this._http.get(API_URL.preBidRoles);
  }
  getUserData(roleID) {
    return this._http.get(API_URL.preBidUsers + '/' + roleID);
  }
  updateApprovalHierarchy(data, projectId) {
    if (projectId) {
      return this._http.put(API_URL.projectMasterConfigurationApprovalHierarchy + "/" + projectId, JSON.stringify(data));
    } else {
      return this._http.put(API_URL.masterConfigurationApprovalHierarchy, JSON.stringify(data));
    }
  }

}
