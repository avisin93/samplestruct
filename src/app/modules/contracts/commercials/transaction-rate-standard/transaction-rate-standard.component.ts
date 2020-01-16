import { Component, OnInit, ViewChild, TemplateRef, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommercialsService } from '../commercials.service';
import { ContractService } from '../../contracts.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { MatTabGroup, MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from 'src/app/modules/shared/providers/session.service';
import { customTooltipDefaults } from 'src/app/models/constants';
import { AddTransactionRateStandardComponent } from './add-transaction-rate-standard/add-transaction-rate-standard.component';
import { PopUpComponent } from '../../../pop-up/pop-up.component';
import { ToastrService } from 'ngx-toastr';
import { IClientSpecific } from 'src/app/interfaces/client-specific.interface';

@Component({
  selector: 'cm-transaction-rate-standard',
  templateUrl: './transaction-rate-standard.component.html',
  styleUrls: ['./transaction-rate-standard.component.scss'],
  providers: [
    AddTransactionRateStandardComponent,
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: customTooltipDefaults }
  ]
})
export class TransactionRateStandardComponent implements OnInit {
  @ViewChild(DatatableComponent) datatable: DatatableComponent;
  @ViewChild('sortableHeaderTemplate') sortableHeaderTemplate: TemplateRef<any>;
  @ViewChild('actionColumnTemplate') actionColumnTemplate: TemplateRef<any>;
  @ViewChild('rateColumnTemplate') rateColumnTemplate: TemplateRef<any>;
  @ViewChild('currencyColumnTemplate') currencyColumnTemplate: TemplateRef<any>;
  @Input() matgroupCommercials: MatTabGroup;
  @Input() generalInfoLocation: string;
  @Output() isDirty: EventEmitter<boolean> = new EventEmitter();

  columnsTable = [];
  rowsTable = [];
  tempRowsTable = [];

  transferData: any;

  showTable: boolean = true;
  showAdd: boolean = false;

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

  constructor (
    private router: Router,
    private commercialsService: CommercialsService,
    private contractService: ContractService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private matDialog: MatDialog,
    private toastr: ToastrService
  ) {

  }

  myMessages = {
    emptyMessage: '<img src="../../../../assets/images/no_data_found.png">',
    totalMessage: 'Displaying item '
  };

  ngOnInit () {
    this.initDataTable();
    this.fetchDataForTable();
  }

  initDataTable () {
    this.columnsTable = [
      {
        name: 'LINE ITEM',
        prop: 'line_item',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplate,
        resizeable: false,
        minWidth: 100
      },
      {
        name: 'UOM',
        prop: 'uom.name',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplate,
        resizeable: false,
        minWidth: 90
      },
      {
        name: 'RATE',
        prop: 'rate',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplate,
        cellTemplate: this.rateColumnTemplate,
        resizeable: false,
        minWidth: 90
      },
      {
        name: 'ACTION',
        prop: 'action',
        sortable: false,
        cellTemplate: this.actionColumnTemplate,
        resizeable: false,
        minWidth: 90
      }
    ];
  }

