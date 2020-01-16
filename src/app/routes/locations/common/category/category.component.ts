/** 1.Import third party components
2. Import created modules
3. Import crated services
4. Import created classes
5. Import created constants **/
import { Component, OnInit, ViewChild, Input, EventEmitter, Output, SimpleChanges, OnChanges, HostListener } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { ModalDirective } from 'ngx-bootstrap';
import { HttpParams } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { NavigationService, Common, CustomValidators, SessionService } from '@app/common';
import { CategoryService } from './category.service';
import { ManageCategorydata } from './category.component.data.model';
import { CATEGORY_TYPE_CONST, ROUTER_LINKS_FULL_PATH, COOKIES_CONSTANTS, API_URL, ACTION_TYPES, MODULE_ID as MODULE_IDs } from '@app/config';
import { SharedData } from '@app/shared/shared.data';
import { ActivatedRoute } from '@angular/router';
declare var $: any;
const swal = require('sweetalert');
@Component({
  selector: 'category-location-hierarchy',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, OnChanges {
  /*declare variables above constructor in sequence -imported constants,public variable,private variables*/
  categoryForm: FormGroup;
  CATEGORY_TYPE_CONST = CATEGORY_TYPE_CONST;
  @ViewChild('addModal') public addModal: ModalDirective;
  @Input() showActions: Boolean = false;
  @Input() showFooter: Boolean = false;
  @Input() includeLocations: Boolean = false;
  @Input() selectedCategories: any[] = [];
  @Output() onSelectCategory: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancelAction: EventEmitter<any> = new EventEmitter<any>();
  addFlag: Boolean = false;
  disableButtonFlag: Boolean = false;
  spinnerFlag: Boolean = false;
  disableOkButtonFlag: Boolean = true;
  submmitedFormFlag: Boolean = false;
  showLoader: Boolean = false;
  isWebServiceCalling: boolean = false;
  currentCategoryObj: any = {};
  MODULE_ID: any;
  permissionObj: any;
  CATEGORY_LIST_PARAMS: any = {
    'includeLocation': 'includeLocation',
    'parentId': 'parentId'
  };
  dataLists: any[] = [];
  parentIndex: number;
  outerListIndex: number;
  innerListIndex: number
  catLocationName: string;
  commonLabels: any = {};
  ACTION_TYPES = ACTION_TYPES;
  /*declare variables above constructor in sequence -imported constants,public variable,private variables*/

  /*inicialize constructor after declaration of all variables*/
  constructor(private fb: FormBuilder,
    private navigationService: NavigationService,
    private sessionService: SessionService,
    private _categoryService: CategoryService,
    private sharedData: SharedData,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private translateService: TranslateService) {
  }
  /*inicialize constructor after declaration of all variables*/

  /*all life cycle events whichever required after inicialization of constructor*/
  ngOnInit() {
    this.showLoader = true;
    this.setLocaleObj();
    this.setCategoryList();
    this.createCategoryForm();
    this.setPermissionsDetails();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedCategories && changes.selectedCategories.currentValue) {
      const selectedCategories = changes.selectedCategories.currentValue;
      this.setInitialCatgeoryList();
      if (selectedCategories.length > 0) {
        this.showSelectedCategoriesActive();
      }
    }
  }
  /*all life cycle events whichever required after inicialization of constructor*/
  // set module permission details
  setPermissionsDetails() {
    this.permissionObj = this.sharedData.getRolePermissionData();
    this.MODULE_ID = this.route.snapshot.parent.data['moduleID'];
  }
  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      if ($("#category-page").is(":visible")) {
        if (this.addModal.isShown && !this.spinnerFlag) {
          event.preventDefault();
          this.saveCategory();
        } else if (this.showFooter) {
          event.preventDefault();
          this.categorySelected();
        }
      }
    }
  }

  /*method to set initial category list for select category modal popup*/
  setInitialCatgeoryList() {
    this.dataLists.splice(1);
    this.updateCateoryObjActiveField(0, { 'active': true }, false);

  }

  /**
   method to set category list fo category list module
      @param index as number for getting inner list of categories,
      @param criteria as object for finding particular item from category list 
      @param flag as boolean for setting active field as true or false
    */
  updateCateoryObjActiveField(index, criteria, flag) {
    const folderObj = _.find(this.dataLists[index], criteria);
    if (folderObj) {
      folderObj['active'] = flag;
    }
  }
  /*method to show selected categories in active state*/
  showSelectedCategoriesActive() {
    let observables = [];
    for (let index = 0; index < this.selectedCategories.length; index++) {
      let params: HttpParams = new HttpParams();
      let categoryId = this.selectedCategories[index].id;
      if (categoryId) {
        params = params.append(this.CATEGORY_LIST_PARAMS.parentId, categoryId);
        observables.push(this._categoryService.getCategoryList(params));
      }
    }

    const combined = Observable.forkJoin(observables);
    combined.subscribe((latestValues: any) => {
      this.hideAllRefreshIcons();
      latestValues.forEach((response) => {
        if (response && Common.checkStatusCodeInRange(response.header.statusCode)) {
          const categories = response.payload.results;
          if (categories.length > 0) {
            const categoriesData = ManageCategorydata.getCategoryListDetails(categories, '');
            this.dataLists.push(categoriesData);
          }
        }
      });
      this.selectedCategories.forEach((obj, index) => {
        this.updateCateoryObjActiveField(index, { 'id': obj.id }, true);
      });
      this.setdisableOkButtonFlag();
    })
  }
  /*method to set common labels from language jsons*/
  setLocaleObj() {
    this.translateService.get('common').subscribe(res => {
      this.commonLabels = res;
    });

  }
  setdisableOkButtonFlag() {
    if (this.dataLists.length > 0) {
      const folderObj = _.find(this.dataLists[0], { 'active': true });
      this.disableOkButtonFlag = folderObj ? false : true;
    }
  }

  /**
   method to set category list fo category list module
      @param categoryId as string for setting parentId param,
      @param isNestedFoldersActive as boolean for setting data list for nested active folder
    */
  setCategoryList(categoryId: string = '', isNestedFoldersActive: boolean = false) {
    this.isWebServiceCalling = true;
    let params: HttpParams = new HttpParams();
    if (categoryId) {
      params = params.append(this.CATEGORY_LIST_PARAMS.parentId, categoryId);
      $('.folder-icon').addClass('ptr-disabled');
    }
    if (this.includeLocations && categoryId) {
      params = params.append(this.CATEGORY_LIST_PARAMS.includeLocation, this.includeLocations.toString());
    }
    this._categoryService.getCategoryList(params).subscribe((response: any) => {
      this.showLoader = false;
      this.isWebServiceCalling = false;
      $('.folder-icon').removeClass('ptr-disabled');
      if (Common.checkStatusCode(response.header.statusCode)) {
        if (response.payload && response.payload.results) {
          const categories = response.payload.results;
          const categoriesData = ManageCategorydata.getCategoryListDetails(categories, categoryId);
          this.setDataListArrForActiveFolder(isNestedFoldersActive, categoriesData);
        }
      } else {
        this.hideSpinnerIcon();
      }
    }, error => {
      $('.folder-icon').removeClass('ptr-disabled');
      this.hideSpinnerIcon();
      this.showLoader = false;
      this.isWebServiceCalling = false;
    });
  }

  /**
  method to set category list fo category list module
     @param categoriesData as categories array,
     @param isNestedFoldersActive as boolean for setting data list for nested active folder
   */
  setDataListArrForActiveFolder(isNestedFoldersActive, categoriesData) {
    if (isNestedFoldersActive) {
      let activeFolder = _.find(this.dataLists[this.outerListIndex + 1], { 'active': true });
      if (activeFolder) {
        this.dataLists[this.outerListIndex + 1] = categoriesData;
        activeFolder = _.find(this.dataLists[this.outerListIndex + 1], { 'id': activeFolder.id });
        activeFolder['active'] = activeFolder ? true : false;
      } else {
        this.dataLists[this.outerListIndex + 1] = categoriesData;
      }
    } else {
      this.dataLists.push(categoriesData);
    }
    this.setdisableOkButtonFlag();
    this.hideSpinnerIcon();
  }
  /* method to hide spinners,refresh icons & folder icons as per functionality*/
  hideSpinnerIcon() {
    $('.spinner_' + this.currentCategoryObj.id).removeClass('fa-spin');
    $('.spinner_' + this.currentCategoryObj.id).hide();
    this.hideAllRefreshIcons();
    $('.folder_' + this.currentCategoryObj.id).show();
  }
  hideAllRefreshIcons() {
    setTimeout(() => {
      $('.fa-refresh').hide();
    }, 0);
  }
  hideFolderIcon() {
    $('.folder_' + this.currentCategoryObj.id).hide();
    $('.spinner_' + this.currentCategoryObj.id).show();
    $('.spinner_' + this.currentCategoryObj.id).addClass('fa-spin');
  }
  /* method to hide spinners,refresh icons & folder icons as per functionality*/

  /* method to create form for add/update category modal*/
  createCategoryForm() {
    this.categoryForm = this.fb.group({
      name: ['', [CustomValidators.required]],
      type: [CATEGORY_TYPE_CONST.category]
    });
  }


  /**
method to open add/update category modal
  @param flag as boolean for getting action to be perfomed,
  @param itemObj as current category object
  @param outerListIndex as number for getting index of outer array
  @param innerListIndex as number for getting index of inner array
*/
  openAddModal(flag, itemObj, outerListIndex, innerListIndex) {
    this.addFlag = flag;
    this.outerListIndex = outerListIndex;
    this.innerListIndex = innerListIndex;
    this.currentCategoryObj = itemObj;
    this.submmitedFormFlag = false;
    if (this.addFlag) {
      this.categoryForm.controls['name'].reset();
      this.categoryForm.controls['type'].setValue(CATEGORY_TYPE_CONST.category);
      this.categoryForm.controls['name'].markAsUntouched();
    } else {
      this.categoryForm.controls['name'].setValue(itemObj.name);
    }
    this.addModal.show();
  }

  /* method to check form validity & to save catgeory data*/
  saveCategory() {
    const formValue = this.categoryForm.value;
    this.submmitedFormFlag = true;
    if (this.categoryForm.valid) {
      this.submmitedFormFlag = false;
      this.disableButtonFlag = true;
      this.spinnerFlag = true;
      formValue['langCode'] = this.sessionService.getCookie(COOKIES_CONSTANTS.langCode);
      formValue['parentId'] = this.addFlag ? this.currentCategoryObj.id : this.currentCategoryObj.parentId;
      const finalData = ManageCategorydata.getCategoryWebServiceDetails(formValue);
      if (this.addFlag) {
        this.addCategory(finalData, formValue.type);
      } else {
        this.updateCategory(finalData);
      }
    }

  }

  /**
 method to add new category/location
    @param categoriesData as categories data object to be added,
    @param type as boolean for getting type of  data to be added
  */
  addCategory(categoryData, type) {
    let url = (type == CATEGORY_TYPE_CONST.category) ? API_URL.locationCategoriesUrl : API_URL.addLocationNameUrl;
    this._categoryService.postData(url, categoryData).subscribe((responseData: any) => {
      this.disableButtonFlag = false;
      this.spinnerFlag = false;
      this.closeModal();
      if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
        this.currentCategoryObj['hasChildren'] = true;
        if (this.currentCategoryObj.active) {
          this.setCategoryList(this.currentCategoryObj.id, true);
        }
        this.toastrService.success(responseData.header.message);
      } else {

        this.toastrService.error(responseData.header.message);
      }
    },
      error => {
        this.disableButtonFlag = false;
        this.spinnerFlag = false;
        this.toastrService.error(this.commonLabels.errorMessages.error);
      });
  }

  /**
method to add update existing category
   @param categoriesData as categories data object to be updated
 */
  updateCategory(categoryData) {
    this._categoryService.putData(this.currentCategoryObj.id, categoryData).subscribe((responseData: any) => {
      this.disableButtonFlag = false;
      this.spinnerFlag = false;
      this.closeModal();
      if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
        this.dataLists[this.outerListIndex][this.innerListIndex].name = this.categoryForm.value.name
        this.toastrService.success(responseData.header.message);
      } else {
        this.toastrService.error(responseData.header.message);
      }
    },
      error => {
        this.disableButtonFlag = false;
        this.spinnerFlag = false;
        this.toastrService.error(this.commonLabels.errorMessages.error);
      });

  }

  /**
  method to delete category/location
     @param receivedFolder as category object,
     @param index as number for getting outerlist index
      @param folderList as number for getting innerlist 
   */
  showSubCategories(receivedFolder, index, folderList) {
    this.parentIndex = index;
    if (receivedFolder.type === CATEGORY_TYPE_CONST.category) {
      if (!this.isWebServiceCalling) {
        this.currentCategoryObj = receivedFolder;
        const activeFolder = _.find(folderList, { 'active': true });
        if (activeFolder && (activeFolder !== receivedFolder)) {
          activeFolder.active = false;
        }
        this.dataLists.splice(index + 1, this.dataLists.length - (index + 1));
        if (!receivedFolder['active']) {
          if (receivedFolder.hasChildren) {
            this.hideFolderIcon();
            this.setCategoryList(receivedFolder.id);
          }
        }
        receivedFolder.active = !receivedFolder.active;
        this.setdisableOkButtonFlag();
      }
    } else {
      if (this.permissionObj && this.permissionObj[MODULE_IDs.locationList] && this.permissionObj[MODULE_IDs.locationList][ACTION_TYPES.EDIT]) {
        this.navigationService.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.manageLocation, [receivedFolder.id])]);
      }
    }
  }
  /* method to set selected category in category field in manage location component*/
  categorySelected() {
    let activeObjArr = [];
    _.forEach(this.dataLists, function (dataArr) {
      const activeFolder = _.find(dataArr, { 'active': true });
      if (activeFolder) {
        activeObjArr.push(activeFolder);
      }
    });
    let lastItemOfActiveObj = _.last(activeObjArr);
    let lastItemOfselectedCategories = _.last(this.selectedCategories);
    if (lastItemOfActiveObj && lastItemOfselectedCategories && (lastItemOfActiveObj.id != lastItemOfselectedCategories.id)) {
      const swalObj = Common.swalConfirmPopupObj(this.commonLabels.labels.categorySelectWarningMsg, true, true, this.commonLabels.labels.yes, this.commonLabels.labels.cancelDelete);
      swal(swalObj, (isConfirm) => {
        if (isConfirm) {
          this.onSelectCategory.emit(activeObjArr);
        }
      })
    } else {
      if (activeObjArr.length > 0) {
        this.onSelectCategory.emit(activeObjArr);
      }
    }
  }
  /* method to close add/update category modal*/
  closeModal() {
    this.addModal.hide();
  }
  /* method to emit event to close select category modal in manage location component*/
  closeCategoryModal() {
    this.onCancelAction.emit();
  }

  /**
  method to delete category/location
     @param currentFolder as category object,
     @param parentIndex as number for getting outerlist index
      @param index as number for getting innerlist index
   */
  delete(currentFolder, parentIndex, index) {
    // tslint:disable-next-line:max-line-length
    const msg = (currentFolder.type === CATEGORY_TYPE_CONST.location) ? this.commonLabels.labels.locationDeleteMsg : this.commonLabels.labels.categoryDeleteMsg;
    const swalObj = Common.swalConfirmPopupObj(msg, true, true, this.commonLabels.labels.yes, this.commonLabels.labels.cancelDelete, '',
      this.commonLabels.labels.deleteAdvanceMsg);
    swal(swalObj, (isConfirm) => {
      if (isConfirm) {
        let url = (currentFolder.type == CATEGORY_TYPE_CONST.category) ? API_URL.manageLocationCategoriesUrl : API_URL.manageLocationUrl;
        this._categoryService.deleteCategory(url, currentFolder.id).subscribe((response: any) => {
          if (Common.checkStatusCodeInRange(response.header.statusCode)) {
            this.dataLists[parentIndex].splice(index, 1);
            if (currentFolder.active) {
              this.dataLists.splice(parentIndex + 1, this.dataLists.length - (parentIndex + 1));
            }
            this.toastrService.success(response.header.message);
          } else {
            this.toastrService.error(this.commonLabels.errorMessages.error);
          }
        }, error => {
          this.toastrService.error(this.commonLabels.errorMessages.error);
        }
        );
      }
    });

  }
}
