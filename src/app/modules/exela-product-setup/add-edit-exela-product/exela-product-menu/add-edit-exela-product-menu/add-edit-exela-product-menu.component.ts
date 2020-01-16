import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { FileUploadController } from '../../../../shared/controllers/file-uploader.controller';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit-exela-product-menu',
  templateUrl: './add-edit-exela-product-menu.component.html',
  styleUrls: ['./add-edit-exela-product-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AddEditExelaProductMenuComponent implements OnInit {

  @Input('heading') heading = 'Add Menu';

  @Input('saveButtonTitle') saveBtnTitle = 'Add';

  @Input('mode') mode = '';

  addEditMenuForm: FormGroup;

  constructor (private _fb: FormBuilder,
    public _dialogRef: MatDialogRef<AddEditExelaProductMenuComponent>,
    public _toastCtrl: ToastrService,
    public fileUploadCtrl: FileUploadController) {

    this.addEditMenuForm = this._fb.group({
      name: new FormControl('', [Validators.required]),
      link: new FormControl('', [Validators.required]),
      icon: new FormControl('', [Validators.required]),
      key: new FormControl(''),
      sequence: new FormControl(''),
      active: true
    });
  }

  ngOnInit (): void {
    $('.add-edit-queue-setup').closest('.cdk-overlay-pane').addClass('queueAddEditPopup');
  }

  saveMenu ({ value, valid }: {value: any, valid: boolean}) {
    if (!valid) {
      this.addEditMenuForm.markAsDirty();
    } else {
      this.addEditMenuForm.markAsPristine();
      this._dialogRef.close(value);
    }
  }

  setEditFormValues (details?: any) {
    this.addEditMenuForm.patchValue(details);
  }

  closePopup () {
    this._dialogRef.close();
  }

}
