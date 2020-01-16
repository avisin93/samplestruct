import { Component, OnInit, HostListener, ViewEncapsulation } from '@angular/core';
import { CustomValidators } from '@app/common/custom-validators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ROUTER_LINKS, CURRENCY_CONSTANTS, OPERATION_TYPES_ARR, PROJECT_TYPES, COOKIES_CONSTANTS, MEDIA_SIZES } from '@app/config';
import { ManageAgencyData } from './manage-agency.data.model';
import { ActivatedRoute } from '@angular/router';
import { Common, SessionService, NavigationService } from '@app/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { SharedService } from '@app/shared/shared.service';
import * as _ from 'lodash';
import { FileUploader, FileItem } from 'ng2-file-upload';
import 'rxjs/add/observable/forkJoin';
import { ToastrService } from 'ngx-toastr';
import { AGENCY_ACCEPT_ATTACHMENT_FILE_FORMATS, PROJECT_CATEGORY_TABS, FILE_TYPES } from '../../constants';
import { ROUTER_LINKS_TALENT_FULL_PATH } from '../../talent.config';
import { ManageAgencyService } from './manage-agency.service';
const swal = require('sweetalert');
declare var $: any;
const URL = '';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'manage-agency',
  templateUrl: './manage-agency.component.html',
  styleUrls: ['./manage-agency.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ManageAgencyComponent implements OnInit {
  ROUTER_LINKS_TALENT_FULL_PATH = ROUTER_LINKS_TALENT_FULL_PATH;
  ROUTER_LINKS = ROUTER_LINKS;
  CURRENCY_CONSTANTS = CURRENCY_CONSTANTS;
  renderPage: Boolean = false;
  OPERATION_TYPES_ARR = OPERATION_TYPES_ARR;
  AGENCY_ACCEPT_ATTACHMENT_FILE_FORMATS = AGENCY_ACCEPT_ATTACHMENT_FILE_FORMATS;
  manageAgencyForm: FormGroup;
  submitAgencyForm = false;
  showFloatingBtn = true;
  agencyDetails: any;
  commercialCategory: any;
  commericialAccount: any;
  selectedCommercialCategories = [];
  selectedEntertainmentCategories = [];
  commercialCategoriesArr: any = [];
  entertainmentCategoriesArr: any = [];
  contractFileArray: any = [];
  showLoadingFlg: Boolean = false;
  checkContractAttachments: Boolean = false;
  enableSaveButtonFlag: Boolean = true;
  disableButton: Boolean = false;
  spinnerFlag: Boolean = false;
  totalAttachFileSize: any = 0;
  url?: string;
  operationTypesArr: any;
  filesCounter: number;
  filesReceived: number;
  commonLabelsObj: any;
  agencyId: any;
  agencyFormDetails: any;
  commonLabelObj: any;
  documents: any = {
    contractAttachmentsDocs: []
  };
  tabs = [
    { name: 'actors.freelancers.labels.commercial', categories: [], selectedCategories: [] },
    { name: 'actors.freelancers.labels.entertainment', categories: [], selectedCategories: [] }
  ];

  breadcrumbData: any = {
    title: 'talent.agency.labels.addAgencies',
    subTitle: 'talent.agency.labels.subMsgAgency',
    data: [{
      text: 'common.labels.home',
      link: '/'
    },
    {
      text: 'talent.agency.labels.agenciesList',
      link: ROUTER_LINKS_TALENT_FULL_PATH['agency']
    },
    {
      text: 'talent.agency.labels.addAgencies',
      link: ''
    }
    ]
  };
  public contractAttachments: FileUploader = new FileUploader({ url: URL });

  constructor(private fb: FormBuilder,
    public sessionService: SessionService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private _sharedService: SharedService,
    private _manageAgencyService: ManageAgencyService,
    private navigationService: NavigationService) {
  }
  ngOnInit() {
    Common.scrollTOTop();
    this.createAddForm();
    this.getProjectCategoriesData();
    this.getDropdownValues();
    this.route.params.subscribe(params => {
      this.agencyId = params.agencyId;
    });
    this.translateService.get('common').subscribe((res: string) => {
      this.commonLabelsObj = res;
    });
    if (this.agencyId) {
      this.breadcrumbData.title = 'talent.agency.labels.editAgencies';
      this.breadcrumbData.subTitle = 'talent.agency.labels.editAgencySubTitle';
      this.breadcrumbData.data[2].text = 'talent.agency.labels.editAgencies';
      this.getAgencyById();
    } else {
      this.renderPage = true;
    }
    this.translateService.get('common').subscribe((res: string) => {
      this.commonLabelObj = res;
    });
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    this.onWindowScroll();
  }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showFloatingBtn = Common.isInView($('#fixed-btn')) ? false : true;
  }
  createAddForm() {
    this.manageAgencyForm = this.addManageAgencyFormGroup();
  }


  /**
   * Agency Formgroup definition
   */
  addManageAgencyFormGroup(): FormGroup {
    return this.fb.group({
      companyName: ['', [CustomValidators.required]],
      legalName: ['', [CustomValidators.required]],
      email: ['', [CustomValidators.checkEmail, CustomValidators.required]],
      accNumber: [''],
      bankName: [''],
      branch: [''],
      clabe: [''],
      address: [''],
      bankaddress: [''],
      phone: ['', [CustomValidators.required]],
      taxID: [''],
      mode: [''],
      currency: [''],
      contractAttachments: [''],
      accountName: ['']

    });
  }

  /**
   * Submit form on enter key press
   * @param event as key event
   */
  // @HostListener('document:keydown', ['$event'])
  // onKeyDownHandler(event: KeyboardEvent) {
  //   if(event && event.target && event.target['tagName'] != "TEXTAREA") {
  //     if (event.keyCode === 13) {
  //       event.preventDefault();
  //       if (!this.disableButton && this.enableSaveButtonFlag) {
  //         this.saveAgency();
  //       }
  //     }
  //   }
  // }

  /**
   * Transform email input to lower case
   */
  transformToLowerCase() {
    const formvalue = this.manageAgencyForm.value;
    const typeLowercase = formvalue.email.toLowerCase();
    this.manageAgencyForm.patchValue({
      email: typeLowercase
    });
  }

  /**
  * It gets operation type dropdown values
  */
  getDropdownValues() {
    this.operationTypesArr = Common.changeDropDownValues(this.translateService, OPERATION_TYPES_ARR);
  }
  getAgencyById() {
    this._manageAgencyService.getAgencyData(this.agencyId).subscribe((response: any) => {
      if (Common.checkStatusCode(response.header.statusCode)) {
        this.agencyDetails = response.payload.result;
        this.agencyFormDetails = ManageAgencyData.getFormDetailsData(this.agencyDetails);
        this.setAgencyFormData(this.agencyFormDetails);
      } else {
        this.agencyFormDetails = '';
      }
    }, error => {
      this.agencyFormDetails = '';
    });

  }
  /**
   * Patches agency form data
   * @param agencyFormDetails as agency data
   */
  setAgencyFormData(agencyFormDetails) {
    this.selectedCommercialCategories = agencyFormDetails.selectedCommercialCategories;
    this.selectedEntertainmentCategories = agencyFormDetails.selectedEntertainmentCategories;
    setTimeout(function () {
      self.showSelectedCategories(agencyFormDetails);
    }, 1000);
    this.manageAgencyForm.patchValue({
      companyName: agencyFormDetails.companyName,
      legalName: agencyFormDetails.legalName,
      email: agencyFormDetails.email,
      accNumber: agencyFormDetails.accNumber,
      bankName: agencyFormDetails.bankName,
      branch: agencyFormDetails.branch,
      clabe: agencyFormDetails.clabe,
      address: agencyFormDetails.address,
      bankaddress: agencyFormDetails.bankaddress,
      phone: agencyFormDetails.phone,
      taxID: agencyFormDetails.taxID,
      mode: agencyFormDetails.mode,
      currency: agencyFormDetails.currency,
      accountName: agencyFormDetails.accountName
    });
    if (agencyFormDetails.contracts) {
      this.contractAttachments.queue = [];
      for (let i = 0; i < agencyFormDetails.contracts.length; i++) {
        const file = new File([''], agencyFormDetails.contracts[i].name);
        const fileItem = new FileItem(this.contractAttachments, file, {});
        this.contractAttachments.queue.push(fileItem);
        this.contractAttachments.queue[i].url = agencyFormDetails.contracts[i].url;
        this.setDocumentId(agencyFormDetails.contracts[i].fileId);
      }
    }
    const self = this;
    this.renderPage = true;
  }

  /**
   * SHows selected category data
   * @param userFormDetails as category data
   */
  showSelectedCategories(userFormDetails) {
    userFormDetails.commercial.forEach((obj, index) => {
      const mappingIdsArr = obj.mappingIds;
      $('.id_' + mappingIdsArr[0]).addClass('selected-category');
      this.showAlreadySelectedItems(this.commercialCategoriesArr, mappingIdsArr);
    });
    userFormDetails.entertainment.forEach((obj, index) => {
      const mappingIdsArr = obj.mappingIds;
      $('.id_' + mappingIdsArr[0]).addClass('selected-category');
      this.showAlreadySelectedItems(this.entertainmentCategoriesArr, mappingIdsArr);
    });
  }

  /**
   * Shows already selected categories
   * @param typeArr as type array
   * @param mappingIdsArr as mapped Ids
   */
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


  /**
   * Posts/SUbmits Agency record
   */
  saveAgency() {
    this.submitAgencyForm = true;
    if (this.manageAgencyForm.valid) {
      this.disableButton = true;
      this.spinnerFlag = true;
      const formvalue = this.manageAgencyForm.value;
      formvalue['langCode'] = this.sessionService.getCookie(COOKIES_CONSTANTS.langCode);
      formvalue['commercial'] = this.selectedCommercialCategories;
      formvalue['entertainment'] = this.selectedEntertainmentCategories;
      for (let i = 0; i < this.documents.contractAttachmentsDocs.length; i++) {
        const obj = { 'fileId': this.documents.contractAttachmentsDocs[i] };
        this.contractFileArray.push(obj);
      }
      const finalAgencyData = ManageAgencyData.getWebServiceDetailsData(formvalue, this.contractFileArray);
      if (!this.agencyId) {
        this._manageAgencyService.postAgencyData(finalAgencyData).subscribe((result: any) => {
          if (Common.checkStatusCodeInRange(result.header.statusCode)) {
            this.disableButton = false;
            this.spinnerFlag = false;
            this.toastrService.success(result.header.message);
            this.navigationService.navigate(ROUTER_LINKS_TALENT_FULL_PATH.agency);
          } else {
            this.disableButton = false;
            this.spinnerFlag = false;
            if (result.header.message) {
              this.toastrService.error(result.header.message);
            }
          }
        }, error => {
          this.spinnerFlag = false;
          this.disableButton = false;
          this.toastrService.error(this.commonLabelsObj.errorMessages.responseError);
        });
      } else {
        this._manageAgencyService.putAgencyData(this.agencyId, finalAgencyData).subscribe((response: any) => {
          if (Common.checkStatusCodeInRange(response.header.statusCode)) {
            this.disableButton = false;
            this.spinnerFlag = false;
            this.toastrService.success(response.header.message);
            this.navigationService.navigate(ROUTER_LINKS_TALENT_FULL_PATH.agency);
          } else {
            this.disableButton = false;
            this.spinnerFlag = false;
          }
        }, error => {
          this.disableButton = false;
          this.spinnerFlag = false;
        });
      }
    } else {
      Common.scrollToInvalidControl(this, this.manageAgencyForm, 'spinnerFlag');
    }
  }

  /**
   * Removes unslected categories from selection array
   * @param tabIndex as tab type
   * @param categoryId as category id
   */
  removeIdFromSelectionArr(tabIndex, categoryId) {
    switch (tabIndex) {
      case PROJECT_CATEGORY_TABS.commercial:
        if (this.selectedCommercialCategories.includes(categoryId)) {
          const index = this.selectedCommercialCategories.indexOf(categoryId);
          this.selectedCommercialCategories.splice(index, 1);
        }
        break;

      case PROJECT_CATEGORY_TABS.entertainment:
        if (this.selectedEntertainmentCategories.includes(categoryId)) {
          const index = this.selectedEntertainmentCategories.indexOf(categoryId);
          this.selectedEntertainmentCategories.splice(index, 1);
        }
        break;
    }
  }

  /**
  * Adds selected categories from selection array
  * @param tabIndex as tab type
  * @param categoryId as category id
  */
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
    }
  }


  /**
   * Set Project category tree structure
   */
  getProjectCategoriesData() {
    this.showLoadingFlg = true;
    let params: HttpParams = new HttpParams();
    params = params.append('forTalent', 'true');
    const combined = Observable.forkJoin(
      this._manageAgencyService.getProjectCategories(PROJECT_TYPES.commercial, params),
      this._manageAgencyService.getProjectCategories(PROJECT_TYPES.entertainment, params)
    );
    combined.subscribe((latestValues: any) => {
      this.showLoadingFlg = false;
      const commercialCategories: any = latestValues[0];
      const entertainmentCategories: any = latestValues[1];
      /*commertial categories response response*/
      if (commercialCategories) {
        if (commercialCategories.payload && commercialCategories.payload.results) {
          this.tabs[0].categories = commercialCategories.payload.results;
          const commercialKeyArrObj = [];
          const commercialCategoriesArr = this.tabs[0].categories;
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
          // this.entertainmentCategories = entertainmentCategories.payload.results;
          this.tabs[1].categories = entertainmentCategories.payload.results;

          const entertainmentKeyArrObj = [];
          const entertainmentCategoriesArr = this.tabs[1].categories;
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
      isClassPresent = $('.' + selector + categoryId).hasClass('selected-category');
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
          this.checkAllCategoriesNodes(tabIndex, isClassPresent, categoryId);
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
              if (key != 'count') {
                if ($('.id_' + key).hasClass('selected-category')) {
                  selectedSubAccountsCount++;
                }
              }
            }
            if (selectedSubAccountsCount == subAccountsArr.count) {
              $('.id_' + accountId).addClass('selected-category');
              let selectedAccountsCount = 0;
              const accountsArr = typeArr[catId]['accounts'];
              for (const key in accountsArr) {
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

        case 'account':
          let selectedAccountsCount = 0;
          if (typeArr[catId] && typeArr[catId]['accounts']) {
            const accountsArr = typeArr[catId]['accounts'];
            for (const key in accountsArr) {
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

  /**
   * Checks if all category nodes selected or not
   * @param tabIndex as String
   * @param isParentSelected as String
   * @param categoryId as String
   */
  checkAllCategoriesNodes(tabIndex, isParentSelected, categoryId) {
    const filteredData = _.find(this.tabs[tabIndex].categories, { 'id': categoryId });
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
  setIds(tabIndex, categoryId) {
    let selectedFlag = false;
    switch (tabIndex) {
      case 0:

        if (this.selectedCommercialCategories.includes(categoryId)) {
          const index = this.selectedCommercialCategories.indexOf(categoryId);
          this.selectedCommercialCategories.splice(index, 1);
          selectedFlag = false;
        }
        else {
          this.selectedCommercialCategories.push(categoryId);
          selectedFlag = true;
        }
        break;

      case 1:
        if (this.selectedEntertainmentCategories.includes(categoryId)) {
          const index = this.selectedEntertainmentCategories.indexOf(categoryId);
          this.selectedEntertainmentCategories.splice(index, 1);
          selectedFlag = false;
        }
        else {
          this.selectedEntertainmentCategories.push(categoryId);
          selectedFlag = true;
        }
        break;
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
              const level3IdsArr = _.map(obj.accounts, 'id');
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
      if (index != undefined) {
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
    this.totalAttachFileSize = 0;
    // tslint:disable-next-line:forin
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
        const type = this.getFileType(file, i);
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
            const formData = this.setFormData(file);
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
  /**
   * Sets uploaded documnt id in contract documents array
   */
  setDocumentId(documentId) {
    this.documents.contractAttachmentsDocs.push(documentId);
    // this.checkContractDocs();
  }

  /**
   * Checks file extension type
   * @param filetype as type of file
   */
  checkFileType(filetype) {
    const validtype = _.find(FILE_TYPES, { 'type': filetype.toLowerCase() });
    if (validtype) {
      return true;
    }
    else {
      return false;
    }
  }

  /**
   * Sets uploaded file in form data
   * @param file as uploaded file
   */
  setFormData(file) {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return formData;
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
        this.filesCounter++;
        if (this.filesCounter === this.filesReceived) {
          this.enableSaveButtonFlag = true;
        }
      });
  }

  /**
   * Returns file extension type
   * @param file as uploaded file
   * @param i as index
   */
  getFileType(file, i) {
    const fileNameArr = file.name.split('.');
    const type = fileNameArr[fileNameArr.length - 1];
    return type;
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
