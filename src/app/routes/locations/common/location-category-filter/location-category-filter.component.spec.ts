import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationCategoryFilterComponent } from './location-category-filter.component';

describe('LocationCategoryFilterComponent', () => {
  let component: LocationCategoryFilterComponent;
  let fixture: ComponentFixture<LocationCategoryFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationCategoryFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationCategoryFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
