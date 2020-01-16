import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractExpiryScheduleComponent } from './contract-expiry-schedule.component';

describe('StatusTimeCircleComponent', () => {
  let component: ContractExpiryScheduleComponent;
  let fixture: ComponentFixture<ContractExpiryScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractExpiryScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractExpiryScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
