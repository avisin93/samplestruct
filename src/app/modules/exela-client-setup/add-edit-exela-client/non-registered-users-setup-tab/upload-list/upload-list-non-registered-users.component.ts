import { Component, OnInit, Input,ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FileUploadController } from '../../../../shared/controllers/file-uploader.controller';
import { HttpService } from '../../../../shared/providers/http.service';
import { UrlDetails } from '../../../../../models/url/url-details.model';
import { PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-upload-list-non-registered-users',
  templateUrl: './upload-list-non-registered-users.component.html',
  styleUrls: ['./upload-list-non-registered-users.component.scss']
})

export class UploadListNonRegUsersComponent implements OnInit {
  @ViewChild(PerfectScrollbarComponent) componentScroll: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective) directiveScroll: PerfectScrollbarDirective;
  fileSelected: boolean = false;
  fileContent: string = '';
  selectedFileName: string = '';
  statusRecipientList = [];
  displayStatus: boolean = false;
  @Input('organizationId') organizationId = '';

  constructor (public _dialogRef: MatDialogRef<UploadListNonRegUsersComponent>,
        private fileUploadCtrl: FileUploadController,
        private httpService: HttpService,
        private toaster: ToastrService) {

  }

  ngOnInit () {
    $('.non-registered-users-upload-list-wrap').closest('.cdk-overlay-pane').addClass('dealCodeUploadListPopup');
  }

  saveDealCodes () {
    let value = { 'fileContent': this.fileContent, 'organizationId': this.organizationId };
    this.httpService.save('UrlDetails.$createBulkNonRegistedUsersUrl', value) // TODO: Vido
            .subscribe(response => {
              console.log('response: ' + response);
              if (response) {
                this.toaster.success('File Uploaded successfully');
                if (response.length !== 0) {
                  this.statusRecipientList = response;
                  this.displayStatus = true;
                } else {
                  this._dialogRef.close('save');
                }
              }
            }, (error) => {
              this.toaster.error(error._body);
            });
  }

  fileChange (input) {
    this.fileUploadCtrl.readAsBuffer(input, (dataUrl, fileName) => {
      this.fileContent = this.readAsBinary(dataUrl);
      this.fileSelected = true;
      this.selectedFileName = fileName;
    });
  }
  readAsBinary (data) {
    let binary = '';
    let bytes = new Uint8Array(data);
    let length = bytes.byteLength;
    for (let i = 0; i < length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return binary;
  }
  closePopup () {
    this._dialogRef.close();
  }

}
