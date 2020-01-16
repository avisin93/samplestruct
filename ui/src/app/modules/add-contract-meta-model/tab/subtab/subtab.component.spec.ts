import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContractMetaModelSubtabComponent } from '../subtab/subtab.component';

describe('AddContractMetaModelSubtabComponent', () => {
  let component: AddContractMetaModelSubtabComponent;
  let fixture: ComponentFixture<AddContractMetaModelSubtabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddContractMetaModelSubtabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddContractMetaModelSubtabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
