import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationScouterComponent } from './location-scouter.component';

describe('LocationScouterComponent', () => {
  let component: LocationScouterComponent;
  let fixture: ComponentFixture<LocationScouterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationScouterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationScouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
