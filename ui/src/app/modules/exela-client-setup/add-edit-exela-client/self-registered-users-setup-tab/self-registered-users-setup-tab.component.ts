import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { NgDataTablesComponent } from '../../../shared/modules/ng-data-tables/ng-data-tables.component';
import { HttpService } from '../../../shared/providers/http.service';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { StorageService } from '../../../shared/providers/storage.service';
import { SweetAlertController } from '../../../shared/controllers/sweet-alert.controller';
import { SessionService } from '../../../shared/providers/session.service';
import { UploadListSelfRegUsersComponent } from './upload-list/upload-list-self-registered-users.component';
import { AddEditSelfRegisteredUsersComponent } from './add-edit-self-registered-users/add-edit-self-registered-users.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-self-registered-client-users-setup',
  templateUrl: './self-registered-users-setup-tab.component.html',
  styleUrls: ['./self-registered-users-setup-tab.component.scss']
})

export class SelfRegisteredClientUsersSetupComponent implements OnInit, OnDestroy {

  @ViewChild(NgDataTablesComponent)
    private dataTableComp: NgDataTablesComponent;

  @Input('organizationId') organizationId = '';

  @Input('type') type = '';

  @Input('mode') mode: string = '';

  @Input() showDeleteButton: boolean = false;

  showEditButton: boolean = false;

  columns: Array<any> = [
    {
      title: 'EMAIL',
      key: 'email',
      sortable: true,
      filter: true
    },
    {
      title: 'ROLES',
      key: 'roleNames',
      sortable: true,
      filter: true
    },
    {
      title: 'REGISTRATION STATUS',
      key: 'registrationStatus',
      sortable: true,
      filter: true
    }
  ];

  records: Array<any> = [];

  roles = [];

  totalRows: number = 0;

  hasActionButtons: boolean = false;

  showUsersButton: boolean = false;

  breadcrumbs: Array<any> = [
    {
      text: 'Home',
      base: true,
      link: '/home',
      active: false
    },
    {
      text: 'Self Registration',
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

    this.getSelfRegisteredUsersList();
  }

  getSelfRegisteredUsersList () {

    this.httpService.get(UrlDetails.$exela_getClientRolesUrl, { organizationId: this.organizationId }).subscribe((response) => {
      let tmpRoles = [];
      response.forEach((role) => {
        if (role.active === true) {
          tmpRoles.push({ value: role._id, text: role.roleName });
        }
      });
      this.roles = tmpRoles;
      this.httpService.get('UrlDetails.$getSelfRegisteredUsersListUrl' + '?' + Date.now(), { 'organizationId': this.organizationId }).subscribe(response => { // TODO: Vido
        let tmpRecords = [];
        response.forEach((item: any) => {

          if (item.roles.length > 0) {
            let roleNames = [];
            item.roles.forEach((roleId: any) => {
              let roleInfo = this.roles.find(role => role.value === roleId);
              if (roleInfo) {
                roleNames.push(roleInfo.text);
              }

            });
            item['roleNames'] = roleNames.join();
          }
          tmpRecords.push(item);
        });

        this.records = tmpRecords;
        this.dataTableComp.setPage(1);
        this.totalRows = this.records.length;
      }, () => {
        this.dataTableComp.setPage(1);
      });
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

      let editUserDialogRef = this.dialog.open(AddEditSelfRegisteredUsersComponent, this.dialogOptions);
      editUserDialogRef.componentInstance.heading = 'Edit Self Registered User';
      editUserDialogRef.componentInstance.saveBtnTitle = 'Invite';
      editUserDialogRef.componentInstance.mode = 'edit';
      editUserDialogRef.componentInstance.roles = this.roles;
      editUserDialogRef.componentInstance.setEditFormValues(record);
      editUserDialogRef.afterClosed().subscribe(result => {
        if (typeof result !== 'undefined') {
          this.getSelfRegisteredUsersList();
        }
      });
    }
  }

  deleteRecipient (record: any) {
    let deleteClientSetupAlert = new SweetAlertController();
    deleteClientSetupAlert.deleteConfirm({}, () => {
      record.active = false;
      this.httpService.update('UrlDetails.$addOrUpdateSelfRegistedUsersUrl', record) // TODO: Vido
                .subscribe(response => {
                  this.toastController.success('Recipient Deleted Successfully');
                  this.getSelfRegisteredUsersList();
                }, () => {
                  this.toastController.error('Something went wrong, Please try again.');
                });

    });
  }

  uploadListPopup () {
    let dialogRef = this.dialog.open(UploadListSelfRegUsersComponent, {
      height: '308px',
      width: '462px',
      panelClass: 'appModalPopup'
    });
    dialogRef.componentInstance.organizationId = this.organizationId;
    dialogRef.componentInstance.clinetRoles = this.roles;
    dialogRef.afterClosed().subscribe(result => {
      if (typeof result !== 'undefined') {
        this.getSelfRegisteredUsersList();
      }
    });
  }

  addSelfRegisteredUserPopup () {
    let addUserDialogRef = this.dialog.open(AddEditSelfRegisteredUsersComponent, this.dialogOptions);
    addUserDialogRef.componentInstance.heading = 'Add Self Registered User';
    addUserDialogRef.componentInstance.saveBtnTitle = 'Invite';
    addUserDialogRef.componentInstance.organizationId = this.organizationId;
    addUserDialogRef.componentInstance.roles = this.roles;
    addUserDialogRef.componentInstance.mode = 'add';
    addUserDialogRef.afterClosed().subscribe(result => {
      if (typeof result !== 'undefined') {
        this.getSelfRegisteredUsersList();
      }
    });
  }

  ngOnDestroy () {

  }
}// class
