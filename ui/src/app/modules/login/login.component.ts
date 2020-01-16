import { Component, Input, OnInit, HostListener, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { ToastrService } from 'ngx-toastr';
import { trigger, style, animate, transition } from '@angular/animations';
import { NgModel, FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, NgForm } from '@angular/forms';
import { StorageService } from '../shared/providers/storage.service';
import { LoaderService } from '../shared/components/loader/loader.service';
import { isEmptyString, getErrorMessage, numberWithMaxLength } from '../utilsValidation';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ErrorStateMatcher } from '@angular/material/core';
import { UrlDetails } from 'src/app/models/url/url-details.model';
import { UtilitiesService } from '../shared/providers/utilities.service';

export class EqualErrorStateMatcher implements ErrorStateMatcher {
  isErrorState (control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('panelInOut', [
      transition('void => *', [
        style({ transform: 'translateX(100%)' }),
        animate(200)
      ])
    ])
  ]
})
export class LoginComponent implements OnInit {

  inputControl = new FormControl('', [Validators.required]);
  matcher = new EqualErrorStateMatcher();
  myGroup: FormGroup;
  newPassFormGroup: FormGroup;
  @ViewChild('passwd') passwdInput: ElementRef;

  ngOnInit () {
    this.initializeForm();
  }

  ngAfterViewInit () {
    this.passwdInput.nativeElement.focus();
    this.cd.detectChanges();
  }

  initializeForm () {
    if (this.myGroup) {
      this.myGroup.reset();
    }
    this.myGroup = new FormGroup({
      digitFormControlName1: new FormControl('', [Validators.required, numberWithMaxLength(1), Validators.pattern('^[0-9]+$')]),
      digitFormControlName2: new FormControl('', [Validators.required, numberWithMaxLength(1), Validators.pattern('^[0-9]+$')]),
      digitFormControlName3: new FormControl('', [Validators.required, numberWithMaxLength(1), Validators.pattern('^[0-9]+$')]),
      digitFormControlName4: new FormControl('', [Validators.required, numberWithMaxLength(1), Validators.pattern('^[0-9]+$')]),
      digitFormControlName5: new FormControl('', [Validators.required, numberWithMaxLength(1), Validators.pattern('^[0-9]+$')]),
      digitFormControlName6: new FormControl('', [Validators.required, numberWithMaxLength(1), Validators.pattern('^[0-9]+$')])
    });
  }

  showLoginUsername: boolean = true;
  showPasswordOTPLoginForgot: boolean = false;
  showOtpLoginInfo: boolean = false;

  passwordRuleText: String;

  showPassword: boolean;
  showNewPassword: boolean;
  showConfirmNewPassword: boolean;
  rememberMe: boolean = false;
  digit1;
  digit2;
  digit3;
  digit4;
  digit5;
  digit6;

  temp: NgModel;

  nameOfPerson: string = 'User';
  @Input() usernameOTP: string;
  @Input() passwordOTP: string;
  @Input() username: string;
  @Input() password: string;

  constructor (
    private router: Router,
    private loginService: LoginService,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    private httpClient: HttpClient,
    private cd: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private _utility: UtilitiesService
    ) {
    this.showPassword = false;
    this.newPassFormGroup = this.formBuilder.group({
      newPassword: new FormControl('',[Validators.required]),
      confirmNewPassword: new FormControl('',[Validators.required])
    },{ validator: this.checkPasswords });
  }

  checkPasswords (group: FormGroup) {
    let pass = group.controls.newPassword.value;
    let confirmPass = group.controls.confirmNewPassword.value;

    return pass === confirmPass ? null : { notSame: true };
  }

  login () {
    if (!isEmptyString(this.password)) {
      this.loaderService.show();
      if (this.rememberMe) {
        StorageService.set(StorageService.rememberMeUserName, this.username);
        StorageService.set(StorageService.rememberMePassword, this.password);
      } else {
        StorageService.remove(StorageService.rememberMeUserName);
        StorageService.remove(StorageService.rememberMePassword);
      }
      const encryptedPassword = this._utility.encryptPassword(this.password);
      const userData = {
        accessToken: '',
        username: this.username,
        password: encryptedPassword['encryptedPassword'].toString(),
        secrete_key: encryptedPassword['secrete_key']
      };
      this.loginService.postLoginExelaAuthAPIs(UrlDetails.$exela_loginUrl, userData).subscribe((response: any) => {
        StorageService.set(StorageService.userName, response.username);
        StorageService.set(StorageService.exelaAuthToken, response.token);
        if (typeof response.token !== undefined && response.token !== null && response.token !== '') {
          this.getBasicUserInfo();
        } else {
          this.toastr.error('Invalid User');
          this.loaderService.hide();
        }
      }, error => {
        if (error.status === 401) {
          this.toastr.error('Error','Invalid Username/Password');
        } else if (error.status === 402) {
          this.toastr.error('Error', error.error.message);
        } else {
          this.toastr.error(`Error with ExelaAuth ${error.status}: ${error.error.message}`);
        }
        this.loaderService.hide();
      });
    } else {
      this.toastr.error('Password not entered','Must Enter Password!');
    }
  }

