import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorActivationComponent } from './vendor-activation.component';

describe('VendorActivationComponent', () => {
  let component: VendorActivationComponent;
  let fixture: ComponentFixture<VendorActivationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorActivationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
