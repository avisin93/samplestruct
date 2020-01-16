

import { Injectable } from '@angular/core';
import { HttpRequest, Common } from '@app/common';
import { URL_PATHS } from '@app/config';
import { API_URL } from '@app/config/api.config';
/**
* UserService class is used to fetch the users data from the server through webservices
*/

@Injectable()
export class LoginService {
  apiUrl = URL_PATHS.loginUrl;
  logoutapiUrl = URL_PATHS.logOutUrl;

  /**
  * constructor method is used to initialize members of class
  */
  constructor(private _http: HttpRequest) {

  }

  /**
  * validateUserData method is used to validate users data..
  */
  validateUserData(userData) {
    return this._http.post(this.apiUrl, userData);
  }

  
  getUserInfo() {
    return this._http.get(API_URL.userInfoUrl);
  }
  
}
