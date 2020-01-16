import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralTermsComponent } from './general-terms.component';

describe('GeneralInformationComponent', () => {
  let component: GeneralTermsComponent;
  let fixture: ComponentFixture<GeneralTermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralTermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
