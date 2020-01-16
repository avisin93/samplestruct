/** 1.Import third party components
2. Import created modules
3. Import crated services
4. Import created classes
5. Import created constants **/
import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider,
  AuthService
} from 'angular5-social-login';
import { CustomValidators } from 'ng2-validation';
import { Md5 } from 'ts-md5/dist/md5';
import * as _ from 'lodash';
import { SharedData } from '@app/shared/shared.data';
import { SharedService } from '@app/shared/shared.service';
import { TranslatorService } from '@app/core/translator/translator.service';
import { LoginService } from './login.service';
import { NavigationService, Common, SessionService, TriggerService, EncriptionService } from '@app/common';
import { SettingsService } from '@app/core/settings/settings.service';
import {
  ROUTER_LINKS_FULL_PATH, ROLES_CONST, COOKIES_CONSTANTS, LOCAL_STORAGE_CONSTANTS, LANGUAGE_CODES, DEFAULT_LANGUAGE, URL_PATHS, ROLES, EVENT_TYPES, ROLE_PERMISSION_KEY
} from '@app/config';
import { RolePermission } from '@app/shared/role-permission';

import { Subscription } from 'rxjs/Subscription';
import { TokenService } from '@app/common/services/token.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [LoginService]
})
export class LoginComponent implements OnInit {
  /*declare variables above constructor in sequence -imported constants,public variable,private variables*/
  userInfo: any;
  ROUTER_LINKS_FULL_PATH = ROUTER_LINKS_FULL_PATH;
  commonLocaleObj: any;
  valForm: FormGroup;
  selectedLang: any;
  validUserAccounts = [];
  rolePermissionModuleMultipleArr = [];
  isIncorrectCredentials: Boolean = false;
  landingPage: any;
  authError: Boolean = false;
  user: any;
  errorMessage: String;
  LANGUAGE_CODES = LANGUAGE_CODES;
  roleData: any;
  roleJsonURL: any;
  rolePermissionArr: any = [];
  landingModuleId: any;
  subscription: Subscription;
  /*declare variables above constructor in sequence -imported constants,public variable,private variables*/

  /*inicialize contructor after declaration of all variables*/

  constructor(
    public translatorService: TranslatorService,
    public settings: SettingsService,
    private fb: FormBuilder,
    public translator: TranslatorService,
    private _loginService: LoginService,
    private sharedData: SharedData,
    private socialAuthService: AuthService,
    private loginService: LoginService,
    private sessionService: SessionService,
    public _rolePermission: RolePermission,
    private tokenService: TokenService,
    private router: Router,
    private triggerService: TriggerService,
    private _encriptionService: EncriptionService,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private sharedService: SharedService
  ) {
    
  }
  /*instantiate contructor after declaration of all variables*/

  /*all life cycle events whichever required after inicialization of constructor*/
  ngOnInit() {
    if (this.tokenService.checkUserToken()) {
      if (this.sessionService.getLocalStorageItem(LOCAL_STORAGE_CONSTANTS.landingPage)) {
        this.router.navigate([this.sessionService.getLocalStorageItem(LOCAL_STORAGE_CONSTANTS.landingPage)]);
      } else {
        this.router.navigate([ROUTER_LINKS_FULL_PATH.dashboard]);
      }
    } else {
      this.sessionService.deleteCookie(COOKIES_CONSTANTS.authToken);
      this.sessionService.removeSessionItem(COOKIES_CONSTANTS.authToken);
    }
    this.createForm();
    this._rolePermission.spinnerFlag = false;
    this.setLocaleObj();
    this.selectedLang = this.sessionService.getCookie(COOKIES_CONSTANTS.langCode);
    this.translatorService.useLanguage(this.selectedLang);
  }


  setLocaleObj() {
    this.translateService.get('common').subscribe(res => {
      this.commonLocaleObj = res;
    });

  }

  /*all life cycle events whichever required after inicialization of constructor*/

  /*user defined functions/methods after life cycle events in sequence-public methods,private methods*/

  /*method to create login form*/
  createForm() {
    this.valForm = this.fb.group({
      'email': [null, Validators.compose([Validators.required, CustomValidators.email])],
      // 'password': [null, [Validators.required,CustomValidators.checkPassword]]
      'password': [null, [Validators.required]]
    });

  }


  submitForm() {
    this._rolePermission.spinnerFlag = true;
    // tslint:disable-next-line:forin
    for (const c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }
    const formvalue = this.valForm.value;
    if (this.valForm.valid) {
      const hash = Md5.hashStr(formvalue.password);
      const email = formvalue.email.toLowerCase();
      const userData = { 'emailId': email.toLowerCase().trim(), 'password': hash };
      this._loginService.validateUserData(userData).subscribe((result: any) => {
        this.checkAndRouteUser(result.payload, result.header);
      },
      error => {
        this._rolePermission.spinnerFlag = false;
        this.toastrService.clear();
        this.toastrService.error(this.commonLocaleObj.errorMessages.error);
      });
    }
    else {
      let target;
      for (const i in this.valForm.controls) {
        if (!this.valForm.controls[i].valid) {
          target = this.valForm.controls[i];
          break;
        }
      }
      if (target) {
        
        const el = $('.ng-invalid:not(form):first');
        $('html,body').animate({ scrollTop: (el.offset().top - 100) }, 'slow', () => {
          el.focus();
        });
      }
      this._rolePermission.spinnerFlag = false;
    }

  }

  /*method to check user authorization*/
  checkUser() {
    this.sessionService.setCookie(COOKIES_CONSTANTS.authToken, 'dashboard');
    return true;
  }

