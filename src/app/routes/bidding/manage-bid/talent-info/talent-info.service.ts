import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpRequest, Common } from '../../../../common';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import 'rxjs/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import { URL_PATHS, URL_FULL_PATHS } from '../../../../config';

@Injectable()
export class TalentInfoService {
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
    getTalentData(id) {
        return this._http.get(URL_FULL_PATHS.talentURL + '/' + id);
    }
    postTalentData(id, data) {
        return this._http.post(URL_FULL_PATHS.talentURL + '/' + id, data);
    }
}




