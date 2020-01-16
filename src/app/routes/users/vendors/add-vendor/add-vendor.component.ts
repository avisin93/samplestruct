import { Component, OnInit, HostListener } from '@angular/core';
import { CustomValidators } from '@app/common/custom-validators';
import { FormControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ROLES, OPERATION_MODES, ROUTER_LINKS_FULL_PATH, CLASSIFICATION, CURRENCIES, PROJECT_TYPES, COOKIES_CONSTANTS } from '@app/config';
import { SharedData } from '@app/shared/shared.data';
import { Router, ActivatedRoute } from '@angular/router';
import { Common, NavigationService, SessionService } from '@app/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { SharedService } from '@app/shared/shared.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { ManageVendorData } from './add-vendor.data.model';
import * as _ from 'lodash';
import { AddVendorService } from './add-vendor.service';
import { PROJECT_CATEGORY_TABS } from '../../constants';
declare var $: any;

@Component({
  selector: 'app-add-vendor',
  templateUrl: './add-vendor.component.html',
  styleUrls: ['./add-vendor.component.scss']
})
export class AddVendorComponent implements OnInit {
  selectedEntertainmentCategories = [];
  selectedCorporateCategories = [];
  projectTypes: any;
  categories: any;
  projectType: any;
  operationDropdown: any;
  currencyDropdown: any;
  ROUTER_LINKS_FULL_PATH = ROUTER_LINKS_FULL_PATH;
  // CLASSIFICATION = CLASSIFICATION;
  CLASSIFICATION: { id: number; text: string; }[];
  CURRENCIES = CURRENCIES;
  ROLES = ROLES;
  OPERATION_MODES = OPERATION_MODES;
  manageVendorForm: FormGroup;
  submitVendorForm: boolean = false;
  vendorID: any;
  rowIndex: any;
  vendorDetails: any;
  categoriesList: any;
  accountList: any;
  commercialCategory: any;
  subAccountList: any;
  commericialAccount: any;
  corporateCategory: any;
  corporateAccount: any;
  vendorArr: any = [];
  selectedCommercialCategories = [];
  add_input_error: boolean = false;
  submmitedFormFlag: boolean = false;
  disableButton:boolean = false;
  spinnerFlag:boolean = false;
  commercialCategoriesArr: any = [];
  entertainmentCategoriesArr: any = [];
  corporateCategoriesArr: any = [];
  currency:any = [];
  operation:any=[];
  showLoadingFlg:boolean = false;
  showFloatingBtn: boolean = true;
  commonLabels:any
  tabs = [
    { name: 'actors.freelancers.labels.commercial', categories: [], selectedCategories: [] },
    { name: 'actors.freelancers.labels.entertainment', categories: [], selectedCategories: [] },
    { name: 'actors.freelancers.labels.corporate', categories: [], selectedCategories: [] }
  ];
  breadcrumbData: any = {
    title: 'actors.vendors.labels.addVendor',
    subTitle: 'actors.vendors.labels.subtitle',
    data: [{
      text: 'common.labels.home',
      link: '/'
    },
    {
      text: 'actors.vendors.labels.vendorlist',
      link: ROUTER_LINKS_FULL_PATH.vendors
    },
    {
      text: 'actors.vendors.labels.addVendor',
      link: ''
    }
    ]
  }
  constructor(
    private toastrService: ToastrService,
    public sessionService: SessionService,
    private _sharedService: SharedService,
    private addvendorService: AddVendorService,
    private fb: FormBuilder,
    public _http: HttpClient,
    private sharedData: SharedData,
    private router: Router,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private navigationService: NavigationService,

  ) {
    // this.adapter.setLocale('en-in');
  }

  select(ev) {
  }


