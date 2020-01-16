import {
  Component, OnInit, OnChanges, OnDestroy,
  Input, Output, EventEmitter, ContentChildren,
  QueryList, ElementRef, ViewChild, ViewChildren
} from '@angular/core';

import { ColumnsModel } from './ng-dt.models';

import { NgPaginationComponent } from './ng-pagination/ng-pagination.component';
import { StorageService } from '../../../../modules/shared/providers/storage.service';

import * as Sifter from './sifter';
import { SweetAlertController } from '../../controllers/sweet-alert.controller';

@Component({
  selector: 'ng-data-tables',
  templateUrl: './ng-data-tables.component.html',
  styleUrls: ['./ng-data-tables.component.scss']
})
export class NgDataTablesComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild(NgPaginationComponent)
  private _ngPagination: NgPaginationComponent;

  @ViewChildren('filterInputs')
  private _filterInputsEl: QueryList<ElementRef>;

  @ViewChildren('selectAllCheckbox')
  private _selectAllCheckbox: QueryList<ElementRef>;

  @Input() columns: Array<ColumnsModel> = [];

  @Input() defaultSortColumn: any = {};
  @Input() showHistoryButton: boolean = false;
  @Input() showVersionInfoButton: boolean = false;
  @Input() showFileCommentButton: boolean = false;
  @Input() showLockFileButton: boolean = false;
  @Output('onClickHistory') historyEvent = new EventEmitter<any>();
  @Output('onClickVersionInfo') versionInfoEvent = new EventEmitter<any>();
  @Output('onClickFileComment') fileCommentEvent = new EventEmitter<any>();
  @Output('onClickLockFile') fileLockEvent = new EventEmitter<any>();

  @Input() rows: Array<any> = [];

  @Input() totalRows: number = 0;

  @Input() customAction: boolean = false;

  @Input() singleColummn: boolean = false;

  @Input() trackByKey: string = '';

  @Input() isAjax: boolean = false;

  @Input() pagesCount: number = 1;

  @Input() searchBox: boolean = true;

  @Input() hasActionButtons: boolean = false;

  @Input() showEditButton: boolean = true;

  @Input() showDeleteButton: boolean = true;

  @Input() showUsersButton: boolean = false;

  @Input() showDeactivateButton: boolean = false;

  @Input() showTestButton: boolean = false;
  @Input() showButton: boolean = false;

  @Input() showDownArrowButton: boolean = false;

  @Input() showUpArrowButton: boolean = false;

  @Input() editButtonIcon: string = 'fa fa-pencil';

  @Input() deleteButtonIcon: string = 'fa fa-trash-o';

  @Input() usersButtonIcon: string = 'fa fa-user';

  @Input() downArrowButtonIcon: string = 'fa fa-long-arrow-down';

  @Input() upArrowButtonIcon: string = 'fa fa-long-arrow-up';

  @Input() showCheckBox: boolean = false;

  @Input() showCheckBoxIcon: boolean = false;

  @Input() isHighlight: boolean = false;

  @Input() showCalenderButton: boolean = false;

  @Input() showMailButton: boolean = false;

  @Input() showSmsButton: boolean = false;

  @Input() showForwardButton: boolean = false;

  @Input() editButtonTooltip: string = 'Edit';

  @Input() deleteButtonTooltip: string = 'Delete';

  @Input() blockUnblockToolTip: string = 'Block';

  @Input() showBlockUnblockButton: boolean = false;

  @Input() showScrollBar: boolean = false;

  @Output('rLink') _rlink = new EventEmitter<any>();

  @Output('paginateRecords') paginateRecordsEvent = new EventEmitter<any>();

  @Output('searchRecords') searchRecordsEvent = new EventEmitter<any>();

  @Output('edit') editEvent = new EventEmitter<any>();

  @Output('delete') deleteEvent = new EventEmitter<any>();

  @Output('up') upEvent = new EventEmitter<any>();

  @Output('down') downEvent = new EventEmitter<any>();

  @Output('deActivate') deActivateEvent = new EventEmitter<any>();

  @Output('testModel') testModelEvent = new EventEmitter<any>();

  @Output('checkBoxSelectionChange') checkBoxSelectionChangeEvent = new EventEmitter<any>();

  @Output('rowClick') rowClickEvent = new EventEmitter<any>();

  @Output('rowDblClick') rowDblClickEvent = new EventEmitter<any>();

  @Output('showUsers') showUsersEvent = new EventEmitter<any>();

  @Output('columnSort') columnSort = new EventEmitter<any>();

  @Output('mail') mailEvent = new EventEmitter<any>();

  @Output('sms') smsEvent = new EventEmitter<any>();

  @Output('forward') forwardEvent = new EventEmitter<any>();
  @Output('editCustomeSegmentRow') editCustomeSeg = new EventEmitter();
  @Input() customeSegmentDelete: boolean = false;
  @Input() showInputBox: boolean = false;

  @Output('onClickEvent') updateColumnValue = new EventEmitter<any>();

  @Output('blockUnblock') blockUnblockEvent = new EventEmitter<any>();

  allRows: Array<any> = [];
  editBtnDisable: boolean = false;

  highlightedIndex: number = 0;

  paginateRows: Array<any> = [];

  searchRows: any = [];

  extraSearchValues: Array<any> = [];

  perPage: number = 10;

  first: number = 1;
  last: number = 1;

  isDesc: boolean = false;
  sortColumn: string = '';
  direction: number;

  perPageArray: Array<Object> = [
    { number: 10 },
    { number: 25 },
    { number: 50 },
    { number: 100 }
  ];

  columnKeys: Array<string> = [];

  isRecordsSearch: boolean = false;

  tempTotalRows: number = 0;
  constructor () { }

  ngOnInit () {
    console.log('edit data table');
    this.buildColumnsKeys();

    if (StorageService.get('perPageRecords') !== undefined && StorageService.get('perPageRecords') != null) {
      this.perPage = + StorageService.get('perPageRecords');
    }

  }

  ngOnChanges (changes: any) {

    this.editBtnDisable = false;
    if (changes && typeof changes.rows !== 'undefined') {
      this.searchRows = new Sifter(this.rows);
      this.allRows = this.rows;
      this.paginateRows = this.rows;
    }

    if (this.isAjax === false) {
      this.paginateRecords(1);
    } else {
      if (changes.totalRows) {
        let end = this.perPage;
        this.last = (end < changes.totalRows.currentValue) ? end : changes.totalRows.currentValue;
        this.tempTotalRows = changes.totalRows.currentValue;
      }
    }
    if (JSON.stringify(this.defaultSortColumn) !== '{}' && this.allRows.length > 0) {
      this.isDesc = this.defaultSortColumn['isDesc'];
      this.sort(this.defaultSortColumn.key);
    }
    if (this.columns) {
      this.buildColumnsKeys();
    }
  }

  /**
   * Build Column Keys
   */
  buildColumnsKeys () {
    if (this.columns.length > 0) {
      for (let i = 0; i < this.columns.length; i++) {
        this.columnKeys.push(this.columns[i].key);
      }
    }
  }

  /**
   * Paginate Records
   *
   * @param pageNumber
   */
  paginateRecords (pageNumber: number) {

    if (this.isAjax === false) {
      --pageNumber;
      let start = pageNumber * this.perPage;
      let end = (pageNumber + 1) * this.perPage;
      this.rows = this.paginateRows.slice(start, end);
      this.first = start + 1;
      this.last = (end < this.totalRows) ? end : this.totalRows;

      let isAllSelected = true;
      for (let i = 0; i < this.rows.length; i++) {
        if (typeof this.rows[i].selectedItem === 'undefined' || !this.rows[i].selectedItem) {
          isAllSelected = false;
        }
      }
      if (this._selectAllCheckbox !== undefined) {
        if (!isAllSelected) {
          this._selectAllCheckbox.forEach((el: ElementRef) => {
            el.nativeElement.checked = false;
          });
          this.checkBoxSelectionChangeEvent.emit(this.getSelectedRows());
        } else {
          this._selectAllCheckbox.forEach((el: ElementRef) => {
            el.nativeElement.checked = true;
          });
          this.checkBoxSelectionChangeEvent.emit(this.getSelectedRows());
        }
      }

    } else {
      --pageNumber;
      let start = pageNumber * this.perPage;
      let end = (pageNumber + 1) * this.perPage;
      this.first = start + 1;
      this.last = (end < this.totalRows) ? end : this.totalRows;
      this.clearFilterData();
      this.paginateRecordsEvent.emit({ pageNumber: pageNumber, perPage: this.perPage });
    }
  }

  /**
   * Search Rows
   */
  search (key) {
    let searchResult = null;
    let searchValue = '';
    let searchValues: Array<any> = [];

    if (this.isAjax === false) {
      this.onSearch(key, searchValues, searchValue, searchResult);
      this.paginateRows = this.rows;
      this.totalRows = this.paginateRows.length;
      this.paginateRecords(1);
    } else {
      let isFilterEmpty = false;
      if (typeof this._filterInputsEl !== 'undefined') {
        this._filterInputsEl.forEach((el: ElementRef) => {
          if (el.nativeElement.value.trim() !== '') {
            isFilterEmpty = true;
          }
        });
      }
      this.onSearch(key, searchValues, searchValue, searchResult);
      this.paginateRows = this.rows;
      this.first = 1;
      this.paginateRows.length ? this.totalRows = (isFilterEmpty ? this.paginateRows.length : this.tempTotalRows) : this.totalRows = 0;
      this.last = this.paginateRows.length ;
      if (searchValue.length > 3) {
        this.searchRecordsEvent.emit([]);
      }
    }
  }
  clearFilterData () {
    if (typeof this._filterInputsEl !== 'undefined') {
      this._filterInputsEl.forEach((el: ElementRef) => {
        el.nativeElement.value = '';
      });
    }
  }

  onSearch (key, searchValues, searchValue, searchResult) {
    if (typeof this._filterInputsEl !== 'undefined') {
      this._filterInputsEl.forEach((el: ElementRef) => {
        if (el.nativeElement.value.trim() !== '') {
          searchValues.push(el.nativeElement.value);
        }
      });
    }

    if (typeof this.extraSearchValues !== 'undefined') {
      searchValues = searchValues.concat(this.extraSearchValues);
    }

    if (searchValues.length > 0) {
      searchValue = searchValues.join('+').trim();
      this.isRecordsSearch = true;
    } else {
      this.isRecordsSearch = false;
    }

    searchResult = this.searchRows.search(searchValue, {
      fields: (key ? key : this.columnKeys),
      conjunction: 'and'
    });

    this.rows = [];
    searchResult.items.forEach((item: any) => {
      this.rows.push(this.allRows[item.id]);
    });
  }

  /**
   * Sort Event
   *
   * @param property
   */
  sort (property: string) {
    this.isDesc = !this.isDesc; // change the direction
    this.sortColumn = property;
    this.direction = this.isDesc ? 1 : -1;
    let sortRows = (this.isRecordsSearch === false) ? this.allRows : this.paginateRows;
    if (this.isAjax === false) {
      this.onSort(property, sortRows);
      this.paginateRecords(1);
      this.setPage(1);
    } else {
      this.onSort(property, sortRows);
      if (sortRows.length > 0) {
        this.columnSort.emit(sortRows[0]);
        this.highlightedIndex = 0;
      }
    }
  }
  onSort (property, sortRows) {
    sortRows.sort((a, b) => {
      if (property === 'filesize') {
        if (Number(a[property].slice(0, -3).replace(/,/g , '')) < Number(b[property].slice(0, -3).replace(/,/g , ''))) {
          return -1 * this.direction;
        } else if (Number(a[property].slice(0, -3).replace(/,/g , '')) > Number(b[property].slice(0, -3).replace(/,/g , ''))) {
          return 1 * this.direction;
        } else {
          return 0;
        }
      } else {
        if (a[property] < b[property]) {
          return -1 * this.direction;
        } else if (a[property] > b[property]) {
          return 1 * this.direction;
        } else {
          return 0;
        }
      }
    });

    this.rows = sortRows;
    if (this.isRecordsSearch === false) {
      this.paginateRows = sortRows;
    }
  }

  /**
   * Records Per Page Selection Event
   *
   * @param event
   */
  onPerPage (event) {
    StorageService.set('perPageRecords', this.perPage);
    this.paginateRecords(1);
  }

  /**
   * Goto Link Event
   *
   * @param row, column
   */
  gotoLink (row: any, column: any) {
    if (column.link === true) {
      let routeData = {
        row: row,
        columnKey: column.key
      };
      this._rlink.emit(routeData);
    }
  }

  /**
   * Echo Value
   *
   * @param row, column
   */
  echo (row, column): string {
    if (column.key !== '' && typeof row[column.key] !== 'undefined') {
      return row[column.key];
    } else if (column.defaultValue !== '') {
      return column.defaultValue;
    }

    return '';
  }

  /**
   * Emitting Edit Event
   *
   * @param row
   */
  edit (row: any) {
    if (this.editBtnDisable) {
    } else {
      this.editEvent.emit(row);
    }

          // row['isEdit'] =true;
  }
  // customerSegment(event){
  //
  //   console.log("event data",event)
  history (row: any) {
    this.historyEvent.emit(row);
  }

  versionInfo (event,row: any) {
    event['row'] = row;
    this.versionInfoEvent.emit(event);
  }

  fileComments (row: any) {
    this.fileCommentEvent.emit(row);
  }

  fileLock (row: any) {
    this.fileLockEvent.emit(row);
  }

  // }
  mail (row: any) {
    this.mailEvent.emit(row);
  }

  forward (row: any) {
    this.forwardEvent.emit(row);
  }

  sms (row: any) {
    this.smsEvent.emit(row);
  }

  /**
   * Emitting Delete Event
   *
   * @param row
   */
  delete (row: any) {
    if (this.customeSegmentDelete) {
      let deleteClientSetupAlert = new SweetAlertController();
      deleteClientSetupAlert.deleteConfirm({}, () => {
        this.rows.forEach(item => {
          if (item._id === row._id) {
            item.tempDelete = true;
          }
        });
        this.deleteEvent.emit(row);
      });

    } else {
      this.deleteEvent.emit(row);
    }

  }

  /**
   * Emitting Delete Event
   *
   * @param row
   */
  up (row: any) {
    this.upEvent.emit(row);
  }

  /**
   * Emitting Delete Event
   *
   * @param row
   */
  down (row: any) {
    this.downEvent.emit(row);
  }
  /**
   * Emitting de activate Event
   *
   * @param row
   */
  deActivate (event, row) {
    row.active = event.srcElement.checked;
    this.deActivateEvent.emit(row);
  }

  /**
   * Track rows in ngFor
   *
   * @param index, item
   */
  trackByFn (index, item) {
    return index;
  }

  /**
   * Add Tag Class to record item
   *
   * @param tag
   */
  tagClass (tag: string, isTag: boolean): string {
    if (!tag) {
      return '';
    }

    if (!isTag) {
      return '';
    }

    return ' tag ' + tag.toLowerCase().replace(/\s/g, '_');
  }

  /**
   * Set Page
   *
   * @param pageNumber
   */
  setPage (pageNumber: number) {
    this._ngPagination.setPage(pageNumber);
  }

  checkAll (event) {
    if (this.rows.length > 0) {
      this.rows.forEach(row => row.selectedItem = event.target.checked);
      this.checkBoxSelectionChangeEvent.emit(this.getSelectedRows());
    }

    /// this.rows.forEach(row => row.selectedItem = event.target.checked)
   // this.checkBoxSelectionChangeEvent.emit(this.getSelectedRows());
  }

  rowCheck (event, row) {
    row.selectedItem = event.srcElement.checked;
    this.checkBoxSelectionChangeEvent.emit(this.getSelectedRows());
  }

  private getSelectedRows () {
    let selectedRows = [];
    let allSelected = true;
    this.rows.forEach(row => {
      if (row.selectedItem) {
        selectedRows.push(row);
      } else {
        allSelected = false;
      }
    });
    this._selectAllCheckbox.forEach((el: ElementRef) => {
      el.nativeElement.checked = allSelected;
    });
    return selectedRows;
  }

  isRowDoubleClick = false;
  rowSelected (row, i) {
    setTimeout(() => {
      if (!this.isRowDoubleClick) {
        this.rowClickEvent.emit(row);
      }
    }, 200);

    this.highlightedIndex = i;
  }

  rowDoubleClicked (row) {
    this.isRowDoubleClick = true;
    this.rowDblClickEvent.emit(row);
    setTimeout(() => {
      this.isRowDoubleClick = false;
    }, 200);
  }

  testTargetModel (row) {
    this.testModelEvent.emit(row);
  }

  /**
   * Emitting show users Event
   *
   * @param row
   */
  showUsers (row: any) {
    this.showUsersEvent.emit(row);
  }

  customerSegment (event) {
    this.editCustomeSeg.emit(event);
    this.editBtnDisable = true;
  }

  /**
   * Emitting column key with row value
   * @param row
   * @param columnKey
   */
  onClickEvent (row: any,columnKey: any) {
    this.updateColumnValue.emit({ rowData: row, columnKey: columnKey });
  }

  blockUnblock (event, row: any) {
    row.isBlocked = event.srcElement.checked;
    this.blockUnblockEvent.emit(row);
  }

  ngOnDestroy () {

  }

}
