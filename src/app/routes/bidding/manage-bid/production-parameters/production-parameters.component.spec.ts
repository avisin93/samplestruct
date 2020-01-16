import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionParametersComponent } from './production-parameters.component';

describe('ProductionParametersComponent', () => {
  let component: ProductionParametersComponent;
  let fixture: ComponentFixture<ProductionParametersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionParametersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
