import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageFreelancerComponent } from './manage-freelancer.component';

describe('AddPoFreelancerComponent', () => {
  let component: ManageFreelancerComponent;
  let fixture: ComponentFixture<ManageFreelancerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageFreelancerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageFreelancerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
