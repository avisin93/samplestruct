import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterInvoiceListingComponent } from './master-invoice-listing.component';

describe('MasterInvoiceListingComponent', () => {
  let component: MasterInvoiceListingComponent;
  let fixture: ComponentFixture<MasterInvoiceListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterInvoiceListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterInvoiceListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
