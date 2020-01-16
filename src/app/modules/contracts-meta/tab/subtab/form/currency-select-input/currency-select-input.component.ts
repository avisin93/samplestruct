import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ControlContainer } from '@angular/forms';
import { getErrorMessage } from '../../../../../utilsValidation';
import { ContractsMetaService } from '../../../../contracts-meta.service';
import { MatSelect } from '@angular/material';

@Component({
  selector: 'cm-contracts-meta-tab-subtab-form-currency-select-input',
  templateUrl: './currency-select-input.component.html',
  styleUrls: ['./currency-select-input.component.scss']
})
export class ContractsMetaTabSubtabFormCurrencySelectInputComponent implements OnInit {
  formGroup: FormGroup;
  @Input() addContractMetaModelId: String;
  @Input() field: any;
  @Input() oneSubtab: Boolean;

  arrayCurrencies: [];

  @ViewChild('currencyDropDown') currencyDropDown: MatSelect;

  constructor (
    private controlContainer: ControlContainer,
    private contractMetaService: ContractsMetaService
    ) {
  }

  ngOnInit () {
    this.formGroup = this.controlContainer.control as FormGroup;
    this.contractMetaService.getAllCurrencies().subscribe((res: any) => {
      this.arrayCurrencies = res;
    });
    if ((this.formGroup.controls[this.field.database_column_select_name] && this.formGroup.controls[this.field.database_column_name]) &&
        (this.formGroup.controls[this.field.database_column_select_name].value !== '' &&
        this.formGroup.controls[this.field.database_column_name].value !== '')) {
      this.selectedCurrency();
    } else {
      this.formGroup.controls[this.field.database_column_name].disable();
    }
  }

  selectedCurrency () {
    if (this.formGroup.controls[this.field.database_column_select_name].value &&
      this.formGroup.controls[this.field.database_column_select_name].value !== '') {
      this.formGroup.controls[this.field.database_column_name].enable();
    }
  }

  focusSelect () {
    if (!(this.formGroup.controls[this.field.database_column_select_name].value &&
      this.formGroup.controls[this.field.database_column_select_name].value !== '')) {
      this.currencyDropDown.toggle();
    }
  }

  getErrorMessage (field: FormControl, customMsg?: JSON): string {
    if (field.touched) {
      return getErrorMessage(field, customMsg);
    }
  }
}
