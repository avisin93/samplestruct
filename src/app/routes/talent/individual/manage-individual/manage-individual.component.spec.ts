import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageIndividualComponent } from './manage-individual.component';

describe('ManageIndividualComponent', () => {
  let component: ManageIndividualComponent;
  let fixture: ComponentFixture<ManageIndividualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageIndividualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
