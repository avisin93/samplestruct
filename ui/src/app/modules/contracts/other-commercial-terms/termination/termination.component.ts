import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators, FormGroup, AbstractControl, FormBuilder } from '@angular/forms';
import { ContractService } from '../../contracts.service';
import { ToastrService } from 'ngx-toastr';
import { dateValidator, endDateValidator, getErrorMessage, digitWithSpacesValidator, numberValidator } from 'src/app/modules/utilsValidation';
import { MatDatepickerInputEvent } from '@angular/material';
import * as moment from 'moment';
import { OtherCommercialTermsService } from '../other-commercial-terms.service';
import { NotificationListService } from 'src/app/modules/notification/notification-list.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'cm-termination',
  templateUrl: './termination.component.html',
  styleUrls: ['./termination.component.scss']
})
export class TerminationComponent implements OnInit {

  @Input() arrayTimePeriods: any[];
  @Input() arrayTerminationTerms: any[];
  @Input() arrayTerminationStatus: any[];
  @Input() arrayCurrencies: any[];
  @Input() matgroupCommercials;
  @ViewChild('currencyDropDown') currencyDropDown: ElementRef;
  @Output() isDirty: EventEmitter<boolean> = new EventEmitter();
  minDateTo;
  maxDateFrom;

  contractId: string;
  formGroup: FormGroup;

  notificationId: string;

  constructor (private fb: FormBuilder,
               private contractService: ContractService,
               private toastr: ToastrService,
               private otherCommercialTermsService: OtherCommercialTermsService,
               private notificationListService: NotificationListService) { }

  ngOnInit () {
    const { contractData } = this.contractService;
    this.initalizeForm();
    if (contractData.termination) this.patchValueInForm(contractData.termination);
    this.infoCurrencyType.setValue(this.contractService.genInfoCurrency ? this.contractService.genInfoCurrency.code : '');

    if (!contractData || !contractData.termination) {
      this.contractService.getGenInfoCurrencySubject().subscribe(value => {
        this.formGroup.get('currencyType').setValue(value ? value['code'] : '');
        this.selectedCurrency();
      });
    }

    if (contractData && contractData.termination) {
      this.contractId = contractData._id;
      if (contractData.penalty_details && contractData.penalty_details.date_to) {
        this.maxDateFrom = moment(contractData.penalty_details.date_to).subtract(1, 'd');
      }
      this.formGroup.get('inputDateTo').setValue(contractData.termination.date_to);
      if (contractData.penalty_details && contractData.penalty_details.date_from) {
        this.minDateTo = moment(contractData.penalty_details.date_from).add(1, 'd');
      }
      this.formGroup.get('inputValue').setValue(contractData.termination.value);
      if (contractData.termination.currency) {
        this.formGroup.get('currencyType').setValue(contractData.termination.currency.code);
        this.selectedCurrency();
      }
      let queryParams = new HttpParams();
      queryParams = queryParams.set('contractId', this.contractService.contractId);
      queryParams = queryParams.set('typeCode', 'TERMINATIONTYPE');

      this.notificationListService.searchNotifications(queryParams).then((res: any) => {
        if (res.docs[0]) {
          this.notificationId = res.docs[0]._id;
        }
      },() => {
        this.toastr.error('Cannot catch list of time frequencies');
      });
    }
    this.onChanges();
  }

  initalizeForm (): void {
    this.formGroup = this.fb.group({
      inputClause: [''],
      inputType: [''],
      inputNoticePeriod: ['', digitWithSpacesValidator],
      selectedTerm: [''],
      selectedTimePeriod: [''],
      selectedStatus: [''],
      inputReferenceNo: [''],
      inputDateFrom: [''],
      inputDateTo: [''],
      inputValue: ['', numberValidator],
      currencyType: [''],
      alertContractOwner: ['']
    });
  }

  patchValueInForm (termination): void {
    this.formGroup.patchValue({
      inputType: termination.type,
      inputClause: termination.clause,
      inputNoticePeriod: termination.notice_period,
      selectedTimePeriod: termination.time_period ? termination.time_period.code : '',
      selectedTerm: termination.term ? termination.term.code : '',
      selectedStatus: termination.status ? termination.status.code : '',
      inputReferenceNo: termination.reference_no,
      inputDateFrom: termination.date_from,
      alertContractOwner: termination.alert_contract_owner
    });
  }

  onChanges () {
    this.formGroup.valueChanges.subscribe(val => {
      this.isDirty.emit(true);
    });
  }

  dateFromChanged (event: MatDatepickerInputEvent<Date>): void {
    this.minDateTo = moment(event.value).add(1, 'd');
  }

  dateToChanged (event: MatDatepickerInputEvent<Date>): void {
    this.maxDateFrom = moment(event.value).subtract(1, 'd');
  }

  validate (): boolean {
    let validate = true;
    Object.keys(this.formGroup.controls).forEach(key => {
      this.formGroup.get(key).markAsTouched();
      if (this.formGroup.get(key).invalid) {
        validate = false;
      }
    });

    return validate;
  }

  getErrorMessage (field: FormControl, customMsg?: JSON): string {
    if (field.touched) {
      return getErrorMessage(field, customMsg);
    }
  }

  saveTermination () {

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
      termination : {
        clause: this.formGroup.get('inputClause').value,
        type: this.formGroup.get('inputType').value,
        notice_period: this.formGroup.get('inputNoticePeriod').value,
        time_period_code: this.formGroup.get('selectedTimePeriod').value,
        term_code: this.formGroup.get('selectedTerm').value,
        status_code: this.formGroup.get('selectedStatus').value,
        reference_no: this.formGroup.get('inputReferenceNo').value,
        date_from: this.formGroup.get('inputDateFrom').value,
        date_to: this.formGroup.get('inputDateTo').value,
        value: this.formGroup.get('inputValue').value,
        currency_code: this.formGroup.get('currencyType').value,
        alert_contract_owner: this.formGroup.get('alertContractOwner').value !== '' ? this.formGroup.get('alertContractOwner').value : false
      }
    };

    if (this.formGroup.get('alertContractOwner').value) {
      let notificationObject: any = {
        data: {
          title: 'Termination Terms',
          description: this.formGroup.get('inputClause').value,
          date: this.formGroup.get('inputDateTo').value,
          type: { // MOCKED
            name : 'Termination Type',
            valid_from : null,
            valid_to : null,
            code : 'TERMINATIONTYPE'
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
        this.otherCommercialTermsService.updateNotification(notificationObject,this.notificationId).subscribe((response: any) => {
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
      this.otherCommercialTermsService.deleteNotificationByType(this.contractId,'TERMINATIONTYPE').subscribe((response: any) => {
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
          'Termination successfully updated'
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

  cancel () {
    this.formGroup.reset();
    this.ngOnInit();
  }

  selectedCurrency () {
    if (this.formGroup.get('currencyType').value &&
        this.formGroup.get('currencyType').value !== '') {
      this.formGroup.get('inputValue').enable();
    }
  }

  focusSelect () {
    if (!(this.formGroup.get('currencyType').value &&
      this.formGroup.get('currencyType').value !== '')) {
      // @ts-ignore
      this.currencyDropDown.trigger.nativeElement.click(); // TODO
    }
  }

  // GETTER
  get infoCurrencyType () {
    return this.formGroup.get('currencyType');
  }
}
