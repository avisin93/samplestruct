import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { HttpService } from '../../../../shared/providers/http.service';
import { StorageService } from '../../../../shared/providers/storage.service';
import { UrlDetails } from '../../../../../models/url/url-details.model';
import { Pattern } from '../../../../../models/util/pattern.model';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
  selector: 'app-add-edit-non-registered-users',
  templateUrl: './add-edit-non-registered-users.component.html',
  styleUrls: ['./add-edit-non-registered-users.component.scss']
})

export class AddEditNonRegisteredUsersComponent implements OnInit {

  @Input('heading') heading = 'Add Recipients';
  @Input('saveButtonTitle') saveBtnTitle = 'Add';
  @Input('organizationId') _id = '';
  @Input('mode') mode = 'add';
  addEditRecipientForm: FormGroup;
  constructor (private _fb: FormBuilder,
    public _dialogRef: MatDialogRef<AddEditNonRegisteredUsersComponent>,
    public httpService: HttpService,
    public _toastCtrl: ToastrService) {
    const EMAIL_REGEX = Pattern.EMAIL_PATTERN;
    this.addEditRecipientForm = this._fb.group({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required,Validators.pattern(EMAIL_REGEX)]),
      _id: new FormControl(),
      organizationId: new FormControl(),
      active: new FormControl()
    });
  }

  ngOnInit (): void {
    $('.add-edit-dealcode-wrap').closest('.cdk-overlay-pane').addClass('dealCodeAddEditPopup');
  }

  saveNonRegisterUser ({ value, valid }: {value: any, valid: boolean}) {
    if (!valid) {
      this.addEditRecipientForm.markAsDirty();
    } else {
      if (this.mode !== 'edit') {
        value['organizationId'] = this._id;
      }
      this.addEditRecipientForm.markAsPristine();
      this.httpService.save('UrlDetails.$addOrUpdateNonRegistedUsersUrl',value).subscribe((response) => { // TODO: Vido
        if (response) {
          if (this.mode === 'edit') {
            this._toastCtrl.success('Recipient updated successfully');
          } else {
            this._toastCtrl.success('Recipient added successfully');
          }

          this._dialogRef.close('saved');
        }
      },(error) => {
        if (this.mode === 'edit') {
          this._toastCtrl.error(error._body);
        } else {
          this._toastCtrl.error(error._body);
        }
      });
    }
  }

  setEditFormValues (details?: any) {
    this.addEditRecipientForm.patchValue(details);
  }

  closePopup () {
    this._dialogRef.close();
  }

}
