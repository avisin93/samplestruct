import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import { FileUploadController } from '../../shared/controllers/file-uploader.controller';
import { UrlDetails } from '../../../models/url/url-details.model';
import { HttpService } from '../../shared/providers/http.service';
import { StorageService } from '../../shared/providers/storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-upload-list',
  templateUrl: './upload-list.component.html',
  styleUrls: ['./upload-list.component.scss']
})

export class UploadListComponent implements OnInit {

  fileSelected: boolean = false;
  fileContent: string = '';
  selectedFileName: string = '';

  constructor (public _dialogRef: MatDialogRef<UploadListComponent>,
                private fileUploadCtrl: FileUploadController,
                private httpService: HttpService,
                private toaster: ToastrService) {

  }

  ngOnInit () {
    $('.facility-upload-list-wrap').closest('.cdk-overlay-pane').addClass('facilitiUploadListPopup');
  }

  closePopup () {
    this._dialogRef.close();
  }

  saveFacilities () {
    let value = { 'fileContent': this.fileContent, 'organizationId': StorageService.get(StorageService.organizationId) };
    this.httpService.save('UrlDetails.$uploadFacilitiesUrl',value) // TODO: Vido
        .subscribe(response => {
            // console.log("response: "+response);
          if (response.responseCode === 200) {
            this.toaster.success(response.responseData + ' Facilities added successfully');
            this._dialogRef.close('save');

          } else if (response.responseCode === 409) {
            this.toaster.error('Please check file contents');
          } else {
            this.toaster.error('Someting went Wrong, Please try again');
          }

        }, () => {

        });

  }

  fileChange (input) {
    this.fileUploadCtrl.readFile(input, (dataUrl, fileName) => {
      this.fileContent = dataUrl;
      this.fileSelected = true;
      this.selectedFileName = fileName;
    });
  }

}
