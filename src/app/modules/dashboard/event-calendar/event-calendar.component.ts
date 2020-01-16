import { ComponentPortal, ComponentType, Portal } from '@angular/cdk/portal';
import {
  AfterContentInit,
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats, NativeDateAdapter, MAT_NATIVE_DATE_FORMATS } from '@angular/material/core';
import { Subject, Subscription } from 'rxjs';
import { createMissingDateImplError } from './datepicker-errors';
import { CMMonthView } from './month-view';
import { MatDatepickerIntl } from '@angular/material';
import { HttpParams } from '@angular/common/http';
import { EventCalendarService } from './event-calendar.service';
import { Router } from '@angular/router';
import { SessionService } from '../../shared/providers/session.service';
import { StorageService } from '../../shared/providers/storage.service';

export type MatCalendarView = 'month';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL'
  },
  display: {
    dateInput: 'MM/DD/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM Do YYYY'
  }
};

@Component({
  selector: 'cm-event-calendar-header',
  styleUrls: ['event-calendar-header.scss'],
  templateUrl: 'event-calendar-header.html',
  exportAs: 'matCalendarHeader',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
    { provide: DateAdapter, useClass: NativeDateAdapter }
  ]
})
export class CMCalendarHeader<D> {
  constructor (private _intl: MatDatepickerIntl,
              @Inject(forwardRef(() => CMMatCalendar)) public calendar: CMMatCalendar<D>,
              @Optional() public _dateAdapter: DateAdapter<D>,
              @Optional() @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats,
              changeDetectorRef: ChangeDetectorRef) {

    this.calendar.stateChanges.subscribe(() => changeDetectorRef.markForCheck());
  }

  get periodLabel () {
    return this._dateAdapter.format(this.calendar.activeDate,
      this._dateFormats.display.monthYearA11yLabel).toLocaleUpperCase();
  }

  /* Handles user clicks on the previous button. */
  previousClicked (): void {
    this.calendar.activeDate = this._dateAdapter.addCalendarMonths(this.calendar.activeDate, -1);
    if (this._dateAdapter.getYear(this.calendar.activeDate) !== this.calendar.currentYear) {
      this.calendar.changeYear(0);
    } else {
      this.calendar.getCountContractsByMonthChangeMonth(this._dateAdapter.getMonth(this.calendar.activeDate));
    }
  }

  /* Handles user clicks on the next button. */
  nextClicked (): void {
    this.calendar.activeDate = this._dateAdapter.addCalendarMonths(this.calendar.activeDate, 1);
    if (this._dateAdapter.getYear(this.calendar.activeDate) !== this.calendar.currentYear) {
      this.calendar.changeYear(0);
    } else {
      this.calendar.getCountContractsByMonthChangeMonth(this._dateAdapter.getMonth(this.calendar.activeDate));
    }
  }
}

/* A calendar that is used as part of the datepicker. */
@Component({
  moduleId: module.id,
  selector: 'cm-event-calendar',
  templateUrl: 'event-calendar.component.html',
  styleUrls: ['event-calendar.component.scss'],
  host: {
    'class': 'mat-calendar'
  },
  exportAs: 'matCalendar',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
    { provide: DateAdapter, useClass: NativeDateAdapter }
  ]
})
export class CMMatCalendar<D> implements AfterContentInit, AfterViewChecked, OnDestroy, OnChanges {
  /* Date selected by user(initial value is current date) */
  selectedDate = new Date(new Date().setHours(0,0,0,0));

  /* Possible colors for detecting different events.
    Name of colors is used as css classes for dots and list of events.*/
  colors = ['orange', 'black', 'green', 'purple', 'blue', 'red'];

  /* Index of color for first event in list of events */
  startColor = 0;

  months = ['jan', 'feb', 'mar', 'apr','may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

  /* Number of events for each month */
  monthEvents = {
    'jan': 0, 'feb': 0, 'mar': 0, 'apr': 0, 'may': 0, 'jun': 0,
    'jul': 0, 'aug': 0, 'sep': 0, 'oct': 0, 'nov': 0, 'dec': 0
  };

  /* Classes for each day. Every class shows which dot will be shown below particular day of month. */
  dayClasses = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0,
    11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0,
    21: 0, 22: 0, 23: 0, 24: 0, 25: 0, 26: 0, 27: 0, 28: 0, 29: 0, 30: 0,
    31: 0
  };

  /* Events that are shown in list of events. */
  events = [];

  today = new Date();
  currentMonth = this.today.getMonth();
  currentYear: number = this.today.getFullYear();

  /* An input indicating the type of the header component, if set. */
  @Input() headerComponent: ComponentType<any>;

  /* A portal containing the header component type for this calendar. */
  _calendarHeaderPortal: Portal<any>;

  private _intlChanges: Subscription;

  /*
   * Used for scheduling that focus should be moved to the active cell on the next tick.
   * We need to schedule it, rather than do it immediately, because we have to wait
   * for Angular to re-evaluate the view children.
   */
  private _moveFocusOnNextTick = false;

