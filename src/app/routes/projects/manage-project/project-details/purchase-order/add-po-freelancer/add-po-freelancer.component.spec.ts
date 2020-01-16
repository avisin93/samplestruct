import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPoFreelancerComponent } from './add-po-freelancer.component';

describe('AddPoFreelancerComponent', () => {
  let component: AddPoFreelancerComponent;
  let fixture: ComponentFixture<AddPoFreelancerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPoFreelancerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPoFreelancerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
