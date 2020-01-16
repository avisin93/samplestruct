import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewObjectDialogComponent } from './new-object-dialog.component';

describe('NewObjectDialogComponent', () => {
  let component: NewObjectDialogComponent;
  let fixture: ComponentFixture<NewObjectDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewObjectDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewObjectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
