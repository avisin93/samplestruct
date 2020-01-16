/**
* Service       : ListAccommodationService
* Author        : Boston Byte LLC
* Creation Date : 4th Dec 2017
*/

import { Injectable } from '@angular/core';
import { HttpRequest, Common } from '@app/common';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import { API_URL } from '@app/config';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class LocationsListService {
    constructor(private _http: HttpRequest) {
    }
    /**
     * call webservice to get location list
     * @param params querry params
     */
    getLocationsList(params: any) {
        return this._http.get(API_URL.locationUrl, params);
    }
    /**
     * call webservice to get Project list
     * @param params querry params
     */
    getProjectList() {
        return this._http.get(API_URL.zipProjectList);
    }

    /**
     * call webservice to get location categories
     */
    getLocationCategories() {
        return this._http.get(API_URL.locationCategoriesUrl);
    }
    /**
     * call webservice to get location states
     */
    getStates() {
        return this._http.get(API_URL.locationStatesUrl);
    }
    /**
     * call webservice to get location cities
     */
    getCities() {
        return this._http.get(API_URL.locationCitiesUrl);
    }

    /**
     * call webservice to get location images of particular Id
     * @param id image ID
     */
    getLocationImagesbyId(id) {
        return this._http.get(Common.sprintf(API_URL.imagesUrl, [id]));

    }
    /**
     * call webservice to get location tags
     * @param params querry params
     */
    getTags(params) {
        return this._http.get(API_URL.locationTagsUrl, params);
    }
    /**
     * call webservice to delete location of requested Id
     * @param id image ID to be deleted
     */
    deleteLocation(id) {
        return this._http.delete(Common.sprintf(API_URL.deleteLocationUrl, [id]));
    }
    /**
        * method to create zip of selected images
        * @param params querry params
        */
    downloadZip(data: any, params) {
        return this._http.post(API_URL.locationZip, data, null, params)
    }
}
