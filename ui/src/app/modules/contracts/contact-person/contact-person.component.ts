import { Component, OnInit, ViewChild, TemplateRef, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { MatTabGroup, MAT_TOOLTIP_DEFAULT_OPTIONS, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ContractService } from '../contracts.service';
import { ContactPersonService } from './contact-person.service';
import { SessionService } from '../../../modules/shared/providers/session.service';
import { customTooltipDefaults } from '../../../models/constants';
import { ToastrService } from 'ngx-toastr';
import { PopUpComponent } from '../../pop-up/pop-up.component';
import { FormControl } from '@angular/forms';
import { take, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject, ReplaySubject } from 'rxjs';
import { StorageService } from '../../shared/providers/storage.service';

@Component({
  selector: 'cm-contact-person',
  templateUrl: './contact-person.component.html',
  styleUrls: ['./contact-person.component.scss'],
  providers: [
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: customTooltipDefaults }
  ]
})

export class ContactPersonComponent implements OnInit {
  @ViewChild(DatatableComponent) datatable: DatatableComponent;
  @ViewChild('sortableHeaderTemplate') sortableHeaderTemplate: TemplateRef<any>;
  @ViewChild('actionColumnTemplate') actionColumnTemplate: TemplateRef<any>;
  @Input() matgroup: MatTabGroup;
  @Input() generalInfoLocation: string;
  @Output() isDirty: EventEmitter<boolean> = new EventEmitter();

  customizeMenuFilter: FormControl = new FormControl();
  customizeMenuSelect: FormControl = new FormControl();

  protected _onDestroy = new Subject<void>();

  public filteredColumnsMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  columnsTable = [];
  rowsTable = [];
  tempRowsTable = [];
  customizeColumns = [];

  columnListFromExela: any[] = [];

  transferData: any;

  showPanels: any = {
    tablePanel: true,
    addPanel: false
  };

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

  @ViewChild('multiSelect') multiSelect;
  constructor (
    private router: Router,
    private contractService: ContractService,
    private contactPersonService: ContactPersonService,
    private changeDetectorRef: ChangeDetectorRef,
    private toastr: ToastrService,
    private matDialog: MatDialog) {
  }

  myMessages = {
    emptyMessage: '<img src="../../../../assets/images/no_data_found.png">',
    totalMessage: 'Displaying item '
  };

  ngAfterViewInit () {
    this.setInitialValue();
  }

