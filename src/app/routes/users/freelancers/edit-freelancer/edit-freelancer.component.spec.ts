import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFreelancersComponent } from './edit-freelancers.component';

describe('EditFreelancersComponent', () => {
  let component: EditFreelancersComponent;
  let fixture: ComponentFixture<EditFreelancersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFreelancersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFreelancersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
