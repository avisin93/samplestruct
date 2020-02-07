/**
* Service       : ListAccommodationService
 
* Creation Date : 4th Dec 2020
*/

import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import { API_URL } from '../../../../config';
import { HttpRequest, Common } from '../../../../common';


@Injectable()
export class ListReviewService {
  // locationsUrl = "/locations";
  // locationCategoriesUrl = "/location-categories"
  constructor(private _http: HttpRequest) {
  }

  getLocationsList(params: any) {
    return this._http.get(API_URL.locationUrl, params);
  }
  getLocationCategories() {
    return this._http.get(API_URL.locationCategoriesUrl);
  }
  getLocationTagsData(params) {
    return this._http.get(API_URL.locationTagsUrl, params);
  }
  getReviewList(searchQuery) {
    return this._http.get(API_URL.reviewListUrl, searchQuery);
  }
  getReviewLocationById(id) {
    return this._http.get(Common.sprintf(API_URL.reviewUrl, [id]));
  }
  putReviewLocationById(locationImageData, locationId) {
    return this._http.put(Common.sprintf(API_URL.reviewUrl, [locationId]), locationImageData);
  }


}
