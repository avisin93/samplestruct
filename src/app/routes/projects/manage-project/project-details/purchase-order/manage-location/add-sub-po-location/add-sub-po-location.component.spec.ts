import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubPoLocationComponent } from './add-sub-po-location.component';

describe('AddSubPoLocationComponent', () => {
  let component: AddSubPoLocationComponent;
  let fixture: ComponentFixture<AddSubPoLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSubPoLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSubPoLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
