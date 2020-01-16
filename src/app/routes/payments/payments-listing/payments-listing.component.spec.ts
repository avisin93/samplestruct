import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsListingComponent } from './payments-listing.component';

describe('PaymentsListingComponent', () => {
  let component: PaymentsListingComponent;
  let fixture: ComponentFixture<PaymentsListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentsListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
