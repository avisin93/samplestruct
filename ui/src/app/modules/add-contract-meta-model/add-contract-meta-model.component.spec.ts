import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContractMetaModelComponent } from './add-contract-meta-model.component';

describe('AddContractMetaModelComponent', () => {
  let component: AddContractMetaModelComponent;
  let fixture: ComponentFixture<AddContractMetaModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddContractMetaModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddContractMetaModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
