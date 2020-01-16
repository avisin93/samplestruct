/**
* Component     : ManageIndividualComponent
* Author        : Boston Byte LLC
* Creation Date : 19th April, 2019
*/

import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { CustomValidators } from '@app/common/custom-validators';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  ROUTER_LINKS, CLASSIFICATION, ROUTER_LINKS_FULL_PATH, CURRENCY_CONSTANTS, OPERATION_TYPES_ARR,
  PROJECT_TYPES, ACCEPT_ATTACHMENT_FILE_FORMATS, COOKIES_CONSTANTS, MEDIA_SIZES, TALENT_TYPES, UI_ACCESS_PERMISSION_CONST
} from '@app/config';
import { ManageIndividualDataModel } from './manage-individual.data.model';
import { ActivatedRoute } from '@angular/router';
import { Common, SessionService, NavigationService } from '@app/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { SharedService } from '@app/shared/shared.service';
import * as _ from 'lodash';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { ManageIndividualService } from './manage-individual.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PROJECT_CATEGORY_TABS, FILE_TYPES } from '../../constants';
import { Subscription } from 'rxjs/Subscription';
const swal = require('sweetalert');
declare var $: any;
const URL = '';

@Component({
  selector: 'app-manage-individual',
  templateUrl: './manage-individual.component.html',
  styleUrls: ['./manage-individual.component.scss']
})
export class ManageIndividualComponent implements OnInit, OnDestroy {
  ROUTER_LINKS_FULL_PATH = ROUTER_LINKS_FULL_PATH;
  ROUTER_LINKS = ROUTER_LINKS;
  CLASSIFICATION = CLASSIFICATION;
  CURRENCY_CONSTANTS = CURRENCY_CONSTANTS;
  OPERATION_TYPES_ARR = OPERATION_TYPES_ARR;
  ACCEPT_ATTACHMENT_FILE_FORMATS = ACCEPT_ATTACHMENT_FILE_FORMATS;
  UI_ACCESS_PERMISSION_CONST = UI_ACCESS_PERMISSION_CONST;
  manageIndividualForm: FormGroup;
  submitIndividualForm = false;
  showFloatingBtn = true;
  individualID: any;
  rowIndex: any;
  individualDetails: any;
  categoriesList: any;
  accountList: any;
  commercialCategory: any;
  subAccountList: any;
  commericialAccount: any;
  selectedCommercialCategories = [];
  selectedEntertainmentCategories = [];
  selectedCorporateCategories = [];
  commercialCategoriesArr: any = [];
  entertainmentCategoriesArr: any = [];
  corporateCategory: any;
  corporateAccount: any;
  individualArr: any = [];
  add_input_error = false;
  submmitedFormFlag = false;
  showLoadingFlg: Boolean = false;
  showSpinnerFlg: Boolean = false;
  checkContractAttachments: Boolean = false;
  enableSaveButtonFlag: Boolean = true;
  showBrowseButton: Boolean = false;
  url?: string;
  renderPage = false;
  TALENT_TYPES_ARR = TALENT_TYPES;
  TALENT_TYPES_OBJ: any = Common.keyValueDropdownArr(TALENT_TYPES, 'text', 'id');
  agencyNamesArr: any[] = [];
  individualNamesArr: any[] = [];
  commonLabelObj: any;
  documents: any = {
    contractAttachmentsDocs: []
  };
  tabs = [
    { name: 'actors.freelancers.labels.commercial', categories: [], selectedCategories: [] },
    { name: 'actors.freelancers.labels.entertainment', categories: [], selectedCategories: [] }
  ];
  public contractAttachments: FileUploader = new FileUploader({ url: URL });
  operationTypesArr: any;
  filesCounter: number;
  filesReceived: number;
  commonLabelsObj: any;
  public searchTypedAgencyName = new BehaviorSubject<string>('');
  public searchTypedIndividualName = new BehaviorSubject<string>('');
  agencyNameSubscription: Subscription;
  individualNameSubscription: Subscription;

