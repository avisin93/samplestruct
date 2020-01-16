import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardConfigurationTabFieldsComponent } from './fields.component';

describe('DashboardConfigurationTabFieldsComponent', () => {
  let component: DashboardConfigurationTabFieldsComponent;
  let fixture: ComponentFixture<DashboardConfigurationTabFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardConfigurationTabFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardConfigurationTabFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
