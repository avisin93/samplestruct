import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EarlyPaymentDiscountComponent } from './early-payment-discount.component';

describe('EarlyPaymentDiscountComponent', () => {
  let component: EarlyPaymentDiscountComponent;
  let fixture: ComponentFixture<EarlyPaymentDiscountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EarlyPaymentDiscountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EarlyPaymentDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
