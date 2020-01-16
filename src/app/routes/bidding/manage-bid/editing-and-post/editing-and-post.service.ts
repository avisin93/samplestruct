
import { Injectable } from '@angular/core';
import { HttpRequest, Common } from '../../../../common';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import 'rxjs/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import { URL_FULL_PATHS } from '../../../../config';

@Injectable()
export class EditingAndPostService {
    /**
* constructor method is used to initialize members of class
*/
    constructor(private _http: HttpRequest) {
    }

    /**
    ** Common API Call for get Data
    **/
    apiCall(url: string) {
        return this._http.get(url);
    }
    getEditingAndPostData(id) {
        return this._http.get(URL_FULL_PATHS.editingAndPostURL + '/' + id);
    }
    postEditingAndPostData(id, data) {
        return this._http.post(URL_FULL_PATHS.editingAndPostURL + '/' + id, data);
    }
}