  ngOnInit() {
    this.getLocalizedClassificationValues();
    this.getCurrencies();
    this.getModesOfOperation();
    //  this.getProjectTypes();

    this.route.params.subscribe(params => {
      this.vendorID = params['id'];
      this.rowIndex = this.vendorID - 1;
      this.vendorArr = this.sharedData.getModulesData('vendors');
      this.createAddForm();
    });
    this.getProjectCategories();
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
getCurrencies(){
  this._sharedService.getCurrencies().subscribe((data: any) => {
    if(Common.checkStatusCodeInRange(data.header.statusCode)){
    if( data.payload && data.payload.results){
    this.currencyDropdown = [];
    this.currencyDropdown = data.payload.results;
    this.currency = Common.getMultipleSelectArr(this.currencyDropdown,['id'], ['i18n', 'name'] );
  } else{
    this.currencyDropdown =[];
  }
} else{
  this.currencyDropdown =[];
}
}, error =>{
  this.currencyDropdown =[];
});
}
getModesOfOperation(){
  this._sharedService.getModesOfOperation().subscribe((data: any) => {
      if(Common.checkStatusCodeInRange(data.header.statusCode)){
    if(data.payload && data.payload.results){
    this.operationDropdown = [];
    this.operationDropdown = data.payload.results;
    this.operation = Common.getMultipleSelectArr(this.operationDropdown,['id'], ['i18n', 'name'] );
  } else {
      this.operationDropdown =[];
  }
} else{
    this.operationDropdown =[];
}
}, error =>{
    this.operationDropdown =[];
});
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
  createAddForm() {
    this.manageVendorForm = this.addManageVendorFormGroup();
  }

  addManageVendorFormGroup(): FormGroup {
    return this.fb.group({
      companyName: ['', [CustomValidators.required]],
      email: ['', [CustomValidators.checkEmail, CustomValidators.required]],
      classification: ['', [CustomValidators.required]],
      mode: ['', [CustomValidators.required]],
      currency: ['', [CustomValidators.required]],
      thirdParty: [''],

    });
  }

  // @HostListener('document:keydown', ['$event'])
  // onKeyDownHandler(event: KeyboardEvent) {
  //     if (event.keyCode === 13) {
  //       event.preventDefault();
  //       if (!this.spinnerFlag) {
  //       this.addVendor();
  //       }
  //     }
  // }

  addVendor() {
    this.spinnerFlag = true;
    this.submitVendorForm = true;
    if (this.manageVendorForm.valid) {
      this.disableButton = true ;
      let formvalue = this.manageVendorForm.value;
      formvalue['langCode'] = this.sessionService.getCookie(COOKIES_CONSTANTS.langCode);
      formvalue['commercial'] = this.selectedCommercialCategories;
      formvalue['entertainment'] = this.selectedEntertainmentCategories;
      formvalue['corporate'] = this.selectedCorporateCategories;
      let finalVendorData = ManageVendorData.getFormDetailsData(formvalue);
      this.addvendorService._addVendor(finalVendorData).subscribe((result: any) => {
        // if (result.header.statusCode == 601){
        //   this.disableButton = false ;
        //   this.spinnerFlag = false;
        //   this.toastrService.error(result.header.message);
        // }
        if (Common.checkStatusCodeInRange(result.header.statusCode)) {
          this.disableButton = false ;
          this.spinnerFlag = false;
          this.toastrService.success(result.header.message);
          // this.router.navigate([ROUTER_LINKS_FULL_PATH.vendors]);
          this.navigationService.navigate(ROUTER_LINKS_FULL_PATH.vendors);
        } else{
          this.disableButton = false ;
          this.spinnerFlag = false;
          if(result.header.message){
            this.toastrService.error(result.header.message);
          }

        }
      }, error => {
        this.spinnerFlag = false;
        this.disableButton = false ;
        this.toastrService.error(this.commonLabels.errorMessages.responseError);
      },);
      // let vendorArr = this.sharedData.getModulesData('vendors');
      // if (!vendorArr)
      //   vendorArr = [];
      // vendorArr.push(finalVendorData);
      // this.sharedData.setModulesData('vendors', vendorArr);
      // this.router.navigate([ROUTER_LINKS_FULL_PATH.vendors]);
    }
    else {
      let target;
       for (var i in this.manageVendorForm.controls) {
         if(!this.manageVendorForm.controls[i].valid) {
           target = this.manageVendorForm.controls[i];
           break;
         }
       }
       if(target) {
         this.spinnerFlag = false;

         let el = $('.ng-invalid:not(form):first');
         $('html,body').animate({scrollTop: (el.offset().top - 100)}, 'slow', () => {
           el.focus();
         });
       }

    }
  }

  /** 
   * Convert email to lowercase and trim value of email field
  */
  changeEmailFormat() {
    const emailVal = this.manageVendorForm.value.email;
    if (emailVal) {
      const email = emailVal.toLowerCase().trim();
      this.manageVendorForm.patchValue({
        email: email
      });
    }
  }


  getProjectCategory() {
    this._http.get('../assets/i18n/project-category.json').subscribe(
      (data: any) => {
        this.categoriesList = data.entertainment.category;
        this.accountList = data.entertainment.account;
        this.subAccountList = data.entertainment.subAccount;
        this.commercialCategory = data.commericial.category;
        this.commericialAccount = data.commericial.account;
        this.corporateCategory = data.corporate.category;
        this.corporateAccount = data.corporate.account;
      },

    );
  }
  // getProjectTypes() {
  //   this._sharedService.getProjectTypes().subscribe((response: any) => {
  //     if (Common.checkStatusCode(response.header.statusCode)) {
  //       this.projectTypes = response.payload.results;
  //       this.getProjectCategories(this.projectTypes);
  //     } else {
  //       this.projectTypes = [];
  //     }
  //   });
  // }

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
      if (commercialCategories) {
        if (commercialCategories.payload && commercialCategories.payload.results) {
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
      if (entertainmentCategories) {
        if (entertainmentCategories.payload && entertainmentCategories.payload.results) {
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
    }, error =>{
      this.showLoadingFlg = false;
    })
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
      switch(tabIndex) {
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
    if(typeArr) {
      switch (nodeType) {
        case "subAccount":
                          if(typeArr[catId] && typeArr[catId]['accounts'] && typeArr[catId]['accounts'][accountId]['subAccounts']) {
                            let subAccountTotalCount = typeArr[catId]['accounts'][accountId]['subAccounts']['count'];
                            let subAccountsArr = typeArr[catId]['accounts'][accountId]['subAccounts'];
                            let selectedSubAccountsCount = 0;
                            for(let key in subAccountsArr) {
                              if(key!='count') {
                                if($('.id_' + key).hasClass('selected-category')) {
                                  selectedSubAccountsCount++;
                                }
                              }
                            }
                            if(selectedSubAccountsCount == subAccountsArr.count) {
                              $('.id_' + accountId).addClass('selected-category');
                              let selectedAccountsCount = 0;
                              let accountsArr = typeArr[catId]['accounts'];
                              for(let key in accountsArr) {
                                if(key!='count') {
                                  if($('.id_' + key).hasClass('selected-category')) {
                                    selectedAccountsCount++;
                                  }
                                }
                              }
                              if(selectedAccountsCount == accountsArr.count) {
                                $('.id_' + catId).addClass('selected-category');
                              }
                            }
                          }

                          break;

        case "account":
                        let selectedAccountsCount = 0;
                        if(typeArr[catId] && typeArr[catId]['accounts']) {
                          let accountsArr = typeArr[catId]['accounts'];
                          for(let key in accountsArr) {
                            if(key!='count') {
                              if($('.id_' + key).hasClass('selected-category')) {
                                selectedAccountsCount++;
                              }
                            }
                          }
                          if(selectedAccountsCount == accountsArr.count) {
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
        _.forEach(filteredData.accounts, function(obj) {
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
    /**
  **  method to show/hide floating buttons on window scroll after timeout of 50 ms
  **/
 showHideFloatingButtons(time) {
  setTimeout(() => {
    this.onWindowScroll();
  }, time);
}
}
