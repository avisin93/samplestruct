import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedFeeComponent } from './fixed-fee.component';

describe('FixedFeeComponent', () => {
  let component: FixedFeeComponent;
  let fixture: ComponentFixture<FixedFeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedFeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
