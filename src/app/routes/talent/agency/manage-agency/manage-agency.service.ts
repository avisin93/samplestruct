/**
* Service       : ManageAgencyService
 
* Creation Date : 3th May 2019
*/

import { Injectable } from '@angular/core';
import { HttpRequest } from '@app/common';
import { API_URL } from '@app/config/api.config';
/**
* UserService class is used to fetch the users data from the server through webservices
*/

@Injectable()
export class ManageAgencyService {


    /**
    * constructor method is used to initialize members of class
    */
    constructor(private _http: HttpRequest) {

    }
   /**
    * Gets agency data
    * @param agencyId as record Id
    */
    getAgencyData(agencyId) {
        return this._http.get(API_URL.agencyUrl + '/' + agencyId);
    }
   /**
    * Adds agency data
    * @param agencyData as record data
    */
    postAgencyData(agencyData) {
        return this._http.post(API_URL.agencyUrl, agencyData);
    }
    /**
     * Updates Agengy Data
     * @param id as record id
     * @param agencyData as record data
     */
    putAgencyData(id, agencyData) {
        return this._http.put(API_URL.agencyUrl + '/' + id, agencyData);
    }
    /**
     * Gets project categories
     * @param typeId as type id
     * @param params as query params
     */
    getProjectCategories(typeId, params) {
        return this._http.get(API_URL.projectCategoriesUrl + '/' + typeId, params);
      }
}
