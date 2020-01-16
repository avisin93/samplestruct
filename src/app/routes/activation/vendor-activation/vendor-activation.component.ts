
import { Component, OnInit, ViewChild, ViewEncapsulation, HostListener } from '@angular/core';
import { FormControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import {
  CURRENCIES, FILE_TYPES, ROLES, VENDOR_TYPE, DOCUMENT_TYPES,
  OPERATION_MODES, ROUTER_LINKS_FULL_PATH, MEDIA_SIZES, PAID_TYPES,
  PAYMENT_TYPES, MENU_CONFIG, COOKIES_CONSTANTS, STATUS_CODES, CONSTANCIA_OPINION_FILE_TYPES, LANGUAGE_CODES, TAG_NAME_TEXTAREA
} from '@app/config';
import { SharedData } from '@app/shared/shared.data';
import { Router, ActivatedRoute } from '@angular/router';
import { Common, SessionService, CustomValidators } from '@app/common';
import { ToastrService } from 'ngx-toastr';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';
import { Md5 } from 'ts-md5';
import { SharedService } from '@app/shared/shared.service';
import { VendorActivationService } from './vendor-activation.service';
import { VendorActivationData } from './vendor-activation.data.model';
import { TranslateService } from '@ngx-translate/core';
import { TranslatorService } from '@app/core/translator/translator.service';
import * as _ from 'lodash';
import { StepThreeActivationComponent } from '../common/step-three-activation/step-three-activation.component';
import { StepOneActivationComponent } from '../common/step-one-activation/step-one-activation.component';
import { HeaderComponent } from '../common/header/header.component';
import { RolePermission } from '@app/shared/role-permission';

const swal = require('sweetalert');
const URL = '';
declare var $: any;
@Component({
  selector: 'app-vendor-activation',
  templateUrl: './vendor-activation.component.html',
  styleUrls: ['./vendor-activation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VendorActivationComponent implements OnInit {
  @ViewChild('step3Child') step3Child: StepThreeActivationComponent;
  userInfo: any;
  LANGUAGE_CODES = LANGUAGE_CODES;
  fileName: any;
  validtype: { 'type': string; };
  fileType: any;
  profileImageUrl: any;
  templateId: any;
  operation: any[];
  menuList = MENU_CONFIG;
  currencies: any;
  operationDropdown: any = [];
  currencyDropdown: any;
  authToken: any;
  token: any;
  vendorData: any;
  filesize: any;
  multipleDocumentUpload = [];
  fileTypes = FILE_TYPES;
  spinnerFlag: Boolean = false;
  filesToUpload: FileItem[];
  cropperSettings: CropperSettings;
  croppedData: any;
  @ViewChild('child') child: StepOneActivationComponent;
  @ViewChild('cropper', undefined) cropper: ImageCropperComponent;
  @ViewChild('classicModal') public classicModal: ModalDirective;
  ROUTER_LINKS_FULL_PATH = ROUTER_LINKS_FULL_PATH;
  CONSTANCIA_OPINION_FILE_TYPES = CONSTANCIA_OPINION_FILE_TYPES;
  OPERATION_MODES = OPERATION_MODES;
  PAYMENT_TYPES = PAYMENT_TYPES;
  // VENDOR_TYPE = VENDOR_TYPE;
  LOCALIZED_VENDOR_TYPE: { id: number; text: string; }[];
  CURRENCIES = CURRENCIES;
  vendorActivationForm: FormGroup;
  submitVendorForm: boolean = false;
  // disableButton: boolean = false;
  showStep2: boolean = false;
  hideStep1: boolean = false;
  flagConstancia: boolean = false;
  flag32D: boolean = false;
  flagRepId: boolean = false;
  flagByLaw: boolean = false;
  flagAC: boolean = false;
  flagIMSS: boolean = false;
  vendorID: any;
  rowIndex: any;
  vendorDetails: any;
  isClicked: Boolean = false;
  vendorArr: any = [];
  showStep3: Boolean = false;
  spinnerActivationflag: Boolean;
  cropperModalOpen: Boolean = false;
  submmitedStep3FormFlag: Boolean = false;
  step1disableButtonFlag: Boolean = false;
  showPage: Boolean = false;
  step3Form: FormGroup;
  currency: any = [];
  vendorPath = 'vendor';
  selectedLang: any;
  contractFileUrl: String = '';
  documents = {
    selectedConstantiaDocs: [],
    selected32DDocs: [],
    selectedRepID: [],
    selectedBylaw: [],
    selectedAddress: [],
    selectedIMSS: [],
    selectedOtherDocs: []
  };
  contractPdfLink = '../assets/pdf/VendorContract.pdf';
  breadcrumbData: any = {
    title: 'actors.vendors.labels.updateinfo'
  };
  tokenData: any = {};
  commonLabels: any;
  disableButtonFlag: Boolean = false;
  constructor(
    public translatorService: TranslatorService,
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private sharedData: SharedData,
    private router: Router,
    private route: ActivatedRoute,
    private _vendorActivation: VendorActivationService,
    private sessionService: SessionService,
    private _sharedService: SharedService,
    private translateService: TranslateService,
    private _rolePermission: RolePermission
  ) {
    // this.adapter.setLocale('en-in');
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
  ROLES = ROLES;
  public uploader: FileUploader = new FileUploader({ url: URL });
  public uploaderConstancia: FileUploader = new FileUploader({ url: URL });
  public uploader32D: FileUploader = new FileUploader({ url: URL });
  public uploaderidRepresentative: FileUploader = new FileUploader({ url: URL });
  public uploaderByLaw: FileUploader = new FileUploader({ url: URL });
  public uploaderAC: FileUploader = new FileUploader({ url: URL });
  public uploaderIMSS: FileUploader = new FileUploader({ url: URL });
  public uploaderOthers: FileUploader = new FileUploader({ url: URL });

  ngOnInit() {
    this.setLocalizedVendorTypes();
    this.selectedLang = this.sessionService.getCookie(COOKIES_CONSTANTS.langCode);
    this.translatorService.useLanguage(this.selectedLang);
    this.sessionService.deleteCookie(COOKIES_CONSTANTS.authToken);
    this.route.params.subscribe(params => {
      this.token = params['token'];
    })
    this.createActivationForm();
    this.addRepresentatives(false);
    this.createStep3Form();
    this.checkStatus();
    this.translateService.get('common').subscribe((res: string) => {
      this.commonLabels = res;
    });
  }
  ngAfterViewInit() {
    if (this.hideStep1) {
      this.spinnerActivationflag = this.child.spinnerFlag;
      this.step1disableButtonFlag = this.child.disableButtonFlag;
    }
  }
  setLocalizedVendorTypes() {
    let localThis = this;
    setTimeout(function () {
      localThis.LOCALIZED_VENDOR_TYPE = Common.changeDropDownValues(localThis.translateService, VENDOR_TYPE);
    }, 500);
  }
  checkStatus() {

    let authToken = this.sessionService.getSessionItem(COOKIES_CONSTANTS.authToken);
    if (authToken) {
      this.hideStep1 = false;
      this.userInfo = Common.parseJwt(authToken);
      if (this.userInfo.activationPending) {
        this.showStep2 = true;
        this.showStep3 = false;
        this.getPageDetails(authToken);
      } else {
        this.showStep2 = false;
        this.showStep3 = true;
        setTimeout(() => { this.getContractFile(); })
      }
      this.showPage = true;
    }
    else {
      this.tokenData = { 'token': this.token }
      this._sharedService.checkActivatonLink(this.tokenData).subscribe((response: any) => {
        if (response.header.statusCode == STATUS_CODES.LINK_EXPIRED) {
          this.showPage = false;
          this.hideStep1 = false;
          this.router.navigate([ROUTER_LINKS_FULL_PATH.login]).then(() => {
            this.toastrService.clear();
            this.toastrService.error(response.header.message);
          });
        } else {
          this.showPage = true;
          this.hideStep1 = true;
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
            this.addVendor();
          }
        } else {
          this.cropped();
        }
      }
    }
  }
  getPageDetails(authToken) {
    this.getTokenData(authToken);
    this.getCurrencies();
    this.getModeOfOperation();

  }
  createActivationForm() {
    this.vendorActivationForm = this.vendorActivationFormGroup();
  }
  createStep3Form() {
    this.step3Form = this.fb.group({
      isagreed: ['', [CustomValidators.required]],
      name: ['', [CustomValidators.required]],
      taxId: ['', [CustomValidators.required]]
    })
  }
  setDocumentName(index) {
    this.fileName = $('#docName' + index).val();
    this.documents.selectedOtherDocs[index].name = this.fileName;
  }
  vendorActivationFormGroup(): FormGroup {
    return this.fb.group({
      companyName: ['', [CustomValidators.required]],
      legalName: ['', [CustomValidators.required]],
      vendorType: ['', [CustomValidators.required]],
      mode: ['', [CustomValidators.required]],
      phone: ['', [CustomValidators.required, CustomValidators.checkNumber]],
      address: ['', [CustomValidators.required]],
      representatives: this.fb.array([]),
      acname: ['', [CustomValidators.required]],
      accNumber: ['', [CustomValidators.required, CustomValidators.checkNumber]],
      bankName: ['', [CustomValidators.required]],
      branchName: ['', [CustomValidators.required]],
      clabe: [''],
      swiftCode: [''],
      ABAcode: [''],
      sortCode: [''],
      documentType: [''],
      rfcCode: [''],
      taxId: ['', [CustomValidators.required]],
      selfPaid: ['1'],
      currency: ['', [CustomValidators.required]],
      docConstancia: [''],
      doc32D: [''],
      docRepId: [''],
      docByLaw: [''],
      docAC: [''],
      docIMSS: [''],
      electronic: [''],
      email: [''],
      roles: [''],
      profilePicFileId: [''],
      thirdParty: [''],
      commercial: [''],
      corporate: [''],
      entertainment: [''],
      classification: ['']

    });
  }
  setVendorFormValues(vendorFormDetails) {
    this.vendorActivationForm.patchValue({
      companyName: vendorFormDetails.i18n.commercialName,
      email: vendorFormDetails.emailId,
      classification: vendorFormDetails.classification,
      mode: vendorFormDetails.operationId,
      currency: vendorFormDetails.currencyId,
      taxId: vendorFormDetails.taxId,
      address: vendorFormDetails.address,
      electronic: vendorFormDetails.electronicIdNumber,
      roles: vendorFormDetails.roles[0],
      thirdParty: vendorFormDetails.acceptThirdPartyPayment,
      commercial: vendorFormDetails.commercial ? this.setCategoryIds(JSON.parse(JSON.stringify(vendorFormDetails.commercial))) : [],
      entertainment: vendorFormDetails.entertainment ? this.setCategoryIds(JSON.parse(JSON.stringify(vendorFormDetails.entertainment))) : [],
      corporate: vendorFormDetails.corporate ? this.setCategoryIds(JSON.parse(JSON.stringify(vendorFormDetails.corporate))) : [],

    })
  }
  setCategoryIds(categories) {
    let selectedCategories = [];
    for (let i = 0; i < categories.length; i++) {
      let mappingId = categories[i].mappingIds[0];
      selectedCategories.push(mappingId);
    }
    return selectedCategories;
  }
  getCurrencies() {
    this._sharedService.getCurrencies().subscribe((response: any) => {
      if (Common.checkStatusCode(response.header.statusCode)) {
        if (response.payload.results && response.payload.results) {
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
  getModeOfOperation() {
    this._sharedService.getModesOfOperation().subscribe((response: any) => {
      if (Common.checkStatusCode(response.header.statusCode)) {
        if (response.payload && response.payload.results) {
          this.operation = [];
          this.operation = response.payload.results;
          this.operationDropdown = Common.getMultipleSelectArr(this.operation, ['id'], ['i18n', 'name']);
        } else {
          this.operation = [];
        }
      }
      else {
        this.operation = [];
      }
    }, error => {
      this.operation = [];
    });
  }
  getTokenData(authToken) {
    let parsedData = Common.parseJwt(authToken);
    this.vendorID = parsedData.userId;
    this.getFreelancerDetails(this.vendorID);
    // this.editUserForm.controls['email'].setValue(parsedData.emailId);
  }
  getFreelancerDetails(id) {
    this._vendorActivation.getVendor(id).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.result) {
          this.vendorData = response.payload.result;
          let vendorFormDetails = this.vendorData;
          this.setVendorFormValues(vendorFormDetails);
        } else {
          this.vendorData = [];
        }
      } else {
        this.vendorData = [];
      }
    }, error => {
      this.vendorData = [];
    });
  }
  showNextStep(formValue) {
    this.spinnerActivationflag = true;
    this.step1disableButtonFlag = true
    if (formValue) {
      let obj = {
        'langCode': this.sessionService.getCookie(COOKIES_CONSTANTS.langCode),
        'password': Md5.hashStr(formValue.password)
      }
      this._vendorActivation.activateVendor(obj, this.token).subscribe((response: any) => {
        if (response.header.statusCode == 201) {
          this.spinnerActivationflag = false;
          this.step1disableButtonFlag = false;
          this.hideStep1 = false;
          this.authToken = response.payload.result.token;
          this.sessionService.setSessionItem(COOKIES_CONSTANTS.authToken, this.authToken);
          this.showRespectiveStep(this.authToken);
          this.toastrService.success(response.header.message);

        }
        else {
          this.spinnerActivationflag = false;
          this.step1disableButtonFlag = false;
          if (response.header.message) {
            this.toastrService.error(response.header.message);
          }
        }
      }, error => {
        this.spinnerActivationflag = false;
        this.step1disableButtonFlag = false;
        this.toastrService.error(this.commonLabels.errorMessages.responseError);
      })
    }

  }
  showRespectiveStep(token) {
    let parsedData = Common.parseJwt(token);
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
  representative(): FormGroup {
    return this.fb.group({
      repName: [''],
      repEmail: ['', [CustomValidators.checkEmail]],
      repPhone: ['', CustomValidators.checkNumber]
    });
  }
  addRepresentatives(checkValidation, index = 0) {
    const representatives = <FormArray>this.vendorActivationForm.controls['representatives'];
    if (checkValidation) {
      const repFormGrp = representatives.controls[index];
      if ((repFormGrp.value.repName != '' || repFormGrp.value.repEmail != '' || repFormGrp.value.repPhone != '') && repFormGrp.valid) {
        representatives.push(this.representative());
      }
    }
    else {
      representatives.push(this.representative());
    }

  }
  removeRepresentatives(eventIndex) {
    const representatives = <FormArray>this.vendorActivationForm.controls['representatives'];
    representatives.removeAt(eventIndex);
  }

  removeExtraBlankRowOfRepresentative() {
    const representatives = <FormArray>this.vendorActivationForm.controls['representatives'];
    const repFormGrp = representatives.controls[representatives.length - 1];
    if ((!repFormGrp.value.repName || !repFormGrp.value.repEmail || !repFormGrp.value.repPhone) && representatives.length > 1) {
      representatives.removeAt(representatives.length - 1);
    }
  }
  removeValidators() {
    if (this.vendorActivationForm.value.selfPaid == '2') {
      this.vendorActivationForm.patchValue({
        ABAcode: '',
        swiftCode: ''
      });
    }
    if (this.vendorActivationForm.value.selfPaid == '1') {
      this.vendorActivationForm.patchValue({
        clabe: '',
        sortCode: '',
        rfcCode: '',
      })
    }
  }

  getFileType(file) {
    const fileNameArr = file.name.split('.');
    const type = fileNameArr[fileNameArr.length - 1];
    const typeLowercase = type.toLowerCase();
    return typeLowercase;
  }


  addVendor() {
    this.submitVendorForm = true;
    this.spinnerFlag = true;
    this.removeExtraBlankRowOfRepresentative();
    if (this.vendorActivationForm.valid) {
      this.isClicked = true;
      this.disableButtonFlag = true;
      let formvalue = this.vendorActivationForm.value;
      formvalue['langCode'] = this.sessionService.getCookie(COOKIES_CONSTANTS.langCode);
      let finalVendorData = VendorActivationData.getWebServiceDetailsData(formvalue, this.documents);
      finalVendorData['id'] = this.vendorID;
      this._vendorActivation.updateVendor(finalVendorData, this.vendorID).subscribe((response: any) => {
        this.disableButtonFlag = false;
        if (Common.checkStatusCodeInRange(response.header.statusCode)) {
          this.isClicked = false;
          this.spinnerFlag = false;
          this.sessionService.setSessionItem(COOKIES_CONSTANTS.authToken, response.payload.token);
          this.showStep2 = false;
          this.showStep3 = true;
          setTimeout(() => { this.getContractFile(); })
          this.toastrService.success(response.header.message);
        } else {
          this.spinnerFlag = false;
          if (response.header.message) {
            this.toastrService.error(response.header.message);
          }
        }
      }, error => {
        this.spinnerFlag = false;
        this.isClicked = false;
        this.disableButtonFlag = false;
        this.toastrService.error(this.commonLabels.errorMessages.responseError);
      });

    }
    else {
      let target;
      for (var i in this.vendorActivationForm.controls) {
        if (!this.vendorActivationForm.controls[i].valid) {
          target = this.vendorActivationForm.controls[i];
          break;
        }
      }
      if (target) {
        this.spinnerFlag = false;
        let el = $('.ng-invalid:not(form):first');
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
    this._vendorActivation.acceptContractTerm().subscribe((response: any) => {
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
    let authToken = this.sessionService.getSessionItem(COOKIES_CONSTANTS.authToken);
    this.sessionService.setCookie(COOKIES_CONSTANTS.authToken, authToken);
    this.sessionService.removeSessionItem(COOKIES_CONSTANTS.authToken);
    this.getUserInfo();

  }

  getUserInfo() {
    this._vendorActivation.getUserInfo().subscribe((result: any) => {

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
            rolesDetails: userInfoData.rolesDetails,
            emailId: userInfoData.emailId
          };
          this.sharedData.setUsersInfo(userInfo);
          this.getUserAccessPermission(rolesObj.id);
          // this.setRolePermissions(URL_PATHS.vendorPermissionURL);
          //this._rolePermission.setRolePermissionWithNavigateUser(userInfoData);
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
            userInfoData['roleModulePermissions'] = userRoleAccessInfoData.rolePermissions;
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

  vendorContinue() {
    this.router.navigate([ROUTER_LINKS_FULL_PATH.login]);
  }

  /*image upload functionality*/
  fileChangeListener(event) {
    this.cropper.reset();
    if (event.target.files[0]) {
      var size = parseInt(event.target.files[0].size) * 0.001;
      if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg'
        || event.target.files[0].type == 'image/bmp' || event.target.files[0].type == 'image/png') {
        if (size <= MEDIA_SIZES.IMAGES_IN_KB) {
          this.classicModal.show();
          const image: any = new Image();
          const file: File = event.target.files[0];
          const myReader: FileReader = new FileReader();
          const that = this;
          //this.cropper = {};
          myReader.onloadend = function (loadEvent: any) {
            image.src = loadEvent.target.result;
            // that.cropper.setImage(image);
            setTimeout(function () { that.cropper.setImage(image); }, 500);
          };
          myReader.readAsDataURL(file);
          event.target.value = '';
        } else {
          event.target.value = '';
          this.toastrService.error(this.commonLabels.errorMessages.uploadImageLessThan + ' ' + MEDIA_SIZES.IMAGES_IN_MB);
        }
      } else {
        event.target.value = '';
        this.toastrService.error(this.commonLabels.errorMessages.uploadTypeError);
      }
    }
  }
  cropped() {
    this.showFile();
    this.onHidden();
    this.croppedData = {};
  }
  onHidden() {
    $('#f02').val('');
    this.classicModal.hide();
  }

  showFile() {
    this.disableButtonFlag = true;
    this.authToken = this.sessionService.getCookie(COOKIES_CONSTANTS.authToken);
    this.sessionService.setCookie(COOKIES_CONSTANTS.authToken, this.authToken);
    var file = Common.dataURLtoFile(this.croppedData.image, 'coverphoto.jpg');
    const formData: FormData = new FormData();
    formData.append('file', file);
    this._sharedService.uploadFile(formData).subscribe((imageResponse: any) => {
      if (Common.checkStatusCodeInRange(imageResponse.header.statusCode)) {
        if (imageResponse.payload && imageResponse.payload.result) {
          const data = imageResponse.payload.result;
          this.profileImageUrl = data.url;
          this.vendorActivationForm.patchValue({
            profilePicFileId: data.id,
          });
          var localThis = this;
          setTimeout(function () {
            localThis.toastrService.success(localThis.commonLabels.labels.photoUploadSuccess);
          }, 1500);
          this.disableButtonFlag = false;
          //this.pushUploadedCoverPhoto(imageResponse);
        }
      } else {
        if (imageResponse.header) {
          this.toastrService.error(imageResponse.header.message);
        } else {
          this.toastrService.error(this.commonLabels.errorMessages.responseError);
        }
      }

    });
  }
  /*image upload functionality*/
  /*multiple image upload functionality*/
  fileChangeEvent(event, documentType) {
    this.disableButtonFlag = true;
    this.checkDocumentValidation(documentType);
  }

  ngDoCheck(): void {
    this.checkFileUploadingStatus();
  }

  checkFileUploadingStatus() {
    if (this.multipleDocumentUpload.length > 0 && this.disableButtonFlag) {
      let disableButtonFlag = false;
      // tslint:disable-next-line:forin
      for (var documentArr in this.multipleDocumentUpload) {
        for (let index = 0; index < this.multipleDocumentUpload[documentArr].length; index++) {
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

  uploadDocument(obj, formData, type, index) {
    if (!this.multipleDocumentUpload[type]) {
      this.multipleDocumentUpload[type] = [];
    }
    if (!this.multipleDocumentUpload[type][index]) {
      this.multipleDocumentUpload[type][index] = false;
    }
    this.multipleDocumentUpload[type][index] = false;

    this.disableButtonFlag = true;
    this._sharedService.uploadFile(formData).subscribe((imageResponse: any) => {
      if (Common.checkStatusCode(imageResponse.header.statusCode)) {
        let data = imageResponse.payload.result;
        obj.url = data.url;
        delete obj['inProgress'];
        this.setdocumentId(data.id, type);
      } else {
        if (imageResponse.header) {
          this.toastrService.error(imageResponse.header.message);
        } else {
          this.toastrService.error(this.commonLabels.errorMessages.responseError);
        }
      }
      this.multipleDocumentUpload[type][index] = true;

    },
      error => {
        this.multipleDocumentUpload[type][index] = true;
        this.toastrService.error(this.commonLabels.errorMessages.responseError);
      });



  }

  setdocumentId(documentId, documentType) {
    switch (documentType) {
      case DOCUMENT_TYPES.constancia:
        this.documents.selectedConstantiaDocs.push({ 'fileId': documentId });
        break;

      case DOCUMENT_TYPES.ttd:
        this.documents.selected32DDocs.push({ 'fileId': documentId });
        break;

      case DOCUMENT_TYPES.repID:
        this.documents.selectedRepID.push({ 'fileId': documentId });
        break;
      case DOCUMENT_TYPES.byLaw:
        this.documents.selectedBylaw.push({ 'fileId': documentId });
        break;

      case DOCUMENT_TYPES.addressConfirmation:
        this.documents.selectedAddress.push({ 'fileId': documentId });
        break;

      case DOCUMENT_TYPES.imss:
        this.documents.selectedIMSS.push({ 'fileId': documentId });
        break;


      case DOCUMENT_TYPES.others:
        this.documents.selectedOtherDocs.push({ 'fileId': documentId, 'name': this.fileName });
        break;
    }
  }

  checkFileType(filetype) {
    this.validtype = _.find(this.fileTypes, { 'type': filetype });
    if (this.validtype) {
      return true;
    } else {
      return false;
    }
  }

  checkFileTypeOfConstenciaAndOpinionDocuments(filetype) {
    const validtype = _.find(CONSTANCIA_OPINION_FILE_TYPES, { 'type': filetype.toLowerCase() });
    if (validtype) {
      return true;
    } else {
      return false;
    }
  }

  setFormData(file) {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return formData;
  }

  checkDocumentValidation(documentType) {
    switch (documentType) {
      case DOCUMENT_TYPES.constancia:
        var totalAttachFileSize = 0;
        // tslint:disable-next-line:forin
        for (const i in this.uploaderConstancia.queue) {
          totalAttachFileSize = totalAttachFileSize + this.uploaderConstancia.queue[i].file.size;
        }
        if (totalAttachFileSize > 50 * 1024 * 1024) {
          this.toastrService.error(this.commonLabels.errorMessages.documentLessThan50);
          for (let i = 0; i < this.uploaderConstancia.queue.length; i++) {
            if (!this.uploaderConstancia.queue[i].url) {
              this.uploaderConstancia.queue[i].remove();
              i--;
            }
          }
        } else {
          for (let i = 0; i < this.uploaderConstancia.queue.length; i++) {
            const filesize = this.uploaderConstancia.queue[i].file.size;
            if (filesize > 10 * 1024 * 1024) {
              this.toastrService.error(this.commonLabels.errorMessages.documentLessThan10);
              this.uploaderConstancia.queue[i].remove();
              i--;
            }
            else {
              const file = this.uploaderConstancia.queue[i]._file;
              const type = this.getFileType(file);
              if (!this.uploaderConstancia.queue[i].url) {
                if (!this.uploaderConstancia.queue[i].url && !this.uploaderConstancia.queue[i]['inProgress']) {
                  if (!this.checkFileTypeOfConstenciaAndOpinionDocuments(type)) {
                    this.toastrService.error(this.commonLabels.errorMessages.invalidFileType);
                    this.uploaderConstancia.queue[i].remove();
                    i--;
                  }
                  else {
                    const formData = this.setFormData(file);
                    this.uploaderConstancia.queue[i]['inProgress'] = true;
                    this.uploadDocument(this.uploaderConstancia.queue[i], formData, documentType, i);
                  }
                }
              } else {
                // this.filesCounter++;
              }
            }
          }
        }

        if (this.uploaderConstancia.queue.length > 0) {
          this.vendorActivationForm.controls['docConstancia'].setValue('uploaded');
        }
        else {
          this.vendorActivationForm.controls['docConstancia'].setValue('');
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
          for (let i = 0; i < this.uploader32D.queue.length; i++) {
            if (!this.uploader32D.queue[i].url) {
              this.uploader32D.queue[i].remove();
              i--;
            }
          }
        } else {
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
                    this.uploadDocument(this.uploader32D.queue[i], formData, documentType, i);
                  }
                }
              } else {
                // this.filesCounter++;
              }
            }
          }
        }

        if (this.uploader32D.queue.length > 0) {
          this.vendorActivationForm.controls['doc32D'].setValue('uploaded');
        }
        else {
          this.vendorActivationForm.controls['doc32D'].setValue('');
        }
        break;
      case DOCUMENT_TYPES.repID:
        var totalAttachFileSize = 0;
        // tslint:disable-next-line:forin
        for (let i in this.uploaderidRepresentative.queue) {
          totalAttachFileSize = totalAttachFileSize + this.uploaderidRepresentative.queue[i].file.size;
        }
        if (totalAttachFileSize > 50 * 1024 * 1024) {
          this.toastrService.error(this.commonLabels.errorMessages.documentLessThan50);
          for (let i = 0; i < this.uploaderidRepresentative.queue.length; i++) {
            if (!this.uploaderidRepresentative.queue[i].url) {
              this.uploaderidRepresentative.queue[i].remove();
              i--;
            }
          }
        } else {
          for (let i = 0; i < this.uploaderidRepresentative.queue.length; i++) {
            let filesize = this.uploaderidRepresentative.queue[i].file.size;
            if (filesize > 10 * 1024 * 1024) {
              this.toastrService.error(this.commonLabels.errorMessages.documentLessThan10);
              this.uploaderidRepresentative.queue[i].remove();
              i--;
            }
            else {
              let file = this.uploaderidRepresentative.queue[i]._file;
              let type = this.getFileType(file);
              if (!this.uploaderidRepresentative.queue[i].url) {
                if (!this.uploaderidRepresentative.queue[i].url && !this.uploaderidRepresentative.queue[i]['inProgress']) {
                  if (!this.checkFileType(type)) {
                    this.toastrService.error(this.commonLabels.errorMessages.invalidFileType);
                    this.uploaderidRepresentative.queue[i].remove();
                    i--;
                  }
                  else {
                    let formData = this.setFormData(file);
                    this.uploaderidRepresentative.queue[i]['inProgress'] = true;
                    this.uploadDocument(this.uploaderidRepresentative.queue[i], formData, documentType, i);
                  }
                }
              } else {
                // this.filesCounter++;
              }
            }
          }
        }

        if (this.uploaderidRepresentative.queue.length > 0) {
          this.vendorActivationForm.controls['docRepId'].setValue('uploaded')
        }
        else {
          this.vendorActivationForm.controls['docRepId'].setValue('')
        }
        break;
      case DOCUMENT_TYPES.byLaw:
        var totalAttachFileSize = 0;
        // tslint:disable-next-line:forin
        for (let i in this.uploaderByLaw.queue) {
          totalAttachFileSize = totalAttachFileSize + this.uploaderByLaw.queue[i].file.size;
        }
        if (totalAttachFileSize > 50 * 1024 * 1024) {
          this.toastrService.error(this.commonLabels.errorMessages.documentLessThan50);
          for (let i = 0; i < this.uploaderByLaw.queue.length; i++) {
            if (!this.uploaderByLaw.queue[i].url) {
              this.uploaderByLaw.queue[i].remove();
              i--;
            }
          }
        } else {
          for (let i = 0; i < this.uploaderByLaw.queue.length; i++) {
            let filesize = this.uploaderByLaw.queue[i].file.size;
            if (filesize > 10 * 1024 * 1024) {
              this.toastrService.error(this.commonLabels.errorMessages.documentLessThan10);
              this.uploaderByLaw.queue[i].remove();
              i--;
            }
            else {
              let file = this.uploaderByLaw.queue[i]._file;
              let type = this.getFileType(file);
              if (!this.uploaderByLaw.queue[i].url) {
                if (!this.uploaderByLaw.queue[i].url && !this.uploaderByLaw.queue[i]['inProgress']) {
                  if (!this.checkFileType(type)) {
                    this.toastrService.error(this.commonLabels.errorMessages.invalidFileType);
                    this.uploaderByLaw.queue[i].remove();
                    i--;
                  }
                  else {
                    let formData = this.setFormData(file);
                    this.uploaderByLaw.queue[i]['inProgress'] = true;
                    this.uploadDocument(this.uploaderByLaw.queue[i], formData, documentType, i);
                  }
                }
              } else {
                // this.filesCounter++;
              }
            }
          }
        }

        if (this.uploaderByLaw.queue.length > 0) {
          this.vendorActivationForm.controls['docByLaw'].setValue('uploaded')
        }
        else {
          this.vendorActivationForm.controls['docByLaw'].setValue('')
        }
        break;
      case DOCUMENT_TYPES.addressConfirmation:
        var totalAttachFileSize = 0;
        // tslint:disable-next-line:forin
        for (let i in this.uploaderAC.queue) {
          totalAttachFileSize = totalAttachFileSize + this.uploaderAC.queue[i].file.size;
        }
        if (totalAttachFileSize > 50 * 1024 * 1024) {
          this.toastrService.error(this.commonLabels.errorMessages.documentLessThan50);
          for (let i = 0; i < this.uploaderAC.queue.length; i++) {
            if (!this.uploaderAC.queue[i].url) {
              this.uploaderAC.queue[i].remove();
              i--;
            }
          }
        } else {
          for (let i = 0; i < this.uploaderAC.queue.length; i++) {
            let filesize = this.uploaderAC.queue[i].file.size;
            if (filesize > 10 * 1024 * 1024) {
              this.toastrService.error(this.commonLabels.errorMessages.documentLessThan10);
              this.uploaderAC.queue[i].remove();
              i--;
            }
            else {
              let file = this.uploaderAC.queue[i]._file;
              let type = this.getFileType(file);
              if (!this.uploaderAC.queue[i].url) {
                if (!this.uploaderAC.queue[i].url && !this.uploaderAC.queue[i]['inProgress']) {
                  if (!this.checkFileType(type)) {
                    this.toastrService.error(this.commonLabels.errorMessages.invalidFileType);
                    this.uploaderAC.queue[i].remove();
                    i--;
                  }
                  else {
                    let formData = this.setFormData(file);
                    this.uploaderAC.queue[i]['inProgress'] = true;
                    this.uploadDocument(this.uploaderAC.queue[i], formData, documentType, i);
                  }
                }
              } else {
                // this.filesCounter++;
              }
            }
          }
        }

        if (this.uploaderAC.queue.length > 0) {
          this.vendorActivationForm.controls['docAC'].setValue('uploaded');
        }
        else {
          this.vendorActivationForm.controls['docAC'].setValue('');
        }
        break;
      case DOCUMENT_TYPES.imss:
        var totalAttachFileSize = 0;
        // tslint:disable-next-line:forin
        for (let i in this.uploaderIMSS.queue) {
          totalAttachFileSize = totalAttachFileSize + this.uploaderIMSS.queue[i].file.size;
        }
        if (totalAttachFileSize > 50 * 1024 * 1024) {
          this.toastrService.error(this.commonLabels.errorMessages.documentLessThan50);
          for (let i = 0; i < this.uploaderIMSS.queue.length; i++) {
            if (!this.uploaderIMSS.queue[i].url) {
              this.uploaderIMSS.queue[i].remove();
              i--;
            }
          }
        } else {
          for (let i = 0; i < this.uploaderIMSS.queue.length; i++) {
            let filesize = this.uploaderIMSS.queue[i].file.size;
            if (filesize > 10 * 1024 * 1024) {
              this.toastrService.error(this.commonLabels.errorMessages.documentLessThan10);
              this.uploaderIMSS.queue[i].remove();
              i--;
            }
            else {
              let file = this.uploaderIMSS.queue[i]._file;
              let type = this.getFileType(file);
              if (!this.uploaderIMSS.queue[i].url) {
                if (!this.uploaderIMSS.queue[i].url && !this.uploaderIMSS.queue[i]['inProgress']) {
                  if (!this.checkFileType(type)) {
                    this.toastrService.error(this.commonLabels.errorMessages.invalidFileType);
                    this.uploaderIMSS.queue[i].remove();
                    i--;
                  }
                  else {
                    let formData = this.setFormData(file);
                    this.uploaderIMSS.queue[i]['inProgress'] = true;
                    this.uploadDocument(this.uploaderIMSS.queue[i], formData, documentType, i);
                  }
                }
              } else {
                // this.filesCounter++;
              }
            }
          }
        }

        if (this.uploaderIMSS.queue.length > 0) {
          this.vendorActivationForm.controls['docIMSS'].setValue('uploaded')
        }
        else {
          this.vendorActivationForm.controls['docIMSS'].setValue('')
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
          for (let i = 0; i < this.uploaderOthers.queue.length; i++) {
            if (!this.uploaderOthers.queue[i].url) {
              this.uploaderOthers.queue[i].remove();
              i--;
            }
          }
        } else {
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
                    this.uploadDocument(this.uploaderOthers.queue[i], formData, documentType, i);
                  }
                }
              } else {
                // this.filesCounter++;
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

      case DOCUMENT_TYPES.repID:
        swal(swalObj, (isConfirm) => {
          if (isConfirm) {
            item.remove();
            this.documents.selectedRepID.splice(index, 1);
          }
        });
        break;

      case DOCUMENT_TYPES.byLaw:
        swal(swalObj, (isConfirm) => {
          if (isConfirm) {
            item.remove();
            this.documents.selectedBylaw.splice(index, 1);
          }
        });
        break;

      case DOCUMENT_TYPES.addressConfirmation:
        swal(swalObj, (isConfirm) => {
          if (isConfirm) {
            item.remove();
            this.documents.selectedAddress.splice(index, 1);
          }
        });
        break;

      case DOCUMENT_TYPES.imss:
        swal(swalObj, (isConfirm) => {
          if (isConfirm) {
            item.remove();
            this.documents.selectedIMSS.splice(index, 1);
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



  // removeUploadFileArrItem(index, documentType, item) {
  //   this.checkDocumentValidation(documentType);
  //   switch (documentType) {
  //     case DOCUMENT_TYPES.constancia:
  //     swal(swalObj, (isConfirm) => {
  //       if (isConfirm) {
  //         item.remove();
  //         this.documents.selectedConstantiaDocs.splice(index, 1);
  //       }
  //     });
  //       this.documents.selectedConstantiaDocs.splice(index, 1);
  //       break;

  //     case DOCUMENT_TYPES.ttd:
  //       this.documents.selected32DDocs.splice(index, 1)
  //       break;

  //     case DOCUMENT_TYPES.repID:
  //       this.documents.selectedRepID.splice(index, 1)
  //       break;
  //     case DOCUMENT_TYPES.byLaw:
  //       this.documents.selectedRepID.splice(index, 1)
  //       break;
  //     case DOCUMENT_TYPES.addressConfirmation:
  //       this.documents.selectedRepID.splice(index, 1)
  //       break;
  //     case DOCUMENT_TYPES.imss:
  //       this.documents.selectedRepID.splice(index, 1)
  //       break;
  //     case DOCUMENT_TYPES.others:
  //       this.documents.selectedOtherDocs.splice(index, 1)
  //       break;
  //   }
  // }

  setLanguage(value) {
    this.selectedLang = value;
    this.sessionService.setCookie(COOKIES_CONSTANTS.langCode, value);
    this.translatorService.useLanguage(value);
    this.setLocalizedVendorTypes();
  }
  /*multiple image upload functionality*/
}
