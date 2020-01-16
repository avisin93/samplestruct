/**
* Service       : ListAccommodationService
* Author        : Boston Byte LLC
* Creation Date : 4th Dec 2017
*/

import { Injectable } from '@angular/core';
import { HttpRequest } from '@app/common';
import { API_URL } from '@app/config/api.config';

/**
* ManageSkiLiftsService class is used to fetch the ski lifts data from the server through webservices
*/
@Injectable()
export class AddFreelancerPOService {

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


  postData(data: any) {
    return this._http.post(API_URL.poFreelancerUrl, JSON.stringify(data));
  }
  getFreelancerPObyID(id) {
    return this._http.get(API_URL.poFreelancerUrl + '/' + id);
  }

  postDataById(data, id) {
    return this._http.put(API_URL.poFreelancerUrl + '/' + id, JSON.stringify(data));
  }

  getPODefaultDetails() {
    return this._http.get(API_URL.defaultValueURL);
  }
}
