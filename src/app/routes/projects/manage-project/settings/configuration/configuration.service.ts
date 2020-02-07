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
import { URL_PATHS } from '@app/config';
import { HttpRequest } from '@app/common';

/**
* UserService class is used to fetch the users data from the server through webservices
*/

@Injectable()
export class ConfigurationService {
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
 getConfigurationData(projectID){
  return this._http.get(URL_PATHS.projectSettingUrl   + "/" +  URL_PATHS.configuration + "/" + projectID);
 }
 updateConfigurationData(projectID,data){
  return this._http.put(URL_PATHS.projectSettingUrl   + "/" +  URL_PATHS.configuration + "/" + projectID,data);
 }

}
