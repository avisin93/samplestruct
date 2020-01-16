import { TestBed } from '@angular/core/testing';

import { CommercialsService } from './commercials.service';

describe('CommercialsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommercialsService = TestBed.get(CommercialsService);
    expect(service).toBeTruthy();
  });
});
