import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { NgDataTablesComponent } from '../../../shared/modules/ng-data-tables/ng-data-tables.component';
import { HttpService } from '../../../shared/providers/http.service';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { StorageService } from '../../../shared/providers/storage.service';
import { SweetAlertController } from '../../../shared/controllers/sweet-alert.controller';
import { SessionService } from '../../../shared/providers/session.service';
import { UploadListNonRegUsersComponent } from './upload-list/upload-list-non-registered-users.component';
import { AddEditNonRegisteredUsersComponent } from './add-edit-non-registered-users/add-edit-non-registered-users.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-non-registered-client-users-setup',
  templateUrl: './non-registered-users-setup-tab.component.html',
  styleUrls: ['./non-registered-users-setup-tab.component.scss']
})

export class NonRegisteredClientUsersSetupComponent implements OnInit, OnDestroy {

  @ViewChild(NgDataTablesComponent)
    private dataTableComp: NgDataTablesComponent;

  @Input('organizationId') organizationId = '';

  @Input('type') type = '';

  @Input('mode') mode: string = '';

  @Input() showDeleteButton: boolean = false;
  columns: Array<any> = [
    {
      title: 'FIRST NAME',
      key: 'firstname',
      sortable: true,
      filter: true
    },
    {
      title: 'LAST NAME',
      key: 'lastname',
      sortable: true,
      filter: true
    },
    {
      title: 'EMAIL',
      key: 'email',
      sortable: true,
      filter: true
    }
  ];

  records: Array<any> = [];

  totalRows: number = 0;

  hasActionButtons: boolean = true;

  showUsersButton: boolean = false;

  breadcrumbs: Array<any> = [
    {
      text: 'Home',
      base: true,
      link: '/home',
      active: false
    },
    {
      text: 'Client Setup',
      base: false,
      link: '',
      active: true
    }
  ];

  dialogOptions: any = {
    width: '510px',
    height: '200px',
    panelClass: 'appModalPopup,custom-max-height'
  };

  constructor (private _router: Router,
        private dialog: MatDialog,
        private route: ActivatedRoute,
        public httpService: HttpService,
        public toastController: ToastrService) {

  }

  ngOnInit () {
    this.getAllRecipient();
  }

  getAllRecipient () {
    this.httpService.get('UrlDetails.$getNonRegisteredUsersListUrl' + '?' + Date.now(), { 'organizationId': this.organizationId }).subscribe(response => { // TODO: Vido
      let tmpRecords = [];
      response.forEach((item: any) => {
        if (item.active) {
          tmpRecords.push(item);
        }
      });

      this.records = tmpRecords;
      this.dataTableComp.setPage(1);
      this.totalRows = this.records.length;
    }, () => {
      this.dataTableComp.setPage(1);
    });
  }

  showUsers (data: any) {
    console.log(data);
    if (typeof data._id !== 'undefined') {
      StorageService.set(StorageService.organizationId, data._id);
      StorageService.set(StorageService.organizationName, data.organizationname);
      let base = SessionService.get('base-role');
      this._router.navigate(['/' + base + '/exela-client-user-setup']);
    }
  }

  editRecipient (record: any) {
    if (typeof record._id !== 'undefined') {
      let editUserDialogRef = this.dialog.open(AddEditNonRegisteredUsersComponent, this.dialogOptions);
      editUserDialogRef.componentInstance.heading = 'Edit Recipient';
      editUserDialogRef.componentInstance.saveBtnTitle = 'Save';
      editUserDialogRef.componentInstance.mode = 'edit';
      editUserDialogRef.componentInstance.setEditFormValues(record);
      editUserDialogRef.afterClosed().subscribe(result => {
        if (typeof result !== 'undefined') {
          this.getAllRecipient();
        }
      });
    }
  }

  deleteRecipient (record: any) {
    let deleteClientSetupAlert = new SweetAlertController();
    deleteClientSetupAlert.deleteConfirm({}, () => {
      record.active = false;
      this.httpService.update('UrlDetails.$addOrUpdateNonRegistedUsersUrl', record) // TODO: Vido
                .subscribe(response => {
                  let request = {
                    organizationId: this.organizationId,
                    email: record.email,
                    customAttrReq: {
                      customAttrName: 'send_to_search_history'
                    }
                  };
                  this.httpService.update('UrlDetails.$updateAttributesOnDelete', request) // TODO: Vido
                        .subscribe(response => {
                          this.toastController.success('Recipient Deleted Successfully');
                          this.getAllRecipient();
                        });
                }, () => {
                  this.toastController.error('Something went wrong, Please try again.');
                });

    });
  }

  uploadListPopup () {
    let dialogRef = this.dialog.open(UploadListNonRegUsersComponent, {
      height: '308px',
      width: '462px',
      panelClass: 'appModalPopup'
    });
    dialogRef.componentInstance.organizationId = this.organizationId;
    dialogRef.afterClosed().subscribe(result => {
      if (typeof result !== 'undefined') {
        this.getAllRecipient();
      }
    });
  }

  addNonRegisteredUserPopup () {
    let addUserDialogRef = this.dialog.open(AddEditNonRegisteredUsersComponent, this.dialogOptions);
    addUserDialogRef.componentInstance.heading = 'Add Recipient';
    addUserDialogRef.componentInstance.saveBtnTitle = 'Add';
    addUserDialogRef.componentInstance._id = this.organizationId;
    addUserDialogRef.componentInstance.mode = 'add';
    addUserDialogRef.afterClosed().subscribe(result => {
      if (typeof result !== 'undefined') {
        this.getAllRecipient();
      }
    });
  }

  ngOnDestroy () {

  }
}// class
