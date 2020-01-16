/** 1.Import third party components
2. Import created modules
3. Import crated services
4. Import created classes
5. Import created constants **/
import { Component, OnInit, ViewEncapsulation, ViewChild, HostListener, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { TriggerService, Common, NavigationService } from '@app/common';
import { HttpParams } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs/Subscription';
import { IMyDrpOptions } from 'mydaterangepicker';
import { ModalDirective } from 'ngx-bootstrap';
import { SharedService } from '@app/shared/shared.service';
import { ManagePOListData } from './po-listing.data.model';
import { ListPOService } from './po-listing.service';
import { ACTION_TYPES, API_URL, LISTING_TYPE } from '@app/config';
import { SharedData } from '@app/shared/shared.data';
import * as _ from 'lodash';
import { ProjectsData } from '../../../../projects.data';
import {
  ROUTER_LINKS_FULL_PATH, UI_ACCESS_PERMISSION_CONST, ROLES_CONST, CustomTableConfig,
  EVENT_TYPES, CURRENCY_CONVERSION_CONST, defaultDateRangepickerOptions, PROJECT_TYPES,MODULE_ID as MODULE_IDs
} from '@app/config';
import {
  PO_APPROVAL_CONST, PO_STATUS_CONST, PO_FOR_TYPE_CONST, PAYMENT_STATUS_CONST, PO_FOR_TYPE_LABELS_CONST,
  PURCHASE_ORDER_CONST, PAYMENT_APPROVAL_CONSTANTS, ONHOLD_REASONS, REJECTION_REASONS, OTHER_REASONS, PO_FOR_SUPPLIER_LABELS_CONST
} from '../purchase-order.constants';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
declare var $: any;
const swal = require('sweetalert');

@Component({
  selector: 'app-po-listing',
  templateUrl: './po-listing.component.html',
  styleUrls: ['./po-listing.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PoListingComponent implements OnInit, OnDestroy, AfterViewInit {
  /*declare variables above constructor in sequence -imported constants,public variable,private variables*/
  @ViewChild('approvalStatusModal') public approvalStatusModal: ModalDirective;
  @ViewChild('paymentApprovalStatusModal') public paymentApprovalStatusModal: ModalDirective;
  @ViewChild('rejectModal') public rejectModal: ModalDirective;
  @ViewChild('reasonsModal') public reasonsModal: ModalDirective;
  MODULE_IDs=MODULE_IDs;
  showReasonMsg: Boolean = false;
  showRejectionReasonMsg: Boolean = false;
  showLoadingFlg = false;
  isSearchClicked = false;
  showOnholdMsg = false;
  showOnHoldReasons: Boolean = false;
  supplierDropDown: any = [];
  isLoadingSupplierName: Boolean = false;
  selected: Boolean = true;
  rejectionOthersText: any;
  public searchSupplierName = new BehaviorSubject<string>('');
  supplierNameSubscription: Subscription;
  submitRejection: Boolean = false;
  onholdOthersText: any;
  ROUTER_LINKS_FULL_PATH = ROUTER_LINKS_FULL_PATH;
  PO_APPROVAL_CONST = PO_APPROVAL_CONST;
  OTHER_REASONS = OTHER_REASONS;
  reasons: any = [];
  onholdResons: any = [];
  // PO_FOR_TYPE_CONST = PO_FOR_TYPE_CONST;
  PO_STATUS_CONST = PO_STATUS_CONST;
  PURCHASE_ORDER_CONST = PURCHASE_ORDER_CONST;
  LISTING_TYPE = LISTING_TYPE;
  PO_FOR_SUPPLIER_LABELS_CONST = PO_FOR_SUPPLIER_LABELS_CONST;
  PAYMENT_APPROVAL_CONSTANTS = PAYMENT_APPROVAL_CONSTANTS;
  myDateRangePickerOptions: IMyDrpOptions = defaultDateRangepickerOptions;
  purchaseOrders: any = [];
  subLocationData: any = {};
  subLocationObj: any = {};
  showRejectionOthersInput: Boolean = false;
  showOthersInput: Boolean = false;
  showRejectionReasons: Boolean = false;
  approvalHierarchyArr: any = [];
  MODULE_ID: any;
  uiAccessPermissionsObj: any;
  UI_ACCESS_PERMISSION_CONST = UI_ACCESS_PERMISSION_CONST;
  poListData: any;
  totalItems: any;
  userInfo: any;
  subscription: Subscription;
  currentCurrencyObj: any;
  purchaseOrderId: any = '';
  poFilterForm: FormGroup;
  reasonsForm: FormGroup;
  projectId: any;
  currencyValidationFlag: any;
  common: any;
  index: any = 1;
  purchaseOrderDetails: any = {};
  defaultCurrencyFlag: Boolean = true;
  PO_LIST_QUERY_PARAMS = {
    'name': 'name',

  };
  showMsg: Boolean = false;
  // ng2Table
  public page: any = 1;
  public rows: Array<any> = [];
  public totalRows: Array<any> = [];
  currentPage: any = CustomTableConfig.pageNumber;
  itemsPerPage: any = CustomTableConfig.pageSize;
  public maxSize: any = 5;
  public numPages: any = 1;
  public length: any = 0;
  purchaseOrderList: any;
  projectTypeId: String;
  loadingFlag: Boolean;
  poListDataObj: any = {
    all: {},
    pending: {},
    approved: {},
    rejected: {},
    cancelled: {}
  };
  rejectionReason: String = '';
  statusType: any = '';
  budgetId = '';
  showReasonBox: Boolean = false;
  submitOnhold: Boolean = false;
  statusKeyArr: any = Common.keyValueDropdownArr(PO_STATUS_CONST, 'id', 'text');
  paymentStatusKeyArr: any = Common.keyValueDropdownArr(PAYMENT_STATUS_CONST, 'id', 'text');
  typeKeyArr: any = Common.keyValueDropdownArr(PO_FOR_TYPE_LABELS_CONST, 'id', 'text');
  supplierKeyArr: any = Common.keyValueDropdownArr(PO_FOR_SUPPLIER_LABELS_CONST, 'id', 'text');
  onHoldReasonsKeyArr: any = Common.keyValueDropdownArr(ONHOLD_REASONS, 'id', 'text');
  rejectionReasonsKeyArr: any = Common.keyValueDropdownArr(REJECTION_REASONS, 'id', 'text');
  PO_FOR_TYPE_CONST: { id: number; text: string; }[];
  paymentApprovalHierarchyArr: any;
  paymentRejectionReason: any = '';
  showPopUpLoadingFlag: Boolean = false;
  paymentRejectionFlag: Boolean = false;
  approverArr: any;
  poPendingReasonArr: any;
  poRejectionReasonArr: any;
  ACTION_TYPES = ACTION_TYPES;
  approvedSpinnerFlag: Boolean = false;
  submitSpinnerFlag: Boolean = false;
  disableButtonFlag: Boolean = false;
  onHoldReasons: any = [];
  rejectionReasons: any = [];
  showReasonsBox: Boolean = false;
  showOthersReason: Boolean = false;
  showSelectAtLeastOneReasonMsg: Boolean = false;
  submittedReasonFlag: Boolean = false;
  otherReason: String = '';
  selectedStatus: String = '';
  reasonsArr = [];
  PROJECT_TYPES = PROJECT_TYPES;
  supplierDropDownArr: any;
  poApprovalHierarchyURL: any = {
    approveUrl: API_URL.approvePo,
    rejectUrl: API_URL.rejectPo,
    onHoldUrl: API_URL.onhold
  };
  permissionObj: any = {};
  /*declare variables above constructor in sequence -imported constants,public variable,private variables*/
  // manageFreelancerPO
  /*inicialize contsructor after declaration of all variables*/
  constructor(
    private router: NavigationService,
    private sharedData: SharedData,
    private route: ActivatedRoute,
    private _poListService: ListPOService,
    private translateService: TranslateService,
    private toastrService: ToastrService,
    private triggerService: TriggerService,
    private projectsData: ProjectsData,
    private fb: FormBuilder,
    private _sharedService: SharedService
  ) {
    this.statusKeyArr.push('autoapproved');
  }
  /*inicialize contsructor after declaration of all variables*/

  /*all life cycle events whichever required after inicialization of constructor*/
  ngOnInit() {
    this.getLocalizedResons();
    Common.scrollTOTop();
    this.projectId = this.projectsData.projectId;
    this.budgetId = this.projectsData.budgetId;
    this.checkDefaultCurrencyAdded();
    this.setPermissionsDetails();
    this.getAllPOs([PO_APPROVAL_CONST.pending, PO_APPROVAL_CONST.approved, PO_APPROVAL_CONST.rejected]);
    this.translateFunc();
    this.createPOFilterForm();
    this.createReasonsForm();
    this.getDropdownValues();
    this.userInfo = this.sharedData.getUsersInfo();
    this.subscription = this.triggerService.getEvent().subscribe((data) => {
      if (data.event) {
        if (data.event.type && (data.event.type === EVENT_TYPES.currencyEvent)) {
          this.currentCurrencyObj = data.event.currentValue;
        }
        if (data.event.type === EVENT_TYPES.approve) {
          const currentValue = data.event.currentValue;
          if (currentValue.list === LISTING_TYPE.purchaseOrder) {
            this.approvalStatusModal.hide();
            this.purchaseOrderList = [];
            this.getAllPOs([PO_APPROVAL_CONST.approved, PO_APPROVAL_CONST.pending]);
          }
        }
        if (data.event.type === EVENT_TYPES.onHold) {
          const currentValue = data.event.currentValue;
          if (currentValue.list === LISTING_TYPE.purchaseOrder) {
            this.approvalStatusModal.hide();
            this.purchaseOrderList = [];
            this.getAllPOs([PO_APPROVAL_CONST.pending]);
          }
        }
        if (data.event.type === EVENT_TYPES.reject) {
          const currentValue = data.event.currentValue;
          if (currentValue.list === LISTING_TYPE.purchaseOrder) {
            this.approvalStatusModal.hide();
            this.purchaseOrderList = [];
            this.getAllPOs([PO_APPROVAL_CONST.rejected, PO_APPROVAL_CONST.pending]);
          }
        }
      }
    });

    this.setEventType({ type: EVENT_TYPES.currencyResetEvent, prevValue: {}, currentValue: true });
    this.detectChangedInput();
    this.getSupplierList();
  }
  getDropdownValues() {
    this.PO_FOR_TYPE_CONST = Common.changeDropDownValues(this.translateService, PO_FOR_TYPE_CONST);
  }
  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.approvalStatusModal.hide();
      this.paymentApprovalStatusModal.hide();
      this.rejectModal.hide();
      this.reasonsModal.hide();
    }
    if (event.keyCode === 13) {
      if (!this.approvalStatusModal.isShown && !this.paymentApprovalStatusModal.isShown) {
        event.preventDefault();
        this.search();
      }

    }
  }
  ngAfterViewInit() {
    $('.nav-link_0').addClass('active');
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.triggerService.clearEvent();
    if (this.supplierNameSubscription) {
      this.supplierNameSubscription.unsubscribe();
    }
    this.currentCurrencyObj = {};
  }
  createReasonsForm() {
    this.reasonsForm = this.fb.group({
      onHoldReasonsArr: this.fb.array([]),
      rejectionReasonsArr: this.fb.array([]),
      othersReason: [''],
      showOthersReason: [false]
    });
    this.createReasonsFormArray('onHoldReasonsArr', this.onHoldReasons);
    this.createReasonsFormArray('rejectionReasonsArr', this.rejectionReasons);
  }

  createReasonsFormArray(formArrayName: string, dataArr: any = []) {
    const formArr = <FormArray>this.reasonsForm.controls[formArrayName];
    formArr.controls = [];
    for (let index = 0; index < dataArr.length; index++) {
      let formGroup = this.createReasonsFormGroup();
      formGroup.patchValue(dataArr[index]);
      formArr.push(formGroup);
    }
  }
  createReasonsFormGroup() {
    return this.fb.group({
      id: [''],
      text: [''],
      selected: [false]
    });
  }
  setEventType(event: any) {
    this.triggerService.setEvent(event);
  }
  /*all life cycle events whichever required after inicialization of constructor*/
  getAllPOs(statusArr) {
    this.getPurchaseOrderList(PO_APPROVAL_CONST.all, (this.statusType === PO_APPROVAL_CONST.all ? true : false));
    this.getPurchaseOrderList(PO_APPROVAL_CONST.cancelled, (this.statusType === PO_APPROVAL_CONST.cancelled ? true : false));
    if (statusArr.includes(PO_APPROVAL_CONST.pending) || statusArr.includes(PO_APPROVAL_CONST.generated)) {
      this.getPurchaseOrderList(PO_APPROVAL_CONST.pending, (this.statusType === PO_APPROVAL_CONST.pending ? true : false));
    }
    if (statusArr.includes(PO_APPROVAL_CONST.approved)) {
      this.getPurchaseOrderList(PO_APPROVAL_CONST.approved, (this.statusType === PO_APPROVAL_CONST.approved ? true : false));
    }
    if (statusArr.includes(PO_APPROVAL_CONST.rejected)) {
      this.getPurchaseOrderList(PO_APPROVAL_CONST.rejected, (this.statusType === PO_APPROVAL_CONST.rejected ? true : false));
    }
  }


  getLocalizedResons() {
    this.onHoldReasons = [];
    this.rejectionReasons = [];
    this.onHoldReasons = Common.changeDropDownValues(this.translateService, ONHOLD_REASONS, 'projects.reasons.onholdPO');
    this.rejectionReasons = Common.changeDropDownValues(this.translateService, REJECTION_REASONS, 'projects.reasons.rejectPO');

  }
  /**
     *method to update current tab data
     @param status as number for getting PO status
     */
  updateCurrentTabData(status) {
    const obj = this.getPOData(status);
    this.purchaseOrderList = obj.data;
    this.totalItems = obj.totalItems;
    this.currentPage = obj.currentPage;
  }
  /**
   *method to naviagte in between PO tabs
   @param event as object to get target  element
   @param statusType as PO status as per selected tab
   */
  showPurchaseOrders(event, statusType = '') {
    window.scrollTo(0, 0);
    this.statusType = statusType;
    $(event.target).parents('ul').find('.nav-link').removeClass('active');
    $(event.target).addClass('active');
    const dataObj = this.getPOData(statusType);
    setTimeout(() => { this.currentPage = CustomTableConfig.pageNumber; }, 0);
    if (dataObj.currentPage !== CustomTableConfig.pageNumber) {
      this.purchaseOrderList = [];
      this.getPurchaseOrderList(statusType, true);
    }
    else {
      this.purchaseOrderList = dataObj.data;
      this.totalItems = dataObj.totalItems;
    }
  }
  /*method to check USD to MXN currency conversion added or not for project*/
  checkDefaultCurrencyAdded() {
    this._sharedService.checkDefaultCurrencyAdded(this.budgetId).subscribe((response: any) => {
      if (Common.checkStatusCode(response.header.statusCode)) {
        this.currencyValidationFlag = true;
      } else {
        this.currencyValidationFlag = false;
      }
      this.defaultCurrencyFlag = false;
    }, error => {
      this.currencyValidationFlag = false;
      this.defaultCurrencyFlag = false;
    });
  }
  /*method to check USD to MXN currency conversion added or not  for project*/

  /*method to open currency popup*/
  openCurrencyPopup() {
    const swalObj = Common.swalConfirmPopupObj(this.common.labels.currencyPopupMsg, true, true, this.common.labels.yes, this.common.labels.cancelDelete);
    swal(swalObj, (isConfirm) => {
      if (isConfirm) {
        this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.currencies, [this.projectId, this.budgetId])]);
      }
    });
  }
  /*method to open currency popup*/

  /*method to create PO filter form*/
  createPOFilterForm() {
    this.poFilterForm = this.fb.group({
      consecutiveNumber: [''],
      poNumber: [''],
      supplierName: [''],
      type: [''],
      dateRange: ['']
    });
  }
  /*method to create PO filter form*/

  /* method to search PO data as per selected parameters in  filters */
  search() {
    this.isSearchClicked = true;
    $('.sub_location_row').hide();
    this.purchaseOrderList = [];
    this.getPODetails();
  }
  /* method to search PO data as per selected parameters in  filters */

  /* method to clear filters */
  clear() {
    this.isSearchClicked = false;
    this.poFilterForm.reset();
    $('.sub_location_row').hide();
    this.purchaseOrderList = [];
    this.getPODetails();
  }
  /* method to clear filters */

  /* method to get po data as per default selection */
  getPODetails() {
    this.setdefaultPage();
    this.getAllPOs([PO_APPROVAL_CONST.pending, PO_APPROVAL_CONST.approved, PO_APPROVAL_CONST.rejected]);
  }
  /* method to set default page & get po data as per default selection */

  /* method to set default page */
  setdefaultPage() {
    this.currentPage = 1;
    this.page = 1;
  }
  /* method to set default page */

  /**
  *method to show/hide PAl icon on po listing
  @param purchaseOrder as po object to get type of PO
  @return Boolean value
  */
  showPalIcon(purchaseOrder) {
    if (this.userInfo && this.userInfo.rolesArr) {
      return !(this.userInfo.rolesArr.includes(ROLES_CONST.freelancer) && (purchaseOrder.purchaseOrderFor === PURCHASE_ORDER_CONST.freelancer) && purchaseOrder.thirdPartyVendor);
    }
    else {
      return true;
    }
  }

  /* method to set role permissions  */
  setPermissionsDetails() {
    this.permissionObj = this.sharedData.getRolePermissionData();
    this.MODULE_ID = this.route.snapshot.parent.data['moduleID'];

    const modulePermissionObj = this.permissionObj[this.MODULE_ID];
    if (modulePermissionObj.uiAccess) {
      this.uiAccessPermissionsObj = modulePermissionObj.uiAccess;
    }
  }
  /* method to set role permissions  */

  /**
  *method to get value converted from source currency to target currency
  @param usdAmount number as value in default currency
  @param amount  number as value in selected currency
  @return float value as converted value
  */
  getConvertedValue(usdAmount, amount) {
    let convertedValue = 0;
    if (this.currentCurrencyObj && amount) {
      if (usdAmount) {
        const currentTargetUnit = (this.currentCurrencyObj && this.currentCurrencyObj.targetUnit) ? this.currentCurrencyObj.targetUnit : 1;
        convertedValue = Common.convertValue(CURRENCY_CONVERSION_CONST.defaultToOthers, usdAmount, currentTargetUnit);
      }
    }
    else {
      convertedValue = amount;
    }
    return convertedValue ? convertedValue.toFixed(2) : 0;
  }

  /**
  *method to get search query params for callling PO listing api
  @param status  as number for getting po status
  @return params as httpparams object
  */
  getSearchQueryParam(status) {

    let params: HttpParams = new HttpParams();

    params = params.append('pageSize', this.itemsPerPage.toString());
    params = params.append('pageNo', this.currentPage.toString());
    params = params.append('projectBudgetId', this.budgetId);
    if (status) {
      params = params.append('status', status);
    }
    if (this.poFilterForm && this.isSearchClicked) {
      const formValues = this.poFilterForm.value;

      if (formValues.type || formValues.type === 0) {
        params = params.append('purchaseOrderFor', formValues.type);
      }
      if (formValues.consecutiveNumber) {
        params = params.append('consecutiveNumber', formValues.consecutiveNumber.trim());
      }
      if (formValues.poNumber) {
        params = params.append('purchaseOrderNumber', formValues.poNumber.trim());
      }
      if (formValues.supplierName) {
        params = params.append('supplierId', formValues.supplierName.trim());
      }

      if (formValues.dateRange) {
        const daterange = formValues.dateRange;
        const dobObj = Common.setOffsetToUTCMyRangeDatePicker(daterange);
        params = params.append('fromDate', dobObj['fromDate']);
        params = params.append('toDate', dobObj['toDate']);
      }

    }

    return params;
  }

  /**
  *method to get search query params for callling PO listing api
  @param status  as number for getting po status
  @param canUpdateList as Boolean value to update PO list or not
  */
  getPurchaseOrderList(status, canUpdateList: Boolean = false) {
    this.showLoadingFlg = true;
    this.subLocationData = {};
    this._poListService.getPOList(this.getSearchQueryParam(status)).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        const poListData = ManagePOListData.getPOListDetails(response.payload.results);
        this.setPOData(status, poListData, response.payload.totalItems, this.currentPage);
        if (canUpdateList) {
          this.showLoadingFlg = false;
          this.updateCurrentTabData(status);
        }
        this.showRightArrow();
      } else {
        this.showLoadingFlg = false;
        this.setPOData(status, [], 0, this.currentPage);
        if (response && response.header && response.header.message) {
          this.toastrService.error(response.header.message);
        } else {
          this.toastrService.error(this.common.errorMessages.error);
        }

      }
    }, error => {
      this.setPOData(status, [], 0, this.currentPage);
      this.showLoadingFlg = false;
      this.toastrService.error(this.common.errorMessages.error);
    });

  }

  detectChangedInput() {
    this.supplierNameSubscription = this.searchSupplierName
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe((str) => this.getSupplierList(str));
  }

  /**
* It gets supplier search query parameters from the filter form and returns it.
*/
  getSupplierQueryParam(searchStr) {
    let params: HttpParams = new HttpParams();
    searchStr = searchStr.trim();
    if (searchStr) {
      params = params.append(this.PO_LIST_QUERY_PARAMS.name, searchStr.toString());
    }
    return params;
  }
  /**
* Get supplier drpdown list
*/
  getSupplierList(searchStr = '') {
    if (searchStr) {
      searchStr = searchStr.trim();
    }
    this.isLoadingSupplierName = true;
    this.supplierDropDown = [];
    this.supplierDropDownArr = [];
    this._poListService.getSuppliers(this.getSupplierQueryParam(searchStr)).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        this.supplierDropDownArr = response.payload.results;
        this.supplierDropDown = Common.getMultipleSelectArr(this.supplierDropDownArr, ['id'], ['i18n', 'displayName']);
        this.isLoadingSupplierName = false;
      } else {
        this.supplierDropDown = [];
        this.supplierDropDownArr = [];
        this.isLoadingSupplierName = false;
      }
    }, error => {
      this.supplierDropDown = [];
      this.supplierDropDownArr = [];
    });
  }
  /**
  *method to get PO data as per selected status
  @param status number as po status
  @return dataObj as object of PO data,totalItems,currentPage as per selected status
  */
  getPOData(status) {
    const dataObj = {
      data: [],
      totalItems: 0,
      currentPage: 1
    };
    switch (status) {
      case PO_APPROVAL_CONST.pending:
        dataObj.data = this.poListDataObj.pending.data;
        dataObj.totalItems = this.poListDataObj.pending.totalItems;
        dataObj.currentPage = this.poListDataObj.pending.currentPage;
        break;
      case PO_APPROVAL_CONST.approved:
        dataObj.data = this.poListDataObj.approved.data;
        dataObj.totalItems = this.poListDataObj.approved.totalItems;
        dataObj.currentPage = this.poListDataObj.approved.currentPage;
        break;
      case PO_APPROVAL_CONST.rejected:
        dataObj.data = this.poListDataObj.rejected.data;
        dataObj.totalItems = this.poListDataObj.rejected.totalItems;
        dataObj.currentPage = this.poListDataObj.rejected.currentPage;
        break;
      case PO_APPROVAL_CONST.cancelled:
        dataObj.data = this.poListDataObj.cancelled.data;
        dataObj.totalItems = this.poListDataObj.cancelled.totalItems;
        dataObj.currentPage = this.poListDataObj.cancelled.currentPage;
        break;
      default:
        dataObj.data = this.poListDataObj.all.data;
        dataObj.totalItems = this.poListDataObj.all.totalItems;
        dataObj.currentPage = this.poListDataObj.all.currentPage;
        break;
    }
    return dataObj;
  }

  /**
  *method to get PO data as per selected status
  @param status number as po status
  @param data as object of PO data,totalItems,currentPage as per selected status
  @param totalItems  as number for getting total number of POs
  @param currentPage  as number for tracking current page for selected tab
  */
  setPOData(status, data, totalItems, currentPage) {
    switch (status) {
      case PO_APPROVAL_CONST.pending:
        this.poListDataObj.pending.data = data;
        this.poListDataObj.pending.totalItems = totalItems;
        this.poListDataObj.pending.currentPage = currentPage;
        break;
      case PO_APPROVAL_CONST.approved:
        this.poListDataObj.approved.data = data;
        this.poListDataObj.approved.totalItems = totalItems;
        this.poListDataObj.approved.currentPage = currentPage;
        break;
      case PO_APPROVAL_CONST.rejected:
        this.poListDataObj.rejected.data = data;
        this.poListDataObj.rejected.totalItems = totalItems;
        this.poListDataObj.rejected.currentPage = currentPage;
        break;
      case PO_APPROVAL_CONST.cancelled:
        this.poListDataObj.cancelled.data = data;
        this.poListDataObj.cancelled.totalItems = totalItems;
        this.poListDataObj.cancelled.currentPage = currentPage;
        break;
      default:
        this.poListDataObj.all.data = data;
        this.poListDataObj.all.totalItems = totalItems;
        this.poListDataObj.all.currentPage = currentPage;
        break;
    }
  }

  /**
  *method to get PO data as per selected status
  @param event  as pagination object for getting cutrent/selected page
  */
  public pageChanged(event: any): void {
    this.currentPage = event.page;
    this.showLoadingFlg = true;
    this.purchaseOrderList = [];
    if (!this.isSearchClicked) {
      this.poFilterForm.reset();
    }
    this.getPurchaseOrderList(this.statusType, true);
  }

  showRightArrow() {
    setTimeout(function () {
      $('.fa-caret-right').show();
      $('.fa-sort-down').hide();
    }, 200);
  }

  /**
  *method to cancel selected PO
  @param poID  as number for getting PO Id of selected PO
  @param cancelPoFlag as Boolean
  */
  cancelPO(poID, cancelPoFlag, status, ownPoFlag, paymentStatus?) {
    if (cancelPoFlag && !ownPoFlag && (paymentStatus !== PAYMENT_APPROVAL_CONSTANTS.paid)) {
      const swalObj = Common.swalConfirmPopupObj(this.common.labels.warningMsg,
        true, true, this.common.labels.yes, this.common.labels.cancelDelete, '',
        this.common.labels.confirmationMsg);
      swal(swalObj, (isConfirm) => {
        if (isConfirm) {
          this._poListService.removePO(poID).subscribe((response: any) => {
            if (Common.checkStatusCodeInRange(response.header.statusCode)) {
              this.subLocationData = {};
              $('.fa-sort-down').hide();
              $('.fa-caret-right').show();
              this.purchaseOrderList = [];
              this.setdefaultPage();
              this.getAllPOs([status]);
              this.toastrService.success(response.header.message);
            }
            else {
              if (response && response.header && response.header.message) {
                this.toastrService.error(response.header.message);
              } else {
                this.toastrService.error(this.common.errorMessages.error);
              }
            }
          }, error => {
            this.toastrService.error(this.common.errorMessages.error);
          });
        }
      });
    }
  }

  translateFunc() {
    this.translateService.get('common').subscribe(res => {
      this.common = res;
    });

  }

  /**
  *method to  navigate to particular page
  @param link  as string for getting routing path
  */
  navigateTo(link) {
    if (!this.currencyValidationFlag) {
      this.openCurrencyPopup();
    }
    else {
      this.router.navigate([Common.sprintf(link, [this.projectId, this.budgetId, ''])]);
    }
  }

  /**
 *method to  view selected PO
 @param poId  as string for getting PO Id
 @param poFor  as number for getting PO type
 */
  viewPO(poId, poFor) {
    const path = Common.sprintf(ROUTER_LINKS_FULL_PATH.viewPO, [poId]);
    window.open(window.location.origin + path);
  }

  /**
  *method to  edit selected PO
  @param purchaseOrder  as object for getting purchase order details
  */
  editPO(purchaseOrder) {
    const poId = (purchaseOrder['id']) ? purchaseOrder['id'] : '';
    const poFor = (purchaseOrder['purchaseOrderFor'] || purchaseOrder['purchaseOrderFor'] === PURCHASE_ORDER_CONST.freelancer) ? purchaseOrder['purchaseOrderFor'] : '';
    const canEditPoFlag = (purchaseOrder['canEdit']) ? purchaseOrder['canEdit'] : '';
    if (canEditPoFlag && !purchaseOrder['ownPo']) {
      switch (poFor) {
        case PURCHASE_ORDER_CONST.freelancer:

          this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.manageFreelancerPO, [this.projectId, this.budgetId, poId])]);
          break;
        case PURCHASE_ORDER_CONST.vendor:
          this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.manageVendorPO, [this.projectId, this.budgetId, poId])]);
          break;
        case PURCHASE_ORDER_CONST.location:
          this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.manageLocationPO, [this.projectId, this.budgetId, poId])]);
          break;
        case PURCHASE_ORDER_CONST.advance:
          this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.manageAdvancePO, [this.projectId, this.budgetId, poId])]);
          break;
        case PURCHASE_ORDER_CONST.talent:
          this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.manageTalentPO, [this.projectId, this.budgetId, poId])]);
          break;
      }
    }
  }

  /**
  *method to  show/hide sublocation PO
  @param poId  as string for getting PO Id
  @param index  as number for getting index of sublocation po
  @param event  as object for getting target element
  */
  showOrHideSublocation(poId, index, event) {
    this.purchaseOrderId = poId;
    if (($(event.target).parents('span').find('.fa-caret-right').is(':visible'))) {
      $('.sub_location_row').hide();
      $('.fa-caret-right').show();
      $('.fa-sort-down').hide();
      $('.po_up_' + index).hide();
      $('.po_down_' + index).show();
      $('.sub_location_po' + index).show();
      const subLocationDataArr = this.subLocationData[poId];
      if (!subLocationDataArr) {
        // this.getSubLocationDetails(poId, index);
      }
    } else {
      $('.po_up_' + index).show();
      $('.po_down_' + index).hide();
      $('.sub_location_po' + index).hide();
    }
  }

  /**
  *method to  get sublocation PO details
  @param poId  as string for getting PO Id
  @param index  as number for getting index of sublocation po
  */
  // getSubLocationDetails(poId, index) {
  //   $('.fa.fa-spinner').hide();
  //   $('.fa.fa-spinner.spinner_' + index).show();
  //   this._poListService.getSubLocationsPO(poId).subscribe((response: any) => {
  //     if (Common.checkStatusCodeInRange(response.header.statusCode)) {
  //       if (response.payload && response.payload.results) {
  //         this.subLocationData[poId] = response.payload.results;
  //       } else {
  //         this.subLocationData[poId] = [];
  //       }
  //     } else {
  //       this.subLocationData[poId] = [];
  //     }
  //     $('.fa.fa-spinner.spinner_' + index).hide();
  //   }, error => {
  //     $('.fa.fa-spinner.spinner_' + index).hide();
  //     this.subLocationData[poId] = [];
  //   });
  // }

  checkReason(id) {
    const isAvailable = _.filter(this.onholdResons, { 'id': id });
    return (isAvailable.length) ? true : false;
  }
  /**
  *method to  open approval hierarchy status modal
  @param purchaseOrder  as object for getting purchase order  approvalList data
  */
  openApprovalModal(purchaseOrder) {
    this.setEventType({ type: EVENT_TYPES.modalOpen, prevValue: {}, currentValue: true });
    this.disableButtonFlag = false;
    this.approvalHierarchyArr = purchaseOrder.approvalList;
    this.purchaseOrderDetails = purchaseOrder;
    // this.hideReasons();
    if (this.approvalHierarchyArr && this.approvalHierarchyArr.length > 0) {
      for (let index = 0; index < this.approvalHierarchyArr.length; index++) {
        const tempDetails = this.approvalHierarchyArr[index];
        tempDetails['percent'] = this.getLengthStyle(this.approvalHierarchyArr.length + 1, index + 1);
      }
      this.approvalStatusModal.show();
    }
  }

  openPaymentModal(purchaseOrder) {
    this.cancelPaymentRejection();
    this.paymentApprovalHierarchyArr = purchaseOrder.paymentsApprovalList;
    this.purchaseOrderDetails = purchaseOrder;
    if (this.paymentApprovalHierarchyArr && this.paymentApprovalHierarchyArr.length > 0) {
      for (let index = 0; index < this.paymentApprovalHierarchyArr.length; index++) {
        const tempDetails = this.paymentApprovalHierarchyArr[index];
        if (index) {
          tempDetails['percent'] = this.getLengthStyle(this.paymentApprovalHierarchyArr.length, index);
        } else {
          tempDetails['percent'] = 0;
        }
      }
      this.showPopUpLoadingFlag = false;
      this.paymentApprovalStatusModal.show();
    }
  }
  openRejectionModal(purchaseOrder) {
    this.paymentRejectionReason = purchaseOrder.paymentRejectReason ? purchaseOrder.paymentRejectReason : '';
    this.rejectModal.show();
  }

  openReasonsModal(purchaseOrder) {
    this.purchaseOrderDetails = purchaseOrder;
    this.reasonsModal.show();
  }
  /**
  *method to  set the position of elements on approval hierarchy modal
  @param length  as number for getting length of approval hierarchy list
  @param index  as number for getting index of approval hierarchy data
  */
  getLengthStyle(length, index) {

    const val = 100 / (length - 1);

    const percent = val * index;
    return percent;
  }

  /**
  *method to  navigate to manage invoice page
  @param poId  as string for getting PO Id
  @param canRaiseInvoiceFlag as Boolean
  */
  navigateToInvoice(poId, canRaiseInvoiceFlag) {
    if (canRaiseInvoiceFlag) {
      const url = Common.sprintf(ROUTER_LINKS_FULL_PATH.managePaymentOrder, [this.projectId, this.budgetId, '']);
      this.router.navigate([url], { queryParams: { poId: poId } });
    }
  }

  /**
  *method to  navigate to settle po page
  @param purchaseOrder  as po object
  */
  navigateToSettlePO(purchaseOrder) {
    if (purchaseOrder.canSettle) {
      // this.navigateTo(link);
      let url: any;
      if (purchaseOrder && purchaseOrder.settlementId) {
        url = Common.sprintf(ROUTER_LINKS_FULL_PATH.manageSettlement, [this.projectId, this.budgetId, purchaseOrder.settlementId]);
      } else {
        url = Common.sprintf(ROUTER_LINKS_FULL_PATH.manageSettlement, [this.projectId, this.budgetId, '']);
      }
      this.router.navigate([url], { queryParams: { poId: purchaseOrder.id } });
    }
  }

  approvePO() {
    this.approvedSpinnerFlag = true;
    this.showReasonBox = false;
    this.disableButtonFlag = true;
    this._poListService.approvePo(this.purchaseOrderDetails.id).
      subscribe((responseData: any) => {
        this.approvalStatusModal.hide();
        this.approvedSpinnerFlag = false;
        this.disableButtonFlag = false;
        if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
          this.purchaseOrderList = [];
          this.getAllPOs([PO_APPROVAL_CONST.approved, PO_APPROVAL_CONST.pending]);
          this.toastrService.success(responseData.header.message);
        } else {
          this.toastrService.error(responseData.header.message);
        }
      },
        error => {
          this.approvedSpinnerFlag = false;
          this.disableButtonFlag = false;
          this.toastrService.error(this.common.errorMessages.error);
        });
  }

  setPOOnhold(reasonsList) {
    this.submitSpinnerFlag = true;
    this.disableButtonFlag = true;
    const finalUserData = ManagePOListData.setApprovalData(this.purchaseOrderDetails.approver, reasonsList);
    this._poListService.setPOOnHold(this.purchaseOrderDetails.id, finalUserData).
      subscribe((responseData: any) => {
        this.approvalStatusModal.hide();
        this.submitSpinnerFlag = false;
        this.disableButtonFlag = false;
        if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
          this.purchaseOrderList = [];
          this.getAllPOs([PO_APPROVAL_CONST.pending]);
          this.toastrService.success(responseData.header.message);
        } else {
          this.toastrService.error(responseData.header.message);
        }
      },
        error => {
          this.submitSpinnerFlag = false;
          this.disableButtonFlag = false;
          this.toastrService.error(this.common.errorMessages.error);
        });
  }
  rejectPO(reasonsList) {
    this.submitSpinnerFlag = true;
    this.disableButtonFlag = true;
    const finalUserData = ManagePOListData.setApprovalData(this.purchaseOrderDetails.approver, reasonsList);
    this._poListService.rejectPo(this.purchaseOrderDetails.id, finalUserData).
      subscribe((responseData: any) => {
        this.approvalStatusModal.hide();
        this.submitSpinnerFlag = false;
        this.disableButtonFlag = false;
        if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
          this.purchaseOrderList = [];
          this.getAllPOs([PO_APPROVAL_CONST.rejected, PO_APPROVAL_CONST.pending]);
          this.toastrService.success(responseData.header.message);
        } else {
          this.toastrService.error(responseData.header.message);
          this.submitSpinnerFlag = false;
          this.disableButtonFlag = false;
        }
      },
        error => {
          this.submitSpinnerFlag = false;
          this.disableButtonFlag = false;
          this.toastrService.error(this.common.errorMessages.error);
        });
  }

  approvePayment() {
    this.showPopUpLoadingFlag = true;
    this.paymentRejectionFlag = true;
    this.cancelPaymentRejection();
    this._poListService.approvePayment(this.purchaseOrderDetails.id).
      subscribe((responseData: any) => {
        this.paymentApprovalStatusModal.hide();
        this.showPopUpLoadingFlag = false;
        this.paymentRejectionFlag = false;
        if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
          this.purchaseOrderList = [];
          this.getAllPOs([PO_APPROVAL_CONST.approved]);
          this.toastrService.success(responseData.header.message);
        } else {
          this.toastrService.error(responseData.header.message);
        }
      },
        error => {
          this.showPopUpLoadingFlag = false;
          this.paymentRejectionFlag = false;
          this.toastrService.error(this.common.errorMessages.error);
        });
  }
  rejectPayment() {
    this.submittedReasonFlag = true;
    if (this.rejectionReason) {
      this.showPopUpLoadingFlag = true;
      this.paymentRejectionFlag = true;
      this.submittedReasonFlag = false;
      this._poListService.rejectPayment(this.purchaseOrderDetails.id, this.rejectionReason).
        subscribe((responseData: any) => {
          if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
            this.cancelPaymentRejection();
            this.paymentApprovalStatusModal.hide();
            this.purchaseOrderList = [];
            this.getAllPOs([PO_APPROVAL_CONST.pending, PO_APPROVAL_CONST.approved]);
            this.toastrService.success(responseData.header.message);
          } else {
            this.toastrService.error(responseData.header.message);
            this.showPopUpLoadingFlag = false;
            this.paymentRejectionFlag = false;
          }
        },
          error => {
            this.showPopUpLoadingFlag = false;
            this.paymentRejectionFlag = false;
            this.toastrService.error(this.common.errorMessages.error);
          });
    }
  }
  cancelPaymentRejection() {
    this.rejectionReason = '';
    this.submittedReasonFlag = false;
    this.showReasonBox = false;
  }





}
