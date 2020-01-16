
import { Injectable } from '@angular/core';
import { HttpRequest } from '@app/common';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import 'rxjs/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import { API_URL } from '@app/config';

/**
* UserService class is used to fetch the users data from the server through webservices
*/

@Injectable()
export class LocationCategoryFilterService {
  private data: any;
  private observable: Observable<any>;

  private user: any;

  /**
  * constructor method is used to initialize members of class
  */
  constructor(private _http: HttpRequest) {

  }

  /**
  * this method is used to get valid user accounts data offline(json)
  */
 getInitialCategoryList() {
  return this._http.get(API_URL.locationCategoriesUrl);
}
getCategoryList(params) {
  return this._http.get(API_URL.locationCategoriesUrl, params);
}

}
