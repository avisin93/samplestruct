import { Injectable } from '@angular/core';
import { RequestService } from '../request.service';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class DashboardConfigurationService {

  constructor (
    private requestService: RequestService
  ) {}

  getDashboardConfiguration (): Observable<Object> {
    return this.requestService.doGET(
      `/api/contracts/dashboard-configuration`,
      'API_CONTRACT'
    );
  }

  createDashboardConfigurationTab (urlParams, objectData): Observable<Object> {
    return this.requestService.doPOST(
      `/api/contracts/dashboard-configuration/${urlParams.dashboardConfigurationId}/dashboard-configuration-tab`,
      objectData,
      'API_CONTRACT'
    );
  }

  updateDashboardConfigurationTab (urlParams, objectData): Observable<Object> {
    return this.requestService.doPUT(
      `/api/contracts/dashboard-configuration/${urlParams.dashboardConfigurationId}/dashboard-configuration-tab/${urlParams.dashboardConfigurationTabId}`,
      objectData,
      'API_CONTRACT'
    );
  }

  getAllMetaStatus () {
    return this.requestService.doGET(
      '/api/mdm/status?isMeta=true',
      'API_CONTRACT'
    );
  }

  getAllStatus () {
    return this.requestService.doGET(
      '/api/mdm/status',
      'API_CONTRACT'
    );
  }

  private dashboardConfigurationModel = new Subject<any>();
  dashboardConfigurationModelChange$ = this.dashboardConfigurationModel.asObservable();
  changedTabs (response: any) {
    this.dashboardConfigurationModel.next(response);
  }
}
