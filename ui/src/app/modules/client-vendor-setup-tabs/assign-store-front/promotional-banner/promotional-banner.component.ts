import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpService } from '../../../shared/providers/http.service';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { FileUploadController } from '../../../shared/controllers/file-uploader.controller';
import { StorageService } from '../../../shared/providers/storage.service';

@Component({
  selector: 'app-promotional-banner',
  templateUrl: './promotional-banner.component.html',
  styleUrls: ['./promotional-banner.component.scss']
})

export class PromotionalBannerComponent implements OnInit {

  @Input('form') form: FormGroup;

  @Input('mode') mode: string = '';

  @Input('bannerSelected') bannerSelected: boolean = false;

  @Output('stepChange') stepChange = new EventEmitter<any>();

  bannerRequired: boolean = false;

  constructor (private httpService: HttpService,
    public fileUploadCtrl: FileUploadController) {

  }

  ngOnInit () {

  }

  previous () {
    this.stepChange.emit(2);
  }

  save ({ value, valid }: {value: any, valid: boolean}) {
    if (this.bannerSelected === false) {
      this.bannerRequired = true;
    } else {
      this.bannerRequired = false;
      let data = {
        client: {
          'id' : StorageService.get(StorageService.organizationId),
          'organizationName' : 'Bank of America'
        },
        banner: value.banner,
        bannerDeepLink : value.bannerDeepLink ? value.bannerDeepLink : ''
      };
      this.httpService.save(UrlDetails.$saveClientsPromotionalBannerUrl, data).subscribe(response => {
        console.log(response);
        if (response.responseCode === 200) {
          console.log('save successfully');
        }
      }, () => {

      });
    }
  }

  selectBanner (input) {
    this.fileUploadCtrl.readImageFile(input, { width: 230, height: 80 }, (dataUrl) => {
      this.form.controls['banner'].setValue(dataUrl);
      this.bannerSelected = true;
      this.bannerRequired = false;
    });
  }

  removeBanner () {
    this.form.controls['banner'].setValue('');
    this.bannerSelected = false;
  }

}
