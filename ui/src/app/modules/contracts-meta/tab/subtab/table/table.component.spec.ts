import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsMetaMatSubtabTableComponent } from './table.component';

describe('ContractsMetaMatSubtabTableComponent', () => {
  let component: ContractsMetaMatSubtabTableComponent;
  let fixture: ComponentFixture<ContractsMetaMatSubtabTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsMetaMatSubtabTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsMetaMatSubtabTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
