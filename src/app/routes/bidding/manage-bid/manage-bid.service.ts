import { Injectable } from '@angular/core';
import { Common } from '@app/common';
import { API_URL } from '@app/config';
import { PreBidHttpRequest } from '../pre-bid-http-request';

@Injectable()
export class ManageBidService {
    constructor(private _http: PreBidHttpRequest) { }
    /**
    * this method is used to get bid details
    */
    getBidDetails(id) {
        return this._http.get(Common.sprintf(API_URL.manageProjectInputs, [id]));
    }
    updateBidDetails(id, data) {
        return this._http.put(Common.sprintf(API_URL.manageProjectInputs, [id]), data);
    }
    uploadFile(data) {
        return this._http.postMultipartData(API_URL.file, data);
    }
    getCurrencies() {
        return this._http.get(API_URL.currency);
    }

    generateAICP(formDetails) {
        return this._http.put(API_URL.passes, formDetails);
    }

    getPassesDetails(projectId: String) {
        return this._http.get(Common.sprintf(API_URL.passesInfo, [projectId]));
    }

}
