import { Component, OnInit, ViewChild, TemplateRef, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { AddTransactionRateVolumeComponent } from './add-transaction-rate-volume/add-transaction-rate-volume.component';
import { ContractService } from '../../../../modules/contracts/contracts.service';
import { CommercialsService } from '../../commercials/commercials.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Router } from '@angular/router';
import { MatTabGroup, MatDialog } from '@angular/material';
import { SessionService } from 'src/app/modules/shared/providers/session.service';
import { PopUpComponent } from '../../../pop-up/pop-up.component';
import { ToastrService } from 'ngx-toastr';
import { IClientSpecific } from 'src/app/interfaces/client-specific.interface';

@Component({
  selector: 'cm-transaction-rate-volume',
  templateUrl: './transaction-rate-volume.component.html',
  providers: [AddTransactionRateVolumeComponent],
  styleUrls: ['./transaction-rate-volume.component.scss']
})
export class TransactionRateVolumeComponent implements OnInit {
  @ViewChild(DatatableComponent) datatable: DatatableComponent;
  @ViewChild('sortableHeaderTemplate') sortableHeaderTemplate: TemplateRef<any>;
  @ViewChild('actionColumnTemplate') actionColumnTemplate: TemplateRef<any>;
  @Input() matgroupCommercials: MatTabGroup;
  @Input() generalInfoLocation: string;
  @Output() isDirty: EventEmitter<boolean> = new EventEmitter();

  columnsTable = [];
  rowsTable = [];
  tempRowsTable = [];

  transferData: any;

  showTable: boolean = true;
  showAdd: boolean = false;

  constructor (
    private router: Router,
    private contractService: ContractService,
    private commercialsService: CommercialsService,
    private cd: ChangeDetectorRef,
    private matDialog: MatDialog,
    private toastr: ToastrService
  ) {
  }

  ngOnInit () {
    this.initDataTable();
    this.fetchDataForTable();
  }

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
    'emptyMessage': '<img src="../../../../assets/images/no_data_found.png">',
    'totalMessage': 'Displaying item '
  };

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
        prop: 'first_rate',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplate,
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

  fetchDataForTable () {
    if (this.contractService.contractId === '0') {
      return;
    }
    let urlParams = {
      contractId: `${this.contractService.contractId}`
    };
    this.commercialsService.getAllTransactionRatesVolumes(urlParams).subscribe((data: any) => {
      this.pageTable.count = data.count;
      this.rowsTable = data.rowsTable;
      this.tempRowsTable = [...data.rowsTable];
      this.cd.markForCheck();
    });
  }

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

  changePage (e: any) {
    this.pageTable.offset = e.page - 1;
    this.datatable.onFooterPage(e);
  }

  saveAndContinueCommercialsTransRate () {
    this.matgroupCommercials.selectedIndex += 1;
    this.toastr.success('Operation Complete', 'Transaction Rate Volume updated');
  }

  openDialogToConfirmDelete (row) {
    let data = {
      'message': 'Are you sure you want to delete?',
      'row': row,
      'component': 'transaction-rate-volume',
      'yes': 'Yes',
      'no': 'Cancel'
    };

    const dialogRef = this.matDialog.open(PopUpComponent, {
      width: '450px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result !== undefined && result.component === 'transaction-rate-volume') {
          this.deleteTransactionRate(result.row);
        }
      }
    });

  }

  deleteTransactionRate (row) {
    let urlParams = {
      contractId: `${this.contractService.contractId}`,
      transactionRateVolumeId: `${row._id}`
    };

    this.commercialsService.deleteTransactionRateVolume(urlParams).subscribe((response: any) => {
      if (response.status === '500') {
        this.toastr.error('Not able to delete transaction rate volume.');
      } else {
        this.fetchDataForTable();
        this.toastr.success('Operation Complete', 'Transaction Rate Volume successfully deleted');
      }
    });
  }

  isDirtyChild (changed: boolean) {
    this.isDirty.emit(changed);
  }

  openPanel (row: any) {
    if (row != null) {
      this.transferData = {
        data: {
          line_item: row.line_item,
          tier_type_code: row.tier_type ? row.tier_type.code : '',
          volume_split_code: row.volume_split ? row.volume_split.code : '',
          volume_group_name: row.volume_group_name,
          uom_code: row.uom ? row.uom.code : '',
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
          commercial_rate_percentage: row.commercial_rate_percentage,
          additional_reporting_fields: row.additional_reporting_fields,
          id_transaction_rate_volume: row._id,
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
    this.router.navigate([base + '/dashboard/events-and-reminders']).then(nav => {
      console.log(nav);
    }, err => {
      console.log(err);
    });
  }

  copyItem (row) {

    const objectTransactionRateVolume: any = {
      ...row,
      _id: undefined,
      tier_type_code: row.tier_type ? row.tier_type.code : null,
      volume_split_code: row.volume_split ? row.volume_split.code : null,
      uom_code: row.uom ? row.uom.code : null,
      linked_opportunity_code: row.linked_opportunity ? row.linked_opportunity.code : null,
      related_doc_code: row.related_doc ? row.related_doc.code : null,
      service_code: row.service ? row.service.code : null,
      sub_service_code: row.sub_service ? row.sub_service.code : null,
      project_code: row.project ? row.project.code : null,
      sub_project_code: row.sub_project ? row.sub_project.code : null,
      commercial_rate_percentage: row.commercial_rate_percentage.map(item => {
        item.applicable_factor = item.applicable_factor ? item.applicable_factor.code : null;
        return item;
      })
    };

    const objectData: any = {
      data: {
        transaction_rate_volume: objectTransactionRateVolume
      }
    };

    const urlParams: any = {
      contractId: `${this.contractService.contractId}`
    };

    this.commercialsService.createTransactionRateVolume(objectData, urlParams).subscribe((response: any) => {
      if (response.status === '500') {
        console.log('Error while copying item transaction rate volume.');
        this.toastr.error('Error while copying item transaction rate volume.');
      } else {
        this.fetchDataForTable();
        this.toastr.success('Operation Complete', 'Transaction Rate Volume copied');
      }
    });
  }
}
