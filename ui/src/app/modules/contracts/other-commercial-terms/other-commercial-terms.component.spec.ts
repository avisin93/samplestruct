import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherCommercialTermsComponent } from './other-commercial-terms.component';

describe('OtherCommercialTermsComponent', () => {
  let component: OtherCommercialTermsComponent;
  let fixture: ComponentFixture<OtherCommercialTermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherCommercialTermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherCommercialTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
