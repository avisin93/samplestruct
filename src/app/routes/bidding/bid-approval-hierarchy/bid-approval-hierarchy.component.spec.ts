import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BidApprovalHierarchyComponent } from './bid-approval-hierarchy.component';

describe('BidApprovalHierarchyComponent', () => {
  let component: BidApprovalHierarchyComponent;
  let fixture: ComponentFixture<BidApprovalHierarchyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BidApprovalHierarchyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BidApprovalHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
