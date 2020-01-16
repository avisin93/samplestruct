import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsMetaTabSubtabFormDatepickerComponent } from './datepicker.component';

describe('ContractsMetaTabSubtabFormDatepickerComponent', () => {
  let component: ContractsMetaTabSubtabFormDatepickerComponent;
  let fixture: ComponentFixture<ContractsMetaTabSubtabFormDatepickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsMetaTabSubtabFormDatepickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsMetaTabSubtabFormDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
