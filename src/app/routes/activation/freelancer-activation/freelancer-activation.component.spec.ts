import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelancerActivationComponent } from './freelancer-activation.component';

describe('FreelancerActivationComponent', () => {
  let component: FreelancerActivationComponent;
  let fixture: ComponentFixture<FreelancerActivationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreelancerActivationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreelancerActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
