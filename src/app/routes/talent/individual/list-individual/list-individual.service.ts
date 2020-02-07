/**
* Service     : ListIndividualService
 
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
export class ListIndividualService {
    private data: any;
    private observable: Observable<any>;

    /**
    * constructor method is used to initialize members of class
    */
    constructor(private _http: HttpRequest) {

    }

    /**
    * This method is used to get list of individuals
   * @param searchParams as search parameters
    */
    getIndividualList(searchParams) {
        return this._http.get(API_URL.individual, searchParams);
    }
    /**
     * It activates and deactivates individual.
     * @param data data to be sent to service
     */
    updateIndividualAccess(id) {
        return this._http.patch(API_URL.individual + "/" + id, '');
    }
}
