import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MasterPurchaseOrderComponent } from './master-purchase-order.component';


describe('MasterPurchaseOrderComponent', () => {
  let component: MasterPurchaseOrderComponent;
  let fixture: ComponentFixture<MasterPurchaseOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterPurchaseOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterPurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
