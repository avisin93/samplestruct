import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsMetaMatSubtabFormComponent } from './form.component';

describe('ContractsMetaMatSubtabFormComponent', () => {
  let component: ContractsMetaMatSubtabFormComponent;
  let fixture: ComponentFixture<ContractsMetaMatSubtabFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsMetaMatSubtabFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsMetaMatSubtabFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
