import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpService } from '../../../../shared/providers/http.service';
import { UrlDetails } from '../../../../../models/url/url-details.model';
import { FileUploadController } from '../../../../shared/controllers/file-uploader.controller';
import { StorageService } from '../../../../shared/providers/storage.service';
import { ToastrService } from 'ngx-toastr';

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

  @ViewChild('input') imageInput: ElementRef;

  @Input('organizationId') organizationId = '';

  bannerRequired: boolean = false;

  constructor (private httpService: HttpService,
    public fileUploadCtrl: FileUploadController, private toastController: ToastrService) {

  }

  ngOnInit () {
  }

  previous () {
    this.stepChange.emit(2);
  }

  save ({ value, valid }: { value: any, valid: boolean }) {
    if (value.banner === '') {
      this.bannerRequired = true;
    } else {
      let data = {
        modifiedby: {
          'userId': StorageService.get(StorageService.userId),
          'userName': StorageService.get(StorageService.userName)
        },
        'organizationId': this.organizationId,
        createdby: {
          'userId': StorageService.get(StorageService.userId),
          'userName': StorageService.get(StorageService.userName)
        },
        banner: value.banner ? value.banner : '',
        bannerDeepLink: value.bannerDeepLink ? value.bannerDeepLink : ''
      };
      this.httpService.save(UrlDetails.$saveClientsPromotionalBannerUrl, data).subscribe(response => {
        if (response.responseCode === 200) {
          this.toastController.success('Storefront assigned successfully');
        } else {
          this.toastController.error('Storefront assignment failed');
        }
      }, error => {
        console.log(error);
      });

    }
  }

  selectBanner (input) {
    this.fileUploadCtrl.readImageFile(input, { width: null, height:  null },70000,(dataUrl) => {
      this.form.controls['banner'].setValue(dataUrl);
      this.bannerSelected = true;
      this.bannerRequired = false;
    });
  }

  removeBanner () {
    this.form.controls['banner'].setValue('');
    this.bannerSelected = false;
    this.imageInput.nativeElement.value = '';
  }

}
