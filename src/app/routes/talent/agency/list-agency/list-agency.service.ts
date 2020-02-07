/**
* Service       : AgencyListService
 
* Creation Date : 3th May 2019
*/

import { Injectable } from '@angular/core';
import { HttpRequest, Common } from '@app/common';
import { API_URL } from '@app/config/api.config';

/**
* ManageSkiLiftsService class is used to fetch the ski lifts data from the server through webservices
*/
@Injectable()
export class AgencyListService {

  /**
  * constructor method is used to initialize members of class
  */
  constructor(private _http: HttpRequest) {
  }

  /**
  * Save Agecy Data
  */
  getAgencyList(params: any) {
    return this._http.get(API_URL.agencyUrl, params);
  }

  /**
   * Changes agency record status
   * @param id as which record need to be changed
   */
  changeStatus(id) {
    return this._http.patch(Common.sprintf(API_URL.changeStatus, [id]), '');
  }

}
