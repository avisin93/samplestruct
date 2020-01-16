import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRateChartComponent } from './manage-rate-chart.component';

describe('ManageRateChartComponent', () => {
  let component: ManageRateChartComponent;
  let fixture: ComponentFixture<ManageRateChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageRateChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageRateChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
