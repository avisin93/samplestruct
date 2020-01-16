import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { StorageService } from 'src/app/modules/shared/providers/storage.service';
import { ToastrService } from 'ngx-toastr';
import { ContractsMetaService } from '../../../contracts-meta.service';
import { Router } from '@angular/router';
import { MatTabGroup } from '@angular/material';
import { LoaderService } from 'src/app/modules/shared/components/loader/loader.service';

@Component({
  selector: 'cm-contracts-meta-tab-subtab-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class ContractsMetaMatSubtabFormComponent implements OnInit {
  formGroup: FormGroup;
  @Input() addContractMetaModelId: String;
  @Input() subtab: any;
  @Input() tab: any;
  @Input() oneSubtab: Boolean;
  @Input('matGroupTab') matGroupTab: MatTabGroup;
  @Input('matGroupSubTab') matGroupSubTab: MatTabGroup;

  arrayComponents: any[];
  clientConfigurations: any[];

  get formArrayData (): FormArray {
    return this.formGroup.get('arrayFieldsFormArray') as FormArray;
  }

  constructor (
    private contractsMetaService: ContractsMetaService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private router: Router
  ) {}

  ngOnInit () {
    this.loaderService.show();
    this.initializeForm();
    this.initializeDataForm();
  }

  initializeForm (): void {
    this.formGroup = new FormGroup({
      arrayFieldsFormArray: new FormArray([])
    });
  }

  initializeDataForm (): void {
    this.arrayComponents = this.subtab && this.subtab['components'] ? this.subtab['components'].filter(el => { return (el.hasOwnProperty('is_deleted') && !el.is_deleted) && el.is_visible_form; }) : [];
    const haveDropdownFields = this.arrayComponents.find(field => field.type === 'Dropdown' || field.type === 'DropdownCreate' || field.type === 'PeriodSelectInput');
    if (haveDropdownFields) {
      this.contractsMetaService.getClientConfigurations().subscribe((res: any) => {
        this.clientConfigurations = res;
        this.parseData();
        this.loaderService.hide();
      }, () => {
        this.toastr.error('Error', 'Something went wrong(Cannot fetch data)');
      });
    } else {
      this.parseData();
      this.loaderService.hide();
    }
  }

  parseData (): void {
    const arrayFormGroupFields = this.formGroup.get('arrayFieldsFormArray') as FormArray;
    this.arrayComponents.map(field => {
      const newFormControlObject = {} ;
      if (this.contractsMetaService.addMode) {
        // New contract
        if (field.type === 'Radio Group') {
          newFormControlObject[field.database_column_name] = new FormControl(field.options && field.options.length > 0 ? field.options[0].code : '');
        } else {
          newFormControlObject[field.database_column_name] = new FormControl('');
        }
        // TODO: Sasa Specific fields check
        if (field.type === 'CurrencySelectInput' || field.type === 'PeriodSelectInput') {
          newFormControlObject[field.database_column_select_name] = new FormControl('');
        }
      } else {
        const isCode = field.database_column_name.endsWith('_code');
        const databaseMetaModelColumnName = isCode ? field.database_column_name.replace('_code', '') : field.database_column_name;
        const tabObject = this.contractsMetaService.contractData[this.tab.name_tab_object];
        const subtabObject = tabObject && tabObject[this.subtab.name_subtab_object] ? tabObject[this.subtab.name_subtab_object] : null;
        const fieldData = subtabObject ? subtabObject[databaseMetaModelColumnName] : '';
        newFormControlObject[field.database_column_name] = new FormControl(
          isCode && fieldData && fieldData.code ? fieldData.code : fieldData
        );
        // TODO: Sasa Specific fields check
        if (field.type === 'CurrencySelectInput' || field.type === 'PeriodSelectInput') {
          const databaseMetaModelSelectName = field.database_column_select_name.replace('_code', '');
          const tabObject = this.contractsMetaService.contractData[this.tab.name_tab_object];
          const subtabObject = tabObject && tabObject[this.subtab.name_subtab_object] ? tabObject[this.subtab.name_subtab_object] : null;
          const fieldDataSelect = subtabObject ? subtabObject[databaseMetaModelSelectName] : '';
          if (fieldDataSelect) {
            newFormControlObject[field.database_column_select_name] = new FormControl(fieldDataSelect.code);
          } else {
            newFormControlObject[field.database_column_select_name] = new FormControl('');
          }
        }
      }
      const childFormGroup = new FormGroup(newFormControlObject);
      arrayFormGroupFields.push(childFormGroup);
    });
  }

  cancel (): void {
    let base = StorageService.get('base-role');
    this.router.navigate([base + '/dashboard/events-and-reminders']).then(nav => {
      console.log(nav);
    }, err => {
      console.log(err);
    });
  }

  saveAndContinueContract (): void {
    if (!this.validate()) {
      this.markFormGroupTouched(this.formGroup);
      return;
    } else {
      this.formGroup.markAsPristine();
      let { arrayFieldsFormArray } = this.formGroup.value;
      let data = {
      };
      for (const key of arrayFieldsFormArray) {
        data = {
          ...data,
          ...key
        };
      }
      const nameTabObject = this.tab.name_tab_object;
      const nameSubtabObject = this.subtab.name_subtab_object;
      const objectData = {
        'organization_code': StorageService.get(StorageService.organizationCode),
        'data': {
          [nameTabObject] : {
            [nameSubtabObject] : data
          }
        }
      };
      if (this.contractsMetaService.addMode) {
        this.contractsMetaService.createContractMeta(objectData).subscribe((response: any) => {
          if (response.msg != null && response.msg === 'Failed') {
            this.toastr.error('Error', 'Something went wrong');
          } else {
            this.contractsMetaService.contractId = response._id;
            this.contractsMetaService.contractData = response;
            this.contractsMetaService.addMode = false;
            this.toastr.success('Operation Complete', 'Contract successfully added');
          }
        });
      } else {
        const urlParams = {
          'contractId': `${this.contractsMetaService.contractId}`
        };
        this.contractsMetaService.updateContractMeta(objectData, urlParams).subscribe((response: any) => {
          if (response.msg != null && response.msg === 'Failed') {
            this.toastr.error('Error', 'Something went wrong');
          } else {
            this.contractsMetaService.contractId = response._id;
            this.contractsMetaService.contractData = response;
            this.toastr.success('Operation Complete', 'Contract successfully updated');
          }
        });
      }

      if (this.matGroupSubTab) {
        if (this.matGroupSubTab._tabs.last.isActive) {
          this.matGroupTab.selectedIndex += 1;
        } else {
          this.matGroupSubTab.selectedIndex += 1;
        }
      } else {
        this.matGroupTab.selectedIndex += 1;
      }
    }
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
}
