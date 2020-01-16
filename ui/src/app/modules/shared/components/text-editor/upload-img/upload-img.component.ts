import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { MatDialogRef } from '@angular/material';
import { FileUploadController } from '../../../controllers/file-uploader.controller';
import { UrlDetails } from '../../../../../models/url/url-details.model';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from 'src/app/modules/request.service';

@Component({
  selector: 'app-upload-img',
  templateUrl: './upload-img.component.html',
  styleUrls: ['./upload-img.component.scss']
})
export class UploadImgComponent implements OnInit {
  @ViewChild('input') imageInput: ElementRef;
  uploadImageForm: FormGroup;
  imageSelected = false;
  imageValidation = false;
  insertImagePath = '';
  selectedFileName = '';
  selestedFile: File;
  images = [];
  getImageUrl = UrlDetails.$getMailTemplateImagesUrl;
  @Output('uploadImageEvent') uploadImageEvent = new EventEmitter<any>();
  @Input('organizationId') organizationId = '';

  constructor (
    public _fb: FormBuilder,
    public _dialogRef: MatDialogRef<UploadImgComponent>,
    public fileUploadCtrl: FileUploadController,
    private requestService: RequestService,
    private _toastCtrl: ToastrService
  ) {
    this.uploadImageForm = this._fb.group({
      image: new FormControl('', [Validators.required]),
      active: true
    });
  }

  ngOnInit (): void {
    const params = new HttpParams().set('organizationId', `${this.organizationId}`);
    this.requestService.doGET('/api/reachout/notificationTemplates/imagesByOrganizationId', 'API_CONTRACT' , params).subscribe(response => {
      this.images = response as any;
    }, error => {
      if (error.status === 400) {
        this._toastCtrl.error(error.error);
      } else {
        this._toastCtrl.error('Something went wrong');
      }
    });
  }

  selectImage (input) {
    this.uploadImageForm.controls['image'].setValue(input.files[0]);
    this.fileUploadCtrl.readImageFile(input, { width: null, height: null }, null, (dataUrl) => {
      this.uploadImageForm.controls['image'].setValue(dataUrl);
      this.selectedFileName = input.files[0].name;
      this.imageSelected = true;
      this.imageValidation = false;
    });
  }

  uploadImage ({ value, valid }: { value: any, valid: boolean }) {
    if (value.image !== '') {
      value.fileName = this.selectedFileName;
      this.uploadImageEvent.emit(value);
      this._dialogRef.close();
    } else {
      this._toastCtrl.error('Please select image to upload');
    }
  }

  removeImage () {
    this.uploadImageForm.controls['image'].setValue('');
    this.imageSelected = false;
    this.imageInput.nativeElement.value = '';
    this.imageValidation = true;
  }

  closePopup () {
    this._dialogRef.close();
  }

  insertImage (path) {

    this.insertImagePath = this.insertImagePath = path.currentTarget.childNodes[0].src;

    this._dialogRef.close('save');
  }

    // pushFileToStorage(file: File): Observable<HttpEvent<{}>> {
    //     const formdata: FormData = new FormData();
    //     formdata.append('file', file);
    //     const req = new HttpRequest('POST', 'http://localhost:3113/assets/images', formdata, {
    //         reportProgress: true,
    //         responseType: 'text'
    //     }
    //     );
    //     return this.http.request(req);
    // }
}
