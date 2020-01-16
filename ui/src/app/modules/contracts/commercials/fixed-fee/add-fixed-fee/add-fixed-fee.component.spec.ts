import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFixedFeeComponent } from './add-fixed-fee.component';

describe('AddFixedFeeComponent', () => {
  let component: AddFixedFeeComponent;
  let fixture: ComponentFixture<AddFixedFeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFixedFeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFixedFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
