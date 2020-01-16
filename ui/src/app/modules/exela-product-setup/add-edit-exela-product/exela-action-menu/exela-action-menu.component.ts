import { Component, OnInit, OnDestroy, ViewChild,Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgDataTablesComponent } from '../../../shared/modules/ng-data-tables/ng-data-tables.component';
import { HttpService } from '../../../shared/providers/http.service';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { SweetAlertController } from '../../../shared/controllers/sweet-alert.controller';
import { MatDialog } from '@angular/material';
import { ExelaProductAddEditActionMenuComponent } from '../../add-edit-exela-product/exela-action-menu/add-edit-exela-action-menu/add-edit-exela-action-menu.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-exela-product-action-tab',
  templateUrl: './exela-action-menu.component.html',
  styleUrls: ['./exela-action-menu.component.scss']
})

export class ExelaProductActionMenuComponent implements OnInit {

  @ViewChild(NgDataTablesComponent)
    private dataTableComp: NgDataTablesComponent;

  @Input() showDeleteButton: boolean = true;

  @Input('mode') mode = '';
  columns: Array<any> = [
    {
      title: 'Name',
      key: 'name',
      sortable: true,
      filter: true
    },
    {
      title: 'DISPLAY NAME',
      key: 'displayname',
      sortable: true,
      filter: true
    },
    {
      title: 'Queue',
      key: 'queue',
      sortable: true,
      filter: true
    },
    {
      title: 'Status',
      key: 'status',
      sortable: true,
      filter: true
    }
  ];

  dialogOptions: any = {
    width: '450px',
    height: '300px'
  };

  records: Array<any> = [];

  totalRows: number = 0;

  hasActionButtons: boolean = true;

  allowClientAdd: boolean = true;

  constructor (private _router: Router,
        private route: ActivatedRoute,
        public httpService: HttpService,
        public toastController: ToastrService,
        public dialog: MatDialog) {

  }

  ngOnInit () {
    this.getActionList();
  }

  getActionList () {
    this.httpService.get('UrlDetails.$getActionListUrl' + '?' + Date.now(), {}).subscribe(response => { // TODO: Vido
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

  addAction () {
    let addUserDialogRef = this.dialog.open(ExelaProductAddEditActionMenuComponent, this.dialogOptions);
    addUserDialogRef.componentInstance.selectedAction = {};
    addUserDialogRef.componentInstance.mode = 'add';
    addUserDialogRef.componentInstance.heading = 'Add Action Form';
    addUserDialogRef.afterClosed().subscribe((result) => {
      this.getActionList();
    });
  }

  editAction (action: any) {
    let addUserDialogRef = this.dialog.open(ExelaProductAddEditActionMenuComponent, this.dialogOptions);
    addUserDialogRef.componentInstance.selectedAction = action;
    addUserDialogRef.componentInstance.mode = 'edit';
    addUserDialogRef.componentInstance.heading = 'Edit Action Form';
    addUserDialogRef.afterClosed().subscribe((result) => {
      this.getActionList();
    });
  }

  deleteAction (record: any) {
    let deleteClientSetupAlert = new SweetAlertController();
    deleteClientSetupAlert.deleteConfirm({}, () => {
      record.active = false;
      this.httpService.update('UrlDetails.$addOrUpdateActionUrl', record) // TODO: vido
                .subscribe(response => {
                  this.toastController.success('Action Deleted Successfully');
                  this.getActionList();
                }, () => {
                  this.toastController.error('Something went wrong, Please try again.');
                });
    });
  }
}
