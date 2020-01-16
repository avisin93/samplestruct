import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageBaseChartComponent } from './manage-base-chart.component';

describe('ManageBaseChartComponent', () => {
  let component: ManageBaseChartComponent;
  let fixture: ComponentFixture<ManageBaseChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageBaseChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageBaseChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
