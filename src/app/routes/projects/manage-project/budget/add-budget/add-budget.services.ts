/**
* Component     : LoginService
 
* Creation Date : 11th Oct 2018
*/

import { Injectable } from '@angular/core';
// import { Http, Response } from '@angular/http';
import { HttpRequest, Common } from '@app/common';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import 'rxjs/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import { URL_PATHS, URL_FULL_PATHS } from '@app/config/constants';
import { API_URL } from '@app/config/api.config';

/**
* UserService class is used to fetch the users data from the server through webservices
*/

@Injectable()
export class AddBudgetService {
  private data: any;
  private observable: Observable<any>;

  private user: any;

  /**
  * constructor method is used to initialize members of class
  */
  constructor(private _http: HttpRequest) {

  }

  /**
  * this method is used to get valid user accounts data offline(json)
  */
  getbudgetList(searchParams) {
    return this._http.get(API_URL.projectsUrl, searchParams);
  }
  getCompanyList() {
    return this._http.get(API_URL.companyUrl);
  }
  addBudget(budgetList, projectId) {
    return this._http.post(Common.sprintf(API_URL.budgetListUrl, [projectId]), budgetList);
  }
}
