import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { RequestService } from '../../request.service';

@Injectable({
  providedIn: 'root'
})
export class EventCalendarService {

  constructor (private requestService: RequestService) {}

  countContractsByYearGroupByMonth (queryParams) {
    return this.requestService.doGET(
      '/api/event-calendar/year/group-month',
      'API_CONTRACT',
      queryParams);
  }

  countContractsByMonthAndYearGroupByDay (params) {
    return this.requestService.doGET(
      '/api/event-calendar/month-year/group-day',
      'API_CONTRACT',
      params
    );
  }

  findContractsByDate (queryParams) {
    return this.requestService.doGET(
      '/api/event-calendar/date',
      'API_CONTRACT',
      queryParams
    );
  }

  findContractsByMonthYear (queryParams) {
    return this.requestService.doGET(
      '/api/event-calendar/month-year',
      'API_CONTRACT',
      queryParams
    );
  }
}
