import { Component, OnInit, Inject, Input, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { getErrorMessage } from 'src/app/modules/utilsValidation';
import { ContractsMetaService } from '../contracts-meta.service';

@Component({
  selector: 'cm-new-object-dialog-component',
  templateUrl: './new-object-dialog.component.html',
  styleUrls: ['./new-object-dialog.component.scss']
})
export class NewObjectDialogComponent implements OnInit {

  formGroup: FormGroup;
  objectCode: string;
  @Input() titleText: string;
  onCreateNewObject = new EventEmitter<any>();

  constructor (
    public dialogRef: MatDialogRef<NewObjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    private contractMetaService: ContractsMetaService
  ) {

  }

  ngOnInit (): void {
    this.formGroup = new FormGroup({
      inputNameObject: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]*$')])
    });

    this.titleText = 'Add ' + this.data.titleText;
    this.objectCode = this.data.objectCode;
  }

  public cancelCreateNewObject (): void {
    this.titleText = '';
    this.objectCode = '';
  }

  public saveCreateNewObject (): void {
    if (!this.validate()) {
      return;
    }
    const inputNameObject = this.formGroup.get('inputNameObject').value;
    const newObjectCode = (inputNameObject.replace(/\s/g, '')).toUpperCase();
    const objectData = {
      data: {
        name : inputNameObject,
        code: newObjectCode,
        objectCode: this.objectCode,
        addContractMetaId: this.data.addContractMetaId,
        addContractMetaModelTabId: this.data.addContractMetaModelTabId,
        addContractMetaModelSubTabId: this.data.addContractMetaModelSubTabId,
        componentId: this.data.componentId
      }
    };
    this.contractMetaService.addClientObject(objectData).subscribe((res: any) => {
      this.toastr.success('Operation Complete', 'Successfully added');
      this.onCreateNewObject.emit(res);
    }, error => {
      this.toastr.error('Error', `${error.error.msg}`);
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

  getErrorMessage (field: FormControl, customMsg?: JSON) {
    if (field.touched) {
      return getErrorMessage(field, customMsg);
    }
  }
}
