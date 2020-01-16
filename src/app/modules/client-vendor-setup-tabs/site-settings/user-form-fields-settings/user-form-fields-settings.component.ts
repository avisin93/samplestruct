import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { HttpService } from '../../../shared/providers/http.service';
import { SessionService } from '../../../shared/providers/session.service';
import { StorageService } from '../../../shared/providers/storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-form-fields-settings',
  templateUrl: './user-form-fields-settings.component.html',
  styleUrls: ['./user-form-fields-settings.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class UserFormFieldsSettingsComponent implements OnInit {

  @Input('mode') mode = '';

  profileFieldsForm: FormGroup;

  profileFields: Array<any> = [];

  siteSettingId: string = '';

  constructor (private _fb: FormBuilder,
    private _router: Router,
    private route: ActivatedRoute,
    public _toastCtrl: ToastrService,
    public httpService: HttpService) {

    this.profileFieldsForm = this._fb.group({
      fields: this._fb.array([])
    });
  }

  ngOnInit () {
    console.log(this.mode);
    this.getSiteSettings();
  }

  getSiteSettings () {
    let client = { organizationId : '59cb78d2340aff0db4794d99' };
    this.httpService.save('UrlDetails.$getSiteSettingsUrl',client) // TODO: Vido
        .subscribe(response => {
          console.log(response);
          if (response.responseCode === 200) {
            this.siteSettingId = response.responseData.siteSettingId;
            this.profileFields = response.responseData.userProfileFieldsSetting;
          } else if (response.responseCode === 204 || response.responseCode === 400) {
            this.profileFields = [];
          }

          this.profileFields.forEach((field) => {
            this._fields.push(this.fieldsFormModel(field));
          });

          console.log(this._fields);
        }, () => {

        });
  }

  get _fields (): FormArray {
    return this.profileFieldsForm.get('fields') as FormArray;
  }

  fieldsFormModel (field) {
    return new FormGroup({
      field: new FormControl(field.field),
      fieldName: new FormControl(field.fieldName),
      visible: new FormControl(field.visible),
      required: new FormControl(field.required),
      showConfirmed: new FormControl(field.showConfirmed)
    });
  }

  saveProfileFields ({ value, valid }: {value: any, valid: boolean}) {
    let fieldsArrayObject = value.fields;

    let organizationId = '59cb78d2340aff0db4794d99';
    let siteSetting = {
      siteSettingId : undefined,
      client : { organizationId : organizationId },
      userProfileFieldsSetting : value.fields
    };

    if (this.siteSettingId !== '') {
      siteSetting.siteSettingId = this.siteSettingId;
    }

    console.log('profile fields settings: ' + JSON.stringify(fieldsArrayObject));

    this.httpService.save('UrlDetails.$saveSiteProfileFieldsUrl', siteSetting) // TODO: Vido
        .subscribe(response => {
          if (response.responseCode === 200) {
            this._toastCtrl.success('Saved Succssfully !!!');
            this.siteSettingId = response.responseData.siteSettingId;
            StorageService.set(StorageService.siteSettingId, this.siteSettingId);
          } else if (response.responseCode === 400) {
            this._toastCtrl.error('Fields not saved');
          } else if (response.responseCode === 204) {
            this._toastCtrl.error(response.responseMessage);
          }

        }, () => {

        });
  }

  gotoClientVendorSetup () {
    let base = SessionService.get('base-role');
    this.route.parent.url.subscribe((urlPath) => {
      const menuUrl = urlPath[urlPath.length - 1].path;
      this._router.navigate(['/' + base + '/' + menuUrl]);
    });
  }

}
