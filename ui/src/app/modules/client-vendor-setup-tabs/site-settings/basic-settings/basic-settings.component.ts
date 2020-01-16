import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { HttpService } from '../../../shared/providers/http.service';
import { SessionService } from '../../../shared/providers/session.service';
import { StorageService } from '../../../shared/providers/storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-basic-settings',
  templateUrl: './basic-settings.component.html',
  styleUrls: ['./basic-settings.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class BasicSettingsComponent implements OnInit {

  @Input('mode') mode = '';

  basicSettingsForm: FormGroup;

  dayTypes: Array<any> = ['Days', 'Months', 'Weeks'];

  files: Array<any> = [
    {
      fileType: 'FILES',
      fileExpiryCount: 0,
      filesExpirationNumber: 0,
      fileExpiryTimeStr: 'Days'
    },
    {
      fileType: 'JOB_FILES',
      fileExpiryCount: 0,
      jobFilesExpirationNumber : 0,
      fileExpiryTimeStr: 'Days'
    },
    {
      fileType: 'SAVED_FILES',
      fileExpiryCount: 0,
      savedExpirationNumber: 0,
      fileExpiryTimeStr: 'Days'
    },
    {
      fileType: 'CREDIT_CARD_TRANSACTIONS',
      fileExpiryCount: 0,
      cardExpirationNumber: 0,
      fileExpiryTimeStr: 'Days'
    }
  ];

  siteSettingId: string = '';

  constructor (private _fb: FormBuilder,
    private _router: Router,
    private route: ActivatedRoute,
    public _toastCtrl: ToastrService,
    public httpService: HttpService) {

    this.basicSettingsForm = this._fb.group({
      sessionTimeout: new FormControl('', [Validators.required]),
      filesExpirationNumber: new FormControl(0),
      filesExpirationType: new FormControl('Days'),
      jobFilesExpirationNumber: new FormControl(0),
      jobFilesExpirationType: new FormControl('Days'),
      savedExpirationNumber: new FormControl(0),
      savedFilesExpirationType: new FormControl('Days'),
      cardExpirationNumber: new FormControl(0),
      cardExpirationType: new FormControl('Days'),
      pdfJobSubmission: new FormControl(true),
      statusChangeJob: new FormControl('FIRST_JOB'),
      mixedImpressions: new FormControl(false),
      maximumNumberOfJobsAllowed: new FormControl('1'),
      limitedJobsCount: new FormControl('')
    });
  }

  ngOnInit () {
    console.log(this.mode);
    this.getSiteSettings();
  }

  saveBasicSettings ({ value, valid }: {value: any, valid: boolean}) {
    if (!valid) {
      this.basicSettingsForm.markAsDirty();
    } else {
      this.basicSettingsForm.markAsPristine();
      console.log(value);

      this.files.forEach(file => {
        if (undefined !== file.filesExpirationNumber) {
          file.fileExpiryCount = value.filesExpirationNumber;
          file.fileExpiryTimeStr = value.filesExpirationType;
        }
        if (undefined !== file.jobFilesExpirationNumber) {
          file.fileExpiryCount = value.jobFilesExpirationNumber;
          file.fileExpiryTimeStr = value.jobFilesExpirationType;
        }
        if (undefined !== file.savedExpirationNumber) {
          file.fileExpiryCount = value.savedExpirationNumber;
          file.fileExpiryTimeStr = value.savedFilesExpirationType;
        }
        if (undefined !== file.cardExpirationNumber) {
          file.fileExpiryCount = value.cardExpirationNumber;
          file.fileExpiryTimeStr = value.cardExpirationType;
        }
      });

      let basicSettings = {
                	basicSettingId : undefined,
        sessionTimeoutMins : value.sessionTimeout,
        files : this.files,
        allowPdfJobSubmit : value.pdfJobSubmission,
        allowMixedImpressions : value.mixedImpressions,
        statusChangesForJob : value.statusChangeJob,
        maxNoOfJobs : value.limitedJobsCount

      };

      if (value.maximumNumberOfJobsAllowed === '1') {
        basicSettings.maxNoOfJobs = 0;
      }

      let organizationId = '59cb78d2340aff0db4794d99';
      let siteSetting = {
        siteSettingId : undefined,
        client : { organizationId : organizationId },
        basicSiteSetting : basicSettings
      };

      if (this.siteSettingId !== '') {
        siteSetting.siteSettingId = this.siteSettingId;
      }

      console.log('basic settings: ' + JSON.stringify(basicSettings));

      this.httpService.save('UrlDetails.$saveBasicSiteSettingUrl',siteSetting) // TODO: Vido
            .subscribe(response => {

              if (response.responseCode === 200) {
                this._toastCtrl.success('Saved Succssfully !!!');
                this.siteSettingId = response.responseData.siteSettingId;
                StorageService.set(StorageService.siteSettingId, this.siteSettingId);
              } else if (response.responseCode === 400) {
                this._toastCtrl.error('Please check mandatory fields');
              } else if (response.responseCode === 204) {
                this._toastCtrl.error(response.responseMessage);
              }

            },() => {

            });
    }
  }

  getSiteSettings () {
    let client = { organizationId : '59cb78d2340aff0db4794d99' };
    this.httpService.save('UrlDetails.$getSiteSettingsUrl',client) // TODO: Vido
        .subscribe(response => {
          console.log(response);

          if (response.responseCode === 200) {
            this.siteSettingId = response.responseData.siteSettingId;
            let basicSetting = response.responseData.basicSiteSetting;
            this.basicSettingsForm.controls['mixedImpressions'].setValue(basicSetting.allowMixedImpressions);
            this.basicSettingsForm.controls['pdfJobSubmission'].setValue(basicSetting.allowPdfJobSubmit);
            this.basicSettingsForm.controls['statusChangeJob'].setValue(basicSetting.statusChangesForJob);
            this.basicSettingsForm.controls['sessionTimeout'].setValue(basicSetting.sessionTimeoutMins);

            if (basicSetting.maxNoOfJobs > 0) {
              this.basicSettingsForm.controls['maximumNumberOfJobsAllowed'].setValue('2');
              this.basicSettingsForm.controls['limitedJobsCount'].setValue(basicSetting.maxNoOfJobs);
            } else {
              this.basicSettingsForm.controls['maximumNumberOfJobsAllowed'].setValue('1');
            }

            basicSetting.files.forEach(file => {
              if (file.fileType === 'FILES') {
                this.basicSettingsForm.controls['filesExpirationNumber'].setValue(file.fileExpiryCount);
                this.basicSettingsForm.controls['filesExpirationType'].setValue(file.fileExpiryTimeStr);
              }
              if (file.fileType === 'JOB_FILES') {
                this.basicSettingsForm.controls['jobFilesExpirationNumber'].setValue(file.fileExpiryCount);
                this.basicSettingsForm.controls['jobFilesExpirationType'].setValue(file.fileExpiryTimeStr);
              }
              if (file.fileType === 'SAVED_FILES') {
                this.basicSettingsForm.controls['savedExpirationNumber'].setValue(file.fileExpiryCount);
                this.basicSettingsForm.controls['savedFilesExpirationType'].setValue(file.fileExpiryTimeStr);
              }
              if (file.fileType === 'CREDIT_CARD_TRANSACTIONS') {
                this.basicSettingsForm.controls['cardExpirationNumber'].setValue(file.fileExpiryCount);
                this.basicSettingsForm.controls['cardExpirationType'].setValue(file.fileExpiryTimeStr);
              }
            });

          } else if (response.responseCode === 204 || response.responseCode === 400) {

          }
        },() => {

        });
  }

  setSavedValues (details: any) {
    this.basicSettingsForm.patchValue(details);
  }

  onMaximumNumberOfJobsAllowed (type: any) {
    if (type === '1') {
      this.basicSettingsForm.controls['limitedJobsCount'].clearValidators();
    } else {
      this.basicSettingsForm.controls['limitedJobsCount'].setValidators([Validators.required]);
    }
    this.basicSettingsForm.controls['limitedJobsCount'].updateValueAndValidity();
  }

  gotoClientVendorSetup () {
    let base = SessionService.get('base-role');
    this.route.parent.url.subscribe((urlPath) => {
      const menuUrl = urlPath[urlPath.length - 1].path;
      this._router.navigate(['/' + base + '/' + menuUrl]);
    });
  }

}
