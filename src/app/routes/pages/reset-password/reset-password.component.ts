/**
* Component     : ResetpasswordComponent
 
* Creation Date : 23 May 2018
*/

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SettingsService } from '@app/core/settings/settings.service';
import { Configuration, ROUTER_LINKS_FULL_PATH, MODULE_ID, ROLES_CONST, MENU_CONFIG, COOKIES_CONSTANTS, LANGUAGE_CODES } from '../../../config'
import { CustomValidators, SessionService, Common } from '@app/common';
//import the resetpassword specific files
import { PasswordValidation } from './password-validation';
import { Md5 } from 'ts-md5/dist/md5';
import { ResetPasswordService } from './reset-password.service';
import { TranslatorService } from '@app/core/translator/translator.service';
import { SharedService } from '@app/shared/shared.service';
import { TranslateService } from '@ngx-translate/core';
declare var $: any;

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  providers: [ResetPasswordService]
})
export class ResetPasswordComponent implements OnInit {
  notreset: boolean = false;
  commonLocaleObj: any;
  imageURL: string;
  userDetails: any;
  userInfo: any;
  password: string;
  isClicked: Boolean = false;
  spinnerFlag: Boolean = false;
  errorMessage: String;
  token: string;
  private sub: any;
  showPage: boolean = false;
  resetScreen: boolean = true;
  thankyouScreen: boolean = false;
  // validForm: boolean = true;
  selectedLang: any;
  unamePattern: any = "^(?=.*?[A-Z])(?=.*?[0-9]).{8,}$";
  valForm: FormGroup;
  ROUTER_LINKS_FULL_PATH = ROUTER_LINKS_FULL_PATH;
  tokenData: any = {};
  expiredMsg: any;
  LANGUAGE_CODES = LANGUAGE_CODES;
  passwordInfoArr: any[] = [{
    key: 'capital',
    normalMsg: 'atLeast',
    boldMsg: 'oneCapitalLetter',
    valid: false
  },
  {
    key: 'number',
    normalMsg: 'atLeast',
    boldMsg: 'oneNumber',
    valid: false
  },
  {
    key: 'length',
    normalMsg: 'beAtLeast',
    boldMsg: 'eightCharacters',
    valid: false
  }];
  showErrorBox: boolean = false;
  lengthInvalidFlag: boolean = true;
  capitalLetterInvalidFlag: boolean = true;
  numberInvalidFlag: boolean = true;
  constructor(
    private _route: ActivatedRoute,
    private router: Router,
    public settings: SettingsService,
    private resetPasswordService: ResetPasswordService,
    private fb: FormBuilder,
    public translatorService: TranslatorService,
    public sessionService: SessionService,
    public _sharedService: SharedService,
    private toastrService: ToastrService,
    private translateService: TranslateService
  ) {

    //set the image url
    this.imageURL = Configuration.IMAGES_URL;

    this.valForm = fb.group({
      password: ['', [Validators.required, CustomValidators.checkPassword]],
      confirmPassword: ['', Validators.required]
    }, {
        validator: PasswordValidation.MatchPassword // your validation method
      });
  }
  ngOnInit() {
    this.setLocaleObj();
    this.sessionService.clearSession();
    this.selectedLang = this.sessionService.getCookie(COOKIES_CONSTANTS.langCode);
    this.translatorService.useLanguage(this.selectedLang);
    this.sub = this._route.params.subscribe(params => {
      this.token = params['token'];
    });
    this.checkLink();
    
  }


  setLocaleObj() {
    this.translateService.get('common').subscribe(res => {
      this.commonLocaleObj = res;
    });

  }


  checkPasswordValidations() {
    let passwordVal = this.valForm.value.password;
    this.passwordInfoArr[0].valid = passwordVal.match(/[A-Z]/) ? true : false;
    this.passwordInfoArr[1].valid = passwordVal.match(/\d/) ? true : false;
    this.passwordInfoArr[2].valid = (passwordVal.length < 8) ? false : true;
  }
  checkLink() {
    this.tokenData = { "token": this.token }
    this._sharedService.checkActivatonLink(this.tokenData).subscribe((response: any) => {
      if (Common.checkStatusCode(response.header.statusCode)) {
        this.showPage = true;
      }
      else {
        this.expiredMsg = response.header.message;
        this.router.navigate([ROUTER_LINKS_FULL_PATH.login]).then(() => {
          this.toastrService.clear();
          this.toastrService.error(response.header.message);
        });
      }

    },
      (error: any) => {
        this.router.navigate([ROUTER_LINKS_FULL_PATH.login]).then(() => {
          this.toastrService.clear();
          this.toastrService.error(this.commonLocaleObj.errorMessages.error);
        });
      });
  }
  
  /*method to set language of application*/
  setLanguage(value) {
    this.selectedLang = value;
    this.sessionService.setCookie(COOKIES_CONSTANTS.langCode, value);
    this.translatorService.useLanguage(value);
  }
  // checkForm(){
  //   if (this.valForm.valid)
  //   this.validForm = false;
  //   else
  //   this.validForm = true;
  // }
  submitForm(ev, value: any) {
    this.isClicked = true;
    this.spinnerFlag = true;
    ev.preventDefault();
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }
    if (this.valForm.valid) {
      let hash = Md5.hashStr(this.valForm.value.password);
      let data = { "token": this.token, "newPassword": hash };
      this.resetPasswordService.resetPassowrd(data).subscribe((result: any) => {
        this.isClicked = false;
        this.spinnerFlag = false;
        if (result.header.statusCode === 200) {
          this.resetScreen = false;
          this.thankyouScreen = true;
        } else if (result.header.statusCode === 400) {
          this.resetScreen = false;
          this.notreset = true;
        }
      });
    }
    else {
      this.isClicked = false;
      this.spinnerFlag = false;
      let target;
      for (let i in this.valForm.controls) {
        if (!this.valForm.controls[i].valid) {
          target = this.valForm.controls[i];
          break;
        }
      }
      if (target) {

        let el = $('.ng-invalid:not(form):first');
        $('html,body').animate({ scrollTop: (el.offset().top - 100) }, 'slow', () => {
          el.focus();
        });
        this.isClicked = false;
        this.spinnerFlag = false;
      }
    }
  }




  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
