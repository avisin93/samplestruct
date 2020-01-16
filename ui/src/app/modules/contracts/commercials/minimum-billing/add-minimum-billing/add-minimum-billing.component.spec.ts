import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMinimumBillingComponent } from './add-minimum-billing.component';

describe('AddMinimumBillingComponent', () => {
  let component: AddMinimumBillingComponent;
  let fixture: ComponentFixture<AddMinimumBillingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMinimumBillingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMinimumBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
