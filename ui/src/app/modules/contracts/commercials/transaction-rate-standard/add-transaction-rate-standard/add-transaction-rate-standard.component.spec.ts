import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTransactionRateStandardComponent } from './add-transaction-rate-standard.component';

describe('AddTransactionRateStandardComponent', () => {
  let component: AddTransactionRateStandardComponent;
  let fixture: ComponentFixture<AddTransactionRateStandardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTransactionRateStandardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTransactionRateStandardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
