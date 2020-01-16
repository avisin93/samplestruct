/**
* Service       : ListAccommodationService
* Author        : Boston Byte LLC
* Creation Date : 4th Dec 2017
*/

import { Injectable } from '@angular/core';
import { HttpRequest } from '@app/common';
import { API_URL } from '@app/config';

/**
* ManageSkiLiftsService class is used to fetch the ski lifts data from the server through webservices
*/
@Injectable()
export class FreelancerActivationService {

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
  getFreelancerDetails(id) {
    return this._http.get(API_URL.profileFreelancer);
  }
  /**
  * Save Promotions Data
  */
  postStepOneData(data: any, token) {
    return this._http.post(API_URL.freelancerStepOneUrl + '/' + token, JSON.stringify(data));
  }
  /**
  * Save Promotions Data
  */
  updateFreelancerData(id, data: any) {
    return this._http.put(API_URL.profileFreelancer, JSON.stringify(data));
  }
  /**
  * Save Promotions Data
  */
  acceptContractTerm() {
    return this._http.patch(API_URL.contractAcceptTerm, '');
  }


  getUserInfo() {
    return this._http.get(API_URL.userInfoUrl);
  }
}
