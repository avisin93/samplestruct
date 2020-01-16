import { Injectable } from '@angular/core';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { HttpRequest, Common } from '../../common';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import 'rxjs/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import { URL_PATHS, URL_FULL_PATHS, API_URL } from '../../config';


/**
* ManageSkiLiftsService class is used to fetch the ski lifts data from the server through webservices
*/
@Injectable()
export class ViewPOService {
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

  getPObyID(id) {
    return this._http.get(API_URL.viewPO + '/' + id);
  }
  downloadPo(id) {
    return this._http.get(API_URL.downloadPo + '/' + id);
  }

}