  /*method to set language of application*/
  setLanguage(value) {
    this.selectedLang = value;
    this.sessionService.setCookie(COOKIES_CONSTANTS.langCode, value);
    this.sessionService.setLocalStorageItem(LOCAL_STORAGE_CONSTANTS.langCode, value);
    this.translatorService.useLanguage(value);
  }

  checkAndRouteUser(result, header) {
    if (Common.checkStatusCode(header.statusCode)) {
      this.userInfo = Common.parseJwt(result.accessToken);
      if (this.userInfo.activationPending) {
        this.sessionService.setSessionItem(COOKIES_CONSTANTS.authToken, result.accessToken);
        if (this.userInfo.role.id === ROLES_CONST.vendor) {
          this.router.navigate([ROUTER_LINKS_FULL_PATH.vendorActivation], { queryParams: { step2: true } });
        }
        else if (this.userInfo.role.parentRoleId === ROLES_CONST.freelancer || this.userInfo.role.id === ROLES_CONST.freelancer) {
          this.router.navigate([ROUTER_LINKS_FULL_PATH.freelancerActivation], { queryParams: { step2: true } });
        }
      }
      else if (!this.userInfo.contractAcceptance) {
        this.sessionService.setSessionItem(COOKIES_CONSTANTS.authToken, result.accessToken);
        if (this.userInfo.role.id === ROLES_CONST.vendor) {
          this.router.navigate([ROUTER_LINKS_FULL_PATH.vendorActivation], { queryParams: { step3: true } });
        } else if (this.userInfo.role.parentRoleId === ROLES_CONST.freelancer || this.userInfo.role.id === ROLES_CONST.freelancer) {
          this.router.navigate([ROUTER_LINKS_FULL_PATH.freelancerActivation], { queryParams: { step3: true } });
        }
      }
      else {
        this.sessionService.setCookie(COOKIES_CONSTANTS.authToken, result.accessToken);
        this.getUserInfo();
      }
    } else {
      this._rolePermission.spinnerFlag = false;
      this.errorMessage = header.message;
      this.authError = true;
      this.sessionService.deleteCookie(COOKIES_CONSTANTS.authToken);
    }
  }
  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.submitForm();
    }
  }
  public socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    // tslint:disable-next-line:triple-equals
    if (socialPlatform == 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }
    this.socialAuthService.signIn(socialPlatformProvider).then(
      (data) => {
        if (data.idToken) {
          const userData = { 'googleToken': data.idToken };
          this.loginService.validateUserData(userData).subscribe((result: any) => {
            this.checkAndRouteUser(result.payload, result.header);
          },
          error => {
            this._rolePermission.spinnerFlag = false;
            this.toastrService.clear();
            this.toastrService.error(this.commonLocaleObj.errorMessages.error);
          });
        }
      }
    );
  }

  getUserInfo() {

    this._loginService.getUserInfo().subscribe((result: any) => {
      if (Common.checkStatusCode(result.header.statusCode)) {
        if (result.payload) {
          const userInfoData = result.payload;
          this.sessionService.setSessionItem(COOKIES_CONSTANTS.authToken, userInfoData['authToken']);
          this.sessionService.setCookie(COOKIES_CONSTANTS.authToken, userInfoData['authToken']);
          const rolesObj = (userInfoData.rolesDetails.length > 0) ? userInfoData.rolesDetails[0] : {};
          const userInfo = {
            id: userInfoData.id,
            name: userInfoData.i18n.displayName,
            profilePicUrl: userInfoData.profilePicUrl,
            roleId: rolesObj.id,
            rolesArr: userInfoData.roles,
            rolesDetails: userInfoData.rolesDetails,
            roleName: rolesObj.roleName,
            emailId: userInfoData.emailId
          };
          if (userInfoData.rolePermission) {
            userInfo['roleModulePermissions'] = this.encryptData(userInfoData.rolePermission);
          }
          this.sharedData.setUsersInfo(userInfo);
          this.getUserAccessPermission(rolesObj.id);
        }
      }
    },
    error => {
      this._rolePermission.spinnerFlag = false;
      this.toastrService.error(this.commonLocaleObj.errorMessages.error);
    });
  }


  getUserAccessPermission(roleId: String) {
    this.sharedService.getAccessRolePermissionDetails(roleId).subscribe((response: any) => {
      if (Common.checkStatusCode(response.header.statusCode)) {
        if (response.payload && response.payload.result) {
          const userRoleAccessInfoData = response.payload.result;
          this.sessionService.setSessionItem(COOKIES_CONSTANTS.authToken, userRoleAccessInfoData['authToken']);
          this.sessionService.setCookie(COOKIES_CONSTANTS.authToken, userRoleAccessInfoData['authToken']);

          const userInfoData = this.sharedData.getUsersInfo();
          if (userRoleAccessInfoData.rolePermissions) {
            userInfoData['rolePermission'] = userRoleAccessInfoData.rolePermissions;
          }
          this.sharedData.setUsersInfo(userInfoData);
          this._rolePermission.setRolePermissionObj(response.payload.result);
        }
      }
    },
    error => {
      this._rolePermission.spinnerFlag = false;
      this.toastrService.error(this.commonLocaleObj.errorMessages.error);
    });
  }



  /*user defined functions/methods after life cycle events-public methods,private methods*/
    /*
  * This method is used to encrypt Role Permission data.
  */
 encryptData(data: any) {
  const rolePermissionJSONData = this._encriptionService.setEncryptedData(JSON.stringify(data), ROLE_PERMISSION_KEY);
  return rolePermissionJSONData.toString();
}
}
