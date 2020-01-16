import { Component, OnInit, OnDestroy, ViewChild,Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgDataTablesComponent } from '../../shared/modules/ng-data-tables/ng-data-tables.component';
import { HttpService } from '../../shared/providers/http.service';
import { UrlDetails } from '../../../models/url/url-details.model';
import { StorageService } from '../../shared/providers/storage.service';
import { SweetAlertController } from '../../shared/controllers/sweet-alert.controller';
import { MatDialog } from '@angular/material';
import { ExelaAddEventNotificationSetupComponent } from './exela-add-event-notification-setup/exela-add-event-notification-setup.component';
import { isNullOrUndefined } from 'util';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from '../../request.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-exela-event-notification-setup',
  templateUrl: './exela-event-notification-setup.component.html',
  styleUrls: ['./exela-event-notification-setup.component.scss']
})
export class ExelaEventNotificationSetupComponent implements OnInit, OnDestroy {
  @ViewChild(NgDataTablesComponent)
    private dataTableComp: NgDataTablesComponent;
  @Input('mode') mode = '';
  _id: string = '';
  objId: string = '';
  @Input() showDeleteButton: boolean = false;
  columns: Array<any> = [
    { title: 'EVENT TYPE', key: 'event_type', sortable: true, filter: true },
    { title: 'EVENT NAME', key: 'event_name', sortable: true, filter: true },
    { title: 'ESCALATION METHOD', key: 'escalation_method_name', sortable: true, filter: true },
    { title: 'NOTIFICATION MODE', key: 'notification_mode', sortable: true, filter: true }
  ];
  records: Array<any> = [];
  records1: any;
  totalRows: number = 0;
  emailAndSms: boolean = false;
  hasActionButtons: boolean = true;
  showDeactivateButton: boolean = true;
  showCalenderButton: boolean = true;
  showSmsButton: boolean = true;
  showMailButton: boolean = true;
  showForwardButton: boolean = true;
  isDisabled = false;
  sessionClientId: string = '';
  breadcrumbs: Array<any> = [
    { text: 'Home', base: true, link: '/home', active: false },
    { text: 'ReachOut', base: true, link: '/reachout-setup', active: false },
    { text: 'Event Notification', base: true, link: '', active: true }
  ];
  dialogOptions: any = {
    width: '450px'
    // height: '260px'
  };

  constructor (
    private _router: Router,
    private route: ActivatedRoute,
    public requestService: RequestService,
    public httpService: HttpService,
    public toastController: ToastrService,
    public dialog: MatDialog
  ) {
    this.sessionClientId = StorageService.get(StorageService.organizationId);
  }

  ngOnInit () {
    this.route.data.subscribe((dataParams: any) => {
      this.mode = dataParams.mode;
      if (this.mode === 'edit') {
        // this.heading = 'Edit Client';
        this.route.params.subscribe((params: any) => {
          this._id = params.id;
        });
      }
    });
    this.getEventNotificationDetails();
    this.getEscalationMethodDetails();
  }

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

  saveEventNotification () {
    let addUserDialogRef = this.dialog.open(ExelaAddEventNotificationSetupComponent, this.dialogOptions);
    addUserDialogRef.componentInstance.selectedAction = {};
    addUserDialogRef.componentInstance.mode = 'add';
    addUserDialogRef.componentInstance.heading = 'Add Event Notification';
    addUserDialogRef.afterClosed().subscribe((result) => {
      this.getEventNotificationDetails();
    });
  }

  editEventNotification (data: any) {
    if (typeof data._id !== 'undefined') {
      this._router.navigate(['edit/' + data._id], { relativeTo: this.route });
      this._id = data._id;
    }
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
    let deleteClientSetupAlert = new SweetAlertController();
    deleteClientSetupAlert.deleteConfirm({}, () => {
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
      txtMsg = 'Do you want to deactivate the ' + record.event_name + ' ?';
    } else {
      txtMsg = 'Do you want to activate the ' + record.event_name + ' ?';
    }

    this.showConfirmationMsg(txtMsg,() => {
      this.requestService.doPUT(`/api/reachout/eventNotifications/${record._id}`, record, 'API_CONTRACT').subscribe(response => {
        this.getEventNotificationDetails();
        this.toastController.success('Event Notification successfully updated');
      }, () => {
        this.toastController.error('Something went wrong');
      },() => { });
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

  triggerMail (record: any) {
    if (record.email === true) {
      for (let i = 0; i < this.records1.length; i++) {
        if (!isNullOrUndefined(this.records1[i]) && !isNullOrUndefined(this.records1[i].escalation_method) && this.records1[i].escalation_method.toLowerCase() === record.escalation_method_name.toLowerCase()) {
          if (record.active === true) {
            if (this.records1[i].active === true) {
              const payload = { ruleId: record.rule, htmldata: record };
              return this.httpService.get(UrlDetails.$getExecuteRuleUrl,payload).subscribe(response => {
                if (this.emailAndSms) {
                  this.toastController.success('Mail and SMS notification sent Successfully');
                } else {
                  this.toastController.success('Mail notification sent Successfully');
                }
                this.getEventNotificationDetails();
              }, () => {
                this.toastController.error('POI Record not found');
              });
            } else {
              this.toastController.error('Escalation Method is deactivated');
            }
          } else {
            this.toastController.error('Event Notification is deactivated');
          }
        } else { }
      }
    }
  }

  triggerSms (record: any) {
    if (record.sms === true) {
      for (let i = 0;i < this.records1.length;i++) {
        if (!isNullOrUndefined(this.records1[i]) && !isNullOrUndefined(this.records1[i].escalationmethod) && this.records1[i].escalationmethod.toLowerCase() === record.escalationmethodname.toLowerCase()) {
          if (record.active === true) {
            if (this.records1[i].active === true) {
              const payload = { ruleId: record.rule, htmldata: record };
              return this.httpService.get(UrlDetails.$getExecuteRuleUrl,payload).subscribe(response => {
                this.toastController.success('Sms notification sent Successfully');
                this.getEventNotificationDetails();
              }, () => {
                this.toastController.error('POI Record not found');
              });
            } else {
              this.toastController.error('Escalation Method is deactivated');
            }
          } else {
            this.toastController.error('Event Notification is deactivated');
          }
        } else { }
      }
    }
  }

  triggerMailSms (record: any) {
    this.emailAndSms = true;
    this.triggerMail(record);
    // this.triggerSms(record);
  }

  EscalationRecordsLength: any;
  getEscalationMethodDetails () {
    this.requestService.doGET('/api/reachout/escalationMethodDetails', 'API_CONTRACT').subscribe(response => {
      let tmpRecords = [];
      (response as Observable<any>).forEach((item: any) => {
        tmpRecords.push(item);
      });
      this.records1 = tmpRecords;
    }, () => {
    });
  }

  ngOnDestroy () {}
}
