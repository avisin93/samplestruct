import { Component,OnInit,ViewChild,TemplateRef,Input,OnDestroy,AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { trigger,state,style,transition,animate } from '@angular/animations';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { HttpParams } from '@angular/common/http';
import { ContractService } from '../contracts/contracts.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HashMap } from '@nebtex/hashmaps';

import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from '../shared/providers/session.service';
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatDatepicker, MatInput, MatDatepickerInputEvent } from '@angular/material';
import { customTooltipDefaults } from 'src/app/models/constants';
import { FormControl } from '@angular/forms';
import { take, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ReplaySubject, Subject } from 'rxjs';
import { StorageService } from '../shared/providers/storage.service';
import { ContractListService } from './contract-list.service';

@Component({
  selector: 'cm-contract-list',
  animations: [
    trigger('slideInOut', [
      state(
        'in',
        style({
          overflow: 'hidden',
          height: '*'
        })
      ),
      state(
        'out',
        style({
          overflow: 'hidden',
          height: '0'
        })
      ),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ])
  ],
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.scss'],
  providers: [
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: customTooltipDefaults }
  ]
})
export class ContractListComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('fromInput', { read: MatInput }) fromInput: MatInput;
  @ViewChild('toInput', { read: MatInput }) toInput: MatInput;
  @ViewChild(DatatableComponent) datatable: DatatableComponent;
  @ViewChild('sortableHeaderTemplateInput') sortableHeaderTemplateInput: TemplateRef<any>;
  contractTitle: string = '';
  @ViewChild('startDatePicker') startDatePicker: MatDatepicker<any>;
  @ViewChild('endDatePicker') endDatePicker: MatDatepicker<any>;
  @ViewChild('startDateColumnTemplate') startDateColumnTemplate: TemplateRef<any>;
  @ViewChild('sortableHeaderTemplateStartDate') sortableHeaderTemplateStartDate: TemplateRef<any>;
  @ViewChild('sortableHeaderTemplateEndDate') sortableHeaderTemplateEndDate: TemplateRef<any>;
  @ViewChild('dateColumnTemplate') dateColumnTemplate: TemplateRef<any>;
  @ViewChild('textHeaderTemplate') textHeaderTemplate: TemplateRef<any>;
  @ViewChild('textColumnTemplate') textColumnTemplate: TemplateRef<any>;
  @ViewChild('firstColumnTemplate') firstColumnTemplate: TemplateRef<any>;
  @ViewChild('firstHeaderTemplate') firstHeaderTemplate: TemplateRef<any>;
  @ViewChild('sortableHeaderTemplateSelectCategories')
  sortableHeaderTemplateSelectCategories: TemplateRef<any>;
  @ViewChild('sortableHeaderTemplateSelectSubCategories')
  sortableHeaderTemplateSelectSubCategories: TemplateRef<any>;
  @ViewChild('sortableHeaderTemplateSelectStatus')
  sortableHeaderTemplateSelectStatus: TemplateRef<any>;
  @ViewChild('sortableHeaderTemplateSelectLegalEntities')
  sortableHeaderTemplateSelectLegalEntities: TemplateRef<any>;

  @ViewChild('dateColumn') dateColumn: TemplateRef<any>;
  @ViewChild('checkboxHeaderTemplate') checkboxHeaderTemplate: TemplateRef<any>;
  @ViewChild('checkboxColumnTemplate') checkboxColumnTemplate: TemplateRef<any>;
  @ViewChild('actionColumnTemplate') actionColumnTemplate: TemplateRef<any>;
  @ViewChild('statusColumnTemplate') statusColumnTemplate: TemplateRef<any>;

  @Input() selectedLegalEntity: string;
  @Input() searchTextGlobal: string;
  @Input() selectedCategories: string = '-1';
  @Input() selectedSubCategories: string = '-1';
  selectedStatusFilter = '-1';
  selectedLegalEntityFilter = '-1';

  public minEndDate: Date;
  public maxStartDate: Date;
  public displayPicker: boolean = true;
  public globalSearch = new FormControl();
  public startDateRangePicker = new FormControl();
  public endDateRangePicker = new FormControl();
  public startDateControl = new FormControl();
  public endDateControl = new FormControl();

  breadcrumbs: Array<any> = [
    {
      text: 'Contract List',
      base: true,
      active: true
    }
  ];

  arrayCategories = [];
  arraySubCategories = [];
  arrayStatus = [];
  arrayLegalEntities = [];
  columnListFromExela: any[] = [];
  slideIn: boolean = false;
  slideInMobile: boolean = false;

  currentScreenSize;

  rowsTable = [];
  columnsTable = [];
  columnsTableForMobile = [];
  customizeColumns = [];

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
    limit: 10,
    count: 0,
    offset: 0,
    orderBy: 'created_time',
    sortDirection: 'desc',
    hashMapPropNameFilterSearch: new HashMap()
  };

  customizeMenuFilter: FormControl = new FormControl();
  customizeMenuSelect: FormControl = new FormControl();
  /** list of columns filtered by search keyword */
  public filteredColumnsMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();
  @ViewChild('multiSelect') multiSelect;
  constructor (
    private contractService: ContractService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private contractListService: ContractListService,
    private elRef: ElementRef
  ) {

  }

  navigateAddContract () {
    let base = SessionService.get('base-role');
    this.router.navigate([base + '/contracts/0']).then(nav => {
      console.log(nav);
    }, err => {
      console.log(err);
    });
  }

  navigateEditContract (row) {
    if (!row.extraction_in_progress) {
      let base = SessionService.get('base-role');
      const link = !row.meta ? '/contracts/' : '/contract-meta/';
      this.router.navigate([base + link + row._id]).then(nav => {
        console.log(nav);
      }, err => {
        console.log(err);
      });
    } else {
      this.toastr.info('Info', 'Extraction of contract is in progress!');
    }
  }

  async ngOnInit () {
    this.currentScreenSize = window.innerWidth;
    this.contractTitle = '';
    this.columnListFromExela = await this.getColumnsFromExelaAuth();
    this.initDatatable();
    if (this.currentScreenSize < 800) {
      this.calculateSize();
    }
    this.contractService.getClientConfigurations().subscribe(
      (res: any) => {
        this.arrayCategories = res.category;
        this.arrayLegalEntities = res.legal_entity;
        this.createSubCategories();
        this.selectedCategories = '-1';
      },
      error => {
        console.log(error);
        this.toastr.error(
          'Error',
          'Something went wrong(Cannot fetch list of categories)'
        );
      }
    );

    this.contractService.getAllStatus().subscribe(
      (res: any) => {
        this.arrayStatus = res;
        this.pageCallback({ offset: 0, orderBy: 'created_time', sortDirection: 'desc' }, false);
      },
      error => {
        console.log(error);
        this.toastr.error(
          'Error',
          'Something went wrong(Cannot fetch list of statuses)'
        );
      }
    );

    if (this.columnListFromExela) {
      this.customizeMenuSelect.setValue(this.customizeColumns.filter(column => {
        return this.columnListFromExela.indexOf(column.name) > -1;
      }));
    } else {
      this.customizeMenuSelect.setValue(this.customizeColumns);
    }
    this.filteredColumnsMulti.next(this.customizeColumns.slice());
    // listen for search field value changes
    this.customizeMenuFilter.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterColumns();
      });

    this.globalSearch.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value) => {
        this.reloadTable();
      });
  }

  initDatatable () {
    this.columnsTable = [
      {
        name: 'CATEGORY',
        customizeName: 'Category',
        prop: 'category.name',
        filterCode: 'categoryCode',
        searchName: 'categoryName',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplateSelectCategories,
        cellTemplate: this.textColumnTemplate,
        resizeable: false,
        minWidth: 110
      },
      {
        name: 'SUB CATEGORY',
        customizeName: 'Sub Category',
        prop: 'sub_category.name',
        filterCode: 'subCategoryCode',
        searchName: 'subCategoryName',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplateSelectSubCategories,
        cellTemplate: this.textColumnTemplate,
        resizeable: false,
        minWidth: 110
      },
      {
        name: 'BUSINESS PARTNER',
        customizeName: 'Business partner',
        prop: 'business_partner.name',
        searchName: 'businessPartnerName',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplateInput,
        cellTemplate: this.textColumnTemplate,
        resizeable: false,
        minWidth: 140
      },
      {
        name: 'CONTRACT TITLE',
        customizeName: 'Contract Title',
        prop: 'contract_title',
        searchName: 'contractTitle',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplateInput,
        cellTemplate: this.textColumnTemplate,
        resizeable: false,
        minWidth: 120
      },
      {
        name: 'ASSIGNED TO',
        customizeName: 'Assigned to',
        prop: 'assigned_to',
        searchName: 'assignedToName',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplateInput,
        cellTemplate: this.textColumnTemplate,
        resizeable: false,
        minWidth: 115
      },
      {
        name: 'START DATE',
        prop: 'term.start_date',
        customizeName: 'Start Date',
        searchName: 'startDate',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplateStartDate,
        cellTemplate: this.dateColumnTemplate,
        resizeable: false,
        pipe: { transform: this.datePipe },
        minWidth: 80
      },
      {
        name: 'END DATE',
        prop: 'term.end_date',
        customizeName: 'End Date',
        searchName: 'endDate',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplateEndDate,
        cellTemplate: this.dateColumnTemplate,
        resizeable: false,
        pipe: { transform: this.datePipe },
        minWidth: 80
      },
      {
        name: 'STATUS',
        customizeName: 'Status',
        prop: 'status.name',
        filterCode: 'statusCode',
        searchName: 'statusName',
        sortable: false,
        cellTemplate: this.statusColumnTemplate,
        headerTemplate: this.sortableHeaderTemplateSelectStatus,
        resizeable: false,
        minWidth: 100,
        maxWidth: 100
      },
      {
        name: 'REFERENCE NO',
        customizeName: 'Reference No',
        prop: 'reference_no',
        searchName: 'referenceNo',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplateInput,
        cellTemplate: this.textColumnTemplate,
        resizeable: false,
        minWidth: 120
      },
      {
        name: 'LEGAL ENTITY',
        customizeName: 'Legal Entity',
        prop: 'legal_entity.name',
        searchName: 'legalEntityName',
        filterCode: 'legalEntityCode',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplateSelectLegalEntities,
        cellTemplate: this.textColumnTemplate,
        resizeable: false,
        minWidth: 100
      },
      {
        name: 'ACTION',
        customizeName: 'Action',
        prop: 'action',
        sortable: false,
        cellTemplate: this.actionColumnTemplate,
        headerTemplate: this.textHeaderTemplate,
        resizeable: false,
        minWidth: 50,
        maxWidth: 60
      }
    ];

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
      this.contractListService.addOrUpdateAttribute(StorageService.get(StorageService.userId), userAttributes);
    }
  }

  filterDate (event, propName) {
    if (event.target.value) {
      this.actionChangeHashMapPropNameFilterSearch(event.target.value.format('YYYY-MM-DD'), propName);
      this.pageTable.offset = 0;
      this.reloadTable();
    }
  }

  datePipe (value: any, ...args: any[]) {
    if (!value) return '';
    return moment(new Date(value)).format('MM/DD/YYYY');
  }

  pageCallback (pageInfo: {
    count?: number;
    pageSize?: number;
    limit?: number;
    offset?: number;
    orderBy?: string;
    sortDirection?: string;
  }, pageChange) {
    this.pageTable.offset = pageInfo.offset;
    this.pageTable.orderBy = pageInfo.orderBy ? pageInfo.orderBy : pageChange && this.pageTable.orderBy !== '' ? this.pageTable.orderBy : 'created_time';
    this.pageTable.sortDirection = pageInfo.sortDirection ? pageInfo.sortDirection : pageChange && this.pageTable.sortDirection !== '' ? this.pageTable.sortDirection : 'desc';
    this.reloadTable();
  }

  sortCallback (sortInfo: {
    sorts: {
      dir: string;
      prop: string;
    }[];
    column: {};
    prevValue: string;
    newValue: string;
  }) {
    this.pageTable.sortDirection = sortInfo.sorts[0].dir;
    this.pageTable.orderBy = sortInfo.sorts[0].prop;
    this.pageTable.offset = 0;
    this.reloadTable();
  }

  filterLegalEntity () {
    this.actionChangeHashMapPropNameFilterSearch(
      this.selectedLegalEntity,
      'legalEntityCode'
    );

    this.pageTable.offset = 0;
    this.reloadTable();
  }

  filterCallback (event, propName) {
    let searchPropValue = propName.includes('Code')
      ? event.target.value
      : event.target.value.toLowerCase();

    this.actionChangeHashMapPropNameFilterSearch(searchPropValue, propName);

    this.pageTable.offset = 0;
    this.reloadTable();
  }

  resetStartDatePicker (): void {
    this.startDatePicker.select(undefined);
  }

  resetEndDatePicker (): void {
    this.endDatePicker.select(undefined);
  }

  filterCategoriesAndCreateSubCategories () {
    if (this.selectedCategories !== '-1') {
      this.arraySubCategories = this.arrayCategories.find(
        cat => cat.code === this.selectedCategories
      ).sub_categories;
    } else {
      this.createSubCategories();
    }
    this.actionChangeHashMapPropNameFilterSearch(
      this.selectedCategories,
      'categoryCode'
    );

    this.pageTable.offset = 0;
    this.reloadTable();
  }

  filterSubCategories () {
    this.actionChangeHashMapPropNameFilterSearch(
      this.selectedSubCategories,
      'subCategoryCode'
    );

    this.pageTable.offset = 0;
    this.reloadTable();
  }

  createSubCategories () {
    for (let i = 0; i < this.arrayCategories.length; i++) {
      this.arraySubCategories = this.arraySubCategories.concat(
        this.arrayCategories[i].sub_categories
      );
    }
  }

  actionChangeHashMapPropNameFilterSearch (searchPropValue, propName) {
    if (this.pageTable.hashMapPropNameFilterSearch.has(propName)) {
      if (searchPropValue !== '-1' && searchPropValue !== '') {
        this.pageTable.hashMapPropNameFilterSearch.set(
          propName,
          searchPropValue
        );
      } else {
        this.pageTable.hashMapPropNameFilterSearch.delete(propName);
      }
    } else {
      this.pageTable.hashMapPropNameFilterSearch.set(propName, searchPropValue);
    }
  }

  onLimitChange (value) {
    this.pageTable.limit = value;
    this.pageTable.offset = 0;
    this.reloadTable();
  }

  onInputPageChange (value) {
    if (value === '') {
      this.pageTable.offset = 0;
      this.reloadTable();
    } else if (isNaN(value)) {
      this.toastr.error(
        'Error',
        'You can only enter numeric'
      );
    } else {
      const numberPages = Math.ceil(this.datatable.rowCount / this.datatable.limit);
      if (numberPages >= value && value > 0) {
        this.pageTable.offset = value - 1;
        this.reloadTable();
      } else {
        this.toastr.error(
          'Error',
          'Page that you enter does not exist!'
        );
      }
    }
  }

  reloadTable () {
    // Table properites
    let params = new HttpParams();
    if (this.pageTable.orderBy !== '') {
      params = params.set('orderBy', `${this.pageTable.orderBy}`);
    }
    if (this.pageTable.sortDirection !== '') {
      params = params.set('sortDirection', `${this.pageTable.sortDirection}`);
    }
    params = params.set('pageNumber', `${this.pageTable.offset + 1}`);
    params = params.set('pageSize', `${this.pageTable.limit}`);

    // Filter part
    this.pageTable.hashMapPropNameFilterSearch.forEach((value, key) => {
      params = params.set(`${key}`, `${value}`);
    });

    // Other pages params
    this.otherPagesSearchParams(params);
  }

  otherPagesSearchParams (params) {
    const search = this.route.snapshot.params['search'];
    if (search) {
      if (params.get('statusCode') === null && this.checkIfStatusExists(search)) {
        params = params.set('statusCode', search);
      } else if (search === 'WEEK') {
        const todayDay = moment().startOf('day').format('YYYY-MM-DD');
        const oneWeek = moment().add(7, 'days').format('YYYY-MM-DD');
        params = params.set('expiryStartDate', `${todayDay}`);
        params = params.set('expiryEndDate', `${oneWeek}`);
      } else if (search === 'MONTH') {
        const oneWeek = moment().add(7, 'days').format('YYYY-MM-DD');
        const oneMonth = moment().add(1, 'months').format('YYYY-MM-DD');
        params = params.set('expiryStartDate', `${oneWeek}`);
        params = params.set('expiryEndDate', `${oneMonth}`);
      } else if (search === '3MONTH') {
        const oneMonth = moment().add(1, 'months').format('YYYY-MM-DD');
        const threeMonth = moment().add(3, 'months').format('YYYY-MM-DD');
        params = params.set('expiryStartDate', `${oneMonth}`);
        params = params.set('expiryEndDate', `${threeMonth}`);
      } else if (search === '6MONTH') {
        const threeMonth = moment().add(3, 'months').format('YYYY-MM-DD');
        const sixMonth = moment().add(6, 'months').format('YYYY-MM-DD');
        params = params.set('expiryStartDate', `${threeMonth}`);
        params = params.set('expiryEndDate', `${sixMonth}`);
      } else if (search === '12MONTH') {
        const sixMonth = moment().add(6, 'months').format('YYYY-MM-DD');
        const twelveMonth = moment().add(12, 'months').format('YYYY-MM-DD');
        params = params.set('expiryStartDate', `${sixMonth}`);
        params = params.set('expiryEndDate', `${twelveMonth}`);
      } else if (search === 'ID') {
        const contractId = this.route.snapshot.params['searchParam'];
        params = params.set('contractId', `${contractId}`);
      }
    }

    if (this.globalSearch.value) {
      params = params.append('globalParam', this.globalSearch.value);
      const columnsForGlobalSearch = this.columnsTable.map(p => p.prop.trim());
      params = params.append('columnsForGlobalSearch', columnsForGlobalSearch.join());
    }

    this.contractService.searchContractListContracts(params).subscribe(
      (data: any) => {
        this.rowsTable = data.docs;
        this.pageTable.count = data.totalDocs;
      },
      error => {
        console.log(error);
        this.toastr.error(
          'Error',
          'Something went wrong(Cannot execute search action)'
        );
      }
    );
  }

  toggleColumns (col) {
    const isChecked = this.isCheckedToggleColumn(col);
    if (isChecked) {
      this.columnsTable = this.columnsTable.filter(c => {
        return c.name !== col.name;
      });
    } else {
      const newColumns = [...this.columnsTable, col];
      this.columnsTable = [];
      this.customizeColumns.forEach(f => {
        newColumns.forEach(s => {
          if (s.name === f.name) {
            this.columnsTable.push(f);
          }
        });
      });
    }
    let userAttributes = [];
    let columnNames = this.columnsTable.map(column => {
      return column.name;
    });
    userAttributes.push({ att_name: 'contract-list-columns', att_value: columnNames });
    this.contractListService.addOrUpdateAttribute(StorageService.get(StorageService.userId), userAttributes);

  }

  toggleColumnsForMobile (col) {
    const isChecked = this.isCheckedToggleColumnMobile(col);
    if (isChecked) {
      this.columnsTableForMobile = this.columnsTableForMobile.filter(c => {
        return c.name !== col.name;
      });
    } else {
      const newColumns = [...this.columnsTableForMobile, col];
      this.columnsTableForMobile = [];
      this.customizeColumns.forEach(f => {
        newColumns.forEach(s => {
          if (s.name === f.name) {
            this.columnsTableForMobile.push(f);
          }
        });
      });
    }
    let userAttributes = [];
    let columnNames = this.columnsTableForMobile.map(column => {
      return column.name;
    });
    userAttributes.push({ att_name: 'contract-list-columns', att_value: columnNames });
    this.contractListService.addOrUpdateAttribute(StorageService.get(StorageService.userId), userAttributes);

  }

  isCheckedToggleColumn (col) {
    return this.columnsTable.find(c => {
      return c.prop === col.prop;
    });
  }

  isCheckedToggleColumnMobile (col) {
    return this.columnsTableForMobile.find(c => {
      return c.prop === col.prop;
    });
  }

  startDateRangeChanged (event): void {
    this.deletePropFromHashMap('startDateFrom');
    this.deletePropFromHashMap('endDateTo');
    this.actionChangeHashMapPropNameFilterSearch(
      moment(event.value.begin).format('YYYY-MM-DD'), 'startDateRangeStart'
    );
    this.actionChangeHashMapPropNameFilterSearch(
      moment(event.value.end).format('YYYY-MM-DD'), 'startDateRangeEnd'
    );
    this.pageTable.offset = 0;
    this.reloadTable();
  }

  endDateRangeChanged (event): void {
    this.deletePropFromHashMap('startDateFrom');
    this.deletePropFromHashMap('endDateTo');
    this.actionChangeHashMapPropNameFilterSearch(
      moment(event.value.begin).format('YYYY-MM-DD'), 'endDateRangeStart'
    );
    this.actionChangeHashMapPropNameFilterSearch(
      moment(event.value.end).format('YYYY-MM-DD'), 'endDateRangeEnd'
    );
    this.pageTable.offset = 0;
    this.reloadTable();
  }

  filterByStartEndFromDate () {
    this.deletePropFromHashMap('startDateRangeStart');
    this.deletePropFromHashMap('startDateRangeEnd');
    this.deletePropFromHashMap('endDateRangeStart');
    this.deletePropFromHashMap('endDateRangeEnd');
    this.actionChangeHashMapPropNameFilterSearch(moment(this.startDateControl.value).format('YYYY-MM-DD'), 'startDateFrom');
    this.actionChangeHashMapPropNameFilterSearch(moment(this.endDateControl.value).format('YYYY-MM-DD'), 'endDateTo');
    this.pageTable.offset = 0;
    this.reloadTable();
  }

  deletePropFromHashMap (prop: any) {
    this.pageTable.hashMapPropNameFilterSearch.delete(prop);
  }

  startDateChanged (event): void {
    (this.startDateControl.value) ? this.minEndDate = moment(this.startDateControl.value).add(1, 'd').toDate() : this.minEndDate = null;
    if (this.startDateControl.value && this.endDateControl.value) this.filterByStartEndFromDate();
  }

  endDateChanged (event): void {
    (this.endDateControl.value) ? this.maxStartDate = moment(this.endDateControl.value).subtract(1, 'd').toDate() : this.maxStartDate = null;
    if (this.startDateControl.value && this.endDateControl.value) this.filterByStartEndFromDate();
  }

  showDatepicker (value) {
    if (value !== 'single') {
      this.displayPicker = true;
      this.startDateControl.setValue('');
      this.endDateControl.setValue('');
      this.deletePropFromHashMap('startDateFrom');
      this.deletePropFromHashMap('endDateTo');
    } else {
      this.displayPicker = false;
      this.startDateRangePicker.setValue('');
      this.endDateRangePicker.setValue('');
      this.deletePropFromHashMap('startDateRangeStart');
      this.deletePropFromHashMap('startDateRangeEnd');
      this.deletePropFromHashMap('endDateRangeStart');
      this.deletePropFromHashMap('endDateRangeEnd');
    }
  }

  resetAdvSearch () {
    this.clearAllDynamicInputs();
    this.globalSearch.setValue('');
    if (this.fromInput) this.fromInput.value = '';
    if (this.toInput) this.toInput.value = '';
    this.selectedLegalEntity = '';
    this.startDateRangePicker.setValue('');
    this.endDateRangePicker.setValue('');
    this.startDateControl.setValue('');
    this.endDateControl.setValue('');
    this.selectedCategories = '-1';
    this.selectedSubCategories = '-1';
    this.selectedLegalEntityFilter = '-1';
    this.selectedStatusFilter = '-1';
    this.startDatePicker.select(undefined);
    this.pageTable.hashMapPropNameFilterSearch.clear();
    this.reloadTable();
  }

  clearAllDynamicInputs () {
    const div = this.elRef.nativeElement.querySelectorAll('.src-filters');
    const myLength = div.length;
    for (let i = 0; i < myLength; i++) {
      div[i].value = '';
    }
  }

  protected filterColumns () {
    if (!this.customizeColumns) {
      return;
    }
    // get the search keyword
    let search = this.customizeMenuFilter.value;
    if (!search) {
      this.filteredColumnsMulti.next(this.customizeColumns.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the columns
    this.filteredColumnsMulti.next(
      this.customizeColumns.filter(col => col.customizeName.toLowerCase().indexOf(search) > -1)
    );
  }

  ngAfterViewInit () {
    this.setInitialValue();
  }

  ngOnDestroy () {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  /**
   * Sets the initial value after the filteredColumns are loaded initially
   */
  protected setInitialValue () {
    this.filteredColumnsMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredColumns are loaded initially
        // and after the mat-option elements are available
        this.multiSelect.compareWith = (a, b) => a && b && a.name === b.name;
      });
  }

  checkIfStatusExists (search: string): boolean {
    return this.arrayStatus.some(el => el.code === search);
  }

  async getColumnsFromExelaAuth () {
    let columns: any = await this.contractListService.getAttributeForContractList();
    return columns !== undefined ? columns.att_value : undefined;
  }

  @HostListener('window:resize', ['$event']) onResize (event) {
    if (this.currentScreenSize !== window.innerWidth) {
      this.currentScreenSize = window.innerWidth;
      this.calculateSize();
    }
  }

  calculateSize () {
    if (this.currentScreenSize < 800) {
      this.columnsTableForMobile = this.columnsTable;
      this.columnsTable = this.columnsTable.filter(column => {
        if (column.name === this.columnsTable[0].name) {
          column.cellTemplate = this.firstColumnTemplate;
          column.headerTemplate = this.firstHeaderTemplate;
          column.sortable = false;
          return column;
        }
      });
    } else {
      this.columnsTable = this.columnsTableForMobile;
    }
  }

  showMore () {
    if (this.datatable.rowCount >= this.pageTable.limit) {
      this.pageTable.limit += 10;
      this.reloadTable();
    } else {
      this.toastr.info(
        'Info',
        'No more data to show!'
      );
    }
  }

}
