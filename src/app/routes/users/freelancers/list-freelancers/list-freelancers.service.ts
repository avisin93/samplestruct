/**
* Service       : ListAccommodationService
 
* Creation Date : 4th Dec 2020
*/

import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpRequest, Common } from '../../../../common';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import 'rxjs/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import { API_URL } from '@app/config/api.config';

/**
* ManageSkiLiftsService class is used to fetch the ski lifts data from the server through webservices
*/
@Injectable()
export class FreelancersListService {

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

  /**
  * Save Promotions Data
  */
  getFreelancersList(params: any) {
    return this._http.get(API_URL.freelancerUrl, params);
  }

  changeStatus(id) {
    return this._http.patch(API_URL.freelancerUrl + '/' + id, '');
  }


}
