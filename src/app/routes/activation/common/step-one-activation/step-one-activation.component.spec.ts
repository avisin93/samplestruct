import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepOneActivationComponent } from './step-one-activation.component';

describe('StepOneActivationComponent', () => {
  let component: StepOneActivationComponent;
  let fixture: ComponentFixture<StepOneActivationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepOneActivationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepOneActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
