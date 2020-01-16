
import { Component, OnInit, ViewEncapsulation, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IMyDrpOptions } from 'mydaterangepicker';
import { ModalDirective } from 'ngx-bootstrap';
import * as _ from 'lodash';
import {
  ROUTER_LINKS, UI_ACCESS_PERMISSION_CONST,
  defaultDateRangepickerOptions, ROUTER_LINKS_FULL_PATH, CustomTableConfig, PROJECT_TYPES_ARR, PROJECT_TYPES, LISTING_TYPE, API_URL, EVENT_TYPES, ACTION_TYPES
} from '@app/config';
import { NavigationService, Common, TriggerService, WindowOpenService, CustomValidators } from '@app/common';
import { SharedData } from '@app/shared/shared.data';
import { HttpParams } from '@angular/common/http';
import { FormGroup, FormBuilder, FormArray, ValidatorFn } from '@angular/forms';
import { PURCHASE_ORDER_CONST, ROLES_CONST, CURRENCY_CONVERSION_CONST } from '@app/config';
import { PO_APPROVAL_STATUS_CONST, PURCHASE_FOR_ORDER_CONST, MASTER_PAYMENT_STATUS_CONST, MASTER_PAYMENT_APPROVAL_CONST, SUPPLIER_TYPE_CONSTANTS, STATUS_CONSTANTS, PO_APPROVAL_CONST } from '../constants';
import { MasterPOService } from './purchase-order-listing.service';
import { ToastrService } from 'ngx-toastr';
import { MasterPOListData } from './purchase-order.data.model';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import { ONHOLD_REASONS, REJECTION_REASONS, OTHER_REASONS, PAYMENT_APPROVAL_CONSTANTS, PO_FOR_TYPE_LABELS_CONST, PO_FOR_SUPPLIER_LABELS_CONST } from '@app/routes/projects/manage-project/project-details/purchase-order/purchase-order.constants';
// import { saveAs } from 'file-saver';

declare var $: any;

