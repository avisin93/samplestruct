import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestService } from '../../request.service';

@Injectable()
export class PoiSetUpService {

  constructor (
    private requestService: RequestService
  ) {}

  getAllPoiDetailService (): Observable<any> {
    return this.requestService.doGET('/api/reachout/poiDetails', 'API_CONTRACT');
  }

  savePoiDetailService (poi: any) {
    return this.requestService.doPOST('/api/reachout/poiDetails', poi, 'API_CONTRACT');

  }

  loadPoiDetailService (_id: any) {
    return this.requestService.doGET(`/api/reachout/poiDetails/${_id}`, 'API_CONTRACT');
  }

  updatePoiDetailService (poi: any) {
    return this.requestService.doPUT(`/api/reachout/poiDetails/${poi._id}`, poi, 'API_CONTRACT');

  }

  deletePoiDetailService (poiId: any) {
    return this.requestService.doDELETE(`/api/reachout/poiDetails/${poiId}`, 'API_CONTRACT');
  }

}
