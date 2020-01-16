import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeMaterialModelComponent } from './time-material-model.component';

describe('TimeMaterialModelComponent', () => {
  let component: TimeMaterialModelComponent;
  let fixture: ComponentFixture<TimeMaterialModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeMaterialModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeMaterialModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
