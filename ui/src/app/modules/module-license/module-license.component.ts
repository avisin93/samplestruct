import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { SweetAlertController } from '../shared/controllers/sweet-alert.controller';
import { AddEditModuleLicenseComponent } from './add-edit-module-license/add-edit-module-license.component';
import { UrlDetails } from '../../models/url/url-details.model';
import { HttpService } from '../shared/providers/http.service';
import { NgDataTablesComponent } from '../shared/modules/ng-data-tables/ng-data-tables.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-module-license',
  templateUrl: './module-license.component.html',
  styleUrls: ['./module-license.component.scss']
})

export class ModuleLicenseComponent implements OnInit, OnDestroy {

  @ViewChild(NgDataTablesComponent)
    private dataTableComp: NgDataTablesComponent;

  @Input('type') type: string = '';
  @Input('organizationId') organizationId: number = 0;

  columns: Array<any> = [
    {
      title: 'MODULE NAME',
      key: 'managerName1',
      sortable: true,
      filter: true,
      link: true
    },
    {
      title: 'START DATE',
      key: 'startDate',
      sortable: true,
      filter: true
    },
    {
      title: 'END DATE',
      key: 'endDate',
      sortable: true,
      filter: true
    }
  ];

  records: Array<any> = [];

  totalRows: number = 0;

  hasActionButtons: boolean = true;

  dialogOptions: any = {
    width: '510px',
    height: '270px'
  };

  selectedFacility: any = '';

  constructor (public dialog: MatDialog,
        private _router: Router,
        private route: ActivatedRoute,
        public httpService: HttpService,
        public toastController: ToastrService) {

  }

  getAllModuleLicenses () {

    this.httpService.getAll('UrlDetails.$getAllModuleLicenseUrl' + this.organizationId) // TODO: vido
            .subscribe(response => {
              let tmpRecords = [];
              response.forEach((item: any) => {
                if (item.active === 'Y') {
                  item['managerName1'] = item.managerName1;
                  item['startDate'] = new Date(item.startDate).toLocaleDateString('en-US');
                  item['endDate'] = new Date(item.endDate).toLocaleDateString('en-US');
                  tmpRecords.push(item);
                }
              });
              this.records = tmpRecords;
              this.totalRows = this.records.length;
              this.dataTableComp.setPage(1);
            }, () => {
              this.dataTableComp.setPage(1);
            });

  } // getAllModuleLicenses

  ngOnInit () {
    this.getAllModuleLicenses();
  }

  gotoLink (data: any) {
    if (data.columnKey === 'facilityName') {
      this.selectedFacility = data.row;
    }
  }

  backToFacilities (event: any) {
    this.selectedFacility = '';
    this.getAllModuleLicenses();
  }

  addFacilityPopup () {
    let addFacilityDialogRef = this.dialog.open(AddEditModuleLicenseComponent, this.dialogOptions);
    addFacilityDialogRef.componentInstance.heading = 'Add Module License';
    addFacilityDialogRef.componentInstance.saveBtnTitle = 'Add';
    addFacilityDialogRef.componentInstance.mode = 'add';
    addFacilityDialogRef.componentInstance.organizationId = this.organizationId;
    addFacilityDialogRef.afterClosed().subscribe(result => {
      if (typeof result !== 'undefined') {
        this.getAllModuleLicenses();
      }
    });
  }

  editFacilityPopup (facilityDetails: any) {

    let editFacilityDialogRef = this.dialog.open(AddEditModuleLicenseComponent, this.dialogOptions);
    editFacilityDialogRef.componentInstance.heading = 'Edit Module License';
    editFacilityDialogRef.componentInstance.saveBtnTitle = 'Save';
    editFacilityDialogRef.componentInstance.mode = 'edit';
    editFacilityDialogRef.componentInstance.organizationId = this.organizationId;
    editFacilityDialogRef.componentInstance.setEditFormValues(facilityDetails);
    editFacilityDialogRef.afterClosed().subscribe(result => {
      if (typeof result !== 'undefined') {
        this.getAllModuleLicenses();
      }
    });
  }

  deleteFacility (facilityDetails: any) {
    facilityDetails.active = 'N';
    facilityDetails.startDate = new Date(facilityDetails.startDate).getTime();
    facilityDetails.endDate = new Date(facilityDetails.endDate).getTime();
    let deleteFacilityConfirmAlert = new SweetAlertController();
    deleteFacilityConfirmAlert.deleteConfirm({}, () => {
      this.httpService.save('UrlDetails.$updateAdminModulesLicenceUrl', facilityDetails) // TODO: Vido
                .subscribe(response => {
                  this.getAllModuleLicenses();
                  this.toastController.success('Record deleted Successfully');
                }, () => {
                  this.toastController.error('Something went wrong, Please try again.');
                });
    });
  }

  ngOnDestroy () {

  }

}
