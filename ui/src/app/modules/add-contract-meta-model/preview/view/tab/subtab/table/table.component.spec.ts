import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewContractMetaModelViewTabSubtabTableComponent } from './table.component';

describe('PreviewContractMetaModelViewTabSubtabTableComponent', () => {
  let component: PreviewContractMetaModelViewTabSubtabTableComponent;
  let fixture: ComponentFixture<PreviewContractMetaModelViewTabSubtabTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewContractMetaModelViewTabSubtabTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewContractMetaModelViewTabSubtabTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
