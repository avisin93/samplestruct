import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StorageService } from '../../providers/storage.service';
import { HttpService } from '../../providers/http.service';
import { UrlDetails } from 'src/app/models/url/url-details.model';
import { ToastrService } from 'ngx-toastr';
import { getErrorMessage } from 'src/app/modules/utilsValidation';
import { FileUploadController } from '../../controllers/file-uploader.controller';
import { HeaderService } from '../header/header.service';
import { Pattern } from '../../../../models/util/pattern.model';

@Component({
  selector: 'cm-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {

  logoSelected: boolean = false;
  editProfileInformation: boolean = false;
  userId: string = null;
  formGroup: FormGroup;
  @ViewChild('inputImage') inputImage: ElementRef;

  breadcrumbs: Array<any> = [
    {
      text: 'Dashboards',
      base: true,
      link: '/dashboard/events-and-reminders',
      active: this.checkUserIfClientEditor()
    },
    {
      text: 'Profile',
      link: '/my-profile',
      base: true,
      active: this.checkUserIfClientEditor()
    }
  ];

  constructor (
    private httpService: HttpService,
    private toastr: ToastrService,
    public fileUploadCtrl: FileUploadController,
    private headerService: HeaderService
  ) {
    this.initializeForm();
  }

  ngOnInit () {
    this.getProfileInfo();
  }

  initializeForm (): void {
    if (this.formGroup) {
      this.formGroup.reset();
    }

    this.formGroup = new FormGroup({
      username: new FormControl(''),
      email: new FormControl(''),
      name: new FormControl('', [Validators.required, Validators.pattern(Pattern.ALPHA_NUMERIC_WITH_UNDERSCORE_AND_APOSTROPHE_AND_SPACES)]),
      lastName: new FormControl('', [Validators.required, Validators.pattern(Pattern.ALPHA_NUMERIC_WITH_UNDERSCORE_AND_APOSTROPHE_AND_SPACES)]),
      profilePhoto: new FormControl('')
    });
  }

  editProfile (): void {
    this.editProfileInformation = !this.editProfileInformation;
  }

  cancelProfile (): void {
    if (this.formGroup) {
      this.formGroup.reset();
      this.inputImage.nativeElement.value = '';
      this.getProfileInfo();
    }
    this.editProfileInformation = !this.editProfileInformation;
  }

  getProfileInfo (): void {
    this.userId = StorageService.get('userId');
    this.formGroup.get('username').setValue(StorageService.get(StorageService.userName));
    this.formGroup.get('email').setValue(StorageService.get(StorageService.userEmail));
    this.formGroup.get('name').setValue(StorageService.get(StorageService.firstName));
    this.formGroup.get('lastName').setValue(StorageService.get(StorageService.lastName));
    if (StorageService.get('profilePhoto') !== 'undefined' && StorageService.get('profilePhoto') !== '') {
      this.logoSelected = true;
      this.formGroup.get('profilePhoto').setValue(StorageService.get(StorageService.profilePhoto));
    }
  }

  removeImage (): void {
    this.inputImage.nativeElement.value = '';
    this.formGroup.get('profilePhoto').setValue('');
    this.logoSelected = false;
    if (!this.editProfileInformation) {
      this.updateProfile('deleteImage');
    }
  }

  updateProfile (flag: String): void {
    if (!this.validate()) {
      this.formGroup.markAsDirty();
    } else {
      this.formGroup.markAsPristine();
      const data = {
        _id: this.userId,
        username: StorageService.get(StorageService.userName),
        email: this.formGroup.get('email').value,
        firstname: this.formGroup.get('name').value.trim(),
        lastname: this.formGroup.get('lastName').value.trim(),
        profilePhoto: this.formGroup.get('profilePhoto').value
      };
      this.httpService.save(UrlDetails.$exela_updateUserProfileUrl, data).subscribe(response => {
        if (flag === 'deleteImage') {
          this.toastr.success('Operation Complete', 'Profile Image deleted');
        } else if (flag === 'updateImage') {
          this.toastr.success('Operation Complete', 'Profile Image updated');
        } else {
          this.toastr.success('Operation Complete', 'User Profile Updated Successfully');
        }
        StorageService.set(StorageService.userName, StorageService.get(StorageService.userName));
        StorageService.set('firstName', this.formGroup.get('name').value.trim());
        StorageService.set('lastName', this.formGroup.get('lastName').value.trim());
        StorageService.set('userEmail', this.formGroup.get('email').value);
        StorageService.set('profilePhoto', this.formGroup.get('profilePhoto').value);
        this.headerService.setUserFullName(this.formGroup.get('name').value + ' ' + this.formGroup.get('lastName').value);
        this.headerService.setProfilePhoto(this.formGroup.get('profilePhoto').value);
        this.getProfileInfo();
        this.editProfileInformation = false;
      }, error => {
        if (error.status === 400) {
          this.toastr.error(error.error);
        }
      });
    }
  }

  selectProfilePhoto (inputImage) {
    this.fileUploadCtrl.readImageFile(inputImage, { width: null, height: null }, 70000, (dataUrl) => {
      this.formGroup.get('profilePhoto').setValue(dataUrl);
      this.updateProfile('updateImage');
    });
  }

  validate (): boolean {
    let validate = true;
    Object.keys(this.formGroup.controls).forEach(key => {
      this.formGroup.get(key).markAsTouched();
      if (this.formGroup.get(key).invalid) {
        validate = false;
      }
    });
    return validate;
  }

  getErrorMessage (field: FormControl, customMsg?: JSON) {
    if (field.touched) {
      return getErrorMessage(field, customMsg);
    }
  }

  checkUserIfClientEditor () {
    let role = StorageService.get(StorageService.userRole);
    if (role === 'Client Editor' || role === 'Editor') {
      return true;
    } else {
      return false;
    }
  }
}
