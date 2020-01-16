import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpService } from '../../../shared/providers/http.service';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { FileUploadController } from '../../../shared/controllers/file-uploader.controller';
import { StorageService } from '../../../shared/providers/storage.service';

declare var $;

@Component({
  selector: 'app-branding',
  templateUrl: './branding.component.html',
  styleUrls: ['./branding.component.scss']
})

export class BrandingComponent implements OnInit {

  @Input('form') form: FormGroup;

  @Input('mode') mode: string = '';

  @Input('logoSelected') logoSelected: boolean = false;

  @Output('stepChange') stepChange = new EventEmitter<any>();

  welcomeTextRequired: boolean = false;

  constructor (private httpService: HttpService,
    public fileUploadCtrl: FileUploadController) {

  }

  ngOnInit () {

  }

  previous () {
    this.stepChange.emit(1);
  }

  saveContinue ({ value, valid }: {value: any, valid: boolean}) {
    if (value.welcomeText.trim() === '') {
      this.welcomeTextRequired = true;
    } else {
      this.welcomeTextRequired = false;
      let data = {
        client: {
          'id' : StorageService.get(StorageService.organizationId),
          'organizationName' : 'Bank of America'
        },
        welcometext: value.welcomeText,
        logo : value.logo ? value.logo : '',
        deeplink : value.deepLink ? value.deepLink : '',
        logotooltip : value.logoToolTip ? value.logoToolTip : ''
      };

      this.httpService.save(UrlDetails.$saveClientsBrandingUrl, data).subscribe(response => {
        console.log(response);
        if (response.responseCode === 200) {
          this.stepChange.emit(3);
        }
      }, () => {

      });
    }
  }

  selectLogo (input) {
    this.fileUploadCtrl.readImageFile(input, { width: 230, height: 80 }, (dataUrl, imageName) => {
      this.form.controls['logo'].setValue(dataUrl);
      this.logoSelected = true;
            // $('.branding-wrap [formcontrolname="logo"]').val(imageName);
    });
  }

  removeLogo () {
    this.form.controls['logo'].setValue('');
    this.logoSelected = false;
  }

}
