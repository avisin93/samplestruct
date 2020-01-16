import { Component, OnInit, ViewEncapsulation, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import 'hammerjs';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { ModalDirective, BsModalRef, BsModalService } from 'ngx-bootstrap';
const swal = require('sweetalert');
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import * as _moment from 'moment-timezone';
import { LocationCategoryFilterComponent } from '../../common/location-category-filter/location-category-filter.component';
import { Common, NavigationService, TriggerService, EncriptionService, CustomValidators } from '@app/common';
import { LocationsListService } from './list-location.service';
import { CustomTableConfig, LOCATION_TYPES, ZIP_NAME_TYPES_ARR, EVENT_TYPES, ROUTER_LINKS_FULL_PATH, DATE_FORMATS, ACTION_TYPES, MODULE_ID, ROLE_PERMISSION_KEY, TAG_NAME_TEXTAREA, UI_ACCESS_PERMISSION_CONST } from '@app/config';
import { ListLocationDataModel } from './list-location.data.model';
import { SharedData } from '@app/shared/shared.data';
import { ListLocation } from './list-location';
import { ZipImagesSelectionViewComponent } from './zip-images-selection-view/zip-images-selection-view.component';
import { BehaviorSubject } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-list-location',
  templateUrl: './list-location.component.html',
  styleUrls: ['./list-location.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListLocationComponent implements OnInit, OnDestroy {
  ROUTER_LINKS_FULL_PATH = ROUTER_LINKS_FULL_PATH;
  projectsList: any = [];
  selectedProjectData: any;
  ZIP_NAME_TYPES_ARR = ZIP_NAME_TYPES_ARR;
  DATE_FORMATS = DATE_FORMATS;
  locationsFilterForm: FormGroup;
  zipDetailsForm: FormGroup;
  public searchTags = new BehaviorSubject<string>('');
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[] = [];
  isLoadingTagName: Boolean = false;
  locationsList: any = [];
  statesList: Array<Object>;
  states: any = [];
  state: any = [];
  citiesList: Array<Object>;
  cities: any = [];
  breadcrumbData: any = {};
  title = [];
  locationTypesKeyArr = {};
  city: any = [];
  tagsList: Array<Object>;
  totalItems: number;
  index: Number = 1;
  public maxSize: any = CustomTableConfig.maxSize;
  category: Array<Object>;
  imagesByIdList: Array<Object>;
  locationCategories: Array<Object>;
  selectedLocationIds: Array<Object>;
  locationids: Array<Object>;
  commonLabelObj: any;
  supplierTagsSubscription: Subscription;
  public page: any = 1;
  showLoadingFlg: Boolean = false;
  isImagePreviewOpen: Boolean = false;
  locationDeleteConfirmation: any;
  locationLabels: any;
  bsModalRef: BsModalRef;
  subscription: Subscription;
  submmitedFormFlag: Boolean = false;
  selectedTags: any = [];
  EVENT_TYPES = EVENT_TYPES;
  dataLists = [
  ];
  ZIP_NAME_TYPE: any = Common.keyValueDropdownArr(ZIP_NAME_TYPES_ARR, 'text', 'id');
  ACTION_TYPES = ACTION_TYPES;
  keyList = [];
  //  Category listing
  categorylist = [];
  removeAllChildFlag: Boolean = true;
  unauthorizedAccessFlag: Boolean = true;
  createZipFlag: Boolean = false;
  LOCATION_LIST_QUERY_PARAMS = {
    'pageSize': 'pageSize',
    'pageNo': 'pageNo',
    'projectBudgetId': 'projectBudgetId',
    'invoiceId': 'invoiceId',
    'searchQuery': 'searchQuery',
    'locationTags': 'locationTags',
    'locationCategories': 'locationCategories',
    'locationType': 'locationType',
    'locationName': 'locationName',
    'locationState': 'locationState',
    'locationCity': 'locationCity',
  };
  public config: Object = {
    paging: true,
    filtering: { filterString: '' },
    className: ['table-striped', 'table-bordered', 'mb-0', 'd-table-fixed']
  };
  locationGalleryImages: NgxGalleryImage[] = [];
  maxPageLinkSize: Number = CustomTableConfig.maxPageLinkSize;
  itemsPerPage: Number = CustomTableConfig.locationItemsPerPage;
  currentPage: any = CustomTableConfig.pageNumber;
  @ViewChild('classicModal') public classicModal: ModalDirective;
  @ViewChild('zipModal') public zipModal: ModalDirective;
  @ViewChild('viewSelectionModal') public viewSelectionModal: ModalDirective;

  listbreadcrumbData: Object = {
    title: 'location.labels.locationList',
    subTitle: 'location.labels.locationListSubtitle',
    data: [{
      text: 'common.labels.home',
      link: '/'
    },
    {
      text: 'location.labels.locationList',
      link: ''
    }
    ]
  };

  zipBreadcrumbData: Object = {
    title: 'location.labels.createZip',
    subTitle: 'location.labels.seletUrImageForZip',
    data: [{
      text: 'common.labels.home',
      link: '/'
    },
    {
      text: 'location.labels.locationList',
      link: ROUTER_LINKS_FULL_PATH.locationsView,
      isCurrentUrl: true
    },
    {
      text: 'location.labels.createZip',
      link: ''
    }
    ]
  };
  tempProjectsList: any = [];
  LOCATION_TYPES: { id: number; text: string; }[];
  imageinfo: any;
  MODULE_ID: any;
  uiAccessPermissionsObj: any;
  permissionObj: any;
  userInfo: any;
  rolePermissionArray: any;
  changeFolderIcon: Boolean = false;
  spinnerFlag: boolean = false;
  disableButtonFlag: boolean = false;
  @ViewChild(ZipImagesSelectionViewComponent) private zipImagesSelectionView: ZipImagesSelectionViewComponent;
  enableGallaryCloseButton: Boolean = true;
  imageSelectedForZip: boolean = false;
  currentImageOrientation: string = '';
  UI_ACCESS_PERMISSION_CONST=UI_ACCESS_PERMISSION_CONST;
  // use to initialze the members of class
  constructor(private locationsListService: LocationsListService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private sharedData: SharedData,
    private navigationService: NavigationService,
    private translateService: TranslateService,
    private triggerService: TriggerService,
    private _encriptionService: EncriptionService,
    private toastrService: ToastrService,
    private modalService: BsModalService,
    public listLocation: ListLocation) {
  }


  ngOnInit() {
    this.breadcrumbData = this.listbreadcrumbData;
    this.checkUnauthorizedAccess();
    this.zipDetailsForm = this.listLocation.createZipDetailForm();
    this.detectChangedInput();
  }

  detectChangedInput() {
    this.supplierTagsSubscription = this.searchTags
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe((str) => this.getLocationTags(str));
  }
  /**
   * Checks if user has access to this module or not.
   */
  checkUnauthorizedAccess() {
    this.userInfo = this.sharedData.getUsersInfo();
    if (this.userInfo.roleModulePermissions) {
      try {
        this.rolePermissionArray = this.decryptData(this.userInfo.roleModulePermissions);
        const rolePermissionLocationObject = _.find(this.rolePermissionArray, ['moduleId', (MODULE_ID.locations).toString()]);
        if (rolePermissionLocationObject && !rolePermissionLocationObject[ACTION_TYPES.VIEW]) {
          this.unauthorizedAccessFlag = true;
        } else {
          this.unauthorizedAccessFlag = false;
          this.intitializePageDetails();
        }
      } catch(e) {
        console.log(e);
        this.unauthorizedAccessFlag = false;
        this.intitializePageDetails();
      }
      
    } else {
      this.unauthorizedAccessFlag = false;
      this.intitializePageDetails();
    }
  }

  /**
   * Initialized page details on initialization of component
   */
  intitializePageDetails() {
    this.clearCategoryFilterLists();
    this.createForm();
    this.galleryOptions = [
      {
        imageAnimation: NgxGalleryAnimation.Slide,
        fullWidth: false,
        previewKeyboardNavigation: true,
        previewCloseOnEsc: false,
        lazyLoading: true,
        previewCloseOnClick: false

      },
      { 'imageSize': 'contain', 'imageInfinityMove': true, 'thumbnailsMoveSize': 4, width: '100%', height: '600px', 'preview': true, previewDescription: false },
      { 'breakpoint': 500, 'width': '100%', 'height': '200px', 'thumbnailsColumns': 4 }
      // { 'previewKeyboardNavigation': true, 'previewCloseOnEsc': true}
    ];
    this.listLocation.setlocaleObj(this);
    this.subscribeEvents();
    this.getRequiredDetails();
  }

  /*
  * This method is used to decrypt Role Permission data.
  */
  decryptData(data: any) {
    const rolePermissionData = JSON.stringify(this._encriptionService.getDecryptedData(data, ROLE_PERMISSION_KEY));
    return JSON.parse(rolePermissionData);
  }
  /**
   * It calls all the required services related to location listing.
   */
  getRequiredDetails() {
    this.setPermissionsDetails();
    this.listLocation.setLocationsList(this);
    this.listLocation.setLocationCities(this);
    this.listLocation.setLocationStates(this);
    this.listLocation.setLocationCategories(this);
    this.listLocation.setLocationTags(this);
    this.listLocation.getDropdownValues(this);
    this.setProjectList();
    this.clearCategoryFilterLists();
  }
  getLocationTags(value: string = '') {
    
    this.listLocation.setLocationTags(this, value);
  }
  /**
   * Subscribes to events
   */
  subscribeEvents() {
    this.subscription = this.triggerService.getEvent().subscribe((data) => {
      if (data.event && data.event.type === EVENT_TYPES.closeModal) {
        this.categorylist = data.event.currentValue;
        this.dataLists = data.event.dataLists;
        this.keyList = data.event.keyList;
      }
    });
  }
  /**
   * Creates search fiter form
   */
  createForm() {
    this.locationsFilterForm = this.listLocation.createFilterForm();
  }

  // set module permission details
  setPermissionsDetails() {
    this.permissionObj = this.sharedData.getRolePermissionData();
    this.MODULE_ID = this.route.snapshot.parent.data['moduleID'];
    const modulePermissionObj = this.permissionObj[this.MODULE_ID];
    if (modulePermissionObj.uiAccess) {
      this.uiAccessPermissionsObj = modulePermissionObj.uiAccess;
    }
  }
  /**
   * It clears catgegory filter form and sets to default.
   */
  clearCategoryFilterLists() {
    this.dataLists = [];
    this.keyList = [];
    this.categorylist = [];
    this.selectedTags = [];
    this.listLocation.setLocationTags(this);
   
    this.getLocationTags();
  
  }
  /**
   * Unsubscribes the events
   */
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.supplierTagsSubscription) {
      this.supplierTagsSubscription.unsubscribe();
    }
    this.triggerService.setEvent({ type: EVENT_TYPES.closeModal, prevValue: {}, currentValue: [], dataLists: [], keyList: [] });
    this.resetZipData();
  }

  /**
   * It opens and closes add category pop-up
   */
  openAddCategoryModel() {
    const initialState = {
      dataLists: JSON.parse(JSON.stringify(this.dataLists)),
      keyList: Object.assign([], this.keyList),
      leafNodesArr: JSON.parse(JSON.stringify(this.categorylist)),
    };
    this.bsModalRef = this.modalService.show(LocationCategoryFilterComponent, { class: 'modal-custom-lg', initialState: initialState });
  }
  /**
   * It closes and closes add category pop-up
   */
  closeAddCategoryModel() {
    this.classicModal.hide();
  }
  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.closeViewSelectionModal();
      this.zipModal.hide();
      this.resetZipDetailsForm();
      $("ngx-gallery-preview").removeClass("ngx-gallery-active");
      this.previewClose();
    }
    if (event && event.target && event.target['tagName'] != TAG_NAME_TEXTAREA) {
      if (event.keyCode === 13) {
        event.preventDefault();
        if (this.zipModal.isShown) {
          this.proccedToCreatezip();
        } else if (!this.viewSelectionModal.isShown) {
          this.search();
        }
      }
    }
  }
  /**
   * It closes category folder.
   * @param category object of category
   * @param event event data
   */
  closeClassicModal() {
    this.classicModal.hide();
  }

  previewOpen() {
    this.enableGallaryCloseButton = false;
    this.isImagePreviewOpen = true;
    $("ngx-gallery-preview").addClass("ngx-gallery-active");
  }
  previewClose() {
    this.listLocation.previewClose(this);
    this.enableGallaryCloseButton = true;
    this.isImagePreviewOpen = false;
  }
  closeCategoryName(category) {
    this.listLocation.closeCategoryName(this, category);
  }
  /**
   * It removes category from the category object
   * @param categoryName name of category to be removed
   */
  removeCategoryFromDataLists(categoryName) {
    this.listLocation.removeCategoryFromDataLists(this, categoryName);
  }

  /**
   * Searches location list according to the search query params
   */
  search() {
    this.locationsList = [];
    this.setdefaultPage();
    this.listLocation.setLocationsList(this);
  }

  /**
   * Clears search filter
   */
  clear() {
    this.locationsFilterForm.reset();
    this.locationsFilterForm.patchValue({
      locationName: '',
      locationTags: '',
      state: '',
      city: '',
      category: '',
      locationType: ''
    });
    this.locationsList = [];
    this.clearCategoryFilterLists();
    this.locationsFilterForm.updateValueAndValidity();
    this.setdefaultPage();
    this.listLocation.setLocationsList(this);
    this.clearCategoryFilterLists();
    this.getLocationTags();
  }

  /**
   * pageChanged use to change page
   * @param event  as object
   */
  public pageChanged(event: any): void {
    this.locationsList = [];
    this.currentPage = event.page;
    this.listLocation.setLocationsList(this);
  }

  /**
   * Opens location image slider modal pop up
   */
  showGallery() {
    this.classicModal.show();
    this.listLocation.checkImageselectedForZipOrNot(this, this.imageinfo);
  }

  /**
   * use to getLocationImagesbyId
   * @param  id of which we want images

   */
  getLocationImagesbyId(location) {
    this.imageinfo = {};
    this.locationsListService.getLocationImagesbyId(location.locationId).subscribe((response: any) => {
      if (response.header && response.payload) {
        if (Common.checkStatusCode(response.header.statusCode)) {
          if (response.payload.result) {
            this.galleryImages = [];
            this.imagesByIdList = response.payload.result;
            this.galleryImages = ListLocationDataModel.setLocaionImages(this.imagesByIdList, location);
            this.imageinfo = this.galleryImages[0];
            this.showGallery();
          } else {
            this.imagesByIdList = [];
          }
        }
      }
    },
      (err) => {
        this.imagesByIdList = [];
        this.toastrService.error(this.commonLabelObj.errorMessages.error);
      });
  }


  tagsSelected(value) {
    this.listLocation.tagsSelected(this, value);
  }
  tagRemoved(value) {
    this.listLocation.tagRemoved(this, value);
  }

  /**
   * Changes image description on image change on slider
   * @param ev as image change event
   */
  imageChanged(ev) {
    this.imageSelectedForZip = false;
    this.imageinfo = ev.image;
    this.listLocation.checkImageselectedForZipOrNot(this, this.imageinfo);
  }

  /**
   * Sets default page
   */
  setdefaultPage() {
    this.currentPage = 1;
    this.page = 1;
    this.index = 1 + (20 * (this.currentPage - 1));
  }

  /**
   * Deletes location with the corresponding id passed to it
   * @param id as which location is to be deleted
   */

  deleteLocation(id) {
    const swalObj = Common.swalConfirmPopupObj(this.locationLabels.locationDeleteConfirmation,
      true, true, this.commonLabelObj.labels.yes, this.commonLabelObj.labels.cancelDelete);
    swal(swalObj, (isConfirm) => {
      if (isConfirm) {
        this.locationsListService.deleteLocation(id).subscribe((response: any) => {
          if (response.header) {
            this.listLocation.setLocationsList(this);
            if (!Common.checkStatusCode(response.header.statusCode)) {
              swal(this.commonLabelObj.labels.error, this.commonLabelObj.labels.error, 'error');
            } else {
              swal(this.locationLabels.deleted, this.locationLabels.locationDeleted, 'success');
            }
          }
        });
      } else {
        swal(this.commonLabelObj.labels.cancelled, this.locationLabels.locationSafe, 'error');
      }
    }, function (dismiss) {
    });
  }


  /**
   * Edits location
   * @param  id as which location is to be edited
   */
  editLocation(id) {
    this.navigationService.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.manageLocation, [id])]);
  }

  /**
   * Navigates to Add location screen
   */
  navigateTo() {
    this.navigationService.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.manageLocation, [''])]);
  }
  /**
  * It sets orientation to image opened in preview
  */
  setOrientationToImage(event) {
    this.listLocation.setOrientationToImage(this, event);
  }
  /**
  * Zip creation functionality
  */

  /**
  * It shows zip modal popup
  */
  showZipModal() {
    this.resetZipDetailsForm();
    this.zipModal.show();
  }
  /**
  * It sets/clears projectId field's (of zipDetailsForm) validity 
  */
  checkValidity() {
    this.listLocation.checkValidity(this);
  }
  /**
  * It hides zip modal popup
  */
  hideZipDetailsModal() {
    this.zipModal.hide();
    this.resetZipDetailsForm();
  }
  /**
  * It resets zip data like buttons,breadcrumbdata,zipDetails object
  */
  resetZipData() {
    this.createZipFlag = false;
    this.resetZipDetailsForm();
    this.breadcrumbData = this.listbreadcrumbData;
    if (this.zipImagesSelectionView) {
      this.zipImagesSelectionView.setDefaultViewSelectionData(false);
    }
    
    this.listLocation.clearData();
  }
  /**
  * It resets zip details form
  */
  resetZipDetailsForm() {
    this.submmitedFormFlag = false;
    this.zipDetailsForm.reset();
    this.zipDetailsForm.controls['zipNameType'].setValue(this.ZIP_NAME_TYPE.selectProject);
  }
  /**
  * It sets selcted project details
  */
  getProjectObjById(value) {
    this.listLocation.setProjectDetails(this, value);
  }
  /**
  * It sets zip details object required while creating zip
  */
  proccedToCreatezip() {
    this.listLocation.proccedToCreatezip(this);
  }
  /**
  * It convers zip locations obj into array and opens viewSelectionModal
  */
  openSeletionModal() {
    if (!this.disableButtonFlag) {
      this.listLocation.convertZipLocationsObjIntoArr();
      this.viewSelectionModal.show();
    }
  }
  /**
  * It adds/removes current image from/to collection of images in zipLocationsObj object of listLocation shared service
  * @param value as boolean for getting checkbox value
  */
  selectImageForZip(value) {
    this.listLocation.selectImageForZip(value, this.imageinfo);
  }

  /**
  * It resets data & hides viewSelectionModal
  */
  resetAndCloseViewSelectionModal() {
    if (this.zipImagesSelectionView) {
      this.zipImagesSelectionView.setDefaultViewSelectionData(true);
    }
    this.closeViewSelectionModal();
  }
  /**
  * It hides viewSelectionModal popup
  */
  closeViewSelectionModal() {
    if (this.viewSelectionModal) {
      this.viewSelectionModal.hide();
    }
  }
  /**
  * It sets Default data & clears selected images array
  */
  clearSelectedImages() {
    if (this.zipImagesSelectionView) {
      this.zipImagesSelectionView.setDefaultViewSelectionData(false);
    }
    this.listLocation.clearData();
  }

  /**
   * It sets project lists requied for creating zip
   */
  setProjectList() {
    this.projectsList = [];
    this.locationsListService.getProjectList().subscribe((response: any) => {
      if (response && response.header) {
        if (Common.checkStatusCode(response.header.statusCode)) {
          if (response.payload.result) {
            this.tempProjectsList = response.payload.result;
            this.projectsList = Common.getMultipleSelectArr(this.tempProjectsList, ['id'], ['projectName']);
          }
          else {
            this.projectsList = [];
          }
        } else {
          this.projectsList = [];
        }
      }
    }, error => {
      this.projectsList = [];
    }
    );
  }
  /**
  * method to download zip of selcted images
  */
  downloadZip() {
    this.spinnerFlag = true;
    this.disableButtonFlag = true;
    let zoneName = _moment.tz.guess(true);
    let params: HttpParams = new HttpParams();
    params = params.append('zone', zoneName);
    this.listLocation.convertZipLocationsObjIntoArr();
    let finalZipDetailsObj = ListLocationDataModel.getWebserviceDetailsForZip(this.listLocation.zipDetails);
    this.locationsListService.downloadZip(finalZipDetailsObj, params).subscribe((response: any) => {
      this.disableButtonFlag = false;
      this.spinnerFlag = false;
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        this.resetZipData();
        this.toastrService.success(response.header.message);
      }
      else {
        this.toastrService.error(response.header.message);
      }
    },
      error => {
        this.disableButtonFlag = false;
        this.spinnerFlag = false;
        this.toastrService.error(this.commonLabelObj.errorMessages.responseError);
      });
  }
  /**
  * Zip creation functionality
  */
}
