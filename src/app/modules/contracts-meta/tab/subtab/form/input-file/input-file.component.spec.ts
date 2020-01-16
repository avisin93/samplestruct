import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsMetaTabSubtabFormInputFileComponent } from './input-file.component';

describe('ContractsMetaTabSubtabFormInputFileComponent', () => {
  let component: ContractsMetaTabSubtabFormInputFileComponent;
  let fixture: ComponentFixture<ContractsMetaTabSubtabFormInputFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsMetaTabSubtabFormInputFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsMetaTabSubtabFormInputFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
