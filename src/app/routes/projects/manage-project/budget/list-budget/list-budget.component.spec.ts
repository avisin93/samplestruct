import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBudgetComponent } from './list-budget.component';

describe('ListBudgetComponent', () => {
  let component: ListBudgetComponent;
  let fixture: ComponentFixture<ListBudgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListBudgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
