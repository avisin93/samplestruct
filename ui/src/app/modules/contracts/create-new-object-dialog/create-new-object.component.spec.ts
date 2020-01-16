import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewObjectComponent } from './create-new-object.component';

describe('CreateNewObjectComponent', () => {
  let component: CreateNewObjectComponent;
  let fixture: ComponentFixture<CreateNewObjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNewObjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
