import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { LoaderService } from 'src/app/modules/shared/components/loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { AddContractMetaModelService } from 'src/app/modules/add-contract-meta-model/add-contract-meta-model.service';

@Component({
  selector: 'cm-preview-add-contract-meta-model-view-tab-subtab-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class PreviewContractMetaModelViewTabSubtabFormComponent implements OnInit {
  formGroup: FormGroup;
  @Input() subtab: any;
  @Input() oneSubtab: Boolean;
  arrayComponents: any[];
  clientConfigurations: any[];

  get formArrayData (): FormArray {
    return this.formGroup.get('arrayFieldsFormArray') as FormArray;
  }

  constructor (
    private loaderService: LoaderService,
    private toastr: ToastrService,
    private addContractMetaModelService: AddContractMetaModelService
  ) {}

  ngOnInit () {
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
      this.addContractMetaModelService.getClientConfigurations().subscribe((res: any) => {
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
      if (field.type === 'Radio Group') {
        newFormControlObject[field.database_column_name] = new FormControl(field.options && field.options.length > 0 ? field.options[0].code : '');
      } else {
        newFormControlObject[field.database_column_name] = new FormControl('');
      }
      if (field.type === 'CurrencySelectInput' || field.type === 'PeriodSelectInput') {
        newFormControlObject[field.database_column_select_name] = new FormControl('');
      }
      const childFormGroup = new FormGroup(newFormControlObject);
      arrayFormGroupFields.push(childFormGroup);
    });
  }
}
