import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, ControlContainer, FormArray, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { getErrorMessage } from 'src/app/modules/utilsValidation';
import { Pattern } from 'src/app/models/util/pattern.model';

@Component({
  selector: 'cm-add-contract-meta-model-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.scss']
})
export class AddContactMetaModelFieldsComponent implements OnInit {

  @Output() removeFieldId = new EventEmitter();
  @Output() parentVisibleId = new EventEmitter();
  @Output() parentInvisibleId = new EventEmitter();

  @Input() attributeIndex;
  @Input() isTableView;
  formGroup: FormGroup;
  defaultField: Boolean = false;
  childOfField: any[] = [];

  attributeTypes = [
    { name: 'TextFiled' },
    { name: 'NumericField' },
    { name: 'Dropdown' },
    { name: 'InputLocation' },
    { name: 'DropdownCreate' },
    { name: 'Datepicker' },
    { name: 'CurrencySelectInput' },
    { name: 'PeriodSelectInput' },
    { name: 'Textarea' },
    { name: 'Radio Group' }
  ];

  constructor (
    private controlContainer: ControlContainer
  ) {
  }

  ngOnInit () {
    if (this.formGroup) {
      this.formGroup.reset();
    }
    this.formGroup = this.controlContainer.control as FormGroup;
    this.defaultField = this.formGroup.get('default_field').value;
    if (this.defaultField) {
      this.disableOptions();
    }
    const arr = this.formGroup.get('options') as FormArray;
    arr.controls.forEach(control => {
      this.childOfField.push(control.value);
    });
  }

  disableOptions () {
    const arr = this.formGroup.get('options') as FormArray;
    arr.controls.forEach(control => {
      control.disable();
    });
  }

  addNewValue () {
    const arr = this.formGroup.get('options') as FormArray;
    const value = arr.value[0];
    const pattern = Pattern.ALPHA_WITH_SPACE;
    if (value !== '' && pattern.test(value)) {
      arr.push(new FormControl(arr.value[0], [Validators.required, Validators.pattern(Pattern.ALPHA_WITH_SPACE), Validators.maxLength(30)]));
      arr.at(0).patchValue('');
      arr.at(0).setValidators([Validators.pattern(Pattern.ALPHA_WITH_SPACE), this.validateMinLength()]);
      arr.at(0).updateValueAndValidity();
      arr.at(0).markAsTouched();
    }
  }

  deleteValue (value) {
    const arr = this.formGroup.get('options') as FormArray;
    arr.removeAt(value);
    arr.at(0).setValidators([Validators.pattern(Pattern.ALPHA_WITH_SPACE), this.validateMinLength(), Validators.maxLength(30)]);
    arr.at(0).updateValueAndValidity();
    arr.at(0).markAsTouched();
  }

  removeField () {
    this.removeFieldId.emit(this.attributeIndex);
  }

  getErrorMessage (field: FormControl, customMsg?: JSON) {
    if (field.touched) {
      return getErrorMessage(field, customMsg);
    }
  }

  selectedDropType (event): void {
    const arr = this.formGroup.get('options') as FormArray;
    if (event.value === 'Dropdown' || event.value === 'DropdownCreate' || event.value === 'Radio Group') {
      arr.at(0).setValidators([Validators.required, this.validateMinLength(), Validators.maxLength(30)]);
      arr.at(0).updateValueAndValidity();
      arr.at(0).markAsTouched();
      arr.at(0).markAsUntouched();
    } else {
      arr.at(0).setValidators([]);
      arr.at(0).updateValueAndValidity();
      arr.at(0).markAsTouched();
    }
  }

  validateMinLength (): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      if (control.parent && control.parent['length'] < 2) {
        return { 'minLength': { value: 2 } };
      }
      return null;
    };
  }

  onChangeVisibility (event): void {
    if (event.checked) {
      this.parentVisibleId.emit(this.attributeIndex);
    } else {
      this.parentInvisibleId.emit(this.attributeIndex);
    }
  }

}
