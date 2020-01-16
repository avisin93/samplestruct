import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { NgDataTablesComponent } from '../../../shared/modules/ng-data-tables/ng-data-tables.component';
import { HttpService } from '../../../shared/providers/http.service';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { AddEditQueueSetupComponent } from './add-edit-queue-setup/add-edit-queue-setup.component';
import { SweetAlertController } from '../../../shared/controllers/sweet-alert.controller';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-project-queue-setup',
  templateUrl: './queue-setup.component.html',
  styleUrls: ['./queue-setup.component.scss']
})

export class QueueSetupComponent implements OnInit, OnDestroy {

  @Input('mode') mode = '';

  @Input('projectId') projectId = '';

  @ViewChild(NgDataTablesComponent)
    private dataTableComp: NgDataTablesComponent;

  queues = [];

  columns: Array<any> = [
    {
      title: 'QUEUE NAME',
      key: 'name',
      sortable: true,
      filter: true
    },
    {
      title: 'QUEUE FOR',
      key: 'queuefor',
      sortable: true,
      filter: true,
      tooltip: true
    },
    {
      title: 'QUEUE TYPE',
      key: 'queuetype',
      sortable: true,
      filter: true
    },
    {
      title: 'NEXT QUEUE',
      key: 'nextqueuename',
      sortable: true,
      filter: true
    }
  ];

  records: Array<any> = [];

  totalRows: number = 1;

  hasActionButtons: number = 1;

  breadcrumbs: Array<any> = [
    {
      text: 'Home',
      base: true,
      link: '/home',
      active: false
    },
    {
      text: 'Queue Setup',
      base: false,
      link: '',
      active: true
    }
  ];

  dialogOptions: any = {
    width: '500px',
    height: '340px',
    panelClass: 'appModalPopup'
  };

  constructor (public dialog: MatDialog,
        private _router: Router,
        public _toastCtrl: ToastrService,
        public httpService: HttpService) {

  }

  ngOnInit () {
    this.getAllQueues();
  }

  getAllQueues () {
    let req = {
      projectId: this.projectId
    };
    this.httpService.get(UrlDetails.$exela_getQueuesUrl, req)
            .subscribe((data: any) => {
              let tmpRecords = [];
              data.forEach((item: any) => {
                if (item.active) {
                  item.nextqueuename = item.nextqueue ? item.nextqueue.name : '';
                  tmpRecords.push(item);
                }
              });

              this.records = tmpRecords;
              this.queues = this.records;
              this.totalRows = this.records.length;
              this.dataTableComp.setPage(1);
            }, (error) => {
              console.log(error);
              this.dataTableComp.setPage(1);
            });
  }

  addQueuePopup () {
    let addQueueDialogRef = this.dialog.open(AddEditQueueSetupComponent, this.dialogOptions);
    addQueueDialogRef.componentInstance.heading = 'Add Queue';
    addQueueDialogRef.componentInstance.saveBtnTitle = 'Add';
    addQueueDialogRef.componentInstance.queues = [];
    addQueueDialogRef.componentInstance.mode = 'Add';
    addQueueDialogRef.componentInstance.queues = this.queues;
    addQueueDialogRef.componentInstance.projectId = this.projectId;
    addQueueDialogRef.afterClosed().subscribe((result) => {
      if (typeof result !== 'undefined') {
        this.getAllQueues();
      }
    });
  }

  editQueuePopup (record: any) {
    let editQueueDialogRef = this.dialog.open(AddEditQueueSetupComponent, this.dialogOptions);
    editQueueDialogRef.componentInstance.heading = 'Edit Queue';
    editQueueDialogRef.componentInstance.saveBtnTitle = 'Save';
    editQueueDialogRef.componentInstance.queues = this.queues;
    editQueueDialogRef.componentInstance.mode = 'Edit';
    editQueueDialogRef.componentInstance.projectId = this.projectId;
    editQueueDialogRef.componentInstance.setEditFormValues(record);
    editQueueDialogRef.afterClosed().subscribe((result) => {
      if (typeof result !== 'undefined') {
        this.getAllQueues();
      }
    });
  }

  deleteQueue (record: any) {
    let deleteQueueSetupAlert = new SweetAlertController();
    deleteQueueSetupAlert.deleteConfirm({}, () => {
      record.active = false;
      record.projectId = this.projectId;
      record.queuetype = record.queuetype + '_deleted';

      this.httpService.save(UrlDetails.$exela_addOrUpdateProjectQueueUrl, record)
                .subscribe(response => {
                  this.getAllQueues();
                  this._toastCtrl.success('Queue Deleted');
                }, () => {
                  this._toastCtrl.error('Something went wrong');
                });

    });
  }

  ngOnDestroy () {

  }

}
