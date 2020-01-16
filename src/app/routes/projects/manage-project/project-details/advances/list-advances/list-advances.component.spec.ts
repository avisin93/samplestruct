import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PoListingComponent } from '../../purchase-order/po-listing/po-listing.component';



describe('PoListingComponent', () => {
  let component: PoListingComponent;
  let fixture: ComponentFixture<PoListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
