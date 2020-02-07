/**
* Component     : LoginService
 
* Creation Date : 3rd Jan 2020
*/

import { Injectable } from '@angular/core';
// import { Http, Response } from '@angular/http';
import { HttpRequest, Common } from '@app/common';
import { URL_PATHS, URL_FULL_PATHS } from '@app/config/constants';

/**
* UserService class is used to fetch the users data from the server through webservices
*/

@Injectable()
export class ListBudgetService {

  /**
  * constructor method is used to initialize members of class
  */
  constructor(private _http: HttpRequest) {

  }

  /**
  * this method is used to get valid user accounts data offline(json)
  */
 getbudgetList(searchParams, projectId) {
  return this._http.get(Common.sprintf(URL_FULL_PATHS.budgetListUrl, [projectId]), searchParams);
}
  getCompanyList() {
    return this._http.get(URL_PATHS.companyUrl);
  }
}
