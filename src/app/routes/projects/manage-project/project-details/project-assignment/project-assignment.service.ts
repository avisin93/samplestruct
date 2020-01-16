/**
* Service       : ListAccommodationService
* Author        : Boston Byte LLC
* Creation Date : 4th Dec 2017
*/

import { Injectable } from '@angular/core';
import { API_URL } from '@app/config';
import { Common, HttpRequest } from '@app/common';

/**
* ManageSkiLiftsService class is used to fetch the ski lifts data from the server through webservices
*/
@Injectable()
export class ProjectAssignmentService {

  /**
  * constructor method is used to initialize members of class
  */
  constructor(private _http: HttpRequest) {
  }

  /**
  ** Common API Call for get Data
  **/
  getProjectAssignment(id) {
    return this._http.get(Common.sprintf(API_URL.purchaseOrderUrlPALAcceptance, [id]));
  }

  putData(id, data: any) {
    return this._http.put(API_URL.purchaseOrderUrlContractAcceptance + '/' + id, JSON.stringify(data));
  }

}
