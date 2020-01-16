import { Component, OnInit, ViewChild, TemplateRef, Input, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef, Output, EventEmitter, ElementRef } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { NotificationListService } from './notification-list.service';
import { ToastrService } from 'ngx-toastr';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { HashMap } from '@nebtex/hashmaps';
import { Router } from '@angular/router';
import { startOfDay } from 'date-fns';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { Subject, ReplaySubject } from 'rxjs';
import { take, takeUntil, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DateAdapter, MAT_DATE_LOCALE, MAT_TOOLTIP_DEFAULT_OPTIONS, MatDatepicker, MatDialog } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { SessionService } from '../shared/providers/session.service';
import { customTooltipDefaults } from 'src/app/models/constants';
import { PopUpComponent } from '../pop-up/pop-up.component';
import { ContractService } from '../contracts/contracts.service';
import { DateAdapter as DateAdapterCalendar } from '../../../../node_modules/angular-calendar/date-adapters/date-adapter';
import { StorageService } from '../shared/providers/storage.service';
import { FormControl } from '@angular/forms';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL'
  },
  display: {
    dateInput: 'MM - DD - YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM Do YYYY'
  }
};

interface NotificationEvent extends CalendarEvent {
  contract_name: string;
}

const PRIMARY: string = 'primary';
const SECONDARY: string = 'secondary';

@Component({
  selector: 'cm-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: DateAdapterCalendar, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: customTooltipDefaults }
  ]
})
export class NotificationListComponent implements OnInit {

  @ViewChild(DatatableComponent) datatable: DatatableComponent;
  @ViewChild('actionColumnTemplate') actionColumnTemplate: TemplateRef<any>;
  @ViewChild('dateColumnTemplate') dateColumnTemplate: TemplateRef<any>;
  @ViewChild('sortableHeaderTemplateInput') sortableHeaderTemplateInput: TemplateRef<any>;
  @ViewChild('sortableHeaderTemplateSelectCategories') sortableHeaderTemplateSelectCategories: TemplateRef<any>;
  @ViewChild('sortableHeaderTemplateSelectReminderStatus') sortableHeaderTemplateSelectReminderStatus: TemplateRef<any>;
  @ViewChild('sortableHeaderTemplateEventDate') sortableHeaderTemplateEventDate: TemplateRef<any>;
  @ViewChild('sortableHeaderTemplateReminderStartDate') sortableHeaderTemplateReminderStartDate: TemplateRef<any>;
  @ViewChild('sortableHeaderTemplateReminderEndDate') sortableHeaderTemplateReminderEndDate: TemplateRef<any>;
  @ViewChild('reminderStatusColumnTemplate') reminderStatusColumnTemplate: TemplateRef<any>;
  @ViewChild('textHeaderTemplate') textHeaderTemplate: TemplateRef<any>;
  @ViewChild('textColumnTemplate') textColumnTemplate: TemplateRef<any>;
  @ViewChild('chkBxTmpl') chkBxTmpl: TemplateRef<any>;
  @ViewChild('chkBxTmplCell') chkBxTmplCell: TemplateRef<any>;

  @Input() inputDatePicker: any;
  selectedCategories: string = '-1';
  selectedReminderStatus: string = '-1';

  @ViewChild('reminderStartDatePicker') reminderStartDatePicker: MatDatepicker<any>;
  @ViewChild('reminderEndDatePicker') reminderEndDatePicker: MatDatepicker<any>;
  @ViewChild('eventDatePicker') eventDatePicker: MatDatepicker<any>;

  @Output() viewChange: EventEmitter<string> = new EventEmitter();

  @Output() viewDateChange: EventEmitter<Date> = new EventEmitter();

  protected _onDestroy = new Subject<void>();

  isLoadingDataTable: boolean = true;
  watchCurrentDate: boolean = false;
  currentView: string = PRIMARY;
  show: Boolean;
  periodMonthLabel: string;
  currentDate: any;
  viewAlt: string = 'month';
  arrayCategories: Array<any> = [];
  arrayReminderStatuses: Array<any> = [];

  columnsTable: Array<any> = [];
  customizeColumns: Array<any> = [];

  headerCheckBox: boolean = false;

  tempRowsTable: Array<any> = [];
  rowsTable: Array<any> = [];

  colorIndex: number = 0;

  alocatedDay;

  flagForWeekView = false;

  disableBellButton = true;

