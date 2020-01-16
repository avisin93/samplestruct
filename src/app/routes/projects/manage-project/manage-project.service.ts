/**
* Service       : ListAccommodationService
* Author        : Boston Byte LLC
* Creation Date : 4th Dec 2017
*/

import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import { HttpRequest } from '@app/common';
import { API_URL } from '@app/config';


/**
* ManageSkiLiftsService class is used to fetch the ski lifts data from the server through webservices
*/
@Injectable()
export class ManageProjectService {

  /**
  * constructor method is used to initialize members of class
  */
  constructor(private _http: HttpRequest) {
  }

  /**
  ** Get project details by project id
  **/
  getProjectDetails(id) {
    return this._http.get(API_URL.projectsUrl + '/' + id);
  }

  /**
  ** Sync project sheet which is uploaded on drive by Project ID
  **/
  syncProjectDetails(id) {
    return this._http.put(API_URL.projectsyncUrl + '/' + id, '');
  }
}
