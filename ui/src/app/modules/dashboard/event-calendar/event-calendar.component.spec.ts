import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CMMatCalendar } from './event-calendar.component';

describe('EventCalendarComponent', () => {
  let component: CMMatCalendar<{}>;
  let fixture: ComponentFixture<CMMatCalendar<{}>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CMMatCalendar ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CMMatCalendar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
