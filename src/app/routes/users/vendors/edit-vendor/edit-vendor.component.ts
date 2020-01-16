import { Component, OnInit, ViewChild, ViewEncapsulation, HostListener } from '@angular/core';
import { CustomValidators } from '@app/common/custom-validators';
import { FormControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
  FILE_TYPES, DOCUMENT_TYPES, CURRENCIES, ROLES, OPERATION_MODES,
  ROUTER_LINKS_FULL_PATH, ROLES_CONST, PAYMENT_TYPES, CLASSIFICATION, TAG_NAME_TEXTAREA,
  UI_ACCESS_PERMISSION_CONST, PROJECT_TYPES, MEDIA_SIZES, COOKIES_CONSTANTS, VENDOR_TYPE, EVENT_TYPES, CONTRACT_STATUS_CONST, CONSTANCIA_OPINION_FILE_TYPES
} from '@app/config';
import { ManageVendorData } from './edit-vendor.data.model';
import { SharedData } from '@app/shared/shared.data';
import { Router, ActivatedRoute } from '@angular/router';
import { Common, SessionService, NavigationService, TriggerService } from '@app/common';
import { FileUploader, FileLikeObject, FileItem } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { EditVendorService } from './edit-vendor-service';
import { SharedService } from '@app/shared/shared.service';
import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';
import { ModalDirective } from 'ngx-bootstrap';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { TranslateService } from '@ngx-translate/core';
import { HttpParams } from '@angular/common/http';
import { PROJECT_CATEGORY_TABS } from '../../constants';
const URL = '';
declare var $: any;
const swal = require('sweetalert');
@Component({
  selector: 'app-edit-vendor',
  templateUrl: './edit-vendor.component.html',
  styleUrls: ['./edit-vendor.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class EditVendorComponent implements OnInit {
  showSpinnerFlag: Boolean = false;
  rejectSpinner: Boolean = false;
  approveSpinner: Boolean = false;
  profileUpdatedMsg: string;
  cropperSettings: CropperSettings;
  vendorFormDetails: any;
  profilepic: any;
  fileName: any;
  fileType: FileLikeObject;
  filesize: any;
  VENDOR_TYPE = VENDOR_TYPE;
  validtype: any;
  profileImageUrl: any;
  @ViewChild('cropper', undefined) cropper: ImageCropperComponent;
  @ViewChild('classicModal') public classicModal: ModalDirective;
  @ViewChild('rejectionReasonModal') public rejectionReasonModal: ModalDirective;
  CONTRACT_STATUS_CONST = CONTRACT_STATUS_CONST;
  CONSTANCIA_OPINION_FILE_TYPES = CONSTANCIA_OPINION_FILE_TYPES;
  fileTypes = FILE_TYPES;
  croppedData: any;
  photoUploadSuccess: any;
  contractURL: any;
  operation: any;
  currencies: any;
  editVendorData: any;
  public uploader: FileUploader = new FileUploader({ url: URL });
  ROUTER_LINKS_FULL_PATH = ROUTER_LINKS_FULL_PATH;
  PAYMENT_TYPES = PAYMENT_TYPES;
  // CLASSIFICATION = CLASSIFICATION;
  CLASSIFICATION: { id: number; text: string; }[];
  CURRENCIES = CURRENCIES;
  manageVendorForm: FormGroup;
  submitVendorForm: Boolean = false;
  submmitedRejectionFormFlag: Boolean = false;
  showLoadingFlg: Boolean = false;
  vendorID: any;
  rowIndex: any;
  vendorDetails: any;
  filesToUpload: any;
  vendorArr: any = [];
  contractArray: any = [];
  file: any = {};
  OPERATION_MODES = OPERATION_MODES;
  MODULE_ID: any;
  uiAccessPermissionsObj: any;
  UI_ACCESS_PERMISSION_CONST = UI_ACCESS_PERMISSION_CONST;
  isProfileScreen: boolean = false;
  disableButton: Boolean = false;
  repFlag: boolean = false;
  cropperModalOpen: Boolean = false;
  userInfo: any;
  spinnerFlag: boolean = false;
  selectedCommercialCategories = [];
  selectedEntertainmentCategories = [];
  selectedCorporateCategories = [];
  multipleDocumentUpload = [];
  commercialCategoriesArr: any = [];
  entertainmentCategoriesArr: any = [];
  corporateCategoriesArr: any = [];
  isClicked: boolean = false;
  currency: any = [];
  operationDropdown: any = [];
  commonLabels: any;
  tabs = [
    { name: 'actors.freelancers.labels.commercial', categories: [], selectedCategories: [] },
    { name: 'actors.freelancers.labels.entertainment', categories: [], selectedCategories: [] },
    { name: 'actors.freelancers.labels.corporate', categories: [], selectedCategories: [] }
  ];
  public uploaderConstancia: FileUploader = new FileUploader({ url: URL });
  public uploader32D: FileUploader = new FileUploader({ url: URL });
  public uploaderidRepresentative: FileUploader = new FileUploader({ url: URL });
  public uploaderByLaw: FileUploader = new FileUploader({ url: URL });
  public uploaderAC: FileUploader = new FileUploader({ url: URL });
  public uploaderIMSS: FileUploader = new FileUploader({ url: URL });
  public uploaderOthers: FileUploader = new FileUploader({ url: URL });
  editVendorBreadcrumbData: any = {
    title: 'actors.vendors.labels.editVendor',
    subTitle: 'actors.vendors.labels.editSubtitle',
    data: [{
      text: 'common.labels.home',
      link: '/'
    },
    {
      text: 'actors.vendors.labels.vendorlist',
      link: ROUTER_LINKS_FULL_PATH.vendors
    },
    {
      text: 'actors.vendors.labels.editVendor',
      link: ''
    }
    ]
  }
  documents = {
    selectedConstantiaDocs: [],
    selected32DDocs: [],
    selectedRepID: [],
    selectedBylaw: [],
    selectedAddress: [],
    selectedIMSS: [],
    selectedOtherDocs: []
  };

  editProfileBreadcrumbData: any = {
    title: 'profile.labels.profile',
  };
  breadcrumbData: any = {};
  showFloatingBtn: Boolean = true;
  constructor(
    private toastrService: ToastrService,
    public sessionService: SessionService,
    private fb: FormBuilder,
    private sharedData: SharedData,
    private router: Router,
    private route: ActivatedRoute,
    private _editVendorService: EditVendorService,
    private _sharedService: SharedService,
    private navigationService: NavigationService,
    private translateService: TranslateService,
    private triggerService: TriggerService
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
  ngOnInit() {
    this.getLocalizedClassificationValues();
    Common.scrollTOTop();
    this.userInfo = Common.parseJwt(this.sessionService.getCookie(COOKIES_CONSTANTS.authToken));
    this.createEditForm();
    this.setPermissionsDetails();
    this.getModeOfOperation();
    this.getCurrencies();
    this.getProjectCategories();
    if (_.find(this.userInfo.role, { 'id': ROLES_CONST.vendor })) {
      this.manageVendorForm.controls['vendorType'].setValidators([CustomValidators.required]);
      this.manageVendorForm.controls['vendorType'].updateValueAndValidity();
    }
    this.route.params.subscribe(params => {
      this.isProfileScreen = this.route.snapshot.parent.data['profile'];
      this.vendorID = params['id'];
      this.rowIndex = this.vendorID - 1;
      this.vendorArr = this.sharedData.getModulesData('vendors');
      if (this.isProfileScreen) {
        this.breadcrumbData = this.editProfileBreadcrumbData;
      }
      else {
        this.breadcrumbData = this.editVendorBreadcrumbData;

      }
      this.getVendorDetails();
    });
    this.translateService.get('common.labels.profileUpdatedMsg').subscribe((res: string) => {
      this.profileUpdatedMsg = res;
    });

    this.translateService.get('common.labels').subscribe((res: string) => {
      this.photoUploadSuccess = res['photoUploadSuccess'];
    });

    this.translateService.get('common').subscribe((res: string) => {
      this.commonLabels = res;
    });
  }
  @HostListener("window:scroll", [])
  onWindowScroll() {
    this.showFloatingBtn = Common.isInView($('#fixed-btn')) ? false : true;
  }
  getLocalizedClassificationValues() {
    this.CLASSIFICATION = Common.changeDropDownValues(this.translateService, CLASSIFICATION);
  }
  navigateTo() {
    if (this.isProfileScreen) {
      this.repFlag = true;
      this.manageVendorForm.reset();
      this.getVendorDetails();
    } else {
      this.navigationService.navigate([ROUTER_LINKS_FULL_PATH.vendors]);
    }
  }
  getVendorDetails() {
    this.showLoadingFlg = true;
    this._editVendorService.getVendor(this.vendorID, this.isProfileScreen).subscribe((response: any) => {
      this.editVendorData = response.payload.result;
      this.profileImageUrl = this.editVendorData.profilePicUrl;
      this.vendorFormDetails = ManageVendorData.getFormDetailsData(this.editVendorData);
      if (this.vendorFormDetails.contracts.length != 0) {
        this.contractURL = this.vendorFormDetails.contracts[0].fileUrl;
      }
      if (this.vendorFormDetails.representatives.length == 0 && !this.repFlag)
        this.addRepresentatives(false);
      this.contractArray = this.vendorFormDetails.contracts;
      this.editFileUpload(this.vendorFormDetails.identityDocs);
      this.setVendorFormValues(this.vendorFormDetails);

      this.showLoadingFlg = false;
    }, error => {
      this.showLoadingFlg = false;
    });
  }
  // fileChangeEvent(event) {
  //   this.validateMulitipleUploadFile();
  // }

  setPermissionsDetails() {
    var permissionObj = this.sharedData.getRolePermissionData();
    this.MODULE_ID = this.route.snapshot.parent.data['moduleID'];
    var modulePermissionObj = permissionObj[this.MODULE_ID];
    if (modulePermissionObj.uiAccess) {
      this.uiAccessPermissionsObj = modulePermissionObj.uiAccess;
    }
  }
  // || (this.userInfo.roleId != ROLES_CONST.projectCoordinator)
  createEditForm() {
    this.manageVendorForm = this.editManageVendorFormGroup();
    // if ((this.userInfo.roleId != ROLES_CONST.admin)) {
    //   this.manageVendorForm.controls['electronic'].disable();
    //   this.manageVendorForm.controls['paymentDays'].disable();
    // }
  }
  editManageVendorFormGroup(): FormGroup {
    //sidd
    return this.fb.group({
      companyName: ['', [CustomValidators.required]],
      legalName: ['', [CustomValidators.required]],
      classification: ['', [CustomValidators.required]],
      vendorType: [''],
      mode: ['', [CustomValidators.required]],
      phone: ['', [CustomValidators.required, CustomValidators.checkNumber]],
      address: ['', [CustomValidators.required]],
      representatives: this.fb.array([]),
      acname: [''],
      accNumber: [''],
      bankName: [''],
      branchName: [''],
      internationalACname: [''],
      internationalACnumber: [''],
      internationalbankName: [''],
      internationalbranchName: [''],
      clabe: [''],
      swiftCode: [''],
      ABAcode: [''],
      sortCode: [''],
      documentName: [''],
      rfcCode: [''],
      taxId: ['', [CustomValidators.required]],
      paymentType: ['1'],
      currency: ['', [CustomValidators.required]],
      thirdParty: [''],
      docConstancia: [''],
      doc32D: [''],
      docRepId: [''],
      docByLaw: [''],
      docAC: [''],
      docIMSS: [''],
      profilePicFileId: [''],
      electronicIdNumber: [''],
      emailId: [''],
      contractStatus: [''],
      rejectionReason: [''],
      contractRejectionReason: ['']
    })
  }
  approveContract() {
    let obj = {};
    this.approveSpinner = true;
    this.isClicked = true;
    this._editVendorService.approveContract(this.vendorID, obj).
      subscribe((responseData: any) => {
        this.spinnerFlag = false;
        this.isClicked = false;
        this.approveSpinner = false;

        if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
          this.manageVendorForm.controls['contractStatus'].setValue(1);
          this.toastrService.success(responseData.header.message);
        } else {

          this.toastrService.error(responseData.header.message);
        }
      }, error => {
        this.approveSpinner = false;
        this.isClicked = false;
        this.spinnerFlag = false;

      });
  }
  openRejectionReasoModal() {
    this.submmitedRejectionFormFlag = false;
    this.manageVendorForm.controls['rejectionReason'].setValue("");
    this.manageVendorForm.controls['rejectionReason'].markAsUntouched();
    this.rejectionReasonModal.show();
  }
  rejectContract() {
    this.submmitedRejectionFormFlag = true;
    if (this.manageVendorForm.value.rejectionReason) {
      this.rejectSpinner = true;
      this.isClicked = true;

      // this.spinnerFlag = true;
      let obj = {
        rejectionReason: this.manageVendorForm.value.rejectionReason
      };
      this._editVendorService.rejectContract(this.vendorID, obj).
        subscribe((responseData: any) => {

          this.submmitedRejectionFormFlag = false;
          this.rejectionReasonModal.hide();
          this.manageVendorForm.controls['contractStatus'].setValue(3);
          this.manageVendorForm.controls['contractRejectionReason'].setValue(this.manageVendorForm.value.rejectionReason);
          this.isClicked = false;
          this.spinnerFlag = false;
          this.rejectSpinner = false;

          if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
            this.toastrService.success(responseData.header.message);
          } else {

            this.toastrService.error(responseData.header.message);
          }
        }, error => {
          this.rejectSpinner = false;
          this.isClicked = false;

          this.spinnerFlag = false;

        });
    }
  }
  togglevalidation() {
    if (this.manageVendorForm.value.paymentType == "2") {

      this.manageVendorForm.controls['internationalACname'].setValidators([CustomValidators.required]);
      this.manageVendorForm.controls['internationalACname'].updateValueAndValidity();
      this.manageVendorForm.controls['internationalACnumber'].setValidators([CustomValidators.required]);
      this.manageVendorForm.controls['internationalACnumber'].updateValueAndValidity();
      this.manageVendorForm.controls['internationalbankName'].setValidators([CustomValidators.required]);
      this.manageVendorForm.controls['internationalbankName'].updateValueAndValidity();
      this.manageVendorForm.controls['internationalbranchName'].setValidators([CustomValidators.required]);
      this.manageVendorForm.controls['internationalbranchName'].updateValueAndValidity();
      this.manageVendorForm.controls['acname'].setValidators(null);
      this.manageVendorForm.controls['acname'].updateValueAndValidity();
      this.manageVendorForm.controls['accNumber'].setValidators(null);
      this.manageVendorForm.controls['accNumber'].updateValueAndValidity();
      this.manageVendorForm.controls['bankName'].setValidators(null);
      this.manageVendorForm.controls['bankName'].updateValueAndValidity();
      this.manageVendorForm.controls['branchName'].setValidators(null);
      this.manageVendorForm.controls['branchName'].updateValueAndValidity();
    }
    if (this.manageVendorForm.value.paymentType == "1") {

      this.manageVendorForm.controls['internationalACname'].setValidators(null);
      this.manageVendorForm.controls['internationalACname'].updateValueAndValidity();
      this.manageVendorForm.controls['internationalACnumber'].setValidators(null);
      this.manageVendorForm.controls['internationalACnumber'].updateValueAndValidity();
      this.manageVendorForm.controls['internationalbankName'].setValidators(null);
      this.manageVendorForm.controls['internationalbankName'].updateValueAndValidity();
      this.manageVendorForm.controls['internationalbranchName'].setValidators(null);
      this.manageVendorForm.controls['internationalbranchName'].updateValueAndValidity();
      this.manageVendorForm.controls['acname'].setValidators([CustomValidators.required]);
      this.manageVendorForm.controls['acname'].updateValueAndValidity();
      this.manageVendorForm.controls['accNumber'].setValidators([CustomValidators.required]);
      this.manageVendorForm.controls['accNumber'].updateValueAndValidity();
      this.manageVendorForm.controls['bankName'].setValidators([CustomValidators.required]);
      this.manageVendorForm.controls['bankName'].updateValueAndValidity();
      this.manageVendorForm.controls['branchName'].setValidators([CustomValidators.required]);
      this.manageVendorForm.controls['branchName'].updateValueAndValidity();
    }
  }
  removeValidators() {
    if (this.manageVendorForm.value.paymentType == "2") {
      this.manageVendorForm.controls['internationalACname'].setValidators([CustomValidators.required]);
      this.manageVendorForm.controls['internationalACname'].updateValueAndValidity();
      this.manageVendorForm.controls['internationalACnumber'].setValidators([CustomValidators.required]);
      this.manageVendorForm.controls['internationalACnumber'].updateValueAndValidity();
      this.manageVendorForm.controls['internationalbankName'].setValidators([CustomValidators.required]);
      this.manageVendorForm.controls['internationalbankName'].updateValueAndValidity();
      this.manageVendorForm.controls['internationalbranchName'].setValidators([CustomValidators.required]);
      this.manageVendorForm.controls['internationalbranchName'].updateValueAndValidity();
      this.manageVendorForm.controls['acname'].setValidators(null);
      this.manageVendorForm.controls['acname'].updateValueAndValidity();
      this.manageVendorForm.controls['accNumber'].setValidators(null);
      this.manageVendorForm.controls['accNumber'].updateValueAndValidity();
      this.manageVendorForm.controls['bankName'].setValidators(null);
      this.manageVendorForm.controls['bankName'].updateValueAndValidity();
      this.manageVendorForm.controls['branchName'].setValidators(null);
      this.manageVendorForm.controls['branchName'].updateValueAndValidity();
      this.manageVendorForm.patchValue({
        ABAcode: '',
        swiftCode: '',
        internationalACname: '',
        internationalACnumber: '',
        internationalbankName: '',
        internationalbranchName: ''


      })
    } else if (this.manageVendorForm.value.paymentType == "1") {
      this.manageVendorForm.controls['internationalACname'].setValidators(null);
      this.manageVendorForm.controls['internationalACname'].updateValueAndValidity();
      this.manageVendorForm.controls['internationalACnumber'].setValidators(null);
      this.manageVendorForm.controls['internationalACnumber'].updateValueAndValidity();
      this.manageVendorForm.controls['internationalbankName'].setValidators(null);
      this.manageVendorForm.controls['internationalbankName'].updateValueAndValidity();
      this.manageVendorForm.controls['internationalbranchName'].setValidators(null);
      this.manageVendorForm.controls['internationalbranchName'].updateValueAndValidity();
      this.manageVendorForm.controls['acname'].setValidators([CustomValidators.required]);
      this.manageVendorForm.controls['acname'].updateValueAndValidity();
      this.manageVendorForm.controls['accNumber'].setValidators([CustomValidators.required]);
      this.manageVendorForm.controls['accNumber'].updateValueAndValidity();
      this.manageVendorForm.controls['bankName'].setValidators([CustomValidators.required]);
      this.manageVendorForm.controls['bankName'].updateValueAndValidity();
      this.manageVendorForm.controls['branchName'].setValidators([CustomValidators.required]);
      this.manageVendorForm.controls['branchName'].updateValueAndValidity();
      this.manageVendorForm.patchValue({
        clabe: '',
        sortCode: '',
        rfcCode: '',
        acname: '',
        accNumber: '',
        bankName: '',
        branchName: ''
      });
    }


  }



  editFileUpload(identityDocs) {

    let constanciaObj = _.find(identityDocs, { "documentType": "Constancia" });
    let ttdObj = _.find(identityDocs, { "documentType": "32D" });
    let legalrep = _.find(identityDocs, { "documentType": "LegalRep" });
    let byLaw = _.find(identityDocs, { "documentType": "byLaw" });
    let IMSS = _.find(identityDocs, { "documentType": "IMSS" });
    let address = _.find(identityDocs, { "documentType": "Address Confirmation" });
    // let othersObj = _.find(identityDocs, { "documentType": "Others" });
    let othersObjArr = _.filter(identityDocs, { "documentType": "Others" });
    this.uploaderConstancia.queue = [];
    this.uploader32D.queue = [];
    this.uploaderidRepresentative.queue = [];
    this.uploaderByLaw.queue = [];
    this.uploaderAC.queue = [];
    this.uploaderIMSS.queue = [];
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
        this.manageVendorForm.controls['docConstancia'].setValue('uploaded');
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
        this.manageVendorForm.controls['doc32D'].setValue('uploaded');
    }
    if (legalrep && legalrep.files) {
      let filesArr = legalrep.files;
      if (!this.multipleDocumentUpload[DOCUMENT_TYPES.repID]) {
        this.multipleDocumentUpload[DOCUMENT_TYPES.repID] = [];
      }
      for (let i = 0; i < filesArr.length; i++) {
        let file = new File([""], filesArr[i].fileName);
        let fileItem = new FileItem(this.uploaderidRepresentative, file, {});
        this.uploaderidRepresentative.queue.push(fileItem);
        this.uploaderidRepresentative.queue[i].url = filesArr[i].fileUrl;
        this.multipleDocumentUpload[DOCUMENT_TYPES.repID][i] = true;
      }
      if (this.uploaderidRepresentative.queue.length > 0)
        this.manageVendorForm.controls['docRepId'].setValue('uploaded');
    }
    if (address && address.files) {
      let filesArr = address.files;
      if (!this.multipleDocumentUpload[DOCUMENT_TYPES.addressConfirmation]) {
        this.multipleDocumentUpload[DOCUMENT_TYPES.addressConfirmation] = [];
      }
      for (let i = 0; i < filesArr.length; i++) {
        let file = new File([""], filesArr[i].fileName);
        let fileItem = new FileItem(this.uploaderAC, file, {});
        this.uploaderAC.queue.push(fileItem);
        this.uploaderAC.queue[i].url = filesArr[i].fileUrl;
        this.multipleDocumentUpload[DOCUMENT_TYPES.addressConfirmation][i] = true;
      }
      if (this.uploaderAC.queue.length > 0)
        this.manageVendorForm.controls['docAC'].setValue('uploaded');
    }
    if (IMSS && IMSS.files) {
      let filesArr = IMSS.files;
      if (!this.multipleDocumentUpload[DOCUMENT_TYPES.imss]) {
        this.multipleDocumentUpload[DOCUMENT_TYPES.imss] = [];
      }
      for (let i = 0; i < filesArr.length; i++) {
        let file = new File([""], filesArr[i].fileName);
        let fileItem = new FileItem(this.uploaderIMSS, file, {});
        this.uploaderIMSS.queue.push(fileItem);
        this.uploaderIMSS.queue[i].url = filesArr[i].fileUrl;
        this.multipleDocumentUpload[DOCUMENT_TYPES.imss][i] = true;
      }
      if (this.uploaderIMSS.queue.length > 0)
        this.manageVendorForm.controls['docIMSS'].setValue('uploaded');
    }
    if (byLaw && byLaw.files) {
      let filesArr = byLaw.files;
      if (!this.multipleDocumentUpload[DOCUMENT_TYPES.byLaw]) {
        this.multipleDocumentUpload[DOCUMENT_TYPES.byLaw] = [];
      }
      for (let i = 0; i < filesArr.length; i++) {
        let file = new File([""], filesArr[i].fileName);
        let fileItem = new FileItem(this.uploaderByLaw, file, {});
        this.uploaderByLaw.queue.push(fileItem);
        this.uploaderByLaw.queue[i].url = filesArr[i].fileUrl;
        this.multipleDocumentUpload[DOCUMENT_TYPES.byLaw][i] = true;
      }
      if (this.uploaderByLaw.queue.length > 0)
        this.manageVendorForm.controls['docByLaw'].setValue('uploaded');
    }

    if (othersObjArr && othersObjArr.length > 0) {
      if (!this.multipleDocumentUpload[DOCUMENT_TYPES.others]) {
        this.multipleDocumentUpload[DOCUMENT_TYPES.others] = [];
      }
      othersObjArr.forEach((obj, index) => {
        let file = new File([""], obj.files[0].fileName);
        let fileItem = new FileItem(this.uploaderOthers, file, {});
        this.uploaderOthers.queue.push(fileItem);
        this.uploaderOthers.queue[index].url = obj.files[0].fileUrl;
        this.multipleDocumentUpload[DOCUMENT_TYPES.others][index] = true;
        setTimeout(function () {
          $('#docName' + index).val(obj.name);
        }, 500);
      })
    }

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
  getModeOfOperation() {
    this._sharedService.getModesOfOperation().subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
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

  getFileType(file) {
    let fileNameArr = file.name.split(".");
    let type = fileNameArr[fileNameArr.length - 1];
    let typeLowercase = type.toLowerCase();
    return typeLowercase;
  }

  // updatedForm() {
  // }
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
      if (commercialCategories) {
        if (commercialCategories.payload && commercialCategories.payload.results) {
          this.tabs[PROJECT_CATEGORY_TABS.commercial].categories = commercialCategories.payload.results;
          let commercialKeyArrObj = [];
          let commercialCategoriesArr = this.tabs[PROJECT_CATEGORY_TABS.commercial].categories;
          for (var categoryIndex = 0; categoryIndex < commercialCategoriesArr.length; categoryIndex++) {
            let categoryId = commercialCategoriesArr[categoryIndex]['id'];
            commercialKeyArrObj[categoryId] = [];
            if (commercialCategoriesArr[categoryIndex]['accounts']) {
              commercialKeyArrObj[categoryId]['accounts'] = [];
              commercialKeyArrObj[categoryId]['count'] = commercialCategoriesArr[categoryIndex]['accounts'].length;
              if (commercialCategoriesArr[categoryIndex]['accounts']) {
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
          }
          this.commercialCategoriesArr = commercialKeyArrObj;

        }
      }
      /*entertainment categories response response*/
      if (entertainmentCategories) {
        if (entertainmentCategories.payload && entertainmentCategories.payload.results) {
          // this.entertainmentCategories = entertainmentCategories.payload.results;
          this.tabs[PROJECT_CATEGORY_TABS.entertainment].categories = entertainmentCategories.payload.results;

          let entertainmentKeyArrObj = [];
          let entertainmentCategoriesArr = this.tabs[PROJECT_CATEGORY_TABS.entertainment].categories;
          for (var categoryIndex = 0; categoryIndex < entertainmentCategoriesArr.length; categoryIndex++) {
            let categoryId = entertainmentCategoriesArr[categoryIndex]['id'];
            entertainmentKeyArrObj[categoryId] = [];
            if (entertainmentCategoriesArr[categoryIndex]['accounts']) {
              entertainmentKeyArrObj[categoryId]['accounts'] = [];
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
      if (corporateCategories) {
        if (corporateCategories.payload && corporateCategories.payload.results) {
          // this.corporateCategories = corporateCategories.payload.results;
          this.tabs[PROJECT_CATEGORY_TABS.corporate].categories = corporateCategories.payload.results;

          let corporateKeyArrObj = [];
          let corporateCategoriesArr = this.tabs[PROJECT_CATEGORY_TABS.corporate].categories;
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
  setVendorFormValues(vendorFormDetails) {
    this.manageVendorForm.patchValue({
      companyName: vendorFormDetails.commercialName,
      legalName: vendorFormDetails.legalName,
      phone: vendorFormDetails.phone,
      classification: vendorFormDetails.classification,
      vendorType: vendorFormDetails.vendorType,
      currency: vendorFormDetails.currency,
      mode: vendorFormDetails.mode,
      thirdParty: vendorFormDetails.acceptThirdPartyPayment,
      acname: vendorFormDetails.acname,
      bankName: vendorFormDetails.bankName,
      branchName: vendorFormDetails.branchName,
      clabe: vendorFormDetails.clabe,
      accNumber: vendorFormDetails.accNumber,
      swiftCode: vendorFormDetails.swiftCode,
      ABAcode: vendorFormDetails.ABAcode,
      sortCode: vendorFormDetails.sortCode,
      internationalACname: vendorFormDetails.internationalACname,
      internationalACnumber: vendorFormDetails.internationalACnumber,
      internationalbankName: vendorFormDetails.internationalbankName,
      internationalbranchName: vendorFormDetails.internationalbranchName,
      rfcCode: vendorFormDetails.rfcCode,
      taxId: vendorFormDetails.taxId,
      address: vendorFormDetails.address,
      paymentType: vendorFormDetails.paymentType.toString(),
      electronicIdNumber: vendorFormDetails.electronic,
      emailId: vendorFormDetails.email,
      profilePicFileId: vendorFormDetails.profilePicFileId,
      contractStatus: vendorFormDetails.contractStatus,
      contractRejectionReason: vendorFormDetails.contractRejectionReason,
    })
    if (vendorFormDetails.representatives && vendorFormDetails.representatives.length > 0) {
      const representativesControlArray = <FormArray>this.manageVendorForm.get('representatives');
      for (var i = 0; i < vendorFormDetails.representatives.length; i++) {
        if (!this.repFlag) {
          this.addRepresentatives(false);
        }
        representativesControlArray.controls[i].patchValue({
          "repName": vendorFormDetails.representatives[i].repName,
          'repEmail': vendorFormDetails.representatives[i].repEmail,
          'repPhone': vendorFormDetails.representatives[i].repPhone
        });
      }
    }
    this.documents = vendorFormDetails.documents;
    this.selectedCommercialCategories = vendorFormDetails.selectedCommercialCategories;
    this.selectedEntertainmentCategories = vendorFormDetails.selectedEntertainmentCategories;
    this.selectedCorporateCategories = vendorFormDetails.selectedCorporateCategories;
    var self = this;
    setTimeout(function () {
      self.showSelectedCategories(vendorFormDetails);
    }, 3000);
  }
  representative(): FormGroup {
    return this.fb.group({
      repName: [''],
      repEmail: ['', [CustomValidators.checkEmail]],
      repPhone: ['', CustomValidators.checkNumber]
    });
  }
  updateVendor() {
    this.togglevalidation();
    this.removeExtraBlankRowOfRepresentative();

    this.submitVendorForm = true;
    if (this.manageVendorForm.valid) {
      this.isClicked = true;
      this.spinnerFlag = true;
      this.disableButton = true;
      let formvalue = this.manageVendorForm.value;
      formvalue['langCode'] = this.sessionService.getCookie('langCode');
      formvalue['commercial'] = this.selectedCommercialCategories;
      formvalue['entertainment'] = this.selectedEntertainmentCategories;
      formvalue['corporate'] = this.selectedCorporateCategories;
      let finalVendorData = ManageVendorData.getWebServiceDetailsData(formvalue, this.documents);
      finalVendorData['id'] = this.vendorID;
      finalVendorData['contracts'] = this.contractArray;
      this._editVendorService.updateVendor(finalVendorData, this.vendorID, this.isProfileScreen).subscribe((response: any) => {
        this.disableButton = false;
        this.spinnerFlag = false;

        if (Common.checkStatusCodeInRange(response.header.statusCode)) {
          this.spinnerFlag = false;
          this.isClicked = false;
          this.disableButton = false;

          if (!this.isProfileScreen) {
            this.repFlag = false;
            this.router.navigate([ROUTER_LINKS_FULL_PATH.vendors]);
            this.toastrService.success(response.header.message);
          }
          else {
            this.updateUserInfoEvent();
            this.repFlag = false;
            this.disableButton = false;
            this.toastrService.success(this.profileUpdatedMsg);

          }
        } else {
          this.spinnerFlag = false;
          this.disableButton = false;
          this.isClicked = false;
        }
      }, error => {
        this.spinnerFlag = false;
        this.isClicked = false;
        this.disableButton = false;
        this.toastrService.error(this.commonLabels.errorMessages.responseError);
      });

    }
    else {
      let target;
      for (var i in this.manageVendorForm.controls) {
        if (!this.manageVendorForm.controls[i].valid) {
          target = this.manageVendorForm.controls[i];
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


  checkModalOpen(modalFlag) {
    if (modalFlag) {
      this.cropperModalOpen = true;
    } else {
      this.cropperModalOpen = false;
    }
  }


  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent) {
    if(event && event.target && event.target['tagName'] != TAG_NAME_TEXTAREA) {
      if (event.keyCode === 13) {
        if (!this.cropperModalOpen) {
          if (this.rejectionReasonModal.isShown) {
            if (!this.isClicked) {
              event.preventDefault();
              this.rejectContract();
            }
          }
        } else {
          event.preventDefault();
          this.cropped();
        }
      }
    }
    
  }
  updateUserInfoEvent() {
    this.setEventType({ type: EVENT_TYPES.updateProfileEvent, prevValue: false, currentValue: true });
  }

  setEventType(event: any) {
    this.triggerService.setEvent(event);
  }



  showSelectedCategories(userFormDetails) {
    userFormDetails.commercial.forEach((obj, index) => {
      let mappingIdsArr = obj.mappingIds;
      $(".id_" + mappingIdsArr[0]).addClass('selected-category');
      this.showAlreadySelectedItems(this.commercialCategoriesArr, mappingIdsArr);
    });
    userFormDetails.entertainment.forEach((obj, index) => {
      let mappingIdsArr = obj.mappingIds;
      $(".id_" + mappingIdsArr[0]).addClass('selected-category');
      this.showAlreadySelectedItems(this.entertainmentCategoriesArr, mappingIdsArr);
    });
    userFormDetails.corporate.forEach((obj, index) => {
      let mappingIdsArr = obj.mappingIds;
      $(".id_" + mappingIdsArr[0]).addClass('selected-category');
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





  addCatgories(tabIndex, categoryId) {
    let categories = this.tabs[tabIndex].selectedCategories;
    if (categories.includes(categoryId)) {
      let index = categories.indexOf(categoryId);
      categories.splice(index, 1);
    }
    else {
      categories.push(categoryId);
    }
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
  //sidd
  addRepresentatives(checkValidation, index = 0) {
    const representatives = <FormArray>this.manageVendorForm.controls['representatives'];
    if (checkValidation) {
      let repFormGrp = representatives.controls[index];
      if ((repFormGrp.value.repName != '' || repFormGrp.value.repEmail != '' || repFormGrp.value.repPhone != '') && repFormGrp.valid)
        representatives.push(this.representative());
    }
    else {
      representatives.push(this.representative());
    }

  }
  removeRepresentatives(eventIndex) {
    const representatives = <FormArray>this.manageVendorForm.controls['representatives'];
    representatives.removeAt(eventIndex);
  }
  OpenPdf() {
    let a = document.createElement('a')
    a.href = this.contractURL;
    a.download = this.contractURL;
    a.click();
  }


  validateMulitipleUploadFile() {
    this.filesToUpload = this.uploader.queue;
    var totalAttachFileSize = 0;
    let attachArr = [];
    for (let i in this.uploader.queue) {
      totalAttachFileSize = totalAttachFileSize + this.uploader.queue[i].file.size;
    }
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
            setTimeout(function () { that.cropper.setImage(image); }, 500)
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
    this.disableButton = true;
    const file = Common.dataURLtoFile(this.croppedData.image, 'coverphoto.jpg');
    const formData: FormData = new FormData();
    formData.append('file', file);
    this._sharedService.uploadFile(formData).subscribe((imageResponse: any) => {
      if (Common.checkStatusCodeInRange(imageResponse.header.statusCode)) {
        this.disableButton = false;
        const data = imageResponse.payload.result;
        this.profileImageUrl = data.url;
        this.manageVendorForm.patchValue({
          profilePicFileId: data.id,
        });
        const localThis = this;
        setTimeout(function () {
          localThis.toastrService.success(localThis.photoUploadSuccess);
        }, 1500);
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
    this.checkDocumentValidation(documentType);

    // switch (documentType) {
    //   case DOCUMENT_TYPES.constancia:
    //     this.uploaderConstancia.queue.forEach((obj, index) => {
    //       let file = obj._file;
    //       let type = this.getFileType(file);
    //       if (!obj.url) {
    //         if (!this.checkFileTypeOfConstenciaAndOpinionDocuments(type)) {
    //           this.toastrService.error(this.commonLabels.errorMessages.invalidFileType);
    //           this.uploaderConstancia.queue[index].remove();
    //         }
    //         else {
    //           let formData = this.setFormData(obj._file);
    //           this.uploadDocument(formData, documentType, obj, index);
    //         }

    //       }

    //     });
    //     break;

    //   case DOCUMENT_TYPES.ttd:
    //     this.uploader32D.queue.forEach((obj, index) => {
    //       let file = obj._file;
    //       let type = this.getFileType(file);
    //       if (!obj.url) {
    //         if (!this.checkFileTypeOfConstenciaAndOpinionDocuments(type)) {
    //           this.toastrService.error(this.commonLabels.errorMessages.invalidFileType);
    //           this.uploader32D.queue[index].remove();
    //         }
    //         else {
    //           let formData = this.setFormData(obj._file);
    //           this.uploadDocument(formData, documentType, obj, index);
    //         }
    //       }

    //     });
    //     break;

    //   case DOCUMENT_TYPES.repID:
    //     this.uploaderidRepresentative.queue.forEach((obj, index) => {
    //       let file = obj._file;
    //       let type = this.getFileType(file);
    //       if (!obj.url) {
    //         if (!this.checkFileType(type)) {
    //           this.toastrService.error(this.commonLabels.errorMessages.invalidFileType);
    //           this.uploaderidRepresentative.queue[index].remove();
    //         }
    //         else {
    //           let formData = this.setFormData(obj._file);
    //           this.uploadDocument(formData, documentType, obj, index);
    //         }
    //       }

    //     });
    //     break;
    //   case DOCUMENT_TYPES.byLaw:
    //     this.uploaderByLaw.queue.forEach((obj, index) => {
    //       let file = obj._file;
    //       let type = this.getFileType(file);
    //       if (!obj.url) {
    //         if (!this.checkFileType(type)) {
    //           this.toastrService.error(this.commonLabels.errorMessages.invalidFileType);
    //           this.uploaderByLaw.queue[index].remove();
    //         }
    //         else {
    //           let formData = this.setFormData(obj._file);
    //           this.uploadDocument(formData, documentType, obj, index);
    //         }
    //       }

    //     });
    //     break;
    //   case DOCUMENT_TYPES.addressConfirmation:
    //     this.uploaderAC.queue.forEach((obj, index) => {
    //       let file = obj._file;
    //       let type = this.getFileType(file);
    //       if (!obj.url) {
    //         if (!this.checkFileType(type)) {
    //           this.toastrService.error(this.commonLabels.errorMessages.invalidFileType);
    //           this.uploaderAC.queue[index].remove();
    //         }
    //         else {
    //           let formData = this.setFormData(obj._file);
    //           this.uploadDocument(formData, documentType, obj, index);
    //         }
    //       }

    //     });
    //     break;
    //   case DOCUMENT_TYPES.imss:
    //     this.uploaderIMSS.queue.forEach((obj, index) => {
    //       let file = obj._file;
    //       let type = this.getFileType(file);
    //       if (!obj.url) {
    //         if (!this.checkFileType(type)) {
    //           this.toastrService.error(this.commonLabels.errorMessages.invalidFileType);
    //           this.uploaderIMSS.queue[index].remove();
    //         }
    //         else {
    //           let formData = this.setFormData(obj._file);
    //           this.uploadDocument(formData, documentType, obj, index);
    //         }
    //       }

    //     });
    //     break;

    //   case DOCUMENT_TYPES.others:
    //     this.uploaderOthers.queue.forEach((obj, index) => {
    //       let file = obj._file;
    //       let type = this.getFileType(file);
    //       if (!obj.url) {
    //         if (!this.checkFileType(type)) {
    //           this.toastrService.error(this.commonLabels.errorMessages.invalidFileType);
    //           this.uploaderOthers.queue[index].remove();
    //         }
    //         else {
    //           let formData = this.setFormData(obj._file);
    //           this.uploadDocument(formData, documentType, obj, index);
    //         }
    //       }

    //     });
    //     break;

    // }

  }

  setFormData(file) {
    let formData: FormData = new FormData();
    formData.append('file', file);
    return formData;
  }

  ngDoCheck() {
    this.checkFileUploadingStatus();
  }


  checkFileUploadingStatus() {
    if (this.multipleDocumentUpload.length > 0 && this.disableButton) {
      let disableButtonFlag = false;
      // tslint:disable-next-line:forin
      for (const documentArr in this.multipleDocumentUpload) {
        for (let index = 0; index < this.multipleDocumentUpload[documentArr].length; index++) {
          if (!this.multipleDocumentUpload[documentArr][index]) {
            this.disableButton = true;
            disableButtonFlag = true;
            break;
          }
        }
        if (disableButtonFlag) {
          break;
        }
      }
      if (!disableButtonFlag) {
        this.disableButton = false;
      }
    }
  }





  uploadDocument(obj: any = {}, formData, type: any = "", index) {
    if (!this.multipleDocumentUpload[type]) {
      this.multipleDocumentUpload[type] = [];
    }
    if (!this.multipleDocumentUpload[type][index]) {
      this.multipleDocumentUpload[type][index] = false;
    }
    this.multipleDocumentUpload[type][index] = false;

    this.disableButton = true;
    this._sharedService.uploadFile(formData).subscribe((imageResponse: any) => {
      if (Common.checkStatusCodeInRange(imageResponse.header.statusCode)) {


        let data = imageResponse.payload.result;
        obj.url = data.url;
        this.setdocumentId(data.id, type);
        delete obj['inProgress'];
      } else {

        this.multipleDocumentUpload[type][index] = true;

        if (imageResponse.header) {
          //this.disableButton = false ;
          //this.toastrService.error(imageResponse.header.message);
        } else {
          //this.disableButton = false ;
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





  setDocumentName(index) {
    let fileName = $('#docName' + index).val();
    this.documents.selectedOtherDocs[index].name = fileName;
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
    }
    else {
      return false;
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
          this.manageVendorForm.controls['docConstancia'].setValue('uploaded');
        }
        else {
          this.manageVendorForm.controls['docConstancia'].setValue('');
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
          this.manageVendorForm.controls['doc32D'].setValue('uploaded');
        }
        else {
          this.manageVendorForm.controls['doc32D'].setValue('');
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
          this.manageVendorForm.controls['docRepId'].setValue('uploaded')
        }
        else {
          this.manageVendorForm.controls['docRepId'].setValue('')
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
          this.manageVendorForm.controls['docByLaw'].setValue('uploaded')
        }
        else {
          this.manageVendorForm.controls['docByLaw'].setValue('')
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
          this.manageVendorForm.controls['docAC'].setValue('uploaded');
        }
        else {
          this.manageVendorForm.controls['docAC'].setValue('');
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
          this.manageVendorForm.controls['docIMSS'].setValue('uploaded')
        }
        else {
          this.manageVendorForm.controls['docIMSS'].setValue('')
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
  /*multiple image upload functionality*/

  removeExtraBlankRowOfRepresentative() {
    const representatives = <FormArray>this.manageVendorForm.controls['representatives'];
    const repFormGrp = representatives.controls[representatives.length - 1];
    if ((!repFormGrp.value.repName || !repFormGrp.value.repEmail || !repFormGrp.value.repPhone) && representatives.length > 1) {
      representatives.removeAt(representatives.length - 1);
    }
  }
  /**
  **  method to show/hide floating buttons on window scroll after timeout of 50 ms
  **/
  showHideFloatingButtons(time) {
    setTimeout(() => {
      this.onWindowScroll();
    }, time);
  }
}
