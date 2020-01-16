import { Component, OnInit, Input, ViewChild, TemplateRef, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Pattern } from 'src/app/models/util/pattern.model';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ContractsMetaService } from '../../../contracts-meta.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/modules/shared/providers/storage.service';
import { MatTabGroup } from '@angular/material';

@Component({
  selector: 'cm-contracts-meta-tab-subtab-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class ContractsMetaMatSubtabTableComponent implements OnInit {

  customizeMenuFilter: FormControl = new FormControl();
  customizeMenuSelect: FormControl = new FormControl();
  /** list of columns filtered by search keyword */
  public filteredColumnsMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();
  @ViewChild('multiSelect') multiSelect;

  @ViewChild(DatatableComponent) datatable: DatatableComponent;
  @ViewChild('sortableHeaderTemplate') sortableHeaderTemplate: TemplateRef<any>;
  @ViewChild('actionColumnTemplate') actionColumnTemplate: TemplateRef<any>;
  @ViewChild('dateCellTemplate') dateCellTemplate: TemplateRef<any>;

  @Input('matGroupTab') matGroupTab: MatTabGroup;
  @Input('matGroupSubTab') matGroupSubTab: MatTabGroup;

  columnsTable = [];
  rowsTable = [];
  tempRowsTable = [];
  customizeColumns = [];

  pageTable = {
    limit: 10,
    count: 0,
    offset: 0
  };

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

  @Input() addContractMetaModelId: String;
  @Input() addContractMetaModelTabId: String;
  @Input() tab: any;
  @Input() subtab: any;
  @Input() oneSubtab: Boolean;
  arrayComponents: any[];

  showPanels: any = {
    tablePanel: true,
    addPanel: false
  };
  transferData: any;

  @Output() isDirty: EventEmitter<boolean> = new EventEmitter();

  constructor (
    private toastr: ToastrService,
    private cd: ChangeDetectorRef,
    private contractsMetaService: ContractsMetaService,
    private router: Router
  ) {}

  ngOnInit () {
    this.initDataTable();
    if (!this.contractsMetaService.addMode) {
      this.fetchDataForTable();
    }
  }

  initDataTable (): void {
    this.arrayComponents = this.subtab['components'].filter(el => {
      return (el.hasOwnProperty('is_deleted') && !el.is_deleted);
    });
    this.arrayComponents.forEach((element, index) => {
      if (element.is_visible_form) {
        const prop = element.database_column_name.endsWith('_code') ? `${element.database_column_name.replace('_code', '')}.name` : element.database_column_name;
        this.columnsTable.push(
          {
            name: element.name,
            prop: prop,
            sortable: true,
            headerTemplate: this.sortableHeaderTemplate,
            cellTemplate: element.type === 'Datepicker' ? this.dateCellTemplate : '',
            resizeable: false,
            isVisibleColumn: index < 5,
            minWidth: 150
          }
        );
      }
    });
    this.columnsTable.push(
      {
        name: 'ACTION',
        prop: 'action',
        sortable: false,
        cellTemplate: this.actionColumnTemplate,
        isVisibleColumn: true,
        resizeable: false,
        minWidth: 90
      }
    );

    this.customizeColumns = this.columnsTable;
    this.columnsTable = this.columnsTable.filter(column => {
      return column.isVisibleColumn;
    });

    this.customizeMenuSelect.setValue(this.columnsTable);
    this.filteredColumnsMulti.next(this.customizeColumns.filter(p => p.name).slice());
    // listen for search field value changes
    this.customizeMenuFilter.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterColumns();
      });
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
      this.customizeColumns.filter(col => col.name.toLowerCase().indexOf(search) > -1)
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
  }

  isCheckedToggleColumn (col) {
    return this.columnsTable.find(c => {
      return c.prop === col.prop;
    });
  }

  togglePanel () {
    this.showPanels.addPanel = this.showPanels.tablePanel;
    this.showPanels.tablePanel = !this.showPanels.tablePanel;
    if (this.showPanels.tablePanel) {
      this.fetchDataForTable();
    }
    this.cd.markForCheck();
  }

  isDirtyChild (changed: boolean) {
    this.isDirty.emit(changed);
  }

