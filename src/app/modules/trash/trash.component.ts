import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HashMap } from '@nebtex/hashmaps';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { HttpParams } from '@angular/common/http';
import { PopUpComponent } from '../pop-up/pop-up.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.scss']
})
export class TrashComponent implements OnInit {

  @ViewChild(DatatableComponent) datatable: DatatableComponent;
  @ViewChild('dateColumnTemplate') dateColumnTemplate: TemplateRef<any>;
  @ViewChild('textColumnTemplate') textColumnTemplate: TemplateRef<any>;
  @ViewChild('actionColumnTemplate') actionColumnTemplate: TemplateRef<any>;
  @ViewChild('chkBxTmplCell') chkBxTmplCell: TemplateRef<any>;
  @ViewChild('chkBxTmpl') chkBxTmpl: TemplateRef<any>;
  @ViewChild('sortableHeaderTemplateDate') sortableHeaderTemplateDate: TemplateRef<any>;
  @ViewChild('sortableHeaderTemplateInput') sortableHeaderTemplateInput: TemplateRef<any>;

  breadcrumbs: Array<any> = [
    {
      text: 'Trash',
      base: true,
      active: true
    }
  ];

  public fromDate = new FormControl();
  public endDate = new FormControl();
  public startDateControl = new FormControl();
  public endDateControl = new FormControl();
  public globalSearch = new FormControl();

  maxStartDate;
  displayPicker;
  minEndDate;
  resetAdvSearch;
  startDateChanged;
  endDateChanged;

  rowsTable = [];
  columnsTable = [];
  isLoading = false;

  public readonly pageLimitOptions = [
    { value: 10 },
    { value: 20 },
    { value: 30 },
    { value: 40 },
    { value: 50 }
  ];

  myMessages = {
    emptyMessage: '<img src="../../../../assets/images/no_data_found.png">',
    totalMessage: 'Displaying item '
  };

  pageTable = {
    limit: 5,
    count: 0,
    offset: 0,
    orderBy: 'created_time',
    sortDirection: 'desc',
    hashMapPropNameFilterSearch: new HashMap()
  };

  constructor (
    private matDialog: MatDialog
  ) { }

  ngOnInit () {
    this.initTableData();
    this.rowsTable = [{ 'deleted_date': '2019-01-01T00:00:00.000Z','deleted_items': 'nesto' },
    { 'deleted_date': '2019-01-01T00:00:00.000Z','deleted_items': 'nesto' },
    { 'deleted_date': '2019-01-01T00:00:00.000Z','deleted_items': 'nesto' },
    { 'deleted_date': '2019-01-01T00:00:00.000Z','deleted_items': 'nesto' },
    { 'deleted_date': '2019-01-01T00:00:00.000Z','deleted_items': 'nesto' },
    { 'deleted_date': '2019-01-01T00:00:00.000Z','deleted_items': 'nesto' },
    { 'deleted_date': '2019-01-01T00:00:00.000Z','deleted_items': 'nesto' }];
  }

  initTableData () {

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
        name: 'Deleted Date',
        customizeName: 'Deleted Date',
        prop: 'deleted_date',
        filterCode: 'deletedDate',
        searchName: 'deletedDate',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplateDate,
        cellTemplate: this.dateColumnTemplate,
        resizeable: false,
        minWidth: 100
      },
      {
        name: 'Deleted Items',
        customizeName: 'Deleted Items',
        prop: 'deleted_items',
        filterCode: 'deletedItems',
        searchName: 'deletedItems',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplateInput,
        cellTemplate: this.textColumnTemplate,
        resizeable: false,
        minWidth: 800
      },
      {
        name: 'Action',
        customizeName: 'Action',
        prop: 'Action',
        sortable: false,
        cellTemplate: this.actionColumnTemplate,
        resizeable: false,
        minWidth: 50
      }
    ];
  }

  filterCallback (event, propName) {
    let searchPropValue = propName.includes('Code') ?
    event.target.value : event.target.value.toString().toLowerCase();

    this.actionChangeHashMapPropNameFilterSearch(searchPropValue, propName);

    this.pageTable.offset = 0;
    this.reloadTable();
  }

  filterDate (event, propName) {
    if (event.target.value) {
      this.actionChangeHashMapPropNameFilterSearch(event.target.value.toISOString(), propName);
      this.pageTable.offset = 0;
      this.reloadTable();
    }
  }

  actionChangeHashMapPropNameFilterSearch (searchPropValue, propName) {
    if (this.pageTable.hashMapPropNameFilterSearch.has(propName)) {
      if (searchPropValue !== '-1' && searchPropValue !== '') {
        this.pageTable.hashMapPropNameFilterSearch.set(propName, searchPropValue);
      } else {
        this.pageTable.hashMapPropNameFilterSearch.delete(propName);
      }
    } else {
      this.pageTable.hashMapPropNameFilterSearch.set(propName, searchPropValue);
    }
  }

  reloadTable () {
    this.isLoading = true;
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

    if (this.globalSearch.value) {
      queryParams = queryParams.append('globalParam', this.globalSearch.value);
      const columnsForGlobalSearch = this.columnsTable.map(p => {
        if (p.name) return p.prop.trim();
      });
      queryParams = queryParams.append('columnsForGlobalSearch', columnsForGlobalSearch.join());
    }

    // this.docSearchService.searchDocSearchContractsDocuments(queryParams).subscribe((data: any) => {
    //   this.rowsTable = data.docs;
    //   this.rowsTable.forEach(item => {
    //     item.checked = this.headerCheckBox;
    //   });
    //   this.pageTable.count = data.totalDocs;
    // });
    this.isLoading = false;
  }

  openDialogForDeleteConfirmation (row) {
    if (row === undefined) {
      if (this.rowsTable.filter(row => row.checked === true).length === 0) {
        alert('Please select at least one row!');
        return;
      }
    }
    let data = {
      'message': 'Are you sure you want to delete this Item?',
      'heading': 'Delete Permanently',
      'row': row,
      'component': 'trash',
      'yes': 'Yes',
      'no': 'Cancel'
    };

    const dialogRef = this.matDialog.open(PopUpComponent, {
      width: '450px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result && result.row && result.component === 'trash') {
          console.log('cao');
          // this.deleteContractDocument(result.row);
        } else if (result.component === 'trash') {
          // this.deleteContractsDocuments();
        }
      }
    });
  }

}
