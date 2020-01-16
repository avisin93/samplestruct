import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, ControlContainer, FormControl } from '@angular/forms';
import { getErrorMessage } from 'src/app/modules/utilsValidation';

@Component({
  selector: 'cm-contracts-meta-tab-subtab-form-text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.scss']
})
export class ContractsMetaTabSubtabFormTextFieldComponent implements OnInit {
  formGroup: FormGroup;
  @Input() addContractMetaModelId: String;
  @Input() field: any;
  @Input() oneSubtab: Boolean;

  constructor (
    private controlContainer: ControlContainer
    ) {
  }

  ngOnInit () {
    this.formGroup = this.controlContainer.control as FormGroup;
  }

  getErrorMessage (field: FormControl, customMsg?: JSON): string {
    if (field.touched) {
      return getErrorMessage(field, customMsg);
    }
  }
}
