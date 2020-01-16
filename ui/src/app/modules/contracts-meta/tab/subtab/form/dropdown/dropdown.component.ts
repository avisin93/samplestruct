import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, ControlContainer, FormControl } from '@angular/forms';
import { getErrorMessage } from 'src/app/modules/utilsValidation';

@Component({
  selector: 'cm-contracts-meta-tab-subtab-form-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class ContractsMetaTabSubtabFormDropdownComponent implements OnInit {
  formGroup: FormGroup;
  @Input() addContractMetaModelId: String;
  @Input() field: any;
  @Input() oneSubtab: Boolean;
  @Input() clientConfigurations: any[];
  columnObjectName: string;
  arrayData: any[];

  constructor (
    private controlContainer: ControlContainer
    ) {
  }

  ngOnInit () {
    this.columnObjectName = this.field.database_column_name.replace('_code', '');
    this.arrayData = this.field && !this.field.default_field ? this.field.options : this.clientConfigurations[this.columnObjectName];
    this.formGroup = this.controlContainer.control as FormGroup;
  }

  getErrorMessage (field: FormControl, customMsg?: JSON): string {
    if (field.touched) {
      return getErrorMessage(field, customMsg);
    }
  }
}
