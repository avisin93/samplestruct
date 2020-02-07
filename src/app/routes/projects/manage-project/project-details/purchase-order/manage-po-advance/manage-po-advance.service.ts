/**
* Service       : ListAccommodationService
 
* Creation Date : 4th Dec 2020
*/

import { Injectable } from '@angular/core';
import { HttpRequest, Common } from '@app/common';
import { URL_PATHS, API_URL } from '@app/config';
import { l } from '@angular/core/src/render3';

/**
* ManageSkiLiftsService class is used to fetch the ski lifts data from the server through webservices
*/
@Injectable()
export class AdvancePOService {

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
  getCooridinatorFreelancers(budgetLines) {
    return this._http.get(API_URL.poProductionCoordinatorUrl, budgetLines);
  }
  getPOVendor(budgetLine) {
    return this._http.get(API_URL.poVendors, budgetLine);
  }
  getPOFreelancers(budgetLineId) {
    return this.apiCall(API_URL.poFilterFreelancerUrl + '/' + budgetLineId);
  }
  getPODefaultDetails() {
    return this._http.get(API_URL.defaultValueURL);
  }
  postPOData(vendorPOData) {
    return this._http.post(API_URL.poAdvance, JSON.stringify(vendorPOData));
  }
  getAdvancePObyID(id) {
    return this._http.get(API_URL.poAdvance +  '/' + id);
  }
  putPOData(data, id) {
    return this._http.put(API_URL.poAdvance + '/' + id, JSON.stringify(data));
  }
}
