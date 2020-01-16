
/**
* Service       : ListAccommodationService
* Author        : Boston Byte LLC
* Creation Date : 4th Dec 2017
*/

import { Injectable } from '@angular/core';
import { URL_PATHS, URL_FULL_PATHS } from '../../../../config'
import { PreBidHttpRequest } from '../../pre-bid-http-request';
/**
* ManageSkiLiftsService class is used to fetch the ski lifts data from the server through webservices
*/
@Injectable()
export class AICPService {

    /**
    * constructor method is used to initialize members of class
    */
    constructor(private _http: PreBidHttpRequest) {
    }    
}
