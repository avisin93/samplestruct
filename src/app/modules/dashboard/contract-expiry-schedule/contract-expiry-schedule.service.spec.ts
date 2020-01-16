import { TestBed } from '@angular/core/testing';

import { ContractExpiryScheduleService } from './contract-expiry-schedule.service';

describe('StatusTimeCircleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContractExpiryScheduleService = TestBed.get(ContractExpiryScheduleService);
    expect(service).toBeTruthy();
  });
});
