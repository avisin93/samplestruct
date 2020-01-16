import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, ControlContainer, FormArray, FormControl } from '@angular/forms';
import { getErrorMessage } from 'src/app/modules/utilsValidation';
import { DashboardConfigurationService } from '../../dashboard-configuration.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'cm-dashboard-configuration-tab-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.scss']
})
export class DashboardConfigurationTabFieldsComponent implements OnInit {

  @Output() removeFieldId = new EventEmitter();

  @Input() attributeIndex;
  @Input() arrayContractStatuses: [];
  formGroup: FormGroup;
  chipValueColor: string;
  defaultField: boolean = false;

  constructor (
    private controlContainer: ControlContainer,
    private dashboardConfigurationService: DashboardConfigurationService,
    private toastr: ToastrService
  ) {}

  ngOnInit () {
    if (this.formGroup) {
      this.formGroup.reset();
    }
    this.formGroup = this.controlContainer.control as FormGroup;
    this.chipValueColor = this.formGroup ? this.formGroup.get('color').value : '#000000';
    this.defaultField = this.formGroup ? this.formGroup.get('default_field').value : false;
  }

  getErrorMessage (field: FormControl, customMsg?: JSON) {
    if (field.touched) {
      return getErrorMessage(field, customMsg);
    }
  }

  addColor (value) {
    if (!this.defaultField) {
      this.chipValueColor = value;
      this.formGroup.get('color').setValue(value);
    } else {
      this.toastr.error(
        'Error',
        'You can\'t change color of default field'
      );
    }
  }

  removeColor () {
    if (!this.defaultField) {
      this.chipValueColor = '#000000';
      this.formGroup.get('color').setValue('#000000');
    }
  }

  removeField () {
    this.removeFieldId.emit(this.attributeIndex);
  }
}
