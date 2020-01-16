import { TestBed } from '@angular/core/testing';

import { ContractListService } from './contract-list.service';

describe('ContractListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContractListService = TestBed.get(ContractListService);
    expect(service).toBeTruthy();
  });
});
