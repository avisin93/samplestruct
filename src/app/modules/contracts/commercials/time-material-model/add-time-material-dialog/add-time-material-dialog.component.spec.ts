import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTimeMaterialDialogComponent } from './add-time-material-dialog.component';

describe('AddTimeMaterialDialogComponent', () => {
  let component: AddTimeMaterialDialogComponent;
  let fixture: ComponentFixture<AddTimeMaterialDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTimeMaterialDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTimeMaterialDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
