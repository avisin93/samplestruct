import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSettlementComponent } from './manage-settlement.component';

describe('ManageSettlementComponent', () => {
  let component: ManageSettlementComponent;
  let fixture: ComponentFixture<ManageSettlementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageSettlementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
