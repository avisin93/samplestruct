import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../shared/providers/http.service';
import { UrlDetails } from '../../../models/url/url-details.model';
import { StorageService } from '../../shared/providers/storage.service';

@Component({
  selector: 'app-assign-store-front',
  templateUrl: './assign-store-front.component.html',
  styleUrls: ['./assign-store-front.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AssignStoreFrontComponent implements OnInit {

  @Input('type') type = '';

  @Input('mode') mode = '';

  currentStep: number = 1;

  assignStoreFrontForm: FormGroup;

  selectedTheme: string = '';

  logoSelected: boolean = false;

  bannerSelected: boolean = false;

  constructor (private httpService: HttpService,
    private _fb: FormBuilder) {
    this.assignStoreFrontForm = this._fb.group({
      storeFrontTheme: new FormControl(''),
      logo: new FormControl(''),
      welcomeText: new FormControl(''),
      deepLink: new FormControl(''),
      logoToolTip: new FormControl(''),
      banner: new FormControl(''),
      bannerDeepLink: new FormControl(''),
      storefrontmode : this.mode
    });
    console.log(this.assignStoreFrontForm);
  }

  ngOnInit () {
    console.log(this.mode);
    if (this.mode === 'edit') {
      this.getStoreFront();
    }
  }

  getStoreFront () {
    let data = {
      client: {
        'id' : StorageService.get(StorageService.organizationId)
            // "id" : "2"
      }
    };
    this.httpService.get(UrlDetails.$getStoreFrontUrl, data).subscribe(response => {
      console.log(response);
      if (response.responseCode === 200) {
        let details = response.responseData;
        if (details !== null) {
          this.selectedTheme = details.theme.themeId;

          if (typeof details.banner !== 'undefined' && details.banner !== null) {
            this.bannerSelected = true;
          }

          if (typeof details.logo !== 'undefined' && details.logo !== '') {
            this.logoSelected = true;
          }

          details['storeFrontTheme'] = (typeof details.banner !== 'undefined') ? details.theme : '';
          details['deepLink'] = (typeof details.deeplink !== 'undefined') ? details.deeplink : '';
          details['welcomeText'] = (typeof details.welcometext !== 'undefined') ? details.welcometext : '';
          details['logoToolTip'] = (typeof details.logotooltip !== 'undefined') ? details.logotooltip : '';
        }
        this.assignStoreFrontForm.patchValue(details);
      }
    }, () => {

    });
  }

  onStepChange (step: number) {
    this.currentStep = step;
  }

}
