import { TestBed } from '@angular/core/testing';

import { ContactPersonService } from './contact-person.service';

describe('ContactPersonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContactPersonService = TestBed.get(ContactPersonService);
    expect(service).toBeTruthy();
  });
});