  getBasicUserInfo () {
    this.loginService.postLoginExelaAuthAPIs(UrlDetails.$exela_getBasicInfoUrl, { username: this.username }).subscribe((response: any) => {
      StorageService.set(StorageService.organizationId, response.organizationId);
      StorageService.set(StorageService.userId, response.userId);
      if (response.roles && response.roles.length === 0) {
        this.loaderService.hide();
        this.toastr.error('Login error', 'User has no permission / no assigned role.');
      } else {
        this.loaderService.hide();
        StorageService.set(StorageService.userName, response.userName);
        StorageService.set(StorageService.userModules, JSON.stringify(response.modules));
        StorageService.set(StorageService.firstName, response.firstName);
        StorageService.set(StorageService.lastName, response.lastName);
        StorageService.set(StorageService.lastLoginDate, new Date());
        StorageService.set(StorageService.profilePhoto, response.profilePhoto);
        StorageService.set(StorageService.userEmail, response.userEmail);
        StorageService.set(StorageService.userId, response.userId);
        StorageService.set(StorageService.userRole, response.userRole);
        StorageService.set(StorageService.userRoles, JSON.stringify(response.roles));
        StorageService.set(StorageService.organizationId, response.organizationId);
        StorageService.set(StorageService.organizationName, response.organizationName);
        StorageService.set(StorageService.organizationCode, response.organizationCode);
        let role;
        if (response.roles.find(x => x.roleName === 'CLIENTADMIN')) {
          StorageService.set(StorageService.userRole, 'CLIENTADMIN');
          role = response.roles.find(x => x.roleName === 'CLIENTADMIN');
        } else {
          const displayRole = response.roles[0].roleName;
          StorageService.set(StorageService.userRole, displayRole);
          role = response.roles[0];
        }
        this.navigateAfterLogin(response, role);
      }
    }, error => {
      if (error.status === 401) {
        this.loaderService.hide();
        this.toastr.error('Wrong Password', `Invalid username/password ${error.error.message}`);
      } else {
        this.loaderService.hide();
        this.toastr.error('Server Error', `Exela Auth is not available at moment ${error.error.message}`);
      }
    });
  }

  async navigateAfterLogin (basicUserInfoResponse, role) {
    if (basicUserInfoResponse.modules.length > 1 || this.hasMultipleProjects(basicUserInfoResponse)) {
      this.router.navigate(['/home']).then(nav => {
        console.log(nav);
      }, err => {
        console.log(err);
      });
    } else if (basicUserInfoResponse.modules[0].productName) {
      let headers = new HttpHeaders();
      headers = headers.append('Authorization', 'Bearer ' + StorageService.get(StorageService.exelaAuthToken));
      await this.httpClient.post(`${UrlDetails.$exelaGetRoleUrl}/${role.roleId}`, undefined, { headers: headers, observe: 'response' }).toPromise().
      then(async (response2: any) => {
        if (response2.status === 401) {
          this.loaderService.hide();
          this.toastr.error('Wrong credentials', 'Invalid data or your account has been blocked');
        } else if (response2.status === 200) {
          const pom: any = basicUserInfoResponse.modules[0];
          pom.menus = response2.body.menus;
          StorageService.set(StorageService.selectedProduct, JSON.stringify(pom));
        } else {
          this.loaderService.hide();
          this.toastr.error('Server Error', 'Exela Auth is not available at moment');
        }
      });
      if (basicUserInfoResponse.modules[0].menus[0] && basicUserInfoResponse.modules[0].menus[0].link) {
        if (basicUserInfoResponse.roles[0].projects.length > 0) {
          const projectCode = basicUserInfoResponse.roles[0].projects[0].code;
          const projectId = basicUserInfoResponse.roles[0].projects[0]._id;
          StorageService.set(StorageService.projectCode, projectCode);
          StorageService.set(StorageService.projectId, projectId);
        } else {
          console.warn('Project Code not set in local storage');
        }
        const menuNumber = (role.roleName === 'CLIENTADMIN' && basicUserInfoResponse.modules[0].menus[1] !== undefined ? 1 : 0);
        this.router.navigate(['/' + basicUserInfoResponse.modules[0].productName.toLowerCase() + '/' + basicUserInfoResponse.modules[0].menus[menuNumber].link]).then(nav => {},
            err => {
              this.toastr.error('Invalid Menu Link');
              console.error(err);
              return;
            });
      } else {
        this.toastr.error('No menu assigned to user');
        return;
      }
    } else {
      this.router.navigate(['/admin/' + basicUserInfoResponse.modules[0].menus[0].link]).then(nav => {
        console.log(nav);
      }, err => {
        console.log(err);
      });
    }
  }

