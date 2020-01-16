import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FormGroup, ControlContainer, FormControl } from '@angular/forms';
import { getErrorMessage } from 'src/app/modules/utilsValidation';

@Component({
  selector: 'cm-contracts-meta-tab-subtab-form-numeric-field',
  templateUrl: './numeric-field.component.html',
  styleUrls: ['./numeric-field.component.scss']
})
export class NumericFieldComponent implements OnInit {
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

  @HostListener('keypress',['$event']) onKeyPress (e) {
    let char = e.key;
    let regExp = new RegExp(/[0-9.]/);
    if (regExp.test(char)) {
      return true;
    } else {
      return false;
    }
  }

  @HostListener('paste', ['$event']) blockPaste (e: ClipboardEvent) {
    let clipboardData = e.clipboardData;
    let pastedText = clipboardData.getData('text');
    let regExp = new RegExp(/^[0-9.]*$/);
    if (regExp.test(pastedText)) {
      return true;
    } else {
      return false;
    }
  }

}
