

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
export class SettlementListService {
  apiUrl = URL_PATHS.listSettlement;
  private data: any;
  private observable: Observable<any>;


  /**
  * constructor method is used to initialize members of class
  */
  constructor(private _http: HttpRequest) {

  }
  search(searchParam) {
    return this._http.get(this.apiUrl, searchParam)
  }

  getSettlementList(params:any) {
    return this._http.get(URL_PATHS.advanceSettlementUrl, params);
  }

  // changeStatus(id) {
  //   return this._http.delete(URL_PATHS.addSett + "/" + id);
  // }

  deleteSettlement(id){
   return this._http.post(URL_PATHS.advanceSettlementUrl + "/" + id + "/" + URL_PATHS.cancelPO,"");
  }
}
