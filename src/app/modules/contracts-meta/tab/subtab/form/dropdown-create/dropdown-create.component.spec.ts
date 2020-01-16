import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsMetaTabSubtabFormDropdownCreateComponent } from './dropdown-create.component';

describe('ContractsMetaTabSubtabFormDropdownCreateComponent', () => {
  let component: ContractsMetaTabSubtabFormDropdownCreateComponent;
  let fixture: ComponentFixture<ContractsMetaTabSubtabFormDropdownCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsMetaTabSubtabFormDropdownCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsMetaTabSubtabFormDropdownCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
