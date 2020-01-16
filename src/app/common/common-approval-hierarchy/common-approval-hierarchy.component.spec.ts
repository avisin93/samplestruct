import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonApprovalHierarchyComponent } from './common-approval-hierarchy.component';

describe('CommonApprovalHierarchyComponent', () => {
  let component: CommonApprovalHierarchyComponent;
  let fixture: ComponentFixture<CommonApprovalHierarchyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonApprovalHierarchyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonApprovalHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