  async ngOnInit () {
    this.columnListFromExela = await this.getColumnsFromExelaAuth();
    this.initDataTable();
    this.fetchDataForTable();

    if (this.columnListFromExela) {
      this.customizeMenuSelect.setValue(this.customizeColumns.filter(column => {
        return this.columnListFromExela.indexOf(column.name) > -1;
      }));
    } else {
      this.customizeMenuSelect.setValue(this.customizeColumns);
    }

    this.filteredColumnsMulti.next(this.customizeColumns.slice());

    this.customizeMenuFilter.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterColumns();
      });
  }

  initDataTable () {
    this.columnsTable = [
      {
        name: 'Function',
        prop: 'function',
        customizeName: 'Function',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplate,
        resizeable: false,
        minWidth: 100
      },
      {
        name: 'Person',
        prop: 'person',
        customizeName: 'Person',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplate,
        resizeable: false,
        minWidth: 90
      },
      {
        name: 'EMAIL ID',
        prop: 'email',
        customizeName: 'EMAIL ID',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplate,
        cellTemplate: '',
        resizeable: false,
        minWidth: 90
      },
      {
        name: 'Country',
        prop: 'country_name',
        customizeName: 'Country',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplate,
        cellTemplate: '',
        resizeable: false,
        minWidth: 90
      },
      {
        name: 'Country Code',
        prop: 'country_phone_code',
        customizeName: 'Country Code',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplate,
        cellTemplate: '',
        resizeable: false,
        minWidth: 90
      },
      {
        name: 'Phone Number',
        prop: 'phone_number',
        customizeName: 'Phone Number',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplate,
        cellTemplate: '',
        resizeable: false,
        minWidth: 90
      },
      {
        name: 'ACTION',
        prop: 'action',
        customizeName: 'ACTION',
        sortable: false,
        cellTemplate: this.actionColumnTemplate,
        resizeable: false,
        minWidth: 90
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
      userAttributes.push({ att_name: 'contact-person-columns', att_value: columnNames });
      this.contractService.addOrUpdateAttribute(StorageService.get(StorageService.userId), userAttributes);
    }
  }

  isChildDirty (changed: boolean) {
    this.isDirty.emit(changed);
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

  // ------- Fetch data --------
  fetchDataForTable () {
    if (this.contractService.contractId === '0') {
      return;
    }
    let urlParams = {
      contractId: `${this.contractService.contractId}`
    };
    this.contactPersonService.getAllContactPersonForContract(urlParams).subscribe((data: any) => {
      this.pageTable.count = data.count;
      this.rowsTable = data.rowsTable;
      this.tempRowsTable = [...data.rowsTable];
      this.changeDetectorRef.markForCheck();
    });
  }
  // ------ End fetch data --------

  // ------- Filter table ---------
  updateFilter (event, propName) {
    const val = event.target.value.toLowerCase();
    if (val) {
      const tempRowsTable = this.tempRowsTable.filter(d => {
        if (!propName.includes('.') && d[propName]) {
          return (
            d[propName]
              .toString()
              .toLowerCase()
              .indexOf(val) !== -1 || !val
          );
        } else {
          // in case we have object
          let objectPro = d[propName.substring(0, propName.indexOf('.'))];
          if (objectPro) {
            return (
              objectPro[propName.substring(propName.indexOf('.') + 1)]
                .toLowerCase()
                .indexOf(val) !== -1 || !val
            );
          }
        }
      });
      this.rowsTable = tempRowsTable;
      this.datatable.offset = 0;
    } else {
      this.rowsTable = this.tempRowsTable;
      this.datatable.offset = 0;
    }
  }
  // -------- End filter table -------

  onLimitChange (value) {
    this.pageTable.limit = value;
    this.pageTable.offset = 0;
  }

  openPanel (row: any) {
    if (row != null) {
      this.transferData = {
        data: {
          function: row.function,
          person: row.person ,
          email: row.email,
          countryName: row.country_name,
          countryCode: row.country_code,
          countryPhoneCode: row.country_phone_code,
          phoneNumber: row.phone_number,
          idContactPerson: row._id,
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

  togglePanel () {
    this.showPanels.addPanel = this.showPanels.tablePanel;
    this.showPanels.tablePanel = !this.showPanels.tablePanel;
    if (this.showPanels.tablePanel) {
      this.fetchDataForTable();
    }
  }

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

  openDialogForDeleteConfirmation (row) {
    if (row === undefined) {
      return;
    }
    let data = {
      'message': 'Are you sure you want to delete?',
      'heading': 'Contact Person',
      'row': row,
      'component': 'contactPerson',
      'yes': 'Yes',
      'no': 'Cancel'
    };

    const dialogRef = this.matDialog.open(PopUpComponent, {
      width: '450px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result && result.row && result.component === 'contactPerson') {
          this.deleteContactPerson(result.row);
        }
      }
    });

  }

  deleteContactPerson (row) {
    let urlParams = {
      contractId: `${this.contractService.contractId}`,
      contactPersonId: `${row._id}`
    };

    this.contactPersonService.deleteContactPerson(urlParams).subscribe((response: any) => {
      if (response.status === '500') {
        this.toastr.error('Error', 'Something went wrong');
      } else {
        this.toastr.success('Operation Complete', 'Contact Person successfully deleted');
        this.fetchDataForTable();
      }
    });
  }

  changePage (e: any) {
    this.pageTable.offset = e.page - 1;
    this.datatable.onFooterPage(e);
  }

  saveAndContinueTableContactPerson () {
    this.matgroup.selectedIndex += 1;
    this.toastr.success('Operation Complete', 'Contact Persons successfully updated');
  }

  cancel () {
    let base = SessionService.get('base-role');
    this.router.navigate([base + '/dashboard/events-and-reminders']).then(nav => {
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
    userAttributes.push({ att_name: 'contact-person-columns', att_value: columnNames });
    this.contractService.addOrUpdateAttribute(StorageService.get(StorageService.userId), userAttributes);

  }

  isCheckedToggleColumn (col) {
    return this.columnsTable.find(c => {
      return c.prop === col.prop;
    });
  }

  async getColumnsFromExelaAuth () {
    let columns: any = await this.contractService.getAttributeForContractList();
    return columns !== undefined ? columns.att_value : undefined;
  }
}