  // ------- Fetch data --------
  fetchDataForTable () {
    if (this.contractService.contractId === '0') {
      return;
    }
    let urlParams = {
      contractId: `${this.contractService.contractId}`
    };
    this.commercialsService.getAllTransactionRatesStandards(urlParams).subscribe((data: any) => {
      this.pageTable.count = data.count;
      this.rowsTable = data.rowsTable;
      this.tempRowsTable = [...data.rowsTable];
      this.cd.markForCheck();
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
          line_item: row.line_item,
          currency_contract_value_code: row.currency_contract_value ? row.currency_contract_value.code : '',
          rate: row.rate,
          uom_code: row.uom ? row.uom.code : '',
          billing_type_code: row.billing_type ? row.billing_type.code : '',
          billing_value: row.billing_value,
          effective_start_date: row.effective_start_date,
          effective_end_date: row.effective_end_date,
          reference_no: row.reference_no,
          related_ref_no: row.related_ref_no,
          linked_opportunity_code: row.linked_opportunity ? row.linked_opportunity.code : '',
          related_doc_code: '',
          platform_applicable: row.platform_applicable,
          service_code: row.service ? row.service.code : '',
          sub_service_code: row.sub_service ? row.sub_service.code : '',
          project_code: row.project ? row.project.code : '',
          sub_project_code: '',
          location: row.location,
          additional_reporting_fields: row.additional_reporting_fields,
          id_transaction_rate_standard: row._id,
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

  showPanels: any = {
    tablePanel: true,
    addPanel: false
  };

  togglePanel () {
    this.showPanels.addPanel = this.showPanels.tablePanel;
    this.showPanels.tablePanel = !this.showPanels.tablePanel;
    if (this.showPanels.tablePanel) {
      this.fetchDataForTable();
    }
  }

  isDirtyChild (changed: boolean) {
    this.isDirty.emit(changed);
  }

  openDialogToConfirmDelete (row) {
    let data = {
      'message': 'Are you sure you want to delete?',
      'row': row,
      'component': 'transaction-rate-standard',
      'yes': 'Yes',
      'no': 'Cancel'
    };

    const dialogRef = this.matDialog.open(PopUpComponent, {
      width: '450px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result !== undefined && result.component === 'transaction-rate-standard') {
          this.deleteTransactionRate(result.row);
        }
      }
    });
  }

  deleteTransactionRate (row) {
    let urlParams = {
      contractId: `${this.contractService.contractId}`,
      transactionRateStandardId: `${row._id}`
    };

    this.commercialsService.deleteTransactionRateStandard(urlParams).subscribe((response: any) => {
      if (response.status === '500') {
        console.log('Not able to delete');
        this.toastr.error('Not able to delete transaction rate standard.');
      } else {
        this.fetchDataForTable();
        this.toastr.success('Operation Complete', 'Transaction Rate Standard successfully deleted',{ timeOut: 0 });
      }
    });
  }

  changePage (e: any) {
    this.pageTable.offset = e.page - 1;
    this.datatable.onFooterPage(e);
  }

  saveAndContinueCommercialsTransRate () {
    this.matgroupCommercials.selectedIndex += 1;
    this.toastr.success('Operation Complete', 'Transaction Rate Standard successfully updated');
  }

  cancel () {
    let base = SessionService.get('base-role');
    this.router.navigate([base + '/dashboard/events-and-reminders']).then(nav => {
      console.log(nav);
    }, err => {
      console.log(err);
    });
  }

  copyItem (row) {
    const urlParams: any = {
      contractId: `${this.contractService.contractId}`
    };

    const objectTransactionRateStandard: any = {
      line_item: row.line_item,
      currency_contract_value_code: row.currency_contract_value ? row.currency_contract_value.code : '',
      rate: row.rate,
      uom_code: row.uom ? row.uom.code : '',
      billing_type_code: row.billing_type ? row.billing_type.code : '',
      billing_value: row.billing_value,
      effective_start_date: row.effective_start_date,
      effective_end_date: row.effective_end_date,
      reference_no: row.reference_no,
      related_ref_no: row.related_ref_no,
      linked_opportunity_code: row.linked_opportunity ? row.linked_opportunity.code : '',
      related_doc_code: '',
      platform_applicable: row.platform_applicable,
      service_code: row.service ? row.service.code : '',
      sub_service_code: row.sub_service ? row.sub_service.code : '',
      project_code: row.project ? row.project.code : '',
      sub_project_code: row.sub_project ? row.sub_project.code : '',
      location: row.location,
      additional_reporting_fields: row.additional_reporting_fields
    };

    const objectData: any = {
      data: {
        transaction_rate_standard: objectTransactionRateStandard
      }
    };

    this.commercialsService.createTransactionRateStandard(objectData, urlParams).subscribe((response: any) => {
      if (response && response.status === '500') {
        console.log('Error while copying item transaction rate standard.');
        this.toastr.error('Error while copying item transaction rate standard.');
      } else {
        this.fetchDataForTable();
        this.toastr.success('Operation Complete', 'Transaction Rate Standard copied');
      }
    });
  }
}
