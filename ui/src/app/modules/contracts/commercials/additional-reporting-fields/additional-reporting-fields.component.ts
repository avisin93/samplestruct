import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormControl, ControlContainer } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { getErrorMessage, numberValidator } from 'src/app/modules/utilsValidation';

@Component({
  selector: 'cm-additional-reporting-fields',
  templateUrl: './additional-reporting-fields.component.html',
  styleUrls: ['./additional-reporting-fields.component.scss']
})
export class AdditionalReportingFieldsComponent implements OnInit {

  @Input() numOfFieldsInRow: number;
  @Input() additionalReportingFieldsArray: any[];
  @Output() additionalReportingFieldsArrayChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Input() cdr: ChangeDetectorRef;
  @Input() additionalReportingFields: boolean;
  @Output() additionalReportingFieldsChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  public additionalFormGroup: FormGroup;

  configurations = [
    {
      value: 'textbox',
      text: 'Text Box'
    },
    {
      value: 'datepicker',
      text: 'Date Picker'
    },
    {
      value: 'number',
      text: 'Number'
    }
  ];

  constructor (
    private toastr: ToastrService,
    private controlContainer: ControlContainer
  ) { }

  ngOnInit () {
    // @ts-ignore
    this.additionalFormGroup = this.controlContainer.control;
  }

  showAdditionalReportingFields () {
    this.additionalReportingFields = !this.additionalReportingFields;
    this.additionalReportingFieldsChange.emit(this.additionalReportingFields);

    if (this.additionalReportingFields) {
      this.additionalFormGroup.get('labelAdditionalReport').setValidators(Validators.required);
      this.additionalFormGroup.get('configurationAdditionalReport').setValidators(Validators.required);
    } else {
      this.additionalFormGroup.get('labelAdditionalReport').clearValidators();
      this.additionalFormGroup.get('configurationAdditionalReport').clearValidators();
    }

    this.cdr.detectChanges();
  }

  removeAdditionalReportingField (prop) {
    this.additionalReportingFieldsArray = this.additionalReportingFieldsArray.filter((obj) => {
      return obj.prop !== prop;
    });
    this.additionalReportingFieldsArrayChange.emit(this.additionalReportingFieldsArray);

    this.additionalFormGroup.removeControl('labelAdditionalReport_' + prop);
    this.additionalFormGroup.removeControl('configurationAdditionalReport_' + prop);
    this.additionalFormGroup.removeControl('valueAdditionalReport_' + prop);
  }

  updateAdditionalReportingField (prop) {
    this.additionalFormGroup.get('labelAdditionalReport_' + prop).markAsTouched();
    this.additionalFormGroup.get('configurationAdditionalReport_' + prop).markAsTouched();

    if (this.additionalFormGroup.get('labelAdditionalReport_' + prop).touched && this.additionalFormGroup.get('labelAdditionalReport_' + prop).errors
    || this.additionalFormGroup.get('configurationAdditionalReport_' + prop).touched && this.additionalFormGroup.get('configurationAdditionalReport_' + prop).errors) {
      return;
    }

    const objIndex = this.additionalReportingFieldsArray.findIndex((obj => obj.prop === prop));

    const newLabel = this.additionalFormGroup.get('labelAdditionalReport_' + prop).value.trim();
    const newConfig = this.additionalFormGroup.get('configurationAdditionalReport_' + prop).value;
    const newProp = newLabel.split(' ').join('_');

    const oldLabel = this.additionalReportingFieldsArray[objIndex].label;
    const oldConfig = this.additionalReportingFieldsArray[objIndex].config;

    if (this.additionalReportingFieldsArray.filter(obj => obj.label === newLabel).length > 0 && newLabel !== oldLabel) {
      this.toastr.error(
        'Error',
        'Field with given value already existis'
      );

      this.additionalFormGroup.get('labelAdditionalReport_' + prop).setValue(oldLabel);
      this.additionalFormGroup.get('configurationAdditionalReport_' + prop).setValue(oldConfig);

      return;
    }

    this.additionalReportingFieldsArray[objIndex].label = newLabel;
    this.additionalReportingFieldsArray[objIndex].config = newConfig;
    this.additionalReportingFieldsArray[objIndex].prop = newProp;

    if (newLabel !== oldLabel) {
      this.additionalFormGroup.removeControl('labelAdditionalReport_' + prop);
      this.additionalFormGroup.removeControl('configurationAdditionalReport_' + prop);
      this.additionalFormGroup.removeControl('valueAdditionalReport_' + prop);

      this.additionalFormGroup.addControl('labelAdditionalReport_' + newProp, new FormControl(newLabel, [Validators.required]));
      this.additionalFormGroup.addControl('configurationAdditionalReport_' + newProp, new FormControl(newConfig, [Validators.required]));
      this.additionalFormGroup.addControl('valueAdditionalReport_' + newProp, new FormControl(''));

      if (newConfig === 'number') {
        this.additionalFormGroup.get('valueAdditionalReport_' + newProp).setValidators(numberValidator);
      }
    } else {
      this.additionalFormGroup.get('valueAdditionalReport_' + prop).reset();

      this.additionalFormGroup.get('valueAdditionalReport_' + prop).clearValidators();
      if (newConfig === 'number') {
        this.additionalFormGroup.get('valueAdditionalReport_' + newProp).setValidators(numberValidator);
      }
    }
  }

