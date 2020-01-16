import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalReportingFieldsComponent } from './additional-reporting-fields.component';

describe('AdditionalReportingFieldsComponent', () => {
  let component: AdditionalReportingFieldsComponent;
  let fixture: ComponentFixture<AdditionalReportingFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionalReportingFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalReportingFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
