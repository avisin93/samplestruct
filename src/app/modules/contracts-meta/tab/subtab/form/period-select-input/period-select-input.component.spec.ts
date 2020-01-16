import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsMetaTabSubtabFormPeriodSelectInputComponent } from './period-select-input.component';

describe('ContractsMetaTabSubtabFormPeriodSelectInputComponent', () => {
  let component: ContractsMetaTabSubtabFormPeriodSelectInputComponent;
  let fixture: ComponentFixture<ContractsMetaTabSubtabFormPeriodSelectInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsMetaTabSubtabFormPeriodSelectInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsMetaTabSubtabFormPeriodSelectInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
