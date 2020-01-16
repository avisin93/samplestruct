import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { HttpService } from '../../../../shared/providers/http.service';
import { UrlDetails } from '../../../../../models/url/url-details.model';
import { StorageService } from '../../../../shared/providers/storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit-email-template',
  templateUrl: './add-edit-email-template.component.html',
  styleUrls: ['./add-edit-email-template.component.scss']
})

export class AddEditEmailTemplateComponent implements OnInit {

  @Input('heading') heading = 'Add Template';

  @Input('saveButtonTitle') saveBtnTitle = 'Add';

  @Input('popupMode') popupMode = '';

  addEditEmailTemplateForm: FormGroup;

  siteSettingId: string = '';

  constructor (private _fb: FormBuilder,
    private httpService: HttpService,
    public _dialogRef: MatDialogRef<AddEditEmailTemplateComponent>,
    public _toastCtrl: ToastrService) {

    this.addEditEmailTemplateForm = this._fb.group({
      templateName: new FormControl('', [Validators.required]),
      emailSubject: new FormControl('', [Validators.required]),
      emailBody: new FormControl('', [Validators.required]),
      templateId : undefined,
      siteSettingId : undefined,
      createdOn : '',
      createdBy : ''
    });
  }

  ngOnInit () {
    $('.add-edit-email-template-wrap').closest('.cdk-overlay-pane').addClass('emailTemplateAddEditPopup');
    this.siteSettingId = StorageService.get(StorageService.siteSettingId);
  }

  saveEmailTemplate ({ value, valid }: {value: any, valid: boolean}) {
    if (!valid) {
      this.addEditEmailTemplateForm.markAsDirty();
    } else {
      this.addEditEmailTemplateForm.markAsPristine();

      let loggedInUserName = StorageService.get(StorageService.userName);
      console.log(loggedInUserName);

      let organizationId = '59cb78d2340aff0db4794d99';

      let template = {
        templateName : value.templateName,
        emailSubject : value.emailSubject,
        emailBody : value.emailBody,
        templateId : value.templateId,
        createdBy : {
          userName : loggedInUserName
        }
      };

      let siteSetting = {
        siteSettingId : undefined,
        client : { organizationId : organizationId },
        emailTemplates : [template]
      };

      if (this.siteSettingId != null && this.siteSettingId !== undefined && this.siteSettingId !== 'null') {
        siteSetting.siteSettingId = this.siteSettingId;
      }

      this.httpService.save('UrlDetails.$saveSiteEmailTemplateUrl', siteSetting) // TODO: Vido
            .subscribe(response => {
              if (response.responseCode === 200) {
                this._dialogRef.close('saved');
                this.siteSettingId = response.responseData.siteSettingId;
                StorageService.set(StorageService.siteSettingId, this.siteSettingId);

                if (this.popupMode === 'add') {
                  this._toastCtrl.success('Added Successfully !');
                } else {
                  this._toastCtrl.success('Saved Successfully !');
                }
              } else if (response.responseCode === 204 || response.responseCode === 400) {
                this._toastCtrl.error(response.responseMessage);
              }
            },() => {

            });
    }
  }

  setEditFormValues (details?: any) {
    this.addEditEmailTemplateForm.patchValue(details);
  }

  closePopup () {
    this._dialogRef.close();
  }

}
