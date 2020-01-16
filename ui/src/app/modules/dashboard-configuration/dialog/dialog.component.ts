import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { getErrorMessage } from 'src/app/modules/utilsValidation';
import { DashboardConfigurationService } from '../dashboard-configuration.service';
import { Pattern } from 'src/app/models/util/pattern.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'cm-dashboard-configuration-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DashboardConfigurationDialogComponent implements OnInit {
  formGroup: FormGroup;
  titleDialog: String;
  tabType: String;
  deleteAction: Boolean = false;
  nameSaveButton: String = 'Save';
  action: String;
  visibility: Boolean;
  selectedIndex: number;
  dashboardConfigurationId: String;
  dashboardConfigurationTabId: String;
  constructor (
        public dialogRef: MatDialogRef<DashboardConfigurationDialogComponent>,
        private dashboardConfigurationService: DashboardConfigurationService,
        private toastr: ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit () {
    this.initializeForm();
    this.action = this.data.action;
    this.visibility = this.data.visibility;
    this.selectedIndex = this.data.selectedIndex;
    this.dashboardConfigurationId = this.data.dashboardConfigurationId ? this.data.dashboardConfigurationId : '0';
    this.dashboardConfigurationTabId = this.data.dashboardConfigurationTabId;

    if (this.action === 'CREATE') {
      this.titleDialog = 'Add New Tab';
    } else if (this.action === 'UPDATE') {
      this.titleDialog = 'Edit Tab';
      this.formGroup.get('tabName').setValue(this.data.tabName);
    } else if (this.action === 'DELETE') {
      this.deleteAction = true;
      this.titleDialog = 'Delete Tab';
      this.nameSaveButton = 'Yes';
    } else {
      this.toastr.error('Error', `Error with type tab`);
    }
  }

  initializeForm () {
    this.formGroup = new FormGroup({
      tabName: new FormControl('', [Validators.required, Validators.pattern(Pattern.ALPHA_WITH_SPACE)]),
      tableView: new FormControl('false')
    });
  }

  saveInput () {
    if (!this.deleteAction && !this.validate()) {
      this.formGroup.markAsDirty();
    } else {
      this.formGroup.markAsPristine();
      this.saveInputTab();
    }
  }

  saveInputTab () {
    const urlParams = {
      dashboardConfigurationId: this.dashboardConfigurationId,
      dashboardConfigurationTabId: this.dashboardConfigurationTabId
    };

    const objectData = {
      changeName: true,
      tab: {
        name: (this.formGroup.get('tabName').value).trim(),
        position: this.selectedIndex
      }
    };

    if (this.action === 'UPDATE') {
      this.dashboardConfigurationService.updateDashboardConfigurationTab(urlParams, objectData).subscribe((response: any) => {
        if (response.status === '500') {
          this.toastr.error('Error', `Error while update contract meta model tab`);
        } else {
          this.toastr.success('Success', `Contract meta model tab updated`);
          this.dialogRef.close({ dashboardConfiguration: response });
        }
      }, error => {
        this.toastr.error('Error', `${error.error}`);
      });
    } else if (this.action === 'CREATE') {
      this.dashboardConfigurationService.createDashboardConfigurationTab(urlParams, objectData).subscribe((response: any) => {
        if (response.status === '500') {
          this.toastr.error('Error', `Error while creating contract meta model tab`);
        } else {
          this.toastr.success('Success', `Contract meta model tab created`);
          this.dialogRef.close({ dashboardConfiguration: response });
        }
      }, error => {
        this.toastr.error('Error', `${error.error}`);
      });
    } else if (this.action === 'DELETE') {

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
