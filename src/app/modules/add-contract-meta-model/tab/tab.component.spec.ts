import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContractMetaModelTabComponent } from './tab.component';

describe('AddContractMetaModelTabComponent', () => {
  let component: AddContractMetaModelTabComponent;
  let fixture: ComponentFixture<AddContractMetaModelTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddContractMetaModelTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddContractMetaModelTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
