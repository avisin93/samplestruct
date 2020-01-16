import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditNotificationComponent } from './add-edit-notification.component';

describe('AddEditNotificationComponent', () => {
  let component: AddEditNotificationComponent;
  let fixture: ComponentFixture<AddEditNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
