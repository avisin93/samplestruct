import { TestBed, inject } from '@angular/core/testing';

import { ManageLocationService } from './manage-location.service';

describe('ManageLocationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManageLocationService]
    });
  });

  it('should be created', inject([ManageLocationService], (service: ManageLocationService) => {
    expect(service).toBeTruthy();
  }));
});
