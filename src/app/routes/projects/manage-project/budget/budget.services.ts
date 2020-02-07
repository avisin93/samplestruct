/**
* Component     : LoginService
 
* Creation Date : 3rd Jan 2020
*/

import { Injectable } from '@angular/core';
// import { Http, Response } from '@angular/http';
import { HttpRequest, Common } from '@app/common';
import { URL_FULL_PATHS } from '@app/config';

/**
* UserService class is used to fetch the users data from the server through webservices
*/

@Injectable()
export class BudgetDetailsService {

  /**
  * constructor method is used to initialize members of class
  */
  constructor(private _http: HttpRequest) {

  }

  /**
  * this method is used to get valid user accounts data offline(json)
  */
  getBudgetDetails(projectId, budgetId) {
    return this._http.get(Common.sprintf(URL_FULL_PATHS.BudgetDetailsUrl, [projectId, budgetId]));
  }

}
