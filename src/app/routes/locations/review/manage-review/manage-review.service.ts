/**
* Service       : ManageReviewService
 
* Creation Date : 1 july 2019
*/

import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import { API_URL, URL_PATHS } from '../../../../config';
import { HttpRequest, Common } from '../../../../common';


@Injectable()
export class ManageReviewService {
  /**
  * constructor method is used to initialize members of class
  */
  constructor(private _http: HttpRequest) {
  }

  /**
  * Get review location data from service
  */
  getReviewLocationById(id) {
    return this._http.get(Common.sprintf(API_URL.reviewUrl, [id]));
  }

  /**
  * Get location tags data from service
  */
  getLocationTagsData(params) {
    return this._http.get(API_URL.locationTagsUrl, params);
  }

  /**
  * updates review images tags
  */
  putReviewLocationById(locationImageData, locationId) {
    return this._http.put(Common.sprintf(API_URL.reviewUrl, [locationId]), locationImageData);
  }

  /**
  * Get location tags data 
  */
  getLocationtagsData(locationId, params) {
    return this._http.get(Common.sprintf(API_URL.reviewDataLimitUrl, [locationId]), params);
  }
}
