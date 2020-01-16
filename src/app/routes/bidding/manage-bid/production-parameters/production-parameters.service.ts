import { Injectable } from '@angular/core';
import { PreBidHttpRequest } from '../../pre-bid-http-request';
import { Common } from '@app/common';
import { URL_FULL_PATHS } from '@app/config';

@Injectable()
export class ProductionParametersService {

    constructor(private _http: PreBidHttpRequest) { }
    getProductionParametersDetails(id) {
        return this._http.get(Common.sprintf(URL_FULL_PATHS.manageBid, [id]));
    }

    updateProductionParametersData(id, data: any) {
        return this._http.put(Common.sprintf(URL_FULL_PATHS.manageBid, [id]), JSON.stringify(data));
    }
}
