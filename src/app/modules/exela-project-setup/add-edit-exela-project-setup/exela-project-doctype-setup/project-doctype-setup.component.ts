import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { NgDataTablesComponent } from '../../../shared/modules/ng-data-tables/ng-data-tables.component';
import { HttpService } from '../../../shared/providers/http.service';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { SweetAlertController } from '../../../shared/controllers/sweet-alert.controller';
import { AddEditProjectDocTypeSetupComponent } from './add-edit-project-doctype-setup/add-edit-project-doctype-setup.component';
import { SessionService } from '../../../shared/providers/session.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-project-doctype-setup',
  templateUrl: './project-doctype-setup.component.html',
  styleUrls: ['./project-doctype-setup.component.scss']
})

export class ProjectDocTypeSetupComponent implements OnInit, OnDestroy {

  @Input('mode') mode = '';

  @Input('projectId') projectId = '';

  @ViewChild(NgDataTablesComponent)
    private dataTableComp: NgDataTablesComponent;

  projects = [];
  queues = [];

  columns: Array<any> = [
    {
      title: 'NAME',
      key: 'name',
      sortable: true,
      filter: true
    },
    {
      title: 'DESCRIPTION',
      key: 'description',
      sortable: true,
      filter: true,
      tooltip: true
    },
    {
      title: 'METADATA FIELDS',
      key: 'link',
      sortable: true,
      filter: true,
      link: true
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
    height: '220px',
    panelClass: 'appModalPopup'
  };

  constructor (public dialog: MatDialog,
        private _router: Router,
        public _toastCtrl: ToastrService,
        public httpService: HttpService) {

  }

  ngOnInit () {
    this.getAllDocTypes();
  }

  getAllDocTypes () {
    let req = {
      projectId : this.projectId
    };
    this.httpService.get(UrlDetails.$exela_getDocTypesUrl,req)
            .subscribe((data: any) => {
              let tmpRecords = [];
              data.doctypes.forEach((item: any) => {
                if (item.active) {
                  item.link = 'link';
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
    let addQueueDialogRef = this.dialog.open(AddEditProjectDocTypeSetupComponent, this.dialogOptions);
    addQueueDialogRef.componentInstance.heading = 'Add DocType';
    addQueueDialogRef.componentInstance.saveBtnTitle = 'Add';
    addQueueDialogRef.componentInstance.projects = this.projects;
    addQueueDialogRef.componentInstance.queues = [];
    addQueueDialogRef.componentInstance.mode = 'Add';
    addQueueDialogRef.componentInstance.projectId = this.projectId;
    addQueueDialogRef.afterClosed().subscribe((result) => {
      if (typeof result !== 'undefined') {
        this.getAllDocTypes();
      }
    });
  }

  editQueuePopup (record: any) {
    console.log(record);
    let editQueueDialogRef = this.dialog.open(AddEditProjectDocTypeSetupComponent, this.dialogOptions);
    editQueueDialogRef.componentInstance.heading = 'Edit DocType';
    editQueueDialogRef.componentInstance.saveBtnTitle = 'Save';
    editQueueDialogRef.componentInstance.projects = this.projects;
    editQueueDialogRef.componentInstance.queues = this.queues;
    editQueueDialogRef.componentInstance.mode = 'Edit';
    editQueueDialogRef.componentInstance.projectId = this.projectId;
    editQueueDialogRef.componentInstance.setEditFormValues(record);
    editQueueDialogRef.afterClosed().subscribe((result) => {
      if (typeof result !== 'undefined') {
        this.getAllDocTypes();
      }
    });
  }

  deleteQueue (record: any) {
    let deleteQueueSetupAlert = new SweetAlertController();
    deleteQueueSetupAlert.deleteConfirm({}, () => {
      record.active = false;
      record.projectId = this.projectId;
      this.httpService.save(UrlDetails.$exela_addOrUpdateProjectDocTypeUrl, record)
                .subscribe(response => {
                  this.getAllDocTypes();
                  this._toastCtrl.success('Doctype Deleted');
                }, () => {
                  this._toastCtrl.error('Something went wrong');
                });

    });
  }

  gotoFormElements (record: any) {
    let base = SessionService.get('base-role');
    this._router.navigate(['/' + base + '/exela-formtype-setup/' + this.projectId + '/' + record.row.name + '/' + record.row._id]);
  }

  ngOnDestroy () {

  }

}
