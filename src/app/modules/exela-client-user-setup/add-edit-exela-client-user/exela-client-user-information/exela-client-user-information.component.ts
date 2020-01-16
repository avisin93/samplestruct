import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../../shared/providers/http.service';
import { Pattern } from '../../../../models/util/pattern.model';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { SessionService } from '../../../shared/providers/session.service';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { UtilitiesService } from '../../../shared/providers/utilities.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-exela-client-user-information-tab',
  templateUrl: './exela-client-user-information.component.html',
  styleUrls: ['./exela-client-user-information.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ExelaClientUserInformationComponent implements OnInit {

  @Input('heading') heading = 'Add User';

  @Input('userId') userId = '';

  @Input('organizationId') organizationId = '';
  action: any;
  @Input('mode') set mode (value) {
    if (value) {
      this.action = value;
      this.createForm();
    }
  }

  @Input('saveButtonTitle') saveBtnTitle = 'Save';

  addEditUserSetupForm: FormGroup;
  showRoleError: Boolean = false;
  userAttributes = [];

  userTypes = [
        { value: 'SUPER_ADMIN', text: 'Super Admin' }
        /*        {value: 'SUPER_ADMIN', text: 'Super Admin'},
                {value: 'SUPER_ADMIN', text: 'Super Admin'},
                {value: 'SUPER_ADMIN', text: 'Super Admin'}*/
  ];

  skillTypes = [
        { value: 'test-1', text: 'Training' },
        { value: 'test-2', text: 'Test 2' },
        { value: 'test-3', text: 'Test 3' }
  ];

  clients = [
        { value: 'test-1', text: 'BOA1' },
        { value: 'test-2', text: 'BOA2' },
        { value: 'test-3', text: 'BOA3' }
  ];

  assignQueues = [
        { value: 'test-1', text: 'Test 1' },
        { value: 'test-2', text: 'Test 2' },
        { value: 'test-3', text: 'Test 3' }
  ];

  roles = [];
  userList = [];
  editusername: string = '';
  userDetails: any;
  constructor (private _router: Router,
        private _fb: FormBuilder,
        public _toastCtrl: ToastrService,
        private loaderService: LoaderService,
        private _utility: UtilitiesService,
        private httpService: HttpService) {

  }

  ngOnInit (): void {
    this.getAllRoles();
    this.getAllUsers();
    this.setPasswordRules();
  }

  createForm () {
    const EMAIL_REGEX = Pattern.EMAIL_PATTERN;
    const NUMBER_REGEX = Pattern.ONLY_NUMBER_PATTERN;
    const CHARACTER_REGEX = Pattern.ONLY_CHARACTERS;
    const ALPHA_NUMERIC_WITH_DOT = Pattern.ALPHA_NUMERIC_WITH_DOT;

    this.addEditUserSetupForm = this._fb.group({
      username: new FormControl('', [Validators.required, Validators.pattern(ALPHA_NUMERIC_WITH_DOT)]),
      password: new FormControl('', [Validators.required]),
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      skillType: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)]),
      phoneNumber: new FormControl(''),
      client: new FormControl(''),
      loginAttempts: new FormControl(''),
      passwordExpired: new FormControl(''),
      mustChangePassword: new FormControl(false),
      resetPassword: new FormControl(false),
      isAdmin: new FormControl(false),
      allowEmail: new FormControl(false),
      roles: new FormControl('', [Validators.required]),
      assignQueue: new FormControl(''),
      parentUserId: new FormControl(''),
      _id: '',
      forceChangePassword: new FormControl('')
    });
    if (this.action === 'edit') {
      this.addEditUserSetupForm.controls['password'].setValidators(null);
            // this.addEditUserSetupForm.removeControl('password');
    }
  }
  getUserProfile () {
    let reqData = {
      userId: this.userId
    };
    this.httpService.get(UrlDetails.$exela_getUserByUserIdUrl, reqData).subscribe((response) => {
      let tmpRoles = [];
      response.roles.forEach((role) => {
        tmpRoles.push(role.roleId);
      });
      delete response.roles;
      response['roles'] = tmpRoles;
      this.userDetails = JSON.parse(JSON.stringify(response));
      this.setEditFormValues(response);
      this.loaderService.hide();
    }, (error) => {
      this.loaderService.hide();
      if (error.status === 400) {
        this._toastCtrl.error('Unauthorized profile access');
      }
    });
  }

  getAllRoles () {
    this.loaderService.show();
    let organizationId = this.organizationId;
    this.httpService.get(UrlDetails.$exela_getClientRolesUrl, { organizationId: organizationId }).subscribe((response) => {
      let tmpRoles = [];
      response.forEach((role) => {
        if (role.active === true) {
          tmpRoles.push({ value: role._id, text: role.roleName });
        }
      });
      this.roles = tmpRoles;
      if (this.userId) {
        this.getUserProfile();
      } else {
        this.loaderService.hide();
      }
    }, (error) => {
      this.loaderService.hide();
      if (error.status === 400) {
        this._toastCtrl.error('Unauthorized profile access');
      }
    });

  }

  getAllUsers () {
    this.httpService.get(UrlDetails.$exela_getAllClientUsersUrl + this.organizationId, {}).subscribe(response => {
      response.forEach((user) => {
        this.userList.push({
          _id: user._id,
          fullname: user.firstname + ' ' + user.lastname
        });
      });
    }, () => {
    });
  }
  saveUserSetup ({ value, valid }: { value: any, valid: boolean }) {

    let user = value;
    let isAttrExist = false;

    if (this.userDetails && this.userDetails.userAttributes) {
      let isForceChangePasswordUpdated;
      for (let attr of this.userDetails.userAttributes) {
        if (attr.att_name === 'forceChangePassword') {
          let changedValue = value.forceChangePassword;

          if (attr.att_value !== changedValue.toString() && changedValue.toString() === 'true') {
            isForceChangePasswordUpdated = true;
          } else {
            isForceChangePasswordUpdated = false;
          }

          attr.att_value = value.forceChangePassword ? value.forceChangePassword : false;
          isAttrExist = true;
          break;
        }
      }
      if (!isAttrExist) {
        this.userDetails.userAttributes.push(
          {
            _id: '',
            att_name: 'forceChangePassword',
            att_value: value.forceChangePassword ? value.forceChangePassword : false
          }
                );
      }

      let isSecondAttrExist = false;
      if (isForceChangePasswordUpdated) {
        for (let attr of this.userDetails.userAttributes) {
          if (attr.att_name === 'isPasswordResetInitialy') {
            if (attr.att_value === 'true') {
              attr.att_value = false;
            }
            isSecondAttrExist = true;
            break;
          }
        }

        if (!isSecondAttrExist) {
          this.userDetails.userAttributes.push(
            {
              _id: '',
              att_name: 'isPasswordResetInitialy',
              att_value: false
            }
                    );
        }
      } else {
        let isExist = false;
        for (let attr of this.userDetails.userAttributes) {
          if (attr.att_name === 'isPasswordResetInitialy') {
            attr.att_value = false;
            isExist = true;
            break;
          }
        }

        if (!isExist && isForceChangePasswordUpdated === undefined) {
          this.userDetails.userAttributes.push(
            {
              _id: '',
              att_name: 'isPasswordResetInitialy',
              att_value: false
            }
                    );
        }
      }

    }

    user.userAttributes = this.userDetails && this.userDetails.userAttributes ? this.userDetails.userAttributes
            : [{
              att_value: value.forceChangePassword ? value.forceChangePassword : false,
              att_name: 'forceChangePassword'
            }];
    user._id = this.userId;
        /* if (this.action === 'add') {
            if (user.password.trim() == "") {
                this._toastCtrl.errorToast("Password is required.");
            }
        } */
    if (!valid) {
      this.addEditUserSetupForm.markAsDirty();
      if (value.roles === '') {
        this.showRoleError = true;
        this.addEditUserSetupForm.controls['roles'].markAsTouched({ onlySelf: true });
      }
    } else {
      this.addEditUserSetupForm.markAsPristine();
      let organizationId = this.organizationId;
      user.organizationId = organizationId;
      this.loaderService.show();
      if (this.userId) {
        this.httpService.save(UrlDetails.$exela_updateUserUrl, user)
                    .subscribe(response => {
                      this.loaderService.hide();
                      this._toastCtrl.success('User updated successfully');
                      this.gotoUserSetup();
                    }, error => {
                      this.loaderService.hide();
                      if (error.status === 400) {
                        this._toastCtrl.error(error.error);
                      } else {
                        this._toastCtrl.error('Something went wrong');
                      }

                    });
      } else {

        let roles = [];
        for (let roleId of user.roles) {
          roles.push({ 'roleId': roleId });
        }
        user.roles = roles;
        console.log(user.password);
        // let encrypted = this._utility.encryptPassword(user.password);
        // delete user['password'];
        // user['password'] = encrypted['encryptedPassword'].toString();
        // user['secrete_key'] = encrypted['secrete_key'];
        // TODO: Vido
        console.log(user);
        this.httpService.save(UrlDetails.$exela_registerUserUrl, user)
                    .subscribe(response => {
                      this.loaderService.hide();
                      this._toastCtrl.success('User added successfully');
                      this.gotoUserSetup();
                        // this.addMailRecipients(user);
                    }, error => {
                      this.loaderService.hide();
                      if (error.status === 400) {
                        this._toastCtrl.error(error.error);
                      } else {
                        this._toastCtrl.error('Something went wrong');
                      }
                    });
      }

    }
  }

  addMailRecipients (user) {
    let newUser = JSON.parse(JSON.stringify(user));
    let reqObj = [{
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      email: newUser.email,
      organizationId: newUser.organizationId,
      active: true,
      username: newUser.username,
      password: newUser.password
    }];
    this.httpService.save('UrlDetails.$addMailRecipient', reqObj) // TODO: Vido
            .subscribe((response) => {
              console.log(response);
            });
  }

  setEditFormValues (details?: any) {
        // this.addEditUserSetupForm.get('username').disable();
    this.userAttributes = details.userAttributes;
    this.addEditUserSetupForm.patchValue(details);
    this.editusername = this.addEditUserSetupForm.get('username').value;
    for (let userAtt of details.userAttributes) {
      if (userAtt.att_name === 'forceChangePassword') {
        this.addEditUserSetupForm.controls['forceChangePassword'].setValue(userAtt.att_value === 'true' ? true : false);
        break;
      }
    }
  }

  gotoUserSetup () {
    let base = SessionService.get('base-role');
    this._router.navigate(['/' + base + '/exela-client-user-setup']);
  }

  setPasswordRules () {
    this.httpService.get(UrlDetails.$exela_getPasswordRulesUrl, { id: this.organizationId }).subscribe((response) => {
      let pattern = this.generatePasswordPattern(response);
      console.log('pattern',pattern);
    });
  }
  generatePasswordPattern (passwordRules) {
    let passWordRulePattern = '';
    let passwordMessage = 'password must be contain ';
    let passwordMessages = [];
    let passwordReg = {
      specialCharacters: { pattern: '(?=.*[!@#\$ %\^&\*])',message: 'special charater' },
      numbers: { pattern: '(?=.*[0 - 9])',message: 'number' },
      uppercase: { pattern: '(?=.*[A - Z])',message: 'uppercase letter' },
      lowercase: { pattern: '(?=.*[a - z])',message: 'lowercase letter' }
    };
    if (passwordRules) {
      delete passwordRules.passwordMinLength;
      delete passwordRules.forceChangePasswordDays;
      delete passwordRules.restrictReusePasswordVersions;
      delete passwordRules.failPasswordAttempts;
      for (let passwordRule in passwordRules) {
        if (passwordRules[passwordRule]) {
          passWordRulePattern += passwordReg[passwordRule].pattern;
          passwordMessages.push(passwordReg[passwordRule].message);
        }
      }
      passwordMessages.forEach((message,index) => {
        if (passwordMessages.length !== 1) {
          passwordMessage += (index === passwordMessages.length - 1) ? ' and ' + message + '.' : message + ((index !== passwordMessages.length - 2) ? ',' : '');
        } else {
          passwordMessage += message + '.';
        }

      });

      if (passWordRulePattern.length > 0) {
        passWordRulePattern = '^' + passWordRulePattern;
        return { pattern: passWordRulePattern,message: passwordMessage };
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
}
