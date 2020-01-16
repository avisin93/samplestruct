import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsMetaComponent } from './contracts-meta.component';

describe('ContractsMetaComponent', () => {
  let component: ContractsMetaComponent;
  let fixture: ComponentFixture<ContractsMetaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsMetaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsMetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
