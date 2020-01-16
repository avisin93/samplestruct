

import { Injectable } from '@angular/core';
import { HttpRequest, Common } from '@app/common';
import { API_URL, URL_FULL_PATHS } from '@app/config';

/**
* UserService class is used to fetch the users data from the server through webservices
*/

@Injectable()
export class ListSettlementService {

  /**
  * constructor method is used to initialize members of class
  */
  constructor(private _http: HttpRequest) {

  }
  search(searchParam) {
    return this._http.get(API_URL.listSettlement, searchParam);
  }

  getSettlementList(params: any) {
    return this._http.get(API_URL.poSettlementUrl, params);
  }

  deleteSettlement(id) {
   return this._http.post(Common.sprintf(API_URL.poSettlementCancelUrl, [id]), '');
  }
  getSuppliers(searchParams) {
    return this._http.get(API_URL.projectSupplierListUrl, searchParams);
  }
}
