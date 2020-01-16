import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepThreeActivationComponent } from './step-three-activation.component';

describe('StepThreeActivationComponent', () => {
  let component: StepThreeActivationComponent;
  let fixture: ComponentFixture<StepThreeActivationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepThreeActivationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepThreeActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
