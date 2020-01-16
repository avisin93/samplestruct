import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPoVendorComponent } from './add-po-vendor.component';

describe('AddPoVendorComponent', () => {
  let component: AddPoVendorComponent;
  let fixture: ComponentFixture<AddPoVendorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPoVendorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPoVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
