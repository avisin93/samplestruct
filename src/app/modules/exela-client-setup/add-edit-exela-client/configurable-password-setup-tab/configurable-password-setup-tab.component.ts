import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../../shared/providers/http.service';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from '../../../shared/providers/session.service';

@Component({
  selector: 'app-configurable-password-setup-tab',
  templateUrl: './configurable-password-setup-tab.component.html',
  styleUrls: ['./configurable-password-setup-tab.component.scss']
})
export class ConfigurablePasswordSetupTabComponent implements OnInit {
  configurablePasswordForm: FormGroup;
  @Input('organizationId') organizationId;
  constructor (private _fb: FormBuilder,
        private _router: Router,
        public _toastCtrl: ToastrService,
        public loaderService: LoaderService,
        public httpService: HttpService) {
    let numberPattern = '^(0|[1-9][0-9]*)$';
    this.configurablePasswordForm = this._fb.group({
      passwordMinLength: new FormControl('',[Validators.required,Validators.pattern(numberPattern)]),
      lowercase: new FormControl(false),
      uppercase: new FormControl(false),
      numbers: new FormControl(false),
      notUserId: new FormControl(false),
      specialCharacters: new FormControl(false),
      forceChangePasswordDays: new FormControl('',[Validators.required,Validators.pattern(numberPattern)]),
      restrictReusePasswordVersions: new FormControl('',[Validators.pattern(numberPattern)]),
      failPasswordAttempts: new FormControl('',[Validators.required,Validators.pattern(numberPattern)]),
      failOtpAttempts: new FormControl('',[Validators.required,Validators.pattern(numberPattern)])
    });
  }

  ngOnInit () {
    this.getPasswordRule();
  }

  getPasswordRule () {
    let req = { id: this.organizationId };
    this.httpService.get(UrlDetails.$exela_getPasswordRulesUrl,req).subscribe(response => {
      if (response) {
        this.configurablePasswordForm.patchValue(response);
      }
    });

    this.configurablePasswordForm.patchValue({ 'failPasswordAttempts': 3 });
    this.configurablePasswordForm.patchValue({ 'failOtpAttempts': 3 });
  }
  updatePasswordRule ({ value, valid }: { value: any, valid: boolean }) {
    if (!valid) {
      this.configurablePasswordForm.markAsDirty();
    } else {
      if (value.forceChangePasswordDays >= 30) {

        if (value.failPasswordAttempts < 3) {
          this._toastCtrl.error('Failed password attempts to block user account should be atleast 3');
        } else if (value.failOtpAttempts < 3) {
          this._toastCtrl.error('Failed OTP attempts to block user account should be atleast 3');
        } else {

          if (value.restrictReusePasswordVersions === '' || value.restrictReusePasswordVersions === undefined || value.restrictReusePasswordVersions == null) {
            value.restrictReusePasswordVersions = '';
          }
          if (value.failPasswordAttempts === '' || value.failPasswordAttempts === undefined || value.failPasswordAttempts == null) {
            value.failPasswordAttempts = 3;
          }

          if (value.failOtpAttempts === '' || value.failOtpAttempts === undefined || value.failOtpAttempts == null) {
            value.failOtpAttempts = 3;
          }

          let req = { id: this.organizationId,passwordRules: value };
          this.loaderService.show();
          this.httpService.get(UrlDetails.$exela_updatePasswordRulesUrl, req).subscribe(response => {
            this._toastCtrl.success('Password rules updated successfully');
            this.loaderService.hide();
          }, function () {
            this._toastCtrl.error('Something went wrong');
            this.loaderService.hide();
          });
        }
      } else {
        this._toastCtrl.error('Force to change password days should be atleast 30');
      }
    }
  }

  gotoClientSetup () {
    let base = SessionService.get('base-role');
    this._router.navigate(['/' + base + '/exela-client-setup']);
  }

}