  /* A date representing the period (month or year) to start the calendar in. */
  @Input()
  get startAt (): D | null { return this._startAt; }
  set startAt (value: D | null) {
    this._startAt = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
  }
  private _startAt: D | null;

  /* Whether the calendar should be started in month view. (There can be another type of views) */
  @Input() startView: MatCalendarView = 'month';

  /* The currently selected date. */
  @Input()
  get selected (): D | null { return this._selected; }
  set selected (value: D | null) {
    this._selected = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
  }
  private _selected: D | null;

  /* The minimum selectable date. */
  @Input()
  get minDate (): D | null { return this._minDate; }
  set minDate (value: D | null) {
    this._minDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
  }
  private _minDate: D | null;

  /* The maximum selectable date. */
  @Input()
  get maxDate (): D | null { return this._maxDate; }
  set maxDate (value: D | null) {
    this._maxDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
  }
  private _maxDate: D | null;

  /* Function used to filter which dates are selectable. */
  @Input() dateFilter: (date: D) => boolean;

  dateClass = (d: Date) => {
    let selected = this.selectedDate.setHours(0,0,0,0) === d.setHours(0,0,0,0) ? 'selected ' : undefined;
    return (selected ? selected : '') + (this.dayClasses && this.dayClasses[d.getDate()] ?
      'mat-calendar-body-cell-dots-show ' + this.dayClasses[d.getDate()]
      : '');
  }

  /* Emits when the currently selected date changes. */
  @Output() readonly selectedChange: EventEmitter<D> = new EventEmitter<D>();

  /*
   * Emits the year chosen in multiyear view. (We don't have this type of view)
   * This doesn't imply a change on the selected date.
   */
  @Output() readonly yearSelected: EventEmitter<D> = new EventEmitter<D>();

  /*
   * Emits the month chosen in year view. (We dont't have this type of view)
   * This doesn't imply a change on the selected date.
   */
  @Output() readonly monthSelected: EventEmitter<D> = new EventEmitter<D>();

  /* Emits when any date is selected. */
  @Output() readonly _userSelection: EventEmitter<void> = new EventEmitter<void>();

  /* Reference to the current month view component. */
  @ViewChild(CMMonthView) monthView: CMMonthView<D>;

  /*
   * The current active date. This determines which time period is shown and which date is
   * highlighted when using keyboard navigation.
   */
  get activeDate (): D { return this._clampedActiveDate; }
  set activeDate (value: D) {
    this._clampedActiveDate = this._dateAdapter.clampDate(value, this.minDate, this.maxDate);
    this.stateChanges.next();
  }
  private _clampedActiveDate: D;

  /* Whether the calendar is in month view. */
  get currentView (): MatCalendarView { return this._currentView; }
  set currentView (value: MatCalendarView) {
    this._currentView = value;
    this._moveFocusOnNextTick = true;
  }
  private _currentView: MatCalendarView;

  /*
   * Emits whenever there is a state change that the header may need to respond to.
   */
  stateChanges = new Subject<void>();

  constructor (_intl: MatDatepickerIntl,
              @Optional() public _dateAdapter: DateAdapter<D>,
              @Optional() @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats,
              private _changeDetectorRef: ChangeDetectorRef,
              private eventCalendarService: EventCalendarService,
              private router: Router) {

    this.getCountContractsByYear(this.currentYear);
    this.getCountContractsByMonthChangeMonth(this.currentMonth);

    if (!this._dateAdapter) {
      throw createMissingDateImplError('DateAdapter');
    }

    if (!this._dateFormats) {
      throw createMissingDateImplError('MAT_DATE_FORMATS');
    }
    this._intlChanges = _intl.changes.subscribe(() => {
      _changeDetectorRef.markForCheck();
      this.stateChanges.next();
    });
  }

  ngAfterContentInit () {
    this._calendarHeaderPortal = new ComponentPortal(this.headerComponent || CMCalendarHeader);
    this.activeDate = this.startAt || this._dateAdapter.today();

    // Assign to the private property since we don't want to move focus on init.
    this._currentView = this.startView;
  }

  ngAfterViewChecked () {
    if (this._moveFocusOnNextTick) {
      this._moveFocusOnNextTick = false;
      this.focusActiveCell();
    }
  }

  ngOnDestroy () {
    this._intlChanges.unsubscribe();
    this.stateChanges.complete();
  }

  ngOnChanges (changes: SimpleChanges) {
    const change = changes.minDate || changes.maxDate || changes.dateFilter;

    if (change && !change.firstChange) {
      const view = this._getCurrentViewComponent();

      if (view) {
        // We need to `detectChanges` manually here, because the `minDate`, `maxDate` etc. are
        // passed down to the view via data bindings which won't be up-to-date when we call `_init`.
        this._changeDetectorRef.detectChanges();
        view._init();
      }
    }

    this.stateChanges.next();
  }

  focusActiveCell () {
    this._getCurrentViewComponent()._focusActiveCell();
  }

  /* Updates today's date after an update of the active date */
  updateTodaysDate () {
    let view = this.monthView;

    view.ngAfterContentInit();
  }

