import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { HttpService } from '../../../../shared/providers/http.service';
import { UrlDetails } from '../../../../../models/url/url-details.model';
import { Pattern } from '../../../../../models/util/pattern.model';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
  selector: 'app-add-edit-self-registered-users',
  templateUrl: './add-edit-self-registered-users.component.html',
  styleUrls: ['./add-edit-self-registered-users.component.scss']
})

export class AddEditSelfRegisteredUsersComponent implements OnInit {

  @Input('heading') heading = 'Add Recipients';
  @Input('saveButtonTitle') saveBtnTitle = 'Add';
  @Input('organizationId') organizationId = '';
  @Input('mode') mode = 'add';
  @Input('roles') roles = [];
  addEditSelfRegistrationForm: FormGroup;
  constructor (private _fb: FormBuilder,
        public _dialogRef: MatDialogRef<AddEditSelfRegisteredUsersComponent>,
        public httpService: HttpService,
        public _toastCtrl: ToastrService) {
    const EMAIL_REGEX = Pattern.EMAIL_PATTERN;
    this.addEditSelfRegistrationForm = this._fb.group({
      email: new FormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)]),
      roles: new FormControl('', [Validators.required]),
      _id: new FormControl()
    });
  }
  showRoleError: Boolean = false;

  ngOnInit (): void {
    $('.add-edit-dealcode-wrap').closest('.cdk-overlay-pane').addClass('dealCodeAddEditPopup');
  }

  saveSelfRegisterUser ({ value, valid }: { value: any, valid: boolean }) {
    if (!valid) {
      this.addEditSelfRegistrationForm.markAsDirty();
    } else {
      if (value.roles === '') {
        this.showRoleError = true;
        this.addEditSelfRegistrationForm.controls['roles'].markAsTouched({ onlySelf: true });
      } else {
        this.addEditSelfRegistrationForm.markAsPristine();
        value.organizationId = this.organizationId;
        this.httpService.save('UrlDetails.$addOrUpdateSelfRegistedUsersUrl', value).subscribe((response) => { // TODO: Vido
          if (response) {
            if (this.mode === 'edit') {
              this._toastCtrl.success('User Self Registration updated successfully');
            } else {
              this._toastCtrl.success('User Self Registration added successfully');
            }

            this._dialogRef.close('saved');
          }
        }, (error) => {
          if (this.mode === 'edit') {
            this._toastCtrl.error(error._body);
          } else {
            this._toastCtrl.error(error._body);
          }
        });
      }
    }
  }

  setEditFormValues (details?: any) {
    this.addEditSelfRegistrationForm.patchValue(details);
  }

  closePopup () {
    this._dialogRef.close();
  }

}
