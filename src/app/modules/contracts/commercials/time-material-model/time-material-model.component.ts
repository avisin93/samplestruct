import { Component, OnInit, ViewChild, Input, TemplateRef, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { MatTabGroup, MatDialog } from '@angular/material';
import { SessionService } from 'src/app/modules/shared/providers/session.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ContractService } from '../../contracts.service';
import { CommercialsService } from '../commercials.service';
import { PopUpComponent } from '../../../pop-up/pop-up.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'cm-time-material-model',
  templateUrl: './time-material-model.component.html',
  styleUrls: ['./time-material-model.component.scss']
})
export class TimeMaterialModelComponent implements OnInit {
  @ViewChild(DatatableComponent) datatable: DatatableComponent;
  @ViewChild('sortableHeaderTemplate') sortableHeaderTemplate: TemplateRef<any>;
  @ViewChild('actionColumnTemplate') actionColumnTemplate: TemplateRef<any>;
  @ViewChild('rateColumnTemplate') rateColumnTemplate: TemplateRef<any>;
  @Input() matgroupCommercials: MatTabGroup;
  @Input() generalInfoLocation: string;
  @Output() isDirty: EventEmitter<boolean> = new EventEmitter();

  columnsTable = [];
  rowsTable = [];
  tempRowsTable = [];

  transferData: any;

  constructor (
    private router: Router,
    private contractService: ContractService,
    private commercialsService: CommercialsService,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService,
    private matDialog: MatDialog
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

  myMessages = {
    'emptyMessage': '<img src="../../../../assets/images/no_data_found.png">',
    'totalMessage': 'Displaying item '
  };

  initDataTable () {
    this.columnsTable = [
      {
        name: 'LINE ITEM',
        prop: 'description',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplate,
        resizeable: false,
        minWidth: 120
      },
      {
        name: 'UOM',
        prop: 'first_uom',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplate,
        resizeable: false,
        minWidth: 120
      },
      {
        name: 'RATE',
        prop: 'first_rate',
        sortable: true,
        cellTemplate: this.rateColumnTemplate,
        headerTemplate: this.sortableHeaderTemplate,
        resizeable: false,
        minWidth: 120
      },
      {
        name: 'ACTION',
        prop: 'action',
        sortable: false,
        cellTemplate: this.actionColumnTemplate,
        resizeable: false,
        minWidth: 150
      }
    ];
  }

  fetchDataForTable () {
    if (this.contractService.contractId === '0') {
      return;
    }
    const urlParams = {
      contractId: `${this.contractService.contractId}`
    };

    this.commercialsService.getAllTimeAndMaterials(urlParams).subscribe((data: any) => {
      this.pageTable.count = data.count;
      this.rowsTable = data.rowsTable;
      this.tempRowsTable = [...data.rowsTable];
      this.cd.markForCheck();
    });
  }

  isDirtyChild (changed: boolean) {
    this.isDirty.emit(changed);
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

  saveAndContinue () {
    this.isDirty.emit(false);
    this.matgroupCommercials.selectedIndex += 1;
    this.toastr.success('Operation Complete', 'Time and Material updated');
  }

  openDialogForDeleteConfirmation (row) {
    if (row === undefined) {
      return;
    }
    let data = {
      'message': 'Are you sure you want to delete?',
      'row': row,
      'component': 'timeMaterialModel',
      'yes': 'Yes',
      'no': 'Cancel'
    };

    const dialogRef = this.matDialog.open(PopUpComponent, {
      width: '450px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result && result.row && result.component === 'timeMaterialModel') {
          this.deleteOneItem(result.row);
        }
      }
    });

  }

  deleteOneItem (row) {
    const urlParams = {
      contractId: `${this.contractService.contractId}`,
      timeAndMaterialId: `${row._id}`
    };

    this.commercialsService.deleteTimeAndMaterial(urlParams).subscribe((response: any) => {
      if (response.status === '500') {
        console.log('Error while deleting item');
      } else {
        this.fetchDataForTable();
        this.toastr.success('Operation Complete', 'Time and Material successfully deleted');
      }
    });
  }

  copyItem (row) {
    const urlParams = {
      contractId: `${this.contractService.contractId}`
    };

    const dataTimeMaterial: any = {
      data: {
        time_and_material: {
          ...row,
          _id: undefined,
          linked_opportunity_code: row.linked_opportunity ? row.linked_opportunity.code : null,
          service_code: row.service ? row.service.code : null,
          sub_service_code: row.sub_service ? row.sub_service.code : null,
          project_code: row.project ? row.project.code : null,
          sub_project_code: row.sub_project ? row.sub_project.code : null,
          time_and_material_details: row.time_and_material_details.map(item => {
            item.uom = item.uom ? item.uom.code : null;
            return item;
          })
        }
      }
    };

    this.commercialsService.createTimeAndMaterial(dataTimeMaterial, urlParams).subscribe((response: any) => {
      if (response.status === '500') {
        console.log('Error while copying item.');
      } else {
        this.fetchDataForTable();
        this.toastr.success('Operation Complete', 'Time and Material copied');
      }
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

  openPanel (row: any) {
    if (row != null) {
      this.transferData = {
        data: {
          description: row.description,
          effective_start_date: row.effective_start_date,
          effective_end_date: row.effective_end_date,
          reference_no: row.reference_no,
          related_ref_no: row.related_ref_no,
          linked_opportunity: row.linked_opportunity,
          related_doc: row.related_doc,
          platforms_applicable: row.platforms_applicable,
          service: row.service,
          sub_service: row.sub_service,
          project: row.project,
          sub_project: row.sub_project,
          location: row.location,
          id_time_and_material: row._id,
          time_and_material_details: row.time_and_material_details,
          additional_reporting_fields: row.additional_reporting_fields,
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
    const base = SessionService.get('base-role');
    this.router.navigate([base + '/dashboard/events-and-reminders']);
  }

}
