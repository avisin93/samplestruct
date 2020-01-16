import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, AbstractControl, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { getErrorMessage } from 'src/app/modules/utilsValidation';
import { Pattern } from '../../../../models/util/pattern.model';
import { StorageService } from '../../providers/storage.service';
import { UtilitiesService } from '../../providers/utilities.service';
import { UrlDetails } from 'src/app/models/url/url-details.model';
import { HttpService } from '../../providers/http.service';

@Component({
  selector: 'cm-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  formGroup: FormGroup;

  showCurrentPassword: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
  passwordRuleText: String;

  constructor (
        public dialogRef: MatDialogRef<ChangePasswordComponent>,
        private toastr: ToastrService,
        private _utility: UtilitiesService,
        private httpService: HttpService
  ) {}

  matchConfirmPassword (abstractControl: AbstractControl) {
    const password = abstractControl.get('newPassword').value;
    const confirmPassword = abstractControl.get('confirmNewPassword').value;
    if (password !== null && confirmPassword !== null && password !== confirmPassword) {
      abstractControl.get('confirmNewPassword').setErrors({
        matchPassword: true
      });
    } else {
      return null;
    }
  }

  ngOnInit () {
    this.initializeForm();
  }

  async initializeForm () {
    this.formGroup = new FormGroup({
      currentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required]),
      confirmNewPassword: new FormControl('', [Validators.required])
    });
    this.formGroup.setValidators(this.matchConfirmPassword);

    let passwordRules: any;
    await this.httpService.saveAndReturnObserve(UrlDetails.$exela_getClientUrl + '/' + StorageService.get(StorageService.organizationId),
     {}).toPromise().then((responseOrg: any) => {
       if (responseOrg && responseOrg.status === 200) {
         passwordRules = responseOrg.body[0].passwordRules;
       } else if (responseOrg && responseOrg.status === 502) {
         this.toastr.error('Exela Auth', 'Exela Auth is unavailable at the moment.');
       } else {
         this.toastr.error('Error', 'Error occured.');
       }
     }).catch(error => console.log(error));
    if (passwordRules) {
      console.log('imaRule');
      this.passwordRuleText = 'Password should contain ' + (passwordRules.passwordMinLength ? 'minimum length of ' + passwordRules.passwordMinLength + ',' : '') +
        (passwordRules.lowercase ? (passwordRules.passwordMinLength ? ' ' : '') + '1 charachter of lowercase,' : '') +
        (passwordRules.uppercase ? (passwordRules.lowercase || passwordRules.passwordMinLength ? ' ' : '') + '1 character of upercase,' : '') +
        (passwordRules.numbers ? (passwordRules.lowercase || passwordRules.passwordMinLength || passwordRules.uppercase ?
            ' ' : '') + '1 number' : '') +
        (passwordRules.specialCharacters ? (passwordRules.upercase || passwordRules.lowercase || passwordRules.numbers
          || passwordRules.passwordMinLength ? ' and ' : '') + '1 character of special characters(!@#$%^&).' : '');

      let validator = '^' + (passwordRules.lowercase ? '(?=.*[a-z])' : '') +
                      (passwordRules.uppercase ? '(?=.*[A-Z])' : '') +
                      (passwordRules.numbers ? '(?=.*[0-9])' : '') +
                      (passwordRules.specialCharacters ? '(?=.*[!@#$%^&])' : '') +
                      (passwordRules.passwordMinLength ? '.{' + passwordRules.passwordMinLength + ',}' : '') +
                      '$';
      this.formGroup.get('newPassword').setValidators(Validators.pattern(validator));
      this.formGroup.get('confirmNewPassword').setValidators(Validators.pattern(validator));
    } else {
      document.getElementsByClassName('mat-dialog-container')[0].setAttribute('style','height: 359px !important;width:500px;');
    }
  }

  updatePassword () {
    if (!this.validate()) {
      this.formGroup.markAsDirty();
    } else {
      this.formGroup.markAsPristine();
      const data = {
        loginName:  StorageService.get(StorageService.userName),
        accessToken: StorageService.get(StorageService.rdhAccessToken),
        organizationId: !(StorageService.get(StorageService.organizationId) === 'undefined' || StorageService.get(StorageService.organizationId) === 'null')
        ? StorageService.get(StorageService.organizationId) : null
      };

      const encryptedNewPassword = this._utility.encryptPassword(this.formGroup.get('newPassword').value);
      data['newPassword'] = encryptedNewPassword['encryptedPassword'].toString();
      data['secrete_key'] = encryptedNewPassword['secrete_key'];

      const encryptedOldPassword = this._utility.encryptPassword(this.formGroup.get('currentPassword').value);
      data['oldPassword'] = encryptedOldPassword['encryptedPassword'].toString();
      data['old_secrete_key'] = encryptedOldPassword['secrete_key'];

      this.httpService.save(UrlDetails.$exela_changePasswordUrl, data).subscribe(response => {
        this.toastr.success(response.message);
        this.dialogRef.close();
      }, error => {
        if (error.status === 400) {
          this.toastr.error(error.error);
        }
      });
    }
  }

  hidePassword (value) {
    switch (value) {
      case 'current': this.showCurrentPassword = false; break;
      case 'new': this.showNewPassword = false; break;
      case 'newConfirm': this.showConfirmPassword = false; break;
      default: break;
    }
  }

  showText (value) {
    switch (value) {
      case 'current': this.showCurrentPassword = true; break;
      case 'new': this.showNewPassword = true; break;
      case 'newConfirm': this.showConfirmPassword = true; break;
      default: break;
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
