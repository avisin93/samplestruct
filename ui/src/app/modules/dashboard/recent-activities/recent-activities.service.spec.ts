import { TestBed } from '@angular/core/testing';

import { RecentActivitiesService } from './recent-activities.service';

describe('RecentActivitiesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RecentActivitiesService = TestBed.get(RecentActivitiesService);
    expect(service).toBeTruthy();
  });
});