// ------- Fetch data --------
  fetchDataForTable () {
    const tabObject = this.contractsMetaService.contractData ? this.contractsMetaService.contractData[this.tab.name_tab_object] : [];
    const subtabObject = tabObject && tabObject[this.subtab.name_subtab_object] ? tabObject[this.subtab.name_subtab_object] : null;
    if (tabObject && this.tab.name_tab_object === 'documents') {
      this.pageTable.count = tabObject.length;
      this.rowsTable = tabObject;
      this.tempRowsTable = [...this.rowsTable];
      this.cd.markForCheck();
    } else {
      if (subtabObject) {
        this.pageTable.count = subtabObject.length;
        this.rowsTable = subtabObject;
        this.tempRowsTable = [...this.rowsTable];
        this.cd.markForCheck();
      }
    }
  }
// ------ End fetch data --------

// ------- Filter table ---------
  updateFilter (event, propName) {
    const val = event.target.value.toLowerCase();
    let tempRowsTable;
    tempRowsTable = this.tempRowsTable.filter((d) => {
      if (!propName.includes('.')) {
        return d[propName].toString().toLowerCase().indexOf(val) !== -1 || !val;
      } else {// in case we have object
        let objectPro = d[propName.substring(0,propName.indexOf('.'))];
        return objectPro[propName.substring(propName.indexOf('.') + 1)].toLowerCase().indexOf(val) !== -1 || !val;
      }
    });
    this.rowsTable = tempRowsTable;
    this.datatable.offset = 0;
  }
// -------- End filter table -------

  cancel (): void {
    let base = StorageService.get('base-role');
    this.router.navigate([base + '/dashboard/events-and-reminders']).then(nav => {
      console.log(nav);
    }, err => {
      console.log(err);
    });
  }

  saveAndContinueContract (): void {
    if (this.matGroupSubTab) {
      if (this.matGroupSubTab._tabs.last.isActive) {
        this.matGroupTab.selectedIndex += 1;
      } else {
        this.matGroupSubTab.selectedIndex += 1;
      }
    } else {
      this.matGroupTab.selectedIndex += 1;
    }
    this.isDirty.emit(false);
  }

  openPanel (row: any): void {
    if (row != null) {
      this.transferData = {
        data: {
          ...row,
          update: true
        }
      };
    } else {
      this.transferData = {
        data: {
          update: false
        }
      };
    }
    this.togglePanel();
  }

  copyItem (row: any): void {

  }

  openDialogForDeleteConfirmation (row: any) {
    const params = {
      contractId: this.contractsMetaService.contractId,
      uuid: row.uuid
    };
    const query = {
      tab: this.tab.name_tab_object,
      subtab: this.subtab.name_subtab_object
    };
    this.contractsMetaService.deleteContractMetaProp(params, query)
      .subscribe((res: any) => {
        this.contractsMetaService.contractData = res;
        this.contractsMetaService.contractId = res._id;
        this.fetchDataForTable();
      });
  }

  deleteDocument (row) {
    let urlParams = {
      contractId: `${this.contractsMetaService.contractId}`,
      documentId: `${row._id}`
    };
    this.contractsMetaService.deleteDocument(urlParams).subscribe((response: any) => {
      if (response.status === '500') {
        this.toastr.error('Error', 'Something went wrong');
      } else {
        this.toastr.success('Operation Complete', 'Document successfully deleted');
        this.contractsMetaService.contractData = response;
        this.contractsMetaService.contractId = response._id;
        this.fetchDataForTable();
      }
    },
      error => {
        console.log(error);
        this.toastr.error(
          'Error',
          'Something went wrong(Cannot delete document)'
        );
      }
    );
  }

  onInputPageChange (value) {
    if (value === '') {
      this.pageTable.offset = 0;
    } else if (isNaN(value)) {
      this.toastr.error(
        'Error',
        'You can only enter numeric'
      );
    } else {
      const numberPages = Math.ceil(this.datatable.rowCount / this.datatable.limit);
      if (numberPages >= value && value > 0) {
        this.pageTable.offset = value - 1;
      } else {
        this.toastr.error(
          'Error',
          'Page that you enter does not exist!'
        );
      }
    }
  }
}
