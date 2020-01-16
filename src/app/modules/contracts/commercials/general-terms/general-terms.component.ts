import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import { ContractService } from '../../contracts.service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { dateValidator, endDateValidator, getErrorMessage, digitWithSpacesValidator } from 'src/app/modules/utilsValidation';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cm-general-terms',
  templateUrl: './general-terms.component.html',
  styleUrls: ['./general-terms.component.scss']
})
export class GeneralTermsComponent implements OnInit {

  arrayTimeFrequencies = [];
  arrayTimePeriod = [];
  arrayCurrencies = [];
  billingMinEndDate;

  @Output() isDirty: EventEmitter<boolean> = new EventEmitter();

  formGroup: FormGroup;

  constructor (
    private route: ActivatedRoute,
    private contractService: ContractService,
    private formBuilder: FormBuilder
  ) {
    this.initializeForm();
  }

  saveBillingCurrency (value) {
    this.contractService.billingCurrency = this.arrayCurrencies.find(item => item.code === value);
  }

  ngOnInit () {

    this.formGroup.get('billingEndDate').setValidators([ dateValidator,
      endDateValidator(this.formGroup.get('billingStartDate'))]);

    this.contractService.getAllTimeFrequencies().subscribe((res: any) => {
      this.arrayTimeFrequencies = res;
    });

    this.contractService.getTimePeriods().subscribe((res: any) => {
      this.arrayTimePeriod = res;
    });

    this.contractService.getAllCurrencies().subscribe((res: any) => {
      this.arrayCurrencies = res;
    });

    if (typeof this.contractService.contractData !== 'undefined' && this.contractService.contractData !== null) {
      this.formGroup.get('billingFrequencyType').setValue(this.contractService.contractData.billing_frequency_type ? this.contractService.contractData.billing_frequency_type.code : '');
      this.formGroup.get('creditPeriodType').setValue(this.contractService.contractData.credit_period_type ? this.contractService.contractData.credit_period_type.code : '');
      this.formGroup.get('creditPeriod').setValue(this.contractService.contractData.credit_period);
      this.formGroup.get('billingStartDate').setValue(this.contractService.contractData.billing_start_date);
      this.formGroup.get('billingEndDate').setValue(this.contractService.contractData.billing_end_date);
      this.formGroup.get('billingCurrency').setValue(this.contractService.contractData.billing_currency_type ? this.contractService.contractData.billing_currency_type.code : '');
      this.formGroup.get('clause').setValue(this.contractService.contractData.clause);
      this.billingMinEndDate = moment(this.contractService.contractData.billing_start_date).add(1, 'd');
    } else {
      this.initializeForm();
    }
    this.onChanges();

  }

  initializeForm () {
    if (this.formGroup) {
      this.formGroup.reset();
    }

    this.formGroup = this.formBuilder.group({
      billingFrequencyType: new FormControl(''),
      creditPeriod: new FormControl('', [ digitWithSpacesValidator ]),
      creditPeriodType: new FormControl(''),
      billingStartDate: new FormControl('', [ dateValidator]),
      billingEndDate: new FormControl(''),
      billingCurrency: new FormControl(''),
      clause: new FormControl('')
    });

  }

  onChanges () {
    this.formGroup.valueChanges.subscribe(val => {
      this.isDirty.emit(true);
    });
  }

  bilingStartDateChanged (event: MatDatepickerInputEvent<Date>): void {
    this.billingMinEndDate = moment(event.value).add(1, 'd');
  }

  getErrorMessage (field: FormControl, customMsg?: JSON): string {
    if (field.touched) {
      return getErrorMessage(field, customMsg);
    }
  }

}
