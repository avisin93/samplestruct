import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { getErrorMessage } from 'src/app/modules/utilsValidation';
import { ContractsMetaService } from 'src/app/modules/contracts-meta/contracts-meta.service';
import { StorageService } from 'src/app/modules/shared/providers/storage.service';
import { LoaderService } from 'src/app/modules/shared/components/loader/loader.service';
import { ContractsMetaTabSubtabFormInputFileComponent } from '../../form/input-file/input-file.component';

@Component({
  selector: 'cm-contracts-meta-tab-subtab-table-add-panel',
  templateUrl: './add-panel.component.html',
  styleUrls: ['./add-panel.component.scss']
})
export class ContractsMetaSubtabTableAddPanelComponent implements OnInit {

  formGroup: FormGroup;
  objectData: any;
  get formArrayData (): FormArray {
    return this.formGroup.get('arrayFieldsFormArray') as FormArray;
  }
  arrayComponents: any[];

  @Output() isDirty: EventEmitter<boolean> = new EventEmitter();
  @Output() goBack: EventEmitter<any> = new EventEmitter<string>();
  @Input() transferData;
  @Input() tab: any;
  @Input() subtab: any;
  @Input() oneSubtab: Boolean;
  @Input() addContractMetaModelId: String;

  clientConfigurations: any[];

  onChanges () {
    this.formGroup.valueChanges.subscribe(val => {
      this.isDirty.emit(true);
    });
  }

  @ViewChild(ContractsMetaTabSubtabFormInputFileComponent) ContractsMetaTabSubtabFormInputFileComponent: ContractsMetaTabSubtabFormInputFileComponent;

  constructor (
    private toastr: ToastrService,
    private contractsMetaService: ContractsMetaService,
    private loaderService: LoaderService
  ) {
    this.formGroup = this.initializeForm();
  }

  ngOnInit () {
    this.loaderService.show();
    this.objectData = this.transferData && this.transferData.data ? this.transferData.data : {};
    const updateData = this.transferData && this.transferData.data ? this.transferData.data.update : false;
    this.initializeDataForm(updateData, this.objectData);
  }

  initializeForm (): FormGroup {
    return new FormGroup({
      arrayFieldsFormArray: new FormArray([])
    });
  }

  initializeDataForm (type: any, objectData?: any): void {
    this.arrayComponents = this.subtab && this.subtab['components'] ? this.subtab['components'].filter(el => { return (el.hasOwnProperty('is_deleted') && !el.is_deleted) && el.is_visible_form; }) : [];
    const haveDropdownFields = this.arrayComponents.find(field => field.type === 'Dropdown' || field.type === 'DropdownCreate');
    if (haveDropdownFields) {
      this.contractsMetaService.getClientConfigurations().subscribe((res: any) => {
        this.clientConfigurations = res;
        this.parseData(type, objectData);
        this.loaderService.hide();
      }, () => {
        this.toastr.error('Error', 'Something went wrong(Cannot fetch data)');
      });
    } else {
      this.parseData(type, objectData);
      this.loaderService.hide();
    }
  }

  parseData (type: any, objectData?: any): void {
    const arrayFormGroupFields = this.formGroup.get('arrayFieldsFormArray') as FormArray;
    this.arrayComponents.map(field => {
      const newFormControlObject = {} ;
      if (!type) {
        if (field.type === 'ParentChildInput') {
          newFormControlObject[field.database_column_name] = new FormControl(
            { value: '', disabled: true },
            [this.validateParentDocument]);
        } else if (field.type === 'Radio Group') {
          newFormControlObject[field.database_column_name] = new FormControl(field.options && field.options.length > 0 ? field.options[0].code : '');
        } else {
          newFormControlObject[field.database_column_name] = new FormControl('');
        }
        // TODO: Sasa Specific fields check
        if (field.type === 'CurrencySelectInput' || field.type === 'PeriodSelectInput') {
          newFormControlObject[field.database_column_select_name] = new FormControl('');
        }
      } else {
      // Update
        const isCode = field.database_column_name.endsWith('_code');
        const databaseMetaModelColumnName = isCode ? field.database_column_name.replace('_code', '') : field.database_column_name;
        if (field.type === 'ParentChildInput') {
          newFormControlObject[field.database_column_name] = new FormControl(
            { value: objectData[databaseMetaModelColumnName], disabled: true },
            [this.validateParentDocument]);
        } else {
          newFormControlObject[field.database_column_name] = new FormControl(
            isCode && objectData[databaseMetaModelColumnName] ? objectData[databaseMetaModelColumnName].code : objectData[databaseMetaModelColumnName]);
        }
          // TODO: Sasa Specific fields check
        if (field.type === 'CurrencySelectInput' || field.type === 'PeriodSelectInput') {
          const databaseMetaModelSelectName = field.database_column_select_name.replace('_code', '');
          if (objectData[databaseMetaModelSelectName]) {
            newFormControlObject[field.database_column_select_name] = new FormControl(objectData[databaseMetaModelSelectName].code);
          } else {
            newFormControlObject[field.database_column_select_name] = new FormControl('');
          }
        }
      }
      const childFormGroup = new FormGroup(newFormControlObject);
      arrayFormGroupFields.push(childFormGroup);
    });
  }