@Component({
  selector: 'app-purchase-order-listing',
  templateUrl: './purchase-order-listing.component.html',
  styleUrls: ['./purchase-order-listing.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PurchaseOrderListingComponent implements OnInit, OnDestroy {
  @ViewChild('approvalStatusModal') public approvalStatusModal: ModalDirective;
  @ViewChild('paymentApprovalStatusModal') public paymentApprovalStatusModal: ModalDirective;
  @ViewChild('rejectModal') public rejectModal: ModalDirective;
  @ViewChild('reasonsModal') public reasonsModal: ModalDirective;
  PURCHASE_FOR_ORDER_CONST = PURCHASE_FOR_ORDER_CONST;
  ROUTER_LINKS = ROUTER_LINKS;
  STATUS_CONSTANTS = STATUS_CONSTANTS;
  purchaseOrders: any = [];
  ACTION_TYPES = ACTION_TYPES;
  SUPPLIER_TYPE_CONSTANTS = SUPPLIER_TYPE_CONSTANTS;
  PO_APPROVAL_CONST = PO_APPROVAL_CONST;
  MASTER_PAYMENT_STATUS_CONST = MASTER_PAYMENT_STATUS_CONST;
  MASTER_PAYMENT_APPROVAL_CONST = MASTER_PAYMENT_APPROVAL_CONST;
  PO_APPROVAL_STATUS_CONST = PO_APPROVAL_STATUS_CONST;
  PURCHASE_ORDER_CONST = PURCHASE_ORDER_CONST;
  PAYMENT_APPROVAL_CONSTANTS = PAYMENT_APPROVAL_CONSTANTS;
  OTHER_REASONS = OTHER_REASONS;
  public searchSupplierName = new BehaviorSubject<string>('');
  supplierNameSubscription: Subscription;
  isLoadingSupplierName: Boolean = false;
  isEmptySupplierName: Boolean = false;
  POListFilterForm: FormGroup;
  isSearchClicked: Boolean = false;
  locationArray: any = [];
  showLoadingFlg: Boolean = false;
  updateProgressStyle: Boolean = false;
  searchFlag: Boolean = false;
  exportSpinnerFlag: Boolean = false;
  projectTypeId: String;
  purchaseOrderDetailsArr: any = [];
  currentPage: any = CustomTableConfig.pageNumber;
  totalCount: any;
  itemsPerPage: any = CustomTableConfig.pageSize;
  typeKeyArr: any = Common.keyValueDropdownArr(PO_FOR_SUPPLIER_LABELS_CONST, 'id', 'text');
  maxSize: any = CustomTableConfig.maxSize;
  myDateRangePickerOptions: IMyDrpOptions = defaultDateRangepickerOptions;
  // subLocationPO: any = [];
  posublocationAddFlag: Boolean = false;
  reasonsForm: FormGroup;
  nativeWindow: any;
  public config: any = {
    paging: true,
    filtering: { filterString: '' },
    className: ['table-striped', 'table-bordered', 'mb-0', 'd-table-fixed']
  };
  breadcrumbData: any = {
    title: 'projects.labels.purchaseOrders',
    subTitle: 'projects.labels.listpo',
    data: [{
      text: 'common.labels.home',
      link: '/'
    },
    {
      text: 'projects.labels.purchaseOrders',
      link: ''
    }
    ]
  };
  MODULE_ID: any;
  uiAccessPermissionsObj: any;
  UI_ACCESS_PERMISSION_CONST = UI_ACCESS_PERMISSION_CONST;
  rejectionReason: String = '';
  showReasonBox: Boolean = false;
  approvalHierarchyArr: any = [];
  paymentApprovalHierarchyArr: any;
  PO_LIST_QUERY_PARAMS = {
    'pageSize': 'pageSize',
    'pageNo': 'pageNo',
    'projectName': 'projectId',
    'poNumber': 'purchaseOrderNumber',
    'supplierName': 'supplierId',
    'createdOn': 'createdOn',
    'type': 'purchaseOrderFor',
    'status': 'status',
    'fromAmount': 'fromAmount',
    'toAmount': 'toAmount',
    'fromDate': 'fromDate',
    'toDate': 'toDate',
    'name': 'name',
    'projectTypeId': 'projectTypeId'
  };
  statusKeyArr: any = Common.keyValueDropdownArr(STATUS_CONSTANTS, 'id', 'text');
  common: any;
  poDetailsArr: any;
  userInfo: any;
  currentCurrencyObj: any;
  totalItems: any;
  projectsDropdown: any;
  paymentRejectionReason: any;
  dropDownArr: any;
  supplierDropDownArr: any;
  supplierDropDown: any = [];
  disableExportBtn: Boolean = false;
  supplierTypeArr: any;
  statusArr: any;
  approvedSpinnerFlag: Boolean = false;
  submitSpinnerFlag: Boolean = false;
  disableButtonFlag: Boolean = false;
  onHoldReasons: any = [];
  rejectionReasons: any = [];
  showReasonsBox: Boolean = false;
  showOthersReason: Boolean = false;
  showSelectAtLeastOneReasonMsg: Boolean = false;
  submittedReasonFlag: Boolean = false;
  projectTypeCorporateFlag: Boolean = false;
  otherReason: String = '';
  selectedStatus: String = '';
  LISTING_TYPE = LISTING_TYPE;
  reasonsArr = [];
  purchaseOrderDetails: any = {};
  onHoldReasonsKeyArr: any = Common.keyValueDropdownArr(ONHOLD_REASONS, 'id', 'text');
  rejectionReasonsKeyArr: any = Common.keyValueDropdownArr(REJECTION_REASONS, 'id', 'text');
  projectTypesArr: any;
  subscription: Subscription;
  PROJECT_TYPES = PROJECT_TYPES;
  poApprovalHierarchyURL: any = {
    approveUrl: API_URL.approvePo,
    rejectUrl: API_URL.rejectPo,
    onHoldUrl: API_URL.onhold
  };
  permissionObject: any;
  constructor(
    private router: Router,
    private sharedData: SharedData,
    private route: ActivatedRoute,
    private navigationService: NavigationService,
    private triggerService: TriggerService,
    private fb: FormBuilder,
    private _poListService: MasterPOService,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private windowOpenService: WindowOpenService
  ) {
    this.nativeWindow = windowOpenService.getNativeWindow();
  }

  ngOnInit() {
    this.userInfo = this.sharedData.getUsersInfo();
    this.setLocalizedResons();
    this.setLocaleObj();
    this.createReasonsForm();
    this.createPOFilterForm();
    this.checkUserLogin(this.userInfo);
    this.getProjects();
    this.getDropdownValues();
    this.setPermissionsDetails();
    this.getPurchaseOrderDetails();
    this.detectChangedInput();
    this.getSupplierList();
     this.subscription = this.triggerService.getEvent().subscribe((data) => {
      if (data.event) {
        if (data.event.type && (data.event.type === EVENT_TYPES.currencyEvent)) {
          this.currentCurrencyObj = data.event.currentValue;
        }
        if (data.event.type === EVENT_TYPES.approve) {
          const currentValue = data.event.currentValue;
          if (currentValue.list === LISTING_TYPE.purchaseOrder) {
            this.approvalStatusModal.hide();
            this.poDetailsArr = [];
          this.getPurchaseOrderDetails();
          }
        }
        if (data.event.type === EVENT_TYPES.onHold) {
          const currentValue = data.event.currentValue;
          if (currentValue.list === LISTING_TYPE.purchaseOrder) {
            this.approvalStatusModal.hide();
            this.poDetailsArr = [];
            this.getPurchaseOrderDetails();
          }
        }
        if (data.event.type === EVENT_TYPES.reject) {
          const currentValue = data.event.currentValue;
          if (currentValue.list === LISTING_TYPE.purchaseOrder) {
            this.approvalStatusModal.hide();
            this.poDetailsArr = [];
            this.getPurchaseOrderDetails();
          }
        }
      }
    });
  }


  ngOnDestroy() {
    if (this.supplierNameSubscription) {
      this.supplierNameSubscription.unsubscribe();
    }
  }

  /**
   * Checks logged in user information
   * @param userInfoData
   */
  checkUserLogin(userInfoData) {
    // tslint:disable-next-line:forin
    for (let roleIndex = 0; roleIndex < userInfoData.rolesArr.length; roleIndex++) {
      switch (userInfoData.rolesArr[roleIndex]) {
        case ROLES_CONST.headOfMarketing:
          this.projectTypeCorporateFlag = true;
          break;
        case ROLES_CONST.HRcoordinator:
          this.projectTypeCorporateFlag = true;
          break;
        case ROLES_CONST.headOfHR:
          this.projectTypeCorporateFlag = true;
          break;
        case ROLES_CONST.officeCoordinator:
          this.projectTypeCorporateFlag = true;
          break;
        case ROLES_CONST.headOfOffice:
          this.projectTypeCorporateFlag = true;
          break;
        case ROLES_CONST.entertainmentCoordinator:
          this.projectTypeCorporateFlag = true;
          break;
        case ROLES_CONST.headOfEntertainment:
          this.projectTypeCorporateFlag = true;
          break;
        case ROLES_CONST.companyController:
          this.projectTypeCorporateFlag = true;
          break;
        case ROLES_CONST.bidderSenior:
          this.projectTypeCorporateFlag = true;
          break;
        case ROLES_CONST.headOfBidding:
          this.projectTypeCorporateFlag = true;
          break;
        case ROLES_CONST.researcherSenior:
          this.projectTypeCorporateFlag = true;
          break;
        case ROLES_CONST.headOfResearch:
          this.projectTypeCorporateFlag = true;
          break;
        case ROLES_CONST.marketingCoordinator:
          this.projectTypeCorporateFlag = true;
          break;
        case ROLES_CONST.employee:
          break;
        default:
          this.projectTypeCorporateFlag = false;
          break;
      }

    }
    this.setProjectTypeCorporate();
  }

  /**
   * Sets Project type corporate
   */
  setProjectTypeCorporate() {
    if (this.projectTypeCorporateFlag) {
      this.POListFilterForm.patchValue({
        projectType: PROJECT_TYPES.corporate,
      });
    } else {
      this.POListFilterForm.patchValue({
        projectType: '',
      });
    }

  }

  /**
   * Localizes Reason statements
   */
  setLocalizedResons() {
    this.onHoldReasons = [];
    this.rejectionReasons = [];
    this.onHoldReasons = Common.changeDropDownValues(this.translateService, ONHOLD_REASONS, 'projects.reasons.onholdPO');
    this.rejectionReasons = Common.changeDropDownValues(this.translateService, REJECTION_REASONS, 'projects.reasons.rejectPO');
  }
  // tslint:disable-next-line:member-ordering
  /**
   * Creates PO filter form
   */
  createPOFilterForm() {
    this.POListFilterForm = this.poListFormGroup();
  }
  /**
  * Creates po approval form group
  */
  poListFormGroup(): FormGroup {
    return this.fb.group({
      projectName: [''],
      poNumber: [''],
      supplierName: [''],
      createdOn: [''],
      type: [' '],
      status: [' '],
      fromAmount: [''],
      toAmount: [''],
      projectType: ['']
    });
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


  detectChangedInput() {
    this.supplierNameSubscription = this.searchSupplierName
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe((str) => this.getSupplierList(str));
  }
  /* method to set default page */
  setdefaultPage() {
    this.currentPage = 1;
  }
  setLocaleObj() {
    this.translateService.get('common').subscribe(res => {
      this.common = res;
    });

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
      const formGroup = this.createReasonsFormGroup();
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
  /**
   * Gets Master PO list from web service
   */
  getPurchaseOrderDetails() {
    this.showLoadingFlg = true;
    this.totalCount = '';
    this._poListService.getpurchaseOrderList(this.getSearchQueryParam()).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        this.showLoadingFlg = false;
        this.poDetailsArr = MasterPOListData.getPOListDetails(response.payload.results);
        this.totalItems = response.payload.totalItems;
        this.totalCount = response.payload.totalItems;
        this.disableExportBtn = (!this.totalItems) ? true : false;
      } else {
        this.showLoadingFlg = false;
        this.poDetailsArr = [];
        this.totalItems = 0;
        this.toastrService.error(response.header.message);
        this.disableExportBtn = true;
      }
    }, error => {
      this.showLoadingFlg = false;
      this.poDetailsArr = [];
      this.totalItems = 0;
      this.disableExportBtn = true;
      this.toastrService.error(this.common.errorMessages.error);
    });

  }
  /**
   * Get project drpdown list
   */
  getProjects() {
    this._poListService.getActiveProjects().subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        this.dropDownArr = response.payload.results;
        this.projectsDropdown = Common.getMultipleSelectArr(this.dropDownArr, ['id'], ['projectName']);
      } else {
        this.dropDownArr = [];
      }
    }, error => {
      this.dropDownArr = [];
    });

  }
  getDropdownValues() {
    this.supplierTypeArr = Common.changeDropDownValues(this.translateService, SUPPLIER_TYPE_CONSTANTS);
    this.statusArr = Common.changeDropDownValues(this.translateService, STATUS_CONSTANTS);
    this.projectTypesArr = Common.changeDropDownValues(this.translateService, PROJECT_TYPES_ARR);
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
  getSupplierList(str = '') {
    if (str) {
      str = str.trim();
    }
    // this.isEmptySupplierName = false;
    this.isLoadingSupplierName = true;
    this.supplierDropDown = [];
    this._poListService.getSuppliers(this.getSupplierQueryParam(str)).subscribe((response: any) => {
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
      // this.isEmptySupplierName = true;
    });
  }
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
   * Downloads Master excel
   */
  downloadExcel() {
    this.setLoaderFlags(true);
    this._poListService.getMasterExcel(this.getSearchQueryParam()).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.result) {
          this.setLoaderFlags(false);
          Common.downloadFile(response.payload.result);
        }
      } else {
        this.setLoaderFlags(false);
        this.toastrService.error(response.header.message);
      }
    }, error => {
      this.setLoaderFlags(false);
      this.toastrService.error(this.common.errorMessages.error);
    });
  }
  setLoaderFlags(value) {
    this.exportSpinnerFlag = value;
  }
  /**
    * Gets all search query parameters from the filter form and returns it.
    */
  getSearchQueryParam() {
    let params: HttpParams = new HttpParams();
    params = params.append(this.PO_LIST_QUERY_PARAMS.pageSize, this.itemsPerPage.toString());
    params = params.append(this.PO_LIST_QUERY_PARAMS.pageNo, this.currentPage.toString());
    if (this.POListFilterForm) {
      const formValues = this.POListFilterForm.value;
      if (formValues.projectName) {
        params = params.append(this.PO_LIST_QUERY_PARAMS.projectName, formValues.projectName);
      }
      if (formValues.poNumber) {
        params = params.append(this.PO_LIST_QUERY_PARAMS.poNumber, formValues.poNumber.trim());
      }
      if (formValues.supplierName) {
        params = params.append(this.PO_LIST_QUERY_PARAMS.supplierName, formValues.supplierName);
      }
      if (formValues.createdOn) {
        const daterange = formValues.createdOn;
        const dobObj = Common.setOffsetToUTCMyRangeDatePicker(daterange);
        params = params.append(this.PO_LIST_QUERY_PARAMS.fromDate, dobObj['fromDate']);
        params = params.append(this.PO_LIST_QUERY_PARAMS.toDate, dobObj['toDate']);
      }
      if (formValues.type) {
        params = params.append(this.PO_LIST_QUERY_PARAMS.type, formValues.type);
      }
      if (formValues.status) {
        params = params.append(this.PO_LIST_QUERY_PARAMS.status, formValues.status);
      }
      if (formValues.fromAmount) {
        params = params.append(this.PO_LIST_QUERY_PARAMS.fromAmount, formValues.fromAmount.trim());
      }

      if (formValues.toAmount) {
        params = params.append(this.PO_LIST_QUERY_PARAMS.toAmount, formValues.toAmount.trim());
      }
      if (formValues.projectType) {
        params = params.append(this.PO_LIST_QUERY_PARAMS.projectTypeId, formValues.projectType);
      }
    }
    return params;
  }

  /* method to search PO data as per selected parameters in  filters */
  search() {
    let validForm = false;
    this.setdefaultPage();
    const formValues = this.POListFilterForm.value;
    if (formValues.fromAmount && formValues.toAmount) {
      $('.redcolor').addClass('red');
      // tslint:disable-next-line:radix
      if (parseFloat(formValues.fromAmount) < parseFloat(formValues.toAmount)) {
        validForm = true;
        this.removeRedColour();
      }
    } else {
      $('.redcolor').addClass('red');
    }

    if (!formValues.fromAmount || !formValues.toAmount) {
      validForm = true;
      this.removeRedColour();
    }
    if (validForm) {
      this.removeRedColour();
      this.showLoadingFlg = true;
      this.isSearchClicked = true;
      this.poDetailsArr = [];
      this.getPurchaseOrderDetails();
    }

  }

  removeRedColour() {
    $('.redcolor').removeClass('red');
  }
  /* method to clear filters */
  clear() {
    this.removeRedColour();
    this.setdefaultPage();
    this.isSearchClicked = false;
    this.POListFilterForm.reset();

    this.POListFilterForm.patchValue({
      type: ' ',
      status: ' '
    });
    this.poDetailsArr = [];
    this.setProjectTypeCorporate();
    this.getPurchaseOrderDetails();
  }
  /**
 *method to  view selected PO
 @param poId  as string for getting PO Id
 @param poFor  as number for getting PO type
 */
  viewPO(poId) {
    const path = Common.sprintf(ROUTER_LINKS_FULL_PATH.viewPO, [poId]);
    window.open(window.location.origin + path);
  }

  /**
    *method to set role permissions for current module
    */
  setPermissionsDetails() {
    this.permissionObject = this.sharedData.getRolePermissionData();
    this.MODULE_ID = this.route.snapshot.parent.data['moduleID'];
    const modulePermissionObj = this.permissionObject[this.MODULE_ID];
    if (modulePermissionObj.uiAccess) {
      this.uiAccessPermissionsObj = modulePermissionObj.uiAccess;
    }
  }

  /**
*method to get PO data as per selected status
@param event  as pagination object for getting cutrent/selected page
*/
  public pageChanged(event: any): void {
    this.currentPage = event.page;
    this.showLoadingFlg = true;
    this.poDetailsArr = [];
    if (!this.isSearchClicked) {
      this.POListFilterForm.reset();
      this.setProjectTypeCorporate();
    }
    this.getPurchaseOrderDetails();
  }


  /**
  *method to  navigate to manage invoice page
  @param poId  as string for getting PO Id
  @param canRaiseInvoiceFlag as Boolean
  */
  navigateToInvoice(purchaseOrder, canRaiseInvoiceFlag) {
    if (canRaiseInvoiceFlag) {
      // this.setEventType({ type: EVENT_TYPES.backToMasterPO, prevValue: {}, currentValue: {} });
      const url = Common.sprintf(ROUTER_LINKS_FULL_PATH.managePaymentOrder
        , [purchaseOrder.projectId, purchaseOrder.projectBudgetId, '']);
      this.router.navigate([url, { data: 'masterPO' }], { queryParams: { poId: purchaseOrder.id } });
    }
  }



  /**
   * Sets events for back to list button
   * @param event
   */
  setEventType(event: any) {
    this.triggerService.setEvent(event);
  }

  /**
   * Used forProgress bar length
   * @param length as length of the progress bar
   * @param index as user index
   */
  getLengthStyle(length, index) {
    if (length === 1) {
      this.updateProgressStyle = true;
    } else {
      this.updateProgressStyle = false;
    }
    const val = 100 / (length - 1);
    const percent = val * index;
    return percent;
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
    if (this.approvalHierarchyArr && this.approvalHierarchyArr.length > 0) {
      for (let index = 0; index < this.approvalHierarchyArr.length; index++) {
        const tempDetails = this.approvalHierarchyArr[index];
        tempDetails['percent'] = this.getLengthStyle(this.approvalHierarchyArr.length + 1, index + 1);
      }
      this.approvalStatusModal.show();
    }
  }
  /**
   * Opens Payment Status modal
   * @param purchaseOrder as object
   */
  openPaymentModal(purchaseOrder) {
    this.disableButtonFlag = false;
    this.paymentApprovalHierarchyArr = purchaseOrder.paymentsApprovalList;
    this.purchaseOrderDetails = purchaseOrder;
    if (this.paymentApprovalHierarchyArr && this.paymentApprovalHierarchyArr.length > 0) {
      for (let index = 0; index < this.paymentApprovalHierarchyArr.length; index++) {
        const tempDetails = this.paymentApprovalHierarchyArr[index];
        tempDetails['percent'] = this.getLengthStyle(this.paymentApprovalHierarchyArr.length, index);
      }
      this.paymentApprovalStatusModal.show();
    }
  }
  /**
   * Opens rejection reason modal
   * @param purchaseOrder as object
   */
  openRejectionModal(purchaseOrder) {
    this.paymentRejectionReason = purchaseOrder.paymentRejectReason ? purchaseOrder.paymentRejectReason : '';
    this.rejectModal.show();
  }
  cancelPaymentRejection() {
    this.rejectionReason = '';
    this.submittedReasonFlag = false;
    this.showReasonBox = false;
  }

  openReasonsModal(purchaseOrder) {
    this.purchaseOrderDetails = purchaseOrder;
    this.reasonsModal.show();
  }
  approvePayment() {
    this.approvedSpinnerFlag = true;
    this.disableButtonFlag = true;
    this.cancelPaymentRejection();
    this._poListService.approvePayment(this.purchaseOrderDetails.id).
      subscribe((responseData: any) => {
        this.paymentApprovalStatusModal.hide();
        this.approvedSpinnerFlag = false;
        this.disableButtonFlag = false;
        if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
          this.poDetailsArr = [];
          this.getPurchaseOrderDetails();
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
  rejectPayment() {
    this.submittedReasonFlag = true;
    if (this.rejectionReason) {
      this.disableButtonFlag = true;
      this.submitSpinnerFlag = true;
      this.submittedReasonFlag = false;
      this._poListService.rejectPayment(this.purchaseOrderDetails.id, this.rejectionReason).
        subscribe((responseData: any) => {
          this.disableButtonFlag = false;
          this.submitSpinnerFlag = false;
          this.paymentApprovalStatusModal.hide();
          if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
            this.cancelPaymentRejection();
            this.poDetailsArr = [];
            this.getPurchaseOrderDetails();
            this.toastrService.success(responseData.header.message);
          } else {
            this.toastrService.error(responseData.header.message);
          }
        },
          error => {
            this.disableButtonFlag = false;
            this.submitSpinnerFlag = false;
            this.toastrService.error(this.common.errorMessages.error);
          });
    }
  }

}
