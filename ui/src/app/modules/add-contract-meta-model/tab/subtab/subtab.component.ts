import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { AddContractMetaModelService } from '../../add-contract-meta-model.service';
import { Pattern } from '../../../../models/util/pattern.model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SessionService } from '../../../shared/providers/session.service';
import { MatTabGroup, MatDialog } from '@angular/material';
import { PopUpComponent } from 'src/app/modules/pop-up/pop-up.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { StorageService } from 'src/app/modules/shared/providers/storage.service';

@Component({
  selector: 'cm-add-contract-meta-model-subtab',
  templateUrl: './subtab.component.html',
  styleUrls: ['./subtab.component.scss']
})
export class AddContractMetaModelSubtabComponent implements OnInit {
  @Input() matGroupTab: MatTabGroup;
  @Input() matGroupSubTab: MatTabGroup;

  formGroup: FormGroup;
  @Input() subtab: any;
  @Input() addContractMetaModelId: String;
  @Input() addContractMetaModelTabId: String;
  @Output() isDirty: EventEmitter<boolean> = new EventEmitter();
  @Input() selectedIndexSubtab: number;

  addContractMetaModelSubtabId: String;
  isTableView: Boolean = false;
  addTypeName: String = 'ADD NEW FIELD';
  get formArrayData (): FormArray {
    return this.formGroup.get('additionalAttributesFormArray') as FormArray;
  }

  constructor (
    private addContractMetaModelService: AddContractMetaModelService,
    private toastr: ToastrService,
    private router: Router,
    private dialogMatDialog: MatDialog
  ) {}

  ngOnInit (): void {
    this.initializeForm();
    this.initializeDataForm();
    this.onChanges();
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
    this.addContractMetaModelSubtabId = this.subtab['_id'];
    this.isTableView = this.subtab.is_table_view ? this.subtab.is_table_view : false;
    if (this.isTableView) {
      this.addTypeName = 'Add column';
    }
    const attributeComponentsArray = this.subtab['components'].filter(el => {
      return (el.hasOwnProperty('is_deleted') && !el.is_deleted);
    });
    attributeComponentsArray.sort((a, b) => (a.position > b.position) ? 1 : -1);
    const additionalAttributesFormArray = this.formGroup.get('additionalAttributesFormArray') as FormArray;
    attributeComponentsArray.map(component => {
      const defaultField = component.default_field;
      const childFormGroup = new FormGroup({
        name: new FormControl({ value: component.name, disabled: defaultField }, [Validators.required, Validators.pattern(Pattern.ALPHA_WITH_SPACE), Validators.maxLength(70)]),
        type: new FormControl({ value: component.type, disabled: defaultField }, [Validators.required]),
        options: new FormArray([new FormControl({ value: '', disabled: defaultField })]),
        default_field: new FormControl(component.default_field),
        is_visible_form: new FormControl({ value: component.is_visible_form, disabled: component.disabled }),
        is_deleted: new FormControl(component.is_deleted),
        _id: new FormControl(component._id),
        date_deleted: new FormControl(component.date_deleted),
        disabled: new FormControl(component.disabled),
        childs: new FormArray([]),
        database_column_name: new FormControl(component.database_column_name)
      });
      if (component.type === 'Dropdown' || component.type === 'DropdownCreate' || component.type === 'Radio Group') {
        const optionsComponentArray = childFormGroup.get('options') as FormArray;
        component.options.map(option => {
          optionsComponentArray.push(new FormControl(option.value, [Validators.required, Validators.pattern(Pattern.ALPHA_WITH_SPACE), Validators.maxLength(30)]));
        });
        optionsComponentArray.at(0).setValidators([Validators.pattern(Pattern.ALPHA_WITH_SPACE), this.validateMinLength(), Validators.maxLength(30)]);
        optionsComponentArray.at(0).updateValueAndValidity();
      }
      const childsArray = childFormGroup.get('childs') as FormArray;
      component.childs.map(child => {
        childsArray.push(new FormControl(child.database_column_name));
      });
      additionalAttributesFormArray.push(childFormGroup);
    });
  }