  MANAGE_INDIVIDUAL_QUERY_PARAMS = {
    'name': 'name',
    'id': 'id'
  };
  spinnerFlag = false;
  breadcrumbData: any = {
    title: 'talent.individuals.labels.addIndividual',
    subTitle: 'talent.individuals.labels.addIndividualSubTitle',
    data: [{
      text: 'common.labels.home',
      link: '/'
    },
    {
      text: 'talent.individuals.labels.individuals',
      link: ROUTER_LINKS_FULL_PATH.individual
    },
    {
      text: 'talent.individuals.labels.addIndividual',
      link: ''
    }
    ]
  };
  isLoadingIndividualName: boolean;
  isLoadingAgencyName: boolean;
  common: any;
  constructor(private fb: FormBuilder,
    public _http: HttpClient,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private _sharedService: SharedService,
    private sessionService: SessionService,
    private navigationService: NavigationService,
    private _ManageIndividualService: ManageIndividualService) { }

  ngOnInit() {
    this.setLocaleObj();
    this.getDropdownValues();
    this.createAddForm();
    this.getProjectCategories();
    this.route.params.subscribe(params => {
      this.individualID = params['id'];
      if (this.individualID) {
        this.getIndividualData(this.individualID);
        this.breadcrumbData.title = 'talent.individuals.labels.editIndividual';
        this.breadcrumbData.subTitle = 'talent.individuals.labels.editIndividualSubTitle';
        this.breadcrumbData.data[2].text = 'talent.individuals.labels.editIndividual';
      } else {
        this.renderPage = true;
        this.detectChangedInput();
      }
    });
    this.translateService.get('common').subscribe((res: string) => {
      this.commonLabelObj = res;
    });
  }

