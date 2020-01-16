import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterInvoiceComponent } from './master-invoice.component';

describe('MasterInvoiceComponent', () => {
  let component: MasterInvoiceComponent;
  let fixture: ComponentFixture<MasterInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