  customizeMenuFilter: FormControl = new FormControl();
  customizeMenuSelect: FormControl = new FormControl();
  public filteredColumnsMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  columnListFromExela: any[] = [];

  myMessages: any = {
    'emptyMessage': '<img src="../../../../assets/images/no_data_found.png">',
    'totalMessage': 'Displaying item '
  };

  breadcrumbs: Array<any> = [
    {
      text: 'Notification',
      link: '/notification/notification-list',
      base: true,
      active: true
    }
  ];

  pageTable: any = {
    limit: 10,
    count: 0,
    offset: 0,
    orderBy: '',
    sortDirection: '',
    hashMapPropNameFilterSearch: new HashMap()
  };

  public readonly pageLimitOptions: any = [
    { value: 10 },
    { value: 20 },
    { value: 30 },
    { value: 40 },
    { value: 50 }
  ];

  constructor (
    private router: Router,
    private notificationListService: NotificationListService,
    private toastr: ToastrService,
    private matDialog: MatDialog,
    private contractService: ContractService,
    private cdr: ChangeDetectorRef,
    private dateAdapterCalendar: DateAdapterCalendar,
    private elRef: ElementRef
    ) {

    this.currentDate = moment();

  }

  // ngAfterViewChecked () {
  //   this.cdr.detectChanges();
  // }

