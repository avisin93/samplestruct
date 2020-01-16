import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsMetaTabSubtabFormDropdownComponent } from './dropdown.component';

describe('ContractsMetaTabSubtabFormDropdownComponent', () => {
  let component: ContractsMetaTabSubtabFormDropdownComponent;
  let fixture: ComponentFixture<ContractsMetaTabSubtabFormDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsMetaTabSubtabFormDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsMetaTabSubtabFormDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
