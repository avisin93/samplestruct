import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardConfigurationTabComponent } from '../tab/tab.component';

describe('DashboardConfigurationTabComponent', () => {
  let component: DashboardConfigurationTabComponent;
  let fixture: ComponentFixture<DashboardConfigurationTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardConfigurationTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardConfigurationTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
