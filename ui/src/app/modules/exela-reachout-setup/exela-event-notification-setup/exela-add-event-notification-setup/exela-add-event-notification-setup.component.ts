import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../../shared/providers/http.service';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { SessionService } from '../../../shared/providers/session.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { StorageService } from '../../../shared/providers/storage.service';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from 'src/app/modules/request.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-exela-add-event-notification-setup',
  templateUrl: './exela-add-event-notification-setup.component.html',
  styleUrls: ['./exela-add-event-notification-setup.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ExelaAddEventNotificationSetupComponent implements OnInit {
  @Input('selectedAction') selectedAction = {};
  @Input('heading') heading;
  @Input('mode') mode = '';
  @Input('_id') _id = '';
  ruleList: any;
  addEventNotificationForm: FormGroup;
  logoUrl: any = '../../../../../assets/images/mailer.jpg';
  showNameError: Boolean = false;
  customergroup: any;
  showDisplayNameError: Boolean = false;
  smsText: boolean = false;
  emailText: boolean = false;
  errorMsg: boolean = false;
  isDisabled = false;
  organizationId: string = '';
  sessionClientId: string = '';
  eventRecord: Array<any> = [];

  constructor (
    private _fb: FormBuilder,
    private _router: Router,
    public _dialogRef: MatDialogRef<ExelaAddEventNotificationSetupComponent>,
    public _toastCtrl: ToastrService,
    private httpService: HttpService,
    private requestService: RequestService
  ) {
    this.sessionClientId = StorageService.get(StorageService.organizationId);
    this.addEventNotificationForm = this._fb.group({
      _id: new FormControl(),
      eventname: new FormControl('', [Validators.required]),
      eventtype: new FormControl(''),
      description: new FormControl('', [Validators.required]),
      rule: new FormControl('', [Validators.required]),
      notificationmode: new FormControl(''),
      escalationmethodname: new FormControl('', [Validators.required]),
      customerGroup: new FormControl(''),
      sms: new FormControl({ value: false, disabled: true }),
      email: new FormControl({ value: false, disabled: true }),
      smstext: new FormControl(null),
      emailtext: new FormControl(null),
      subject: 'ReachOut Module',
      htmldata: '',
      deleteFlag: false,
      active: true
    });
  }

  ngOnInit () {
    this.getEscalationMethodDetails();
    this.getPoiDetails();
    this.getRule();
    this.getCustomerGroupDetails();
    this.getEventNotificationDetails();

    this.addEventNotificationForm.patchValue(this.selectedAction);
  }

  rules: Array<any> = [
    { value: 'rule1', text: 'Select all records from POI' }
  ];

  eventtypes: Array<any> = [
    { value: 'Maintenance', text: 'Maintenance' },
    { value: 'Risk', text: 'Risk' }
  ];

  records: Array<any> = [];
  records1: Array<any> = [];

  saveEventNotificationForm ({ value, valid }: { value: any, valid: boolean }) {
    if (this.ruleList !== undefined) {
      this.ruleList.forEach(data => {
        if (data._id === value.rule) {
          this.organizationId = data.organizationid;
        }
      });
    }
    value.organizationId = this.organizationId;
    value['sms'] = this.addEventNotificationForm.controls['sms'].value;
    value['email'] = this.addEventNotificationForm.controls['email'].value;
    if (!value.sms && !value.email) {
      this.errorMsg = true;
    }
    if (!valid || (!value.email && !value.sms)) {
      this.addEventNotificationForm.get('escalationmethodname').markAsTouched();
      this.addEventNotificationForm.get('rule').markAsTouched();
      this.addEventNotificationForm.markAsDirty();
    } else {
      if (value.sms === true && value.email === false) {
        value.notificationmode = 'SMS';
      } else if (value.email === true && value.sms === false) {
        value.notificationmode = 'EMAIL';
      } else if (value.sms === true && value.email === true) {
        value.notificationmode = 'SMS|EMAIL';
      } else if (value.email === false && value.sms === false) {
        value.notificationmode = 'No mode selected';
      }
      const newObject: any = {
        _id: value._id,
        event_name: value.eventname,
        event_type: value.eventtype,
        description: value.description,
        rule: value.rule,
        notification_mode: value.notificationmode,
        escalation_method_name: value.escalationmethodname,
        customer_group: value.customerGroup,
        sms: value.sms,
        email: value.email,
        sms_text: value.smstext,
        email_text: value.emailtext,
        subject: value.subject,
        html_data: value.htmldata,
        active: value.active
      };

      if (this.mode === 'add') {
        this.requestService.doPOST('/api/reachout/eventNotifications', newObject, 'API_CONTRACT').subscribe(response => {
          this._toastCtrl.success('Event Notification has been added Successfully');
          this.closePopup();
        }, (error) => {
          if (error.status === 400) {
            this._toastCtrl.error(error.error);
          }
        });
      } else {
        this.requestService.doPUT(`/api/reachout/eventNotifications/${newObject._id}`, newObject, 'API_CONTRACT').subscribe(response => {
          this._toastCtrl.success('Event Notification has been updated Successfully');
          this.closePopup();
        }, (error) => {
          if (error.status === 400) {
            this._toastCtrl.error(error.error);
          }
        });
      }
    }
  }

  setEditFormValues (details?: any) {
    this.isDisabled = true;
    this.addEventNotificationForm.patchValue(details);
    if (!this.addEventNotificationForm.get('sms').value) {
      this.addEventNotificationForm.get('smstext').disable();
    } else {
      this.addEventNotificationForm.get('smstext').enable();
    }

    if (!this.addEventNotificationForm.get('email').value) {
      this.addEventNotificationForm.get('emailtext').disable();
    } else {
      this.addEventNotificationForm.get('emailtext').enable();
    }
  }

  gotoEventNotificationSetup () {
    let base = SessionService.get('base-role');
    this._router.navigate(['/' + base + '/reachout-setup/ro-event-notification']);
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
    }, () => {
    });
  }

  selectSmsBox ({ value, valid }: { value: any, valid: boolean }) {
    if (value.email || value.sms) {
      this.errorMsg = false;
    }

    const getsmsControl = this.addEventNotificationForm.get('smstext');
    this.addEventNotificationForm.get('sms').valueChanges.subscribe((mode: string) => {
      if (mode && (value.smstext === null || value.smstext === '')) {
        getsmsControl.setValidators([Validators.required]);
        this.smsText = true;
      } else {
        getsmsControl.clearValidators();
        this.smsText = false;
      }
      getsmsControl.updateValueAndValidity();
    });
  }

  addSmsBody ({ value, valid }: { value: any, valid: boolean }) {
    if (value.smstext !== '') {
      this.smsText = false;
    } else {
      this.smsText = true;
    }
  }

  selectEmailBox ({ value, valid }: { value: any, valid: boolean }) {
    if (value.email || value.sms) {
      this.errorMsg = false;
    }

    const getemailControl = this.addEventNotificationForm.get('emailtext');
    this.addEventNotificationForm.get('email').valueChanges.subscribe((mode: string) => {
      if (mode && (value.emailtext === null || value.emailtext === '')) {
        getemailControl.setValidators([Validators.required]);
        this.emailText = true;
      } else {
        getemailControl.clearValidators();
        this.emailText = false;
      }
      getemailControl.updateValueAndValidity();
    });
  }

  addEmailBody ({ value, valid }: { value: any, valid: boolean }) {
    if (value.emailtext !== '') {
      this.emailText = false;
    } else {
      this.emailText = true;
    }
  }

  getPoiDetails () {
    this.requestService.doGET('/api/reachout/poiDetails', 'API_CONTRACT').subscribe(response => {
      let tmpRecords = [];
      (response as Observable<any>).forEach((item: any) => {
        if (!(item.deleteFlag) && item.active === true) {
          tmpRecords.push(item);
        }
      });
      this.records1 = tmpRecords;
    }, () => { });
  }

  getRule () {
    this.httpService.get(UrlDetails.$getRuleUrl,{}).subscribe(response => {
      let tmpRecords = [];
      response.forEach((item: any) => {
        if (item.active === true && this.sessionClientId === item.organizationid) {
          tmpRecords.push(item);
        } else if (item.active === true && this.sessionClientId === 'undefined') {
          tmpRecords.push(item);
        }
      });
      this.ruleList = tmpRecords;
    });
  }

  getCustomerGroupDetails () {
    this.requestService.doGET('/api/reachout/customerGroups', 'API_CONTRACT').subscribe(response => {
      let tmpRecords = [];
      (response as Observable<any>).forEach((item: any) => {
        if (!item.deleteFlag && item.active === true && this.sessionClientId === item.organization_id) {
          tmpRecords.push(item);
        } else if (!item.deleteFlag && item.active === true && this.sessionClientId === 'undefined') {
          tmpRecords.push(item);
        }
      });
      this.customergroup = tmpRecords;
    }, () => {});
  }

  onChanges (event) {
    this.addEventNotificationForm.controls['sms'].setValue(false);
    this.addEventNotificationForm.controls['email'].setValue(false);
    this.records.forEach((item: any) => {
      if (item.escalation_method === event.value) {
        if (item.contact_method === 'email' || item.contact_method === 'sms') {
          this.errorMsg = false;
        }
        let emailCheck = item.contact_method.indexOf('email');
        let smsCheck = item.contact_method.indexOf('sms');
        if (emailCheck > -1 && smsCheck > -1) {
          this.errorMsg = false;
          this.addEventNotificationForm.controls['sms'].setValue(true);
          this.addEventNotificationForm.controls['email'].setValue(true);
          let smsValue = this.addEventNotificationForm.controls['smstext'].value;
          let emailValue = this.addEventNotificationForm.controls['emailtext'].value;
          const getsmsControl = this.addEventNotificationForm.get('smstext');
          const getemailControlemail = this.addEventNotificationForm.get('emailtext');
          getsmsControl.enable();
          getemailControlemail.enable();
          if (smsValue === null || smsValue === '') {
            getsmsControl.setValidators([Validators.required]);
            this.smsText = true;
          } else {
            getsmsControl.clearValidators();
            this.smsText = false;
          }
          if (emailValue === null || emailValue === '') {
            getemailControlemail.setValidators([Validators.required]);
            this.emailText = true;
          } else {
            getemailControlemail.clearValidators();
            this.emailText = false;
          }
          getsmsControl.updateValueAndValidity();
          getemailControlemail.updateValueAndValidity();
        } else if (emailCheck > -1 && smsCheck === -1) {
          this.errorMsg = false;
          let value = this.addEventNotificationForm.controls['emailtext'].value;
          this.addEventNotificationForm.controls['email'].setValue(true);
          const getemailControl = this.addEventNotificationForm.get('emailtext');
          const getsmsControl = this.addEventNotificationForm.get('smstext');
          getemailControl.enable();
          getsmsControl.disable();
          if ((value === null || value === '')) {
            getemailControl.setValidators([Validators.required]);
            this.emailText = true;
            this.smsText = false;
          } else {
            getemailControl.clearValidators();
            this.emailText = false;
          }
          getemailControl.updateValueAndValidity();
          getsmsControl.clearValidators();
          getsmsControl.updateValueAndValidity();
          this.smsText = false;
        } else if (emailCheck === -1 && smsCheck > -1) {
          this.errorMsg = false;
          this.addEventNotificationForm.controls['sms'].setValue(true);
          let value = this.addEventNotificationForm.controls['smstext'].value;
          const getsmsControl = this.addEventNotificationForm.get('smstext');
          const getemailControl = this.addEventNotificationForm.get('emailtext');
          getsmsControl.enable();
          getemailControl.disable();
          if ((value === null || value === '')) {
            getsmsControl.setValidators([Validators.required]);
            this.smsText = true;
          } else {
            getsmsControl.clearValidators();
            this.smsText = false;
          }
          getsmsControl.updateValueAndValidity();
          getemailControl.setValidators([]);
          getemailControl.clearValidators();
          getemailControl.updateValueAndValidity();
          this.emailText = false;
        } else if (emailCheck === -1 && smsCheck === -1) {
          this.errorMsg = false;
          const getsmsControl = this.addEventNotificationForm.get('smstext');
          const getemailControl = this.addEventNotificationForm.get('emailtext');
          getsmsControl.clearValidators();
          getsmsControl.updateValueAndValidity();
          getemailControl.clearValidators();
          getemailControl.updateValueAndValidity();
          getsmsControl.disable();
          getemailControl.disable();
          this.emailText = false;
          this.smsText = false;
        }
      }
    });
  }

  closePopup () { this._dialogRef.close(); }

  getEventNotificationDetails () {
    this.requestService.doGET('/api/reachout/eventNotifications', 'API_CONTRACT').subscribe(response => {
      let tmpRecords = [];
      (response as Observable<any>).forEach((item: any) => {
        if (!(item.deleteFlag)) {
          tmpRecords.push(item);
        }
      });
      this.eventRecord = tmpRecords;
    }, () => {
    });
  }
}
