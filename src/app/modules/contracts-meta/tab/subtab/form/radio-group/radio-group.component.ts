import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, ControlContainer, FormControl } from '@angular/forms';
import { getErrorMessage } from 'src/app/modules/utilsValidation';

@Component({
  selector: 'cm-contracts-meta-tab-subtab-form-radio-group',
  templateUrl: './radio-group.component.html',
  styleUrls: ['./radio-group.component.scss']
})
export class ContractsMetaTabSubtabFormrRadioGroupComponent implements OnInit {
  formGroup: FormGroup;
  @Input() field: any;
  @Input() oneSubtab: Boolean;
  columnObjectName: string;
  arrayData: any[];

  constructor (
    private controlContainer: ControlContainer
    ) {
  }

  ngOnInit () {
    this.columnObjectName = this.field.database_column_name.replace('_code', '');
    this.arrayData = this.field.options;
    this.formGroup = this.controlContainer.control as FormGroup;
  }

  getErrorMessage (field: FormControl, customMsg?: JSON): string {
    if (field.touched) {
      return getErrorMessage(field, customMsg);
    }
  }
}
