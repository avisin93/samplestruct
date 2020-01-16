import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderListingComponent } from './purchase-order-listing.component';

describe('PurchaseOrderListingComponent', () => {
  let component: PurchaseOrderListingComponent;
  let fixture: ComponentFixture<PurchaseOrderListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseOrderListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
