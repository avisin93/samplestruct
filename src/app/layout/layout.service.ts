import { Injectable } from '@angular/core';
import { HttpRequest, Common } from '@app/common';
import { API_URL } from '@app/config';

@Injectable()
export class LayoutService {

    constructor(private _http: HttpRequest) { }

    getAccessRolePermissionDetails(id) {
        return this._http.get(Common.sprintf(API_URL['rolesAccess'], [id]));
    }

    /**
  * logout method is used to logut user
  */
    logout() {
        const body = '';
        return this._http.post(API_URL['logout'], body);
    }
}
