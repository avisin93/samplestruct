import { Component, OnInit, ViewChild, ViewEncapsulation, HostListener } from '@angular/core';
import { FormControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap';
import { Md5 } from 'ts-md5/dist/md5';
import { FileUploader } from 'ng2-file-upload';
import { ManageFreelancerActivationData } from './freelancer-activation.data.model';
import {
  ROLES, OPERATION_MODES, ROUTER_LINKS_FULL_PATH, PAID_TYPES,
  FILE_TYPES, MENU_CONFIG, MEDIA_SIZES, PAID_TYPES_CONST, COOKIES_CONSTANTS,
  DOCUMENT_TYPES, CURRENCIES, URL_PATHS, ROLES_CONST, defaultDatepickerOptions,
  STATUS_CODES, CONSTANCIA_OPINION_FILE_TYPES, LANGUAGE_CODES, ROLE_PERMISSION_KEY, TAG_NAME_TEXTAREA
} from '@app/config';
import { SharedData } from '@app/shared/shared.data';
import { Router, ActivatedRoute } from '@angular/router';
import { Common, SessionService, EncriptionService, NavigationService, CustomValidators } from '@app/common';
import { FreelancerActivationService } from './freelancer-activation.service';
import { SharedService } from '@app/shared/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslatorService } from '@app/core/translator/translator.service';
import { StepThreeActivationComponent } from '../common/step-three-activation/step-three-activation.component';
import { StepOneActivationComponent } from '../common/step-one-activation/step-one-activation.component';
import * as _ from 'lodash';
import { RolePermission } from '@app/shared/role-permission';
const swal = require('sweetalert');
declare var $: any;
const URL = '';
@Component({
  selector: 'freelancer-activation',
  templateUrl: './freelancer-activation.component.html',
  styleUrls: ['./freelancer-activation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FreelancerActivationComponent implements OnInit {
  @ViewChild('child') child: StepOneActivationComponent;
  @ViewChild('step3Child') step3Child: StepThreeActivationComponent;
  @ViewChild('cropper', undefined) cropper: ImageCropperComponent;
  @ViewChild('classicModal') public classicModal: ModalDirective;
  isClicked: Boolean = false;
  CONSTANCIA_OPINION_FILE_TYPES = CONSTANCIA_OPINION_FILE_TYPES;
  disableButtonFlag: Boolean = false;
  multipleDocumentUpload = [];
  LANGUAGE_CODES = LANGUAGE_CODES;
  public uploaderConstancia: FileUploader = new FileUploader({ url: URL });
  public uploader32D: FileUploader = new FileUploader({ url: URL });
  public uploaderPassport: FileUploader = new FileUploader({ url: URL });
  public uploaderOthers: FileUploader = new FileUploader({ url: URL });
  editUserForm: FormGroup;
  step3Form: FormGroup;
  ROUTER_LINKS_FULL_PATH = ROUTER_LINKS_FULL_PATH;
  CURRENCIES = CURRENCIES;
  ROLES = ROLES;
  cropperModalOpen: Boolean = false;
  OPERATION_MODES = OPERATION_MODES;
  PAID_TYPES = PAID_TYPES;
  ROLES_CONST = ROLES_CONST;
  DOCUMENT_TYPES = DOCUMENT_TYPES;
  dobDatePickerOptions = defaultDatepickerOptions;
  freelancerId: any;
  rowIndex: any;
  userDetails: any;
  usersArr;
  value: any = '';
  maxDate = new Date();
  userInfo: any;
  showStep1: Boolean = false;
  showStep2: Boolean = false;
  showStep3: Boolean = false;
  showPage: Boolean = false;
  submmitedFormFlag: Boolean = false;
  spinnerFlag: Boolean = false;
  menuList = MENU_CONFIG;
  profileImageUrl: any;
  currency: any = [];
  operationDropdown: any = [];
  documents = {
    selectedConstantiaDocs: [],
    selected32DDocs: [],
    selectedPassportDocs: [],
    selectedOtherDocs: []
  };
  breadcrumbData: any = {
    title: 'actors.freelancers.labels.updateFreelancer'

  };
  liftId = '';
  cropperSettings: CropperSettings;
  token: any;
  authToken: any;
  croppedData: any;
  currencies: any = [];
  modesOfOperation: any = [];
  thirdPartyVendors: any = [];
  contractFileUrl: String = '';
  templateId: any;
  commonLabels: any;
  filesCounter: number;
  filesReceived: number;
  selectedLang: any;
  // public importantDates: any = [];
  constructor(private fb: FormBuilder,
    public translatorService: TranslatorService,
    private sharedData: SharedData,
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private _freelancerActivationService: FreelancerActivationService,
    private _sharedService: SharedService,
    private sessionService: SessionService,
    private translateService: TranslateService,
    private _rolePermission: RolePermission,
    private navigationService: NavigationService,
    private _encriptionService: EncriptionService

  ) {
    this.dobDatePickerOptions.disableSince = { year: Common.getTodayDate().getFullYear(), month: Common.getTodayDate().getMonth() + 1, day: Common.getTodayDate().getDate() + 1 }
    this.cropperSettings = new CropperSettings();

    this.cropperSettings.noFileInput = true;
    this.cropperSettings.width = 150;
    this.cropperSettings.height = 150;
    this.cropperSettings.croppedWidth = 150;
    this.cropperSettings.croppedHeight = 150;
    this.cropperSettings.canvasWidth = 470;
    this.cropperSettings.canvasHeight = 300;
    this.cropperSettings.minWidth = 600;
    this.cropperSettings.minHeight = 125;
    this.cropperSettings.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
    this.cropperSettings.cropperDrawSettings.strokeWidth = 2;
    this.croppedData = {};

  }

  ngOnInit() {

    this.selectedLang = this.sessionService.getCookie(COOKIES_CONSTANTS.langCode);
    this.translatorService.useLanguage(this.selectedLang);
    this.sessionService.deleteCookie(COOKIES_CONSTANTS.authToken);
    this.createEditForm();
    this.route.params.subscribe(params => {
      this.token = params['token'];
      this.checkStatus();
    });

    this.translateService.get('common').subscribe((res: string) => {
      this.commonLabels = res;
    });
  }
  ngAfterViewChecked() {
    if (this.showStep1) {
      this.spinnerFlag = this.child.spinnerFlag;
      this.disableButtonFlag = this.child.disableButtonFlag;
    }
  }
  checkStatus() {
    const authToken = this.sessionService.getSessionItem(COOKIES_CONSTANTS.authToken);
    if (authToken) {
      this.showStep1 = false;
      this.userInfo = Common.parseJwt(authToken);
      if (this.userInfo.activationPending) {
        this.showStep2 = true;
        this.showStep3 = false;
        this.getPageDetails(authToken);
      }
      else {
        this.showStep2 = false;
        this.showStep3 = true;
        setTimeout(() => { this.getContractFile(); });
      }
      this.showPage = true;
    }
    else {
      const tokenData = { 'token': this.token }
      this._sharedService.checkActivatonLink(tokenData).subscribe((response: any) => {
        if (response.header.statusCode == STATUS_CODES.LINK_EXPIRED) {
          this.showPage = false;
          this.showStep1 = false;
          this.navigationService.navigate(ROUTER_LINKS_FULL_PATH.login).then(() => {
            this.toastrService.clear();
            this.toastrService.error(response.header.message);
          });
          // this.toastrService.error(response.header.message);
        } else {
          this.showPage = true;
          this.showStep1 = true;
        }
      },
        (error: any) => {
          this.router.navigate([ROUTER_LINKS_FULL_PATH.login]).then(() => {
            this.toastrService.clear();
            this.toastrService.error(this.commonLabels.errorMessages.error);
          });
        });
    }
  }
  ngDoCheck() {
    this.checkFileUploadingStatus();
  }

  checkFileUploadingStatus() {
    if (this.multipleDocumentUpload.length > 0 && this.disableButtonFlag) {
      let disableButtonFlag = false;
      for (var documentArr in this.multipleDocumentUpload) {
        for (var index = 0; index < this.multipleDocumentUpload[documentArr].length; index++) {
          if (!this.multipleDocumentUpload[documentArr][index]) {
            this.disableButtonFlag = true;
            disableButtonFlag = true;
            break;
          }
        }
        if (disableButtonFlag) {
          break;
        }
      }
      if (!disableButtonFlag) {
        this.disableButtonFlag = false;
      }
    }
  }

  createEditForm() {
    this.editUserForm = this.fb.group({
      firstName: ['', [CustomValidators.required]],
      lastName: ['', [CustomValidators.required]],
      email: [''],
      electronicId: [''],
      phone: ['', [CustomValidators.required]],
      dateOfBirth: ['', [CustomValidators.required]],
      ssn: [''],
      uprc: ['', [CustomValidators.required]],
      selfPaid: ['1'],
      currency: ['', [CustomValidators.required]],
      taxId: ['', [CustomValidators.required]],
      accNumber: [''],
      bankName: [''],
      branchName: [''],
      clabe: [''],
      address: [''],
      rfcCode: [''],
      mode: ['', [CustomValidators.required]],
      vendorId: [''],
      documentName: [''],
      entertainment: [''],
      commercial: [''],
      corporate: [''],
      constantiaDocument: [''],
      ttDocument: [''],
      passportDocument: [''],
      roleIds: [''],
      profilePicFileId: ['']
    })
    this.paymentTypeChanged();
  }

  getCurrencies() {
    this._sharedService.getCurrencies().subscribe((response: any) => {
      if (Common.checkStatusCode(response.header.statusCode)) {
        if (response.payload && response.payload.results) {
          this.currencies = [];
          this.currencies = response.payload.results;
          this.currency = Common.getMultipleSelectArr(this.currencies, ['id'], ['i18n', 'name']);
        } else {
          this.currencies = [];
        }
      } else {
        this.currencies = [];
      }
    }, error => {
      this.currencies = [];
    });
  }
  getModesOfOperation() {
    this._sharedService.getModesOfOperation().subscribe((response: any) => {
      if (Common.checkStatusCode(response.header.statusCode)) {
        if (response.payload && response.payload.results) {
          this.modesOfOperation = [];
          this.modesOfOperation = response.payload.results;
          this.operationDropdown = Common.getMultipleSelectArr(this.modesOfOperation, ['id'], ['i18n', 'name']);
        } else {
          this.modesOfOperation = [];
        }
      } else {
        this.modesOfOperation = [];
      }
    }, error => {
      this.modesOfOperation = [];
    });
  }
  getThirdPartyVendors() {
    this._sharedService.getThirdPartyVendors().subscribe((response: any) => {
      if (Common.checkStatusCode(response.header.statusCode)) {
        if (response.payload && response.payload.results) {
          this.thirdPartyVendors = response.payload.results;
        } else {
          this.thirdPartyVendors = [];
        }
      } else {
        this.thirdPartyVendors = [];
      }
    }, error => {
      this.thirdPartyVendors = [];
    });
  }
  showStep2Section(formValue) {
    this.spinnerFlag = true;
    this.disableButtonFlag = true;
    if (formValue) {
      let obj = {
        "langCode": this.sessionService.getCookie(COOKIES_CONSTANTS.langCode),
        "password": Md5.hashStr(formValue.password)
      }
      this._freelancerActivationService.postStepOneData(obj, this.token).subscribe((response: any) => {
        if (Common.checkStatusCodeInRange(response.header.statusCode)) {
          this.spinnerFlag = false;
          this.disableButtonFlag = false;
          this.authToken = response.payload.result.token;
          this.showStep1 = false;
          this.sessionService.setSessionItem(COOKIES_CONSTANTS.authToken, this.authToken);
          this.showRespectiveStep(this.authToken);
          this.toastrService.success(response.header.message);
        }
        else {
          this.spinnerFlag = false;
          this.disableButtonFlag = false;
          this.toastrService.error(response.header.message);
        }

      }, error => {
        this.spinnerFlag = false;
        this.disableButtonFlag = false;
        this.toastrService.error(this.commonLabels.errorMessages.responseError);
      })
    }


  }
  showRespectiveStep(token) {
    const parsedData = Common.parseJwt(token);
    if (parsedData) {
      if (!parsedData.contractGeneratedPending) {
        if (parsedData.contractAcceptance) {
          this.continueToProfile();
        } else {
          this.showStep3 = true;
          setTimeout(() => { this.getContractFile(); });
        }
      } else {
        this.showStep2 = true;
        this.getPageDetails(token);
      }
    }
  }

  getPageDetails(authToken) {
    this.getTokenData(authToken);
    this.getCurrencies();
    this.getModesOfOperation();
    this.getThirdPartyVendors();
  }
  getTokenData(authToken) {
    const parsedData = Common.parseJwt(authToken);
    this.freelancerId = parsedData.userId;
    this.getFreelancerDetails(this.freelancerId);
    // this.editUserForm.controls['email'].setValue(parsedData.emailId);
  }

  checkModalOpen(modalFlag) {
    if (modalFlag) {
      this.cropperModalOpen = true;
    } else {
      this.cropperModalOpen = false;
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent) {
    if (event && event.target && event.target['tagName'] != TAG_NAME_TEXTAREA) {
    if (event.keyCode === 13) {
      event.preventDefault();
      if (!this.cropperModalOpen) {
        if (!this.spinnerFlag && !this.disableButtonFlag && this.showStep2) {
          this.addUser();
        }
      } else {
        this.cropped();
      }
    }
  }
  }
  getFreelancerDetails(id) {
    this._freelancerActivationService.getFreelancerDetails(id).subscribe((response: any) => {
      if (Common.checkStatusCode(response.header.statusCode)) {
        const freelancerDetails = response.payload.result;
        this.setFormValues(freelancerDetails);
      }
      else {
        this.toastrService.error(response.header.message);
      }

    })
  }
  setFormValues(freelancerDetails) {
    this.editUserForm.patchValue({
      firstName: freelancerDetails.i18n.firstName,
      lastName: freelancerDetails.i18n.lastName,
      electronicId: freelancerDetails.electronicIDNumber,
      email: freelancerDetails.emailId,
      mode: freelancerDetails.operationId,
      currency: freelancerDetails.currencyId,
      roleIds: freelancerDetails.roleIds,
      commercial: freelancerDetails.commercial ? this.setCategoryIds(JSON.parse(JSON.stringify(freelancerDetails.commercial))) : [],
      entertainment: freelancerDetails.entertainment ? this.setCategoryIds(JSON.parse(JSON.stringify(freelancerDetails.entertainment))) : [],
      corporate: freelancerDetails.corporate ? this.setCategoryIds(JSON.parse(JSON.stringify(freelancerDetails.corporate))) : [],

    })
  }
  setCategoryIds(categories) {
    const selectedCategories = [];
    for (let i = 0; i < categories.length; i++) {
      const mappingId = categories[i].mappingIds[0];
      selectedCategories.push(mappingId);
    }
    return selectedCategories;
  }
  paymentTypeChanged() {
    if (this.editUserForm.value.selfPaid == PAID_TYPES_CONST.selfPaid) {
      this.editUserForm.controls['vendorId'].setValue('');
      this.editUserForm.controls['vendorId'].setValidators([]);
      // this.editUserForm.controls['mode'].setValidators([CustomValidators.required]);

    }
    else {
      this.editUserForm.patchValue({
        accNumber: '',
        bankName: '',
        branchName: '',
        clabe: '',
        address: '',
        rfcCode: ''
      })
      // this.editUserForm.controls['mode'].setValidators([]);
      this.editUserForm.controls['vendorId'].setValidators([CustomValidators.required]);
    }
    // this.editUserForm.controls['mode'].markAsUntouched();
    this.editUserForm.controls['vendorId'].markAsUntouched()
    // this.editUserForm.controls['mode'].updateValueAndValidity();
    this.editUserForm.controls['vendorId'].updateValueAndValidity();
  }
  addUser() {
    this.submmitedFormFlag = true;
    this.spinnerFlag = true;
    const formValue = this.editUserForm.value;
    if (this.editUserForm.valid) {
      this.isClicked = true;
      this.submmitedFormFlag = false;

      formValue['langCode'] = this.sessionService.getCookie(COOKIES_CONSTANTS.langCode);
      const freelancerActivationData = ManageFreelancerActivationData.getWebServiceDetails(formValue, this.documents);
      freelancerActivationData['id'] = this.freelancerId;
      this._freelancerActivationService.updateFreelancerData(this.freelancerId, freelancerActivationData).
        subscribe((responseData: any) => {
          this.spinnerFlag = false;
          this.isClicked = false;
          if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
            this.sessionService.setSessionItem(COOKIES_CONSTANTS.authToken, responseData.payload.token);
            this.showStep2 = false;
            this.showStep3 = true;
            setTimeout(() => { this.getContractFile(); });
            this.toastrService.success(responseData.header.message);
          } else {
            this.spinnerFlag = false;
            this.isClicked = false;
            if (responseData.header.message) {
              this.toastrService.error(responseData.header.message);
            }
          }
        }, error => {
          this.spinnerFlag = false;
          this.isClicked = false;
          this.toastrService.error(this.commonLabels.errorMessages.responseError);
        });
    }
    else {
      let target;
      for (let i in this.editUserForm.controls) {
        if (!this.editUserForm.controls[i].valid) {
          target = this.editUserForm.controls[i];
          break;
        }
      }
      if (target) {
        this.spinnerFlag = false;

        const el = $('.ng-invalid:not(form):first');
        $('html,body').animate({ scrollTop: (el.offset().top - 100) }, 'slow', () => {
          el.focus();
        });
      }
    }
  }

  getContractFile() {
    this.step3Child.showLoadingFlg = true;
    this._sharedService.getContractFile().subscribe((response: any) => {
      this.step3Child.showLoadingFlg = false;
      if (Common.checkStatusCode(response.header.statusCode)) {
        this.contractFileUrl = response.payload.result.url;
        this.showStep2 = false;
        this.showStep3 = true;
      }
      else {
        if (response.header.message) {
          this.toastrService.error(response.header.message);
        }
      }
    },
      error => {
        this.toastrService.error(this.commonLabels.errorMessages.responseError);
        this.step3Child.showLoadingFlg = false;
      })
  }

  contractAccepted() {
    this._freelancerActivationService.acceptContractTerm().subscribe((response: any) => {

      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        $('#contractTermsAndConditionsCheck').attr('disabled', true);
        this.sessionService.setSessionItem(COOKIES_CONSTANTS.authToken, response.payload.token);
        this.toastrService.success(response.header.message);
        this.continueToProfile();
      }
      else {
        this._rolePermission.disableButtonFlag = false;
        this._rolePermission.spinnerFlag = false;
        this.toastrService.error(response.header.message);
      }
    },
      error => {
        this._rolePermission.disableButtonFlag = false;
        this._rolePermission.spinnerFlag = false;
        this.toastrService.error(this.commonLabels.errorMessages.responseError);
      });
  }
  continueToProfile() {
    const authToken = this.sessionService.getSessionItem(COOKIES_CONSTANTS.authToken);
    this.sessionService.setCookie(COOKIES_CONSTANTS.authToken, authToken);
    this.sessionService.removeSessionItem(COOKIES_CONSTANTS.authToken);
    this.getUserInfo();
  }

  setLandingPage(landingModuleId) {
    this.menuList.forEach(element => {
      if (landingModuleId == element.moduleId) {
        /**temporary navigating to login page*/
        // this.router.navigate(ROUTER_LINKS_FULL_PATH.login);
        // this.sessionService.setLocalStorageItem('landingPage', ROUTER_LINKS_FULL_PATH.login);
        //   this.router.navigate(ROUTER_LINKS_FULL_PATH.login);
        this.sessionService.setLocalStorageItem('landingPage', element.link);
        this.router.navigate([element.link]);
      }
    })
  }
  getUserInfo() {
    this._freelancerActivationService.getUserInfo().subscribe((result: any) => {

      if (Common.checkStatusCode(result.header.statusCode)) {
        if (result.payload) {
          const userInfoData = result.payload;
          const rolesObj = (userInfoData.rolesDetails.length > 0) ? userInfoData.rolesDetails[0] : {};
          const userInfo = {
            id: userInfoData.id,
            name: userInfoData.i18n.displayName,
            profilePicUrl: userInfoData.profilePicUrl,
            roleId: rolesObj.id,
            roleName: rolesObj.roleName,
            rolesDetails: rolesObj.rolesDetails,
            emailId: userInfoData.emailId
          };
          if (userInfoData.rolePermission) {
            userInfo['roleModulePermissions'] = this.encryptData(userInfoData.rolePermission);
          }
          this.sharedData.setUsersInfo(userInfo);
          this.getUserAccessPermission(rolesObj.id);
          this.toastrService.success(this.commonLabels.labels.successfullLogin);
        }

      }
    }, error => {
      this._rolePermission.disableButtonFlag = false;
      this._rolePermission.spinnerFlag = false;
    });
  }

  getUserAccessPermission(roleId: String) {
    this._sharedService.getAccessRolePermissionDetails(roleId).subscribe((response: any) => {
      if (Common.checkStatusCode(response.header.statusCode)) {
        if (response.payload && response.payload.result) {
          const userRoleAccessInfoData = response.payload.result;
          this.sessionService.setSessionItem(COOKIES_CONSTANTS.authToken, userRoleAccessInfoData['authToken']);
          this.sessionService.setCookie(COOKIES_CONSTANTS.authToken, userRoleAccessInfoData['authToken']);

          const userInfoData = this.sharedData.getUsersInfo();
          if (userRoleAccessInfoData.rolePermissions) {
            userInfoData['rolePermission'] = userRoleAccessInfoData.rolePermissions;
          }
          this.sharedData.setUsersInfo(userInfoData);
          this._rolePermission.setRolePermissionObj(response.payload.result);
        }
      }
    },
    error => {
      this._rolePermission.spinnerFlag = false;
      this.toastrService.error(this.commonLabels.errorMessages.error);
    });
  }


  /*user defined functions/methods after life cycle events-public methods,private methods*/
  /*
* This method is used to encrypt Role Permission data.
*/
  encryptData(data: any) {
    const rolePermissionJSONData = this._encriptionService.setEncryptedData(JSON.stringify(data), ROLE_PERMISSION_KEY);
    return rolePermissionJSONData.toString();
  }

  /*image upload functionality*/
  fileChangeListener(event) {
    this.cropper.reset();
    if (event.target.files[0]) {

      const size = parseInt(event.target.files[0].size) * 0.001;
      // if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg') {
      if (size <= MEDIA_SIZES.IMAGES_IN_KB) {
        this.classicModal.show();
        const image: any = new Image();
        const file: File = event.target.files[0];
        const myReader: FileReader = new FileReader();
        const that = this;
        myReader.onloadend = function (loadEvent: any) {

          image.src = loadEvent.target.result;
          setTimeout(function () { that.cropper.setImage(image); }, 500);

        };
        myReader.readAsDataURL(file);
        event.target.value = '';
      } else {
        event.target.value = '';
        this.toastrService.error(this.commonLabels.errorMessages.uploadImageLessThan + ' ' + MEDIA_SIZES.IMAGES_IN_MB);
      }
    }
  }
  cropped() {
    this.showFile();
    this.onHidden();
  }
  onHidden() {
    $('#f02').val('');
    this.classicModal.hide();
  }

  showFile() {
    const file = Common.dataURLtoFile(this.croppedData.image, 'coverphoto.jpg');

    const formData = this.setFormData(file);
    this.uploadFile(formData, false);
  }
  /*image upload functionality*/

  /*multiple image upload functionality*/
  fileChangeEvent(event, documentType) {
    this.checkDocumentValidation(documentType);
  }

  getFileType(file) {
    let fileNameArr = file.name.split(".");
    let type = fileNameArr[fileNameArr.length - 1];
    return type;
  }
  setFormData(file) {
    let formData: FormData = new FormData();
    formData.append('file', file);
    return formData;
  }
  uploadFile(formData, isDocument, documentType: any = "", obj: any = {}, index: any = 0) {
    this.disableButtonFlag = true;
    let localThis = this;
    if (!this.multipleDocumentUpload[documentType]) {
      this.multipleDocumentUpload[documentType] = [];
    }
    if (!this.multipleDocumentUpload[documentType][index]) {
      this.multipleDocumentUpload[documentType][index] = false;
    }
    this.multipleDocumentUpload[documentType][index] = false;

    this._sharedService.uploadFile(formData).subscribe((imageResponse: any) => {
      this.multipleDocumentUpload[documentType][index] = true;
      if (Common.checkStatusCode(imageResponse.header.statusCode)) {
        let data = imageResponse.payload.result;
        if (isDocument) {
          obj.url = data.url;
          delete obj['inProgress'];
          this.setDocumentId(data.id, documentType);
        }
        else {
          this.profileImageUrl = data.url;
          this.editUserForm.patchValue({
            profilePicFileId: data.id,
          });

          setTimeout(function () {
            localThis.toastrService.success(localThis.commonLabels.labels.photoUploadSuccess);
          }, 1500);
          this.disableButtonFlag = false;

        }
      } else {
        if (imageResponse.header) {
          this.toastrService.error(imageResponse.header.message);
        } else {
          this.toastrService.error(this.commonLabels.errorMessages.responseError);
        }

        this.disableButtonFlag = false;
      }

    },
      error => {
        this.multipleDocumentUpload[documentType][index] = true;
        this.toastrService.error(this.commonLabels.errorMessages.responseError);
      });


  }
  setDocumentId(documentId, documentType) {
    switch (documentType) {
      case DOCUMENT_TYPES.constancia:
        this.documents.selectedConstantiaDocs.push({ 'fileId': documentId });
        break;

      case DOCUMENT_TYPES.ttd:
        this.documents.selected32DDocs.push({ 'fileId': documentId });
        break;

      case DOCUMENT_TYPES.passport:
        this.documents.selectedPassportDocs.push({ 'fileId': documentId });
        break;

      case DOCUMENT_TYPES.others:
        this.documents.selectedOtherDocs.push({ 'fileId': documentId, "name": "" });
        break;

    }

  }
  checkFileTypeOfConstenciaAndOpinionDocuments(filetype) {
    const validtype = _.find(CONSTANCIA_OPINION_FILE_TYPES, { 'type': filetype.toLowerCase() });
    if (validtype) {
      return true;
    }
    else {
      return false;
    }
  }
  checkDocumentValidation(documentType) {
    switch (documentType) {
      case DOCUMENT_TYPES.constancia:
        var totalAttachFileSize = 0;
        // tslint:disable-next-line:forin
        for (let i in this.uploaderConstancia.queue) {
          totalAttachFileSize = totalAttachFileSize + this.uploaderConstancia.queue[i].file.size;
        }

        if (totalAttachFileSize > 50 * 1024 * 1024) {
          this.toastrService.error(this.commonLabels.errorMessages.documentLessThan50);
          // this.uploaderConstancia.clearQueue();
          // this.uploaderConstancia.queue[this.uploaderConstancia.queue.length - 1].remove();
          for (let i = 0; i < this.uploaderConstancia.queue.length; i++) {
            if (!this.uploaderConstancia.queue[i].url) {
              this.uploaderConstancia.queue[i].remove();
              i--;
            }
          }
        }
        else {
          for (let i = 0; i < this.uploaderConstancia.queue.length; i++) {
            let filesize = this.uploaderConstancia.queue[i].file.size;
            if (filesize > 10 * 1024 * 1024) {
              this.toastrService.error(this.commonLabels.errorMessages.documentLessThan10);
              this.uploaderConstancia.queue[i].remove();
              i--;
            }
            else {
              let file = this.uploaderConstancia.queue[i]._file;
              let type = this.getFileType(file);
              if (!this.uploaderConstancia.queue[i].url) {
                if (!this.uploaderConstancia.queue[i].url && !this.uploaderConstancia.queue[i]['inProgress']) {
                  if (!this.checkFileTypeOfConstenciaAndOpinionDocuments(type)) {
                    this.toastrService.error(this.commonLabels.errorMessages.invalidFileType);
                    this.uploaderConstancia.queue[i].remove();
                    i--;
                  }
                  else {
                    let formData = this.setFormData(file);
                    this.uploaderConstancia.queue[i]['inProgress'] = true;
                    this.uploadFile(formData, true, documentType, this.uploaderConstancia.queue[i], i);
                  }
                }
              }
            }
          }
        }
        if (this.uploaderConstancia.queue.length > 0) {
          this.editUserForm.controls['constantiaDocument'].setValue('uploaded')
        }
        else {
          this.editUserForm.controls['constantiaDocument'].setValue('')
        }
        break;

      case DOCUMENT_TYPES.ttd:
        var totalAttachFileSize = 0;
        // tslint:disable-next-line:forin
        for (const i in this.uploader32D.queue) {
          totalAttachFileSize = totalAttachFileSize + this.uploader32D.queue[i].file.size;
        }

        if (totalAttachFileSize > 50 * 1024 * 1024) {
          this.toastrService.error(this.commonLabels.errorMessages.documentLessThan50);
          // this.uploader32D.clearQueue();
          // this.uploader32D.queue[this.uploader32D.queue.length - 1].remove();
          for (let i = 0; i < this.uploader32D.queue.length; i++) {
            if (!this.uploader32D.queue[i].url) {
              this.uploader32D.queue[i].remove();
              i--;
            }
          }
        }
        else {
          for (let i = 0; i < this.uploader32D.queue.length; i++) {
            let filesize = this.uploader32D.queue[i].file.size;
            if (filesize > 10 * 1024 * 1024) {
              this.toastrService.error(this.commonLabels.errorMessages.documentLessThan10);
              this.uploader32D.queue[i].remove();
              i--;
            }
            else {
              let file = this.uploader32D.queue[i]._file;
              let type = this.getFileType(file);
              if (!this.uploader32D.queue[i].url) {
                if (!this.uploader32D.queue[i].url && !this.uploader32D.queue[i]['inProgress']) {
                  if (!this.checkFileTypeOfConstenciaAndOpinionDocuments(type)) {
                    this.toastrService.error(this.commonLabels.errorMessages.invalidFileType);
                    this.uploader32D.queue[i].remove();
                    i--;
                  }
                  else {
                    let formData = this.setFormData(file);
                    this.uploader32D.queue[i]['inProgress'] = true;
                    this.uploadFile(formData, true, documentType, this.uploader32D.queue[i], i);
                  }
                }
              }
            }
          }
        }

        if (this.uploader32D.queue.length > 0) {
          this.editUserForm.controls['ttDocument'].setValue('uploaded')
        }
        else {
          this.editUserForm.controls['ttDocument'].setValue('')
        }
        break;

      case DOCUMENT_TYPES.passport:
        var totalAttachFileSize = 0;
        // tslint:disable-next-line:forin
        for (let i in this.uploaderPassport.queue) {
          totalAttachFileSize = totalAttachFileSize + this.uploaderPassport.queue[i].file.size;
        }

        if (totalAttachFileSize > 50 * 1024 * 1024) {
          this.toastrService.error(this.commonLabels.errorMessages.documentLessThan50);
          // this.uploaderPassport.clearQueue();
          // this.uploaderPassport.queue[this.uploaderPassport.queue.length - 1].remove();
          for (let i = 0; i < this.uploaderPassport.queue.length; i++) {
            if (!this.uploaderPassport.queue[i].url) {
              this.uploaderPassport.queue[i].remove();
              i--;
            }
          }
        }
        else {
          for (let i = 0; i < this.uploaderPassport.queue.length; i++) {
            let filesize = this.uploaderPassport.queue[i].file.size;
            if (filesize > 10 * 1024 * 1024) {
              this.toastrService.error(this.commonLabels.errorMessages.documentLessThan10);
              this.uploaderPassport.queue[i].remove();
              i--;
            }
            else {
              let file = this.uploaderPassport.queue[i]._file;
              let type = this.getFileType(file);
              if (!this.uploaderPassport.queue[i].url) {
                if (!this.uploaderPassport.queue[i].url && !this.uploaderPassport.queue[i]['inProgress']) {
                  if (!this.checkFileType(type)) {
                    this.toastrService.error(this.commonLabels.errorMessages.invalidFileType);
                    this.uploaderPassport.queue[i].remove();
                    i--;
                  }
                  else {
                    let formData = this.setFormData(file);
                    this.uploaderPassport.queue[i]['inProgress'] = true;
                    this.uploadFile(formData, true, documentType, this.uploaderPassport.queue[i], i);
                  }
                }
              }
            }
          }
        }

        if (this.uploaderPassport.queue.length > 0) {
          this.editUserForm.controls['passportDocument'].setValue('uploaded')
        }
        else {
          this.editUserForm.controls['passportDocument'].setValue('')
        }
        break;

      case DOCUMENT_TYPES.others:
        var totalAttachFileSize = 0;
        // tslint:disable-next-line:forin
        for (let i in this.uploaderOthers.queue) {
          totalAttachFileSize = totalAttachFileSize + this.uploaderOthers.queue[i].file.size;
        }

        if (totalAttachFileSize > 50 * 1024 * 1024) {
          this.toastrService.error(this.commonLabels.errorMessages.documentLessThan50);
          // this.uploaderOthers.clearQueue();
          // this.uploaderOthers.queue[this.uploaderOthers.queue.length - 1].remove();
          for (let i = 0; i < this.uploaderOthers.queue.length; i++) {
            if (!this.uploaderOthers.queue[i].url) {
              this.uploaderOthers.queue[i].remove();
              i--;
            }
          }
        }
        else {
          for (let i = 0; i < this.uploaderOthers.queue.length; i++) {
            let filesize = this.uploaderOthers.queue[i].file.size;
            if (filesize > 10 * 1024 * 1024) {
              this.toastrService.error(this.commonLabels.errorMessages.documentLessThan10);
              this.uploaderOthers.queue[i].remove();
              i--;
            }
            else {
              let file = this.uploaderOthers.queue[i]._file;
              let type = this.getFileType(file);
              if (!this.uploaderOthers.queue[i].url) {
                if (!this.uploaderOthers.queue[i].url && !this.uploaderOthers.queue[i]['inProgress']) {
                  if (!this.checkFileType(type)) {
                    this.toastrService.error(this.commonLabels.errorMessages.invalidFileType);
                    this.uploaderOthers.queue[i].remove();
                    i--;
                  }
                  else {
                    let formData = this.setFormData(file);
                    this.uploaderOthers.queue[i]['inProgress'] = true;
                    this.uploadFile(formData, true, documentType, this.uploaderOthers.queue[i], i);
                  }
                }
              }
            }
          }
        }

    }
  }

  removeUploadFileArrItem(index, documentType, item) {
    this.checkDocumentValidation(documentType);
    const swalObj = Common.swalConfirmPopupObj(this.commonLabels.labels.deleteAdvanceMsg, true, true);
    switch (documentType) {
      case DOCUMENT_TYPES.constancia:
        swal(swalObj, (isConfirm) => {
          if (isConfirm) {
            item.remove();
            this.documents.selectedConstantiaDocs.splice(index, 1);
          }
        });
        break;

      case DOCUMENT_TYPES.ttd:
        swal(swalObj, (isConfirm) => {
          if (isConfirm) {
            item.remove();
            this.documents.selected32DDocs.splice(index, 1);
          }
        });
        break;

      case DOCUMENT_TYPES.passport:
        swal(swalObj, (isConfirm) => {
          if (isConfirm) {
            item.remove();
            this.documents.selectedPassportDocs.splice(index, 1);
          }
        });
        break;
      case DOCUMENT_TYPES.others:
        swal(swalObj, (isConfirm) => {
          if (isConfirm) {
            item.remove();
            this.documents.selectedOtherDocs.splice(index, 1);
          }
        });
        break;

    }
  }
  setDocumentName(index) {
    let fileName = $('#docName' + index).val();
    this.documents.selectedOtherDocs[index].name = fileName;

  }
  checkFileType(filetype) {
    const validtype = _.find(FILE_TYPES, { 'type': filetype.toLowerCase() });
    if (validtype) {
      return true;
    }
    else {
      return false;
    }

  }

  setLanguage(value) {
    this.selectedLang = value;
    this.sessionService.setCookie(COOKIES_CONSTANTS.langCode, value);
    this.translatorService.useLanguage(value);
  }
  /*multiple image upload functionality*/

}
