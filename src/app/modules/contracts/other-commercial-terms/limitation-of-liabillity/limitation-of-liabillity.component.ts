import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ContractService } from '../../contracts.service';
import { ToastrService } from 'ngx-toastr';
import { MatSelect, MatTabGroup } from '@angular/material';
import { getErrorMessage, numberValidator } from '../../../utilsValidation';

@Component({
  selector: 'cm-limitation-of-liabillity',
  templateUrl: './limitation-of-liabillity.component.html',
  styleUrls: ['./limitation-of-liabillity.component.scss']
})
export class LimitationOfLiabillityComponent implements OnInit {

  @Input() arrayCurrencies: any[];
  @Input() matgroup: MatTabGroup;
  @ViewChild('currencyDropDown') currencyDropDown: MatSelect;
  @Output() isDirty: EventEmitter<boolean> = new EventEmitter();

  contractId: Text;

  formGroup: FormGroup;
  constructor (private contractService: ContractService, private toastr: ToastrService) { }

  ngOnInit () {

    if (this.formGroup) {
      this.formGroup.reset();
    }

    this.formGroup = new FormGroup({
      inputClause: new FormControl(''),
      inputType: new FormControl(''),
      inputValue: new FormControl('',[numberValidator]),
      currencyType: new FormControl(''),
      inputReferenceNo: new FormControl('')
    });

    if (!this.contractService.contractData || !this.contractService.contractData.limitation_of_liabillity) {
      this.formGroup.get('currencyType').setValue(this.contractService.genInfoCurrency ? this.contractService.genInfoCurrency.code : '');
      this.selectedCurrency();

      this.contractService.getGenInfoCurrencySubject().subscribe(value => {
        this.formGroup.get('currencyType').setValue(value ? value['code'] : '');
        this.selectedCurrency();
      });
    }

    if (this.contractService.contractData && this.contractService.contractData.limitation_of_liabillity) {
      this.contractId = this.contractService.contractData._id;
      this.formGroup.get('inputClause').setValue(this.contractService.contractData.limitation_of_liabillity.clause);
      this.formGroup.get('inputType').setValue(this.contractService.contractData.limitation_of_liabillity.type);
      this.formGroup.get('inputReferenceNo').setValue(this.contractService.contractData.limitation_of_liabillity.reference_no);
      this.formGroup.get('inputValue').setValue(this.contractService.contractData.limitation_of_liabillity.value);
      if (this.contractService.contractData.limitation_of_liabillity.currency) {
        this.formGroup.get('currencyType').setValue(this.contractService.contractData.limitation_of_liabillity.currency.code);
        this.selectedCurrency();
      }
    }
    this.onChanges();
  }

  onChanges () {
    this.formGroup.valueChanges.subscribe(val => {
      this.isDirty.emit(true);
    });
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
      limitation_of_liabillity : {
        clause: this.formGroup.get('inputClause').value,
        type: this.formGroup.get('inputType').value,
        reference_no: this.formGroup.get('inputReferenceNo').value,
        value: this.formGroup.get('inputValue').value,
        currency_code: this.formGroup.get('currencyType').value
      }
    };
    this.contractService.updateContract(objectData, urlParams).subscribe(
      (response: any) => {
        this.contractService.contractId = response._id;
        this.contractService.contractData = response;
        this.toastr.success(
          'Operation Complete',
          'Limitation of Liability successfully updated'
        );
        this.matgroup.selectedIndex += 1;
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

}
