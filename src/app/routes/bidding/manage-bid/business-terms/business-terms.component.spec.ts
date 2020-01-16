import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuisnessTermsComponent } from './business-terms.component';

describe('BuisnessTermsComponentComponent', () => {
  let component: BuisnessTermsComponent;
  let fixture: ComponentFixture<BuisnessTermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuisnessTermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuisnessTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
