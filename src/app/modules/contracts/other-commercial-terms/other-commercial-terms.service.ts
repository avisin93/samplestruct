import { Injectable, OnInit } from '@angular/core';
import { RequestService } from '../../request.service';
import { ContractService } from '../contracts.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OtherCommercialTermsService {

  constructor (private requestService: RequestService, private contractService: ContractService) { }

  ngOnInit () {

  }

  saveNotification (notificationObject: any) {
    return this.requestService.doPOST('/api/notifications', notificationObject, 'API_SCHEDULE');
  }

  updateNotification (notificationObject: any, notificationId: string) {
    let params = new HttpParams();
    params = params.set('notificationid',notificationId);
    return this.requestService.doPUT('/api/notifications/' + notificationId, notificationObject, 'API_SCHEDULE');

  }

  deleteNotificationByType (contractId, typeOfTab) {
    return this.requestService.doDELETE('/api/notifications/' + contractId + '/' + typeOfTab, 'API_SCHEDULE');
  }

}
