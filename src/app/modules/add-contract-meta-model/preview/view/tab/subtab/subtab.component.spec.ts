import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewContractMetaModelViewTabSubtabComponent } from './subtab.component';

describe('PreviewContractMetaModelViewTabSubtabComponent', () => {
  let component: PreviewContractMetaModelViewTabSubtabComponent;
  let fixture: ComponentFixture<PreviewContractMetaModelViewTabSubtabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewContractMetaModelViewTabSubtabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewContractMetaModelViewTabSubtabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
