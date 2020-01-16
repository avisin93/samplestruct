import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { FormControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { CustomValidators as CustomValidator } from 'ng2-validation';
import { CustomValidators } from '@app/common/custom-validators';
import { ROLES, ROUTER_LINKS_FULL_PATH, OPERATION_MODES, CURRENCIES, PROJECT_TYPES, COOKIES_CONSTANTS } from '@app/config';
import { Common, NavigationService, SessionService } from '@app/common';
import { ManageUserData } from './add-freelancer.data.model';
import { SharedData } from '@app/shared/shared.data';
import { AddFreelancerService } from './add-freelancer.service'
import { SharedService } from '@app/shared/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpParams } from '@angular/common/http';
import { PROJECT_CATEGORY_TABS } from '../../constants';

declare var $: any;

@Component({
  selector: 'app-add-freelancer',
  templateUrl: './add-freelancer.component.html',
  styleUrls: ['./add-freelancer.component.scss']
})
export class AddFreelancerComponent implements OnInit {
  isClicked: boolean = false;
  ROLES = ROLES;
  ROUTER_LINKS_FULL_PATH = ROUTER_LINKS_FULL_PATH;
  CURRENCIES = CURRENCIES;
  addUserForm: FormGroup;
  submmitedFormFlag: boolean = false
  add_input_error: boolean = false;
  categoriesList: any;
  accountList: any;
  commercialCategory: any;
  subAccountList: any;
  commericialAccount: any;
  corporateCategory: any;
  corporateAccount: any;
  currencies: any = [];
  commercialCategoriesArr: any = [];
  entertainmentCategoriesArr: any = [];
  corporateCategoriesArr: any = [];
  modesOfOperation: any = [];
  categories: any = [];
  projectTypes: any = [];
  value: any = "";
  OPERATION_MODES = OPERATION_MODES;
  selectedCommercialCategories = [];
  selectedEntertainmentCategories = [];
  selectedCorporateCategories = [];
  currency: any = [];
  spinnerFlag: boolean = false;
  roles: any = [];
  operation: any = [];
  dropdownSettings: any;
  showLoadingFlg: boolean = false;
  showFloatingBtn: boolean = true;
  responseErrorMsg: any
  tabs = [
    { name: 'actors.freelancers.labels.commercial', categories: [], selectedCategories: [] },
    { name: 'actors.freelancers.labels.entertainment', categories: [], selectedCategories: [] },
    { name: 'actors.freelancers.labels.corporate', categories: [], selectedCategories: [] }
  ];
  breadcrumbData: any = {
    title: 'actors.freelancers.labels.addFreelancer',
    subTitle: 'actors.freelancers.labels.addFreelancerSubTitle',
    data: [{
      text: 'common.labels.home',
      link: '/'
    },
    {
      text: 'actors.freelancers.labels.freelancersList',
      link: ROUTER_LINKS_FULL_PATH.freelancers
    },
    {
      text: 'actors.freelancers.labels.addFreelancer',
      link: ''
    }
    ]
  }
  // dropdownSettings = {
  //     singleSelection: false,
  //     idField: 'id',
  //     textField: 'text',
  //     selectAllText: 'Select All',
  //     unSelectAllText: 'UnSelect All',
  //     itemsShowLimit: 3,
  //     allowSearchFilter: true
  //   };

  constructor(private fb: FormBuilder,
    private navigationService: NavigationService,
    private sharedData: SharedData,
    private _addFreelancerService: AddFreelancerService,
    private _sharedService: SharedService,
    private toastrService: ToastrService,
    private cookieService: CookieService,
    private sessionService: SessionService,
    private translateService: TranslateService,
  ) { }

  ngOnInit() {
    $("td i").hide();
    this.createForm();
    this.getCurrencies();
    this.getModesOfOperation();
    this.getProjectCategories();
    this.getRoles();

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.translateService.get('common').subscribe((res: string) => {
      this.responseErrorMsg = res;
    });
  }
  @HostListener("window:scroll", [])
  onWindowScroll() {
    this.showFloatingBtn = Common.isInView($('#fixed-btn')) ? false : true;
  }
  createForm() {
    this.addUserForm = this.createUserFormGroup();
  }
  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent) {
      if (event.keyCode === 13) {
        event.preventDefault();
        if (!this.isClicked) {
        this.addUser();
        }
      }
  }
  createUserFormGroup(): FormGroup {
    return this.fb.group({
      firstName: ['', [CustomValidators.required]],
      lastName: ['', [CustomValidators.required]],
      email: ['', [CustomValidators.checkEmail, CustomValidators.required]],
      currency: ['', [CustomValidators.required]],
      mode: ['', [CustomValidators.required]],
      entertainment: [''],
      commercial: [''],
      corporate: [''],
      roleIds: ['']
    });
  }

  /**
   * Convert email to lowercase and trim value of email field
  */
  changeEmailFormat() {
    const emailVal = this.addUserForm.value.email;
    if (emailVal) {
      const email = emailVal.toLowerCase().trim();
      this.addUserForm.patchValue({
        email: email
      });
    }
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
          this.operation = Common.getMultipleSelectArr(this.modesOfOperation, ['id'], ['i18n', 'name']);
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
  getProjectCategories() {
    this.showLoadingFlg = true;
    const combined = Observable.forkJoin(
      this._sharedService.getProjectCategories(PROJECT_TYPES.commercial),
      this._sharedService.getProjectCategories(PROJECT_TYPES.entertainment),
      this._sharedService.getProjectCategories(PROJECT_TYPES.corporate)
    );
    combined.subscribe((latestValues: any) => {
      this.showLoadingFlg = false;

      var commercialCategories: any = latestValues[0];
      var entertainmentCategories: any = latestValues[1];
      var corporateCategories: any = latestValues[2];
      /*commertial categories response response*/
      if (commercialCategories && Common.checkStatusCodeInRange(commercialCategories.header.statusCode)) {
        if (commercialCategories.payload) {
          this.tabs[PROJECT_CATEGORY_TABS.commercial].categories = commercialCategories.payload.results;
          let commercialKeyArrObj = [];
          let commercialCategoriesArr = this.tabs[PROJECT_CATEGORY_TABS.commercial].categories;
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
        if (entertainmentCategories.payload) {
          // this.entertainmentCategories = entertainmentCategories.payload.results;
          this.tabs[PROJECT_CATEGORY_TABS.entertainment].categories = entertainmentCategories.payload.results;

          let entertainmentKeyArrObj = [];
          let entertainmentCategoriesArr = this.tabs[PROJECT_CATEGORY_TABS.entertainment].categories;
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
        if (corporateCategories.payload) {
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
    }, error => {
      this.showLoadingFlg = false;

    })
  }

  addUser() {
    this.spinnerFlag = true;
    this.submmitedFormFlag = true;
    if (this.addUserForm.valid) {
      this.isClicked = true;
      let formvalue = this.addUserForm.value;
      formvalue['langCode'] = this.sessionService.getCookie(COOKIES_CONSTANTS.langCode);
      formvalue['commercial'] = this.selectedCommercialCategories;
      formvalue['entertainment'] = this.selectedEntertainmentCategories;
      formvalue['corporate'] = this.selectedCorporateCategories;
      let finalUserData = ManageUserData.getFinalUserData(formvalue);
      this._addFreelancerService.postData(finalUserData).
        subscribe((responseData: any) => {
          this.isClicked = false;
          this.spinnerFlag = false;

          if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
            this.navigationService.navigate(ROUTER_LINKS_FULL_PATH.freelancers).then(() =>
              this.toastrService.success(responseData.header.message)
            )
          } else {
            if (responseData.header.message) {
              this.toastrService.error(responseData.header.message);
            }

          }
        }, error => {
          this.spinnerFlag = false;
          this.isClicked = false;
          this.toastrService.error(this.responseErrorMsg.errorMessages.responseError);
        });

    }
    else {
      let target;
      for (var i in this.addUserForm.controls) {
        if (!this.addUserForm.controls[i].valid) {
          target = this.addUserForm.controls[i];
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
      // $('html,body').animate({ scrollTop: $('.ng-invalid').first().offset().top }, 'slow');
    }


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
  selectCategories(categoryId, tabIndex, selector, isLeafNode, parentId: any = "", nodeType: any = "") {
    $('.' + selector + categoryId).toggleClass('selected-category');
    let isClassPresent;
    if (isLeafNode) {
      this.setIds(tabIndex, categoryId);
    }
    else {
      isClassPresent = $('.' + selector + categoryId).hasClass('selected-category');
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

  setIds(tabIndex, categoryId) {
    let selectedFlag = false;
    switch (tabIndex) {
      case PROJECT_CATEGORY_TABS.commercial:

        if (this.selectedCommercialCategories.includes(categoryId)) {
          let index = this.selectedCommercialCategories.indexOf(categoryId);
          this.selectedCommercialCategories.splice(index, 1);
          selectedFlag = false;
        }
        else {
          this.selectedCommercialCategories.push(categoryId);
          selectedFlag = true;
        }
        break;

      case PROJECT_CATEGORY_TABS.entertainment:
        if (this.selectedEntertainmentCategories.includes(categoryId)) {
          let index = this.selectedEntertainmentCategories.indexOf(categoryId);
          this.selectedEntertainmentCategories.splice(index, 1);
          selectedFlag = false;
        }
        else {
          this.selectedEntertainmentCategories.push(categoryId);
          selectedFlag = true;
        }
        break;

      case PROJECT_CATEGORY_TABS.corporate:
        if (this.selectedCorporateCategories.includes(categoryId)) {
          let index = this.selectedCorporateCategories.indexOf(categoryId);
          this.selectedCorporateCategories.splice(index, 1);
          selectedFlag = false;
        }
        else {
          this.selectedCorporateCategories.push(categoryId);
          selectedFlag = true;
        }
        break;
    }
  }
  selectLeafNodes(tabIndex, level3IdsArr, isParentSelected) {
    for (let i = 0; i < level3IdsArr.length; i++) {
      this.setIds(tabIndex, level3IdsArr[i]);
      if (isParentSelected)
        $('.id_' + level3IdsArr[i]).addClass('selected-category');
      else
        $('.id_' + level3IdsArr[i]).removeClass('selected-category');
    }
  }
  selectAllChildren(categoryId, tabIndex, parentId, isParentSelected) {
    let filteredData: any;
    let localThis = this;
    if (!parentId) {
      filteredData = _.find(this.tabs[tabIndex].categories, { 'id': categoryId });
      if (filteredData) {
        _.forEach(filteredData.accounts, function (obj) {
          if (isParentSelected)
            $('.id_' + obj.id).addClass('selected-category');
          else
            $('.id_' + obj.id).removeClass('selected-category');
          if (obj.accounts) {
            let level3IdsArr = _.map(obj.accounts, 'id');
            if (level3IdsArr) {
              localThis.selectLeafNodes(tabIndex, level3IdsArr, isParentSelected);
            }
          }
          else {
            localThis.setIds(tabIndex, obj.id);
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

  getRoles() {
    this._addFreelancerService.getRoles().subscribe((response: any) => {
      if (Common.checkStatusCode(response.header.statusCode)) {
        if (response.payload && response.payload.results) {
          let rolesArray = []
          rolesArray = response.payload.results;
          this.roles = Common.getMultipleSelectArr(rolesArray, ['id'], ['name']);
        } else {
          this.roles = []
        }
      } else {
        this.roles = []
      }
    }, error => {
      this.roles = []
    });
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
