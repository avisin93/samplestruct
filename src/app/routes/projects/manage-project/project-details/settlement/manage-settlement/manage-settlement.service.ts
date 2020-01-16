

import { Injectable } from '@angular/core';
// import { Http, Response } from '@angular/http';
import { HttpRequest } from '@app/common';
import { URL_PATHS, API_URL } from '@app/config';
/**
* UserService class is used to fetch the users data from the server through webservices
*/

@Injectable()
export class ManageSettlementService {

  /**
  * constructor method is used to initialize members of class
  */
  constructor(private _http: HttpRequest) {

  }

  /**
  * this method is used to get valid user accounts data offline(json)
  */
  getPODetails(poID) {
    return this._http.get(API_URL.poAdvance + '/' + poID);
  }
  postPOSettle(data) {
    return this._http.post(API_URL.poSettlementUrl, data);
  }
  getSettlementDetails(settlementId) {
    return this._http.get(API_URL.poSettlementUrl + '/' + settlementId);
  }
  updatePOSettle(settleId, data) {
    return this._http.put(API_URL.poSettlementUrl + '/' + settleId, data);
  }
}
