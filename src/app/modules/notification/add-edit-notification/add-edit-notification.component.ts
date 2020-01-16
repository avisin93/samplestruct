import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpParams } from '@angular/common/http';
import { MatRadioChange, MatDatepickerInputEvent } from '@angular/material';
import { UserService } from '../../users.service';
import { SessionService } from '../../shared/providers/session.service';
import { dateValidator, endDateValidator, getErrorMessage } from '../../utilsValidation';
import { NotificationListService } from '../notification-list.service';
import { ContractService } from '../../contracts/contracts.service';
import { MatChipInputEvent, MatChipList } from '@angular/material/chips';
import * as moment from 'moment';
import { Pattern } from 'src/app/models/util/pattern.model';
import { StorageService } from '../../shared/providers/storage.service';

@Component({
  selector: 'cm-add-edit-notification',
  templateUrl: './add-edit-notification.component.html',
  styleUrls: ['./add-edit-notification.component.scss']
})
export class AddEditNotificationComponent implements OnInit {
  sendCopies: any[] = [];

  @ViewChild('chipList') chipList: MatChipList;
  @ViewChild('copies') copies: ElementRef;

  formGroup = new FormGroup({
    inputTitle: new FormControl('', [Validators.required]),
    selectedBusinessPartner: new FormControl('', [Validators.required]),
    selectedType: new FormControl('', [Validators.required]),
    selectedNotificationDate: new FormControl('', [Validators.required]),
    selectedLinkedContractInformation: new FormControl({value: '',
      disabled: !(this.formGroup && this.formGroup.controls &&
                this.formGroup.controls.selectedBusinessPartner.value &&
                this.formGroup.controls.selectedBusinessPartner.value !== '')}),
    description: new FormControl(''),
    radioReminder: new FormControl('false'),
    noticePeriod: new FormControl('', [Validators.pattern('^[0-9]+$')]),
    noticePeriodType: new FormControl('MONTHS'),
    selectedReminderStartDate: new FormControl(''),
    selectedReminderEndDate: new FormControl(''),
    radioBellGroup: new FormControl('ACTIVE'),
    selectedToUsers: new FormControl(''),
    inputAddEmailAddress: new FormControl('', [Validators.pattern(Pattern.EMAIL_PATTERN)]),
    selectedCcUsers: this.fb.array(this.sendCopies),
    selectedReminderType: new FormControl('THREE_DAYS', [Validators.required])
  });

  initEmail (email: string): FormControl {
    return this.fb.control(email);
  }

  arrayBusinessPartners: Array<any> = [];
  arrayNotificationType: Array<any> = [];
  arrayTimePeriods: Array<any> = [];

  arrayRevisionFrequencies: Array<any> = [];
  arrayToUsers: Array<any> = [];
  arrayCcUsers: Array<any> = [];
  arrayLinkedContractInformation: Array<any> = [];
  objectCurrentUser: any = {};

  arrayForEmailsToOnly: any[] = [];

  minDateTo;
  maxDateFrom;
  maxDateDateInput;
  minDateDateInput;

  notificationid: string;

  // CHIPS
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [];

  add (event: MatChipInputEvent): void {
    let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      const control = this.formGroup.get('selectedCcUsers') as FormArray;
      control.push(this.initEmail(value.trim()));
      console.log(control);
    }

    this.testIfCorrect(EMAIL_REGEXP);

    // Reset the input value
    if (input) {
      input.value = '';
    }

