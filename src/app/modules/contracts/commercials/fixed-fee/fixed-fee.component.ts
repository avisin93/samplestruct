import { Component, OnInit, ChangeDetectorRef, ViewChild, TemplateRef, Input, Output, EventEmitter } from '@angular/core';
import { ContractService } from '../../contracts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { MatTabGroup, MatDialog } from '@angular/material';
import { CommercialsService } from '../commercials.service';
import { SessionService } from 'src/app/modules/shared/providers/session.service';
import { ToastrService } from 'ngx-toastr';
import { PopUpComponent } from '../../../pop-up/pop-up.component';

@Component({
  selector: 'cm-fixed-fee',
  templateUrl: './fixed-fee.component.html',
  styleUrls: ['./fixed-fee.component.scss']
})
export class FixedFeeComponent implements OnInit {
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

  constructor (
    private router: Router,
    private commercialsService: CommercialsService,
    private contractService: ContractService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService,
    public matDialog: MatDialog) {

  }

  myMessages = {
    'emptyMessage': '<img src="../../../../assets/images/no_data_found.png">',
    'totalMessage': 'Displaying item '
  };

  ngOnInit () {
    this.initDataTable();
    if (typeof this.contractService.contractId !== 'undefined'
        && this.contractService.contractId !== null
        && this.contractService.contractId !== '0') {
      this.fetchDataForTable();
    }
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
    const urlParams = {
      contractId: `${this.contractService.contractId}`
    };
    this.commercialsService.getAllFixedFees(urlParams).subscribe(
      (data: any) => {
        this.pageTable.count = data.count;
        this.rowsTable = data.rowsTable;
        this.tempRowsTable = [...data.rowsTable];
        this.cd.markForCheck();
      },
      () => {
        this.toastr.error(
          'Error',
          'Internal Server Error (Cannot fetch list of fixed fees)'
        );
      }
    );
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

  isDirtyChild (changed: boolean) {
    this.isDirty.emit(changed);
  }

  togglePanel () {
    this.showPanels.addPanel = this.showPanels.tablePanel;
    this.showPanels.tablePanel = !this.showPanels.tablePanel;
    if (this.showPanels.tablePanel) {
      this.fetchDataForTable();
    }
  }

  copyItem (row) {
    const urlParams = {
      contractId: `${this.contractService.contractId}`
    };

    const dataFixedFee: any = {
      data: {
        fixed_fee: {
          ...row,
          _id: undefined,
          currency_code: row.currency ? row.currency.code : null,
          uom_code: row.uom ? row.uom.code : null,
          applicable_period_code: row.applicable_period ? row.applicable_period.code : null,
          service_code: row.service ? row.service.code : null,
          sub_service_code: row.sub_service ? row.sub_service.code : null,
          project_code: row.project ? row.project.code : null,
          sub_project_code: row.sub_project ? row.sub_project.code : null,
          linked_opportunity_code: row.linked_opportunity ? row.linked_opportunity.code : null
        }
      }
    };

    this.commercialsService.createFixedFee(dataFixedFee, urlParams).subscribe(
      (response: any) => {
        this.fetchDataForTable();
        this.toastr.success('Operation Complete', 'Fixed Fee copied');
      },
      () => {
        this.toastr.error(
          'Error',
          'Internal Server Error (Cannot copy fixed fee)'
        );
      }
    );
  }

  openDialogForDeleteConfirmation (row) {
    if (row === undefined) {
      return;
    }
    let data = {
      'message': 'Are you sure you want to delete?',
      'row': row,
      'component': 'fixedFee',
      'yes': 'Yes',
      'no': 'Cancel'
    };

    const dialogRef = this.matDialog.open(PopUpComponent, {
      width: '450px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result && result.row && result.component === 'fixedFee') {
          this.deleteFixedFee(result.row);
        }
      }
    });
  }

  deleteFixedFee (row) {
    let urlParams = {
      contractId: `${this.contractService.contractId}`,
      fixedFeeId: `${row._id}`
    };

    this.commercialsService.deleteFixedFee(urlParams).subscribe(
      (response: any) => {
        this.fetchDataForTable();
        this.toastr.success('Operation Complete', 'Fixed Fee successfully deleted');
      },
      () => {
        this.toastr.error(
          'Error',
          'Internal Server Error (Cannot delete fixed fee)'
        );
      }
    );
  }

  changePage (e: any) {
    this.pageTable.offset = e.page - 1;
    this.datatable.onFooterPage(e);
  }

  saveAndContinueCommercialsFixedFee () {
    this.isDirty.emit(false);
    this.matgroupCommercials.selectedIndex += 1;
    this.toastr.success('Operation Complete', 'Fixed Fee updated');
  }

  openPanel (row: any) {
    if (row != null) {
      this.transferData = {
        data: {
          line_item: row.line_item,
          currency: row.currency ? row.currency.code : '',
          rate: row.rate,
          uom: row.uom ? row.uom.code : '',
          effective_start_date: row.effective_start_date,
          effective_end_date: row.effective_end_date,
          advance_billing: row.advance_billing,
          applicable_period: row.applicable_period ? row.applicable_period.code : '',
          reference_no: row.reference_no,
          related_ref_no: row.related_ref_no,
          linked_opportunity: row.linked_opportunity ? row.linked_opportunity.code : '',
          related_doc: row.related_doc,
          project: row.project ? row.project.code : '',
          sub_project: row.sub_project ? row.sub_project.code : '',
          service: row.service ? row.service.code : '',
          sub_service: row.sub_service ? row.sub_service.code : '',
          location: row.location,
          platform_applicable: row.platform_applicable,
          additional_reporting_fields: row.additional_reporting_fields,
          id_fixed_fee: row._id,
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

  cancel () {
    let base = SessionService.get('base-role');
    this.router.navigate([base + '/dashboard/events-and-reminders']);
  }

}
