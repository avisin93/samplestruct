import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetWorkingComponent } from './budget-working.component';

describe('BudgetWorkingComponent', () => {
  let component: BudgetWorkingComponent;
  let fixture: ComponentFixture<BudgetWorkingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BudgetWorkingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetWorkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
