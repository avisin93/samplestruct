import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, ControlContainer, FormControl } from '@angular/forms';
import { getErrorMessage } from 'src/app/modules/utilsValidation';
import { NewObjectDialogComponent } from 'src/app/modules/contracts-meta/new-object-dialog/new-object-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'cm-contracts-meta-tab-subtab-form-dropdown-create',
  templateUrl: './dropdown-create.component.html',
  styleUrls: ['./dropdown-create.component.scss']
})
export class ContractsMetaTabSubtabFormDropdownCreateComponent implements OnInit {
  formGroup: FormGroup;
  @Input() addContractMetaModelId: String;
  @Input() field: any;
  @Input() oneSubtab: Boolean;
  @Input() clientConfigurations: any[];
  @Input() tab: any;
  @Input() subtab: any;
  columnObjectName: string;
  arrayData: any[];

  constructor (
    private controlContainer: ControlContainer,
    private dialogMatDialog: MatDialog
    ) {
  }

  ngOnInit () {
    this.columnObjectName = this.field.database_column_name.replace('_code', '');
    this.arrayData = this.field && !this.field.default_field ? this.field.options : this.clientConfigurations[this.columnObjectName];
    this.formGroup = this.controlContainer.control as FormGroup;
  }

  getErrorMessage (field: FormControl, customMsg?: JSON): string {
    if (field.touched) {
      return getErrorMessage(field, customMsg);
    }
  }

  openCreateNewObjectDialog (field: any): void {
    if (this.addContractMetaModelId) {
      const dialogRef = this.dialogMatDialog.open(NewObjectDialogComponent, {
        width: '475px',
        height: '200px',
        data: {
          titleText: field.name,
          objectCode: field.database_column_name,
          addContractMetaId: this.addContractMetaModelId,
          addContractMetaModelTabId: this.tab._id,
          addContractMetaModelSubTabId: this.subtab._id,
          componentId: field._id
        }
      });
      dialogRef.componentInstance.onCreateNewObject.subscribe((response) => {
        this.arrayData.push(response);
        this.formGroup.get(field.database_column_name).setValue(response.code);
        dialogRef.close();
      });
    }
  }
}