  cancel () {
    this.isDirty.emit(false);
    this.goToTable();
  }

  goToTable () {
    this.goBack.emit();
  }

  saveAndContinue (): void {
    if (!this.validate()) {
      return;
    }
    const urlParams = {
      contractId: `${this.contractsMetaService.contractId}`
    };
    let { arrayFieldsFormArray } = this.formGroup.value;
    let dataInObject = {
    };
    for (const key of arrayFieldsFormArray) {
      dataInObject = {
        ...dataInObject,
        ...key
      };
    }
    dataInObject['uuid'] = (this.objectData && this.objectData.uuid) || '';
    const nameTabObject = this.tab.name_tab_object;
    const nameSubtabObject = this.subtab.name_subtab_object;
    const objectData = {
      'organization_code': StorageService.get(StorageService.organizationCode),
      'data':  {
        [nameTabObject] : {
          [nameSubtabObject] : [dataInObject]
        }
      }
    };
    this.contractsMetaService.updateContractMeta(objectData, urlParams).subscribe((response: any) => {
      this.toastr.success('Operation Complete', 'Successfully updated');
      this.contractsMetaService.contractId = response._id;
      this.contractsMetaService.contractData = response;
      this.goToTable();
    }, (error: any) => {
      console.log(error);
      this.toastr.error('Error', `Something went wrong(Cannot update ${this.subtab.name})`);
    });
    this.isDirty.emit(false);
  }

  saveDocument (): void {
    if (!this.validate() || (typeof this.contractsMetaService.contractId === 'undefined'
        || this.contractsMetaService.contractId === null
        || this.contractsMetaService.contractId === '0')) {
      return;
    }
    this.loaderService.show();
    const urlParams = {
      contractId: `${this.contractsMetaService.contractId}`
    };
    let { arrayFieldsFormArray } = this.formGroup.value;
    let dataInObject = {
    };
    for (const key of arrayFieldsFormArray) {
      dataInObject = {
        ...dataInObject,
        ...key
      };
    }
    dataInObject['file_type'] = this.getFileType();
    const objectDocument = {
      data: {
        document: dataInObject
      }
    };

    if (this.objectData && this.objectData._id) {
      urlParams['documentId'] = this.objectData._id;
      this.contractsMetaService.updateDocumentContractMetaFile(objectDocument, urlParams).subscribe((response: any) => {
        if (response.status === '500') {
          this.toastr.error('Error','Document not updated!!!');
        } else {
          this.toastr.success('Operation Complete','Document successfully updated');
          this.contractsMetaService.contractId = response._id;
          this.contractsMetaService.contractData = response;
          this.goToTable();
        }
        this.loaderService.hide();
      }, (error: any) => {
        console.log(error);
        this.toastr.error('Error',`Document not updated ${error}!`);
        this.loaderService.hide();
      });
    } else {
      const formData = new FormData();
      formData.append('uploadFile', this.getFileToUpload());
      formData.append('documentData', JSON.stringify(objectDocument));
      formData.append('contractMeta', 'true');

      this.contractsMetaService.createDocumentContractMetaFile(formData, urlParams).subscribe((response: any) => {
        if (response.status === '500') {
          this.toastr.error('Error','Document not created!!!');
        } else {
          this.contractsMetaService.contractId = response._id;
          this.contractsMetaService.contractData = response;
          this.goToTable();
          this.toastr.success('Operation Complete','Document successfully added');
        }
        this.loaderService.hide();
      }, (error: any) => {
        console.log(error);
        this.toastr.error('Error',`Document not created: ${error.error}`);
        this.loaderService.hide();
      });
    }
  }

  getFileToUpload (): File {
    return this.ContractsMetaTabSubtabFormInputFileComponent.fileToUpload;
  }

  getFileType (): string {
    return this.ContractsMetaTabSubtabFormInputFileComponent.fileType;
  }

  isDirtyChild (changed: boolean) {
    this.isDirty.emit(changed);
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

  getErrorMessage (field: FormControl, customMsg?: JSON): string {
    if (field.touched) {
      return getErrorMessage(field, customMsg);
    }
  }

  // clearAction (): void {
  //   let pomArray = this.formGroup.get('arrayFieldsFormArray') as FormArray;
  //   while (pomArray.length !== 0) {
  //     pomArray.removeAt(0);
  //   }
  //   this.objectData = this.transferData && this.transferData.data ? this.transferData.data : {};
  //   const updateData = this.transferData && this.transferData.data ? this.transferData.data.update : false;
  //   this.initializeDataForm(updateData, this.objectData);
  //   this.isDirty.emit(false);
  // }
  validateParentDocument (control: AbstractControl): {[key: string]: any} {
    return !control.disabled && control.value === '' ? { 'required': { value: control.value } } : null;
  }
}
