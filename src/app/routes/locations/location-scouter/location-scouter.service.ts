/**
* Service       : ListScouterService
* Author        : Boston Byte LLC
* Creation Date : 6th Mar 2019
*/

import { Injectable } from '@angular/core';
import { API_URL } from '@app/config';
import { Common, HttpRequest } from '@app/common';

@Injectable()
export class LocationScouterService {
    constructor(private _http: HttpRequest) {
    }
    /**
     * It gets scouter List from the server as requested.
     * @param params search Querry Parameters
     */
    getScouterLocationAccessList(params: any) {
        return this._http.get(API_URL.scouterLocationAccessListUrl, params);
    }
    /**
     * It updates access of scouter to location list.
     * @param data data to be sent to service
     */
    updateScouterLocationAccess(data: any) {
        return this._http.patch(Common.sprintf(API_URL.scouterLocationAccessUrl, [data.id]), data);
    }
}