    setTimeout(() => { // this will make the execution after the above boolean has changed
      // this.copies.nativeElement.focus();
    },0);

  }

  remove (index): void {
    let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    this.formGroup.get('selectedCcUsers').removeAt(index);

    this.testIfCorrect(EMAIL_REGEXP);
    if (index >= 0) {
      this.sendCopies.splice(index, 1);
    }
  }

  testIfCorrect (EMAIL_REGEXP) {
    this.formGroup.controls['selectedCcUsers'].value.forEach(value => {
      if (value !== '') {
        if (!EMAIL_REGEXP.test(value)) {
          this.formGroup.controls['selectedCcUsers'].setErrors({ 'incorrect': true });
        } else {
          this.formGroup.controls['selectedCcUsers'].setErrors(null);
        }
      }
    });
  }

  // CHIPS END

  breadcrumbs: Array<any> = [
    {
      text: 'Notification',
      link: '/notification/notification-list',
      base: true,
      active: false
    },
    {
      text: 'Add-Edit Notification',
      base: false,
      link: '/notification/0',
      active: true
    }
  ];

  constructor (
    private route: ActivatedRoute,
    private router: Router,
    private notificationListService: NotificationListService,
    private toastr: ToastrService,
    private userService: UserService,
    private contractService: ContractService,
    private fb: FormBuilder
    ) {}

  ngOnInit () {
    this.userService.getUsers().subscribe((response: any) => {
      this.objectCurrentUser = response;
    });

    this.formGroup.get('selectedCcUsers').statusChanges.subscribe(
      status => this.chipList.errorState = status === 'INVALID'
    );
    this.notificationListService.getAllTimePeriodType().subscribe((res: any) => {
      this.arrayTimePeriods = res;
    });

    this.notificationListService.getAllNotificationTypes().subscribe((res: any) => {
      this.arrayNotificationType = res;
    });

    this.notificationListService.getAllBusinessPartners().subscribe((res: any) => {
      this.arrayBusinessPartners = res;
    });

    this.notificationid = this.route.snapshot.paramMap.get('id');

    if (typeof this.notificationid !== 'undefined'
      && this.notificationid !== null
      && this.notificationid !== '0') {
      let urlParams = {
        notificationid: `${this.notificationid}`
      };
      this.notificationListService.getNotification(urlParams).subscribe(async (response: any) => {
        if (response.msg != null && response.msg === 'Failed') {
          this.toastr.error('Error', 'Something went wrong');
        } else {
          this.formGroup.get('inputTitle').setValue(response.title);
          this.formGroup.get('selectedBusinessPartner').setValue(response.business_partner.code);
          this.formGroup.get('selectedType').setValue(response.type.code);
          this.formGroup.get('selectedLinkedContractInformation').enable();
          this.formGroup.get('selectedNotificationDate').setValue(response.date);
          this.minDateDateInput = response.date;
          await this.getContractsByBusinessPartner().then().catch();
          this.formGroup.get('selectedLinkedContractInformation').setValue(response.linked_contract.contract_id);
          this.selectedLinkedContractInformation();
          this.formGroup.get('description').setValue(response.description);
          this.formGroup.get('radioReminder').setValue(response.send_notification ? 'true' : 'false');
          // if (response.send_notification) {
          this.formGroup.get('inputAddEmailAddress').setValue(response.reminder.add_email_address);
          this.formGroup.get('radioBellGroup').setValue(response.reminder.reminder_status.code);
          this.formGroup.get('noticePeriod').setValue(response.linked_contract.notice_period);
          this.formGroup.get('noticePeriodType').setValue(response.linked_contract.notice_period_type);
          this.formGroup.get('selectedReminderStartDate').setValue(response.reminder.start_date);
          this.minDateTo = moment(response.reminder.start_date).add(1, 'd');
          this.maxDateDateInput = response.reminder.start_date;
          this.formGroup.get('selectedReminderEndDate').setValue(response.reminder.end_date);
          this.maxDateFrom = moment(response.reminder.end_date).subtract(1, 'd');
          this.formGroup.get('selectedReminderType').setValue(response.reminder.frequency_type);
          response.reminder.to_users.forEach(element => {
            let objectUser = {
              fullname: element.fullname,
              email: element.email,
              phone: element.phone_number,
              function: element.function
            };
              // this.arrayToUsers.push(objectUser);
            this.arrayCcUsers = this.arrayToUsers;
            this.arrayForEmailsToOnly.push(objectUser);
          });
          let a = this.arrayToUsers.map(x => {
            return x.email;
          });
          this.formGroup.get('selectedToUsers').setValue(response.reminder.to_users);// kurva
          console.log(this.formGroup);

          response.reminder.cc_users.forEach(element => {
            this.formGroup.get('selectedCcUsers').push(this.initEmail(element));
          });

          this.formGroup.controls['selectedReminderStartDate'].setValidators([Validators.required]);
          this.formGroup.controls['selectedReminderStartDate'].updateValueAndValidity();
          this.formGroup.controls['selectedToUsers'].setValidators([Validators.required]);
          this.formGroup.controls['selectedToUsers'].updateValueAndValidity();
          console.log(this.formGroup);
          // }
        }
      });
    }
    this.formGroup.get('selectedReminderStartDate').setValidators([ dateValidator,
      endDateValidator(this.formGroup.get('selectedReminderEndDate'))]);
  }

  selectedBusinessPartner (): void {
    if (this.formGroup.get('selectedBusinessPartner').value &&
        this.formGroup.get('selectedBusinessPartner').value !== '') {
      this.formGroup.get('selectedLinkedContractInformation').enable();
      this.getContractsByBusinessPartner();
    }
  }

  selectedLinkedContractInformation (): void {
    this.arrayToUsers = [];
    this.arrayCcUsers = [];
    this.formGroup.get('selectedToUsers').setValue('');
    this.arrayForEmailsToOnly = [];
    if (this.formGroup.get('selectedLinkedContractInformation').value &&
        this.formGroup.get('selectedLinkedContractInformation').value !== '') {
      let objectContract = this.arrayLinkedContractInformation.find((item) => {
        return item._id === this.formGroup.get('selectedLinkedContractInformation').value;
      });
      let arrayContactPersons = objectContract.contact_persons;
      if (!(Object.entries(arrayContactPersons).length === 0 && arrayContactPersons.constructor === Object)) {
        arrayContactPersons.forEach(element => {
          let objectUser = {
            fullname: element.person,
            email: element.email,
            phone: element.phone_number,
            function: element.function,
            country_phone_code: element.country_phone_code,
            country_code: element.country_code,
            country_name: element.country_name
          };
          this.arrayToUsers.push(objectUser);
        });
        this.arrayCcUsers = this.arrayToUsers;
      }
    }
  }

  dateFromChanged (event: MatDatepickerInputEvent<Date>): void {
    this.minDateTo = moment(event.value).add(1, 'd');
  }

  dateToChanged (event: MatDatepickerInputEvent<Date>): void {
    this.maxDateFrom = moment(event.value).subtract(1, 'd');
  }

  dateFromChangedDate (event: MatDatepickerInputEvent<Date>): void {
    this.minDateDateInput = moment(event.value);
  }

  async getContractsByBusinessPartner () {
    const queryParams = new HttpParams()
    .set('businessPartnerCode', `${this.formGroup.get('selectedBusinessPartner').value}`);
    let a: any = await this.notificationListService.searchContractListContracts(queryParams).then(x => {
      return x;
    });
    this.arrayLinkedContractInformation = a;
  }

  saveNotification (): void {
    if (this.validate()) {
      let objectType = this.arrayNotificationType.find((item) => {
        return item.code === this.formGroup.get('selectedType').value;
      });
      let objectBusinessPartner = this.arrayBusinessPartners.find((item) => {
        return item.code === this.formGroup.get('selectedBusinessPartner').value;
      });

      let objectContract = this.arrayLinkedContractInformation.find((item) => {
        return item._id === this.formGroup.get('selectedLinkedContractInformation').value;
      });

      let objectLinkedContract = {
        contract_id: objectContract._id,
        title: objectContract.contract_title,
        owner: objectContract.person,
        category: objectContract.category,
        end_date: objectContract.end_date,
        notice_period: this.formGroup.get('noticePeriod').value,
        notice_period_type: this.formGroup.get('noticePeriodType').value
      };

      let objectCreatedByUser = {
        fullname: this.objectCurrentUser.firstName + ' ' + this.objectCurrentUser.lastName,
        email: this.objectCurrentUser.userEmail,
        phone: this.objectCurrentUser.phone,
        function: this.objectCurrentUser.function
      };

      let objectData = {
        data: {
          title: this.formGroup.get('inputTitle').value,
          date: this.formGroup.get('selectedNotificationDate').value,
          type: objectType,
          linked_contract: objectLinkedContract,
          business_partner: objectBusinessPartner,
          description: this.formGroup.get('description').value,
          created_by_user: objectCreatedByUser,
          send_notification: this.formGroup.get('radioReminder').value,
          reminder_setted: this.formGroup.get('radioReminder').value
        }
      };

      let objectReminder = {};
      // if (this.formGroup.get('radioReminder').value === 'true') {
      let arrayObjectToUsers = [];
      let arrayObjectCcUsers = [];
      let arraySelectedToUsers = this.arrayForEmailsToOnly.map(x => { return x.email; });
        // let arraySelectedCcUsers = this.formGroup.get('selectedCcUsers').value;
      for (let i = 0; i < arraySelectedToUsers.length; i++) {
        let objectUser = this.arrayToUsers.find((item) => {
          return item.email === arraySelectedToUsers[i];
        });
        let objectToUser = {
          fullname: objectUser.fullname,
          email: objectUser.email,
          phone: objectUser.phone,
          function: objectUser.function
        };
        arrayObjectToUsers.push(objectToUser);
      }

        // for (let i = 0; i < arraySelectedCcUsers.length; i++) {
        //   let objectUser = this.arrayToUsers.find((item) => {
        //     return item.email = arraySelectedCcUsers[i];
        //   });
        //   let objectCcUser = {
        //     fullname: objectUser.name,
        //     email: objectUser.email,
        //     phone: objectUser.phone,
        //     function: objectUser.function
        //   };
        //   arrayObjectCcUsers.push(objectCcUser);
        // }

      objectReminder = {
        start_date: this.formGroup.get('selectedReminderStartDate').value,
        end_date: this.formGroup.get('selectedReminderEndDate').value,
        to_users: arrayObjectToUsers.length > 0 ? arrayObjectToUsers : undefined,
        cc_users: this.formGroup.get('selectedCcUsers').value,
        frequency_type: this.formGroup.get('selectedReminderType').value,
        reminder_status: this.formGroup.get('radioBellGroup').value,
        add_email_address: this.formGroup.get('inputAddEmailAddress').value
      };

      objectData.data['reminder'] = objectReminder;
      // }

      if (typeof this.notificationid !== 'undefined'
        && this.notificationid !== null
        && this.notificationid !== '0') {
        let urlParams = {
          notificationid: `${this.notificationid}`
        };
        this.notificationListService.updateNotification(objectData, urlParams).subscribe((response: any) => {
          if (response.msg != null && response.msg === 'Failed') {
            this.toastr.error('Error', 'Something went wrong');
          } else {
            this.toastr.success('Operation Complete', 'Notification successfully updated');
            let base = SessionService.get('base-role');
            this.router.navigate([base + '/notification/notification-list']).then(nav => {
              console.log(nav);
            }, err => {
              console.log(err);
            });
          }
        });
      } else {
        this.notificationListService.createNotification(objectData).subscribe((response: any) => {
          if (response.msg != null && response.msg === 'Failed') {
            this.toastr.error('Error', 'Something went wrong');
          } else {
            this.notificationid = response.notification._id;
            this.toastr.success('Operation Complete', 'Notification successfully added');
            let base = SessionService.get('base-role');
            this.router.navigate([base + '/notification/notification-list']).then(nav => {
              console.log(nav);
            }, err => {
              console.log(err);
            });
          }
        });
      }
    }
  }

  cancel (): void {
    console.log(this.formGroup);
    let base = SessionService.get('base-role');
    this.router.navigate([base + '/notification/notification-list']).then(nav => {
      console.log(nav);
    }, err => {
      console.log(err);
    });
  }

  validate (): boolean {
    let validate = true;
    // Object.keys(this.formGroup.controls).forEach(key => {
    //   this.formGroup.get(key).markAsTouched();
    //   if (this.formGroup.get(key).invalid) {
    //     console.log(this.formGroup.get(key));
    //     validate = false;
    //   }
    // });

    return validate;
  }

  getErrorMessage (field: FormControl, customMsg ?: JSON): string {
    if (field.touched) {
      return getErrorMessage(field, customMsg);
    }
  }

  sendNotificationReminder ($event: MatRadioChange) {
    if ($event.value === 'true') {
      this.formGroup.controls['selectedReminderStartDate'].setValidators([Validators.required]);
      this.formGroup.controls['selectedReminderStartDate'].updateValueAndValidity();
      this.formGroup.controls['selectedToUsers'].setValidators([Validators.required]);
      this.formGroup.controls['selectedToUsers'].updateValueAndValidity();
    } else {
      this.formGroup.controls['selectedReminderStartDate'].setValidators();
      this.formGroup.controls['selectedReminderStartDate'].updateValueAndValidity();
      this.formGroup.controls['selectedToUsers'].setValidators();
      this.formGroup.controls['selectedToUsers'].updateValueAndValidity();
    }
  }

  compareCategoryObjects (object1: any, object2: any) {
    return object1 && object2 && object1.email === object2.email;
  }

}
