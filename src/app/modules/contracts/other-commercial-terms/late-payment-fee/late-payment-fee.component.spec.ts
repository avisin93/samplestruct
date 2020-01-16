import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LatePaymentFeeComponent } from './late-payment-fee.component';

describe('LatePaymentFeeComponent', () => {
  let component: LatePaymentFeeComponent;
  let fixture: ComponentFixture<LatePaymentFeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LatePaymentFeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatePaymentFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
