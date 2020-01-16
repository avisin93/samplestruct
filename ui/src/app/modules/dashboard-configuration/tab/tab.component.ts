import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatTabGroup } from '@angular/material';
import { DashboardConfigurationService } from '../dashboard-configuration.service';
import { Pattern } from 'src/app/models/util/pattern.model';
import { StorageService } from '../../shared/providers/storage.service';

@Component({
  selector: 'cm-dashboard-configuration-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class DashboardConfigurationTabComponent implements OnInit {
  @Input() matGroupTab: MatTabGroup;
  @Input() tab: any;
  @Input() dashboardConfigurationId: String;
  @Output() isDirty: EventEmitter<boolean> = new EventEmitter();
  dashboardConfigurationTabId: String;
  arrayContractStatuses: [];
  formGroup: FormGroup;

  get formArrayData (): FormArray {
    return this.formGroup.get('additionalAttributesFormArray') as FormArray;
  }

  constructor (
    private dashboardConfigurationService: DashboardConfigurationService,
    private toastr: ToastrService
  ) {}

  ngOnInit (): void {
    this.initializeForm();
    this.initializeDataForm();
    this.onChanges();
    this.dashboardConfigurationService.getAllMetaStatus().subscribe((res: any) => {
      this.arrayContractStatuses = res;
    }, error => {
      console.log(error);
      this.toastr.error(
          'Error',
          'Something went wrong(Cannot fetch list of statuses)'
        );
    });
  }

  onChanges () {
    this.formGroup.valueChanges.subscribe(val => {
      if (this.formGroup.dirty) {
        this.isDirty.emit(true);
      }
    });
  }

  initializeForm (): void {
    this.formGroup = new FormGroup({
      additionalAttributesFormArray: new FormArray([])
    });
  }

  initializeDataForm (): void {
    this.dashboardConfigurationTabId = this.tab['_id'];
    const attributeComponentsArray = this.tab['components'];
    const additionalAttributesFormArray = this.formGroup.get('additionalAttributesFormArray') as FormArray;
    attributeComponentsArray.map(component => {
      const childFormGroup = new FormGroup({
        widget_name: new FormControl({ value: component.widget_name, disabled: component.default_field } , [Validators.required, Validators.pattern(Pattern.ALPHA_WITH_SPACE), Validators.maxLength(16)]),
        widget_status: new FormControl({ value: component.widget_status, disabled: component.default_field } , [Validators.required]),
        color: new FormControl({ value: component.color, disabled: component.default_field } , [Validators.required]),
        visibility: new FormControl(component.visibility),
        default_field: new FormControl(component.default_field)
      });
      additionalAttributesFormArray.push(childFormGroup);
    });
  }

  addNewAttribute (): void {
    const newAttributeFormGroup = new FormGroup({
      widget_name: new FormControl('', [Validators.required, Validators.pattern(Pattern.ALPHA_WITH_SPACE), Validators.maxLength(16)]),
      widget_status: new FormControl('', [Validators.required]),
      color: new FormControl('#000000', [Validators.required]),
      visibility: new FormControl(true),
      default_field: new FormControl(false)
    });
    (this.formGroup.get('additionalAttributesFormArray') as FormArray).push(newAttributeFormGroup);
  }

  resetAction (): void {
    let pomArray = this.formGroup.get('additionalAttributesFormArray') as FormArray;
    while (pomArray.length !== 0) {
      pomArray.removeAt(0);
    }
    this.initializeDataForm();
    this.isDirty.emit(false);
  }

  saveAction (): void {
    // if (!this.validate()) {
    //   this.markFormGroupTouched(this.formGroup);
    //   return;
    // } else {
    this.formGroup.markAsPristine();
    let { additionalAttributesFormArray } = this.formGroup.getRawValue();

    const urlParams = {
      dashboardConfigurationId: this.dashboardConfigurationId,
      dashboardConfigurationTabId: this.dashboardConfigurationTabId
    };

    const objectData = {
      tab: {
        components: JSON.parse(JSON.stringify(additionalAttributesFormArray))
      }
    };
    this.dashboardConfigurationService.updateDashboardConfigurationTab(urlParams, objectData).subscribe((response: any) => {
      if (response.status === '500') {
        this.toastr.error('Error', `Error while update contract meta model subtab`);
      } else {
        this.toastr.success('Success', `Contract meta model subtab updated`);
        this.dashboardConfigurationService.changedTabs(response);
      }
    }, error => {
      this.toastr.error('Error', `${error}`);
    });
    this.isDirty.emit(false);
    // }
  }

  validate (): boolean {
    let validate = true;
    Object.keys(this.formGroup.controls).forEach(key => {
      this.formGroup.get(key).markAsTouched();
      if (this.formGroup.get(key).invalid) {
        validate = false;
      }
    });
    return validate;
  }

  private markFormGroupTouched (formGroup: FormGroup) {
    (Object as any).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  checkUserIfClientEditor () {
    let role = StorageService.get(StorageService.userRole);
    if (role === 'Client Editor' || role === 'Editor') {
      return true;
    } else {
      return false;
    }
  }

  removeField (event): void {
    (this.formGroup.get('additionalAttributesFormArray') as FormArray).removeAt(event);
  }
}
