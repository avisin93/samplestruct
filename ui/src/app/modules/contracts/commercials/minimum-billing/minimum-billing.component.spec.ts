import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinimumBillingComponent } from './minimum-billing.component';

describe('MinimumBillingComponent', () => {
  let component: MinimumBillingComponent;
  let fixture: ComponentFixture<MinimumBillingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinimumBillingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinimumBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
