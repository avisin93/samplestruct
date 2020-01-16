/**
* Service       : ListAccommodationService
* Author        : Boston Byte LLC
* Creation Date : 4th Dec 2017
*/

import { Injectable } from '@angular/core';
import { API_URL } from '@app/config';
import { HttpRequest } from '@app/common';

/**
* ManageSkiLiftsService class is used to fetch the ski lifts data from the server through webservices
*/
@Injectable()
export class AddLocationPOService {
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
   * postData methos use to call API to add data
   * @param  data as object which you want to add
   * @return      url
   */
  postData(data: any) {
    return this._http.post(API_URL.poLocationUrl, JSON.stringify(data));
  }

  /**
   * postDataById method use to update the record
   * @param  data as object which you want to post
   * @param  id   of that data
   * @return      url which contain that data
   */
  postDataById(data, id) {
    return this._http.put(API_URL.poLocationUrl + '/' + id, JSON.stringify(data));
  }

  /**
   * getLocationPObyID method use to get details of purchase order location details
   * requested ID
   * @param  id of which you want PO details
   * @return    URL which contain data.
   */
  getLocationPObyID(id) {
    return this._http.get(API_URL.poLocationUrl + '/' + id);
  }

}
