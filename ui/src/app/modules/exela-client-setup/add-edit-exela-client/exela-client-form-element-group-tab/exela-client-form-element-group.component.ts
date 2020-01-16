import { Component, OnInit, Input, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { HttpService } from '../../../shared/providers/http.service';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { StorageService } from '../../../shared/providers/storage.service';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { NgDataTablesComponent } from '../../../shared/modules/ng-data-tables/ng-data-tables.component';
import { AddEditFormElementGroupTabComponent } from './add-edit-form-element-group/add-edit-form-element-group.component';
import { SweetAlertController } from '../../../shared/controllers/sweet-alert.controller';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-client-form-element-group-tab',
  templateUrl: './exela-client-form-element-group.component.html',
  styleUrls: ['./exela-client-form-element-group.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ClientFormElementGroupTabComponent implements OnInit {

  @Input('mode') mode = '';

  @Input('organizationId') _id = '';

  @ViewChild(NgDataTablesComponent)
    private dataTableComp: NgDataTablesComponent;

  hasActionButtons: boolean = true;
  totalRows = 0;
  formElements = [];
  records = [];

  columns: Array<any> = [
    {
      title: 'Group Name',
      key: 'groupName',
      sortable: true,
      filter: true
    },
    {
      title: 'Form Element',
      key: 'formElement',
      sortable: true,
      filter: true
    }
  ];

  dialogOptions: any = {
    width: '600px',
    height: '220px'
  };

  constructor (private _router: Router, public httpService: HttpService, private dialog: MatDialog,
        public loaderService: LoaderService, public _toastCtrl: ToastrService) {
  }
  ngOnInit (): void {
    this.getFormElementGroups();
  }
  getFormElementGroups () {
    this.loaderService.show();
    let reqData = {
      organizationId: StorageService.get(StorageService.organizationId)
    };
    this.httpService.get(UrlDetails.$exela_getAllProjectsUrl, reqData)
            .subscribe(response => {
              response.forEach(element => {
                let doctypes = element.doctypes;
                doctypes.forEach((docType) => {
                  this.formElements = this.formElements.concat(docType.formelements);
                });
              });
              this.httpService.get('UrlDetails.$getFormElementGroupsUrl', { organizationId: this._id }).subscribe(response => { // TODO: Vido
                this.loaderService.hide();
                this.records = [];
                response.forEach((formGroup: any) => {
                  let formElements = formGroup.formElements;
                  formElements.forEach(formElement => {
                    let tmpRecord = {};
                    if (formElement.active) {
                      let formElementDispName = this.formElements.find(element => element._id === formElement._id);
                      tmpRecord = {
                        groupId: formGroup._id,
                        groupName: formGroup.groupName,
                        formElement: formElementDispName.displayname,
                        formElementId: formElement._id
                      };
                      this.records.push(tmpRecord);
                    }
                  });
                });
                this.dataTableComp.setPage(1);
                this.totalRows = this.records.length;
                this.loaderService.hide();
              }, () => {
                this.loaderService.hide();
                this.dataTableComp.setPage(1);
              });
            }, () => {
            });
  }

  addOrEditFormElementGroup (record: any) {
    let addEditFormelementGroup = this.dialog.open(AddEditFormElementGroupTabComponent, this.dialogOptions);
    addEditFormelementGroup.componentInstance.organizationId = this._id;
    if (record === undefined) {
      addEditFormelementGroup.componentInstance.mode = 'add';
      addEditFormelementGroup.componentInstance.heading = 'Add Form Element Group';
    } else {
      addEditFormelementGroup.componentInstance.mode = 'edit';
      addEditFormelementGroup.componentInstance.heading = 'Edit Form Element Group';
      addEditFormelementGroup.componentInstance.formElementGroupRecord = record;
    }
    addEditFormelementGroup.afterClosed().subscribe((result) => {
      this.getFormElementGroups();
    });
  }

  deleteFormElementGroup (record: any) {
    let deleteClientSetupAlert = new SweetAlertController();
    deleteClientSetupAlert.deleteConfirm({}, () => {
      record.isDeleteRequest = true;
      this.httpService.update('UrlDetails.$addOrUpdateFormElementGroupUrl', record) // TODO: Vido
                .subscribe(response => {
                  this._toastCtrl.success('Shared MailBox Deleted Successfully');
                  this.getFormElementGroups();
                }, () => {
                  this._toastCtrl.error('Something went wrong, Please try again.');
                });

    });
  }
}
