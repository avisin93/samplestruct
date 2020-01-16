import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { DEFAULT_GALLERY_OPTIONS, ROUTER_LINKS_FULL_PATH } from '@app/config';
import { HttpParams } from '@angular/common/http';
import { Common, NavigationService } from '@app/common';
import { ToastrService } from 'ngx-toastr';
import { ManageReviewService } from './manage-review.service';
import { ManageReviewDataModel } from './manage-review.data-model';
import { Observable } from 'rxjs/Observable';
import { INgxGalleryOptions, NgxGalleryComponent } from 'ngx-gallery';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';

declare var $: any;
@Component({
  selector: 'app-manage-review',
  templateUrl: './manage-review.component.html',
  styleUrls: ['./manage-review.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ManageReviewComponent implements OnInit {
  /**
   * declare variables above constructor in sequence -imported constants,public variable,private variables
   */
  @ViewChild('tagsListModal') public tagsListModal: ModalDirective;
  @ViewChild('galleryModal') public galleryModal: ModalDirective;
  @ViewChild('gallery') gallery: NgxGalleryComponent;

  breadcrumbData: any = {
    title: 'location.labels.review',
    subTitle: 'location.labels.imageTgging',
    data: [{
      text: 'common.labels.home',
      link: '/'
    },
    {
      text: 'location.labels.review',
      link: [ROUTER_LINKS_FULL_PATH.review]
    },
    {
      text: 'location.labels.reviewImage',
      link: ''
    }
    ]
  };
  MAX_TAGS_COUNT = 10;
  reviewlocationId: any;
  reviewlocation: any;
  showModalLoadingFlg: Boolean = false;
  refresh: Boolean = true;
  galleryImages = [];
  reviewData: any;
  selectedTagCount: number;
  isModalPopUpFlag: Boolean = false;
  reviewFilterForm: FormGroup;
  tagsArrTopTenCount: any = [];
  tagPopUpData: any = [];
  allTagsModalData: any = [];
  reviewInputForm: FormGroup;
  album: any = [];
  myTags: any = [];
  isChecked: Boolean = true;
  isLoadingTagName: Boolean = false;
  locationIdArr: any = [];
  tagsList: any;
  locationName: any;
  locationId: any;
  selectedTags: any = [];
  validationMsg: any;
  currentImageOrientation: String = '';
  public galleryOptions: INgxGalleryOptions[] = DEFAULT_GALLERY_OPTIONS;
  checkedTags: any;
  showMoreTagCount: Boolean = true;
  totalTags: number;
  atleastOneTagValidation: any;
  REVIEW_LIST_PARAMS = {
    'order': 'order',
    'limit': 'limit',
    'passParam': 'passParam'
  };
  REVIEW_TAGS_PARAMS_VALUE = {
    'orderAlphabetical': '1',
    'orderCount': '2',
    'limit': '10'
  };
  dataLists = [];
  disabledSaveFlag: Boolean = false;
  spinnerSaveFlag: Boolean = false;
  keyList = [];
  categorylist = [];
  filterId: any = [];
  commonLabelObj: any;
  tagsPopUpArr: any = [];

  /**
  * initialize constructor after declaration of all variables
  */
  constructor(private fb: FormBuilder,
    private _reviewList: ManageReviewService,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private activatedRoute: ActivatedRoute,
    private navigationService: NavigationService
  ) {

  }

  /**
  * life cycle events whichever required after inicialization of constructor
  */
  ngOnInit() {
    this.locationId = this.activatedRoute.snapshot.paramMap.get('id');
    this.getAllTagData();
    this.createReviewFilterForm();
    this.createReviewInputForm();
    this.translateService.get('common').subscribe((res: string) => {
      this.commonLabelObj = res;
    });
    this.showLocationData(this.locationId);
    this.selectedTagCount = 0;
  }


  /**
   * creates review filter form
   */
  createReviewFilterForm() {
    this.reviewFilterForm = this.reviewFilterFormGroup();
  }

  /**
   * review filter form group
   */
  reviewFilterFormGroup(): FormGroup {
    return this.fb.group({
      locationName: [''],
      category: [''],
      locationTags: ['']
    });
  }

  /**
   * creates review Input form
   */
  createReviewInputForm() {
    this.reviewInputForm = this.reviewInputFormGroup();
  }
  /**
  *  Review input form group
  */
  reviewInputFormGroup(): FormGroup {
    return this.fb.group({
      tags: this.fb.array([]),
    });
  }

  /**
   *  Filter form group
   */
  locationTags(): FormGroup {
    return this.fb.group({
      locationImageId: [''],
      locationImage: [''],
      tagNames: [''],
      spinnerFlag: false

    });
  }

  /**
   *  Adds location tags
   */
  addLocationTags() {
    const locationTagsArray = <FormArray>this.reviewInputForm.controls['tags'];
    locationTagsArray.push(this.locationTags());
  }

  /**
   *  It shows location data
   */
  showLocationData(locationid) {
    this.reviewlocationId = locationid;
    const clearArray = <FormArray>this.reviewInputForm.controls['tags'];
    clearArray.controls = [];
    this.reviewlocation = [];
    this.getAllTagData();
  }

  hideLocationData() {
    this.album = [];
  }

  /**
   *  Get all location review data
   */
  getAllTagData() {
    this.isLoadingTagName = true;
    const combined = Observable.forkJoin(
      this._reviewList.getReviewLocationById(this.locationId),
      this._reviewList.getLocationtagsData(this.locationId, this.setParams(this.REVIEW_TAGS_PARAMS_VALUE.orderCount, this.REVIEW_TAGS_PARAMS_VALUE.limit)),
      this._reviewList.getLocationtagsData(this.locationId, this.setParams(this.REVIEW_TAGS_PARAMS_VALUE.orderAlphabetical))

    );
    combined.subscribe((latestValues: any) => {
      const getReviewLocationById: any = latestValues[0];
      const getLocationtagsData: any = latestValues[1];
      const gettagsData: any = latestValues[2];
      if (Common.checkStatusCode(getReviewLocationById.header.statusCode)) {
        this.isLoadingTagName = false;
        if (getReviewLocationById.payload.result) {
          this.reviewData = getReviewLocationById.payload.result;
          this.locationName = this.reviewData.i18n.name;
          this.reviewlocation = ManageReviewDataModel.getReviewData(getReviewLocationById.payload.result);
          this.locationIdArr = this.reviewData.locationImages;
          const patchTagsArray = <FormArray>this.reviewInputForm.controls['tags'];
          patchTagsArray.controls = [];
          this.galleryImages = [];
          for (let i = 0; i < this.reviewlocation.length; i++) {
            const obj = this.reviewlocation[i];
            this.addLocationTags();
            this.galleryImages.push({
              small: obj.thumbnailImageUrl ? obj.thumbnailImageUrl : '',
              medium: obj.orignaslImageUrl ? obj.orignaslImageUrl : '',
              big: obj.orignaslImageUrl ? obj.orignaslImageUrl : '',
              imageOrientation: obj.imageOrientation ? obj.imageOrientation : 1,
            });
            patchTagsArray.controls[i].patchValue({
              'locationImageId': this.reviewlocation[i].locationImageId,
              'locationImage': this.reviewlocation[i].locationImage,
              'tagNames': this.reviewlocation[i].tags,
            });
            this.album.push({
              src: this.reviewlocation[i].orignaslImageUrl
            });
          }
        } else {
          this.reviewlocation = [];
        }
      } else {
        this.refresh = true;
        this.reviewlocation = [];
        this.hideLocationData();
        this.navigateTo();
      }
      if (Common.checkStatusCode(getLocationtagsData.header.statusCode)) {
        const dataArr = getLocationtagsData.payload.result.results;
        this.isLoadingTagName = false;
        this.tagsArrTopTenCount = dataArr;
        const tempTagsArrTopTenCount = ManageReviewDataModel.setAlltagsArrData(dataArr);
        const tempArr = [];
        let oddIndex = 1;
        let evenIndex = 0;
        for (let index = 0; index < tempTagsArrTopTenCount.length; index++) {
          if (index < 5) {
            tempArr[evenIndex] = tempTagsArrTopTenCount[index];
            evenIndex += 2;
          } else {
            tempArr[oddIndex] = tempTagsArrTopTenCount[index];
            oddIndex += 2;
          }
        }
        this.tagsArrTopTenCount = tempArr;

      } else {
        this.tagsArrTopTenCount = [];
      }
      if (Common.checkStatusCode(gettagsData.header.statusCode)) {
        const dataArr = gettagsData.payload.result.results;
        this.isLoadingTagName = false;
        if (dataArr.length <= 10) {
          this.showMoreTagCount = false;
        }
        this.totalTags = gettagsData.payload.result.totalItems;
        this.tagsPopUpArr = dataArr;
        const data = this.tagsPopUpArr.reduce((firstChar, tagName) => {
          let isSpecialChar = false;
          const asciiCode = tagName.tag[0].charCodeAt(0);
          if ((asciiCode >= 65 && asciiCode <= 90) || (asciiCode >= 97 && asciiCode <= 122)) {
            isSpecialChar = false;
          } else {
            isSpecialChar = true;
          }
          const group = tagName.tag[0];
          if (!firstChar[group]) {
            firstChar[group] = { group, children: [tagName], isSpecialCharater: isSpecialChar };
          }
          else {
            firstChar[group].children.push(tagName);
          }

          return firstChar;
        }, {});
        this.tagPopUpData = Object.values(data);
        this.allTagsModalData = ManageReviewDataModel.reviewTagsModalData(this.tagPopUpData);
      } else {
        this.tagsPopUpArr = [];
      }
    });
  }

  /**
   *  set params for get location tags
   */
  setParams(order, limit?) {
    let params: HttpParams = new HttpParams();
    params = params.append(this.REVIEW_LIST_PARAMS.order, order);
    if (limit) {
      params = params.append(this.REVIEW_LIST_PARAMS.limit, limit);
    }
    return params;
  }

  /**
   *  Saves individual location
   */
  saveIndividualLocation(locationimageId, tagArray, imageFormGroup) {

    if (tagArray && tagArray.length > 0) {
      this.disabledSaveFlag = true;
      imageFormGroup.controls['spinnerFlag'].setValue(true);
      const finalVendorData = ManageReviewDataModel.setReviewData(tagArray, locationimageId);
      this._reviewList.putReviewLocationById(finalVendorData, this.reviewlocationId).subscribe((response: any) => {
        imageFormGroup.controls['spinnerFlag'].setValue(false);
        this.disabledSaveFlag = false;

        if (Common.checkStatusCode(response.header.statusCode)) {
          this.toastrService.success(response.header.message);
          this.getAllTagData();
          this.selectedTagCount = 0;
        } else {
          if (response && response.header && response.header.message) {
            this.toastrService.error(response.header.message);
          } else {
            this.toastrService.error(this.commonLabelObj.errorMessages.error);
          }
        }
        this.validationMsg = false;
      }, error => {
        imageFormGroup.controls['spinnerFlag'].setValue(false);
        this.disabledSaveFlag = false;
        this.toastrService.error(this.commonLabelObj.errorMessages.error);
        this.validationMsg = false;
      });
    } else {
      this.validationMsg = true;
    }
  }

  /**
  * Saves all selected tags for single or group of locations
  */
  saveAllLocationTags() {
    this.spinnerSaveFlag = true;
    this.disabledSaveFlag = true;
    const finaltagData = ManageReviewDataModel.setAllReviewData(this.myTags, this.locationIdArr, this.allTagsModalData);
    if (this.filterId.length !== 0 || this.myTags.length !== 0) {
      this.validationMsg = false;
      this._reviewList.putReviewLocationById(finaltagData, this.reviewlocationId).subscribe((response: any) => {
        this.spinnerSaveFlag = false;
        this.disabledSaveFlag = false;

        if (Common.checkStatusCode(response.header.statusCode)) {
          this.toastrService.success(response.header.message);
          this.getAllTagData();
          this.navigateTo();
        } else {
          if (response && response.header && response.header.message) {
            this.toastrService.error(response.header.message);
          } else {
            this.toastrService.error(this.commonLabelObj.errorMessages.error);
          }
        }
      }, error => {
        this.spinnerSaveFlag = false;
        this.disabledSaveFlag = false;
        this.toastrService.error(this.commonLabelObj.errorMessages.error);
      });
    } else {
      this.validationMsg = true;
      this.spinnerSaveFlag = false;
      this.disabledSaveFlag = false;
    }
  }


  tagInputValidation() {
    if (this.filterId.length !== 0 || this.myTags.length !== 0) {
      this.validationMsg = false;
    } else {
      this.validationMsg = true;
    }
  }
  /**
   * Gets location tags from web service
   */
  getLocationTags(value: string = '') {
    this.isLoadingTagName = true;
    if (value) {
      value = value.trim();
    }
    if (typeof value === 'string') {
      let params: HttpParams = new HttpParams();
      if (value) {
        params = params.append('tag', value);
      }
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

  /**
   * Open galary modal on image click
   */
  open(index: number): void {
    this.galleryModal.show();
    this.gallery.openPreview(index);
  }

  /**
   * Sets orientation to image
   */
  setOrientationToImage(data) {
    const imageData = data.image;
    const self = this;
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
   * close Gallary Modal
   */
  previewClose() {
    this.galleryModal.hide();
  }

  /**
   * updates checkbox value in array
   */
  checkBoxValue(tag, data, isModalPopUpFlag) {
    this.validationMsg = false;
    if (!isModalPopUpFlag) {
      const firstchar = tag.tag.charAt(0);
      const charFilter = _.find(this.allTagsModalData, { 'group': firstchar });
      const childObj = _.find(charFilter.children, { 'tag': tag.tag });
      if (data.target.checked) {
        tag.isChecked = true;
        childObj.isChecked = true;
      }
      else {
        tag.isChecked = false;
        childObj.isChecked = false;
      }
    }
    else {
      const childObj = _.find(this.tagsArrTopTenCount, { 'tag': tag.tag });
      if (childObj) {
        if (data.target.checked) {
          tag.isChecked = true;
          childObj.isChecked = true;
        } else {
          tag.isChecked = false;
          childObj.isChecked = false;
        }
      }
    }
    this.filterId = _.filter(this.allTagsModalData, { children: [{ isChecked: true }] });
    this.selectedTagCount = 0;
    for (let i = 0; i < this.filterId.length; i++) {
      this.checkedTags = _.filter(this.filterId[i].children, { isChecked: true });
      this.selectedTagCount = this.checkedTags.length + this.selectedTagCount;
    }
  }

  /**
   * Open review tag modal popup
   */
  openModal() {
    this.tagsListModal.show();
  }

  /**
   * Clear all selected tags
   */
  clearAllSelectedTags() {
    this.allTagsModalData = ManageReviewDataModel.reviewTagsModalData(this.allTagsModalData);
    this.tagsArrTopTenCount = ManageReviewDataModel.setAlltagsArrData(this.tagsArrTopTenCount);
    this.filterId = [];
    this.selectedTagCount = 0;
  }

  /**
   * Clear all selected tags and navigate to review list
   */
  cancel() {
    this.navigationService.navigate([ROUTER_LINKS_FULL_PATH.review]);
  }

  /**
  * Navigates to review listing
  */
  navigateTo() {
    this.navigationService.navigate([ROUTER_LINKS_FULL_PATH.review]);
  }

}