  async ngOnInit () {
    this.show = this.currentView === PRIMARY;
    this.columnListFromExela = await this.getColumnsFromExelaAuth();
    this.colorIndex = 0;
    this.getIndex();
    this.initDataTable();
    this.pageCallback({ offset: 0 });
    this.inputDatePicker = moment();
    this.periodMonthLabel = this.currentDate.format('MMMM') + ' ' + this.currentDate.format('YYYY');
    this.getAllContractsCategories();
    this.getReminderStatuses();
    if (this.columnListFromExela) {
      this.customizeMenuSelect.setValue(this.customizeColumns.filter(column => {
        return this.columnListFromExela.indexOf(column.name) > -1;
      }));
    } else {
      this.customizeMenuSelect.setValue(this.customizeColumns);
    }
    this.filteredColumnsMulti.next(this.customizeColumns.filter(p => p.name).slice());

    this.customizeMenuFilter.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
      this.filterColumns();
    });
  }

  getAllContractsCategories () {
    this.contractService.getClientCategories().subscribe((res: any) => {
      this.arrayCategories = res;
    });
  }

  getReminderStatuses () {
    this.notificationListService.getReminderStatuses().subscribe((res: any) => {
      this.arrayReminderStatuses = res;
    });
  }

  initDataTable () {
    this.columnsTable = [
      {
        name: '',
        prop: 'chcbox',
        sortable: false,
        resizeable: false,
        cellTemplate: this.chkBxTmplCell,
        headerTemplate: this.chkBxTmpl,
        minWidth: 55,
        maxWidth: 55
      },
      {
        name: 'EVENT NAME',
        customizeName: 'Event Name',
        prop: 'title',
        searchName: 'title',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplateInput,
        cellTemplate: this.textColumnTemplate,
        resizeable: false,
        minWidth: 120
      },
      {
        name: 'EVENT DATE',
        prop: 'date',
        customizeName: 'Event Date',
        searchName: 'eventDate',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplateEventDate,
        cellTemplate: this.dateColumnTemplate,
        resizeable: false,
        minWidth: 80
      },
      {
        name: 'TYPE',
        prop: 'type.name',
        customizeName: 'Type',
        searchName: 'typeName',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplateInput,
        cellTemplate: this.textColumnTemplate,
        resizeable: false,
        minWidth: 100
      },
      {
        name: 'CONTRACT',
        prop: 'linked_contract.title',
        customizeName: 'Contract',
        searchName: 'contractTitle',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplateInput,
        cellTemplate: this.textColumnTemplate,
        resizeable: false,
        minWidth: 120
      },
      {
        name: 'BUSINESS PARTNER',
        customizeName: 'Business Partner',
        prop: 'business_partner.name',
        searchName: 'businessPartnerName',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplateInput,
        cellTemplate: this.textColumnTemplate,
        resizeable: false,
        minWidth: 140
      },
      {
        name: 'REMINDER START DATE',
        prop: 'reminder.start_date',
        customizeName: 'Reminder Start Date',
        searchName: 'reminderStartDate',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplateReminderStartDate,
        cellTemplate: this.dateColumnTemplate,
        resizeable: false,
        minWidth: 150
      },
      {
        name: 'REMINDER END DATE',
        prop: 'reminder.end_date',
        customizeName: 'Reminder End Date',
        searchName: 'reminderEndDate',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplateReminderEndDate,
        cellTemplate: this.dateColumnTemplate,
        resizeable: false,
        minWidth: 140
      },
      {
        name: 'REMINDER STATUS',
        customizeName: 'Reminder Status',
        prop: 'reminder.reminder_status.name',
        filterCode: 'reminderStatusName',
        searchName: 'reminderStatusName',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplateSelectReminderStatus,
        cellTemplate: this.reminderStatusColumnTemplate,
        resizeable: false,
        minWidth: 140
      },
      {
        name: 'CONTRACT OWNER',
        prop: 'linked_contract.owner',
        customizeName: 'Contract Owner',
        searchName: 'contractOwner',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplateInput,
        cellTemplate: this.textColumnTemplate,
        resizeable: false,
        minWidth: 120
      },
      {
        name: 'CONTRACT CATEGORY',
        customizeName: 'Contract Category',
        prop: 'linked_contract.category.name',
        filterCode: 'categoryName',
        searchName: 'categoryName',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplateSelectCategories,
        cellTemplate: this.textColumnTemplate,
        resizeable: false,
        minWidth: 140
      },
      {
        name: 'DESCRIPTION',
        customizeName: 'Description',
        prop: 'description',
        searchName: 'description',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplateInput,
        cellTemplate: this.textColumnTemplate,
        resizeable: false,
        minWidth: 110
      },
      {
        name: 'ACTION',
        customizeName: 'Action',
        prop: 'action',
        sortable: false,
        cellTemplate: this.actionColumnTemplate,
        headerTemplate: this.textHeaderTemplate,
        resizeable: false,
        minWidth: 80,
        maxWidth: 136
      }];
    this.customizeColumns = this.columnsTable;
    if (this.columnListFromExela) {
      this.columnsTable = this.columnsTable.filter(column => {
        return this.columnListFromExela.indexOf(column.name) > -1;
      });
    } else {
      let userAttributes = [];
      let columnNames = this.columnsTable.map(column => {
        return column.name;
      });
      userAttributes.push({ att_name: 'contract-list-columns', att_value: columnNames });
      this.notificationListService.addOrUpdateAttribute(StorageService.get(StorageService.userId), userAttributes);
    }
  }

  pageCallback (
    pageInfo: {
      count?: number,
      pageSize?: number,
      limit?: number,
      offset?: number
    }) {
    this.pageTable.offset = pageInfo.offset;
    this.reloadTableData();
  }

  sortCallback (
    sortInfo:
    {
      sorts: {
        dir: string,
        prop: string }[],
      column: {},
      prevValue: string,
      newValue: string
    }) {
    this.pageTable.sortDirection = sortInfo.sorts[0].dir;
    this.pageTable.orderBy = sortInfo.sorts[0].prop;
    this.pageTable.offset = 0;
    this.reloadTableData();
  }

  onLimitChange (value) {
    this.pageTable.limit = value;
    this.pageTable.offset = 0;
    this.reloadTableData();
  }

  onInputPageChange (value) {
    if (value === '') {
      this.pageTable.offset = 0;
      this.reloadTableData();
    } else if (isNaN(value)) {
      this.toastr.error(
        'Error',
        'You can only enter numeric'
      );
    } else {
      const numberPages = Math.ceil(this.datatable.rowCount / this.datatable.limit);
      if (numberPages >= value && value > 0) {
        this.pageTable.offset = value - 1;
        this.reloadTableData();
      } else {
        this.toastr.error(
          'Error',
          'Page that you enter does not exist!'
        );
      }
    }
  }

  reloadTableData () {
    this.isLoadingDataTable = true;

    // Table properites
    let queryParams = new HttpParams();
    if (this.pageTable.orderBy !== '') {
      queryParams = queryParams.set('orderBy', `${this.pageTable.orderBy}`);
    }
    if (this.pageTable.sortDirection !== '') {
      queryParams = queryParams.set('sortDirection', `${this.pageTable.sortDirection}`);
    }
    queryParams = queryParams.set('pageNumber', `${this.pageTable.offset + 1}`);
    queryParams = queryParams.set('pageSize', `${this.pageTable.limit}`);

    // Filter part
    this.pageTable.hashMapPropNameFilterSearch.forEach((value, key) => {
      queryParams = queryParams.set(`${key}`, `${value}`);
    });

    if (this.watchCurrentDate === false) {
      // Date part - Month
      let dateHolder: string = this.currentDate.format('YYYY-MM-DD');

      queryParams = queryParams.set('eventStartBetweenDate', `${moment(dateHolder).startOf('month').format('YYYY-MM-DD')}`);
      queryParams = queryParams.set('eventEndBetweenDate', `${moment(dateHolder).endOf('month').format('YYYY-MM-DD')}`);
    } else if (this.watchCurrentDate) {
      // Date part - Today
      queryParams = queryParams.set('eventDate', `${this.inputDatePicker.format('YYYY-MM-DD')}`);
    }

    if (queryParams.get('orderBy') === undefined) {
      queryParams = queryParams.set('orderBy', 'date');
    }
    if (queryParams.get('sortDirection') === undefined) {
      queryParams = queryParams.set('sortDirection', 'asc');
    }

    this.notificationListService.searchNotifications(queryParams).then((data: any) => {
      this.rowsTable = data.docs;
      this.rowsTable.forEach(item => {
        item.checked = false;
      });
      this.pageTable.count = data.totalDocs;
      this.isLoadingDataTable = false;
    }).catch();
  }

  // --- START Table customize columns ---
  isCheckedToggleColumn (col) {
    return this.columnsTable.find(c => {
      return c.prop === col.prop;
    });
  }

  isSelected (col) {
    let a = this.columnsTable.indexOf(col) >= 0;
    return a;
  }

  toggleColumns (col) {
    const isChecked = this.isSelected(col);
    if (isChecked) {
      this.columnsTable = this.columnsTable.filter(c => {
        return c.name !== col.name;
      });
    } else {
      const newColumns = [...this.columnsTable, col];
      this.columnsTable = [];
      this.customizeColumns.forEach((f) => {
        newColumns.forEach((s) => {
          if (s.name === f.name) {
            this.columnsTable.push(f);
            // this.columnsTable = [...this.columnsTable];
          }
        });
      });
    }
    let userAttributes = [];
    let columnNames = this.columnsTable.map(column => {
      return column.name;
    });
    userAttributes.push({ att_name: 'notification-list-columns', att_value: columnNames });
    this.notificationListService.addOrUpdateAttribute(StorageService.get(StorageService.userId), userAttributes);
  }

  protected filterColumns () {
    if (!this.customizeColumns) {
      return;
    }
    // get the search keyword
    let search = this.customizeMenuFilter.value;
    if (!search) {
      this.filteredColumnsMulti.next(this.customizeColumns.filter(item => item.customizeName));
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the columns
    this.filteredColumnsMulti.next(
      this.customizeColumns.filter(col => {
        if (col.customizeName) {
          return col.customizeName.toLowerCase().indexOf(search) > -1;
        }
      })
    );
  }
  // --- END Table customize columns ---

  // --- START Table filter each column ---
  filterDate (event, propName): void {
    if (event.target.value) {
      this.actionChangeHashMapPropNameFilterSearch(event.target.value.format('YYYY-MM-DD'), propName);
      this.pageTable.offset = 0;
      this.watchCurrentDate = undefined;
      this.reloadTableData();
    }
    // this.actionChangeHashMapPropNameFilterSearch(event.target.value !== null ? event.target.value.format('YYYY-MM-DD') : '-1', propName);
  }

  filterCallback (event, propName): void {
    let searchPropValue = propName.includes('Code') ?
    event.target.value : event.target.value.toString().toLowerCase();

    this.actionChangeHashMapPropNameFilterSearch(searchPropValue, propName);

    this.pageTable.offset = 0;
    this.reloadTableData();
  }

  actionChangeHashMapPropNameFilterSearch (searchPropValue, propName): void {
    if (this.pageTable.hashMapPropNameFilterSearch.has(propName)) {
      if (searchPropValue !== '-1') {
        this.pageTable.hashMapPropNameFilterSearch.set(propName, searchPropValue);
      } else {
        this.pageTable.hashMapPropNameFilterSearch.delete(propName);
      }
    } else {
      this.pageTable.hashMapPropNameFilterSearch.set(propName, searchPropValue);
    }
  }
  // --- END Table filter each column ---

  changeStatusNotification (row: any): void {
    let pomRow = row;
    pomRow.send_notification = !pomRow.send_notification;
    pomRow.reminder.reminder_status = pomRow.reminder.reminder_status.code;
    let objectData = {
      data: pomRow
    };
    let urlParams = {
      notificationid: `${pomRow._id}`
    };
    this.notificationListService.updateNotification(objectData, urlParams).subscribe((response: any) => {
      if (response.msg != null && response.msg === 'Failed') {
        this.toastr.error('Error', 'Something went wrong');
      } else {
        this.toastr.success('Operation Complete', 'Notification successfully updated');
        this.reloadTableData();
      }
    });
  }

  changeStatusNotifications (): void {
    if (this.rowsTable.filter(row => row.checked === true).length === 0) {
      alert('Please select at least one row!');
    } else {
      let pomSelectedRowsTable = this.rowsTable.filter(row => row.checked === true);
      pomSelectedRowsTable = pomSelectedRowsTable.map(function (elementArray: any) {
        elementArray.send_notification = !elementArray.send_notification;
        return elementArray;
      });
      let objectArrayData = [...pomSelectedRowsTable];
      let objectsData = JSON.parse(JSON.stringify({ notifications : objectArrayData }));
      this.notificationListService.updateNotifications(objectsData).subscribe((response: any) => {
        if (response.status === '500') {
          this.toastr.error('Error','Notifications not updated!!!');
        } else {
          this.toastr.success('Operation Complete','Notifications successfully updated');
          this.reloadTableData();
        }
      });
    }
  }

  openDialogForDeleteConfirmation (row) {
    if (row === undefined) {
      if (this.rowsTable.filter(row => row.checked === true).length === 0) {
        alert('Please select atleast one row!');
        return;
      }
    }
    let data = {
      'message': 'Are you sure you want to delete?',
      'heading': 'Delete Notifications',
      'row': row,
      'component': 'notification',
      'yes': 'Yes',
      'no': 'Cancel'
    };

    const dialogRef = this.matDialog.open(PopUpComponent, {
      width: '450px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result && result.row && result.component === 'notification') {
          setTimeout(() => {
            this.deleteNotification(result.row).then().catch();
          },0);
        } else if (result && result.component === 'notification') {
          setTimeout(() => {
            this.deleteNotifications().then().catch();
          },0);
        }
      }
    });
  }

  async deleteNotification (row: any) {
    let urlParams = `${row._id}`;
    let isDeleted = await this.notificationListService.deleteNotification(urlParams);
    if (isDeleted) {
      this.toastr.success('Operation complete', 'Notification successfully deleted');
      this.reloadTableData();
    } else {
      this.toastr.error('Error', 'Notifications not deleted!!!');
    }
  }

  async deleteNotifications () {
    if (this.rowsTable.filter(row => row.checked === true).length === 0) {
      alert('Please select atleast one row!');
    } else {
      const notificationsIds = this.rowsTable.filter(row => row.checked === true).map(notif => notif._id).join(',');
      const params = new HttpParams()
        .set('notificationsIds', `${notificationsIds}`);
      await this.notificationListService.deleteNotifications(params).toPromise().then((response: any) => {
        if (response.status === '500') {
          this.toastr.error('Error','Notifications not deleted!!!');
        } else {
          this.toastr.success('Operation Complete ','Notifications successfully deleted');
          this.reloadTableData();
        }
      }).catch();
    }
  }

  navigateAddNotification (): void {
    let base = SessionService.get('base-role');
    this.router.navigate(['/' + base + '/notification/0']).then(nav => {
      console.log(nav);
    }, err => {
      console.log(err);
    });
  }

  editNotification (row): void {
    let base = SessionService.get('base-role');
    this.router.navigate(['/' + base + '/notification/' + row._id]).then(nav => {
      console.log(nav);
    }, err => {
      console.log(err);
    });
  }

  onSelect (selected) {
    this.headerCheckBox = selected.checked;
    this.rowsTable.forEach(row => {
      row.checked = selected.checked;
    });
    this.rowsTable = [...this.rowsTable];
  }

  onSelectCell (selected, row: any) {
    this.rowsTable[this.rowsTable.indexOf(row)].checked = selected.checked;
    if (selected.checked) {

      if (this.rowsTable.length === this.rowsTable.filter(oneRow => { return oneRow.checked === true; }).length) {
        this.headerCheckBox = true;
      }
    } else {
      this.headerCheckBox = false;
    }
  }

  setToday (): void {
    this.watchCurrentDate = true;
    this.currentDate = moment();
    this.periodMonthLabel = this.currentDate.format('MMMM') + ' ' + this.currentDate.format('YYYY');
    this.reloadTableData();
    if (this.currentView === SECONDARY) {
      this.watchCurrentDate = false;
      // tslint:disable-next-line: no-floating-promises
      this.reloadCalendarData();
    }
  }

  onChoosenDate (event): void {
    this.inputDatePicker = moment(event);
    this.currentDate = moment(event);
    this.periodMonthLabel = moment(event).format('MMMM') + ' ' + moment(event).format('YYYY');
    if (this.currentView === PRIMARY) {
      this.watchCurrentDate = true;
      this.reloadTableData();
    } else {
      this.watchCurrentDate = false;
      // tslint:disable-next-line: no-floating-promises
      this.reloadCalendarData();
    }
  }

  changeView (newView): void {
    if (this.currentView !== PRIMARY && newView === PRIMARY) {
      this.watchCurrentDate = true;
      if (this.viewAlt === 'week') {
        this.viewAlt = 'month';
        this.flagForWeekView = true;
      }
      this.watchCurrentDate = false;
      this.reloadTableData();
    } else if (this.currentView !== SECONDARY && newView === SECONDARY) {
      this.watchCurrentDate = false;
      if (this.flagForWeekView) {
        this.viewAlt = 'week';
        this.flagForWeekView = false;
      }
      // tslint:disable-next-line: no-floating-promises
      this.reloadCalendarData();
    }
    this.currentView = newView;
    this.show = this.currentView === PRIMARY;
  }

  // --- START Pick month ---
  async nextMonth () {
    this.watchCurrentDate = false;
    if (this.viewAlt === 'month') {
      this.currentDate.add(1, 'M');
    } else {
      this.currentDate.add(1, 'w');
    }
    this.periodMonthLabel = this.currentDate.format('MMMM') + ' ' + this.currentDate.format('YYYY');
    if (this.currentView === PRIMARY) {
      this.reloadTableData();
    } else {
      await this.reloadCalendarData();
    }
  }

  async previousMonth () {
    this.watchCurrentDate = false;
    if (this.viewAlt === 'month') {
      this.currentDate.subtract(1, 'M');
    } else {
      this.currentDate.subtract(1, 'w');
    }
    this.periodMonthLabel = this.currentDate.format('MMMM') + ' ' + this.currentDate.format('YYYY');
    if (this.currentView === PRIMARY) {
      this.reloadTableData();
    } else {
      await this.reloadCalendarData();
    }
  }

  today = new Date();
  currentMonthVar = this.today.getMonth();
  currentYear: number = this.today.getFullYear();

  colors = ['orange', 'black', 'green', 'purple', 'blue', 'red'];

  dayClasses = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0,
    11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0,
    21: 0, 22: 0, 23: 0, 24: 0, 25: 0, 26: 0, 27: 0, 28: 0, 29: 0, 30: 0,
    31: 0
  };

  selectedDate = new Date(new Date().setHours(0,0,0,0));

  currentMonth (): void {
    this.watchCurrentDate = false;
    if (this.currentView === PRIMARY) {
      this.reloadTableData();
    } else {
      // tslint:disable-next-line: no-floating-promises
      this.reloadCalendarData();
    }
  }
  // --- END Pick month ---

  // --- Start calendar ---
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  events: NotificationEvent[] = [];
  refresh: Subject<any> = new Subject();

  async reloadCalendarData () {
    // Table properites
    let queryParams = new HttpParams();

    if (!this.watchCurrentDate) {
      // Date part - Month
      let dateHolder: string = this.currentDate.format('YYYY-MM-DD');

      queryParams = queryParams.set('eventStartBetweenDate', `${moment(dateHolder).startOf('month').format('YYYY-MM-DD')}`);
      queryParams = queryParams.set('eventEndBetweenDate', `${moment(dateHolder).endOf('month').format('YYYY-MM-DD')}`);
    } else {
      // Date part - Today
      queryParams = queryParams.set('eventDate', `${this.inputDatePicker.toDate()}`);
    }

    queryParams = queryParams.set('orderBy', 'date');
    queryParams = queryParams.set('sortDirection', 'asc');

    await this.notificationListService.searchNotifications(queryParams).then(async (response: any) => {
      this.events = [];
      let eventsRows = response.docs;

      eventsRows.forEach(element => {
        this.events.push(
          {
            id: element._id,
            start: startOfDay(new Date(element.date)),
            title: element.title,
            contract_name: element.linked_contract.title
          }
          );
        this.refresh.next();
      });

      let firstDateInADay: Date;

      let multiplier = 2;

      // this.events.map((event: any) => {
      //   if (firstDateInADay !== undefined && moment(firstDateInADay).isSame(event.start)) {
      //     event.start = moment(event.start).add(multiplier, 'hours').toDate();
      //     multiplier += 2;
      //   } else {
      //     multiplier = 2;
      //     firstDateInADay = event.start;
      //   }
      // });
      const queryParams = new HttpParams()
        .set('year', `${this.currentDate.year()}`)
        .set('month', `${this.currentDate.month() + 1}`);
      await this.notificationListService.countNotificationsByMonthAndYearGroupByDay(queryParams).then((data: any) => {
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

              this.dayClasses[day] = classesForDay.join(' ');
              numOfEvents += data[0][day];
            } else {
              this.dayClasses[day] = '';
            }
          });
        }
        for (let i = 0;i < this.events.length;i++) {
          let dateFromEvent: Date = this.events[i].start;
          if (this.dayClasses[dateFromEvent.getDate()].includes(' ')) {
            let rowOfDayClasses = this.dayClasses[dateFromEvent.getDate()].split(' ');
            for (let j = 0;j < rowOfDayClasses.length;j++) {
              this.events[i].color = rowOfDayClasses[j];
              if (j < rowOfDayClasses.length - 1) {
                i++;
              }
            }
          } else {
            this.events[i].color = this.dayClasses[dateFromEvent.getDate()];
          }
        }
      });

    });
  }
  // --- End calendar ---

  resetEventDatePicker (): void {
    this.eventDatePicker.select(undefined);
  }

  resetReminderStartDatePicker (): void {
    this.reminderStartDatePicker.select(undefined);
  }

  resetReminderEndDatePicker (): void {
    this.reminderEndDatePicker.select(undefined);
  }

  applyStyles (x, index) {
    // const styles = { 'height' : 100 / x + '%', 'border-bottom' : x > 0 && x > index + 1 ? '0.05rem solid white' : 'none' };
    const styles = { 'height' : '100%' };
    return styles;
  }

  convertToArray (value, splitBy) {
    if (value === 0) {
      return;
    } else {
      return value.split(splitBy);
    }
  }

  compareDates (calendarDate, pickedDate) {
    return new Date(calendarDate) === new Date(pickedDate);
  }

  formatDate (date: Date,format) {
    return moment(date).format(format);
  }

  alocateDayObject (day) {
    this.alocatedDay = day;
  }

  getIndex () {
    return this.colorIndex++;
  }

  changeViewAndRedirect (date) {
    this.watchCurrentDate = true;
    if (this.viewAlt === 'week') {
      this.viewAlt = 'month';
      this.flagForWeekView = true;
    }
    this.currentView = 'primary';
    this.inputDatePicker = moment(date);
    this.currentDate = moment(date);
    this.periodMonthLabel = moment(date).format('MMMM') + ' ' + moment(date).format('YYYY');
    this.reloadTableData();
  }

  resetAdvSearch () {
    this.watchCurrentDate = false;
    this.selectedCategories = '-1';
    this.selectedReminderStatus = '-1';
    this.inputDatePicker = moment();
    this.currentDate = moment();
    this.periodMonthLabel = this.currentDate.format('MMMM') + ' ' + this.currentDate.format('YYYY');
    if (this.eventDatePicker) this.resetEventDatePicker();
    if (this.reminderEndDatePicker) this.resetReminderEndDatePicker();
    if (this.reminderStartDatePicker) this.resetReminderStartDatePicker();
    this.clearAllDynamicInputs();
    this.pageTable.hashMapPropNameFilterSearch.clear();
    this.reloadTableData();
  }

  clearAllDynamicInputs () {
    const div = this.elRef.nativeElement.querySelectorAll('.src-filters');
    const myLength = div.length;
    for (let i = 0; i < myLength; i++) {
      div[i].value = '';
    }
  }

  async getColumnsFromExelaAuth () {
    let columns: any = await this.notificationListService.getAttributeForContractList();
    return columns !== undefined ? columns.att_value : undefined;
  }

}
