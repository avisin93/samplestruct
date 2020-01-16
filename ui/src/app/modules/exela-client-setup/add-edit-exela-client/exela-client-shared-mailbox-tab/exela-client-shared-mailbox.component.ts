import { Component, OnInit, Input, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { HttpService } from '../../../shared/providers/http.service';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { NgDataTablesComponent } from '../../../shared/modules/ng-data-tables/ng-data-tables.component';
import { AddEditSharedMailboxTabComponent } from './add-edit-shared-mailbox/add-edit-shared-mailbox.component';
import { SweetAlertController } from '../../../shared/controllers/sweet-alert.controller';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-client-shared-mailbox-tab',
  templateUrl: './exela-client-shared-mailbox.component.html',
  styleUrls: ['./exela-client-shared-mailbox.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ClientSharedMailboxTabComponent implements OnInit {

  @Input('mode') mode = '';

  @Input('organizationId') _id = '';

  @ViewChild(NgDataTablesComponent)
    private dataTableComp: NgDataTablesComponent;

  hasActionButtons: boolean = true;
  totalRows = 0;
  records = [];

  columns: Array<any> = [
    {
      title: 'MAILBOX NAME',
      key: 'mailboxName',
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

  dialogOptions: any = {
    width: '600px',
    height: '220px'
  };

  constructor (private _router: Router, public httpService: HttpService, private dialog: MatDialog,
        public loaderService: LoaderService, public _toastCtrl: ToastrService) {
  }
  ngOnInit (): void {
    this.getSharedMailBoxes();
  }
  getSharedMailBoxes () {
    this.loaderService.show();
    this.httpService.get('UrlDetails.$getSharedMailboxesUrl', { organizationId: this._id }).subscribe(response => { // TODO: Vido
      let tmpRecords = {};
      this.loaderService.hide();
      this.records = [];
      response.forEach((item: any) => {
        tmpRecords = {};
        tmpRecords['mailboxName'] = item.mailboxName;
        tmpRecords['email'] = item.email;
        tmpRecords['_id'] = item._id;
        this.records.push(tmpRecords);
      });
      this.dataTableComp.setPage(1);
      this.totalRows = this.records.length;
      this.loaderService.hide();
    }, () => {
      this.loaderService.hide();
      this.dataTableComp.setPage(1);
    });
  }

  addOrEditMailbox (record: any) {
    let addEditSharedMailbox = this.dialog.open(AddEditSharedMailboxTabComponent, this.dialogOptions);
    addEditSharedMailbox.componentInstance.organizationId = this._id;
    if (record === undefined) {
      addEditSharedMailbox.componentInstance.mode = 'add';
      addEditSharedMailbox.componentInstance.heading = 'Add Shared Mailbox';
    } else {
      addEditSharedMailbox.componentInstance.mode = 'edit';
      addEditSharedMailbox.componentInstance.heading = 'Edit Shared Mailbox';
      addEditSharedMailbox.componentInstance.sharedMailboxId = record._id;
    }
    addEditSharedMailbox.afterClosed().subscribe((result) => {
      this.getSharedMailBoxes();
    });
  }

  deleteShareMailbox (record: any) {
    let deleteClientSetupAlert = new SweetAlertController();
    deleteClientSetupAlert.deleteConfirm({}, () => {
      record.active = false;
      this.httpService.update('UrlDetails.$saveSharedMailboxUrl', record) // TODO: Vido
                .subscribe(response => {
                  this._toastCtrl.success('Shared MailBox Deleted Successfully');
                  this.getSharedMailBoxes();
                }, () => {
                  this._toastCtrl.error('Something went wrong, Please try again.');
                });

    });
  }
}
