import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTermsComponent } from './payment-terms.component';

describe('PaymentTermsComponent', () => {
  let component: PaymentTermsComponent;
  let fixture: ComponentFixture<PaymentTermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentTermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
