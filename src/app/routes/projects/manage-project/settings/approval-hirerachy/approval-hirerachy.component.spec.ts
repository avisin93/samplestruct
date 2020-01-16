import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalHirerachyComponent } from './approval-hirerachy.component';

describe('ApprovalHirerachyComponent', () => {
  let component: ApprovalHirerachyComponent;
  let fixture: ComponentFixture<ApprovalHirerachyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalHirerachyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalHirerachyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
