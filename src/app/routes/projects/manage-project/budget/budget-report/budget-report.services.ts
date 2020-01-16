/**
* Component     : LoginService
* Author        : Boston Byte LLC
* Creation Date : 3rd August 2017
*/

import { Injectable } from '@angular/core';
// import { Http, Response } from '@angular/http';
import { HttpRequest } from '@app/common';

/**
* UserService class is used to fetch the users data from the server through webservices
*/

@Injectable()
export class BudgetReportService {
  /**
  * constructor method is used to initialize members of class
  */
  constructor(private _http: HttpRequest) {

  }

  /**
  * this method is used to get valid user accounts data offline(json)
  */
  getProjectsList(projectsListUrl) {
    return this._http.getJsonData(projectsListUrl);
  }

}
