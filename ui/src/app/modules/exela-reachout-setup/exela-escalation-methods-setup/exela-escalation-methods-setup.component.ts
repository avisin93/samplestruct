import { Component, OnInit, OnDestroy, ViewChild,Input } from '@angular/core';
import { NgDataTablesComponent } from '../../shared/modules/ng-data-tables/ng-data-tables.component';
import { SweetAlertController } from '../../shared/controllers/sweet-alert.controller';
import { MatDialog } from '@angular/material';
import { ExelaAddEscalationMethodSetupComponent } from './exela-add-escalation-methods-setup/exela-add-escalation-methods-setup.component';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from '../../request.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-exela-escalation-methods-setup',
  templateUrl: './exela-escalation-methods-setup.component.html',
  styleUrls: ['./exela-escalation-methods-setup.component.scss']
})

export class ExelaEscalationMethodsSetupComponent implements OnInit, OnDestroy {

  @ViewChild(NgDataTablesComponent)
    @Input() showDeleteButton: boolean = false;
  records: Array<any> = [];
  _id: string = '';
  totalRows: number = 0;
  @ViewChild(NgDataTablesComponent)
  private dataTableComp: NgDataTablesComponent;
  hasActionButtons: boolean = true;
  showDeactivateButton: boolean = true;
  breadcrumbs: Array<any> = [
    {  text: 'Home', base: true, link: '/home', active: false },
    { text: 'ReachOut', base: true, link: '/reachout-setup', active: false },
    { text: 'Escalation Method', base: true, link: '', active: true }
  ];
  columns: Array<any> = [
    { title: 'ESCALATION METHOD', key: 'escalation_method', sortable: true, filter: true },
    { title: 'ESCALATION ORDER', key: 'contact_method', sortable: true,filter: true },
    { title: 'MAX ATTEMPTS', key: 'max_attempts', sortable: true, filter: true }
  ];

  dialogOptions: any = {
    height: 'auto',
    width: '550px'
  };

  constructor (
    public requestService: RequestService,
    public toastController: ToastrService,
    public dialog: MatDialog
  ) {}

  ngOnInit () {
    this.getEscalationMethodDetails();
  }

  addEscalationMethod () {
    let addUserDialogRef = this.dialog.open(ExelaAddEscalationMethodSetupComponent, this.dialogOptions);
    addUserDialogRef.componentInstance.selectedAction = {};
    addUserDialogRef.componentInstance.mode = 'add';
    addUserDialogRef.componentInstance.heading = 'Add Escalation Methods';
    addUserDialogRef.afterClosed().subscribe((result) => {
      this.getEscalationMethodDetails();
    });
  }

  getEscalationMethodDetails () {
    this.requestService.doGET('/api/reachout/escalationMethodDetails', 'API_CONTRACT').subscribe(response => {
      let tmpRecords = [];
      (response as Observable<any>).forEach((item: any) => {
        if (!(item.deleteFlag)) {
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

  editEscalationMethodPopup (data: any) {
    let editUserDialogRef = this.dialog.open(ExelaAddEscalationMethodSetupComponent, this.dialogOptions);
    editUserDialogRef.componentInstance.heading = 'Edit Event Notification';

    const preparedData = {
      _id: data._id,
      escalationmethod: data.escalation_method,
      contactmethod: data.contact_method,
      maxattempts: data.max_attempts,
      active: data.active,
      escalationOrder: data.escalation_order
    };

    editUserDialogRef.componentInstance.setEditFormValues(preparedData);
    editUserDialogRef.componentInstance.mode = 'edit';
    editUserDialogRef.afterClosed().subscribe(result => {
      this.getEscalationMethodDetails();
    });
  }

  deleteEscalationMethodDetail (record: any) {
    let deleteClientSetupAlert = new SweetAlertController();
    deleteClientSetupAlert.deleteConfirm({}, () => {
      this.requestService.doDELETE(`/api/reachout/escalationMethodDetails/${record._id}`, 'API_CONTRACT').subscribe(response => {
        this.toastController.success('Escalation Method Entry Deleted Successfully');
        this.getEscalationMethodDetails();
      }, () => {
        this.toastController.error('Something went wrong, Please try again.');
      });
    });
  }

  activateDeactivateEscalationMethod (record: any) {
    let txtMsg = '';
    if (!(record.active)) {
      txtMsg = 'Do you want to deactivate the ' + record.escalation_method + ' ?';
    } else {
      txtMsg = 'Do you want to activate the ' + record.escalation_method + ' ?';
    }

    this.showConfirmationMsg(txtMsg,() => {
      this.requestService.doPUT(`/api/reachout/escalationMethodDetails/${record._id}`, record, 'API_CONTRACT').subscribe(response => {
        this.getEscalationMethodDetails();
        this.toastController.success('Escalation Method successfully updated');
      }, () => {
        this.toastController.error('Something went wrong');
      }, () => {});
    }, () => {
      record.active = !(record.active);
    });
  }

  showConfirmationMsg (textMsg,callbackfn,noCallbackfn) {
    let confimMsg = new SweetAlertController();
    let options = {
      title: 'Confirm Message',
      text: textMsg,
      type: 'warning',
      width: '370px',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    };
    confimMsg.deleteConfirm(options,callbackfn,noCallbackfn);
  }

  ngOnDestroy () {}
}
