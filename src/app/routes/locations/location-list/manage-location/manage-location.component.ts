import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HostListener } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ModalDirective, BsModalRef, BsModalService } from 'ngx-bootstrap';
import * as _ from 'lodash';
import 'hammerjs';
import { Lightbox, LightboxEvent, LIGHTBOX_EVENT, LightboxConfig } from 'ngx-lightbox';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { ManageLocationData } from './manage-location.data.model';
import { ManageLocationService } from './manage-location.service';
import { SharedService } from '@app/shared/shared.service';
import { Common, NavigationService, CustomValidators, SessionService } from '@app/common';
import { IMAGE_ERROR_TYPES, IMAGE_DIMENSION, IMAGE_SIZE } from '../../constants';
import {
  ROUTER_LINKS_FULL_PATH, MAP_URLS,
  COOKIES_CONSTANTS, LOCATION_IMAGES_FILE_TYPE, FILE_TYPES, DEFAULT_CURRENCY, DEFAULT_GALLERY_OPTIONS
} from '@app/config';
import { Subscription } from 'rxjs/Subscription';
import { INgxGalleryOptions, NgxGalleryComponent, NgxGalleryImage } from 'ngx-gallery';
import { HttpEventType, HttpResponse } from '@angular/common/http';
declare var google: any;
const URL = '';
declare var $: any;
const swal = require('sweetalert');
@Component({
  selector: 'app-manage-location',
  templateUrl: './manage-location.component.html',
  styleUrls: ['./manage-location.component.scss']
})

export class ManageLocationComponent implements OnInit {
  streetViewLocationLatLong: any;
  ROUTER_LINKS_FULL_PATH = ROUTER_LINKS_FULL_PATH;
  manageLocationForm: FormGroup;
  addNewCategoryForm: FormGroup;
  selectedCategories: any = [];
  tempSelectedCategories: any = [];
  categoryList: any = [];
  categorysList: any = [];
  removeSelectedArr: any = [];
  tempCategoryList: any = [];
  categoryListFlag: Boolean = false;
  fileName: any;
  errorImageStatusArr: any = [];
  showLoader: Boolean = false;
  locationId = '';
  LocationDetails: any = [];
  removeComputerSelectedArr: any = [];
  computerGalleryImages: any = [];
  streetViewGalleryImages: any = [];
  currencies: any = [];
  largeImage: string;
  DEFAULT_CURRENCY = DEFAULT_CURRENCY;
  smallImage: string;
  StreetViewArray: any = [];
  streetViewImageCount: any = 0;
  _album: any = [];
  totalCount1: any;
  totalComputerImagesCount1: any;
  streetViewParam: any;
  streetViewArrayHeader: Boolean = false;
  computerUploadArrayHeader: Boolean = false;
  computerUploadArray: any = [];
  allImagesArray: any = [];
  selectedCategoryHierarchyStr: any = '';
  categoryId: any = '';
  documents: any = {
    locationAttachmentsDocs: [],
    bankattachmentsDocs: [],
    bankdocId: '',
  };
  financialDetails: Boolean = false;
  setStreetImageSelectAllFlag: Boolean = false;
  showmsg: Boolean = false;
  streetViewTags: any = [];
  compterImagesTags: any = [];
  contactPersonIdArray: any = [];
  allImagesIndex: any = 0;
  locationImagesIndex: any = 0;
  streetViewIndex: any = 0;
  allImagesToDisplay: any = [];
  isSetStreetSelectNone: Boolean = true;
  tagEditOptionFlag: Boolean = false;
  spinnerFlag: Boolean = false;
  submitManageLocationForm: Boolean = false;
  submitCategoryFlag: Boolean = false;
  DefaultContactPersonArrayAddedFlag: Boolean = false;
  validContactPersonDetails: Boolean = false;
  enableSaveButtonFlag: Boolean = true;
  newCategory: any = '';
  filesReceived: any = 0;
  isClicked: Boolean = false;
  categoryAdded: any;
  lightBoxImageIndex: number;
  subscription: Subscription;
  imageStatusArr$ = [];
  locationData: any;
  warningMsg: string;
  confirmationessMsg: string;
  cancelMsg: string;
  saveMsg: string;
  errMsg: string;
  bankfilesReceived: number;
  renderPage: Boolean = false;
  bankDocId: any;
  locationDocId: any;
  setComputerSelectAllFlag: Boolean = false;
  isSetComputerSelectNone: Boolean = true;
  commonJsonTextMessages: any;
  locationImagesResponceArray: any = [];
  imagesData = [];
  imagesCounter = [];
  imagesReceived = [];
  totalPreviousImagesCount = 0;
  currentImageOrientation: string = '';
  imageType: string = '';
  oldComputerGalleryImages: any = [];
  tagFocusFlag: Boolean = false;
  showImageStatusBlock: boolean = false;
  @ViewChild('gallery') gallery: NgxGalleryComponent;
  @ViewChild('classicModal') public classicModal: ModalDirective;
  public galleryOptions: INgxGalleryOptions[] = DEFAULT_GALLERY_OPTIONS
  galleryImages = [];
  @ViewChild('galleryModal') public galleryModal: ModalDirective;
  // public locationAttachments: FileUploader = new FileUploader({ url: URL });
  // public bankattachments: FileUploader = new FileUploader({ url: URL });
  bsModalRef: BsModalRef;
  public attachements: any = {
    location: new FileUploader({ url: URL }),
    bank: new FileUploader({ url: URL }),
  };
  fileTypes: any = {
    location: 'location',
    bank: 'bank'
  };
  filesCounter: any = {
    location: 0,
    bank: 0
  };
  breadcrumbData: any = {
    title: 'location.labels.addLocation',
    subTitle: 'location.labels.addLocationSubtitle',
    data: [{
      text: 'common.labels.home',
      link: '/'
    },
    {
      text: 'location.labels.locationList',
      link: ROUTER_LINKS_FULL_PATH.locationsView
    },
    {
      text: 'location.labels.addLocation',
      link: ''
    }
    ]
  };
  IMAGE_SIZE = IMAGE_SIZE;
  IMAGE_DIMENSION = IMAGE_DIMENSION;
  IMAGE_ERROR_TYPES = IMAGE_ERROR_TYPES;
  constructor(private fb: FormBuilder,
    private _ManageLocationService: ManageLocationService,
    private sessionService: SessionService,
    private _sharedService: SharedService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private _lightbox: Lightbox, private _lightboxEvent: LightboxEvent,
    private _lighboxConfig: LightboxConfig,
    private modalService: BsModalService,
    private translateService: TranslateService,

    private navigationService: NavigationService) {
    _lighboxConfig.showImageNumberLabel = true;
  }

