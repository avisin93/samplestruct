import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewContractMetaModelViewComponent } from './view.component';

describe('PreviewContractMetaModelViewComponent', () => {
  let component: PreviewContractMetaModelViewComponent;
  let fixture: ComponentFixture<PreviewContractMetaModelViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewContractMetaModelViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewContractMetaModelViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