  getCountContractsByYear (year: number) {
    const params = new HttpParams().set('year', `${year}`);
    this.eventCalendarService.countContractsByYearGroupByMonth(params).subscribe(
      (data: any) => {
        if (data.length > 0) {
          delete data[0]._id;
          this.monthEvents = data[0];
          this._changeDetectorRef.detectChanges();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  changeYear (step: number) {
    this.currentYear = this._dateAdapter.getYear(this.activeDate) + step;
    this.currentMonth = this._dateAdapter.getMonth(this.activeDate);
    let value = new Date(this._dateAdapter.getYear(this.activeDate) + step, this.currentMonth, 1);

    this.activeDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));

    this.getCountContractsByYear(this.currentYear);
    this.getCountContractsByMonthChangeMonth(this.currentMonth);
  }

  getCountContractsByMonthChangeMonth (numOfMonth: number) {
    const params = new HttpParams()
    .set('year', `${this.currentYear}`)
    .set('month', `${numOfMonth + 1}`);
    this.eventCalendarService.countContractsByMonthAndYearGroupByDay(params).subscribe((data: any) => {
      if (data[0] && data[0]._id) {
        delete data[0]._id;
      }
      let numOfEvents = 0;
      if (data.length > 0) {
        Object.keys(data[0]).map(day => {
          if (data[0][day] !== 0) {
            let classesForDay = this.colors.slice(numOfEvents % this.colors.length,
              numOfEvents % this.colors.length + data[0][day]);

            if (classesForDay.length < data[0][day]) {
              classesForDay = classesForDay.concat(this.colors.slice(0, data[0][day] - classesForDay.length));
            }

            if (data[0][day] > 4) {
              classesForDay = classesForDay.slice(0,4);
              classesForDay.push('plus');
            }

            this.dayClasses[day] = classesForDay.join(' ');
            numOfEvents += data[0][day];
          } else {
            this.dayClasses[day] = '';
          }
        });
      }
      let value = new Date(this.currentYear, numOfMonth, 1);
      this.currentMonth = numOfMonth;
      this.activeDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
      this._changeDetectorRef.detectChanges();
      this.getContractsByMonthYear(this.currentMonth, this.currentYear);
    });
  }

  showContract (id) {
    let base = SessionService.get('base-role');
    this.router.navigate([base + '/contract-list', { 'search': 'ID', 'searchParam': id }]).then(nav => {
      console.log(nav);
    }, err => {
      console.log(err);
    });
  }

  getContractsByDate () {
    const queryParams = new HttpParams().set('selectedDate', `${this.selectedDate}`);
    this.eventCalendarService.findContractsByDate(queryParams).subscribe((data: any) => {
      if (this.dayClasses[this.selectedDate.getDate()] && this.dayClasses[this.selectedDate.getDate()] !== 0) {
        this.startColor = this.colors.indexOf(this.dayClasses[this.selectedDate.getDate()].split(' ')[0]);
      }
      this.events = data;
      this._changeDetectorRef.detectChanges();
    }, (error) => {
      console.log(error);
    });
  }

  getContractsByMonthYear (numOfMonth: number, numOfYear: number) {
    const queryParams = new HttpParams()
    .set('year', `${numOfYear}`)
    .set('month', `${numOfMonth + 1}`);
    this.eventCalendarService.findContractsByMonthYear(queryParams).subscribe((data: any) => {
      if (this.dayClasses[this.selectedDate.getDate()] && this.dayClasses[this.selectedDate.getDate()] !== 0) {
        this.startColor = this.colors.indexOf(this.dayClasses[this.selectedDate.getDate()].split(' ')[0]);
      }
      this.events = data;
      this._changeDetectorRef.detectChanges();
    });
  }

  /* Handles date selection in the month view. */
  _dateSelected (date: D): void {
    // @ts-ignore
    this.selectedDate = new Date(date as Date);
    if (!this._dateAdapter.sameDate(date, this.selected)) {
      this.selectedChange.emit(date);
    }

    this.getContractsByDate();

    this.activeDate = this._getValidDateOrNull(this._dateAdapter.deserialize(this.selectedDate));
    this._changeDetectorRef.detectChanges();
  }

  /* Handles year selection in the multiyear view. */
  _yearSelectedInMultiYearView (normalizedYear: D) {
    this.yearSelected.emit(normalizedYear);
  }

  /* Handles month selection in the year view. */
  _monthSelectedInYearView (normalizedMonth: D) {
    this.monthSelected.emit(normalizedMonth);
  }

  _userSelected (): void {
    this._userSelection.emit();
  }

  /* Handles year/month selection in the multi-year/year views. */
  _goToDateInView (date: D, view: 'month'): void {
    this.activeDate = date;
    this.currentView = view;
  }

  /**
   * @param obj The object to check.
   * @returns The given object if it is both a date instance and valid, otherwise null.
   */
  private _getValidDateOrNull (obj: any): D | null {
    return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
  }

  /* Returns the component instance that corresponds to the current calendar view. */
  private _getCurrentViewComponent () {
    return this.monthView;
  }
}
