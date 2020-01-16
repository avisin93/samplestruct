import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsMetaTabSubtabFormTextareaComponent } from './textarea.component';

describe('ContractsMetaTabSubtabFormTextareaComponent', () => {
  let component: ContractsMetaTabSubtabFormTextareaComponent;
  let fixture: ComponentFixture<ContractsMetaTabSubtabFormTextareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsMetaTabSubtabFormTextareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsMetaTabSubtabFormTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
