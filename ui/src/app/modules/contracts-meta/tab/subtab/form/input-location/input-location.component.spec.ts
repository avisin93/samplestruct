import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsMetaTabSubtabFormInputLocationComponent } from './input-location.component';

describe('ContractsMetaTabSubtabFormInputLocationComponent', () => {
  let component: ContractsMetaTabSubtabFormInputLocationComponent;
  let fixture: ComponentFixture<ContractsMetaTabSubtabFormInputLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsMetaTabSubtabFormInputLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsMetaTabSubtabFormInputLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
