import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {
  dateValidator,
  getErrorMessage,
  digitWithSpacesValidator
} from 'src/app/modules/utilsValidation';
import { ContractService } from '../../contracts.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';

const FIXED_PERIOD_WITHOUT_RENEWAL: string = 'FIXED_PERIOD_WITHOUT_RENEWAL';

@Component({
  selector: 'cm-fixed-period-without-renewal',
  templateUrl: './fixed-period-without-renewal.component.html',
  styleUrls: ['./fixed-period-without-renewal.component.scss']
})
export class FixedPeriodWithoutRenewalComponent implements OnInit {
  formGroup: FormGroup;
  @Input() arrayTimePeriods: any[];
  @Input() minStartDate;
  @Input() maxStartDate;

  @Output() isDirty: EventEmitter<boolean> = new EventEmitter();

  minEndDate;
  maxSignedDate;

  constructor (private route: ActivatedRoute,
    public contractService: ContractService) {
    this.initializeForm();
  }

  ngOnInit () {
    if (this.contractService.contractData &&
      this.contractService.contractData.term !== undefined &&
      this.contractService.contractData.term.type_of_contract_term === FIXED_PERIOD_WITHOUT_RENEWAL) {

      this.formGroup.get('startDate').setValue(this.contractService.contractData.term.start_date);
      this.formGroup.get('endDate').setValue(this.contractService.contractData.term.end_date);
      this.formGroup.get('signedDate').setValue(this.contractService.contractData.term.signed_date);
      this.formGroup.get('gracePeriod').setValue(this.contractService.contractData.term.grace_period);
      this.formGroup.get('gracePeriodType').setValue(this.contractService.contractData.term.grace_period_type
            ? this.contractService.contractData.term.grace_period_type.code : 'YEARS');
      this.formGroup.get('gracePeriodDescription').setValue(this.contractService.contractData.term.grace_period_description);
      this.minEndDate = moment(this.contractService.contractData.term.start_date).add(1, 'd');
      this.maxSignedDate = moment(this.contractService.contractData.term.start_date);
      this.calculateContractTerm(this.startDate, this.endDate);
    } else {
      this.initializeForm();
      this.formGroup.get('gracePeriodType').setValue('YEARS');
    }
    this.onChanges();
  }

  initializeForm () {
    if (this.formGroup) {
      this.formGroup.reset();
    }

    this.formGroup = new FormGroup({
      startDate: new FormControl('', [ dateValidator]),
      endDate: new FormControl('', [dateValidator]),
      contractTermYears: new FormControl({ value: '', disabled: true }),
      contractTermMonths: new FormControl({ value: '', disabled: true }),
      contractTermDays: new FormControl({ value: '', disabled: true }),
      signedDate: new FormControl('', [ dateValidator]),
      gracePeriod: new FormControl('', [ digitWithSpacesValidator ]),
      gracePeriodType: new FormControl(''),
      gracePeriodDescription: new FormControl('')
    });
  }

  calculateContractTerm (startDate, endDate) {
    if (startDate && endDate) {
      const duration = moment.duration(moment(endDate).diff(moment(startDate)));
      this.formGroup.get('contractTermDays').setValue(duration.days());
      this.formGroup.get('contractTermMonths').setValue(duration.months());
      this.formGroup.get('contractTermYears').setValue(duration.years());
    }
  }

  onChanges () {
    this.formGroup.valueChanges.subscribe(val => {
      this.isDirty.emit(true);
    });
  }

  startDateChanged (event: MatDatepickerInputEvent<Date>): void {
    this.minEndDate = moment(event.value).add(1, 'd');
    this.maxSignedDate = moment(event.value).subtract(1, 'd');
    this.calculateContractTerm(event.value, this.endDate);
  }

  endDateChanged (event: MatDatepickerInputEvent<Date>): void {
    this.calculateContractTerm(this.startDate, event.value);
  }

  getErrorMessage (field: FormControl, customMsg?: JSON): string {
    if (field.touched) {
      return getErrorMessage(field, customMsg);
    }
  }

  get endDate () {
    return this.formGroup.get('endDate').value;
  }

  get startDate () {
    return this.formGroup.get('startDate').value;
  }
}