  // called at time of page initialization
  ngOnInit() {
    Common.scrollTOTop();
    this.getListOfCategory();
    this.getCurrencies();
    this.renderGoogleMap();
    this.manageLocationForm = this.createAddLocationFormGroup();
    this.addNewCategoryForm = this.createAddCategoryFormGroup();
    this.setContactPersonDefaultArr();
    this.DefaultContactPersonArrayAddedFlag = true;
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.locationId = params['id'];
        this.tagEditOptionFlag = true;
        this.getLocationsDetails(this.locationId);
        this.breadcrumbData.title = 'location.labels.editLocation';
        this.breadcrumbData.subTitle = 'location.labels.editLocationSubtitle';
        this.breadcrumbData.data[2].text = 'location.labels.editLocation';
      } else {
        this.tagEditOptionFlag = false;
        this.selectLocationImagePanel();
        this.manageLocationForm.patchValue({
          currencyId: DEFAULT_CURRENCY.id
        });
      }
    });
    if (!this.locationId) {
      this.renderPage = true;
    }
    this.financialDetails = this.route.snapshot.queryParams['financialDetails'];
    this.translateFunc();
    this.subscription = this._lightboxEvent.lightboxEvent$
      .subscribe((event: any) => {
        if ((event.id === LIGHTBOX_EVENT.OPEN) || (event.id === LIGHTBOX_EVENT.CHANGE_PAGE)) {
          // this.setOrientationToImage(event);
        }
      });
  }

  getCurrencies() {
    this._sharedService.getCurrencies().subscribe((response: any) => {
      if (Common.checkStatusCode(response.header.statusCode)) {
        if (response.payload && response.payload.results) {
          const currencies = response.payload.results;
          this.currencies = Common.getMultipleSelectArr(currencies, ['id'], ['code']);
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
  // gets formGroup controls to check error fields on UI
  getFormGroupControls(formGroupName, formControlName) {
    const formGroup = this.manageLocationForm.get(formGroupName) as FormGroup;
    return formGroup.controls[formControlName];
  }

  // gets formArray controls to check error fields on UI
  getFormArrayControls(formArrayName, formControlName, index) {
    const formArray = this.manageLocationForm.get(formArrayName) as FormArray;
    const formArray1 = formArray.controls[index] as FormArray;
    return formArray1.controls[formControlName];
  }


  setValidatorsAndUpdateValue(controlname: string, validators: any = [], switchParam, setClearValidatorFlag) {
    let baseControl;
    if (switchParam === true) {
      baseControl = this.manageLocationForm;
    } else {
      baseControl = <FormGroup>this.manageLocationForm.controls['computerForm'];
    }
    // baseControl.controls[controlname].reset();
    if (setClearValidatorFlag === true) {
      baseControl.controls[controlname].setValidators(validators);
    } else {
      baseControl.controls[controlname].clearValidators();
    }
    if (validators.length === 0) {
      baseControl.controls[controlname].setErrors(null);
    }
    baseControl.controls[controlname].updateValueAndValidity();
  }
  // It displays relevent image selection panel on UI
  selectLocationImagePanel() {
    if (this.manageLocationForm.value) {
      if (this.manageLocationForm.value.imagesPanel === 0) {
        this.uploadFromComputer();
        this.setValidatorsAndUpdateValue('streetViewCity', [], true, false);
        this.setValidatorsAndUpdateValue('streetViewState', [], true, false);
        this.setValidatorsAndUpdateValue('city', [CustomValidators.required], false, true);
        this.setValidatorsAndUpdateValue('state', [CustomValidators.required], false, true);
        this.setValidatorsAndUpdateValue('locationAdd', [CustomValidators.required], false, true);
      } else if (this.manageLocationForm.value.imagesPanel === 1) {
        this.googleMaps();
        this.setValidatorsAndUpdateValue('streetViewCity', [CustomValidators.required], true, true);
        this.setValidatorsAndUpdateValue('streetViewState', [CustomValidators.required], true, true);
        this.setValidatorsAndUpdateValue('city', [], false, false);
        this.setValidatorsAndUpdateValue('state', [], false, false);
        this.setValidatorsAndUpdateValue('locationAdd', [], false, false);
      }
    }
  }

  // It downloads the image
  downloadFile(item, streetViewImagesFlag: Boolean = false) {
    const a = document.createElement('a');

    if (streetViewImagesFlag) {
      Common.getJpegImageWithUrl(item.originalImageUrl, function (img) {
        a.href = img;
        a.download = item.fileName + '.jpg';
        a.target = 'blank';
        document.body.appendChild(a);
        a.click();
      });
    } else {
      a.href = item.originalImageUrl;
      a.download = item.fileName;
      a.target = 'blank';
      document.body.appendChild(a);
      a.click();
      
    }
  }

  // It adds the category in to the DB
  addCategory() {
    this.submitCategoryFlag = true;
    if (this.addNewCategoryForm.valid) {
      this.submitCategoryFlag = false;
      const catObj: any = {};
      const data: any = {};
      data.categoryName = this.addNewCategoryForm.value.newCategory;
      const langCode = this.sessionService.getCookie(COOKIES_CONSTANTS.langCode);
      data.langCode = langCode;
      catObj.i18n = data;
      this._ManageLocationService.addNewCategory(catObj).subscribe((response: any) => {
        if (Common.checkStatusCodeInRange(response.header.statusCode)) {
          this.getListOfCategory();
          this.classicModal.hide();
          this.toastrService.success(this.categoryAdded);
        }
        else {
          this.toastrService.error(response.header.message);
        }
      });
    }
  }

  // It opens and closes add category pop-up
  OpenAddCategoryModel() {
    this.classicModal.show();
    setTimeout(function () {
      if ($('#containerDiv .list-item') && $('#containerDiv .list-item')[0]) {
        $('#containerDiv .list-item')[0].scrollIntoView();
      }
    }, 200);
    this.selectedCategories = (this.tempSelectedCategories.length > 0) ? this.tempSelectedCategories : this.LocationDetails.categories;
  }
  closeAddCategoryModel() {
    this.selectedCategories = [];
    this.classicModal.hide();
  }
  categorySelected(value) {
    this.tempSelectedCategories = value;
    this.setCategoryName(value, 'name');
    this.closeAddCategoryModel();
  }
  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.closeAddCategoryModel();
    }
    // if (event.keyCode === 13) {
    //   event.preventDefault();
    //   this.tagFocusFlag = $('.ng2-tag-input__text-input').is(':focus');
    //   if (this.enableSaveButtonFlag && !this.spinnerFlag && !this.classicModal.isShown && !this.tagFocusFlag) {
    //     this.addLocation();
    //   }
    // }
  }

  // It gets location details wrt location Id received from location list
  getLocationsDetails(locationId) {
    this._ManageLocationService.getLocationData(locationId).subscribe((response: any) => {
      if (Common.checkStatusCode(response.header.statusCode)) {
        const LocationDetails = ManageLocationData.getManageLocationDetails(response.payload.result);
        this.LocationDetails = LocationDetails;
        this.setFormValues(LocationDetails);
        this.selectLocationImagePanel();
        this.renderPage = true;
      }
      else {
        this.toastrService.error(response.header.message);
      }
    });
  }
  setDocumentName(index) {
    const fileName = $('#docName' + index).val();
    this.documents.locationAttachmentsDocs[index].name = fileName;

  }
  // it sets the value of permit type to manageLocationForm
  selectPermitType() {
    if (this.manageLocationForm.value && this.locationId === '') {
      if (this.manageLocationForm.value.locationType === 0) {
        this.manageLocationForm.patchValue({
          permit: true
        });
      }
    }
  }
  setCategoryName(categories, mappingName) {
    const dataArr = _.map(categories, mappingName);
    const lastItem = _.findLast(categories);
    this.manageLocationForm.controls['category'].setValue(lastItem.id);
    this.selectedCategoryHierarchyStr = (dataArr.length > 0) ? dataArr.join(' > ') : '';
  }
  // It sets value of manageLocationForm with data received from the service
  setFormValues(data) {
    this.manageLocationForm.patchValue({
      id: data.id,
      locationName: data.i18n.name,
      locationType: data.locationType,
      permit: data.permitRequired,
      currency: data.currency,
      approxPrice: data.approximatePrice,
      currencyId: data.currencyId,
      locationURL: data.locationURL,
      description: data.description,
      imagesPanel: 0,
      computerForm: ({
        locationAdd: data.i18n.address,
        city: data.city,
        state: data.state,
        // locationUpload: ""
      }),
      accountNumber: data.accountNumber,
      bankName: data.bankName,
      branchName: data.branchName,
      clabe: data.clabe,
      bankAddress: data.bankAddress,
      extraHours: data.extraHours,
      locationSettingCost: data.locationSettingCost,
      deed: data.deed,
      identity: data.identity,
      proofAddress: data.proofAddress,
      receiptNo: data.receiptNo,
      timeForProcedure: data.timeForProcedure,
      spacesDescription: data.spacesDescription,
      facilities: data.facilities,
      restrictions: data.restrictions,
      availability: data.availability,
      parking: data.parking,
      neighborhoodFacilities: data.neighborhoodFacilities,
      distanceFromMainBase: data.distanceFromMainBase,
      hospital: data.hospital,
      lodging: data.lodging,
      shops: data.shops,
      financialUpload: '',
      locationAttachments: [''],
      streetViewCity: [''],
      streetViewState: [''],
      disableContactInformation: data.disableContactInformation
    });
    if (data.categories.length > 0) {
      this.setCategoryName(data.categories, 'i18n.name');
      this.selectedCategories = data.categories;
    }
    // if (data.disableContactInformation) {
    //   this.contactInformationChecked();
    // }
    if (data.computerImages.length > 0) {
      // this.manageLocationForm.patchValue({
      //   imagesPanel: 0
      // });
      this.computerUploadArrayHeader = true;
      this.manageLocationForm.patchValue({
        imagesAttached: true
      });


      const locationUpload = <FormArray>this.manageLocationForm.controls['locationUpload'];
      this.totalPreviousImagesCount = data.computerImages.length;
      this.computerGalleryImages = [];
      for (let i = 0; i < data.computerImages.length; i++) {
        let obj = data.computerImages[i];
        this.setLocationUploadDefaultArr(false);
        this.computerGalleryImages.push({
          small: obj.thumbnailImageUrl ? obj.thumbnailImageUrl : '',
          medium: obj.thumbnailImageUrl ? obj.thumbnailImageUrl : '',
          big: obj.originalImageUrl ? obj.originalImageUrl : '',
          imageOrientation: obj.imageOrientation ? obj.imageOrientation : 1,
        });
        locationUpload.controls[i].patchValue({
          id: data.computerImages[i].id,
          originalImageId: data.computerImages[i].originalImageId,
          thumbnailImageId: data.computerImages[i].thumbnailImageId,
          originalImageUrl: data.computerImages[i].originalImageUrl,
          imageOrientation: data.computerImages[i].imageOrientation,
          fileName: data.computerImages[i].fileName,
          thumbnailImageUrl: data.computerImages[i].thumbnailImageUrl,
          tags: data.computerImages[i].tags,
          age: data.computerImages[i].age
        });
        this.locationImagesIndex++;
      }


      this.oldComputerGalleryImages = Object.assign([], this.computerGalleryImages);


    }
    if (data.streetViewImages.length > 0) {
      // this.manageLocationForm.patchValue({
      //   imagesPanel: 1
      // });
      this.streetViewArrayHeader = true;

      const streetViewImages = <FormArray>this.manageLocationForm.controls['streetViewImages'];
      for (let i = 0; i < data.streetViewImages.length; i++) {
        let obj = data.streetViewImages[i];
        this.setStreetViewImagesDefaultArray(false);
        this.streetViewGalleryImages.push({
          small: obj.thumbnailImageUrl ? obj.thumbnailImageUrl : '',
          medium: obj.thumbnailImageUrl ? obj.thumbnailImageUrl : '',
          big: obj.originalImageUrl ? obj.originalImageUrl : '',
          imageOrientation: obj.imageOrientation ? obj.imageOrientation : 1,
        });
        //Common.getJpegImageWithUrl(data.streetViewImages[i].originalImageUrl, function (img) {
          streetViewImages.controls[i].patchValue({
            id: data.streetViewImages[i].id,
            fileName: data.streetViewImages[i].fileName,
            thumbnailImageUrl: data.streetViewImages[i].thumbnailImageUrl,
            originalImageUrl: data.streetViewImages[i].originalImageUrl,
            imageOrientation: data.streetViewImages[i].imageOrientation,
            tags: data.streetViewImages[i].tags,
            age: data.streetViewImages[i].age
          });
        //});

        this.streetViewIndex++;
      }
    }
    const contactPersonDetails = data.i18n.contactPersonDetails;

    if (contactPersonDetails.length > 0) {

      const contactPersonDetailsControlArray = <FormArray>this.manageLocationForm.get('contactPersons');
      for (let i = 0; i < contactPersonDetails.length; i++) {
        if (!this.DefaultContactPersonArrayAddedFlag) {
          this.addContactPersons(false);
        }
        else {
          this.DefaultContactPersonArrayAddedFlag = false;
        }

        const abc = <FormGroup>contactPersonDetailsControlArray.controls[i];
        abc.patchValue({
          'name': contactPersonDetails[i].name,
          'email': contactPersonDetails[i].email,
          'phoneNumber': contactPersonDetails[i].phoneNumber,
          'phoneNumberWork': contactPersonDetails[i].phoneNumberWork,
          'id': contactPersonDetails[i].id,
          'primary': JSON.stringify(contactPersonDetails[i].primary),
          'disableContactInformation': contactPersonDetails[i].requiredContactInfo

        });
        this.contactPersonIdArray[i] = contactPersonDetails[i].id;
      }
    }
    if (data.disableContactInformation) {
      this.contactInformationChecked();
    }
    const locationObj = _.filter(data.locationDocs, { 'documentType': 'otherDocuments' });
    const bankObj = _.find(data.locationDocs, { 'documentType': 'bankStatement' });
    if (locationObj.length > 0) {
      this.attachements.location.queue = [];
      for (let i = 0; i < locationObj.length; i++) {
        const file = new File([''], locationObj[i].files[0].fileName);
        const fileItem = new FileItem(this.attachements.location, file, {});
        this.attachements.location.queue.push(fileItem);
        this.attachements.location.queue[i].url = locationObj[i].files[0].fileUrl;
        this.setDocumentId(locationObj[i].files[0].fileId, locationObj[i].id, locationObj[i].name);
        setTimeout(function () {
          $('#docName' + i).val(locationObj[i].name);
        }, 500);
      }
    }
    if (bankObj) {
      if (bankObj.files) {
        this.bankDocId = bankObj.id;
        this.attachements.bank.queue = [];
        for (let i = 0; i < bankObj.files.length; i++) {
          const file = new File([''], bankObj.files[i].fileName);
          const fileItem = new FileItem(this.attachements.bank, file, {});
          this.attachements.bank.queue.push(fileItem);
          this.attachements.bank.queue[i].url = bankObj.files[i].fileUrl;
          this.setBankDocumentId(bankObj.files[i].fileId);
        }
      }
    }
    this.streetViewTags = '';
    this.compterImagesTags = '';
    if (this.financialDetails) {
      setTimeout(function () {
        $('html, body').animate({
          scrollTop: ($('#financialDetails').offset().top - 80)
        }, 0);
      }, 1000);


    }
  }

  // It switched the image selection screen
  uploadFromComputer() {
    document.getElementById('computer').style.display = 'block';
    document.getElementById('googlemaps').style.display = 'none';
  }
  googleMaps() {
    // this.renderGoogleMap();
    document.getElementById('computer').style.display = 'none';
    document.getElementById('googlemaps').style.display = 'block';
  }

  // It creates the default structure of manageLocationForm at the time of page initialization
  createAddLocationFormGroup(): FormGroup {
    return this.fb.group({
      id: [''],
      locationName: ['', [CustomValidators.required]],
      locationType: ['', [CustomValidators.required]],
      permit: ['', [CustomValidators.required]],
      category: ['', [CustomValidators.required]],
      approxPrice: ['', [CustomValidators.required, CustomValidators.checkDecimal]],
      currencyId: ['', [CustomValidators.required]],
      locationURL: [''],
      description: [''],
      imagesPanel: [0],
      computerForm: this.fb.group({
        locationAdd: ['', [CustomValidators.required]],
        city: ['', [CustomValidators.required]],
        state: ['', [CustomValidators.required]],
        // locationUpload: [''],
      }),
      contactPersons: this.fb.array([]),
      accountNumber: [''],
      bankName: [''],
      branchName: [''],
      clabe: [''],
      bankAddress: [''],
      extraHours: ['', [CustomValidators.checkDecimal]],
      locationSettingCost: ['', [CustomValidators.checkDecimal]],
      deed: [''],
      identity: [''],
      proofAddress: [''],
      receiptNo: [''],
      timeForProcedure: ['', [CustomValidators.checkDecimal]],
      spacesDescription: [''],
      facilities: [''],
      restrictions: [''],
      availability: [''],
      parking: [''],
      neighborhoodFacilities: [''],
      distanceFromMainBase: [''],
      hospital: [''],
      lodging: [''],
      shops: [''],

      locationAttachments: [''],
      bankattachments: [''],
      allImages: this.fb.array([]),
      streetViewImages: this.fb.array([]),
      locationUpload: this.fb.array([]),
      streetViewCity: [''],
      streetViewState: [''],
      imagesAttached: ['', [CustomValidators.required]],
      disableContactInformation: [false],
      selectAll: [''],
      selectAllStreetImages: ['']
    });
  }

  createAddCategoryFormGroup(): FormGroup {
    return this.fb.group({
      newCategory: ['', [CustomValidators.required]]
    });
  }

  setApproxPriceToZero() {
    if (isNaN(this.manageLocationForm.value.approxPrice)) {
      this.manageLocationForm.controls['approxPrice'].setValue(0);
    }
  }
  // It sets contact person array at the time of page initialization
  setContactPersonDefaultArr() {
    const contactPersons = <FormArray>this.manageLocationForm.controls['contactPersons'];
    contactPersons.push(this.contactPersons());
  }

  // It sets location images default array
  setLocationUploadDefaultArr(newImage: Boolean) {
    const locationUpload = <FormArray>this.manageLocationForm.controls['locationUpload'];
    if (newImage) {
      locationUpload.insert(0, this.locationUpload());
    } else {
      locationUpload.push(this.locationUpload());
    }

  }

  // It sets streetView images default array
  setStreetViewImagesDefaultArray(newImage: Boolean) {
    const streetViewImages = <FormArray>this.manageLocationForm.controls['streetViewImages'];
    if (newImage) {
      streetViewImages.insert(0, this.locationUpload());
    } else {
      streetViewImages.push(this.locationUpload());
    }


  }

  // It creates the default structure of Images formArray
  locationUpload(): FormGroup {
    return this.fb.group({
      id: [''],
      originalImageId: [''],
      thumbnailImageId: [''],
      originalImageUrl: [''],
      fileName: [''],
      thumbnailImageUrl: [''],
      tags: [''],
      age: [''],
      imageOrientation: [''],
      selection: ['']
    });
  }

  // It creates the default structure of contact persons formArray
  contactPersons(): FormGroup {
    return this.fb.group({
      name: ['', [CustomValidators.required]],
      email: ['', [CustomValidators.checkEmail, CustomValidators.required]],
      phoneNumber: ['', [CustomValidators.required]],
      phoneNumberWork: ['', [CustomValidators.required]],
      id: [''],
      primary: ['1'],
      disableContactInformation: ['']
    });
  }
  selectPrimary(index, value) {
    const contactPersons = <FormArray>this.manageLocationForm.controls['contactPersons'];
    const repFormGrp = contactPersons.controls[index];

    if (repFormGrp.value.phoneNumber === '') {
      contactPersons.controls[index].patchValue({
        primary: '2'
      });
    }
    if (repFormGrp.value.phoneNumberWork === '') {
      contactPersons.controls[index].patchValue({
        primary: '1'
      });
    }
  }
  // It adds contact person new arry
  addContactPersons(checkValidation, index = 0) {
    const contactPersons = <FormArray>this.manageLocationForm.controls['contactPersons'];
    if (checkValidation) {
      const repFormGrp = contactPersons.controls[index];
      const frmGroup = <FormGroup>contactPersons.controls[index];
      if (frmGroup.value.phoneNumberWork || frmGroup.value.phoneNumber) {
        frmGroup.controls['phoneNumber'].setValidators(null);
        frmGroup.controls['phoneNumber'].updateValueAndValidity();
        frmGroup.controls['phoneNumberWork'].setValidators(null);
        frmGroup.controls['phoneNumberWork'].updateValueAndValidity();
      } else {
        frmGroup.controls['phoneNumber'].setValidators([CustomValidators.required]);
        frmGroup.controls['phoneNumber'].updateValueAndValidity();
        frmGroup.controls['phoneNumberWork'].setValidators([CustomValidators.required]);
        frmGroup.controls['phoneNumberWork'].updateValueAndValidity();
      }
      if ((repFormGrp.value.name !== '' && repFormGrp.value.email !== '' &&
        (repFormGrp.value.phoneNumber !== '' || repFormGrp.value.phoneNumberWork !== '')) && repFormGrp.valid) {
        contactPersons.push(this.contactPersons());
        this.validContactPersonDetails = false;
      } else {

        this.validContactPersonDetails = true;
      }
    }
    else {
      contactPersons.push(this.contactPersons());
    }
  }

  // It deletes selected contact person arry
  removeContactPerson(eventIndex) {
    const contactPerson = <FormArray>this.manageLocationForm.controls['contactPersons'];
    contactPerson.removeAt(eventIndex);
  }

  // It gets list of all categories from the service
  getListOfCategory() {
    this._ManageLocationService.getCategoryList().subscribe((responseData: any) => {
      if (Common.checkStatusCode(responseData.header.statusCode)) {
        if (responseData.payload.results) {
          this.categoryListFlag = true;
          this.categorysList = responseData.payload.results;
          this.categoryList = Common.getMultipleSelectArr(this.categorysList, ['id'], ['i18n', 'name']);
        }
      }
    }, error => {
      this.categoryListFlag = false;
    });
  }

  // map
  renderGoogleMap() {
    let sv;
    const self = this;
    let map;
    let panorama;
    let streetViewLocation = '';
    const streetViewLocationLatLong = '';
    initAutocomplete();
    function initAutocomplete() {
      map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 19.434717, lng: -99.149802 },
        zoom: 7,

      });
      panorama = map.getStreetView();

      const input = document.getElementById('pac-input');
      const searchBox = new google.maps.places.SearchBox(input);
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
      google.maps.event.addListener(map.getStreetView(), 'visible_changed', function () {
        self.streetViewParam = '';
        if (this.getVisible()) {
          sv = new google.maps.StreetViewService();
          google.maps.event.clearListeners(map.getStreetView(), 'pov_changed');
          google.maps.event.clearListeners(map.getStreetView(), 'position_changed');
          google.maps.event.addListener(map.getStreetView(), 'pov_changed', function () {
            generateUrl(this.position, this.pov, self);
          });
          google.maps.event.addListener(map.getStreetView(), 'position_changed', function () {
            generateUrl(this.position, this.pov, self);
          });
        } else {
          google.maps.event.clearListeners(map.getStreetView(), 'pov_changed');
          google.maps.event.clearListeners(map.getStreetView(), 'position_changed');
        }
      });
      // Bias the SearchBox results towards current map's viewport.
      map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
      });
      let markers = [];
      // Listen for the event fired when the user selects a prediction and retrieve
      // more details for that place.
      searchBox.addListener('places_changed', function () {
        const places = searchBox.getPlaces();
        if (places.length === 0) {
          return;
        }

        // Clear out the old markers.
        markers.forEach(function (marker) {
          marker.setMap(null);
        });
        markers = [];
        // For each place, get the icon, name and location.
        const bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
          if (!place.geometry) {
            return;
          }
          const icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };
          // Create a marker for each place.
          markers.push(new google.maps.Marker({
            map: map,
            icon: icon,
            title: place.name,
            position: place.geometry.location
          }));
          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        map.fitBounds(bounds);
      });
    }
    // tslint:disable-next-line:no-shadowed-variable
    function generateUrl(location, pov, self) {

      let calculatedfov;
      let fov = 180 / Math.pow(2, pov.zoom);
      fov = (fov < 10 ? 10 : fov);
      fov = (fov > 120 ? 120 : fov);
      if (fov !== undefined && !isNaN(fov)) {
        calculatedfov = '&fov=' + fov;
      } else {
        calculatedfov = '';
      }
      self.locationData = location;
      const locationField = location.toUrlValue();
      const headingField = pov.heading = (pov.heading < 0 ? pov.heading - Math.floor(pov.heading / 360) * 360 : pov.heading);
      const pitchField = pov.pitch;
      self.streetViewParam = 'location=' + locationField + calculatedfov + '&pitch=' + Math.round(pitchField) +
        '&heading=' + Math.round(headingField) + '&sensor=false';
      const latLonSplit = locationField.split(',');

      if (streetViewLocation === '' || streetViewLocation === undefined) {
        sv.getPanorama({ location: { lat: parseFloat(latLonSplit[0]), lng: parseFloat(latLonSplit[1]) }, radius: 50 }, processSVData);
        self.streetViewLocationLatLong = locationField;
      }
    }

    function processSVData(data, status) {
      if (status === 'OK') {
        streetViewLocation = data.location.description;
      }
    }
  }

  // It populates city and state received from streetView ans patches with form
  populateStateCity(response) {
    const self = this;
    const geocoder = new google.maps.Geocoder();
    const value = response.split(',');
    const lat = parseFloat(value[0]);
    const lng = parseFloat(value[1]);
    const latlng = new google.maps.LatLng(lat, lng);
    let state = '';
    let city = '';
    geocoder.geocode({
      'latLng': latlng
    }, function (results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          results[0].address_components.forEach((address) => {
            if (address.types[0] === 'administrative_area_level_2' || address.types[0] === 'administrative_area_level_3') {
              city = address.long_name;
            }
            if (address.types[0] === 'administrative_area_level_1') {
              state = address.long_name;
            }
          });
          self.manageLocationForm.patchValue({
            streetViewCity: city,
            streetViewState: state
            // computerForm: {
            //   city: city,
            //   state: state
            // }
          });

        }
      }
    });

  }

  getStreetViewImage() {
    this.totalCount1 = this.StreetViewArray.length + 1;
    if (this.streetViewParam !== undefined && this.streetViewParam !== '') {
      this.streetViewArrayHeader = true;
      if (this.StreetViewArray.length < 30) {
        this.fileName = this.locationData.locationName === undefined ? 'location_' : this.locationData.locationName + '_';
        this.smallImage = MAP_URLS.STREET_VIEW_SMALL + this.streetViewParam;
        this.largeImage = MAP_URLS.STREET_VIEW_LARGE + this.streetViewParam;
        const streetViewImages = <FormArray>this.manageLocationForm.controls['streetViewImages'];
        this.setStreetViewImagesDefaultArray(true);
        streetViewImages.controls[0].patchValue({
          originalImageUrl: this.largeImage,
          fileName: this.fileName + (this.manageLocationForm.value.streetViewImages.length),
          thumbnailImageUrl: this.smallImage,
          tags: []
        });


        let tempObj = {
          small: this.smallImage ? this.smallImage : '',
          medium: this.smallImage ? this.smallImage : '',
          big: this.largeImage ? this.largeImage : '',
          imageOrientation: 1,
        };

        this.streetViewGalleryImages = [tempObj, ...this.streetViewGalleryImages];

        this.streetViewIndex++;
        this.streetViewImageCount++;
        this.populateStateCity(this.streetViewLocationLatLong);
      } else {
      }
    }

  }

  openStreetViewImages(index: number): void {
    // open lightbox
    this.galleryImages = this.streetViewGalleryImages;
    this.galleryModal.show();
    this.openGalleryPreview(index);
    // this.imageType = 'streetView';
    // this.lightBoxImageIndex = index;
    // const streetViewImagesArr = this.manageLocationForm.value.streetViewImages;
    // const streetViewImagesUrlArr = [];
    // for (let i = 0; i < streetViewImagesArr.length; i++) {
    //   const object = {
    //     src: streetViewImagesArr[i].originalImageUrl
    //   };
    //   streetViewImagesUrlArr.push(object);
    // }
    // this._lightbox.open(streetViewImagesUrlArr, index, { wrapAround: true, showImageNumberLabel: true, fitImageInViewPort: true });
  }


  openGalleryPreview(index) {
    setTimeout(() => {
      this.gallery.openPreview(index);
    }, 500);
  }


  openComputerUploadImages(index: number): void {
    // open lightbox

    this.galleryImages = this.computerGalleryImages;
    this.galleryModal.show();
    this.openGalleryPreview(index);


    // this.imageType = 'computer';
    // this.lightBoxImageIndex = index;
    // const computerUploadImagesArr = this.manageLocationForm.value.locationUpload;
    // const computerUploadImagesUrlArr = [];
    // for (let i = 0; i < computerUploadImagesArr.length; i++) {
    //   const object = {
    //     src: computerUploadImagesArr[i].originalImageUrl
    //   };
    //   computerUploadImagesUrlArr.push(object);
    // }
    // this._lightbox.open(computerUploadImagesUrlArr, index, { wrapAround: true, showImageNumberLabel: true, fitImageInViewPort: true });

  }

  downloadImage = function (realPath) {
    window.open(realPath, '_blank');
  };

  // map


  // component translate function
  translateFunc() {
    this.translateService.get('common.labels').subscribe((res: string) => {
      this.warningMsg = res['locationwarningMsg'];
      this.confirmationessMsg = res['confirmationMsg'];
      this.cancelMsg = res['cancelSave'];
      this.saveMsg = res['approveSave'];
      this.errMsg = res['error'];
    });
    this.translateService.get('common').subscribe((res: string) => {
      this.commonJsonTextMessages = res;
    });
    this.translateService.get('common.successMessages').subscribe((res: string) => {
      this.categoryAdded = res['categoryAdded'];
    });
  }
  contactInformationChecked() {
    if (this.manageLocationForm.value.disableContactInformation) {
      const contactPersons = <FormArray>this.manageLocationForm.controls['contactPersons'];
      if (contactPersons.length > 1 && contactPersons.invalid) {
        for (let i = 0; i < contactPersons.controls.length; i++) {
          const frmGroup = <FormGroup>contactPersons.controls[i];
          if (frmGroup.invalid) {
            contactPersons.removeAt(i);
          }
        }

      }
      this.manageLocationForm.controls['contactPersons'].disable();

      // for (let i = 0; i < contactPersons.controls.length; i++) {
      // this.manageLocationForm.controls['contactPersons'].disable();
      // }
    } else {
      this.manageLocationForm.controls['contactPersons'].markAsUntouched();
      this.manageLocationForm.controls['contactPersons'].enable();
    }
    this.manageLocationForm.controls['contactPersons'].updateValueAndValidity();
  }
  // It structures al the form data and sends it to the server and adds or updates location data
  addLocation() {
    if (this.manageLocationForm.value.locationUpload.length === 0 && this.manageLocationForm.value.streetViewImages.length === 0) {
      this.manageLocationForm.controls['imagesAttached'].setValue('');
    }
    else {
      this.manageLocationForm.controls['imagesAttached'].setValue(true);
    }
    this.spinnerFlag = true;
    this.submitManageLocationForm = true;
    const contactPersons = <FormArray>this.manageLocationForm.controls['contactPersons'];
    for (let i = 0; i < contactPersons.controls.length; i++) {
      const frmGroup = <FormGroup>contactPersons.controls[i];
      if (frmGroup.value.phoneNumberWork || frmGroup.value.phoneNumber) {
        frmGroup.controls['phoneNumber'].setValidators(null);
        frmGroup.controls['phoneNumber'].updateValueAndValidity();
        frmGroup.controls['phoneNumberWork'].setValidators(null);
        frmGroup.controls['phoneNumberWork'].updateValueAndValidity();
      } else {
        frmGroup.controls['phoneNumber'].setValidators([CustomValidators.required]);
        frmGroup.controls['phoneNumber'].updateValueAndValidity();
        frmGroup.controls['phoneNumberWork'].setValidators([CustomValidators.required]);
        frmGroup.controls['phoneNumberWork'].updateValueAndValidity();
      }
    }
    if (this.manageLocationForm.valid) {
      this.manageLocationForm.controls['contactPersons'].enable();
      this.isClicked = true;
      const formValue = this.manageLocationForm.value;
      const langCode = this.sessionService.getCookie(COOKIES_CONSTANTS.langCode);
      formValue.langCode = langCode;
      formValue.locationAttachments = this.documents.locationAttachmentsDocs;
      formValue.bankattachments = this.documents.bankattachmentsDocs;
      this.documents.locationdocId = this.locationDocId;
      this.documents.bankdocId = this.bankDocId;
      const finalLocationData = ManageLocationData.setManageLocationDetails(formValue, this.documents, this.categoryId);
      if (this.manageLocationForm.controls['accountNumber'].value === '' || this.manageLocationForm.controls['bankName'].value === ''
        || this.manageLocationForm.controls['branchName'].value === '' || this.manageLocationForm.controls['clabe'].value === '' ||
        this.manageLocationForm.controls['bankAddress'].value === '' || this.manageLocationForm.controls['extraHours'].value === '' ||
        this.manageLocationForm.controls['locationSettingCost'].value === '') {


        const swalObj = Common.swalConfirmPopupObj(this.warningMsg,
          true, true, this.commonJsonTextMessages.labels.yes, this.commonJsonTextMessages.labels.cancelDelete, '', this.confirmationessMsg);
        swal(swalObj, (isConfirm) => {
          if (isConfirm) {
            if (this.locationId) {
              // put service
              this._ManageLocationService.updateLocationsData(this.locationId, finalLocationData).subscribe((responseData: any) => {
                if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
                  this.spinnerFlag = false;
                  this.toastrService.success(responseData.header.message);
                  this.navigationService.navigate([ROUTER_LINKS_FULL_PATH.locationsView]);

                }
                else {
                  this.toastrService.error(responseData.header.message);
                  this.spinnerFlag = false;
                }
              }, error => {
                this.toastrService.error(this.commonJsonTextMessages.errorMessages.error);
                this.spinnerFlag = false;
              });
            } else {
              // post service

              this._ManageLocationService.addLocationData(finalLocationData).subscribe((responseData: any) => {
                if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
                  this.spinnerFlag = false;
                  this.toastrService.success(responseData.header.message);
                  this.navigationService.navigate([ROUTER_LINKS_FULL_PATH.locationsView]);
                } else {
                  this.toastrService.error(responseData.header.message);
                  this.spinnerFlag = false;
                }
              }, error => {
                this.toastrService.error(this.commonJsonTextMessages.errorMessages.error);
                this.spinnerFlag = false;
              });
            }

          } else {
            this.manageLocationForm.controls['contactPersons'].disable();
            this.spinnerFlag = false;
            this.isClicked = false;
          }
        });
      } else {
        if (this.locationId) {
          // put
          this._ManageLocationService.updateLocationsData(this.locationId, finalLocationData).subscribe((responseData: any) => {
            this.isClicked = false;
            this.spinnerFlag = false;
            if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
              this.toastrService.success(responseData.header.message);
              this.navigationService.navigate([ROUTER_LINKS_FULL_PATH.locationsView]);
            }
            else {
              this.toastrService.error(responseData.header.message);
            }
          }, error => {
            this.isClicked = false;
            this.toastrService.error(this.commonJsonTextMessages.errorMessages.error);
            this.spinnerFlag = false;
          });
        } else {
          // post service
          this._ManageLocationService.addLocationData(finalLocationData).subscribe((responseData: any) => {
            this.isClicked = false;
            this.spinnerFlag = false;
            if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
              this.toastrService.success(responseData.header.message);
              this.navigationService.navigate([ROUTER_LINKS_FULL_PATH.locationsView]);
            } else {
              this.toastrService.error(responseData.header.message);
            }
          }, error => {
            this.isClicked = false;
            this.toastrService.error(this.commonJsonTextMessages.errorMessages.error);
            this.spinnerFlag = false;
          });
        }

      }
    } else {
      let target;
      for (const i in this.manageLocationForm.controls) {
        if (!this.manageLocationForm.controls[i].valid) {
          target = this.manageLocationForm.controls[i];
          break;
        }
      }
      if (target) {
        this.spinnerFlag = false;
        let el;
        if (!$('.ng-invalid:not(form):first').hasClass('cat-input-field')) {

          if ($('.ng-invalid:not(form):first').hasClass('attachement-div')) {
            el = $('.document-attachment');
          } else {
            el = $('.ng-invalid:not(form):first');
          }
        } else {

          if (this.manageLocationForm.controls['imagesAttached'].errors.checkRequired) {
            el = $('.document-attachment');
          }
        }

        if (el) {
          $('html,body').animate({ scrollTop: (el.offset().top - 100) }, 'slow', () => {
            el.focus();
          });
        }
      }
    }
  }

  // It removes Images from formArray wrt its index
  removeLocationImageEvent(eventIndex) {
    // this.manageLocationForm.controls['selectAll'].setValue(false);
    const swalObj = Common.swalConfirmPopupObj(this.commonJsonTextMessages.labels.deleteAdvanceMsg, true, true);
    swal(swalObj, (isConfirm) => {
      if (isConfirm) {
        this.setComputerSelectAllFlag = false;
        const locationImage = <FormArray>this.manageLocationForm.controls['locationUpload'];
        for (let i = 0; i < locationImage.length; i++) {
          const locationImageFrmGrp = <FormGroup>locationImage.controls[i];
          locationImageFrmGrp.patchValue({
            selection: false
          });
        }
        this.totalPreviousImagesCount--;
        locationImage.removeAt(eventIndex);
        this.computerGalleryImages.splice(eventIndex, 1);
        this.removeComputerSelectedArr = [];
        this.locationImagesIndex--;
        if (this.manageLocationForm.value.locationUpload.length === 0) {
          this.computerUploadArrayHeader = false;
          this.manageLocationForm.patchValue({
            imagesAttached: ''
          });
        }
      }
    });

  }
  removeStreetViewImageEvent(eventIndex) {
    // this.manageLocationForm.controls['selectAll'].setValue(false);
    const swalObj = Common.swalConfirmPopupObj(this.commonJsonTextMessages.labels.deleteAdvanceMsg, true, true);
    swal(swalObj, (isConfirm) => {
      if (isConfirm) {
        this.setStreetImageSelectAllFlag = false;
        const streetViewImage = <FormArray>this.manageLocationForm.controls['streetViewImages'];
        for (let i = 0; i < streetViewImage.length; i++) {
          const streetViewImageFrmGrp = <FormGroup>streetViewImage.controls[i];
          streetViewImageFrmGrp.patchValue({
            selection: false
          });
        }
        streetViewImage.removeAt(eventIndex);
        this.streetViewGalleryImages.splice(eventIndex, 1);
        this.removeSelectedArr = [];
        this.streetViewIndex--;
        if (this.manageLocationForm.value.streetViewImages.length !== 0) {
          for (let i = 1; i <= this.manageLocationForm.value.streetViewImages.length; i++) {
            this.manageLocationForm.value.streetViewImages[i - 1].fileName = 'location_' + i;
          }
        }
        if (this.manageLocationForm.value.streetViewImages.length === 0) {
          this.streetViewArrayHeader = false;
        }
      }
    });
  }
  removeBankFiles(index, item) {
    const swalObj = Common.swalConfirmPopupObj(this.commonJsonTextMessages.labels.deleteAdvanceMsg, true, true);
    swal(swalObj, (isConfirm) => {
      if (isConfirm) {
        item.remove();
        this.documents.bankattachmentsDocs.splice(index, 1);
      }
    });
  }

  // It removes and adds the selected file
  removeFiles(index, item) {
    const swalObj = Common.swalConfirmPopupObj(this.commonJsonTextMessages.labels.deleteAdvanceMsg, true, true);
    swal(swalObj, (isConfirm) => {
      if (isConfirm) {
        item.remove();
        this.documents.locationAttachmentsDocs.splice(index, 1);
      }
    });

  }

  removeSelectedImages(selectedIndex, ev) {
    if (ev.target.checked) {
      this.removeSelectedArr.push(selectedIndex);
      this.isSetStreetSelectNone = false;
    } else {

      for (let index = 0; index < this.removeSelectedArr.length; index++) {
        if (this.removeSelectedArr[index] == selectedIndex) {
          this.removeSelectedArr.splice(index, 1);
        }
      }
    }
    const streetViewImage = <FormArray>this.manageLocationForm.controls['streetViewImages'];
    for (let i = 0; i < streetViewImage.length; i++) {
      const streetViewImageFrmGrp = <FormGroup>streetViewImage.controls[i];
      if (streetViewImageFrmGrp.controls['selection'].value) {
        this.setStreetImageSelectAllFlag = true;
        this.isSetStreetSelectNone = false;
      } else {
        this.setStreetImageSelectAllFlag = false;

        break;
      }
    }
    if (this.removeSelectedArr.length == 0) {
      this.isSetStreetSelectNone = true;
    }
    // if (this.setStreetImageSelectAllFlag) {
    // this.manageLocationForm.controls['selectAllStreetImages'].setValue(true);
    // } else {
    //   this.manageLocationForm.controls['selectAllStreetImages'].setValue(false);
    // }
  }

  removeFromArray() {
    if (this.removeSelectedArr.length > 0) {
      const swalObj = Common.swalConfirmPopupObj(this.commonJsonTextMessages.labels.deleteAdvanceMsg, true, true);
      swal(swalObj, (isConfirm) => {
        if (isConfirm) {
          const streetViewImage = <FormArray>this.manageLocationForm.controls['streetViewImages'];
          _.pullAt(this.streetViewGalleryImages, this.removeSelectedArr);
          _.pullAt(streetViewImage.controls, this.removeSelectedArr);
          this.totalPreviousImagesCount = this.streetViewGalleryImages.length;
          this.manageLocationForm.controls['streetViewImages'].updateValueAndValidity();
          if (this.manageLocationForm.value.streetViewImages.length !== 0) {
            for (let i = 1; i <= this.manageLocationForm.value.streetViewImages.length; i++) {
              this.manageLocationForm.value.streetViewImages[i - 1].fileName = 'location_' + i;
            }
          }
          if (this.manageLocationForm.value.streetViewImages.length === 0) {
            this.streetViewArrayHeader = false;
          }
        }
      });
    }
  }

  removeComputerSelectedImages(selectedIndex, ev) {
    if (ev.target.checked) {
      this.removeComputerSelectedArr.push(selectedIndex);
      this.isSetComputerSelectNone = false;
    } else {

      for (let index = 0; index < this.removeComputerSelectedArr.length; index++) {

        if (this.removeComputerSelectedArr[index] == selectedIndex) {

          this.removeComputerSelectedArr.splice(index, 1);
        }
      }
    }
    const locationImage = <FormArray>this.manageLocationForm.controls['locationUpload'];
    for (let i = 0; i < locationImage.length; i++) {
      const locationImageFrmGrp = <FormGroup>locationImage.controls[i];
      if (locationImageFrmGrp.controls['selection'].value) {
        this.setComputerSelectAllFlag = true;
        this.isSetComputerSelectNone = false;

      } else {
        this.setComputerSelectAllFlag = false;

        break;
      }
    }

    if (this.removeComputerSelectedArr.length == 0) {
      this.isSetComputerSelectNone = true;
    }
    // if (this.setComputerSelectAllFlag) {
    // this.manageLocationForm.controls['selectAll'].setValue(true);
    // } else {
    //   this.manageLocationForm.controls['selectAll'].setValue(false);
    // }
  }

  removeFromComputerArray() {
    if (this.removeComputerSelectedArr.length > 0) {
      const swalObj = Common.swalConfirmPopupObj(this.commonJsonTextMessages.labels.deleteAdvanceMsg, true, true);
      swal(swalObj, (isConfirm) => {
        if (isConfirm) {
          const locationImage = <FormArray>this.manageLocationForm.controls['locationUpload'];
          _.pullAt(this.computerGalleryImages, this.removeComputerSelectedArr);
          _.pullAt(locationImage.controls, this.removeComputerSelectedArr);
          this.totalPreviousImagesCount = this.computerGalleryImages.length;
          this.manageLocationForm.controls['locationUpload'].updateValueAndValidity();
          if (this.manageLocationForm.value.locationUpload.length === 0) {
            this.computerUploadArrayHeader = false;
            this.manageLocationForm.patchValue({
              imagesAttached: ''
            });
          }
        }
      });
    }
  }

  selectAllComputerImages(flag) {
    const locationImage = <FormArray>this.manageLocationForm.controls['locationUpload'];
    if (flag) {
      // this.manageLocationForm.controls['selectAll'].setValue(true);

      this.setComputerSelectAllFlag = true;
      this.isSetComputerSelectNone = false;
      this.removeComputerSelectedArr = [];
      for (let index = 0; index < this.computerGalleryImages.length; index++) {
        this.removeComputerSelectedArr.push(index);
      }
      for (let i = 0; i < locationImage.length; i++) {
        const locationImageFrmGrp = <FormGroup>locationImage.controls[i];
        locationImageFrmGrp.patchValue({
          selection: true
        });
      }
    } else {
      // this.manageLocationForm.controls['selectAll'].setValue(false);
      this.setComputerSelectAllFlag = false;
      this.isSetComputerSelectNone = true;

      this.removeComputerSelectedArr = [];
      for (let i = 0; i < locationImage.length; i++) {
        const locationImageFrmGrp = <FormGroup>locationImage.controls[i];
        locationImageFrmGrp.patchValue({
          selection: false
        });
      }
    }
  }

  selectAllStreetImages(flag) {
    const streetViewImage = <FormArray>this.manageLocationForm.controls['streetViewImages'];
    if (flag) {
      // this.manageLocationForm.controls['selectAllStreetImages'].setValue(true);
      this.setStreetImageSelectAllFlag = true;
      this.isSetStreetSelectNone = false;
      this.removeSelectedArr = [];
      for (let index = 0; index < this.streetViewGalleryImages.length; index++) {
        this.removeSelectedArr.push(index);
      }
      for (let i = 0; i < streetViewImage.length; i++) {
        const streetViewImageFrmGrp = <FormGroup>streetViewImage.controls[i];
        streetViewImageFrmGrp.patchValue({
          selection: true
        });
      }
    } else {
      // this.manageLocationForm.controls['selectAllStreetImages'].setValue(false);

      this.setStreetImageSelectAllFlag = false;
      this.isSetStreetSelectNone = true;
      this.removeSelectedArr = [];
      // for (let index = 0; index < this.streetViewGalleryImages.length; index++) {
      //   this.removeSelectedArr.push(index);
      // }
      for (let i = 0; i < streetViewImage.length; i++) {
        const streetViewImageFrmGrp = <FormGroup>streetViewImage.controls[i];
        streetViewImageFrmGrp.patchValue({
          selection: false
        });
      }
    }
  }
  // It uploads image to Db and stores its info in the required array
  addLocationImagesEvent(event) {
    this.imagesCounter[this.imagesCounter.length] = 0;
    this.locationImagesResponceArray.push([]);
    const fileArray = Array.from(event.target.files);
    const tempImageDataArray = Object.assign([], fileArray);
    this.imagesData.push(tempImageDataArray);
    this.imageStatusArr$.push([]);
    this.imagesReceived[this.imagesReceived.length] = tempImageDataArray.length; // look it afterward.
    event.target.value = '';
    const imagesDataLastIndex = this.imagesData.length - 1;
    for (let i = 0; i < this.imagesData[imagesDataLastIndex].length; i++) {
      if (this.imagesData[imagesDataLastIndex][i]) {
        const file: File = this.imagesData[imagesDataLastIndex][i];
        const type = this.getFileType(file);
        if (this.checkLocationImagesFileType(type)) {
          if (this.isImagesFileSizeValid(file)) {
            this.checkDimensionAndUploadLocationImage(file, imagesDataLastIndex, i);
          } else {
            this.errorImageStatusArr.push({
              'name': file.name,
              'errorType': IMAGE_ERROR_TYPES.exceedSize
            });
            this.imagesCounter[imagesDataLastIndex]++;
            this.showImageStatusBlock = true;
          }
        } else {
          this.toastrService.error(this.commonJsonTextMessages.errorMessages.invalidFileType);
          this.imagesCounter[imagesDataLastIndex]++;
        }
      }
    }
  }

  checkImageDimension(file) {
    var promise = new Promise((resolve, reject) => {
      var image = new Image();
      var url = window.URL.createObjectURL(file);
      var img = new Image;
      img.onload = function () {
        if (img.width + img.height === 0) {
          reject();
        }
        // Check the image resolution
        if (img.width <= IMAGE_DIMENSION.width && img.height <= IMAGE_DIMENSION.height) {
          resolve();
        } else {
          reject();
        }
      };
      img.src = url;
      img.onerror = function () {
        reject();
      }
    });
    return promise;
  }
  checkDimensionAndUploadLocationImage(file, imagesDataLastIndex, innerIndex) {
    this.checkImageDimension(file).then(
      res => { // Success
        this.showImageStatusBlock = true;
        this.imageStatusArr$[imagesDataLastIndex][innerIndex] = {
          'name': file.name,
          'percentage': 0
        };
        this.showLoader = true;
        this.fileName = '';
        this.showLoader = true;
        this.enableSaveButtonFlag = false;
        const formData = Common.setFormData(file);
        this._ManageLocationService.uploadLocationImages(formData).subscribe((httpEvent: any) => {
          if (httpEvent.type === HttpEventType.UploadProgress) {
            // This is an upload progress event. Compute and show the % done:
            let percent = Math.round(100 * httpEvent.loaded / httpEvent.total);

            if (percent == 100) {
              percent = 99;
            }

            this.imageStatusArr$[imagesDataLastIndex][innerIndex]['percentage'] = percent;
          } else if (httpEvent instanceof HttpResponse) {
            const imageResponse: any = httpEvent.body;
            if (Common.checkStatusCode(imageResponse.header.statusCode)) {
              this.locationImagesResponceArray[imagesDataLastIndex][innerIndex] = imageResponse.payload.result;
              this.locationImagesIndex++;
              this.imagesCounter[imagesDataLastIndex]++;
            } else {
              // If service fails decrease count of images from images received array
              this.imagesReceived[this.imagesReceived.length - 1]--;
              this.errorImageStatusArr.push({
                'name': file.name,
                'errorType': IMAGE_ERROR_TYPES.serverError
              });
              this.showImageStatusBlock = true;
            }
            this.imageStatusArr$[imagesDataLastIndex][innerIndex]['percentage'] = '';
            if (this.imagesCounter[imagesDataLastIndex] === this.imagesReceived[imagesDataLastIndex]) {
              this.locationImagesResponceArray[imagesDataLastIndex] = _.filter(this.locationImagesResponceArray[imagesDataLastIndex], 'id');
              this.attachLocationImagesToFormArray(imagesDataLastIndex);
            }
            let totalImageCount = 0;
            for (let outerIndex = 0; outerIndex < this.imagesCounter.length; outerIndex++) {
              totalImageCount = totalImageCount + this.imagesCounter[outerIndex];
            }
            let totalImageReceived = 0;
            for (let outerIndex = 0; outerIndex < this.imagesReceived.length; outerIndex++) {
              totalImageReceived = totalImageReceived + this.imagesReceived[outerIndex];
            }
            if (totalImageCount === totalImageReceived) {
              this.enableSaveButtonFlag = true;
              this.showLoader = false;
              const locationUpload = <FormArray>this.manageLocationForm.controls['locationUpload'];
              while (locationUpload.length !== this.totalPreviousImagesCount) {
                locationUpload.removeAt(0);
                this.computerGalleryImages.splice(0, 1);
              }
              this.totalPreviousImagesCount = this.totalPreviousImagesCount + totalImageReceived;
              this.sortAndAttachLocationImagesToFormArray();
            }
          }
        },
          (err) => {
            this.imagesReceived[this.imagesReceived.length - 1]--;
            this.imageStatusArr$[imagesDataLastIndex][innerIndex]['percentage'] = '';
            let inProgressImageFlag = false;
            for (let index = 0; index < this.imageStatusArr$.length; index++) {
              let inProgressImages = _.filter(this.imageStatusArr$[index], function (o) { return o.percentage != ''; });
              if (inProgressImages.length > 0) {
                inProgressImageFlag = true;
                break;
              }
            }

            this.showImageStatusBlock = (inProgressImageFlag || this.errorImageStatusArr.length > 0) ? true : false;
            let totalImageCount = 0;
            for (let outerIndex = 0; outerIndex < this.imagesCounter.length; outerIndex++) {
              totalImageCount = totalImageCount + this.imagesCounter[outerIndex];
            }
            let totalImageReceived = 0;
            for (let outerIndex = 0; outerIndex < this.imagesReceived.length; outerIndex++) {
              totalImageReceived = totalImageReceived + this.imagesReceived[outerIndex];
            }
            if (totalImageCount === totalImageReceived) {
              this.enableSaveButtonFlag = true;
              this.showLoader = false;
            }
            this.errorImageStatusArr.push({
              'name': file.name,
              'errorType': IMAGE_ERROR_TYPES.serverError
            });
            this.imagesCounter[imagesDataLastIndex]++;
            this.showImageStatusBlock = true;

            // this.toastrService.error(this.commonJsonTextMessages.errorMessages.error + " - " + file.name);
          });
      },
      msg => {
        this.errorImageStatusArr.push({
          'name': file.name,
          'errorType': IMAGE_ERROR_TYPES.invalidResolution
        });
        this.imagesCounter[imagesDataLastIndex]++;
        this.showImageStatusBlock = true;
      }
    );
  }

  /**
   * It attaches uploaded images to images formArray.
   */
  attachLocationImagesToFormArray(imagesDataLastIndex) {
    for (let imageIndex = this.locationImagesResponceArray[imagesDataLastIndex].length - 1; imageIndex >= 0; imageIndex--) {
      const data = this.locationImagesResponceArray[imagesDataLastIndex][imageIndex];
      this.totalComputerImagesCount1 = this.computerUploadArray.length + 1;
      this.computerUploadArrayHeader = true;
      const locationUpload = <FormArray>this.manageLocationForm.controls['locationUpload'];
      this.setLocationUploadDefaultArr(true);
      locationUpload.controls[0].patchValue({
        id: '',
        originalImageId: data.id,
        thumbnailImageId: data.thumbnailId,
        originalImageUrl: data.url,
        fileName: data.name,
        thumbnailImageUrl: data.thumbnailUrl,
        tags: [],
        imageOrientation: data.imageOrientation
      });

      let tempObj = {
        small: data.thumbnailUrl ? data.thumbnailUrl : '',
        medium: data.thumbnailUrl ? data.thumbnailUrl : '',
        big: data.url ? data.url : '',
        imageOrientation: data.imageOrientation ? data.imageOrientation : 1,
      };

      this.computerGalleryImages = [tempObj, ...this.computerGalleryImages];

      this.manageLocationForm.patchValue({
        imagesAttached: true
      });
    }
  }

  /**
   * It attaches uploaded images to images formArray.
   */
  sortAndAttachLocationImagesToFormArray() {

    // this.computerGalleryImages = [];
    //this.computerGalleryImages = Object.assign(this.oldComputerGalleryImages);

    for (let outerArrayIndex = 0; outerArrayIndex < this.locationImagesResponceArray.length; outerArrayIndex++) {
      const innerImagesArray = this.locationImagesResponceArray[outerArrayIndex];
      for (let innerArrayIndex = innerImagesArray.length - 1; innerArrayIndex >= 0; innerArrayIndex--) {
        const data = innerImagesArray[innerArrayIndex];

        if (data) {
          this.totalComputerImagesCount1 = this.computerUploadArray.length + 1;
        this.computerUploadArrayHeader = true;
        const locationUpload = <FormArray>this.manageLocationForm.controls['locationUpload'];
        this.setLocationUploadDefaultArr(true);
        locationUpload.controls[0].patchValue({
          id: '',
          originalImageId: data.id,
          thumbnailImageId: data.thumbnailId,
          originalImageUrl: data.url,
          fileName: data.name,
          thumbnailImageUrl: data.thumbnailUrl,
          tags: [],
          imageOrientation: data.imageOrientation
        });
        let tempObj = {
          small: data.thumbnailUrl ? data.thumbnailUrl : '',
          medium: data.thumbnailUrl ? data.thumbnailUrl : '',
          big: data.url ? data.url : '',
          imageOrientation: data.imageOrientation ? data.imageOrientation : 1,
        };
        this.computerGalleryImages = [tempObj, ...this.computerGalleryImages];
        this.manageLocationForm.patchValue({
          imagesAttached: true
        });
        }

      }
    }
    this.clearLocationImagesArray();
  }

  clearLocationImagesArray() {
    this.locationImagesResponceArray = [];
    this.imagesData = [];
    this.imagesCounter = [];
    this.imagesReceived = [];
    this.imageStatusArr$ = [];
    if (this.errorImageStatusArr.length == 0) {
      this.showImageStatusBlock = false;
    }
  }

  addFiles(event, FileType) {
    this.enableSaveButtonFlag = false;
    this.checkDocumentValidation(FileType);
  }

  // It checks if document is valid or not and uploads the file
  checkDocumentValidation(FileType) {
    this.filesCounter.location = 0;
    this.filesCounter.bank = 0;
    this.filesCounter[FileType] = 0;
    this.filesReceived = this.attachements[FileType].queue.length;
    let totalAttachFileSize = 0;
    // tslint:disable-next-line:forin
    for (const i in this.attachements[FileType].queue) {
      totalAttachFileSize = totalAttachFileSize + this.attachements[FileType].queue[i].file.size;
    }
    if (totalAttachFileSize > 50 * 1024 * 1024) {
      this.toastrService.error(this.commonJsonTextMessages.errorMessages.documentLessThan50);
      for (let i = 0; i < this.attachements[FileType].queue.length; i++) {
        if (!this.attachements[FileType].queue[i].url) {
          this.attachements[FileType].queue[i].remove();
          i--;
        }
      }
      this.enableSaveButtonFlag = true;
    }
    else {
      for (let i = 0; i < this.attachements[FileType].queue.length; i++) {
        const filesize = this.attachements[FileType].queue[i].file.size;
        if (filesize > 10 * 1024 * 1024) {
          this.toastrService.error(this.commonJsonTextMessages.errorMessages.documentLessThan10);
          this.attachements[FileType].queue[i].remove();
          i--;
          this.filesCounter[FileType]++;
          if (this.filesCounter.bank === this.bankfilesReceived && this.filesCounter.location === this.filesReceived) {
            this.enableSaveButtonFlag = true;
          }
        }
        else {
          const file = this.attachements[FileType].queue[i]._file;
          const type = this.getFileType(file);
          if (!this.attachements[FileType].queue[i].url) {
            if (!this.attachements[FileType].queue[i].url && !this.attachements[FileType].queue[i]['inProgress']) {
              if (!this.checkFileType(type)) {
                this.toastrService.error(this.commonJsonTextMessages.errorMessages.invalidFileType);
                this.attachements[FileType].queue[i].remove();
                i--;
                this.filesCounter[FileType]++;
                if (this.filesCounter.bank === this.bankfilesReceived && this.filesCounter.location === this.filesReceived) {
                  this.enableSaveButtonFlag = true;
                }
              }
              else {
                const formData = this.setFormData(file);
                this.attachements[FileType].queue[i]['inProgress'] = true;
                this.uploadFile(formData, true, this.attachements[FileType].queue[i], i, FileType);
              }
            }
          } else {
            this.filesCounter[FileType]++;
            if (this.filesCounter.bank === this.bankfilesReceived && this.filesCounter.location === this.filesReceived) {
              this.enableSaveButtonFlag = true;
            }
          }
        }
      }
    }
  }

  // It uploads the file
  uploadFile(formData, isDocument, obj: any = {}, index: any = 0, FileType) {
    this._sharedService.uploadFile(formData).subscribe((imageResponse: any) => {
      if (Common.checkStatusCode(imageResponse.header.statusCode)) {
        const data = imageResponse.payload.result;
        if (isDocument) {
          obj.url = data.url;
          if (FileType === this.fileTypes.location) {
            this.setDocumentId(data.id, '', '');
          } else {
            this.setBankDocumentId(data.id);
          }
          delete obj['inProgress'];
        }
      } else {
        if (imageResponse.header) {
          this.toastrService.error(imageResponse.header.message);
        } else {
          this.toastrService.error(this.commonJsonTextMessages.errorMessages.error);
        }
      }
      this.filesCounter[FileType]++;
      if (this.filesCounter[FileType] === this.filesReceived) {
        this.enableSaveButtonFlag = true;
      }
      delete this.attachements[FileType].queue[index]['inProgress'];
    },
      error => {
        this.toastrService.error(this.commonJsonTextMessages.errorMessages.error);
        this.filesCounter[FileType]++;
        if (this.filesCounter[FileType] === this.filesReceived) {
          this.enableSaveButtonFlag = true;
        }
      });
  }

  // It sets the document id in required document array
  setDocumentId(documentId, sectionId, otherdoc) {
    this.documents.locationAttachmentsDocs.push({ 'id': documentId, 'name': otherdoc, 'locationdocId': sectionId });
  }

  setBankDocumentId(documentId) {
    this.documents.bankattachmentsDocs.push(documentId);
  }

  // It gets the type of file
  getFileType(file) {
    const fileNameArr = file.name.split('.');
    const type = fileNameArr[fileNameArr.length - 1];
    return type;
  }

  // It checks the type of file
  checkLocationImagesFileType(filetype) {
    const validtype = _.find(LOCATION_IMAGES_FILE_TYPE, { 'type': filetype.toLowerCase() });
    if (validtype) {
      return true;
    } else {
      return false;
    }
  }
  // It checks the size of file
  isImagesFileSizeValid(file) {
    var size = parseInt(file.size) / 1024 / 1024;
    if (size <= IMAGE_SIZE.BYTES_50MB) {
      return true;
    } else {
      return false;
    }
  }
  // It checks the dimension of file
  isImageResolutionValid(file) {
    let img = new Image();
    let width;
    let height;
    img.src = window.URL.createObjectURL(file);
    img.onload = function () {
      width = img.naturalWidth || img.width;
      height = img.naturalHeight || img.height;
      if ((width <= IMAGE_DIMENSION.width) && (height <= IMAGE_DIMENSION.height)) {
        return true;
      } else {
        return false;
      }
    };
  }
  checkFileType(filetype) {
    const validtype = _.find(FILE_TYPES, { 'type': filetype.toLowerCase() });
    if (validtype) {
      return true;
    } else {
      return false;
    }
  }
  // It sets the received data into file format
  setFormData(file) {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return formData;
  }
  setOrientationToImage(data) {
    const imageData = data.image;
    const img = new Image();
    if (imageData.big) {
      img.src = imageData.big;
      img.onload = function () {
        $('.ngx-spinner-wrapper').hide();
      };
    }

    const self = this;
    $('.ngx-gallery-preview-img').addClass('hidden');
    $('.ngx-spinner-wrapper').show();
    setTimeout(() => {
      $('.ngx-gallery-preview-img').removeClass('orientation-' + self.currentImageOrientation);
      self.currentImageOrientation = imageData.imageOrientation;
      $('.ngx-gallery-preview-img').addClass('orientation-' + self.currentImageOrientation);
      setTimeout(() => {
        $('.ngx-gallery-preview-img').removeClass('hidden');
      }, 500);
    }, 500);

  }

  checkInvalidInput(formControlName) {
    let formvalue = this.manageLocationForm.value;
    if (isNaN(formvalue[formControlName]) || formvalue[formControlName] === '.') {
      this.manageLocationForm.controls[formControlName].setValue(0);
    }
  }

  previewClose() {
    this.galleryModal.hide();
  }
  navigateTo() {
    this.navigationService.navigate([ROUTER_LINKS_FULL_PATH.locationsView]);
  }
}
