import { Component, OnInit, ViewEncapsulation, ViewChild, DoCheck, HostListener } from '@angular/core';
import { FormControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { ModalDirective } from 'ngx-bootstrap';
import { Subscription } from 'rxjs/Subscription';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { HttpParams } from '@angular/common/http';
import { CustomValidators } from '@app/common/custom-validators';
import { EditUserData } from './edit-freelancer.data.model';
import { ROLES, defaultDatepickerOptions, TAG_NAME_TEXTAREA, OPERATION_MODES, FILE_TYPES, CONTRACT_STATUS_CONST, EVENT_TYPES, COOKIES_CONSTANTS, DOCUMENT_TYPES, MEDIA_SIZES, PAID_TYPES_CONST, PROJECT_TYPES, ROUTER_LINKS_FULL_PATH, ACTION_TYPES, UI_ACCESS_PERMISSION_CONST, PAID_TYPES, CURRENCIES, ROLES_CONST, CONSTANCIA_OPINION_FILE_TYPES } from '../../../../config';
import { SharedData } from '@app/shared/shared.data';
import { SharedService } from '@app/shared/shared.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Common, NavigationService, SessionService, TriggerService } from '@app/common';
import { EditFreelancerService } from './edit-freelancer.service';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import * as _ from 'lodash';
import { PROJECT_CATEGORY_TABS } from '../../constants';
const swal = require('sweetalert');
declare var $: any;
const URL = '';
@Component({
  selector: 'app-edit-freelancer',
  templateUrl: './edit-freelancer.component.html',
  styleUrls: ['./edit-freelancer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditFreelancerComponent implements OnInit, DoCheck {
  @ViewChild('cropper', undefined) cropper: ImageCropperComponent;
  @ViewChild('classicModal') public classicModal: ModalDirective;
  @ViewChild('rejectionReasonModal') public rejectionReasonModal: ModalDirective;
  CONTRACT_STATUS_CONST = CONTRACT_STATUS_CONST;
  public uploaderConstancia: FileUploader = new FileUploader({ url: URL });
  public uploader32D: FileUploader = new FileUploader({ url: URL });
  public uploaderPassport: FileUploader = new FileUploader({ url: URL });
  public uploaderOthers: FileUploader = new FileUploader({ url: URL });
  multipleDocumentUpload = [];
  isClicked: Boolean = false;
  rejectSpinner: Boolean = false;
  approveSpinner: Boolean = false;
  submmitedFormFlag: Boolean = false;
  disableButtonFlag: Boolean = false;
  showLoadingFlg: Boolean = false;
  editUserForm: FormGroup;
  ROUTER_LINKS_FULL_PATH = ROUTER_LINKS_FULL_PATH;
  CURRENCIES = CURRENCIES;
  ROLES = ROLES;
  OPERATION_MODES = OPERATION_MODES;
  operationDropdown: any = [];
  PAID_TYPES = PAID_TYPES;
  ROLES_CONST = ROLES_CONST;
  CONSTANCIA_OPINION_FILE_TYPES = CONSTANCIA_OPINION_FILE_TYPES;
  ACTION_TYPES = ACTION_TYPES;
  uiAccessPermissionsObj: any;
  UI_ACCESS_PERMISSION_CONST = UI_ACCESS_PERMISSION_CONST;
  DOCUMENT_TYPES = DOCUMENT_TYPES;
  submmitedRejectionFormFlag: boolean = false;
  cropperModalOpen: Boolean = false;
  MODULE_ID: any;
  freelancerId: any;
  rowIndex: any;
  userDetails: any;
  usersArr;
  maxDate = new Date();
  value: any = "";
  userInfo: any;
  isProfileScreen: boolean = false;
  dobDatePickerOptions = JSON.parse(JSON.stringify(defaultDatepickerOptions));
  impDatePickerOptions = defaultDatepickerOptions;
  currencies: any = [];
  modesOfOperation: any = [];
  thirdPartyVendors: any = [];
  freelancerDetails: any;
  selectedCommercialCategories = [];
  selectedEntertainmentCategories = [];
  selectedCorporateCategories = [];
  commonLabels: any;
  photoUploadSuccess: any;
  commercialCategoriesArr: any = [];
  entertainmentCategoriesArr: any = [];
  corporateCategoriesArr: any = [];
  roles: any = [];
  editRoleIds: any = [];
  documents = {
    selectedConstantiaDocs: [],
    selected32DDocs: [],
    selectedPassportDocs: [],
    selectedOtherDocs: []
  }

  currency: any = [];
  defaultValueArr: any = [];

  tabs = [
    { name: 'actors.freelancers.labels.commercial', categories: [] },
    { name: 'actors.freelancers.labels.entertainment', categories: [] },
    { name: 'actors.freelancers.labels.corporate', categories: [] }
  ];
  editFreelancerBreadcrumbData: any = {
    title: 'actors.freelancers.labels.editFreelancer',
    subTitle: 'actors.freelancers.labels.editFreelancerSubTitle',
    data: [{
      text: 'common.labels.home',
      link: '/'
    },
    {
      text: 'actors.freelancers.labels.freelancersList',
      link: ROUTER_LINKS_FULL_PATH.freelancers
    },
    {
      text: 'actors.freelancers.labels.editFreelancer',
      link: ''
    }
    ]
  }
  editProfileBreadcrumbData: any = {
    title: 'profile.labels.profile',
  }
  breadcrumbData: any = {};
  cropperSettings: CropperSettings;
  croppedData: any;
  vendorType: any = [];
  spinnerFlag: boolean = false;
  showFloatingBtn: boolean = true;
  // public importantDates: any = [];
  constructor(private fb: FormBuilder,
    private sharedData: SharedData,
    private navigationService: NavigationService,
    private route: ActivatedRoute,
    private _editFreelancerService: EditFreelancerService,
    private _sharedService: SharedService,
    private sessionService: SessionService,
    private translateService: TranslateService,
    private triggerService: TriggerService,
    private toastrService: ToastrService) {
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

  // public importantDates: any = [];
  ngOnInit() {
    Common.scrollTOTop();
    this.userInfo = this.sharedData.getUsersInfo();
    this.createEditForm();
    this.setPermissionsDetails();
    this.getProjectCategories();
    this.getPageDetails();

    this.translateService.get('common').subscribe((res: string) => {
      this.commonLabels = res;
    });

    this.translateService.get('common.labels').subscribe((res: string) => {
      this.photoUploadSuccess = res['photoUploadSuccess'];
    });
    this.getRoles();
    this.route.params.subscribe(params => {
      this.isProfileScreen = this.route.snapshot.parent.data['profile'];
      this.freelancerId = params['id'];
      this.getFreelancerDetails(this.freelancerId);
      if (this.isProfileScreen) {
        this.breadcrumbData = this.editProfileBreadcrumbData;
      }
      else {
        this.breadcrumbData = this.editFreelancerBreadcrumbData;
        // if (this.freelancerId && this.usersArr) {
        //   this.userDetails = this.usersArr[this.rowIndex];
        //   let userFormDetails = EditUserData.getUserFormDetails(this.userDetails);
        //   this.setFormValues(userFormDetails);
        // }
        // else {
        //   this.router.navigate([ROUTER_LINKS_FULL_PATH.freelancers]);
        // }
      }
    });

  }


  checkModalOpen(modalFlag) {
    if (modalFlag) {
      this.cropperModalOpen = true;
    } else {
      this.cropperModalOpen = false;
    }
  }
  /**
* Checks Modal open event
* @param modalFlag as to check modal onShow or onHide
*/
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showFloatingBtn = Common.isInView($('#fixed-btn')) ? false : true;
  }
  ngDoCheck() {
    this.checkFileUploadingStatus();
  }
  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent) {
    if(event && event.target && event.target['tagName'] != TAG_NAME_TEXTAREA) {
      if (event.keyCode === 13) {
        event.preventDefault();
        if (!this.cropperModalOpen) {
          if (this.rejectionReasonModal.isShown) {
            if (!this.isClicked) {
              this.rejectContract();
            }
          } else {
            if (!this.disableButtonFlag && !this.isClicked) {
              this.addUser();
            }
          }
        } else {
          this.cropped();
        }
      }
    }
  }
  approveContract() {
    const obj = {};
    this.approveSpinner = true;
    this.isClicked = true;

    this._editFreelancerService.approveContract(this.freelancerId, obj).
      subscribe((responseData: any) => {
        this.isClicked = false;
        this.approveSpinner = false;

        if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
          this.disableButtonFlag = false;
          this.editUserForm.controls['contractStatus'].setValue(1);
          this.toastrService.success(responseData.header.message);
        } else {

          this.toastrService.error(responseData.header.message);
        }
      }, error => {
        this.approveSpinner = false;
        this.isClicked = false;
      });
  }
  openRejectionReasoModal() {
    this.submmitedRejectionFormFlag = false;
    this.editUserForm.controls['rejectionReason'].setValue("");
    this.editUserForm.controls['rejectionReason'].markAsUntouched();
    this.rejectionReasonModal.show();
  }
  rejectContract() {
    this.submmitedRejectionFormFlag = true;
    if (this.editUserForm.value.rejectionReason) {
      this.rejectSpinner = true;
      this.isClicked = true;
      let obj = {
        rejectionReason: this.editUserForm.value.rejectionReason
      };
      this._editFreelancerService.rejectContract(this.freelancerId, obj).
        subscribe((responseData: any) => {
          this.isClicked = false;
          this.rejectSpinner = false;

          this.submmitedRejectionFormFlag = false;
          this.rejectionReasonModal.hide();
          this.editUserForm.controls['contractStatus'].setValue(3);
          this.editUserForm.controls['contractRejectionReason'].setValue(this.editUserForm.value.rejectionReason);
          if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {

            this.toastrService.success(responseData.header.message);
          } else {
            this.toastrService.error(responseData.header.message);
          }
        }, error => {
          this.rejectSpinner = false;
          this.isClicked = false;

        });

    }
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
    this.editUserForm = this.createEditUserFormGroup();
  }
  createEditUserFormGroup(): FormGroup {
    return this.fb.group({
      firstName: ['', [CustomValidators.required]],
      lastName: ['', [CustomValidators.required]],
      email: [''],
      mode: ['', [CustomValidators.required]],
      phone: ['', [CustomValidators.required]],
      roles: [''],
      dateOfBirth: ['', [CustomValidators.required]],
      currency: ['', [CustomValidators.required]],
      vendorId: [''],
      electronicId: [''],
      contractId: [''],
      contractStatus: [''],
      contractUrl: [''],
      ssn: [''],
      uprc: ['', [CustomValidators.required]],
      selfPaid: [],
      taxId: ['', [CustomValidators.required]],
      accNumber: [''],
      bankName: [''],
      branchName: [''],
      clabe: [''],
      rfcCode: [''],
      address: [''],
      importantDates: this.fb.array([]),
      documentName: [''],
      entertainment: [''],
      commercial: [''],
      corporate: [''],
      constantiaDocument: [''],
      ttDocument: [''],
      passportDocument: [''],
      profilePicFileId: [''],
      profilePicUrl: [''],
      roleIds: [''],
      rejectionReason: [''],
      contractRejectionReason: ['']
    });
  }

  paymentTypeChanged() {
    if (this.editUserForm.value.selfPaid === PAID_TYPES_CONST.selfPaid) {
      this.editUserForm.patchValue({
        vendorId: ''
      });
      this.editUserForm.controls['vendorId'].setValidators(null);
      this.editUserForm.controls['vendorId'].updateValueAndValidity();
    }
    else {
      this.editUserForm.patchValue({
        accNumber: '',
        bankName: '',
        branchName: '',
        clabe: '',
        address: '',
        rfcCode: ''
      });
      this.editUserForm.controls['vendorId'].setValidators([CustomValidators.required]);
      this.editUserForm.controls['vendorId'].updateValueAndValidity();
    }
  }

  setValidatorsAndUpdateValue(controlname: string, validators: any = [], setClearValidatorFlag) {
    const baseControl = this.editUserForm;
    // baseControl.controls[controlname].reset();
    if (setClearValidatorFlag === true) {
      baseControl.controls[controlname].setValidators(validators);
    } else {
      baseControl.controls[controlname].clearValidators();
    }
    if (validators.length === 0) {
      baseControl.controls[controlname].setErrors(null);
    }
    baseControl.controls[controlname].setValue(this.freelancerDetails[controlname]);
    baseControl.controls[controlname].updateValueAndValidity();
  }
  getPageDetails() {
    this.getCurrencies();
    this.getModesOfOperation();
    this.getThirdPartyVendors();
  }
  getFreelancerDetails(id) {
    this.showLoadingFlg = true;
    this._editFreelancerService.getFreelancerDetails(id, this.isProfileScreen).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.result) {
          let freelancerDetails = EditUserData.getUserFormDetails(response.payload.result);
          this.freelancerDetails = freelancerDetails;
          this.setFormValues(freelancerDetails);
        }
      }
      else {
        if (response.header.message) {
          this.toastrService.error(response.header.message);
        }

      }
      this.showLoadingFlg = false;
    }, error => {
      this.showLoadingFlg = false;
    })
  }
  getCurrencies() {
    this._sharedService.getCurrencies().subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
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
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
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
          this.vendorType = Common.getMultipleSelectArr(this.thirdPartyVendors, ['id'], ['i18n', 'commercialName']);
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
  getProjectCategories() {
    const combined = Observable.forkJoin(
      this._sharedService.getProjectCategories(PROJECT_TYPES.commercial),
      this._sharedService.getProjectCategories(PROJECT_TYPES.entertainment),
      this._sharedService.getProjectCategories(PROJECT_TYPES.corporate)
    );
    combined.subscribe((latestValues: any) => {
      var commercialCategories: any = latestValues[0];
      var entertainmentCategories: any = latestValues[1];
      var corporateCategories: any = latestValues[2];
      /*commertial categories response response*/
      if (commercialCategories && Common.checkStatusCodeInRange(commercialCategories.header.statusCode)) {
        if (commercialCategories.payload && commercialCategories.payload.results) {
          this.tabs[0].categories = commercialCategories.payload.results;
          let commercialKeyArrObj = [];
          let commercialCategoriesArr = this.tabs[0].categories;
          for (var categoryIndex = 0; categoryIndex < commercialCategoriesArr.length; categoryIndex++) {
            let categoryId = commercialCategoriesArr[categoryIndex]['id'];
            commercialKeyArrObj[categoryId] = [];
            commercialKeyArrObj[categoryId]['accounts'] = [];
            if (commercialCategoriesArr[categoryIndex]['accounts']) {
              commercialKeyArrObj[categoryId]['count'] = commercialCategoriesArr[categoryIndex]['accounts'].length;

              commercialKeyArrObj[categoryId]['accounts']['count'] = commercialCategoriesArr[categoryIndex]['accounts'].length;
              for (var accountIndex = 0; accountIndex < commercialCategoriesArr[categoryIndex]['accounts'].length; accountIndex++) {
                let accountId = commercialCategoriesArr[categoryIndex]['accounts'][accountIndex]['id'];
                commercialKeyArrObj[categoryId]['accounts'][accountId] = [];
                commercialKeyArrObj[categoryId]['accounts'][accountId]['subAccount'] = [];
                if (commercialCategoriesArr[categoryIndex]['accounts'][accountIndex]['accounts']) {
                  commercialKeyArrObj[categoryId]['accounts'][accountId]['subAccount']['count'] = commercialCategoriesArr[categoryIndex]['accounts'][accountIndex]['accounts'].length;
                  for (var subAccountIndex = 0; subAccountIndex < commercialCategoriesArr[categoryIndex]['accounts'][accountIndex]['accounts'].length; subAccountIndex++) {
                    let subAccountId = commercialCategoriesArr[categoryIndex]['accounts'][accountIndex]['accounts'][subAccountIndex]['id'];
                    commercialKeyArrObj[categoryId]['accounts'][accountId]['subAccount'][subAccountId] = [];
                  }
                }
              }
            }
          }
          this.commercialCategoriesArr = commercialKeyArrObj;

        }
      }
      /*entertainment categories response response*/
      if (entertainmentCategories && Common.checkStatusCodeInRange(entertainmentCategories.header.statusCode)) {
        if (entertainmentCategories.payload && entertainmentCategories.payload.results) {
          // this.entertainmentCategories = entertainmentCategories.payload.results;
          this.tabs[1].categories = entertainmentCategories.payload.results;

          let entertainmentKeyArrObj = [];
          let entertainmentCategoriesArr = this.tabs[1].categories;
          for (var categoryIndex = 0; categoryIndex < entertainmentCategoriesArr.length; categoryIndex++) {
            let categoryId = entertainmentCategoriesArr[categoryIndex]['id'];
            entertainmentKeyArrObj[categoryId] = [];
            entertainmentKeyArrObj[categoryId]['accounts'] = [];
            if (entertainmentCategoriesArr[categoryIndex]['accounts']) {
              entertainmentKeyArrObj[categoryId]['count'] = entertainmentCategoriesArr[categoryIndex]['accounts'].length;

              entertainmentKeyArrObj[categoryId]['accounts']['count'] = entertainmentCategoriesArr[categoryIndex]['accounts'].length;
              for (var accountIndex = 0; accountIndex < entertainmentCategoriesArr[categoryIndex]['accounts'].length; accountIndex++) {
                let accountId = entertainmentCategoriesArr[categoryIndex]['accounts'][accountIndex]['id'];
                entertainmentKeyArrObj[categoryId]['accounts'][accountId] = [];
                entertainmentKeyArrObj[categoryId]['accounts'][accountId]['subAccounts'] = [];
                if (entertainmentCategoriesArr[categoryIndex]['accounts'][accountIndex]['accounts']) {
                  entertainmentKeyArrObj[categoryId]['accounts'][accountId]['subAccounts']['count'] = entertainmentCategoriesArr[categoryIndex]['accounts'][accountIndex]['accounts'].length;
                  for (var subAccountIndex = 0; subAccountIndex < entertainmentCategoriesArr[categoryIndex]['accounts'][accountIndex]['accounts'].length; subAccountIndex++) {
                    let subAccountId = entertainmentCategoriesArr[categoryIndex]['accounts'][accountIndex]['accounts'][subAccountIndex]['id'];
                    entertainmentKeyArrObj[categoryId]['accounts'][accountId]['subAccounts'][subAccountId] = [];
                  }
                }
              }
            }
          }
          this.entertainmentCategoriesArr = entertainmentKeyArrObj;
        }
      }
      /*corporate categories response response*/
      if (corporateCategories && Common.checkStatusCodeInRange(corporateCategories.header.statusCode)) {
        if (corporateCategories.payload && corporateCategories.payload.results) {
          // this.corporateCategories = corporateCategories.payload.results;
          this.tabs[2].categories = corporateCategories.payload.results;

          let corporateKeyArrObj = [];
          let corporateCategoriesArr = this.tabs[2].categories;
          for (var categoryIndex = 0; categoryIndex < corporateCategoriesArr.length; categoryIndex++) {
            let categoryId = corporateCategoriesArr[categoryIndex]['id'];
            corporateKeyArrObj[categoryId] = [];
            corporateKeyArrObj[categoryId]['accounts'] = [];

            if (corporateCategoriesArr[categoryIndex]['accounts']) {
              corporateKeyArrObj[categoryId]['count'] = corporateCategoriesArr[categoryIndex]['accounts'].length;
              corporateKeyArrObj[categoryId]['accounts']['count'] = corporateCategoriesArr[categoryIndex]['accounts'].length;
              for (var accountIndex = 0; accountIndex < corporateCategoriesArr[categoryIndex]['accounts'].length; accountIndex++) {
                let accountId = corporateCategoriesArr[categoryIndex]['accounts'][accountIndex]['id'];
                corporateKeyArrObj[categoryId]['accounts'][accountId] = [];
                corporateKeyArrObj[categoryId]['accounts'][accountId]['subAccounts'] = [];
                if (corporateCategoriesArr[categoryIndex]['accounts'][accountIndex]['accounts']) {
                  corporateKeyArrObj[categoryId]['accounts'][accountId]['subAccounts']['count'] = corporateCategoriesArr[categoryIndex]['accounts'][accountIndex]['accounts'].length;
                  for (var subAccountIndex = 0; subAccountIndex < corporateCategoriesArr[categoryIndex]['accounts'][accountIndex]['accounts'].length; subAccountIndex++) {
                    let subAccountId = corporateCategoriesArr[categoryIndex]['accounts'][accountIndex]['accounts'][subAccountIndex]['id'];
                    corporateKeyArrObj[categoryId]['accounts'][accountId]['subAccounts'][subAccountId] = [];
                  }
                }
              }
            }
          }
          this.corporateCategoriesArr = corporateKeyArrObj;
        }
      }
      let self = this;
      self.showHideFloatingButtons(500);
    })
  }

  editFileUpload(identityDocs) {
    let constanciaObj = _.find(identityDocs, { "documentType": "Constancia" });
    let ttdObj = _.find(identityDocs, { "documentType": "32D" });
    let passportObj = _.find(identityDocs, { "documentType": "Passport/IFE" });
    // let othersObj = _.find(identityDocs, { "documentType": "Others" });
    let othersObjArr = _.filter(identityDocs, { "documentType": "Others" });
    this.uploaderConstancia.queue = [];
    this.uploader32D.queue = [];
    this.uploaderPassport.queue = [];
    this.uploaderOthers.queue = [];
    if (constanciaObj && constanciaObj.files) {
      let filesArr = constanciaObj.files;
      if (!this.multipleDocumentUpload[DOCUMENT_TYPES.constancia]) {
        this.multipleDocumentUpload[DOCUMENT_TYPES.constancia] = [];
      }
      for (let i = 0; i < filesArr.length; i++) {
        let file = new File([""], filesArr[i].fileName);
        let fileItem = new FileItem(this.uploaderConstancia, file, {});
        this.uploaderConstancia.queue.push(fileItem);
        this.uploaderConstancia.queue[i].url = filesArr[i].fileUrl;
        this.multipleDocumentUpload[DOCUMENT_TYPES.constancia][i] = true;
      }
      if (this.uploaderConstancia.queue.length > 0)
        this.editUserForm.controls['constantiaDocument'].setValue('uploaded');
    }
    if (ttdObj && ttdObj.files) {
      let filesArr = ttdObj.files;
      if (!this.multipleDocumentUpload[DOCUMENT_TYPES.ttd]) {
        this.multipleDocumentUpload[DOCUMENT_TYPES.ttd] = [];
      }
      for (let i = 0; i < filesArr.length; i++) {
        let file = new File([""], filesArr[i].fileName);
        let fileItem = new FileItem(this.uploader32D, file, {});
        this.uploader32D.queue.push(fileItem);
        this.uploader32D.queue[i].url = filesArr[i].fileUrl;
        this.multipleDocumentUpload[DOCUMENT_TYPES.ttd][i] = true;
      }
      if (this.uploader32D.queue.length > 0)
        this.editUserForm.controls['ttDocument'].setValue('uploaded');
    }
    if (passportObj && passportObj.files) {
      let filesArr = passportObj.files;
      if (!this.multipleDocumentUpload[DOCUMENT_TYPES.passport]) {
        this.multipleDocumentUpload[DOCUMENT_TYPES.passport] = [];
      }
      for (let i = 0; i < filesArr.length; i++) {
        let file = new File([""], filesArr[i].fileName);
        let fileItem = new FileItem(this.uploaderPassport, file, {});
        this.uploaderPassport.queue.push(fileItem);
        this.uploaderPassport.queue[i].url = filesArr[i].fileUrl;
        this.multipleDocumentUpload[DOCUMENT_TYPES.passport][i] = true;
      }
      if (this.uploaderPassport.queue.length > 0)
        this.editUserForm.controls['passportDocument'].setValue('uploaded');
    }
    if (othersObjArr && othersObjArr.length > 0) {
      if (!this.multipleDocumentUpload[DOCUMENT_TYPES.others]) {
        this.multipleDocumentUpload[DOCUMENT_TYPES.others] = [];
      }
      othersObjArr.forEach((obj, index) => {
        if (obj.files && obj.files.length > 0) {
          let file = new File([""], obj.files[0].fileName);
          let fileItem = new FileItem(this.uploaderOthers, file, {});
          this.uploaderOthers.queue.push(fileItem);
          this.uploaderOthers.queue[index].url = obj.files[0].fileUrl;
          this.multipleDocumentUpload[DOCUMENT_TYPES.others][index] = true;
          setTimeout(function () {
            $('#docName' + index).val(obj.name);
          }, 500);
        }
      })
    }

  }

  setFormValues(userFormDetails) {
    this.editUserForm.patchValue({
      firstName: userFormDetails.firstName,
      lastName: userFormDetails.lastName,
      email: userFormDetails.email,
      role: userFormDetails.role,
      paymentDays: userFormDetails.paymentDays,
      mode: userFormDetails.mode,
      electronic: userFormDetails.electronic,
      phone: userFormDetails.phone,
      dateOfBirth: userFormDetails.dateOfBirth,
      ssn: userFormDetails.ssn,
      uprc: userFormDetails.uprc,
      selfPaid: userFormDetails.selfPaid,
      currency: userFormDetails.currency,
      electronicId: userFormDetails.electronicId,
      taxId: userFormDetails.taxId,
      accNumber: userFormDetails.accNumber,
      bankName: userFormDetails.bankName,
      branchName: userFormDetails.branchName,
      clabe: userFormDetails.clabe,
      rfcCode: userFormDetails.rfcCode,
      address: userFormDetails.address,
      contractId: userFormDetails.contractId,
      contractStatus: userFormDetails.contractStatus,
      contractRejectionReason: userFormDetails.contractRejectionReason,
      contractUrl: userFormDetails.contractUrl,
      profilePicFileId: userFormDetails.profilePicFileId,
      profilePicUrl: userFormDetails.profilePicUrl,
      roles: userFormDetails.roleIds,

      vendorId: userFormDetails.vendorId
    })
    if (userFormDetails.importantDates && userFormDetails.importantDates.length > 0) {
      const importantDatesControlArray = <FormArray>this.editUserForm.get('importantDates');
      for (var i = 0; i < userFormDetails.importantDates.length; i++) {
        this.addEvents(false);
        importantDatesControlArray.controls[i].patchValue({
          "eventName": userFormDetails.importantDates[i].eventName,
          'dateOfBirth': userFormDetails.importantDates[i].dateOfBirth
        });
      }
    }
    else {
      this.addEvents(false);
    }
    this.documents = userFormDetails.documents;
    this.editFileUpload(userFormDetails.identityDocs);
    this.selectedCommercialCategories = userFormDetails.selectedCommercialCategories;
    this.selectedEntertainmentCategories = userFormDetails.selectedEntertainmentCategories;
    this.selectedCorporateCategories = userFormDetails.selectedCorporateCategories;
    let localThis = this;
    setTimeout(function () {
      localThis.showSelectedCategories(userFormDetails);
    }, 2000);
    if (this.editUserForm.value.selfPaid == PAID_TYPES_CONST.thirdParty)
      this.editUserForm.controls['vendorId'].setValidators([CustomValidators.required]);
  }
  showSelectedCategories(userFormDetails) {
    userFormDetails.commercial.forEach((obj, index) => {
      let mappingIdsArr = obj.mappingIds;
      this.addClass('.id_' + mappingIdsArr[0]);
      this.showAlreadySelectedItems(this.commercialCategoriesArr, mappingIdsArr);
    });
    userFormDetails.entertainment.forEach((obj, index) => {
      let mappingIdsArr = obj.mappingIds;
      this.addClass('.id_' + mappingIdsArr[0]);
      this.showAlreadySelectedItems(this.entertainmentCategoriesArr, mappingIdsArr);
    });
    userFormDetails.corporate.forEach((obj, index) => {
      let mappingIdsArr = obj.mappingIds;
      this.addClass('.id_' + mappingIdsArr[0]);
      this.showAlreadySelectedItems(this.corporateCategoriesArr, mappingIdsArr);
    });
  }


  showAlreadySelectedItems(typeArr, mappingIdsArr) {
    let length = mappingIdsArr.length;
    switch (length) {
      case 1:
        this.checkAllChildNodesSelectedOrNot(typeArr, 'account', mappingIdsArr[0], '', '');
        break;

      case 2:
        this.checkAllChildNodesSelectedOrNot(typeArr, 'account', mappingIdsArr[1], mappingIdsArr[0], '');
        break;

      case 3:
        this.checkAllChildNodesSelectedOrNot(typeArr, 'subAccount', mappingIdsArr[2], mappingIdsArr[1], mappingIdsArr[0]);
        break;
    }
  }


  addClass(selectorname) {
    $(selectorname).addClass('selected-category');
  }

  addUser() {
    this.submmitedFormFlag = true;
    if (this.editUserForm.valid) {
      this.isClicked = true;
      this.spinnerFlag = true;
      this.disableButtonFlag = true;
      this.submmitedFormFlag = false;
      let formvalue = this.editUserForm.value;
      formvalue['langCode'] = this.sessionService.getCookie(COOKIES_CONSTANTS.langCode);
      formvalue['commercial'] = this.selectedCommercialCategories;
      formvalue['entertainment'] = this.selectedEntertainmentCategories;
      formvalue['corporate'] = this.selectedCorporateCategories;
      let finalUserData = EditUserData.getWebServiceDetails(formvalue, this.documents);
      finalUserData['id'] = this.freelancerId;
      this._editFreelancerService.updateFreelancerData(this.freelancerId, finalUserData, this.isProfileScreen).
        subscribe((responseData: any) => {
          this.spinnerFlag = false;
          this.disableButtonFlag = false;
          this.isClicked = false;
          if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
            this.disableButtonFlag = false;
            if (!this.isProfileScreen) {
              this.navigationService.navigate(ROUTER_LINKS_FULL_PATH.freelancers);
              this.toastrService.success(responseData.header.message);
            }
            else {
              this.setUserInfo(this.editUserForm.value);
              this.toastrService.success(this.commonLabels.labels.profileUpdatedMsg);
            }
          } else {
            this.spinnerFlag = false;
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
      for (var i in this.editUserForm.controls) {
        if (!this.editUserForm.controls[i].valid) {
          target = this.editUserForm.controls[i];
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
      // $('html,body').animate({scrollTop: $('.ng-invalid').first().offset().top}, 'slow');
    }

  }
  setUserInfo(userInfoData) {
    let userInfo = this.sharedData.getUsersInfo();
    userInfo['name'] = userInfoData.firstName + " " + userInfoData.lastName;
    userInfo['profilePicUrl'] = userInfoData.profilePicUrl,
      this.sharedData.setUsersInfo(userInfo);
    this.setEventType({ type: EVENT_TYPES.updateProfileEvent, prevValue: false, currentValue: true });
  }
  setEventType(event: any) {
    this.triggerService.setEvent(event);
  }
  subMenuShow(id, type, e) {
    e.stopPropagation();
    let self = this;
    if (type == 'show') {
      $(".sub-category_" + id).show();
      $(".sub-sub-category_" + id).show();
      $(".category-plus.category_" + id).hide();
      $(".category-minus.category_" + id).show();
      $(".category-plus_" + id).hide();
      $(".category-minus_" + id).show();
    } else {
      $(".sub-category_" + id).hide();
      $(".sub-sub-category_" + id).hide();
      $(".category-plus.category_" + id).show();
      $(".category-minus.category_" + id).hide();
    }
    self.showHideFloatingButtons(50);
  }

  subSubMenuShow(id, type, e) {
    e.stopPropagation();
    if (type == 'show') {
      $(".sub-sub-category_" + id).show();
      $(".category-plus.category_" + id).hide();
      $(".category-minus.category_" + id).show();
    } else {
      $(".sub-sub-category_" + id).hide();
      $(".category-plus.category_" + id).show();
      $(".category-minus.category_" + id).hide();
    }
  }
  //set module permission details
  setPermissionsDetails() {
    var permissionObj = this.sharedData.getRolePermissionData();
    this.MODULE_ID = this.route.snapshot.parent.data['moduleID'];
    var modulePermissionObj = permissionObj[this.MODULE_ID];
    if (modulePermissionObj.uiAccess) {
      this.uiAccessPermissionsObj = modulePermissionObj.uiAccess;
    }
  }
  importantEvents(): FormGroup {
    return this.fb.group({
      eventName: [''],
      dateOfBirth: ['']
    });
  }
  eventNameChanged(importantDateFrmGrp: FormGroup) {
    let formvalue = importantDateFrmGrp.value;
    if (formvalue.eventName && !formvalue.dateOfBirth) {
      importantDateFrmGrp.controls['dateOfBirth'].setErrors({ "checkRequired": true })
    }
    else {
      importantDateFrmGrp.controls['dateOfBirth'].setErrors(null)
    }
  }
  addEvents(checkValidation, index = 0) {
    const importantDates = <FormArray>this.editUserForm.controls['importantDates'];
    if (checkValidation) {
      let importantDateFrmGrp = <FormGroup>importantDates.controls[index];
      let formvalue = importantDateFrmGrp.value;
      if (formvalue.eventName && formvalue.dateOfBirth) {
        importantDates.push(this.importantEvents());
        importantDateFrmGrp.controls['dateOfBirth'].setErrors(null)
      }
      else {
        this.eventNameChanged(importantDateFrmGrp);
      }
    }
    else {
      importantDates.push(this.importantEvents());
    }
  }
  dateChanged(e, importantDateFrmGrp: FormGroup) {
    let formValue = importantDateFrmGrp.value;
    if (!e.jsdate && formValue.eventName) {
      importantDateFrmGrp.controls['dateOfBirth'].reset();
      importantDateFrmGrp.controls['dateOfBirth'].setValidators([CustomValidators.required]);
      importantDateFrmGrp.controls['dateOfBirth'].updateValueAndValidity();
    } else {
      importantDateFrmGrp.controls['dateOfBirth'].setErrors(null);
      importantDateFrmGrp.controls['dateOfBirth'].setValidators([]);
      importantDateFrmGrp.controls['dateOfBirth'].updateValueAndValidity();
    }
  }
  removeEvents(eventIndex) {
    const importantDates = <FormArray>this.editUserForm.controls['importantDates'];
    importantDates.removeAt(eventIndex);
  }
  OpenPdf() {
    window.open('../assets/pdf/FreelancerContract.pdf');
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
        let image: any = new Image();
        let file: File = event.target.files[0];
        let myReader: FileReader = new FileReader();
        let that = this;
        myReader.onloadend = function (loadEvent: any) {
          image.src = loadEvent.target.result;
          // that.cropper.setImage(image);
          setTimeout(function () { that.cropper.setImage(image); }, 500);
        };
        myReader.readAsDataURL(file);
        event.target.value = "";
      } else {
        event.target.value = "";
        this.toastrService.error(this.commonLabels.errorMessages.uploadImageLessThan + ' ' + MEDIA_SIZES.IMAGES_IN_MB);
      }
      } else {
        event.target.value = "";
        this.toastrService.error(this.commonLabels.errorMessages.uploadTypeError);
      }
    }
  }
  cropped() {
    this.showFile();
    this.onHidden();
  }
  onHidden() {
    $("#f02").val('');
    this.classicModal.hide();
  }

  showFile() {
    var file = Common.dataURLtoFile(this.croppedData.image, 'coverphoto.jpg');
    let formData = this.setFormData(file);
    this.uploadFile(formData, false);
  }
  /*image upload functionality*/

  /*multiple files upload functionality*/
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

  selectCategories(categoryId, tabIndex, selector, isLeafNode, parentId: any = "", nodeType: any = "") {
    $('.' + selector + categoryId).toggleClass('selected-category');
    let isClassPresent = $('.' + selector + categoryId).hasClass('selected-category');
    if (isLeafNode) {
      if (isClassPresent) {
        this.setIdInSelectionArr(tabIndex, categoryId);
      }
      else {
        this.removeIdFromSelectionArr(tabIndex, categoryId);
      }
    }
    else {
      this.selectAllChildren(categoryId, tabIndex, parentId, isClassPresent);
    }

    let catId = $('.' + selector + categoryId).parent().attr('cat');
    let accountId = $('.' + selector + categoryId).parent().attr('account');
    let subAccountId = $('.' + selector + categoryId).parent().attr('subAccount');

    if ($('.' + selector + categoryId).hasClass('selected-category')) {
      let type;
      switch (tabIndex) {
        case 0: type = this.commercialCategoriesArr;
          break;

        case 1: type = this.entertainmentCategoriesArr;
          break;

        case 2: type = this.corporateCategoriesArr;
          break;
      }

      this.checkAllChildNodesSelectedOrNot(type, nodeType, catId, accountId, subAccountId);
    } else {
      switch (nodeType) {
        case "subAccount":
          $(".id_" + catId).removeClass('selected-category');
          $(".id_" + accountId).removeClass('selected-category');


        case "account":
          $(".id_" + catId).removeClass('selected-category');
          this.checkAllCategoriesNodes(tabIndex, isClassPresent, categoryId);


      }
    }
  }

  checkAllChildNodesSelectedOrNot(typeArr, nodeType, catId, accountId, subAccountId) {
    if (typeArr) {
      switch (nodeType) {
        case "subAccount":
          if (typeArr[catId] && typeArr[catId]['accounts'] && typeArr[catId]['accounts'][accountId]['subAccounts']) {
            let subAccountTotalCount = typeArr[catId]['accounts'][accountId]['subAccounts']['count'];
            let subAccountsArr = typeArr[catId]['accounts'][accountId]['subAccounts'];
            let selectedSubAccountsCount = 0;
            for (let key in subAccountsArr) {
              if (key != 'count') {
                if ($('.id_' + key).hasClass('selected-category')) {
                  selectedSubAccountsCount++;
                }
              }
            }
            if (selectedSubAccountsCount == subAccountsArr.count) {
              $('.id_' + accountId).addClass('selected-category');
              let selectedAccountsCount = 0;
              let accountsArr = typeArr[catId]['accounts'];
              for (let key in accountsArr) {
                if (key != 'count') {
                  if ($('.id_' + key).hasClass('selected-category')) {
                    selectedAccountsCount++;
                  }
                }
              }
              if (selectedAccountsCount == accountsArr.count) {
                $('.id_' + catId).addClass('selected-category');
              }
            }
          }

          break;

        case "account":
          let selectedAccountsCount = 0;
          if (typeArr[catId] && typeArr[catId]['accounts']) {
            let accountsArr = typeArr[catId]['accounts'];
            for (let key in accountsArr) {
              if (key != 'count') {
                if ($('.id_' + key).hasClass('selected-category')) {
                  selectedAccountsCount++;
                }
              }
            }
            if (selectedAccountsCount == accountsArr.count) {
              $('.id_' + catId).addClass('selected-category');
            }
          }
          break;


      }
    }
  }


  checkAllCategoriesNodes(tabIndex, isParentSelected, categoryId) {
    let filteredData = _.find(this.tabs[tabIndex].categories, { 'id': categoryId });
    //   if (filteredData) {
    //     let self = this;
    //     _.forEach(filteredData.accounts, function(obj) {
    //       if (isParentSelected)
    //         $('.id_' + obj.id).addClass('selected-category');
    //       else
    //         $('.id_' + obj.id).removeClass('selected-category');
    //       if (obj.accounts) {
    //         let level3IdsArr = _.map(obj.accounts, 'id');
    //         if (level3IdsArr) {
    //           self.selectLeafNodes(tabIndex, level3IdsArr, isParentSelected);
    //         }
    //       }
    //     }
    // }
  }

  removeIdFromSelectionArr(tabIndex, categoryId) {
    switch (tabIndex) {
      case PROJECT_CATEGORY_TABS.commercial:
        if (this.selectedCommercialCategories.includes(categoryId)) {
          let index = this.selectedCommercialCategories.indexOf(categoryId);
          this.selectedCommercialCategories.splice(index, 1);
        }
        break;

      case PROJECT_CATEGORY_TABS.entertainment:
        if (this.selectedEntertainmentCategories.includes(categoryId)) {
          let index = this.selectedEntertainmentCategories.indexOf(categoryId);
          this.selectedEntertainmentCategories.splice(index, 1);
        }
        break;

      case PROJECT_CATEGORY_TABS.corporate:
        if (this.selectedCorporateCategories.includes(categoryId)) {
          let index = this.selectedCorporateCategories.indexOf(categoryId);
          this.selectedCorporateCategories.splice(index, 1);
        }
        break;
    }
  }
  setIdInSelectionArr(tabIndex, categoryId) {
    switch (tabIndex) {
      case PROJECT_CATEGORY_TABS.commercial:
        if (!this.selectedCommercialCategories.includes(categoryId)) {
          this.selectedCommercialCategories.push(categoryId);
        }
        break;

      case PROJECT_CATEGORY_TABS.entertainment:
        if (!this.selectedEntertainmentCategories.includes(categoryId)) {
          this.selectedEntertainmentCategories.push(categoryId);
        }
        break;

      case PROJECT_CATEGORY_TABS.corporate:
        if (!this.selectedCorporateCategories.includes(categoryId)) {
          this.selectedCorporateCategories.push(categoryId);
        }
        break;
    }
  }

  selectAllChildren(categoryId, tabIndex, parentId, isParentSelected) {
    let filteredData: any;
    let localThis = this;
    if (!parentId) {
      filteredData = _.find(this.tabs[tabIndex].categories, { 'id': categoryId });
      if (filteredData) {
        _.forEach(filteredData.accounts, function (obj) {
          if (isParentSelected) {
            $('.id_' + obj.id).addClass('selected-category');
            if (obj.accounts) {
              let level3IdsArr = _.map(obj.accounts, 'id');
              if (level3IdsArr) {
                localThis.selectLeafNodes(tabIndex, level3IdsArr, isParentSelected);
              }
            }
            else {
              localThis.setIdInSelectionArr(tabIndex, obj.id);
            }
          }
          else {
            $('.id_' + obj.id).removeClass('selected-category');
            localThis.removeIdFromSelectionArr(tabIndex, obj.id);
          }


        });
      }
    }
    else {
      let index = _.findIndex(this.tabs[tabIndex].categories, { 'id': parentId });
      if (index != undefined)
        filteredData = _.find(this.tabs[tabIndex].categories[index].accounts, { 'id': categoryId });
      if (filteredData) {
        let level3IdsArr = _.map(filteredData.accounts, 'id');
        if (level3IdsArr) {
          localThis.selectLeafNodes(tabIndex, level3IdsArr, isParentSelected);
        }
      }
    }
  }
  selectLeafNodes(tabIndex, level3IdsArr, isParentSelected) {
    for (let i = 0; i < level3IdsArr.length; i++) {
      if (isParentSelected) {
        $('.id_' + level3IdsArr[i]).addClass('selected-category');
        this.setIdInSelectionArr(tabIndex, level3IdsArr[i]);
      }
      else {
        $('.id_' + level3IdsArr[i]).removeClass('selected-category');
        this.removeIdFromSelectionArr(tabIndex, level3IdsArr[i]);
      }

    }
  }
  uploadFile(formData, isDocument, documentType: any = "", obj: any = {}, index: any = 0) {

    if (!this.multipleDocumentUpload[documentType]) {
      this.multipleDocumentUpload[documentType] = [];
    }
    if (!this.multipleDocumentUpload[documentType][index]) {
      this.multipleDocumentUpload[documentType][index] = false;
    }
    this.multipleDocumentUpload[documentType][index] = false;


    this.disableButtonFlag = true;
    this._sharedService.uploadFile(formData).subscribe((imageResponse: any) => {
      this.multipleDocumentUpload[documentType][index] = true;
      if (Common.checkStatusCodeInRange(imageResponse.header.statusCode)) {
        let data = imageResponse.payload.result;
        if (isDocument) {
          obj.url = data.url;
          this.setDocumentId(data.id, documentType);
          delete obj['inProgress'];
        }
        else {
          this.editUserForm.patchValue({
            profilePicFileId: data.id,
            profilePicUrl: data.url
          });
          var localThis = this;
          setTimeout(function () {
            // localThis.toastrService.success("Profile photo has been uploaded successfully");
            localThis.disableButtonFlag = false;
            localThis.toastrService.success(localThis.photoUploadSuccess);
          }, 1500);
        }
      } else {
        if (imageResponse.header) {
          this.toastrService.error(imageResponse.header.message);
        } else {
          this.toastrService.error(this.commonLabels.errorMessages.responseError);
        }
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
        break;;

      case DOCUMENT_TYPES.others:
        this.documents.selectedOtherDocs.push({ 'fileId': documentId, "name": "" });
        break;;

    }

  }
  checkDocumentValidation(documentType) {
    switch (documentType) {
      case DOCUMENT_TYPES.constancia:
        var totalAttachFileSize = 0;
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
        if (this.uploaderConstancia.queue.length > 0)
          this.editUserForm.controls['constantiaDocument'].setValue('uploaded')
        else
          this.editUserForm.controls['constantiaDocument'].setValue('')
        break;

      case DOCUMENT_TYPES.ttd:
        var totalAttachFileSize = 0;
        for (let i in this.uploader32D.queue) {
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

        if (this.uploader32D.queue.length > 0)
          this.editUserForm.controls['ttDocument'].setValue('uploaded')
        else
          this.editUserForm.controls['ttDocument'].setValue('')
        break;

      case DOCUMENT_TYPES.passport:
        var totalAttachFileSize = 0;
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

        if (this.uploaderPassport.queue.length > 0)
          this.editUserForm.controls['passportDocument'].setValue('uploaded')
        else
          this.editUserForm.controls['passportDocument'].setValue('')
        break;

      case DOCUMENT_TYPES.others:
        var totalAttachFileSize = 0;
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
  checkFileTypeOfConstenciaAndOpinionDocuments(filetype) {
    let validtype = _.find(CONSTANCIA_OPINION_FILE_TYPES, { 'type': filetype.toLowerCase() });
    if (validtype)
      return true;
    else
      return false;
  }

  checkFileType(filetype) {
    let validtype = _.find(FILE_TYPES, { 'type': filetype.toLowerCase() });
    if (validtype)
      return true;
    else
      return false;

  }

  navigateTo() {
    if (this.isProfileScreen) {
      this.editUserForm.reset();
      let formArray: FormArray = <FormArray>this.editUserForm.controls['importantDates'];
      formArray.controls = [];

      const tempData = this.editUserForm;
      this.getFreelancerDetails(this.freelancerId);
    } else {
      this.navigationService.navigate([ROUTER_LINKS_FULL_PATH.freelancers]);
    }
  }
  /*multiple image upload functionality*/

  /*multiple files upload functionality*/
  getRoles() {
    this._editFreelancerService.getRoles().subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.results) {
          let rolesArray = []
          rolesArray = response.payload.results;
          this.roles = Common.getMultipleSelectArr(rolesArray, ['id'], ['name']);
        } else {
          this.roles = [];
        }
      } else {
        this.roles = [];
      }
    }, error => {
      this.roles = [];
    });
  }

  // assignedActiveResortsSelected(userFormDetails) {
  //   if (this.roles && userFormDetails.roleIds) {
  //     // this.activeResortSelectedFlag = true;
  //     this.editRoleIds = [];
  //     for (var index = 0; index < this.roles.length; index++) {
  //       if (Common.inArray(this.roles[index]['value'],userFormDetails.roleIds)) {
  //         this.editRoleIds.push(this.roles[index]);
  //       }
  //     }
  //   }
  //
  //   //this.defaultValueArr = []{value: "5b31ebb67c32fb1e88e79661", label: "Producer"};
  //
  // }
  /**
  **  method to show/hide floating buttons on window scroll after timeout of 50 ms
  **/
  showHideFloatingButtons(time) {
    setTimeout(() => {
      this.onWindowScroll();
    }, time);
  }
}
