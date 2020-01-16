import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { FileUploadController } from '../../shared/controllers/file-uploader.controller';
import { LoaderService } from '../../shared/components/loader/loader.service';
import { LexiconService } from '../lexicon.service';
import { isNullOrUndefined } from 'util';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'upload-lexicon-list',
  templateUrl: './upload-lexicon-list.component.html',
  styleUrls: ['./upload-lexicon-list.component.scss'],
  providers: [LexiconService]
})
export class UploadLexiconListComponent implements OnInit {

  @Input('heading') heading: string = 'Select a file to Upload';
  @Input('mode') mode: string = 'Add';

  fileData: string = '';
  selectedFileName: string = '';
  fileSelected: boolean = false;
  oldFileName: string;
  oldFileData: string;
  isFileValid: boolean = true;
  uploadLexiconFileGroup: FormGroup;
  fileContent: any;

  constructor (
    private mdRef: MatDialogRef<UploadLexiconListComponent>,
    private fb: FormBuilder,
    private fileController: FileUploadController,
    private loaderService: LoaderService,
    private toaster: ToastrService,
    private lexiconService: LexiconService

    ) {
    this.uploadLexiconFileGroup = fb.group({
      active: new FormControl(true)
    });
  }

  ngOnInit () {}

  initData () {}

  selectFile (input) {
    this.fileController.readAsBuffer(input, (dataUrl, fileName) => {
      this.fileContent = this.readAsBinary(dataUrl);
      this.fileSelected = true;
      this.selectedFileName = fileName;
      this.fileData = this.fileContent;
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

  // selectFile(inputFile) {
  //     this.fileController.readBinaryFile(inputFile, (fileContent, fileName) => {
  //         this.fileSelected = true;
  //         this.selectedFileName = fileName;
  //         this.fileData = fileContent;
  //     });
  // }

  uploadSelectedFile ({ value, valid }: {value: any, valid: boolean}) {
    this.isFileValid = (!isNullOrUndefined(this.selectedFileName) && this.selectedFileName !== '') && this.fileSelected;
    if (!valid) {
      this.uploadLexiconFileGroup.markAsDirty();
    } else {
      this.uploadLexiconFileGroup.markAsPristine();
      if (!this.isFileValid) {

      } else {
        this.loaderService.show();
        const payload = { fileData: this.fileData, fileName: this.selectedFileName };
        this.lexiconService.uploadLexiconFile(payload).subscribe(
          data => {
            if (data.status) {
              this.toaster.success(data.msg);

            } else {
              this.toaster.error(data.msg);

            }
            this.loaderService.hide();
            this.closePopup();
          }, () => {
          this.loaderService.hide();
          this.closePopup();
        });
        this.loaderService.hide();
      }
    }
  }

  closePopup () {
    this.mdRef.close();
  }

}
