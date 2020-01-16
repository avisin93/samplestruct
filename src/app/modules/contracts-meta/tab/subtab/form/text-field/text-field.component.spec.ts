import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsMetaTabSubtabFormTextFieldComponent } from './text-field.component';

describe('ContractsMetaTabSubtabFormTextFieldComponent', () => {
  let component: ContractsMetaTabSubtabFormTextFieldComponent;
  let fixture: ComponentFixture<ContractsMetaTabSubtabFormTextFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsMetaTabSubtabFormTextFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsMetaTabSubtabFormTextFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
