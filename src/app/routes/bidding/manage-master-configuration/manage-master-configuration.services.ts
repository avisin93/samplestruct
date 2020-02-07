/**
* Component     : LoginService
 
* Creation Date : 3rd Jan 2020
*/

import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { API_URL } from '@app/config';
import { PreBidHttpRequest } from '../pre-bid-http-request';
import { Common } from '@app/common';

/**
* UserService class is used to fetch the users data from the server through webservices
*/

@Injectable()
export class ManageMasterConfigService {

  /**
  * constructor method is used to initialize members of class
  */
  constructor(private _http: PreBidHttpRequest) {

  }

  getMasterConfigList(projectId) {
    //  return this._http.get(ROOT_PATHS.jsonFiles + 'rate-chart.json');
    if (projectId) {
      return this._http.get(API_URL.projectMasterConfiguration + "/" + projectId);
    } else {
      return this._http.get(API_URL.masterConfiguration);
    }
  }
  putBaseChartList(projectId, data) {
    if (projectId) {
      return this._http.put(API_URL.projectMasterConfiguration + "/" + projectId, data);
    } else {
      return this._http.put(API_URL.masterConfiguration, data);
    }
  }
}
