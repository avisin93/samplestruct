import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsMetaTabSubtabFormParentChildInput } from './parent-child-input.component';

describe('ContractsMetaTabSubtabFormParentChildInput', () => {
  let component: ContractsMetaTabSubtabFormParentChildInput;
  let fixture: ComponentFixture<ContractsMetaTabSubtabFormParentChildInput>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsMetaTabSubtabFormParentChildInput ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsMetaTabSubtabFormParentChildInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
