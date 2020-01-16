import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePoAdvanceComponent } from './manage-po-advance.component';

describe('ManagePoAdvanceComponent', () => {
  let component: ManagePoAdvanceComponent;
  let fixture: ComponentFixture<ManagePoAdvanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagePoAdvanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePoAdvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
