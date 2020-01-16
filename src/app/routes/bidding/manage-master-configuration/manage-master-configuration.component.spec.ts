import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMasterConfigurationComponent } from './manage-master-configuration.component';

describe('ManageMasterConfigurationComponent', () => {
  let component: ManageMasterConfigurationComponent;
  let fixture: ComponentFixture<ManageMasterConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageMasterConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageMasterConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
