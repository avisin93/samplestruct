/**
* Component     : LoginService
 
* Creation Date : 27 July 2018
*/

import { Injectable } from '@angular/core';
// import { Http, Response } from '@angular/http';


import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import 'rxjs/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import { HttpRequest } from '../../../../../../common';
import { URL_PATHS } from '../../../../../../config';

/**
* UserService class is used to fetch the users data from the server through webservices
*/

@Injectable()
export class ManageFreelancerAdvancesService {
  private data: any;
  private observable: Observable<any>;

  private user: any;

  constructor(private _http: HttpRequest) {

  }

  getAdvncesDetails(id) {
    return this._http.get(URL_PATHS.advances + '/' + URL_PATHS.freelancerUrl+ '/' +id)
  }
  updateAdvncesDetails(id,data) {
    return this._http.put(URL_PATHS.advances + '/' + URL_PATHS.freelancerUrl+'/'+id,data)
  }
  postAdvncesDetails(data) {
    return this._http.post(URL_PATHS.advances + '/' + URL_PATHS.freelancerUrl,data)
  }
}
