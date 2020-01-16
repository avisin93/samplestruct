import { Injectable } from '@angular/core';
import { API_URL } from '@app/config';
import { PreBidHttpRequest } from './pre-bid-http-request';

@Injectable()
export class BiddingService {
    constructor(private _http: PreBidHttpRequest) { }
    /**
    * this method is used to get bid details
    */
    getCurrencies() {
        return this._http.get(API_URL.currency);
    }


}
