import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedPeriodWithoutRenewalComponent } from './fixed-period-without-renewal.component';

describe('FixedPeriodWithoutRenewalComponent', () => {
  let component: FixedPeriodWithoutRenewalComponent;
  let fixture: ComponentFixture<FixedPeriodWithoutRenewalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedPeriodWithoutRenewalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedPeriodWithoutRenewalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
