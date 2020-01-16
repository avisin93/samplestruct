import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { SweetAlertController } from '../shared/controllers/sweet-alert.controller';
import { AddEditFacilitiesComponent } from './add-edit-facilities/add-edit-facilities.component';
import { UploadListComponent } from './upload-list/upload-list.component';
import { UrlDetails } from '../../models/url/url-details.model';
import { HttpService } from '../shared/providers/http.service';
import { NgDataTablesComponent } from '../shared/modules/ng-data-tables/ng-data-tables.component';
import { UtilitiesService } from '../shared/providers/utilities.service';
import { StorageService } from '../shared/providers/storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-facilities',
  templateUrl: './facilities.component.html',
  styleUrls: ['./facilities.component.scss']
})

export class FacilitiesComponent implements OnInit, OnDestroy {

  @ViewChild(NgDataTablesComponent)
    private dataTableComp: NgDataTablesComponent;

  @Input('type') type: string = '';

  columns: Array<any> = [
    {
      title: 'FACILITY NAME',
      key: 'facilityName',
      sortable: true,
      filter: true,
      link: true
    },
    {
      title: 'ADDRESS',
      key: 'address',
      sortable: true,
      filter: true
    },
    {
      title: 'CONTACT NUMBER',
      key: 'phoneNumber',
      sortable: true,
      filter: true
    },
    {
      title: 'OPEN HOURS',
      key: 'openHours',
      sortable: true,
      filter: true
    },
    {
      title: 'GROUP COUNT',
      key: 'facilityGroupCount',
      sortable: true,
      filter: true
    }
  ];

  records: Array<any> = [];

  totalRows: number = 0;

  hasActionButtons: boolean = true;

  dialogOptions: any = {
    width: '510px',
    height: '670px',
    panelClass: 'appModalPopup'
  };

  selectedFacility: any = '';

  constructor (public dialog: MatDialog,
    private _router: Router,
    private route: ActivatedRoute,
    public httpService: HttpService,
    public toastController: ToastrService) {

  }

  getAllFacilities () {

    this.httpService.getAllFacility('UrlDetails.$facilityGetUrl') // TODO: Vido
        .subscribe(response => {
          let data = response.responseData;
          if (data !== null) {
            data.forEach((item: any) => {
              item['address'] = item.address1 + ' ' + item.address2 + ' ' + item.city;
              item['openHours'] = UtilitiesService.limitTo(item.daysOfOperationFrom, 3) + '-' + UtilitiesService.limitTo(item.daysOfOperationTo, 3) + ' ' + item.hoursOfOperationFrom + '-' + item.hoursOfOperationTo;
            });
            this.records = data;
            this.totalRows = this.records.length;
          }
          this.dataTableComp.setPage(1);
        }, () => {
          this.dataTableComp.setPage(1);
        });

  } // getAllFacilities

  ngOnInit () {
    this.getAllFacilities();
  }

  gotoLink (data: any) {
    if (data.columnKey === 'facilityName') {
      this.selectedFacility = data.row;
    }
  }

  backToFacilities (event: any) {
    this.selectedFacility = '';
    this.getAllFacilities();
  }

  addFacilityPopup () {
    let addFacilityDialogRef = this.dialog.open(AddEditFacilitiesComponent, this.dialogOptions);
    addFacilityDialogRef.componentInstance.heading = 'Add Facility';
    addFacilityDialogRef.componentInstance.saveBtnTitle = 'Add';
    addFacilityDialogRef.componentInstance.mode = 'add';
    addFacilityDialogRef.afterClosed().subscribe(result => {
      if (typeof result !== 'undefined') {
        this.getAllFacilities();
      }
    });
  }

  editFacilityPopup (facilityDetails: any) {

    let editFacilityDialogRef = this.dialog.open(AddEditFacilitiesComponent, this.dialogOptions);
    editFacilityDialogRef.componentInstance.heading = 'Edit Facility';
    editFacilityDialogRef.componentInstance.saveBtnTitle = 'Save';
    editFacilityDialogRef.componentInstance.mode = 'edit';
    editFacilityDialogRef.componentInstance.setEditFormValues(facilityDetails);
    editFacilityDialogRef.afterClosed().subscribe(result => {
      if (typeof result !== 'undefined') {
        this.getAllFacilities();
      }
    });
  }

  uploadListPopup () {
    let dialogRef = this.dialog.open(UploadListComponent, {
      height: '308px',
      width: '462px',
      panelClass: 'appModalPopup'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (typeof result !== 'undefined') {
        this.getAllFacilities();
      }
    });
  }

  deleteFacility (facilityDetails: any) {
    let facility = { facilityId : facilityDetails.facilityId ,organizationId: StorageService.get(StorageService.organizationId) };

    let deleteFacilityConfirmAlert = new SweetAlertController();
    deleteFacilityConfirmAlert.deleteConfirm({}, () => {
      this.httpService.delete('UrlDetails.$removeFacilityUrl',facility) // TODO: Vido
            .subscribe(response => {
              if (response.responseData) {
                this.toastController.success('Record deleted Successfully');
                this.getAllFacilities();
              } else {
                this.toastController.error('Selected Record is already deleted');
              }
            }, () => {
              this.toastController.error('Something went wrong, Please try again.');
            });
    });
  }

  ngOnDestroy () {

  }

}
