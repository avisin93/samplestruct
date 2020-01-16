import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsMetaTabSubtabComponent } from './subtab.component';

describe('ContractsMetaTabSubtabComponent', () => {
  let component: ContractsMetaTabSubtabComponent;
  let fixture: ComponentFixture<ContractsMetaTabSubtabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsMetaTabSubtabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsMetaTabSubtabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
