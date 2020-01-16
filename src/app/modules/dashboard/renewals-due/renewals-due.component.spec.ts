import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewalsDueComponent } from './renewals-due.component';

describe('RenewalsDueComponent', () => {
  let component: RenewalsDueComponent;
  let fixture: ComponentFixture<RenewalsDueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenewalsDueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewalsDueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
