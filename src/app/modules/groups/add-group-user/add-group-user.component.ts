import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { HttpService } from '../../shared/providers/http.service';
import { UrlDetails } from '../../../models/url/url-details.model';
import { FileUploadController } from '../../shared/controllers/file-uploader.controller';
import { ToastrService } from 'ngx-toastr';

declare var $: any;

@Component({
  selector: 'app-add-group-user',
  templateUrl: './add-group-user.component.html',
  styleUrls: ['./add-group-user.component.scss']
})

export class AddGroupUserComponent implements OnInit {

  @Input('userType') userType = '';

  @Input('heading') heading = 'Add User';

  @Input('saveButtonTitle') saveBtnTitle = 'Add';

  activeTab: number = 1;

  addUserForm: FormGroup;

  usernameMethod: any = 1;

  fileSelected: boolean = false;

  fileContent: string = '';

  selectedFileName: string = '';

  constructor (private _fb: FormBuilder,
    public _dialogRef: MatDialogRef<AddGroupUserComponent>,
    private fileUploadCtrl: FileUploadController,
    public httpService: HttpService,
    public urlDetails: UrlDetails,
    public toastController: ToastrService) {
    this.addUserForm = this._fb.group({
      users : new FormControl('', [Validators.required])
    });
  }

  ngOnInit (): void {
    $('.add-group-user-wrap').closest('.cdk-overlay-pane').addClass('addGroupUserPopup');

    if (this.userType === 'manager') {
      this.heading = 'Add Manager';
    }
  }

  selectTab (tab: number) {
    this.activeTab = tab;
  }

  byUserEmail (id: number) {
    this.addUserForm.controls['users'].setValue('');
    if (id === 1) {
      this.addUserForm.controls['users'].setValidators([Validators.required]);
    } else {
      const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      this.addUserForm.controls['users'].setValidators([Validators.required, Validators.pattern(EMAIL_REGEX)]);
    }

    this.addUserForm.controls['users'].updateValueAndValidity();
  }

  saveUser ({ value, valid }: {value: any, valid: boolean}) {
    if (!valid) {
      this.addUserForm.markAsDirty();
    } else {
      this.addUserForm.markAsPristine();
      let userRoleCode = '';
      if (this.userType === 'user') { userRoleCode = 'USER'; } else { userRoleCode = 'CLIENT_MANAGER'; }
      let request = {
        request : value.users,
        userRoleCode : userRoleCode
      };
      if (this.usernameMethod === 1) {
        this.getUserByUserName(request);
      } else {
        this.getUserByEmailId(request);
      }
    }
  }

  closePopup () {
    this._dialogRef.close();
  }

  getUserByUserName (request: any) {
    this.httpService.findById('UrlDetails.$getUserByUserNameAndRoleUrl' ,request) // TODO: Vido
         .subscribe(response => {
           let result = [];
           console.log(response);
           if (response.responseCode === 200) {
             this.toastController.success(this.userType + ' with given username added successfully');
             result.push(response.responseData);
           } else {
             this.toastController.error(this.userType + ' with given username not found');
           }
           this._dialogRef.close(result);
         });
  }

  getUserByEmailId (request: any) {
    this.httpService.findById('UrlDetails.$getUserByEmailIdAndRoleUrl',request) // TODO: Vido
        .subscribe(response => {
          let result = [];
          if (response.responseCode === 200) {
            this.toastController.success(this.userType + ' with given email id added successfully');
            result.push(response.responseData);
          } else {
            this.toastController.error(this.userType + ' with given email id not found');
          }
          this._dialogRef.close(result);
        });
  }

  fileChange (input) {
    this.fileUploadCtrl.readFile(input, (dataUrl, fileName) => {
      this.fileContent = dataUrl;
      this.fileSelected = true;
      this.selectedFileName = fileName;
    });
  }

  importUsers () {
    let userType = null;
    if (this.userType === 'user') { userType = this.userType; } else { userType = 'client_manager'; }
    let importUserRequest = {
      userType : userType,
      fileContent : this.fileContent,
	        fileContentType : '',
	        fileName : this.selectedFileName
    };
    this.httpService.save('UrlDetails.$extractUserUrl',importUserRequest).subscribe((response) => { // TODO: Vido
      let result = [];
      console.log('upload success');
      console.log(response);
      if (response.responseCode === 200) {
        this.toastController.success('Total Users : ' + response.responseData.importUserTotalCount + ' Users uploaded successfully : ' + response.responseData.importUserSuccesCount + ' Users upload failed : ' + response.responseData.importUserFailureCount);
        response.responseData.users.forEach(user => {
          result.push(user);
        });
      } else if (response.responseCode === 401) {
        this.toastController.error('exception while importing ' + this.userType);
      } else {
        this.toastController.error(this.userType + ' importing failed');
      }
      this._dialogRef.close(result);
    }, (error) => {
      console.log(error);
      this.toastController.error('exception while importing ' + this.userType);
    });
  }

}
