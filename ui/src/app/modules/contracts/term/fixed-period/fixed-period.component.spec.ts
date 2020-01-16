import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedPeriodComponent } from './fixed-period.component';

describe('FixedPeriodComponent', () => {
  let component: FixedPeriodComponent;
  let fixture: ComponentFixture<FixedPeriodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedPeriodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
