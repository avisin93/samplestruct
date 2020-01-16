

import { Injectable } from '@angular/core';
// import { Http, Response } from '@angular/http';
import { HttpRequest } from '../../../../../../../common';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import 'rxjs/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import { URL_PATHS } from '../../../../../../../config';
/**
* UserService class is used to fetch the users data from the server through webservices
*/

@Injectable()
export class ManageSettlementService {
  private data: any;
  private observable: Observable<any>;


  /**
  * constructor method is used to initialize members of class
  */
  constructor(private _http: HttpRequest) {

  }

  getAdvanceSettlementList(params:any) {
    return this._http.get(URL_PATHS.advanceSettlementUrl + "/"+URL_PATHS.advances, params);
  }
  getSettlementDetails(settleId) {
    return this._http.get(URL_PATHS.advanceSettlementUrl + "/"+settleId);
  }
  postAdvanceSettle(data) {
    return this._http.post(URL_PATHS.advanceSettlementUrl , data);
  }
  putAdvanceSettle(settleId,data) {
    return this._http.put(URL_PATHS.advanceSettlementUrl + "/"+settleId, data);
  }
}
