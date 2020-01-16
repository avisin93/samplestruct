import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { getErrorMessage } from 'src/app/modules/utilsValidation';
import { AddContractMetaModelService } from '../add-contract-meta-model.service';
import { ToastrService } from 'ngx-toastr';
import { Pattern } from 'src/app/models/util/pattern.model';

@Component({
  selector: 'cm-open-dialog',
  templateUrl: './open-dialog.component.html',
  styleUrls: ['./open-dialog.component.scss']
})
export class OpenDialogComponent implements OnInit {
  formGroup: FormGroup;
  titleDialog: String;
  deleteAction: Boolean = false;
  createAction: Boolean = false;
  nameSaveButton: String = 'Save';
  action: String;
  tabType: String;
  visibility: Boolean;
  fixedVisibility: Boolean;
  isTableView: Boolean;
  defaultSubtab: Boolean;
  addNewFields: Boolean;
  defaultTab: Boolean;
  createNewSubtab: Boolean;
  addContractMetaModelId: String;
  addContractMetaModelTabId: String;
  addContractMetaModelSubtabId: String;
  selectedIndex: String;
  constructor (
        public dialogRef: MatDialogRef<OpenDialogComponent>,
        private addContractMetaModelService: AddContractMetaModelService,
        private toastr: ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit () {
    this.action = this.data.action;
    this.tabType = this.data.tabType;
    if (this.action === 'UPDATE' && this.tabType === 'SUBTAB') {
      this.initializeSubTabForm();
    } else {
      this.initializeForm();
    }

    this.visibility = this.data.visibility;
    this.fixedVisibility = this.data.fixedVisibility;
    this.isTableView = this.data.isTableView;
    this.addContractMetaModelId = this.data.addContractMetaModelId ? this.data.addContractMetaModelId : '0';
    this.addContractMetaModelTabId = this.data.addContractMetaModelTabId;
    this.addContractMetaModelSubtabId = this.data.addContractMetaModelSubtabId;
    this.selectedIndex = this.data.selectedIndex;
    this.createNewSubtab = this.data.createNewSubtab;
    this.defaultSubtab = this.data.defaultSubtab;
    this.defaultTab = this.data.defaultTab;
    this.addNewFields = this.data.addNewFields;
    if (this.action === 'CREATE') {
      this.titleDialog = 'Add New Tab';
      this.createAction = true;
    } else if (this.action === 'UPDATE') {
      this.titleDialog = 'Edit Tab';
      this.formGroup.get('tabName').setValue(this.data.tabName);
      this.formGroup.get('tableView').setValue(this.isTableView);
    } else if (this.action === 'DELETE') {
      this.deleteAction = true;
      this.titleDialog = 'Delete Tab';
      this.nameSaveButton = 'Yes';
    } else if (this.action === 'RESET') {
      this.deleteAction = true;
      this.titleDialog = 'Reset Tab';
      this.nameSaveButton = 'Yes';
    } else {
      this.toastr.error('Error', `Error with type tab`);
    }
  }

  initializeForm () {
    this.formGroup = new FormGroup({
      tabName: new FormControl('', [Validators.required, Validators.pattern(Pattern.ALPHA_WITH_SPECIAL_CHARACTERS)]),
      tableView: new FormControl('false')
    });
  }

  initializeSubTabForm () {
    this.formGroup = new FormGroup({
      tabName: new FormControl('', [Validators.required, Validators.pattern(Pattern.ALPHA_NUMERIC_WITH_SPACES), Validators.maxLength(25)]),
      tableView: new FormControl('false')
    });
  }

  saveInput () {
    if (!this.deleteAction && !this.validate()) {
      this.formGroup.markAsDirty();
    } else {
      this.formGroup.markAsPristine();
      if (this.tabType === 'TAB') {
        this.saveInputTab();
      } else if (this.tabType === 'SUBTAB') {
        this.saveInputSubtab();
      } else {
        this.toastr.error('Error', `Error with type tab`);
      }
    }
  }

  saveInputTab () {
    const urlParams = {
      addContractMetaModelId: this.addContractMetaModelId,
      addContractMetaModelTabId: this.addContractMetaModelTabId
    };

    const objectData = {
      changeName: true,
      tab: {
        name: (this.formGroup.get('tabName').value).trim(),
        position: this.selectedIndex,
        create_new_subtab: this.createNewSubtab,
        default_tab: this.defaultTab,
        sub_tab_id: this.addContractMetaModelSubtabId
      }
    };

    if (this.action === 'UPDATE') {
      this.addContractMetaModelService.updateAddContractMetaModelTab(urlParams, objectData).subscribe((response: any) => {
        if (response.status === '500') {
          this.toastr.error('Error', `Error while update contract meta model tab`);
        } else {
          this.toastr.success('Success', `Contract meta model tab updated`);
          this.dialogRef.close({ addContractMetaModel: response });
        }
      }, error => {
        this.toastr.error('Error', `${error.error}`);
      });
    } else if (this.action === 'CREATE') {
      this.addContractMetaModelService.createAddContractMetaModelTab(urlParams, objectData).subscribe((response: any) => {
        if (response.status === '500') {
          this.toastr.error('Error', `Error while creating contract meta model tab`);
        } else {
          this.toastr.success('Success', `Contract meta model tab created`);
          this.dialogRef.close({ addContractMetaModel: response });
        }
      }, error => {
        this.toastr.error('Error', `${error.error}`);
      });
    } else if (this.action === 'DELETE') {
      this.addContractMetaModelService.deleteAddContractMetaModelTab(urlParams).subscribe((response: any) => {
        if (response.status === '500') {
          this.toastr.error('Error', `Error while deleting contract meta model tab`);
        } else {
          this.toastr.success('Success', `Contract meta model tab deleted`);
          this.dialogRef.close({ addContractMetaModel: response });
        }
      }, error => {
        this.toastr.error('Error', `${error.error}`);
        this.dialogRef.close();

      });
    } else if (this.action === 'RESET') {
      this.addContractMetaModelService.resetFieldsForMetaContractTab(urlParams, objectData).subscribe((response: any) => {
        if (response.status === '500') {
          this.toastr.error('Error', `Error while update contract meta model tab`);
        } else {
          this.toastr.success('Success', `Contract meta model tab updated`);
          this.dialogRef.close({ addContractMetaModel: response });
        }
      }, error => {
        this.toastr.error('Error', `${error.error}`);
      });
    } else {
      this.toastr.error('Error', `Error with action for tab`);
    }
  }

  saveInputSubtab () {
    const urlParams = {
      addContractMetaModelId: this.addContractMetaModelId,
      addContractMetaModelTabId: this.addContractMetaModelTabId,
      addContractMetaModelSubtabId: this.addContractMetaModelSubtabId
    };

    const objectData = {
      tab: {
        changeName: true,
        subtab: {
          name: (this.formGroup.get('tabName').value).trim(),
          position: this.selectedIndex,
          visibility: this.visibility,
          fixed_visibility: this.fixedVisibility,
          is_table_view: this.formGroup.get('tableView').value,
          default_subtab: this.defaultSubtab,
          add_new_fields: this.addNewFields
        }
      }
    };

    if (this.action === 'UPDATE') {
      this.addContractMetaModelService.updateAddContractMetaModelTabSubtab(urlParams, objectData).subscribe((response: any) => {
        if (response.status === '500') {
          this.toastr.error('Error', `Error while update contract meta model subtab`);
        } else {
          this.toastr.success('Success', `Contract meta model subtab updated`);
          this.dialogRef.close({ addContractMetaModel: response });
        }
      }, error => {
        this.toastr.error('Error', `${error.error}`);
      });
    } else if (this.action === 'CREATE') {
      this.addContractMetaModelService.createAddContractMetaModelSubtab(urlParams, objectData).subscribe((response: any) => {
        if (response.status === '500') {
          this.toastr.error('Error', `Error while creating contract meta model subtab`);
        } else {
          this.toastr.success('Success', `Contract meta model subtab created`);
          this.dialogRef.close({ addContractMetaModel: response });
        }
      }, error => {
        this.toastr.error('Error', `${error.error}`);
      });
    } else if (this.action === 'DELETE') {
      this.addContractMetaModelService.deleteAddContractMetaModelSubtab(urlParams).subscribe((response: any) => {
        if (response.status === '500') {
          this.toastr.error('Error', `Error while deleting contract meta model subtab`);
        } else {
          this.toastr.success('Success', `Contract meta model subtab deleted`);
          this.dialogRef.close({ addContractMetaModel: response });
        }
      }, error => {
        this.toastr.error('Error', `${error.error}`);
      });
    } else {
      this.toastr.error('Error', `Error with action for tab`);
    }
  }

  closePopup () {
    this.dialogRef.close();
  }

  getErrorMessage (field: FormControl, customMsg?: JSON) {
    if (field.touched) {
      return getErrorMessage(field, customMsg);
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
}
