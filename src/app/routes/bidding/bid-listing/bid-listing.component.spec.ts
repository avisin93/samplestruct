import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BidListingComponent } from './bid-listing.component';

describe('BidListingComponent', () => {
  let component: BidListingComponent;
  let fixture: ComponentFixture<BidListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BidListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BidListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
