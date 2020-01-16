import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPoLocationComponent } from './add-po-location.component';

describe('AddPoLocationComponent', () => {
  let component: AddPoLocationComponent;
  let fixture: ComponentFixture<AddPoLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPoLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPoLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
