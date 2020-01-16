import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../../../shared/providers/http.service';
import { MatDialogRef } from '@angular/material';
import { Pattern } from '../../../../../models/util/pattern.model';
import { LoaderService } from '../../../../shared/components/loader/loader.service';
import { StorageService } from '../../../../shared/providers/storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ModelSetup } from '../model-setup';
import { FileUploadController } from '../../../../shared/controllers/file-uploader.controller';
import { ModelSetupService } from '../model-setup.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit-model-setup',
  templateUrl: './add-edit-model-setup.component.html',
  styleUrls: ['./add-edit-model-setup.component.scss']
})

export class AddEditModelSetupComponent implements OnInit {

  @Input('heading') heading = 'Create Model';
  @Input('saveButtonTitle') saveBtnTitle = 'Save';
  @Input('mode') mode: string;

  addEditModelSetupForm: FormGroup;
  modelSetup = new ModelSetup();
  modelSetups: ModelSetup[];
  errorMessage: string;
  isDisabled = false;
  fileSelected: boolean = false;
  selectClientError: boolean = false;
  selectLanguageError: boolean = false;
  fileContent: string = '';
  selectedFileName: string = '';
  oldFileData: string;
  oldFileName: string;
  logoValidation: boolean = false;
  languages: string[] = ['Python', 'R', 'Perl'];
  possibleFormats: string[] = ['json', 'csv'];
  userType: string;
  @Input('organizationId') organizationId: string;
  clientList: any[] = [];

  breadcrumbs: Array<any> = [
    {
      text: 'Dashboard',
      base: true,
      link: '/dashboard',
      active: false
    },
    {
      text: 'Add ModelSetup',
      base: false,
      link: '/',
      active: true
    }
  ];

  constructor (
    private _fb: FormBuilder,
    public _dialogRef: MatDialogRef<AddEditModelSetupComponent>,
    public _toastCtrl: ToastrService,
    private modelSetupService: ModelSetupService,
    private loaderService: LoaderService,
    private fileUploadController: FileUploadController
  ) {
    this.addEditModelSetupForm = this._fb.group({
      _id: new FormControl(),
      createdOn: new FormControl(),
      active: new FormControl(),
      modelname: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      language: new FormControl('', [Validators.required]),
      modelFileName: new FormControl(''),
      inputDir: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      outputDir: new FormControl('', [Validators.required, Validators.pattern(Pattern.ALPHA_NUMERIC_WITH_TRIM_SPACE), Validators.maxLength(100)]),
      outputFormat: new FormControl('')
    });
  }

  ngOnInit () {}

  addOrUpdateModelSetup ({ value, valid }: { value: any, valid: boolean }) {
    this.loaderService.show();
    if (!valid) {
      this.addEditModelSetupForm.markAsDirty();

      this.selectClientError = true;
      this.selectLanguageError = true;
      this.loaderService.hide();
    } else {
      this.addEditModelSetupForm.markAsPristine();
      this.modelSetup.modelname = value.modelname;
      this.modelSetup.organizationid = this.organizationId;
      this.modelSetup.language = value.language;
      this.modelSetup.inputDir = value.inputDir;
      this.modelSetup.outputDir = value.outputDir;
      this.modelSetup.createdBy = {
        userName: StorageService.get(StorageService.userName),
        userRole: StorageService.get(StorageService.userRole)
      };
      if (this.fileSelected) {
        this.modelSetup.uploadFile = { data: this.fileContent, name: this.selectedFileName };
      } else {
        this.modelSetup.uploadFile = { data: this.oldFileData, name: this.oldFileName };
      }
      if (this.mode === 'Edit') {
        this.modelSetup.id = value._id;
        this.modelSetup.active = value.active;
        this.modelSetup.createdOn = value.createdOn;
      } else {
        this.modelSetup.id = '';
        this.modelSetup.active = true;
      }
      this.modelSetupService.addOrUpdateModelSetup(this.modelSetup).subscribe(modelSetups => {
        this.modelSetups = modelSetups;
        this.closePopup();
        if (this.mode === 'Edit') {
          this._toastCtrl.success('Model updated Successfully');
        } else {
          this._toastCtrl.success('Model added Successfully');
        }
        this.loaderService.hide();
      },(error) => {
        console.log('saveModelSetup', error);
        this.errorMessage = error as any;
        this.loaderService.hide();
        this._toastCtrl.error('Something went wrong');
      });
    }
  }

  setEditFormValues (details?: any) {
    this.isDisabled = true;
    this.oldFileData = details.uploadFile.data;
    this.fileSelected = false;
    this.oldFileName = details.uploadFile.name;
    details['selectedClient'] = details.organizationid;
    this.addEditModelSetupForm.patchValue(details);
  }

  closePopup () {
    this._dialogRef.close();
  }

  selectfile (input) {
    this.fileUploadController.readBinaryFile(input, (buffer, fileName) => {
      this.fileContent = buffer;
      this.fileSelected = true;
      this.selectedFileName = fileName;
    });
  }

  downloadFileToClient () {
    let fileBlob = new Blob([this.oldFileName], { type: 'multipart/form-data' });
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(fileBlob, this.oldFileName);
    } else {
      let link = document.createElement('a');
      link.download = this.oldFileName;
      const ObjectURL = URL.createObjectURL(fileBlob);
      link.href = ObjectURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(ObjectURL);
    }
  }

  uploadFileToServer () {
    const payload = { fileData: this.fileContent, fileName: this.selectedFileName };
    this.loaderService.show();
    this.modelSetupService.uploadSelectedFile(payload).subscribe(data => {
      this._toastCtrl.success('File Uploaded Successfully!');
      this.loaderService.hide();
      this.closePopup();
    }, () => {
      this._toastCtrl.error('Something went wrong!');
      this.loaderService.hide();
      this.closePopup();
    });
  }

}
