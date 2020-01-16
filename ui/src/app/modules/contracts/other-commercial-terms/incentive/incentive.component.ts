import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ContractService } from '../../contracts.service';
import { ToastrService } from 'ngx-toastr';
import { dateValidator, endDateValidator, getErrorMessage, numberValidator, digitWithSpacesValidator } from 'src/app/modules/utilsValidation';
import * as moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material';
import { OtherCommercialTermsService } from '../other-commercial-terms.service';
import { HttpParams } from '@angular/common/http';
import { NotificationListService } from 'src/app/modules/notification/notification-list.service';
import { StorageService } from 'src/app/modules/shared/providers/storage.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'cm-incentive',
  templateUrl: './incentive.component.html',
  styleUrls: ['./incentive.component.scss']
})
export class IncentiveComponent implements OnInit {
  showButton: Boolean = false;
  @Input() arrayTimePeriods: any[];
  @Input() arrayIncentiveStatus: any[];
  @Input() matgroupCommercials;
  @Output() isDirty: EventEmitter<boolean> = new EventEmitter();
  minDateTo;
  maxDateFrom;

  contractId: string;
  formGroup: FormGroup;
  notificationId: string;
  constructor(private contractService: ContractService, private toastr: ToastrService,
    public breakpointObserver: BreakpointObserver,
    private otherCommercialTermsService: OtherCommercialTermsService, private notificationListService: NotificationListService
  ) { }

  ngOnInit() {
    this.breakpointObserver
      .observe(['(min-width: 1024px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.showButton = true;
        } else {
          this.showButton = false;
        }
      });

    if (this.formGroup) {
      this.formGroup.reset();
    }

    this.formGroup = new FormGroup({
      selectedStatus: new FormControl(''),
      selectedTimePeriod: new FormControl(''),
      inputClause: new FormControl(''),
      inputReferenceNo: new FormControl(''),
      inputPercentage: new FormControl('', [numberValidator]),
      inputType: new FormControl(''),
      inputDateFrom: new FormControl(''),
      inputDateTo: new FormControl(''),
      inputNoticePeriod: new FormControl('', [digitWithSpacesValidator]),
      alertContractOwner: new FormControl('')
    });
    this.formGroup.get('inputDateTo').setValidators([dateValidator,
      endDateValidator(this.formGroup.get('inputDateFrom'))]);

