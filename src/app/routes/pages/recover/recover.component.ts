/**
* Component     : RecoverComponent
* Author        : Boston Byte LLC
* Creation Date : 23 May 2018
*/

import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { RequestOptions, URLSearchParams } from '@angular/http';

import { SettingsService } from '@app/core/settings/settings.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
// import the configure file
import { Configuration, ROUTER_LINKS_FULL_PATH, COOKIES_CONSTANTS, LANGUAGE_CODES } from '@app/config';
import { Common, SessionService, CustomValidators } from '@app/common';
import { RecoverService } from './recover.service';
import { TranslatorService } from '@app/core/translator/translator.service';

declare var $: any;

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.scss'],
  providers: [RecoverService]
})

export class RecoverComponent implements OnInit {
  /*declare variables above constructor in sequence -imported constants,public variable,private variables*/
  LANGUAGE_CODES = LANGUAGE_CODES;
  imageURL: string;
  email: string;
  recoverScreen = true;
  thankyouScreen = false;
  invalidEmail = false;
  emailNotFound: any;
  isClicked: Boolean = false;
  spinnerFlag: Boolean = false;
  value: any = '';
  valForm: FormGroup;
  ROUTER_LINKS_FULL_PATH = ROUTER_LINKS_FULL_PATH;
  selectedLang: any;
  /*declare variables above constructor in sequence -imported constants,public variable,private variables*/

  /*inicialize contructor after declaration of all variables*/

  constructor(
    private recoverService: RecoverService,
    public settings: SettingsService,
    private fb: FormBuilder,
    public translatorService: TranslatorService,
    private sessionService: SessionService
  ) {

    // set the image url
    this.imageURL = Configuration.IMAGES_URL;
  }
  /*inicialize contructor after declaration of all variables*/

  /*all life cycle events whichever required after inicialization of constructor*/
  ngOnInit() {
    this.selectedLang = this.sessionService.getCookie(COOKIES_CONSTANTS.langCode);
    this.translatorService.useLanguage(this.selectedLang);
    this.createForm();

  }
  /*all life cycle events whichever required after inicialization of constructor*/

  /*user defined functions/methods after life cycle events in sequence-public methods,private methods*/

  /*method create recover account form*/

  createForm() {
    this.valForm = this.fb.group({
      'email': [null, Validators.compose([Validators.required, CustomValidators.checkEmail])]
    });
  }
  setLanguage(value) {
    this.selectedLang = value;
    this.sessionService.setCookie(COOKIES_CONSTANTS.langCode, value);
    this.translatorService.useLanguage(value);
  }
  /*method submit recover account form*/
  submitForm($ev, value: any) {
    this.isClicked = true;
    this.spinnerFlag = true;
    $ev.preventDefault();
    // tslint:disable-next-line:forin
    for (const c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }
    if (this.valForm.valid) {
      let params: HttpParams = new HttpParams();
      params = params.set('email', this.valForm.value.email.toLowerCase().trim());
      this.recoverService.validateUserData(params).subscribe((result: any) => {
        this.isClicked = false;
        this.spinnerFlag = false;
        if (Common.checkStatusCode(result.header.statusCode)) {
          this.recoverScreen = false;
          this.thankyouScreen = true;
          this.emailNotFound = '';
        }
        else {
          this.invalidEmail = true;
          this.emailNotFound = result.header.message;
        }
      });
    }
    else {
      this.isClicked = false;
      this.spinnerFlag = false;
      this.emailNotFound = '';
      this.invalidEmail = false;
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
        this.isClicked = false;
        this.spinnerFlag = false;
      }
    }
  }

  removeMsg(fileInput) {
    // alert("testRecover");
    this.invalidEmail = false;
  }
  /*user defined functions/methods after life cycle events in sequence-public methods,private methods*/



}
