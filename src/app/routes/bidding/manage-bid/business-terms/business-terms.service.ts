import { Injectable } from '@angular/core';
import { URL_FULL_PATHS } from '../../../../config';
import { PreBidHttpRequest } from '../../pre-bid-http-request';
import { Common } from '../../../../common';


@Injectable()
export class BusinessTermsService {

constructor(private _http: PreBidHttpRequest) { }
// getBusinessTermsDetails(id) {
//     return this._http.get(Common.sprintf(URL_FULL_PATHS.manageBid, [id]));
// }

// updateBusinessTermsData(id, data: any) {
//     return this._http.put(Common.sprintf(URL_FULL_PATHS.manageBid, [id]), JSON.stringify(data));
// }
  getMasterConfigCurrencies() {
    return this._http.get(URL_FULL_PATHS.masterConFigCurrencyURL);
  }
}
