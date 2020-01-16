import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsMetaTabComponent } from './tab.component';

describe('ContractsMetaTabComponent', () => {
  let component: ContractsMetaTabComponent;
  let fixture: ComponentFixture<ContractsMetaTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsMetaTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsMetaTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