    if (typeof this.contractService.contractData !== 'undefined'
      && this.contractService.contractData !== null && this.contractService.contractData.incentive !== undefined) {
      this.contractId = this.contractService.contractData._id;
      this.formGroup.get('selectedStatus').setValue(this.contractService.contractData.incentive.status ? this.contractService.contractData.incentive.status.code : '');
      this.formGroup.get('selectedTimePeriod').setValue(this.contractService.contractData.incentive.time_period ? this.contractService.contractData.incentive.time_period.code : '');
      this.formGroup.get('inputClause').setValue(this.contractService.contractData.incentive.clause);
      this.formGroup.get('inputReferenceNo').setValue(this.contractService.contractData.incentive.reference_no);
      this.formGroup.get('inputPercentage').setValue(this.contractService.contractData.incentive.percentage);
      this.formGroup.get('inputType').setValue(this.contractService.contractData.incentive.type);
      this.formGroup.get('inputDateFrom').setValue(this.contractService.contractData.incentive.date_from);
      if (this.contractService.contractData.penalty_details && this.contractService.contractData.penalty_details.date_to) {
        this.maxDateFrom = moment(this.contractService.contractData.penalty_details.date_to).subtract(1, 'd');
      }
      this.formGroup.get('inputDateTo').setValue(this.contractService.contractData.incentive.date_to);
      if (this.contractService.contractData.penalty_details && this.contractService.contractData.penalty_details.date_from) {
        this.minDateTo = moment(this.contractService.contractData.penalty_details.date_from).add(1, 'd');
      }
      this.formGroup.get('inputNoticePeriod').setValue(this.contractService.contractData.incentive.notice_period);
      this.formGroup.get('alertContractOwner').setValue(this.contractService.contractData.incentive.alert_contract_owner);

      let queryParams = new HttpParams();
      queryParams = queryParams.set('contractId', this.contractService.contractId);
      queryParams = queryParams.set('typeCode', 'INCENTIVETYPE');

      this.notificationListService.searchNotifications(queryParams).then((res: any) => {
        if (res.docs[0]) {
          this.notificationId = res.docs[0]._id;
        }
      }, () => {
        this.toastr.error('Cannot catch list of time frequencies');
      });
    }
    this.onChanges();
  }

  onChanges() {
    this.formGroup.valueChanges.subscribe(val => {
      this.isDirty.emit(true);
    });
  }

  dateFromChanged(event: MatDatepickerInputEvent<Date>): void {
    this.minDateTo = moment(event.value).add(1, 'd');
  }

  dateToChanged(event: MatDatepickerInputEvent<Date>): void {
    this.maxDateFrom = moment(event.value).subtract(1, 'd');
  }

  validate(): boolean {
    let validate = true;
    Object.keys(this.formGroup.controls).forEach(key => {
      this.formGroup.get(key).markAsTouched();
      if (this.formGroup.get(key).invalid) {
        validate = false;
      }
    });

    return validate;
  }

  getErrorMessage(field: FormControl, customMsg?: JSON): string {
    if (field.touched) {
      return getErrorMessage(field, customMsg);
    }
  }

  saveIncentive() {

    if (!this.validate()) {
      return;
    }

    const urlParams = {
      contractId: `${this.contractService.contractId}`
    };

    const objectData = {
      'type': 'OTHER_COMMERCIALS_TERMS',
      'data': {}
    };

    objectData.data = {
      incentive: {
        clause: this.formGroup.get('inputClause').value,
        percentage: this.formGroup.get('inputPercentage').value,
        reference_no: this.formGroup.get('inputReferenceNo').value,
        type: this.formGroup.get('inputType').value,
        date_from: this.formGroup.get('inputDateFrom').value,
        date_to: this.formGroup.get('inputDateTo').value,
        status_code: this.formGroup.get('selectedStatus').value,
        notice_period: this.formGroup.get('inputNoticePeriod').value,
        time_period_code: this.formGroup.get('selectedTimePeriod').value,
        alert_contract_owner: this.formGroup.get('alertContractOwner').value !== '' ? this.formGroup.get('alertContractOwner').value : false
      }
    };

    if (this.formGroup.get('alertContractOwner').value) {
      let notificationObject: any = {
        data: {
          title: 'Incentive Terms',
          description: this.formGroup.get('inputClause').value,
          date: this.formGroup.get('inputDateTo').value,
          type: { // MOCKED
            name: 'Incentive Type',
            valid_from: null,
            valid_to: null,
            code: 'INCENTIVETYPE'
          },
          send_notification: true,
          business_partner: this.contractService.contractData.business_partner,
          linked_contract: {
            contract_id: this.contractService.contractId,
            title: this.contractService.contractData.contract_title,
            category: this.contractService.contractData.category,
            end_date: this.contractService.contractData.end_date,
            notice_period: this.formGroup.get('inputNoticePeriod').value,
            notice_period_type: this.formGroup.get('selectedTimePeriod').value
          },
          reminder: {
            reminder_status: 'ACTIVE',
            end_date: this.contractService.contractData.term.end_date,
            to_users: this.contractService.contractData.contact_persons
          }
        }
      };
      if (this.notificationId) {
        this.otherCommercialTermsService.updateNotification(notificationObject, this.notificationId).subscribe((response: any) => {
          console.info('Notification updated!');
        }, (error: any) => {
          console.log(error);
        });
      } else {
        this.otherCommercialTermsService.saveNotification(notificationObject).subscribe((response: any) => {
          console.info('Notification created!');
        }, (error: any) => {
          console.log(error);
        });
      }
    } else {
      this.otherCommercialTermsService.deleteNotificationByType(this.contractService.contractId, 'INCENTIVETYPE').subscribe((response: any) => {
        console.info('Notification deleted!');
      }, (error: any) => {
        console.log(error);
      });
    }

    this.contractService.updateContract(objectData, urlParams).subscribe(
      (response: any) => {
        this.contractService.contractId = response._id;
        this.contractService.contractData = response;
        this.toastr.success(
          'Operation Complete',
          'Incentive successfully updated'
        );
        this.matgroupCommercials.selectedIndex += 1;
      },
      () => {
        this.toastr.error(
          'Operation failed',
          'Something went wrong!'
        );
      }
    );
    this.isDirty.emit(false);
  }

  cancel() {
    this.formGroup.reset();
    this.ngOnInit();
  }

}
