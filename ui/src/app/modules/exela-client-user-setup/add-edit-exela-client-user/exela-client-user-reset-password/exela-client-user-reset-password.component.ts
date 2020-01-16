import { Component, OnInit, Input, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../../shared/providers/http.service';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { SessionService } from '../../../shared/providers/session.service';
import { StorageService } from '../../../shared/providers/storage.service';
import { UtilitiesService } from '../../../shared/providers/utilities.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-exela-client-user-reset-password-tab',
  templateUrl: './exela-client-user-reset-password.component.html',
  styleUrls: ['./exela-client-user-reset-password.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ExelaClientUserResetPasswordComponent implements OnInit {

  @Input('heading') heading = 'Add User';

  @Input('userId') userId = '';

  @Input('organizationId') organizationId = '';

  @Input('saveButtonTitle') saveBtnTitle = 'Save';

  addEditUserSetupForm: FormGroup;
  showRoleError: Boolean = false;

  editusername: string = '';
  @ViewChild('passwordInput') passwordInputEl: ElementRef;

  constructor (private _router: Router,
        private _fb: FormBuilder,
        public _toastCtrl: ToastrService,
        private _utility: UtilitiesService,
        private httpService: HttpService) {
    this.addEditUserSetupForm = this._fb.group({
      password: new FormControl('', [Validators.required]),
      _id: ''
    });
  }

  ngOnInit (): void {

  }

  saveUserSetup ({ value, valid }: { value: any, valid: boolean }) {
    let user = value;
    user._id = this.userId;
    user.organizationId = this.organizationId;
    user.subject = 'BoxOffice User Password Reset';
    user.from = 'BoxOffice Admin <boxoffice@exelaonline.com>';
    if (!valid) {
      this.addEditUserSetupForm.markAsDirty();

    } else {
      this.addEditUserSetupForm.markAsPristine();

      let encrypted = this._utility.encryptPassword(user.password);
      delete user['password'];
      user['password'] = encrypted['encryptedPassword'].toString();
      user['secrete_key'] = encrypted['secrete_key'];
      user['resetBy'] = 'admin';
      this.httpService.save('UrlDetails.$resetPasswordUrl', user) // TODO: Vido
                .subscribe(response => {
                  this._toastCtrl.success('Password has been reset successfully');
                  this.gotoUserSetup();
                }, error => {
                  if (error.status === 500) {
                    this._toastCtrl.error(error._body);
                  } else {
                    this._toastCtrl.error('Something went wrong');
                  }

                });
    }

  }

  setEditFormValues (details?: any) {
        // this.addEditUserSetupForm.get('username').disable();
    this.addEditUserSetupForm.patchValue(details);
  }

  gotoUserSetup () {
    let base = SessionService.get('base-role');
    this._router.navigate(['/' + base + '/exela-client-user-setup']);
  }

  showPassword () {
    let type = this.passwordInputEl.nativeElement.getAttribute('type');
    if (type === 'password') {
      this.passwordInputEl.nativeElement.setAttribute('type', 'text');
    } else {
      this.passwordInputEl.nativeElement.setAttribute('type', 'password');
    }
  }
}