  addNewAttribute (): void {
    const newAttributeFormGroup = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.pattern(Pattern.ALPHA_WITH_SPACE), Validators.maxLength(70)]),
      type: new FormControl('', [Validators.required]),
      options: new FormArray([new FormControl('')]),
      default_field: new FormControl(false),
      is_visible_form: new FormControl('true'),
      is_deleted: new FormControl(false),
      disabled: new FormControl('false'),
      childs: new FormArray([])
    });
    (this.formGroup.get('additionalAttributesFormArray') as FormArray).push(newAttributeFormGroup);
  }

  removeField (event): void {
    (this.formGroup.get('additionalAttributesFormArray') as FormArray).at(event).patchValue({ 'is_deleted': true });
  }

  parentVisibility (event): void {
    const pomArray = this.formGroup.get('additionalAttributesFormArray') as FormArray;
    const childsFieldArray = pomArray.value[event].childs;
    if (childsFieldArray && childsFieldArray.length > 0) {
      childsFieldArray.forEach(el1 => {
        if (el1 !== null) {
          let i = 0;
          pomArray.controls.forEach(control => {
            if (el1 === control.value.database_column_name) {
              const defaultField = control.value.default_field;
              if (defaultField) {
                control.enable();
                const childFormGroup = new FormGroup({
                  name: new FormControl({ value: control.value.name, disabled: defaultField }, [Validators.required, Validators.pattern(Pattern.ALPHA_WITH_SPACE), Validators.maxLength(70)]),
                  type: new FormControl({ value: control.value.type, disabled: defaultField }, [Validators.required]),
                  options: new FormArray([new FormControl({ value: '', disabled: defaultField })]),
                  default_field: new FormControl(control.value.default_field),
                  is_visible_form: new FormControl({ value: false, disabled: false }),
                  _id: new FormControl(control.value._id),
                  is_deleted: new FormControl(control.value.is_deleted),
                  date_deleted: new FormControl(control.value.date_deleted),
                  disabled: new FormControl({ value: false, disabled: false }),
                  childs: new FormArray([]),
                  database_column_name: new FormControl(control.value.database_column_name)
                });
                if (control.value.type === 'Dropdown' || control.value.type === 'DropdownCreate' || control.value.type === 'Radio Group') {
                  const optionsComponentArray = childFormGroup.get('options') as FormArray;
                  control.value.options.map(value => {
                    if (value !== '') {
                      optionsComponentArray.push(new FormControl(value, [Validators.required, Validators.pattern(Pattern.ALPHA_WITH_SPACE), Validators.maxLength(30)]));
                    }
                  });
                  optionsComponentArray.at(0).setValidators([Validators.pattern(Pattern.ALPHA_WITH_SPACE), this.validateMinLength(), Validators.maxLength(30)]);
                  optionsComponentArray.at(0).updateValueAndValidity();
                }
                const childsArray = childFormGroup.get('childs') as FormArray;
                control.value.childs.map(value => {
                  childsArray.push(new FormControl(value));
                });
                pomArray.setControl(i, childFormGroup);
              } else {
                control.enable();
              }
            }
            i++;
          });
        }
      });
    }
  }

  parentInvisibility (event): void {
    const pomArray = this.formGroup.get('additionalAttributesFormArray') as FormArray;
    const childsFieldArray = pomArray.value[event].childs;
    if (childsFieldArray && childsFieldArray.length > 0) {
      childsFieldArray.forEach(el1 => {
        if (el1 !== null) {
          let i = 0;
          pomArray.controls.forEach(control => {
            if (el1 === control.value.database_column_name) {
              const defaultField = control.value.default_field;
              if (defaultField) {
                control.enable();
                const childFormGroup = new FormGroup({
                  name: new FormControl({ value: control.value.name, disabled: defaultField }, [Validators.required, Validators.pattern(Pattern.ALPHA_WITH_SPACE)]),
                  type: new FormControl({ value: control.value.type, disabled: defaultField }, [Validators.required]),
                  options: new FormArray([new FormControl({ value: '', disabled: defaultField })]),
                  default_field: new FormControl(control.value.default_field),
                  is_visible_form: new FormControl({ value: false, disabled: true }),
                  _id: new FormControl(control.value._id),
                  is_deleted: new FormControl(control.value.is_deleted),
                  date_deleted: new FormControl(control.value.date_deleted),
                  disabled: new FormControl({ value: true, disabled: true }),
                  childs: new FormArray([]),
                  database_column_name: new FormControl(control.value.database_column_name)
                });
                if (control.value.type === 'Dropdown' || control.value.type === 'DropdownCreate' || control.value.type === 'Radio Group') {
                  const optionsComponentArray = childFormGroup.get('options') as FormArray;
                  control.value.options.map(value => {
                    if (value !== '') {
                      optionsComponentArray.push(new FormControl(value, [Validators.required, Validators.pattern(Pattern.ALPHA_WITH_SPACE), Validators.maxLength(30)]));
                    }
                  });
                  optionsComponentArray.at(0).setValidators([Validators.pattern(Pattern.ALPHA_WITH_SPACE), this.validateMinLength(), Validators.maxLength(30)]);
                  optionsComponentArray.at(0).updateValueAndValidity();
                }
                const childsArray = childFormGroup.get('childs') as FormArray;
                control.value.childs.map(value => {
                  childsArray.push(new FormControl(value));
                });
                pomArray.setControl(i, childFormGroup);
              } else {
                control.disable();
              }
            }
            i++;
          });
        }
      });
    }
  }

  cancelAction (): void {
    let pomArray = this.formGroup.get('additionalAttributesFormArray') as FormArray;
    while (pomArray.length !== 0) {
      pomArray.removeAt(0);
    }
    this.initializeDataForm();
    this.isDirty.emit(false);

    let base = SessionService.get('base-role');
    this.router.navigate([base + '/dashboard/events-and-reminders']).then().catch();
  }

  async resetAction () {
    const result = await this.openDialog(`All unsaved changes will be gone?`).then(value => {
      return value;
    }).catch();
    if (result) {
      let pomArray = this.formGroup.get('additionalAttributesFormArray') as FormArray;
      while (pomArray.length !== 0) {
        pomArray.removeAt(0);
      }
      this.initializeDataForm();
      this.isDirty.emit(false);
    }
  }

  saveAction (previewView): void {
    let { additionalAttributesFormArray } = this.formGroup.getRawValue();
    if (!this.validate() || additionalAttributesFormArray.length === 0) {
      this.markFormGroupTouched(this.formGroup);
      return;
    } else {
      this.formGroup.markAsPristine();
      additionalAttributesFormArray = additionalAttributesFormArray.map((item, index) => {
        item['position'] = index;
        if (item.type === 'Dropdown' || item.type === 'DropdownCreate' || item.type === 'Radio Group') {
          item.options.shift();
        } else {
          delete item['options'];
        }
        return item;
      });

      const urlParams = {
        addContractMetaModelId: this.addContractMetaModelId,
        addContractMetaModelTabId: this.addContractMetaModelTabId,
        addContractMetaModelSubtabId: this.addContractMetaModelSubtabId
      };

      const objectData = {
        tab: {
          subtab: {
            components: JSON.parse(JSON.stringify(additionalAttributesFormArray))
          }
        }
      };
      this.addContractMetaModelService.updateAddContractMetaModelTabSubtabFields(urlParams, objectData).subscribe((response: any) => {
        if (response.status === '500') {
          this.toastr.error('Error', `Error while update contract meta model subtab`);
        } else {
          this.toastr.success('Success', `Contract meta model subtab updated`);
          this.addContractMetaModelService.changedTabs(response);
          this.addContractMetaModelService.changedSubtab(this.selectedIndexSubtab);
          if (previewView) {
            this.changePanels();
          }
        }
      }, error => {
        this.toastr.error('Error', `${error}`);
      });
      this.isDirty.emit(false);
    }
  }

  async previewAction (): Promise<void> {
    if (this.formGroup.dirty) {
      let { additionalAttributesFormArray } = this.formGroup.getRawValue();
      if (!this.validate() || additionalAttributesFormArray.length === 0) {
        this.markFormGroupTouched(this.formGroup);
        this.toastr.error('Error', 'In order to save before preview please fix data input!');
        return;
      } else {
        let result = await this.openDialog(`In order too see changes you need to save data, proceed?`).then(value => {
          return value;
        }).catch();
        if (result) {
          this.saveAction(true);
        }
      }
    } else {
      this.changePanels();
    }
  }

  changePanels (): void {
    this.addContractMetaModelService.changedPanels({
      previewPanel: false,
      addContractMetaModelPanel: true,
      selectedIndexTab: this.matGroupTab.selectedIndex,
      selectedIndexSubtab: this.matGroupSubTab.selectedIndex
    });
  }

  openDialog (message) {
    return new Promise(resolve => {
      const dialogRef = this.dialogMatDialog.open(PopUpComponent, {
        width: '450px',
        data: {
          message: message,
          'yes': 'Ok',
          'no': 'Cancel',
          'fontSize': '20px'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        setTimeout(() => {
          if (result) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
    });
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

  validateMinLength (): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      if (control.parent && control.parent['length'] < 2) {
        return { 'minLength': { value: 2 } };
      }
      return null;
    };
  }

  private markFormGroupTouched (formGroup: FormGroup) {
    (Object as any).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  dropField (event: CdkDragDrop<string[]>) {
    if (event.previousIndex !== event.currentIndex) {
      moveItemInArray(this.formArrayData.controls, event.previousIndex, event.currentIndex);
      let { additionalAttributesFormArray } = this.formGroup.getRawValue();
      additionalAttributesFormArray.forEach((element, index) => {
        element['position'] = index;
      });
      this.saveAction(false);
    }
  }

  checkUserIfClientEditor () {
    let role = StorageService.get(StorageService.userRole);
    if (role === 'Client Editor' || role === 'Editor') {
      return true;
    } else {
      return false;
    }
  }
}
