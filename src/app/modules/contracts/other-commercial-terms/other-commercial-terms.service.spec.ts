import { TestBed } from '@angular/core/testing';

import { OtherCommercialTermsService } from './other-commercial-terms.service';

describe('OtherCommercialTermsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OtherCommercialTermsService = TestBed.get(OtherCommercialTermsService);
    expect(service).toBeTruthy();
  });
});
