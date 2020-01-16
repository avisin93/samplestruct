import { Component, OnInit, ViewChild, ViewEncapsulation, HostListener } from '@angular/core';
import { NgxGalleryComponent, INgxGalleryOptions } from 'ngx-gallery';
import { ModalDirective, BsModalService, BsModalRef } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { CustomTableConfig, DEFAULT_GALLERY_OPTIONS, EVENT_TYPES, ROUTER_LINKS_FULL_PATH, ACTION_TYPES } from '@app/config';
import { HttpParams } from '@angular/common/http';
import { ListReviewService } from './list-review.service';
import { ToastrService } from 'ngx-toastr';
import { LocationCategoryFilterComponent } from '../../common/location-category-filter/location-category-filter.component';
import * as _ from 'lodash';
import { Subscription, BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { TriggerService } from '../../../../common/services/trigger.service';
import { NavigationService } from '../../../../common/services/navigation.service';
import { Common } from '../../../../common/common';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedData } from '@app/shared/shared.data';

declare var $: any;
@Component({
  selector: 'app-list-review',
  templateUrl: './list-review.component.html',
  styleUrls: ['./list-review.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ListReviewComponent implements OnInit {
  @ViewChild('reviewModal') public reviewModal: ModalDirective;
  @ViewChild('gallery') gallery: NgxGalleryComponent;
  @ViewChild('galleryModal') public galleryModal: ModalDirective;
  reviewFilterForm: FormGroup;
  reviewInputForm: FormGroup;
  index: any = 1;
  public searchTags = new BehaviorSubject<string>('');
  breadcrumbData: any = {
    title: 'location.labels.review',
    subTitle: 'location.labels.reviewSub',
    data: [{
      text: 'common.labels.home',
      link: '/'
    },
    {
      text: 'location.labels.review',
      link: ''
    }
    ]
  };

  showLoadingFlg: Boolean = false;
  showModalLoadingFlg: Boolean = false;
  buttonDisable: Boolean = false;
  isLoadingTagName: Boolean = false;
  refresh: Boolean = true;
  spinnerFlg: Boolean = false;
  public page: any = 1;
  public rows: Array<any> = [];
  public totalRows: Array<any> = [];
  currentPage: any = CustomTableConfig.pageNumber;
  itemsPerPage: any = 18;
  public maxSize: any = 5;
  public numPages: any = 1;
  public length: any = 0;
  categoryList: any;
  categoryDropdown: any;
  totalItems: any;
  reviewlocationsList: any;
  reviewlocation: any;
  reviewTags: any;
  reviewTagsDropdown: any[];
  reviewlocationId: any;
  tagsList: any;
  tagsDropdown: any[];
  selectedTags: any = [];
  album: any = [];
  reviewData: any;
  loadingFlag: Boolean = false;
  subscription: Subscription;
  galleryImages = [];
  currentImageOrientation: String = '';
  supplierTagsSubscription: Subscription;
  public galleryOptions: INgxGalleryOptions[] = DEFAULT_GALLERY_OPTIONS;
  dataLists = [
  ];
  keyList = [];
  //  Category listing
  categorylist = [];
  removeAllChildFlag: Boolean = true;
  bsModalRef: BsModalRef;
  REVIEW_LIST_QUERY_PARAMS = {
    'pageSize': 'pageSize',
    'pageNo': 'pageNo',
    'searchQuery': 'searchQuery',
    'locationCategories': 'categoryId',
    'locationName': 'locationName',
    'tag': 'tag',
  };
  commonLabelObj: any;
  MODULE_ID: any;
  permissionObj: any;
  ACTION_TYPES = ACTION_TYPES;
  constructor(private fb: FormBuilder,
    private _reviewList: ListReviewService,
    private modalService: BsModalService,
    private triggerService: TriggerService,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private router: Router,
    private sharedData: SharedData,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.setPermissionsDetails();
    this.createReviewFilterForm();
    this.createReviewInputForm();
    this.getLocationCategories();
    this.getLocationTags();
    this.getReviewLocationsList(false);
    this.detectChangedInput();
    this.translateService.get('common').subscribe((res: string) => {
      this.commonLabelObj = res;
    });
    this.subscribeEvents();
  }
  // set module permission details
  setPermissionsDetails() {
    this.permissionObj = this.sharedData.getRolePermissionData();
    this.MODULE_ID = this.route.snapshot.parent.data['moduleID'];
  }
  detectChangedInput() {
    this.supplierTagsSubscription = this.searchTags
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe((str) => this.getLocationTags(str));
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.supplierTagsSubscription) {
      this.supplierTagsSubscription.unsubscribe();
    }
    this.triggerService.setEvent({ type: EVENT_TYPES.closeModal, prevValue: {}, currentValue: [], dataLists: [], keyList: [] });
  }

  createReviewFilterForm() {
    this.reviewFilterForm = this.reviewFilterFormGroup();
  }
  /*Filters form group*/
  reviewFilterFormGroup(): FormGroup {
    return this.fb.group({
      locationName: [''],
      category: [''],
      locationTags: ['']
    });
  }

  createReviewInputForm() {
    this.reviewInputForm = this.reviewInputFormGroup();
  }

  reviewInputFormGroup(): FormGroup {
    return this.fb.group({
      tags: this.fb.array([]),
    })
  }
  /*Filters form group*/
  locationTags(): FormGroup {
    return this.fb.group({
      locationImageId: [''],
      locationImage: [''],
      tagNames: [''],
      spinnerFlag: false

    });
  }

  addLocationTags() {
    const locationTagsArray = <FormArray>this.reviewInputForm.controls['tags'];
    locationTagsArray.push(this.locationTags());
  }

  /**
* Submits on enter key
* @param event as enter key event
*/
  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      if (!this.reviewModal.isShown) {
        event.preventDefault();
        this.searchReviewLocations();
      }
    }
  }
  /*Search params*/
  getSearchQueryParam() {

    let params: HttpParams = new HttpParams();
    const queryParamObj = {};
    queryParamObj[this.REVIEW_LIST_QUERY_PARAMS.pageSize] = this.itemsPerPage.toString();
    queryParamObj[this.REVIEW_LIST_QUERY_PARAMS.pageNo] = this.currentPage.toString();
    if (this.reviewFilterForm) {
      const formValues = this.reviewFilterForm.value;
      if (formValues.locationName) {
        queryParamObj[this.REVIEW_LIST_QUERY_PARAMS.locationName] = formValues.locationName.trim();
      }
      const categoryIds = _.map(this.categorylist, 'id');
      if (categoryIds.length > 0) {
        queryParamObj[this.REVIEW_LIST_QUERY_PARAMS.locationCategories] = categoryIds;
      }
      if (formValues.locationTags) {
        queryParamObj[this.REVIEW_LIST_QUERY_PARAMS.tag] = formValues.locationTags;
      }

      params = params.append(this.REVIEW_LIST_QUERY_PARAMS.searchQuery, JSON.stringify(queryParamObj));
    }

    return params;
  }

  clear() {
    $('#category').val('');
    this.reviewlocationsList = [];
    this.refresh = true;
    this.reviewFilterForm.reset();
    this.reviewFilterForm.patchValue({
      locationName: '',
      category: '',
      locationTags: ''
    });
    this.currentPage = 1;
    this.page = 1;
    this.clearCategoryFilterLists();
    this.getReviewLocationsList(false);
    this.getLocationTags();

  }

  setdefaultPage() {
    this.currentPage = 1;
    this.page = 1;
  }

  /*Get review  location list*/
  getReviewLocationsList(listRefreshFlag) {
    if (!listRefreshFlag) {
      this.reviewlocationsList = [];
      this.showLoadingFlg = true;
    }
    this.buttonDisable = true;
    this._reviewList.getReviewList(this.getSearchQueryParam()).subscribe((response: any) => {
      this.buttonDisable = false;
      if (Common.checkStatusCode(response.header.statusCode)) {
        if (response.payload.results) {
          this.refresh = false;
          this.reviewlocationsList = response.payload.results;
          this.totalItems = response.payload.totalItems;
        } else {
          this.reviewlocationsList = [];
          this.totalItems = 0;
          this.refresh = false;
        }
      } else {
        this.reviewlocationsList = [];
        this.totalItems = 0;
        this.refresh = false;
      }
      this.showLoadingFlg = false;
      this.buttonDisable = false;
      this.refresh = false;
    }, error => {
      this.showLoadingFlg = false;
      this.buttonDisable = false;
      this.refresh = false;
      this.reviewlocationsList = [];
      this.totalItems = 0;
    });
  }

  /*Search filters*/
  getLocationCategories() {
    this._reviewList.getLocationCategories().subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.results) {
          this.categoryList = response.payload.results;
          this.categoryList.forEach(obj => {
            obj['name'] = obj['i18n']['name'];
          });
          this.categoryDropdown = Common.getMultipleSelectArr(this.categoryList, ['id'], ['name']);
        } else {
          this.categoryList = [];
        }
      } else {
        this.categoryList = [];
      }
    }, error => {
      this.categoryList = [];
    });
  }
  /**
   * Gets location tags from web service
   */
  getLocationTags(value: string = '') {
    if (value) {
      value = value.trim();
    }
    if (typeof value === 'string') {
      let params: HttpParams = new HttpParams();
      if (value) {
        params = params.append('tag', value);
      }
      this.tagsList = [];
      this.isLoadingTagName = true;

      this._reviewList.getLocationTagsData(params).subscribe((response: any) => {
        if (response.header && response.payload) {
          if (Common.checkStatusCode(response.header.statusCode)) {
            if (response.payload.result) {
              const tagsList = response.payload.result.tags;
              this.selectedTags.forEach((obj) => {
                if (!tagsList.includes(obj)) {
                  tagsList.push(obj);
                }
              });
              this.tagsList = tagsList;
              this.isLoadingTagName = false;
            } else {
              this.isLoadingTagName = false;
            }
          } else {
            this.tagsList = [];
            this.toastrService.error(response.header.message);
            this.isLoadingTagName = false;
          }
        }
      },
        (err) => {
          this.tagsList = [];
          this.toastrService.error(this.commonLabelObj.errorMessages.error);
        });
    }

  }
  tagsSelected(value) {
    if ((typeof value === 'string') && !this.selectedTags.includes(value)) {
      this.selectedTags.push(value);
    }
  }
  tagRemoved(value) {
    const index = this.selectedTags.indexOf(value);
    if (index) {
      this.selectedTags.splice(index, 1);
    }
  }
  searchReviewLocations() {
    this.refresh = true;
    this.reviewlocationsList = [];
    this.setdefaultPage();
    this.getReviewLocationsList(false);
  }
  /*Pagination*/
  public pageChanged(event: any): void {
    this.reviewlocationsList = [];
    this.refresh = true;
    this.currentPage = event.page;
    this.showLoadingFlg = true;
    this._reviewList.getReviewList(this.getSearchQueryParam()).subscribe((response: any) => {
      if (Common.checkStatusCode(response.header.statusCode)) {
        this.showLoadingFlg = false;
        this.reviewlocationsList = response.payload.results;
        this.totalItems = response.payload.totalItems;
      }
      else {
        this.reviewlocationsList = [];
        this.totalItems = [];
      }
    }, error => {
      this.reviewlocationsList = [];
      this.totalItems = 0;
    });
  }
  /*Pagination*/
  open(index: number): void {
    this.galleryModal.show();
    this.gallery.openPreview(index);
  }
  setOrientationToImage(data) {
    let imageData = data.image;
    let self = this;
    $('.ngx-gallery-preview-img').addClass('hidden');
    $('.ngx-spinner-wrapper').show();
    setTimeout(() => {
      $('.ngx-gallery-preview-img').removeClass('orientation-' + self.currentImageOrientation);
      self.currentImageOrientation = imageData.imageOrientation;
      $('.ngx-gallery-preview-img').addClass('orientation-' + self.currentImageOrientation);
      setTimeout(() => {
        $('.ngx-gallery-preview-img').removeClass('hidden');
        $('.ngx-spinner-wrapper').hide();
      }, 500);
    }, 500);

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

  previewClose() {
    this.galleryModal.hide();
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
  closeCategoryName(category, event) {
    const index = _.findIndex(this.categorylist, ['id', category.id]);
    if (index !== -1) {
      this.categorylist.splice(index, 1);
      this.removeCategoryFromDataLists(category.name);
    }
    this.removeAllChildFlag = true;
  }
  /**
   * It removes category from the category object
   * @param categoryName name of category to be removed
   */
  removeCategoryFromDataLists(categoryName) {
    let tempCategoryName = '';
    if (this.removeAllChildFlag) {
      for (let index1 = this.dataLists.length - 1; index1 >= 0; index1--) {
        for (let index2 = this.dataLists[index1].length - 1; index2 >= 0; index2--) {
          for (let index3 = this.dataLists[index1][index2].length - 1; index3 >= 0; index3--) {
            if (categoryName === this.dataLists[index1][index2][index3]['parentCategoryName']) {
              this.dataLists[index1].splice([index2], 1);
              this.removeAllChildFlag = false;
              break;
            }
          }
          if (!this.removeAllChildFlag) {
            break;
          }
        }
        if (!this.removeAllChildFlag) {
          break;
        }
      }
    }
    for (let index1 = this.dataLists.length - 1; index1 >= 0; index1--) {
      if (this.dataLists[index1]) {
        for (let index2 = this.dataLists[index1].length - 1; index2 >= 0; index2--) {
          if (this.dataLists[index1][index2]) {
            for (let index3 = this.dataLists[index1][index2].length - 1; index3 >= 0; index3--) {
              // tslint:disable-next-line:max-line-length
              if (this.dataLists[index1] && this.dataLists[index1][index2] && this.dataLists[index1][index2][index3] && this.dataLists[index1][index2][index3].name === categoryName) {
                if (this.dataLists[index1][index2][index3].parentCategoryName !== 'root') {
                  tempCategoryName = this.dataLists[index1][index2][index3].parentCategoryName;
                  delete this.dataLists[index1][index2][index3]['leafNode'];
                  delete this.dataLists[index1][index2][index3]['active'];
                  let activeNodes = 0;
                  for (let index4 = this.dataLists[index1][index2].length - 1; index4 >= 0; index4--) {
                    if (this.dataLists[index1][index2][index4].active) {
                      activeNodes++;
                    }
                  }
                  if ((activeNodes === 0 || this.dataLists[index1][index2].length === 0) && tempCategoryName !== 'root') {
                    this.dataLists[index1].splice(index2, 1);
                    this.removeCategoryFromDataLists(tempCategoryName);
                  }
                } else {
                  delete this.dataLists[index1][index2][index3]['active'];
                  delete this.dataLists[index1][index2][index3]['leafNode'];
                }
              }
            }
          }
        }
      }
    }
    this.removeBlabkArraysFromDataLists();
  }
  /**
   * Removes blank arrays from category list
   */
  removeBlabkArraysFromDataLists() {
    for (let index1 = this.dataLists.length - 1; index1 >= 0; index1--) {
      if (this.dataLists[index1] && this.dataLists[index1].length === 0) {
        this.dataLists.splice(index1, 1);
      }
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
    this.getLocationTags();
  }

  /**
  * navifate to manage tag screen by location id
  */
  viewTag(project) {
    this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.manageReview, [project.id])]);
  }
}
