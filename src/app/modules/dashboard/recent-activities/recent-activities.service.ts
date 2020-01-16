import { Injectable } from '@angular/core';
import { RequestService } from '../../request.service';

@Injectable({
  providedIn: 'root'
})
export class RecentActivitiesService {
  public contractId: string;
  public contractData: any = {};

  constructor (private requestService: RequestService) {}

  getRecentActivities () {
    return this.requestService.doGET(
      '/api/history-action',
      'API_CONTRACT'
    );
  }
  getRecentActivity () {
    return this.requestService.doGET(
      '/api/history-action',
      'API_CONTRACT'
    );
  }
}
