import { Component, OnInit, Input, ViewEncapsulation, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../../shared/providers/http.service';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-assign-store-front',
  templateUrl: './assign-store-front.component.html',
  styleUrls: ['./assign-store-front.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AssignStoreFrontComponent implements OnInit {

  @Input('type') type = '';

  @Input('mode') mode = '';

  @Input('organizationId') organizationId = '';

  currentStep: number = 1;

  assignStoreFrontForm: FormGroup;

  selectedTheme: string = '';

  logoSelected: boolean = false;

  collapseLogoSelected: boolean = false;

  bannerSelected: boolean = false;

  constructor (private httpService: HttpService,
    private _fb: FormBuilder,private _route: ActivatedRoute) {
    this.assignStoreFrontForm = this._fb.group({
      storeFrontTheme: new FormControl(''),
      logo: new FormControl(''),
      welcomeText: new FormControl(''),
      deepLink: new FormControl(''),
      logoToolTip: new FormControl(''),
      banner: new FormControl(''),
      bannerDeepLink: new FormControl(''),
      storefrontmode: this.mode,
      collapseLogo: new FormControl('')
    });
  }

  ngOnInit () {

    this._route.data.subscribe((dataParams: any) => {
      this.mode = dataParams.mode;
      if (this.mode === 'edit') {
        this.getStoreFront();
      }
    });
  }

  getStoreFront () {
    this.httpService.getAll(UrlDetails.$getStoreFrontUrl + this.organizationId + '?' + Date.now()).subscribe(details => {
      if (details !== null) {
        this.selectedTheme = (details.theme !== undefined) ? details.theme.themeId : '';
        details['storeFrontTheme'] = (typeof details.theme !== 'undefined') ? details.theme : '';

        if (typeof details.banner !== 'undefined' && details.banner !== null) {
          this.bannerSelected = true;
          details['banner'] = (typeof details.banner !== 'undefined') ? details.banner : '';
        }
        details['bannerDeepLink'] = (typeof details.bannerDeepLink !== 'undefined') ? details.bannerDeepLink : '';

        if (typeof details.logo !== 'undefined' && details.logo !== '') {
          this.logoSelected = true;
          details['logo'] = (typeof details.logo !== 'undefined') ? details.logo : '';
        }

        if (typeof details.collapseLogo !== 'undefined' && details.collapseLogo !== '') {
          this.collapseLogoSelected = true;
          details['collapseLogo'] = (typeof details.collapseLogo !== 'undefined') ? details.collapseLogo : '';
        }

        details['deepLink'] = (typeof details.deeplink !== 'undefined') ? details.deeplink : '';
        details['welcomeText'] = (typeof details.welcometext !== 'undefined') ? details.welcometext : '';
        details['logoToolTip'] = (typeof details.logotooltip !== 'undefined') ? details.logotooltip : '';
      }
      this.assignStoreFrontForm.patchValue(details);
    }, error => {
      console.log(error);
    });
  }

  onStepChange (step: number) {
    this.currentStep = step;
  }

}
