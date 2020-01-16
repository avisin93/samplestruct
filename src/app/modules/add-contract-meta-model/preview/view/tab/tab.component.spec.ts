import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewContractMetaModelViewTabComponent } from './tab.component';

describe('PreviewContractMetaModelViewTabComponent', () => {
  let component: PreviewContractMetaModelViewTabComponent;
  let fixture: ComponentFixture<PreviewContractMetaModelViewTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewContractMetaModelViewTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewContractMetaModelViewTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
