import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewContractMetaModelViewTabSubtabFormComponent } from './form.component';

describe('PreviewContractMetaModelViewTabSubtabFormComponent', () => {
  let component: PreviewContractMetaModelViewTabSubtabFormComponent;
  let fixture: ComponentFixture<PreviewContractMetaModelViewTabSubtabFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewContractMetaModelViewTabSubtabFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewContractMetaModelViewTabSubtabFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
