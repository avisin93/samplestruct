import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgDataTablesComponent } from '../shared/modules/ng-data-tables/ng-data-tables.component';
import { SweetAlertController } from '../shared/controllers/sweet-alert.controller';
import { ExelaAddEventNotificationSetupComponent } from './exela-event-notification-setup/exela-add-event-notification-setup/exela-add-event-notification-setup.component';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from '../request.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-exela-reachout-setup',
  templateUrl: './exela-reachout-setup.component.html',
  styleUrls: ['./exela-reachout-setup.component.scss']
})

export class ExelaReachoutSetupComponent implements OnInit, OnDestroy {

  @ViewChild(NgDataTablesComponent)
    private dataTableComp: NgDataTablesComponent;
  _id: string = '';
  showDeleteButton: boolean = true;
  columns: Array<any> = [
    {
      title: 'EVENT NAME',
      key: 'eventname',
      sortable: true,
      filter: true
    },
    {
      title: 'DESCRIPTION',
      key: 'description',
      sortable: true,
      filter: true
    },
    {
      title: 'NOTIFICATION MODE',
      key: 'notificationmode',
      sortable: true,
      filter: true
    }
  ];

  records: Array<any> = [];

  totalRows: number = 0;

  hasActionButtons: boolean = true;

  showEditButton: boolean = false;
  showDeactivateButton: boolean = true;
  showMailButton: boolean = false;

  breadcrumbs: Array<any> = [
    {
      text: 'Home',
      base: true,
      link: '/home',
      active: false
    },
    {
      text: 'ReachOut',
      base: false,
      link: '',
      active: true
    }
  ];

  constructor (
    public requestService: RequestService,
    public toastController: ToastrService,
    public dialog: MatDialog
  ) {}

  ngOnInit () {
    this.getEventNotificationDetails();
  }

  dialogOptions: any = {
    width: '450px'
    // height: '260px'
  };

  getEventNotificationDetails () {
    this.requestService.doGET('/api/reachout/eventNotifications', 'API_CONTRACT').subscribe(response => {
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

  editEventNotificationPopup (data: any) {
    let editUserDialogRef = this.dialog.open(ExelaAddEventNotificationSetupComponent, this.dialogOptions);
    editUserDialogRef.componentInstance.heading = 'Edit Event Notification';
    const preparedData = {
      _id: data._id,
      eventname: data.event_name,
      eventtype: data.event_type,
      description: data.description,
      rule: data.rule,
      notificationmode: data.notification_mode,
      escalationmethodname: data.escalation_method_name,
      customerGroup: data.customer_group,
      sms: data.sms,
      email: data.email,
      smstext: data.sms_text,
      emailtext: data.email_text,
      subject: data.subject,
      htmldata: data.html_data,
      active: data.active
    };
    editUserDialogRef.componentInstance.setEditFormValues(preparedData);
    editUserDialogRef.componentInstance.mode = 'edit';
    editUserDialogRef.componentInstance._id = this._id;
    editUserDialogRef.afterClosed().subscribe(result => {
      this.getEventNotificationDetails();
    });

  }

  deleteEventNotificationDetail (record: any) {
    let deleteEventNotificationSetupAlert = new SweetAlertController();
    deleteEventNotificationSetupAlert.deleteConfirm({}, () => {
      // record.active = false;
      this.requestService.doDELETE(`/api/reachout/eventNotifications/${record._id}`, 'API_CONTRACT').subscribe(response => {
        this.toastController.success('Event Notification Entry Deleted Successfully');
        this.getEventNotificationDetails();
      }, () => {
        this.toastController.error('Something went wrong, Please try again.');
      });
    });
  }

  activateDeactivateEventNotification (record: any) {
    let txtMsg = '';
    if (!(record.active)) {
      txtMsg = 'Do you want to deactivate the ' + record.eventname + ' ?';
    } else {
      txtMsg = 'Do you want to activate the ' + record.eventname + ' ?';
    }

    this.showConfirmationMsg(txtMsg,() => {
      this.requestService.doPUT(`/api/reachout/eventNotifications/${record._id}`, record, 'API_CONTRACT').subscribe(response => {
        this.getEventNotificationDetails();
        this.toastController.success('Event Notification successfully updated');
      },() => {
        this.toastController.error('Something went wrong');
      });
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
