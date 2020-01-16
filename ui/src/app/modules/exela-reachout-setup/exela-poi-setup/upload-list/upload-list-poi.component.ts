import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FileUploadController } from '../../../shared/controllers/file-uploader.controller';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from 'src/app/modules/request.service';
@Component({
  selector: 'app-upload-list-poi',
  templateUrl: './upload-list-poi.component.html',
  styleUrls: ['./upload-list-poi.component.scss']
})

export class UploadListComponent implements OnInit {

  fileSelected: boolean = false;
  fileContent: string = '';
  selectedFileName: string = '';
  statusRecipientList = [];
  displayStatus: boolean = false;
  organizationid: string = '';
  constructor (
    public _dialogRef: MatDialogRef<UploadListComponent>,
    private fileUploadCtrl: FileUploadController,
    private requestService: RequestService,
    private toaster: ToastrService
  ) {}

  ngOnInit () {}

  savePoiList () {
    let value: any = { 'fileContent': this.fileContent };
    value['organizationId'] = this.organizationid;
    this.requestService.doPOST('/api/reachout/poiDetailsList', value, 'API_CONTRACT').subscribe(response => {
      console.log('response: ' + response);
      if (response) {
        this.toaster.success(response['message']);
        if (response['length'] !== 0) {
          this.statusRecipientList = response as any[];
          this.closePopup();
        } else {

          this.closePopup();
        }
      } else {
        this.toaster.error(response['message']);
      }
    }, (error) => {
      this.toaster.error(error.error);
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

  setEditFormValues (data) {}
}
