import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { dateValidator, getErrorMessage } from 'src/app/modules/utilsValidation';
import { ContractService } from '../../contracts.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material';

const OPEN_ENDED_CONTRACTS: string = 'OPEN_ENDED_CONTRACTS';

@Component({
  selector: 'cm-open-ended-contracts',
  templateUrl: './open-ended-contracts.component.html',
  styleUrls: ['./open-ended-contracts.component.scss']
})
export class OpenEndedContractsComponent implements OnInit {
  formGroup: FormGroup;

  @Input() arrayTimePeriods: any[];
  @Input() minStartDate;
  @Input() maxStartDate;

  @Output() isDirty: EventEmitter<boolean> = new EventEmitter();

  maxSignedDate;

  constructor (
    private route: ActivatedRoute,
    public contractService: ContractService
  ) {
    this.initializeForm();
  }

  ngOnInit () {
    if (this.contractService.contractData && this.contractService.contractData.term !== undefined &&
      this.contractService.contractData.term.type_of_contract_term === OPEN_ENDED_CONTRACTS) {

      this.formGroup.get('startDate').setValue(this.contractService.contractData.term.start_date);
      this.formGroup.get('signedDate').setValue(this.contractService.contractData.term.signed_date);
      this.formGroup.get('gracePeriodDescription').setValue(this.contractService.contractData.term.grace_period_description);
      this.maxSignedDate = moment(this.contractService.contractData.term.start_date);
    }
    this.onChanges();
  }

  initializeForm () {
    if (this.formGroup) {
      this.formGroup.reset();
    }

    this.formGroup = new FormGroup({
      startDate: new FormControl('', [ dateValidator]),
      signedDate: new FormControl('', [ dateValidator]),
      gracePeriodDescription: new FormControl('')
    });
  }

  onChanges () {
    this.formGroup.valueChanges.subscribe(val => {
      this.isDirty.emit(true);
    });
  }

  startDateChanged (event: MatDatepickerInputEvent<Date>): void {
    this.maxSignedDate = moment(event.value).subtract(1, 'd');
  }

  getErrorMessage (field: FormControl, customMsg?: JSON): string {
    if (field.touched) {
      return getErrorMessage(field, customMsg);
    }
  }
}
