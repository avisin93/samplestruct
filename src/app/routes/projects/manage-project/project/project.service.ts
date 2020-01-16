/**
* Service       : ListAccommodationService
* Author        : Boston Byte LLC
* Creation Date : 4th Dec 2017
*/

import { Injectable } from '@angular/core';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { HttpRequest, Common } from '../../../../common';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import 'rxjs/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import { URL_PATHS } from '../../../../config'

/**
* ManageSkiLiftsService class is used to fetch the ski lifts data from the server through webservices
*/
@Injectable()
export class ProjectService {

  /**
  * constructor method is used to initialize members of class
  */
  constructor(private _http: HttpRequest) {
  }

  /**
  ** Common API Call for get Data
  **/
  apiCall(url: string) {
    return this._http.get(url);
  }
  syncProjectDetails(id){
    return this._http.put(URL_PATHS.projectsyncUrl + '/' + id,id);
  }
  updateProjectsData(id, data: any) {
    return this._http.put(URL_PATHS.projectsUrl + '/' + id, JSON.stringify(data));
  }
  updateOtherDocumentsData(id, data: any) {
    return this._http.put(URL_PATHS.projectsUrl + '/' + URL_PATHS.otherDocumentsUrl + '/' + id, JSON.stringify(data));
  }

}
