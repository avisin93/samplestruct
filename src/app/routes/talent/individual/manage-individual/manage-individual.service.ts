/**
* Service     : ManageIndividualService
 
* Creation Date : 19th April, 2019
*/

import { Injectable } from '@angular/core';
import { HttpRequest, Common } from '@app/common';
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
export class ManageIndividualService {
    private data: any;
    private observable: Observable<any>;

    /**
    * constructor method is used to initialize members of class
    */
    constructor(private _http: HttpRequest) {

    }
    /**
     * gets individuals data
     * @param id individualId
     */
    getIndividualData(id) {
        return this._http.get(API_URL.individual + "/" + id);
    }
    /**
     * It updates an individual
     * @param data data to be sent to service
     */
    editIndividualData(data) {
        return this._http.put(API_URL.individual + "/" + data.id, data);
    }
    /**
     * It adds new individual.
     * @param data data to be sent to service
     */
    addIndividualData(data) {
        return this._http.post(API_URL.individual, data);
    }
    getIndividualFilterList(params) {
        return this._http.get(API_URL.individualFilterList, params);
    }
    getAgencyFilterList(params) {
        return this._http.get(API_URL.agencyFilterList, params);
    }
}
