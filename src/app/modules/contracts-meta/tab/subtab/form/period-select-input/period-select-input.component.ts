import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, ControlContainer } from '@angular/forms';
import { ContractsMetaService } from '../../../../contracts-meta.service';
import { getErrorMessage } from 'src/app/modules/utilsValidation';

@Component({
  selector: 'cm-contracts-meta-tab-subtab-form-period-select-input',
  templateUrl: './period-select-input.component.html',
  styleUrls: ['./period-select-input.component.scss']
})
export class ContractsMetaTabSubtabFormPeriodSelectInputComponent implements OnInit {
  formGroup: FormGroup;
  @Input() addContractMetaModelId: String;
  @Input() field: any;
  @Input() oneSubtab: Boolean;
  @Input() clientConfigurations: any[];

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