  ngOnDestroy() {
    if (this.individualNameSubscription) {
      this.individualNameSubscription.unsubscribe();
    }
    if (this.agencyNameSubscription) {
      this.agencyNameSubscription.unsubscribe();
    }
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    this.onWindowScroll();
  }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.renderPage) {
      this.showFloatingBtn = Common.isInView($('#fixed-btn')) ? false : true;
    }
  }
  /**
   * Submit form on enter key press
   * @param event as key event
   */
  // @HostListener('document:keydown', ['$event'])
  // onKeyDownHandler(event: KeyboardEvent) {
  //   if (event.keyCode === 13) {
  //     event.preventDefault();
  //     if (this.enableSaveButtonFlag) {
  //       this.saveIndividual();
  //     }
  //   }
  // }
  /**
 * gets translated values of labels
 */
  setLocaleObj() {
    this.translateService.get('common').subscribe(res => {
      this.commonLabelsObj = res;
    });
  }
  createAddForm() {
    this.manageIndividualForm = this.addManageIndividualFormGroup();
  }

  /**
   * It detects change in organizations and contact persons dropdoen search
   */
  detectChangedInput() {
    this.agencyNameSubscription = this.searchTypedAgencyName
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe((str) => this.getAgencyList(str));

    this.individualNameSubscription = this.searchTypedIndividualName
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe((str) => this.getIndividualList(str));
  }
  /**
   * It gets list of organization names from the server matching with str
   * @param str received string to be searched
   */
  getAgencyList(str?) {
    this.isLoadingAgencyName = true;
    this.agencyNamesArr = [];
    this._ManageIndividualService.getAgencyFilterList(this.getSearchQueryParam(str)).subscribe((response: any) => {
      if (Common.checkStatusCode(response.header.statusCode)) {
        this.agencyNamesArr = Common.getMultipleSelectArr(response.payload.results, ['id'], ['i18n', 'displayName']);
        this.isLoadingAgencyName = false;
      } else {
        this.agencyNamesArr = [];
        this.isLoadingAgencyName = false;
      }
    },
      error => {
        this.agencyNamesArr = [];
        this.isLoadingAgencyName = false;
        this.toastrService.error(this.commonLabelsObj.errorMessages.error);
      });
  }
  /**
   * It gets list of organization names from the server matching with str
   * @param str received string to be searched
   */
  getIndividualList(str?) {
    this.individualNamesArr = [];
    this.isLoadingIndividualName = true;
    this._ManageIndividualService.getIndividualFilterList(this.getSearchQueryParam(str, true)).subscribe((response: any) => {
      if (Common.checkStatusCode(response.header.statusCode)) {
        this.individualNamesArr = Common.getMultipleSelectArr(response.payload.results, ['id'], ['i18n', 'displayName']);
        this.isLoadingIndividualName = false;
      } else {
        this.individualNamesArr = [];
        this.isLoadingIndividualName = false;
      }
    },
      error => {
        this.individualNamesArr = [];
        this.isLoadingIndividualName = false;
        this.toastrService.error(this.commonLabelsObj.errorMessages.error);
      });

  }
  /**
  * It gets all search querry parameters from the filter form and returns it.
  */
  getSearchQueryParam(str, setSelfId: boolean = false) {
    let params: HttpParams = new HttpParams();
    if (str) {
      params = params.append(this.MANAGE_INDIVIDUAL_QUERY_PARAMS.name, str.trim());
    }
    if (setSelfId) {
      params = params.append(this.MANAGE_INDIVIDUAL_QUERY_PARAMS.id, this.individualID);
    }
    return params;
  }
  getIndividualData(id) {
    this.showLoadingFlg = true;
    this._ManageIndividualService.getIndividualData(id).subscribe((response: any) => {
      this.showLoadingFlg = false;
      this.renderPage = true;
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        this.individualDetails = ManageIndividualDataModel.getFormDetailsData(response.payload.result);
        this.manageIndividualForm.setValue(this.individualDetails.mainDetails);
        this.searchResultsWithSelectedAgencyOrIndividualName();
        this.detectChangedInput();
        this.updateCategories(this.individualDetails.otherData);
        this.updateContractsData(this.individualDetails.otherData);
      } else {
        this.toastrService.error(response.header.message);
      }
    }, error => {
      this.showLoadingFlg = false;
      this.toastrService.error(this.commonLabelsObj.errorMessages.error);
      this.renderPage = true;
    });
  }
  searchResultsWithSelectedAgencyOrIndividualName() {
    if (this.individualDetails.mainDetails.referredAgencyDisplayName) {
      this.searchTypedAgencyName.next(this.individualDetails.mainDetails.referredAgencyDisplayName.trim());
    }
    if (this.individualDetails.mainDetails.referredIndividualDisplayName) {
      this.searchTypedIndividualName.next(this.individualDetails.mainDetails.referredIndividualDisplayName.trim());
    }
  }
  talentTypeChanged() {
    this.manageIndividualForm.controls['referredAgencyName'].reset();
    this.manageIndividualForm.controls['referredIndividualName'].reset();
  }
  updateContractsData(contractsData) {
    this.documents.contractAttachmentsDocs = contractsData.contractAttachmentsIds;
    this.contractAttachments.queue = [];
    const filesArr = contractsData.contractAttachments;
    if (filesArr) {
      for (let index = 0; index < filesArr.length; index++) {
        if (filesArr[index] && filesArr[index].name) {
          const file = new File([''], filesArr[index].name);
          const fileItem = new FileItem(this.contractAttachments, file, {});
          this.contractAttachments.queue.push(fileItem);
          this.contractAttachments.queue[index].url = filesArr[index].url;
        }
      }
    }
  }
  updateCategories(categoriesDetails) {
    this.selectedCommercialCategories = categoriesDetails.selectedCommercialCategories;
    this.selectedEntertainmentCategories = categoriesDetails.selectedEntertainmentCategories;
    const localThis = this;
    setTimeout(function () {
      localThis.showSelectedCategories(categoriesDetails);
    }, 2000);
  }
  showSelectedCategories(categoriesDetails) {
    categoriesDetails.commercial.forEach((obj, index) => {
      const mappingIdsArr = obj.mappingIds;
      this.addClass('.id_' + mappingIdsArr[0]);
      this.showAlreadySelectedItems(this.commercialCategoriesArr, mappingIdsArr);
    });
    categoriesDetails.entertainment.forEach((obj, index) => {
      const mappingIdsArr = obj.mappingIds;
      this.addClass('.id_' + mappingIdsArr[0]);
      this.showAlreadySelectedItems(this.entertainmentCategoriesArr, mappingIdsArr);
    });
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
  showAlreadySelectedItems(typeArr, mappingIdsArr) {
    const length = mappingIdsArr.length;
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
  /**
   * individual Formgroup definition
   */
  addManageIndividualFormGroup(): FormGroup {
    return this.fb.group({
      id: [''],
      firstName: ['', [CustomValidators.required]],
      lastName: ['', [CustomValidators.required]],
      email: ['', [CustomValidators.checkEmail, CustomValidators.required]],
      address: [''],
      phone: ['', [CustomValidators.required]],
      referredBy: [this.TALENT_TYPES_OBJ.agency],
      referredAgencyName: [''],
      referredIndividualName: [''],
      accountName: [''],
      accNumber: [''],
      bankName: [''],
      branch: [''],
      clabe: [''],
      taxId: [''],
      bankAddress: [''],
      modeOfOperation: [''],
      currency: [''],
      referredAgencyDisplayName: [''],
      referredIndividualDisplayName: ['']

    });
  }

  /**
   * Transform email input to lower case
   */
  transformToLowerCase() {
    const formvalue = this.manageIndividualForm.value;
    const typeLowercase = formvalue.email.toLowerCase();
    this.manageIndividualForm.patchValue({
      email: typeLowercase
    });
  }

  /**
  * It gets operation type dropdown values
  */
  getDropdownValues() {
    this.operationTypesArr = Common.changeDropDownValues(this.translateService, OPERATION_TYPES_ARR);
  }

  /**
   * Posts/SUbmits individual record
   */
  saveIndividual() {
    this.submitIndividualForm = true;
    if (this.manageIndividualForm.valid) {
      this.showSpinnerFlg = true;
      this.enableSaveButtonFlag = false;
      const formvalue = this.manageIndividualForm.value;
      formvalue['langCode'] = this.sessionService.getCookie(COOKIES_CONSTANTS.langCode);
      formvalue['commercial'] = this.selectedCommercialCategories;
      formvalue['entertainment'] = this.selectedEntertainmentCategories;
      const finalindividualData = ManageIndividualDataModel.getWebServiceDetailsData(formvalue, this.documents.contractAttachmentsDocs);
      if (this.individualID) {
        this._ManageIndividualService.editIndividualData(finalindividualData).subscribe((response: any) => {
          this.checkResponseAndRoute(response);
        }, error => {
          this.handleError();
        });
      } else {
        this._ManageIndividualService.addIndividualData(finalindividualData).subscribe((response: any) => {
          this.checkResponseAndRoute(response);
        }, error => {
          this.handleError();
        });
      }
    }
    else {
      Common.scrollToInvalidControl(this, this.manageIndividualForm, 'showLoadingFlg');
    }
  }
  checkResponseAndRoute(response) {
    this.showSpinnerFlg = false;
    this.enableSaveButtonFlag = true;
    if (Common.checkStatusCodeInRange(response.header.statusCode)) {
      this.navigationService.navigate(ROUTER_LINKS_FULL_PATH.individual).then(() =>
        this.toastrService.success(response.header.message)
      );
    } else {
      this.toastrService.error(response.header.message);
    }
  }
  handleError() {
    this.enableSaveButtonFlag = true;
    this.showSpinnerFlg = false;
    this.toastrService.error(this.commonLabelsObj.errorMessages.error);
  }

  /**
   * Set Project category tree structure
   */
  getProjectCategories() {
    this.showLoadingFlg = true;
    let params: HttpParams = new HttpParams();
    params = params.append('forTalent', 'true');
    const combined = Observable.forkJoin(
      this._sharedService.getProjectCategories(PROJECT_TYPES.commercial, params),
      this._sharedService.getProjectCategories(PROJECT_TYPES.entertainment, params)
    );
    combined.subscribe((latestValues: any) => {
      this.showLoadingFlg = false;

      const commercialCategories: any = latestValues[0];
      const entertainmentCategories: any = latestValues[1];
      /*commertial categories response response*/
      if (commercialCategories) {
        if (commercialCategories.payload && commercialCategories.payload.results) {
          this.tabs[PROJECT_CATEGORY_TABS.commercial].categories = commercialCategories.payload.results;
          const commercialKeyArrObj = [];
          const commercialCategoriesArr = this.tabs[PROJECT_CATEGORY_TABS.commercial].categories;
          for (let categoryIndex = 0; categoryIndex < commercialCategoriesArr.length; categoryIndex++) {
            const categoryId = commercialCategoriesArr[categoryIndex]['id'];
            commercialKeyArrObj[categoryId] = [];
            commercialKeyArrObj[categoryId]['accounts'] = [];
            if (commercialCategoriesArr[categoryIndex]['accounts']) {
              commercialKeyArrObj[categoryId]['count'] = commercialCategoriesArr[categoryIndex]['accounts'].length;
              commercialKeyArrObj[categoryId]['accounts']['count'] = commercialCategoriesArr[categoryIndex]['accounts'].length;
              for (let accountIndex = 0; accountIndex < commercialCategoriesArr[categoryIndex]['accounts'].length; accountIndex++) {
                const accountId = commercialCategoriesArr[categoryIndex]['accounts'][accountIndex]['id'];
                commercialKeyArrObj[categoryId]['accounts'][accountId] = [];
                commercialKeyArrObj[categoryId]['accounts'][accountId]['subAccount'] = [];
                if (commercialCategoriesArr[categoryIndex]['accounts'][accountIndex]['accounts']) {
                  commercialKeyArrObj[categoryId]['accounts'][accountId]['subAccount']['count'] = commercialCategoriesArr[categoryIndex]['accounts'][accountIndex]['accounts'].length;
                  for (let subAccountIndex = 0; subAccountIndex < commercialCategoriesArr[categoryIndex]['accounts'][accountIndex]['accounts'].length; subAccountIndex++) {
                    const subAccountId = commercialCategoriesArr[categoryIndex]['accounts'][accountIndex]['accounts'][subAccountIndex]['id'];
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
          this.tabs[PROJECT_CATEGORY_TABS.entertainment].categories = entertainmentCategories.payload.results;

          const entertainmentKeyArrObj = [];
          const entertainmentCategoriesArr = this.tabs[PROJECT_CATEGORY_TABS.entertainment].categories;
          for (let categoryIndex = 0; categoryIndex < entertainmentCategoriesArr.length; categoryIndex++) {
            const categoryId = entertainmentCategoriesArr[categoryIndex]['id'];
            entertainmentKeyArrObj[categoryId] = [];
            entertainmentKeyArrObj[categoryId]['accounts'] = [];
            if (entertainmentCategoriesArr[categoryIndex]['accounts']) {
              entertainmentKeyArrObj[categoryId]['count'] = entertainmentCategoriesArr[categoryIndex]['accounts'].length;
              entertainmentKeyArrObj[categoryId]['accounts']['count'] = entertainmentCategoriesArr[categoryIndex]['accounts'].length;
              for (let accountIndex = 0; accountIndex < entertainmentCategoriesArr[categoryIndex]['accounts'].length; accountIndex++) {
                const accountId = entertainmentCategoriesArr[categoryIndex]['accounts'][accountIndex]['id'];
                entertainmentKeyArrObj[categoryId]['accounts'][accountId] = [];
                entertainmentKeyArrObj[categoryId]['accounts'][accountId]['subAccounts'] = [];
                if (entertainmentCategoriesArr[categoryIndex]['accounts'][accountIndex]['accounts']) {
                  entertainmentKeyArrObj[categoryId]['accounts'][accountId]['subAccounts']['count'] = entertainmentCategoriesArr[categoryIndex]['accounts'][accountIndex]['accounts'].length;
                  for (let subAccountIndex = 0; subAccountIndex < entertainmentCategoriesArr[categoryIndex]['accounts'][accountIndex]['accounts'].length; subAccountIndex++) {
                    const subAccountId = entertainmentCategoriesArr[categoryIndex]['accounts'][accountIndex]['accounts'][subAccountIndex]['id'];
                    entertainmentKeyArrObj[categoryId]['accounts'][accountId]['subAccounts'][subAccountId] = [];
                  }
                }
              }
            }
          }
          this.entertainmentCategoriesArr = entertainmentKeyArrObj;
        }
      }
      const self = this;
      self.showHideFloatingButtons(500);
    }, error => {
      this.showLoadingFlg = false;
    });
  }

  /**
   * Method to select project category
   * @param categoryId as string
   * @param tabIndex as string
   * @param selector as string
   * @param isLeafNode as string
   * @param parentId as string
   * @param nodeType as strin
   */
  selectCategories(categoryId, tabIndex, selector, isLeafNode, parentId: any = '', nodeType: any = '') {
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

    const catId = $('.' + selector + categoryId).parent().attr('cat');
    const accountId = $('.' + selector + categoryId).parent().attr('account');
    const subAccountId = $('.' + selector + categoryId).parent().attr('subAccount');

    if ($('.' + selector + categoryId).hasClass('selected-category')) {
      let type;
      switch (tabIndex) {
        case 0: type = this.commercialCategoriesArr;
          break;

        case 1: type = this.entertainmentCategoriesArr;
          break;

      }

      this.checkAllChildNodesSelectedOrNot(type, nodeType, catId, accountId, subAccountId);
    } else {
      switch (nodeType) {
        case 'subAccount':
          $('.id_' + catId).removeClass('selected-category');
          $('.id_' + accountId).removeClass('selected-category');
          break;
        case 'account':
          $('.id_' + catId).removeClass('selected-category');
          break;
      }
    }
  }

  /**
   * CHecks chil elements selection
   * @param typeArr as String
   * @param nodeType as String
   * @param catId as String
   * @param accountId as String
   * @param subAccountId as String
   */
  checkAllChildNodesSelectedOrNot(typeArr, nodeType, catId, accountId, subAccountId) {
    if (typeArr) {
      switch (nodeType) {
        case 'subAccount':
          if (typeArr[catId] && typeArr[catId]['accounts'] && typeArr[catId]['accounts'][accountId]['subAccounts']) {
            const subAccountTotalCount = typeArr[catId]['accounts'][accountId]['subAccounts']['count'];
            const subAccountsArr = typeArr[catId]['accounts'][accountId]['subAccounts'];
            let selectedSubAccountsCount = 0;
            for (const key in subAccountsArr) {
              if (key !== 'count') {
                if ($('.id_' + key).hasClass('selected-category')) {
                  selectedSubAccountsCount++;
                }
              }
            }
            if (selectedSubAccountsCount === subAccountsArr.count) {
              $('.id_' + accountId).addClass('selected-category');
              let selectedAccountsCount = 0;
              const accountsArr = typeArr[catId]['accounts'];
              for (const key in accountsArr) {
                if (key !== 'count') {
                  if ($('.id_' + key).hasClass('selected-category')) {
                    selectedAccountsCount++;
                  }
                }
              }
              if (selectedAccountsCount === accountsArr.count) {
                $('.id_' + catId).addClass('selected-category');
              }
            }
          }

          break;

        case 'account':
          let selectedAccountsCount = 0;
          if (typeArr[catId] && typeArr[catId]['accounts']) {
            const accountsArr = typeArr[catId]['accounts'];
            for (const key in accountsArr) {
              if (key !== 'count') {
                if ($('.id_' + key).hasClass('selected-category')) {
                  selectedAccountsCount++;
                }
              }
            }
            if (selectedAccountsCount === accountsArr.count) {
              $('.id_' + catId).addClass('selected-category');
            }
          }
          break;


      }
    }
  }

  addCatgories(tabIndex, categoryId) {
    const categories = this.tabs[tabIndex].selectedCategories;
    if (categories.includes(categoryId)) {
      const index = categories.indexOf(categoryId);
      categories.splice(index, 1);
    }
    else {
      categories.push(categoryId);
    }
  }

  /**
   * Selects leaf node
   * @param tabIndex as String
   * @param level3IdsArr as String
   * @param isParentSelected as String
   */
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

  /**
   * Selects all child nodes
   * @param categoryId as String
   * @param tabIndex as String
   * @param parentId as String
   * @param isParentSelected as String
   */
  selectAllChildren(categoryId, tabIndex, parentId, isParentSelected) {
    let filteredData: any;
    const localThis = this;
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
      const index = _.findIndex(this.tabs[tabIndex].categories, { 'id': parentId });
      if (index !== undefined) {
        filteredData = _.find(this.tabs[tabIndex].categories[index].accounts, { 'id': categoryId });
      }
      if (filteredData) {
        const level3IdsArr = _.map(filteredData.accounts, 'id');
        if (level3IdsArr) {
          localThis.selectLeafNodes(tabIndex, level3IdsArr, isParentSelected);
        }
      }
    }
  }

  /**
   * Removes uploaded files
   * @param index  as at which index file needs to be removed
   */
  removeFiles(index, item) {
    const swalObj = Common.swalConfirmPopupObj(this.commonLabelObj.labels.deleteAdvanceMsg, true, true);
    swal(swalObj, (isConfirm) => {
      if (isConfirm) {
        item.remove();
        this.documents.contractAttachmentsDocs.splice(index, 1);
      }
    });
  }

  addFiles(event) {
    this.enableSaveButtonFlag = false;
    this.checkDocumentValidation();
  }
  checkDocumentValidation() {
    this.filesCounter = 0;
    this.filesReceived = this.contractAttachments.queue.length;
    for (let i = 0; i < this.contractAttachments.queue.length; i++) {
      const filesize = this.contractAttachments.queue[i].file.size;
      if (filesize > MEDIA_SIZES.BYTES_10MB) {
        this.toastrService.error(this.commonLabelsObj.errorMessages.documentLessThan10);
        this.contractAttachments.queue[i].remove();
        i--;
        this.filesCounter++;
        if (this.filesCounter === this.filesReceived) {
          this.enableSaveButtonFlag = true;
        }
      }
      else {
        const file = this.contractAttachments.queue[i]._file;
        const type = Common.getFileType(file);
        if (!this.contractAttachments.queue[i].url && !this.contractAttachments.queue[i]['inProgress']) {
          if (!this.checkFileType(type)) {
            this.toastrService.error(this.commonLabelsObj.errorMessages.invalidFileType);
            this.contractAttachments.queue[i].remove();
            i--;
            this.filesCounter++;
            if (this.filesCounter === this.filesReceived) {
              this.enableSaveButtonFlag = true;
            }
          }
          else {
            const formData = Common.setFormData(file);
            this.contractAttachments.queue[i]['inProgress'] = true;
            this.uploadFile(formData, true, this.contractAttachments.queue[i], i);
          }
        } else {
          this.filesCounter++;
          if (this.filesCounter === this.filesReceived) {
            this.enableSaveButtonFlag = true;
          }
        }
      }
    }
  }

  checkFileType(filetype) {
    let validtype = _.find(FILE_TYPES, { 'type': filetype.toLowerCase() });
    if (validtype)
      return true;
    else
      return false;

  }
  /**
   * Sets uploaded documnt id in contract documents array
   */
  setDocumentId(documentId) {
    this.documents.contractAttachmentsDocs.push(documentId);
  }

  /**
   * Uploads Conrat file
   * @param formData as file data added in form
   * @param isDocument as flag
   * @param obj as file object
   * @param index as file index
   */
  uploadFile(formData, isDocument, obj: any = {}, index: any = 0) {
    this._sharedService.uploadFile(formData).subscribe((imageResponse: any) => {
      if (Common.checkStatusCode(imageResponse.header.statusCode)) {
        const data = imageResponse.payload.result;
        delete obj['inProgress'];
        if (isDocument) {
          obj.url = data.url;
          this.setDocumentId(data.id);
        }
      } else {
        if (imageResponse.header) {
          this.toastrService.error(imageResponse.header.message);
        } else {
          this.toastrService.error(this.commonLabelsObj.errorMessages.error);
        }
      }
      this.filesCounter++;
      if (this.filesCounter === this.filesReceived) {
        this.enableSaveButtonFlag = true;
      }
    },
      error => {
        this.toastrService.error(this.commonLabelsObj.errorMessages.error);
        this.showBrowseButton = true;
        this.filesCounter++;
        if (this.filesCounter === this.filesReceived) {
          this.enableSaveButtonFlag = true;
        }
      });
  }

  /**
   * Shows sub menu
   * @param id as parent id
   * @param type as string
   * @param e as event
   */
  subMenuShow(id, type, e) {
    e.stopPropagation();
    if (type === 'show') {
      $('.sub-category_' + id).show();
      $('.sub-sub-category_' + id).show();
      $('.category-plus.category_' + id).hide();
      $('.category-minus.category_' + id).show();
      $('.category-plus_' + id).hide();
      $('.category-minus_' + id).show();
    } else {
      $('.sub-category_' + id).hide();
      $('.sub-sub-category_' + id).hide();
      $('.category-plus.category_' + id).show();
      $('.category-minus.category_' + id).hide();
    }
  }

  /**
 * Shows sub sub menu
 * @param id as parent id
 * @param type as string
 * @param e as event
 */
  subSubMenuShow(id, type, e) {
    e.stopPropagation();
    if (type === 'show') {
      $('.sub-sub-category_' + id).show();
      $('.category-plus.category_' + id).hide();
      $('.category-minus.category_' + id).show();
    } else {
      $('.sub-sub-category_' + id).hide();
      $('.category-plus.category_' + id).show();
      $('.category-minus.category_' + id).hide();
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
