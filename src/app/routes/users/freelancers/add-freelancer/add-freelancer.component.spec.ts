import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFreelancersComponent } from './add-freelancers.component';

describe('AddFreelancersComponent', () => {
  let component: AddFreelancersComponent;
  let fixture: ComponentFixture<AddFreelancersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFreelancersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFreelancersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
