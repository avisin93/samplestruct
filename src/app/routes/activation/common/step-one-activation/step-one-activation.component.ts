import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { FormControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SessionService, NavigationService,CustomValidators } from '@app/common';
import { ROUTER_LINKS_FULL_PATH, LANGUAGE_CODES, COOKIES_CONSTANTS } from '@app/config';
import { TranslatorService } from '../../../../core/translator/translator.service';
import { Router } from '@angular/router';


declare var $: any;
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'step-one-activation',
  templateUrl: './step-one-activation.component.html',
  styleUrls: ['./step-one-activation.component.scss']
})
export class StepOneActivationComponent implements OnInit {
  selectedLang: any;
  step1Form: FormGroup;
  LANGUAGE_CODES = LANGUAGE_CODES;
  submittedFormFlag: any;
  spinnerFlag: boolean = false;
  disableButtonFlag: boolean = false;
  showErrorBox: boolean = false;
  lengthInvalidFlag: boolean = true;
  capitalLetterInvalidFlag: boolean = true;
  numberInvalidFlag: boolean = true;
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
  @Output() onSubmit: EventEmitter<any> = new EventEmitter<any>();
  constructor(public translatorService: TranslatorService,   private router: Router,private fb: FormBuilder, private navigationService: NavigationService, private sessionService: SessionService) { }

  ngOnInit() {
    this.createStep1Form();
    this.selectedLang = this.sessionService.getCookie(COOKIES_CONSTANTS.langCode);
  }
  setLanguage(value) {
    this.selectedLang = value;
    this.sessionService.setCookie(COOKIES_CONSTANTS.langCode, value);
    this.translatorService.useLanguage(value);
  }
  checkPasswordValidations() {
    let passwordVal = this.step1Form.value.password;
    this.passwordInfoArr[0].valid = passwordVal.match(/[A-Z]/) ? true : false;
    this.passwordInfoArr[1].valid = passwordVal.match(/\d/) ? true : false;
    this.passwordInfoArr[2].valid = (passwordVal.length < 8) ? false : true;
  }
  createStep1Form() {
    this.step1Form = this.fb.group({
      password: ['', [CustomValidators.required, CustomValidators.checkPassword]],
      confirmPassword: ['', [CustomValidators.required]]
    }, {
        validator: CustomValidators.MatchPassword // your validation method
      })
  }
  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent) {
      if (event.keyCode === 13) {
        event.preventDefault();
        if (!this.spinnerFlag) {
        this.nextStep();
        }
      }
  }
  nextStep() {
    this.showErrorBox = false;
    this.submittedFormFlag = true;
    this.spinnerFlag = true;
    this.disableButtonFlag = true;
    if (this.step1Form.valid) {
      //this.submittedFormFlag = false;

      this.onSubmit.emit(this.step1Form.value);
    }
    else {
      let target;
      for (var i in this.step1Form.controls) {
        if (!this.step1Form.controls[i].valid) {
          target = this.step1Form.controls[i];
          break;
        }
      }
      if (target) {
        this.spinnerFlag = false;
        this.disableButtonFlag = false;
        let el = $('.ng-invalid:not(form):first');
        $('html,body').animate({ scrollTop: (el.offset().top - 100) }, 'slow', () => {
          el.focus();
        });
      }
    }
  }
  navigateToLogin() {
    this.step1Form.reset();
    this.router.navigate([ROUTER_LINKS_FULL_PATH.login]);
  }
}
