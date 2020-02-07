/**
* Service       : ListAccommodationService
 
* Creation Date : 4th Dec 2020
*/

import { Injectable } from '@angular/core';
import { HttpRequest, Common } from '@app/common';

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
export class EditFreelancerService {

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
  getFreelancerDetails(id , isProfileUrl: boolean = false) {
    const apiUrl = isProfileUrl ? API_URL.profileFreelancer : API_URL.freelancerUrl + '/' + id;
    return this._http.get(apiUrl);
  }

  updateFreelancerData(id, data: any, isProfileUrl: boolean = false) {
    const apiUrl = isProfileUrl ? API_URL.profileFreelancer : API_URL.freelancerUrl + '/' + id;
    return this._http.put(apiUrl, JSON.stringify(data));
  }
  getRoles() {
    const url = 'filters/roles/freelancer';
    return this._http.get(url);
  }

  approveContract(id, data) {
    return this._http.put(API_URL.freelancerContractApprovalUrl + '/' + id, JSON.stringify(data));
  }

  rejectContract(id, data) {
    return this._http.put(API_URL.freelancerContractRejectionUrl + '/' + id, JSON.stringify(data));
  }


}
