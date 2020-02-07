/**
* Service       : AddLocationServices
 
* Creation Date : 16th July 2018
*/

import { Injectable } from '@angular/core';
import { HttpRequest } from '@app/common';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import { API_URL } from '@app/config';

@Injectable()
export class ManageLocationService {

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
  * Add Location Data
  */
  addLocationData(locationsData: any) {
    return this._http.post(API_URL.locationUrl, JSON.stringify(locationsData));
  }
  getCategoryList() {
    return this._http.get(API_URL.locationCategoriesUrl);
  }
  addNewCategory(data) {
    return this._http.post(API_URL.locationCategoriesUrl, data);
  }
  updateLocationsData(id, locationsData: any) {
    return this._http.put(API_URL.locationUrl + '/' + id, JSON.stringify(locationsData));
  }
  getLocationData(id) {
    return this._http.get(API_URL.locationUrl + '/' + id);
  }
  getListOfLocationData() {
    return this._http.get(API_URL.locationUrl);
  }
  uploadLocationImages(data) {
    return this.postImage(API_URL.images1Url, data);
  }
  postImage(filesUploadUrl, imageData: any, searchParam: any = '') {
    return this._http.postMultipartData(filesUploadUrl, imageData, searchParam,true,true);
  }

}
