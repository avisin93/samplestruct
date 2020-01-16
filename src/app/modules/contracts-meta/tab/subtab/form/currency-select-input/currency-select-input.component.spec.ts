import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsMetaTabSubtabFormCurrencySelectInputComponent } from './currency-select-input.component';

describe('ContractsMetaTabSubtabFormCurrencySelectInputComponent', () => {
  let component: ContractsMetaTabSubtabFormCurrencySelectInputComponent;
  let fixture: ComponentFixture<ContractsMetaTabSubtabFormCurrencySelectInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsMetaTabSubtabFormCurrencySelectInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsMetaTabSubtabFormCurrencySelectInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
