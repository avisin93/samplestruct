/**
* Service       : ListAccommodationService
 
* Creation Date : 4th Dec 2020
*/

import { Injectable } from '@angular/core';
import { HttpRequest } from '@app/common';
import { API_URL } from '@app/config/api.config';

/**
* ManageSkiLiftsService class is used to fetch the ski lifts data from the server through webservices
*/
@Injectable()
export class AddFreelancerService {

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
  postData(freelancerData: any) {
    return this._http.post(API_URL.freelancerUrl, JSON.stringify(freelancerData));
  }

  getRoles() {
    const url = 'filters/roles/freelancer';
    return this._http.get(url);
  }


}
