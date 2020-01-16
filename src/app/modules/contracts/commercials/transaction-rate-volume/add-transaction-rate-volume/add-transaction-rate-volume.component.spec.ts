import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTransactionRateVolumeComponent } from './add-transaction-rate-volume.component';

describe('AddTransactionRateVolumeComponent', () => {
  let component: AddTransactionRateVolumeComponent;
  let fixture: ComponentFixture<AddTransactionRateVolumeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTransactionRateVolumeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTransactionRateVolumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
