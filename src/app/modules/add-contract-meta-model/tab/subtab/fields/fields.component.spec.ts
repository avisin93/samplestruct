import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContactMetaModelFieldsComponent } from './fields.component';

describe('AddContactMetaModelFieldsComponent', () => {
  let component: AddContactMetaModelFieldsComponent;
  let fixture: ComponentFixture<AddContactMetaModelFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddContactMetaModelFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddContactMetaModelFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
