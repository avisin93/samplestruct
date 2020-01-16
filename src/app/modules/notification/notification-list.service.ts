import { Injectable } from '@angular/core';
import { HttpParams, HttpHeaders, HttpClient } from '@angular/common/http';
import { RequestService } from '../request.service';
import { Observable } from 'rxjs';
import { StorageService } from '../shared/providers/storage.service';
import { UrlDetails } from 'src/app/models/url/url-details.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationListService {

  constructor (private httpService: HttpClient, private requestService: RequestService) { }

  // searchNotifications (queryParams: HttpParams): Observable<Object> {
  //   return this.requestService.doGET(
  //     '/api/notifications/search',
  //     'API_SCHEDULE',
  //     queryParams
  //   );
  // }

  async searchNotifications (queryParams: HttpParams): Promise<any> {
    return this.requestService.doGET(
      '/api/notifications/search',
      'API_SCHEDULE',
      queryParams
    ).toPromise();
  }

  createNotification (objectData) {
    return this.requestService.doPOST(
      '/api/notifications',
      objectData,
      'API_SCHEDULE'
    );
  }

  updateNotification (objectData, urlParams) {
    return this.requestService.doPUT(
      `/api/notifications/${urlParams.notificationid}`,
      objectData,
      'API_SCHEDULE'
    );
  }

  updateNotifications (objectData: any): Observable<Object> {
    return this.requestService.doPUT(
      '/api/notifications',
      objectData,
      'API_SCHEDULE'
    );
  }

  getNotification (urlParams) {
    return this.requestService.doGET(
      `/api/notifications/${urlParams.notificationid}`,
      'API_SCHEDULE'
    );
  }

  deleteNotification (urlParams: any) {
    let promise = new Promise((resolve, reject) => {
      this.requestService.doDELETE('/api/notifications/' + urlParams,'API_SCHEDULE').toPromise().then((response: any) => {
        if (response.status === '500') {
          reject();
        } else {
          resolve(response);
        }
      }).catch();
    });
    return promise;
  }

  deleteNotifications (params: HttpParams): Observable<Object> {
    return this.requestService.doDELETE(
      '/api/notifications',
      'API_SCHEDULE',
      params
    );
  }

  getReminderStatuses (): Observable<Object> {
    return this.requestService.doGET(
      '/api/mdm/reminder-statuses',
      'API_CONTRACT'
    );
  }

  getAllNotificationTypes () {
    return this.requestService.doGET(
      '/api/mdm/notifications-types',
      'API_CONTRACT'
    );
  }

  getAllBusinessPartners () {
    return this.requestService.doGET(
      '/api/mdm/client/business-partners',
      'API_CONTRACT'
    );
  }

  getAllTimePeriodType () {
    return this.requestService.doGET(
      '/api/mdm/time-periods',
      'API_CONTRACT'
    );
  }

  searchContractListContracts (queryParams?: HttpParams) {
    return new Promise(async (resolve, reject) => {
      await this.requestService.doGET(
        '/api/contracts/search',
        'API_CONTRACT',
        queryParams).toPromise().then((response: any) => {
          resolve(response);
        }).catch();
    });
  }

  async countNotificationsByMonthAndYearGroupByDay (queryParams): Promise<any> {
    let a = await this.requestService.doGET(
      '/api/event-calendar/month-year/group-day',
      'API_SCHEDULE',
      queryParams
    ).toPromise();
    return a;
  }

  addOrUpdateAttribute (id, userAttributes) {
    let body: any = {
      id : id,
      userAttributes : userAttributes
    };

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type','application/json')
      .append('Authorization','Bearer ' + StorageService.get(StorageService.exelaAuthToken));
    this.httpService.post(`${UrlDetails.$exela_addOrUpdateUserAttributes}`,body,{ headers: headers, responseType: 'text' }).toPromise().then(response => {
      return response;
    }).catch(error => {
      return error;
    });
  }

  async getAttributeForContractList () {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type','application/json')
    .append('Authorization','Bearer ' + StorageService.get(StorageService.exelaAuthToken));
    return this.httpService.post(`${UrlDetails.$exela_getUserAttributes}/${StorageService.get(StorageService.userId)}`,
    undefined,{ headers: headers, observe: 'response' }).toPromise().then(response => {
      let list: any = response.body;
      return list.find((item: any) => {
        return item.att_name === 'notification-list-columns';
      });
    }
    ).catch();
  }
}
