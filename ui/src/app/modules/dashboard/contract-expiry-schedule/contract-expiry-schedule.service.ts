import { Injectable } from '@angular/core';
import { RequestService } from '../../request.service';

@Injectable({
  providedIn: 'root'
})
export class ContractExpiryScheduleService {

  getContractsExpirySchedules () {
    return this.requestService.doGET(
      '/api/contracts/expiry-schedules',
      'API_CONTRACT'
    );
  }

  constructor (private requestService: RequestService) { }
}
