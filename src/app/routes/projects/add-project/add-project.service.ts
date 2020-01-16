/**
* Component     : LoginService
* Author        : Boston Byte LLC
* Creation Date : 3rd August 2017
*/

import { Injectable } from '@angular/core';
// import { Http, Response } from '@angular/http';
import { HttpRequest } from '@app/common';
import { API_URL } from '@app/config/api.config';

/**
* UserService class is used to fetch the users data from the server through webservices
*/

@Injectable()
export class AddProjectService {
  /**
  * constructor method is used to initialize members of class
  */
  constructor(private _http: HttpRequest) {

  }

  /**
  * this method is used to get valid user accounts data offline(json)
  */
  postData(projectData) {
    return this._http.post(API_URL.projectsUrl, projectData);
  }
  getBudgetTypes() {
    return this._http.get(API_URL.budgetTypesUrl);
  }
}
