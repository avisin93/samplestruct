import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionRateStandardComponent } from './transaction-rate-standard.component';

describe('TransactionRateStandardComponent', () => {
  let component: TransactionRateStandardComponent;
  let fixture: ComponentFixture<TransactionRateStandardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionRateStandardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionRateStandardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
