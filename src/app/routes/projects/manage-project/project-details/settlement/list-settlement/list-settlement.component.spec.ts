import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSettlementComponent } from './list-settlement.component';

describe('ListSettlementComponent', () => {
  let component: ListSettlementComponent;
  let fixture: ComponentFixture<ListSettlementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSettlementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
