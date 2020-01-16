import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancesComponent } from './advances.component';

describe('AdvancesComponent', () => {
  let component: AdvancesOrReimbursementComponent;
  let fixture: ComponentFixture<AdvancesOrReimbursementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvancesOrReimbursementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancesOrReimbursementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
