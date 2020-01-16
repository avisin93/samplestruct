import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsMetaTabSubtabFormrRadioGroupComponent } from './radio-group.component';

describe('ContractsMetaTabSubtabFormrRadioGroupComponent', () => {
  let component: ContractsMetaTabSubtabFormrRadioGroupComponent;
  let fixture: ComponentFixture<ContractsMetaTabSubtabFormrRadioGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsMetaTabSubtabFormrRadioGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsMetaTabSubtabFormrRadioGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
