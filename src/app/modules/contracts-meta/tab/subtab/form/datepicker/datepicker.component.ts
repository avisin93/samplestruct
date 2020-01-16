import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, ControlContainer, FormControl } from '@angular/forms';
import { getErrorMessage } from 'src/app/modules/utilsValidation';

@Component({
  selector: 'cm-contracts-meta-tab-subtab-form-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})
export class ContractsMetaTabSubtabFormDatepickerComponent implements OnInit {
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