  hasMultipleProjects (basicUserInfoResponse) {
    let projects = [];
    basicUserInfoResponse.roles.forEach((role) => {
      role.projects.forEach(item => {
        if (projects.indexOf(item._id) === -1) {
          projects.push(item._id);
        }
      });
    });
    return projects.length > 1;
  }

  async next (username) {
    if (!isEmptyString(username)) {
      this.showLoginUsername = false;
      this.showPasswordOTPLoginForgot = true;
      this.nameOfPerson = username;
    } else {
      this.toastr.error('User name not entered','Must Enter User Name');
    }
  }

  async otpLoginForm () {
    let response = await this.loginService.getOtpPassword(this.username);
    response.subscribe((response: any) => {
      if (response.includes('Please check your email/phone for OTP for user')) {
        this.showPasswordOTPLoginForgot = false;
        this.showOtpLoginInfo = true;
        this.toastr.success('Please check your mailbox', 'OTP sent');
      } else {
        this.toastr.error('Wrong OTP','Try again');
      }
    });
  }

  goBack () {
    if (this.showOtpLoginInfo) {
      this.showOtpLoginInfo = false;
      this.showPasswordOTPLoginForgot = true;
      return;
    }
    if (this.showPasswordOTPLoginForgot) {
      this.showPasswordOTPLoginForgot = false;
      this.showLoginUsername = true;
      return;
    }
  }

  loginWithOtp () {
    if (this.isNumbersCorrect() === false) {
      this.toastr.error('Please enter OTP');
      return;
    }
    let token = this.myGroup.get('digitFormControlName1').value + this.myGroup.get('digitFormControlName2').value +
                this.myGroup.get('digitFormControlName3').value + this.myGroup.get('digitFormControlName4').value +
                this.myGroup.get('digitFormControlName5').value + this.myGroup.get('digitFormControlName6').value;
    const encryptedPassword = this._utility.encryptPassword(this.password);
    const userData = {
      accessToken: '',
      username: this.username,
      password: encryptedPassword['encryptedPassword'].toString(),
      secrete_key: encryptedPassword['secrete_key'],
      token: token
    };
    this.loginService.postLoginExelaAuthAPIs(UrlDetails.$exela_OTPLoginUrl, userData).subscribe((response: any) => {
      StorageService.set(StorageService.userName, response.username);
      StorageService.set(StorageService.exelaAuthToken, response.token);
      if (typeof response.token !== undefined && response.token !== null && response.token !== '') {
        this.getBasicUserInfo();
      } else {
        this.toastr.error('Invalid User');
        this.loaderService.hide();
      }
    }, error => {
      if (error.status === 401) {
        this.loaderService.hide();
        this.toastr.error('Try again', `Wrong OTP`);
        return;
      } else {
        this.loaderService.hide();
        this.toastr.error(`Server Error ${error.error.message}`);
        return;
      }
    });
  }

  keyUp (field,value,_event) {
    if (this.myGroup.get(value) === undefined || this.myGroup.get(value).value.length > 1) {
      return;
    }
    if (_event.key === 'Tab' || _event.key === 'Backspace' || _event.key === 'Delete') {
      return;
    }
    if (document.getElementById(field)) {
      document.getElementById(field).focus();
    }
  }

  getErrorMessage (field: FormControl, customMsg?: JSON): string {
    if (field.touched) {
      return getErrorMessage(field, customMsg);
    }
  }

  hidePassword (fieldName) {
    switch (fieldName) {
      case 'password': this.showPassword = false;break;
      case 'newPassword': this.showNewPassword = false;break;
      case 'confirmNewPassword': this.showConfirmNewPassword = false;break;
    }
  }

  showText (fieldName) {
    switch (fieldName) {
      case 'password': this.showPassword = true;break;
      case 'newPassword': this.showNewPassword = true;break;
      case 'confirmNewPassword': this.showConfirmNewPassword = true;break;
    }
  }

  isNumbersCorrect (): boolean {
    let disabled = true;
    for (let control of Object.keys(this.myGroup.controls)) {
      if (this.myGroup.get(control).invalid) {
        disabled = false;
      }
    }
    return disabled;
  }

  validate (): boolean {
    let validate = true;
    Object.keys(this.newPassFormGroup.controls).forEach(key => {
      this.newPassFormGroup.get(key).markAsTouched();
      if (this.newPassFormGroup.get(key).invalid) {
        validate = false;
      }
    });
    return validate;
  }

  private markFormGroupTouched (formGroup: FormGroup) {
    (Object as any).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  @HostListener('document:keydown.enter', ['$event']) handleUsername (evt: KeyboardEvent) {
    if (this.showLoginUsername) {
      this.next(this.username);
    } else if (this.showPasswordOTPLoginForgot) {
      this.login();
    }
  }
}
