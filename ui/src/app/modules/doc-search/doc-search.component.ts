import { Component, OnInit, Input, ViewChild, TemplateRef, OnDestroy, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { HttpParams } from '@angular/common/http';
import { DocSearchService } from './doc-search.service';
import { ToastrService } from 'ngx-toastr';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ExcelService } from '../excel/excel.service';
import { HashMap } from '@nebtex/hashmaps';
import * as jsPDF from 'jspdf';
import { Router } from '@angular/router';
import { ContractService } from '../contracts/contracts.service';
import { SessionService } from '../shared/providers/session.service';
import { MatDatepicker, MAT_TOOLTIP_DEFAULT_OPTIONS, MatDialog } from '@angular/material';
import { customTooltipDefaults } from 'src/app/models/constants';
import { PopUpComponent } from '../pop-up/pop-up.component';
import { DatePipe } from '@angular/common';
import { environment } from '../../../environments/environment';
import { FormControl } from '@angular/forms';
import { take, takeUntil, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ReplaySubject, Subject } from 'rxjs';
import { StorageService } from '../shared/providers/storage.service';
import { UpdateCommentDialogComponent } from './doc-history/dialog-components/update-comment-dialog/update-comment-dialog.component';

@Component({
  selector: 'app-doc-search',
  animations: [
    trigger('slideInOut', [
      state('in', style({
        overflow: 'hidden',
        height: '*'
      })),
      state('out', style({
        overflow: 'hidden',
        height: '0'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))])
  ],
  templateUrl: './doc-search.component.html',
  styleUrls: ['./doc-search.component.scss'],
  providers: [
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: customTooltipDefaults },DatePipe
  ]
})
export class DocSearchComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(DatatableComponent) datatable: DatatableComponent;
  @ViewChild('sortableHeaderTemplateInput') sortableHeaderTemplateInput: TemplateRef<any>;
  @ViewChild('actionColumn') actionColumn: TemplateRef<any>;
  @ViewChild('statusColumnTemplate') statusColumnTemplate: TemplateRef<any>;
  @ViewChild('fileColumnTemplate') fileColumnTemplate: TemplateRef<any>;
  @ViewChild('dateColumnTemplate') dateColumnTemplate: TemplateRef<any>;
  @ViewChild('sortableHeaderTemplateStartDate') sortableHeaderTemplateStartDate: TemplateRef<any>;
  @ViewChild('sortableHeaderTemplateEndDate') sortableHeaderTemplateEndDate: TemplateRef<any>;
  @ViewChild('sortableHeaderTemplateSelectStatus') sortableHeaderTemplateSelectStatus: TemplateRef<any>;
  @ViewChild('sortableHeaderTemplateSelectDocType') sortableHeaderTemplateSelectDocType: TemplateRef<any>;
  @ViewChild('textHeaderTemplate') textHeaderTemplate: TemplateRef<any>;
  @ViewChild('firstHeaderTemplate') firstHeaderTemplate: TemplateRef<any>;
  @ViewChild('textColumnTemplate') textColumnTemplate: TemplateRef<any>;
  @ViewChild('firstColumnTemplate') firstColumnTemplate: TemplateRef<any>;

  @ViewChild('chkBxTmpl') chkBxTmpl: TemplateRef<any>;
  @ViewChild('chkBxTmplCell') chkBxTmplCell: TemplateRef<any>;

  @Input() selectedCategories: string;
  @Input() selectedSubCategories: string;
  selectedStatusFilter = '-1';
  selectedDocTypeFilter = '';
  fileSrc: string;

  headerCheckBox: boolean = false;

  @ViewChild('startDatePicker') startDatePicker: MatDatepicker<any>;
  @ViewChild('endDatePicker') endDatePicker: MatDatepicker<any>;

  breadcrumbs: Array<any> = [
    {
      text: 'Doc Search',
      base: true,
      active: true
    }
  ];

  isLoading = true;
  slideIn: boolean = false;

  arrayCategories = [];
  arraySubCategories = [];
  arrayStatus = [];
  arrayDocTypes = [];

  columnsTable = [];
  columnsTableForMobile = [];

  customizeColumns = [];
  columnListFromExela: any[] = [];

  currentScreenSize;

  tempRowsTable = [];
  rowsTable = [];

  myMessages = {
    'emptyMessage': '<img src="../../../../assets/images/no_data_found.png">',
    'totalMessage': 'Displaying item '
  };

  pageTable = {
    limit: 10,
    count: 0,
    offset: 0,
    orderBy: '',
    sortDirection: '',
    hashMapPropNameFilterSearch: new HashMap()
  };

  public readonly pageLimitOptions = [
    { value: 10 },
    { value: 20 },
    { value: 30 },
    { value: 40 },
    { value: 50 }
  ];

  customizeMenuFilter: FormControl = new FormControl();
  customizeMenuSelect: FormControl = new FormControl();
  searchTextGlobal = new FormControl();
  /** list of columns filtered by search keyword */
  public filteredColumnsMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();
  @ViewChild('multiSelect') multiSelect;

  constructor (
    private router: Router,
    private contractService: ContractService,
    private docSearchService: DocSearchService,
    private toastr: ToastrService,
    private excelService: ExcelService,
    private matDialog: MatDialog,
    private datePipe: DatePipe,
    private elRef: ElementRef
    ) {

  }

  async ngOnInit () {
    this.currentScreenSize = window.innerWidth;
    this.columnListFromExela = await this.getColumnsFromExelaAuth();

    this.initDataTable();
    if (this.currentScreenSize < 800) {
      this.calculateSize();
    }
    this.pageCallback({ offset: 0 });

    this.contractService.getClientCategories().subscribe((res: any) => {
      this.arrayCategories = res;

      this.createSubCategories();
    });

    this.contractService.getAllStatus().subscribe((res: any) => {
      this.arrayStatus = res;
    });

    this.contractService.getAllDocumentTypes().subscribe((res: any) => {
      this.arrayDocTypes = res;
    });

    if (this.columnListFromExela) {
      this.customizeMenuSelect.setValue(this.customizeColumns.filter(column => {
        return this.columnListFromExela.indexOf(column.name) > -1;
      }));
    } else {
      this.customizeMenuSelect.setValue(this.customizeColumns);
    }
    this.filteredColumnsMulti.next(this.customizeColumns.filter(p => p.name).slice());
    // listen for search field value changes
    this.customizeMenuFilter.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
      this.filterColumns();
    });

    this.searchTextGlobal.valueChanges
    .pipe(debounceTime(1000), distinctUntilChanged())
    .subscribe((value) => {
      this.reloadTable();
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
        name: 'BUSINESS PARTNER',
        customizeName: 'Business partner',
        prop: 'business_partner.name',
        searchName: 'businessPartnerName',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplateInput,
        cellTemplate: this.textColumnTemplate,
        resizeable: false,
        minWidth: 120
      },
      {
        name: 'DOC TYPE',
        prop: 'documents.type.name',
        customizeName: 'Doc Type',
        filterCode: 'docTypeCode',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplateSelectDocType,
        cellTemplate: this.textColumnTemplate,
        resizeable: false,
        minWidth: 100
      },
      {
        name: 'CONTRACT TITLE',
        prop: 'contract_title',
        customizeName: 'Contract Title',
        searchName: 'contractTitle',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplateInput,
        cellTemplate: this.fileColumnTemplate,
        resizeable: false,
        minWidth: 120
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
        minWidth: 80
      },
      {
        name: 'CONTRACT OWNER',
        prop: 'owner',
        customizeName: 'Contract Owner',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplateInput,
        cellTemplate: this.textColumnTemplate,
        resizeable: false,
        minWidth: 130
      },
      {
        name: 'LEGAL ENTITY',
        prop: 'legal_entity.name',
        customizeName: 'Legal Entity',
        searchName: 'legalEntity',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplateInput,
        cellTemplate: this.textColumnTemplate,
        resizeable: false,
        minWidth: 100
      },
      {
        name: 'STATUS',
        prop: 'documents.status.name',
        customizeName: 'Status',
        filterCode: 'statusCode',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplateSelectStatus,
        cellTemplate: this.statusColumnTemplate,
        resizeable: false,
        minWidth: 100,
        maxWidth: 100
      },
      {
        name: 'ACTION',
        prop: 'action',
        customizeName: 'Action',
        sortable: false,
        cellTemplate: this.actionColumn,
        headerTemplate: this.textHeaderTemplate,
        resizeable: false,
        minWidth: 100,
        maxWidth: 110
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
      this.docSearchService.addOrUpdateAttribute(StorageService.get(StorageService.userId), userAttributes);
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
    this.reloadTable();
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
    this.reloadTable();
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

    if (this.searchTextGlobal.value) {
      queryParams = queryParams.append('globalParam', this.searchTextGlobal.value);
      const columnsForGlobalSearch = this.columnsTable.map(p => {
        if (p.name) return p.prop.trim();
      });
      queryParams = queryParams.append('columnsForGlobalSearch', columnsForGlobalSearch.join());
    }

    this.docSearchService.searchDocSearchContractsDocuments(queryParams).subscribe((data: any) => {
      this.rowsTable = data.docs;
      this.rowsTable.forEach(item => {
        item.checked = this.headerCheckBox;
      });
      this.pageTable.count = data.totalDocs;
      this.isLoading = false;
    });
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

  showHistory (rootId: any, currentDocumentId: any) {
    let base = SessionService.get('base-role');
    this.router.navigate([base + '/contracts/doc-search/doc-history'],
      {
        queryParams: {
          'rootId': rootId ? rootId : currentDocumentId,
          'id': currentDocumentId
        }
      }
    ).then(nav => {
      console.log(nav);
    }, err => {
      console.log(err);
    });
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
      this.customizeColumns.forEach((f) => {
        newColumns.forEach((s) => {
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
    userAttributes.push({ att_name: 'doc-search-columns', att_value: columnNames });
    this.docSearchService.addOrUpdateAttribute(StorageService.get(StorageService.userId), userAttributes);
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
    userAttributes.push({ att_name: 'doc-search-columns', att_value: columnNames });
    this.docSearchService.addOrUpdateAttribute(StorageService.get(StorageService.userId), userAttributes);

  }

  filterDate (event, propName) {
    if (event.target.value) {
      this.actionChangeHashMapPropNameFilterSearch(event.target.value.toISOString(), propName);
      this.pageTable.offset = 0;
      this.reloadTable();
    }
  }

  filterCallback (event, propName) {
    let searchPropValue = propName.includes('Code') ?
    event.target.value : event.target.value.toString().toLowerCase();

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

  openDialogForDeleteConfirmation (row) {
    if (row === undefined) {
      if (this.rowsTable.filter(row => row.checked === true).length === 0) {
        alert('Please select at least one row!');
        return;
      }
    }
    let data = {
      'message': 'Are you sure you want to delete?',
      'heading': 'Delete Document',
      'row': row,
      'component': 'doc-search',
      'yes': 'Yes',
      'no': 'Cancel'
    };

    const dialogRef = this.matDialog.open(PopUpComponent, {
      width: '450px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result && result.row && result.component === 'doc-search') {
          this.deleteContractDocument(result.row);
        } else if (result.component === 'doc-search') {
          this.deleteContractsDocuments();
        }
      }
    });
  }

  deleteContractDocument (row: any) {
    let urlParams = {
      contractId: `${row._id}`,
      documentId: `${row.documents._id}`
    };
    this.docSearchService.deleteContract(urlParams).subscribe((response: any) => {
      if (response.status === '500') {
        this.toastr.error('Error','Documents not deleted!!!');
      } else {
        this.toastr.success('Operation Complete','Documents successfully deleted');
        this.reloadTable();
      }
    });
  }

  deleteContractsDocuments () {
    if (this.rowsTable.filter(row => row.checked === true).length === 0) {
      alert('Please select atleast one row!');
    } else {
      let contractDocHashMap = new HashMap<any,any[]>();
      for (let row of this.rowsTable.filter(row => row.checked === true)) {
        let v = [];
        if (contractDocHashMap.has(row._id)) {
          v = contractDocHashMap.get(row._id);
        }
        v.push(row.documents._id);
        contractDocHashMap.set(row._id, v);

      }
      // const contractsIds = this.selectedRowsTable.map(doc => doc._id).join(",");
      let o = Object.create(null);
      let newArray = [];
      contractDocHashMap.forEach((value,key,theHashMap) => {
        let o = Object.create(null);
        o['key'] = key;
        o['value'] = value;
        newArray.push(o);
      });

      this.docSearchService.deleteContractsDocuments(newArray).subscribe((response: any) => {
        if (response.status === '500') {
          this.toastr.error('Error','Documents not deleted!!!');
        } else {
          this.toastr.success('Operation Complete','Documents successfully deleted');
          this.reloadTable();
        }
      });
    }
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

  filterCategoriesAndCreateSubCategories () {
    if (this.selectedCategories !== '-1') {
      this.arraySubCategories = this.arrayCategories.find(cat =>
        cat.code === this.selectedCategories).sub_categories;
    } else {
      this.createSubCategories();
    }
    this.actionChangeHashMapPropNameFilterSearch(this.selectedCategories, 'categoryCode');

    this.pageTable.offset = 0;
    this.reloadTable();
  }

  filterSubCategories () {
    this.actionChangeHashMapPropNameFilterSearch(this.selectedSubCategories, 'subCategoryCode');

    this.pageTable.offset = 0;
    this.reloadTable();
  }

  createSubCategories () {
    for (let i = 0; i < this.arrayCategories.length; i++) {
      this.arraySubCategories = this.arraySubCategories.concat(this.arrayCategories[i].sub_categories);
    }
  }

  // TODO: Refactor

  generateExcelFile (row: any) {
    let header = this.customizeColumns.filter(head => head.name !== null && head.name !== 'ACTION' && head.name.length > 0).map(head => head.name);
    let array = [];
    array.push([row.business_partner.name,
      row.contract_type.name,
      row.contract_title,
      row.term ? new Date(row.term.start_date).toLocaleDateString('en-US') : '',
      row.term ? new Date(row.term.end_date).toLocaleDateString('en-US') : '',
      row.owner,
      row.legal_entity.name,
      row.status]);

    this.excelService.generateExcel(header, array,'Contract');
  }

  generateExcelFiles () {
    if (this.rowsTable.filter(row => row.checked === true).length < 1) {
      this.toastr.warning('Choose documents','You need to check at least 1 document!');
      return;
    }

    let header = this.columnsTable.filter(head => head.name != null && head.name !== 'ACTION' && head.name.length > 0).map(head => head.name);
    let fixedRows = [];
    this.rowsTable.filter(row => row.checked === true).forEach(row => {
      let tempArray = [];

      if (header.includes('BUSINESS PARTNER')) tempArray.push(row.business_partner !== undefined && row.business_partner !== null && row.business_partner.name !== undefined ? row.business_partner.name : 'N/A');
      if (header.includes('DOC TYPE')) tempArray.push(row.documents.type !== undefined && row.documents.type !== null && row.documents.type.name !== undefined ? row.documents.type.name : 'N/A');
      if (header.includes('CONTRACT TITLE')) tempArray.push(row.contract_title);
      if (header.includes('START DATE')) tempArray.push((row.term !== undefined && row.term !== null && row.term.start_date ? this.datePipe.transform(row.term.start_date,'MM/dd/yyyy') : 'N/A'));
      if (header.includes('END DATE')) tempArray.push((row.term !== undefined && row.term !== null && row.term.end_date ? this.datePipe.transform(row.term.end_date,'MM/dd/yyyy') : 'N/A'));
      if (header.includes('CONTRACT OWNER')) tempArray.push(row.owner === undefined ? 'N/A' : row.owner);
      if (header.includes('LEGAL ENTITY')) tempArray.push(row.legal_entity !== undefined && row.legal_entity !== null && row.legal_entity.name !== undefined ? row.legal_entity.name : 'N/A');
      if (header.includes('STATUS')) tempArray.push(row.documents.status !== undefined && row.documents.status !== null && row.documents.status.name !== undefined ? row.documents.status.name : 'N/A');

      fixedRows.push(tempArray);
    });
    this.excelService.generateExcel(header,fixedRows,'Contracts');
  }

  generatePDF () {
    if (this.rowsTable.filter(row => row.checked === true).length < 1) {
      this.toastr.warning('Choose documents','You need to check at least 1 document!');
      return;
    }

    let doc = new jsPDF();
    let i = 1;
    let start = 20;
    let step = 10;
    this.rowsTable.filter(row => row.checked === true).forEach(element => {
      doc.setFontSize(24);
      doc.text('Contract NO ' + i,20,start + step);
      step += 10;

      doc.setFontSize(14);
      doc.text('BUSINESS PARTNER: ' + (element.business_partner !== undefined && element.business_partner !== null && element.business_partner.name !== undefined ? element.business_partner.name : 'N/A'), 30, start + step);
      step += 10;

      doc.text('DOC TYPE: ' + (element.documents.type !== undefined && element.documents.type !== null && element.documents.type.name !== undefined ? element.documents.type.name : 'N/A'), 30, start + step);
      step += 10;

      doc.text('CONTRACT TITLE: ' + element.contract_title, 30, start + step);
      step += 10;

      doc.text('START DATE: ' + (element.term !== undefined && element.term !== null && element.term.start_date != null ? this.datePipe.transform(element.term.start_date,'MM/dd/yyyy') : 'N/A'), 30, start + step);
      step += 10;

      doc.text('END DATE: ' + (element.term !== undefined && element.term !== null && element.term.end_date != null ? this.datePipe.transform(element.term.end_date,'MM/dd/yyyy') : 'N/A'), 30, start + step);
      step += 10;

      doc.text('CONTRACT OWNER: ' + (element.owner !== undefined ? element.owner : 'N/A'), 30, start + step);
      step += 10;

      doc.text('LEGAL ENTITY: ' + (element.legal_entity !== undefined && element.legal_entity !== null && element.legal_entity.name !== undefined ? element.legal_entity.name : 'N/A'), 30, start + step);
      step += 10;

      doc.text('STATUS: ' + (element.documents.status !== undefined && element.documents.status !== null && element.documents.status.name !== undefined ? element.documents.status.name : 'N/A'), 30, start + step);
      step += 10;

      i++;
    });
    doc.save('Contract.pdf');
  }

  getUploadedDocument (idDocumentEfaReference: string, documentName: string, isView: boolean, fileType: string): void {
    if (!idDocumentEfaReference) {
      this.toastr.warning('Document','Document is not stored!');
    } else {
      let queryParams = new HttpParams()
                .set('documentEfaReferenceId', `${idDocumentEfaReference}`)
                .set('documentName', `${documentName}`)
                .set('isView', `${isView}`)
                .set('fileType', `${fileType}`);
      this.docSearchService.getUploadedDocument(queryParams, 'blob').subscribe((response: any) => {
        if (response.status === 200) {
          if (isView) {
            this.viewFileBlob(response.body, documentName, fileType);
          } else {
            this.downloadFileBlob(response.body, documentName);
          }
        } else {
          this.toastr.error(`Problem with downloading file ${response.error}`);
        }
      }, error => {
        this.toastr.error(`Problem with downloading file ${error}`);
      });
    }
  }

  downloadFileBlob (blob, fileName) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.append(link);
    link.click();
    link.remove();
    window.addEventListener('focus', e => URL.revokeObjectURL(link.href), { once: true });
  }

  viewFileBlob (fileBlob, documentName, fileType) {
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      let blob = new Blob([fileBlob], { type: fileType });
      window.navigator.msSaveOrOpenBlob(blob, documentName);
    } else {// other browsers
      const file = new File([fileBlob], documentName, { type: fileType });
      const currentUrl = window.location.href;
      const newWindow = window.open(`${currentUrl.substr(0, currentUrl.lastIndexOf('/'))}/loading`);
      newWindow.onload = () => {
        newWindow.location.assign(URL.createObjectURL(file));
      };
    }
  }

  getUploadedDocumentsZip (): void {
    if (this.rowsTable.filter(row => row.checked === true).length === 0) {
      alert('Please select at least one row!');
    } else {
      let arrayDocumentEfaReferenceIds = [];
      let arrayDocumentNames = [];
      for (const row of this.rowsTable.filter(row => row.checked === true)) {
        arrayDocumentEfaReferenceIds.push(row.documents.id_document_efa_reference);
        arrayDocumentNames.push(row.documents.name_document_efa);
      }
      let queryParams = new HttpParams()
      .set('documentEfaReferenceIds', `${arrayDocumentEfaReferenceIds}`)
      .set('documentNames', `${arrayDocumentNames}`);
      this.docSearchService.getUploadedDocumentInZip(queryParams, 'blob').subscribe((response: any) => {
        if (response.status === 200) {
          this.downloadFileBlob(response.body, 'downloadCM');
        } else {
          this.toastr.error(`Problem with downloading file ${response.error}`);
        }
      }, error => {
        this.toastr.error(`Problem with downloading file ${error}`);
      });
    }
  }

  resetAdvSearch (): void {
    this.clearAllDynamicInputs();
    this.searchTextGlobal.setValue('');
    this.selectedDocTypeFilter = '';
    this.selectedStatusFilter = '-1';
    this.selectedCategories = '-1';
    this.selectedSubCategories = '-1';
    this.pageTable.hashMapPropNameFilterSearch.clear();
    if (this.startDatePicker) this.startDatePicker.select(undefined);
    if (this.endDatePicker) this.endDatePicker.select(undefined);
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

  updateComment (row, titleText): void {
    const dialogRef = this.matDialog.open(UpdateCommentDialogComponent, {
      width: '475px',
      height: 'auto',
      data: {
        row: row.documents,
        titleText
      }
    });
    dialogRef.componentInstance.onCreateComment.subscribe((res) => {
      // this.commentCreated.emit();
      this.reloadTable();
    });
  }

  async getColumnsFromExelaAuth () {
    let columns: any = await this.docSearchService.getAttributeForContractList();
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
        if (column.name === this.columnsTable[this.columnsTable[0].name !== '' ? 0 : 1].name) {
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

  filterOutCheckBox () {
    return this.columnsTableForMobile.filter(column => column.name !== '');
  }
}
