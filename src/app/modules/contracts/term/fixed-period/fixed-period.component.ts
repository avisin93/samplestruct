import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { dateValidator, getErrorMessage, digitWithSpacesValidator } from 'src/app/modules/utilsValidation';
import { ContractService } from '../../contracts.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material';
import { customTooltipDefaults } from 'src/app/models/constants';

const FIXED_PERIOD: string = 'FIXED_PERIOD';

@Component({
  selector: 'cm-fixed-period',
  templateUrl: './fixed-period.component.html',
  styleUrls: ['./fixed-period.component.scss'],
  providers: [
    FixedPeriodComponent,
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: customTooltipDefaults }
  ]
})
export class FixedPeriodComponent implements OnInit {
  formGroup: FormGroup;

  @Input() arrayTimePeriods: any[];
  @Input() arrayRenewalTypes: any[];
  @Input() minStartDate;
  @Input() maxStartDate;

  @Output() isDirty: EventEmitter<boolean> = new EventEmitter();

  minEndDate;
  maxSignedDate;

  constructor (public contractService: ContractService,
    private route: ActivatedRoute) {
    this.initializeForm();
  }

  ngOnInit () {
    if (this.contractService.contractData && this.contractService.contractData.term !== undefined &&
      this.contractService.contractData.term.type_of_contract_term === FIXED_PERIOD) {

      this.formGroup.get('startDate').setValue(this.contractService.contractData.term.start_date);
      this.formGroup.get('endDate').setValue(this.contractService.contractData.term.end_date);
      this.formGroup.get('signedDate').setValue(this.contractService.contractData.term.signed_date);
      this.formGroup.get('renewalType').setValue(
          this.contractService.contractData.term.renewal_type
            ? this.contractService.contractData.term.renewal_type.code
            : ''
        );
      this.formGroup.get('noticePeriod').setValue(this.contractService.contractData.term.notice_period);
      this.formGroup
        .get('noticePeriodType')
        .setValue(
          this.contractService.contractData.term.notice_period_type
            ? this.contractService.contractData.term.notice_period_type.code
            : 'YEARS'
        );
      this.formGroup.get('gracePeriod').setValue(this.contractService.contractData.term.grace_period);
      this.formGroup
        .get('gracePeriodType')
        .setValue(
          this.contractService.contractData.term.grace_period_type
            ? this.contractService.contractData.term.grace_period_type.code
            : 'YEARS'
        );
      this.formGroup.get('gracePeriodDescription').setValue(this.contractService.contractData.term.grace_period_description);
      this.minEndDate = moment(this.contractService.contractData.term.start_date).add(1, 'd');
      this.maxSignedDate = moment(this.contractService.contractData.term.start_date).subtract(1, 'd');
      this.calculateContractTerm(this.startDate, this.endDate);
    } else {
      this.initializeForm();

      this.formGroup.get('gracePeriodType').setValue('YEARS');
      this.formGroup.get('noticePeriodType').setValue('YEARS');
    }
    this.onChanges();
  }

  initializeForm () {
    if (this.formGroup) {
      this.formGroup.reset();
    }

    this.formGroup = new FormGroup({
      startDate: new FormControl('', [ dateValidator]),
      endDate: new FormControl('', [ dateValidator]),
      contractTermYears: new FormControl({ value: '', disabled: true }),
      contractTermMonths: new FormControl({ value: '', disabled: true }),
      contractTermDays: new FormControl({ value: '', disabled: true }),
      signedDate: new FormControl('', [ dateValidator]),
      renewalType: new FormControl(''),
      noticePeriod: new FormControl('', [ digitWithSpacesValidator ]),
      noticePeriodType: new FormControl(''),
      gracePeriod: new FormControl('', [ digitWithSpacesValidator ]),
      gracePeriodType: new FormControl(''),
      gracePeriodDescription: new FormControl('')
    });
  }

  onChanges () {
    this.formGroup.valueChanges.subscribe(val => {
      this.isDirty.emit(true);
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
