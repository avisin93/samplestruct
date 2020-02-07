/**
* Component     : LoginService
 
* Creation Date : 27 July 2018
*/

import { Injectable } from '@angular/core';
import { HttpRequest } from '@app/common';
import { URL_PATHS } from '@app/config';

/**
* UserService class is used to fetch the users data from the server through webservices
*/

@Injectable()
export class AdvancesService {

  constructor(private _http: HttpRequest) {

  }

  getAdvncesData(searchParams) {
    return this._http.get(URL_PATHS.advances,searchParams)
  }
  removeAdvance(advanceID){
    return this._http.post(URL_PATHS.advances + '/' + advanceID + '/' + URL_PATHS.cancelPO,"");
  }
 
}
