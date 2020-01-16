import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpService } from '../../../../shared/providers/http.service';
import { UrlDetails } from '../../../../../models/url/url-details.model';
import { FileUploadController } from '../../../../shared/controllers/file-uploader.controller';
import { StorageService } from '../../../../shared/providers/storage.service';
import { ToastrService } from 'ngx-toastr';

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

  @ViewChild('input') imageInput: ElementRef;

  @ViewChild('input1') imageInput1: ElementRef;

  @Input('organizationId') organizationId = '';

  @Input('collapseLogoSelected') collapseLogoSelected: boolean = false;

  welcomeTextRequired: boolean = false;

  constructor (private httpService: HttpService,
    public fileUploadCtrl: FileUploadController, public toastController: ToastrService) {
  }

  ngOnInit () {

  }

  previous () {
    this.stepChange.emit(1);
  }

  saveContinue ({ value, valid }: { value: any, valid: boolean }) {
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
      welcometext: value.welcomeText ? value.welcomeText : '',
      logo: value.logo ? value.logo : '',
      deeplink: value.deepLink ? value.deepLink : '',
      logotooltip: value.logoToolTip ? value.logoToolTip : '',
      collapseLogo: value.collapseLogo ? value.collapseLogo : ''
    };
    this.httpService.save(UrlDetails.$saveClientsBrandingUrl, data).subscribe(response => {
      if (response.responseCode === 200) {
        this.stepChange.emit(3);
      }
    }, error => {
      console.log(error);
    });
  }

  selectLogo (input) {
    this.fileUploadCtrl.readImageFile(input, { width: 127, height: 40 },70000, (dataUrl, imageName) => {
      this.form.controls['logo'].setValue(dataUrl);
      this.logoSelected = true;
    });
  }

  removeLogo () {
    this.form.controls['logo'].setValue('');
    this.logoSelected = false;
    this.imageInput.nativeElement.value = '';
  }

  removeCollapseLogo () {
    this.form.controls['collapseLogo'].setValue('');
    this.collapseLogoSelected = false;
    this.imageInput1.nativeElement.value = '';
  }

  selectCollapseLogo (input1) {
    this.fileUploadCtrl.readImageFile(input1, { width: 27, height: 37 },70000, (dataUrl, imageName) => {
      this.form.controls['collapseLogo'].setValue(dataUrl);
      this.collapseLogoSelected = true;
    });
  }
}
