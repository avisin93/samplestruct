import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionRateVolumeComponent } from './transaction-rate-volume.component';

describe('TransactionRateVolumeComponent', () => {
  let component: TransactionRateVolumeComponent;
  let fixture: ComponentFixture<TransactionRateVolumeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionRateVolumeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionRateVolumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