  addAdditionalReportingField () {
    if (this.additionalFormGroup.get('labelAdditionalReport').value && this.additionalFormGroup.get('labelAdditionalReport').value !== '' &&
    this.additionalReportingFieldsArray.filter(obj => obj.label === this.additionalFormGroup.get('labelAdditionalReport').value.trim()).length > 0) {
      this.toastr.error(
        'Error',
        'Field with given label already existis'
      );

      return;
    }

    this.additionalFormGroup.get('labelAdditionalReport').markAsTouched();
    this.additionalFormGroup.get('configurationAdditionalReport').markAsTouched();

    if (!this.additionalFormGroup.get('labelAdditionalReport').value ||
    (this.additionalFormGroup.get('labelAdditionalReport').value && this.additionalFormGroup.get('labelAdditionalReport').value.trim() === '')) {
      this.additionalFormGroup.get('labelAdditionalReport').setErrors({ required: true });
    }

    if (!this.additionalFormGroup.get('configurationAdditionalReport').value ||
    (this.additionalFormGroup.get('configurationAdditionalReport').value && this.additionalFormGroup.get('configurationAdditionalReport').value.trim() === '')) {
      this.additionalFormGroup.get('configurationAdditionalReport').setErrors({ required: true });
    }

    if (this.additionalFormGroup.get('labelAdditionalReport').errors || this.additionalFormGroup.get('configurationAdditionalReport').errors) {
      return;
    }

    const field = {
      prop: this.additionalFormGroup.get('labelAdditionalReport').value.trim().split(' ').join('_'),
      label: this.additionalFormGroup.get('labelAdditionalReport').value.trim(),
      config: this.additionalFormGroup.get('configurationAdditionalReport').value,
      value: ''
    };

    this.additionalFormGroup.addControl('labelAdditionalReport_' + field.prop, new FormControl(field.label, [Validators.required]));
    this.additionalFormGroup.addControl('configurationAdditionalReport_' + field.prop, new FormControl(field.config, [Validators.required]));
    this.additionalFormGroup.addControl('valueAdditionalReport_' + field.prop, new FormControl(''));

    if (field.config === 'number') {
      this.additionalFormGroup.get('valueAdditionalReport_' + field.prop).setValidators(numberValidator);
    }

    this.additionalReportingFieldsArray.push(field);

    this.additionalFormGroup.get('labelAdditionalReport').reset();
    this.additionalFormGroup.get('configurationAdditionalReport').reset();
  }

  getNumberOfRows () {
    return Array.from(Array(Math.ceil(this.additionalReportingFieldsArray.length / this.numOfFieldsInRow)).keys());
  }

  getNumberOfFieldsInRow () {
    return Array.from(Array(Math.ceil(this.numOfFieldsInRow)).keys());
  }

  getErrorMessage (field: FormControl, customMsg?: JSON) {
    if (field.touched) {
      return getErrorMessage(field, customMsg);
    }
  }
}
