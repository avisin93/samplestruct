import { Injectable } from '@angular/core';
import { HttpRequest } from '@app/common';
import { API_URL } from '@app/config';

@Injectable()
export class ListRolesService {

    constructor(private _http: HttpRequest) { }

    /**
     * Roles listing webservice call
     */
    getRolesList(params) {
        return this._http.get(API_URL['roles'], params);
    }
}
