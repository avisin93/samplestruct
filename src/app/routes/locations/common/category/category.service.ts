import { Injectable } from '@angular/core';
import { HttpRequest, Common } from '@app//common';
import { API_URL } from '@app/config';

@Injectable()
export class CategoryService {

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

    getCategoryList(params) {
        return this._http.get(API_URL.locationCategoriesUrl, params);
    }
    postData(url, data) {
        return this._http.post(url, data);
    }
    putData(id, data) {
        return this._http.put(Common.sprintf(API_URL.manageLocationCategoriesUrl, [id]), data);
    }
    deleteCategory(url, id) {
        return this._http.delete(Common.sprintf(url, [id]));
    }
}
