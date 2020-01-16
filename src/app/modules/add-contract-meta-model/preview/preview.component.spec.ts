import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewContractMetaModelComponent } from './preview.component';

describe('PreviewContractMetaModelComponent', () => {
  let component: PreviewContractMetaModelComponent;
  let fixture: ComponentFixture<PreviewContractMetaModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewContractMetaModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewContractMetaModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
