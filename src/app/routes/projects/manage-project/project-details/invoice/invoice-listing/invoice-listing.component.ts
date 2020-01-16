import { Component, ViewChild, OnInit, HostListener, AfterViewInit, OnDestroy } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, FormArray, Validators, ValidatorFn } from '@angular/forms';
import {
  ROUTER_LINKS_FULL_PATH, INVOICE_TYPE_CONST,
  INVOICE_STATUS_FLAG, CustomTableConfig,
  ADVANCES_FOR_CONST, defaultDateRangepickerOptions,
  EVENT_TYPES, CURRENCY_CONVERSION_CONST, UI_ACCESS_PERMISSION_CONST, INVOICE_FOR, ROUTER_LINKS, DEFAULT_CURRENCY, PROJECT_TYPES, API_URL, LISTING_TYPE , ACTION_TYPES
} from '../../../../../../config';
import { HttpParams } from '@angular/common/http';
import { InvoiceListService } from './invoice-listing.service';
import { Subscription } from 'rxjs/Subscription';
import { IMyDrpOptions } from 'mydaterangepicker';
import { SharedData } from '../../../../../../shared/shared.data';
import { Router, ActivatedRoute } from '@angular/router';
import { Common, SessionService, TriggerService, DatePickerMethods, NavigationService, CustomValidators } from '../../../../../../common';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ViewEncapsulation } from '@angular/core';
import { ProjectsData } from '../../../../projects.data';
import { PAYMENT_STATUS } from '../../../../../payments/manage-payment/constants';
import { COOKIES_CONSTANTS } from '../../../../../../config';
import { ManageInvoiceListData } from './invoice-listing.data.model';
import {
  INVOICE_APPROVAL_CONST, INVOICE_LIST_STATUS_CONST, INVOICE_FOR_TYPE_LABELS_CONST,
  INVOICE_PAYMENT_STATUS,
  INVOICE_PAYMENT_CONST,
  ONHOLD_REASONS,
  REJECTION_REASONS,
  OTHER_REASONS,
  INVOICELIST_TYPE_CONST,
  INVOICE_FOR_SUPPLIER_LABELS_CONST,
  PURCHASE_ORDER_CONST
} from '../invoice.constants';
import { SharedService } from '../../../../../../shared/shared.service';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { projectionDef } from '@angular/core/src/render3/instructions';
const swal = require('sweetalert');
declare var $: any;
@Component({
  selector: 'app-invoice-listing',
  templateUrl: './invoice-listing.component.html',
  styleUrls: ['./invoice-listing.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InvoiceListingComponent implements OnInit, AfterViewInit, OnDestroy {
  invoiceFilterForm: FormGroup;
  reasonsForm: FormGroup;
  INVOICE_FOR = INVOICE_FOR;
  isSearchClicked: Boolean = false;
  ONHOLD_REASONS = ONHOLD_REASONS;
  REJECTION_REASONS = REJECTION_REASONS;
  UI_ACCESS_PERMISSION_CONST = UI_ACCESS_PERMISSION_CONST;
  ROUTER_LINKS_FULL_PATH = ROUTER_LINKS_FULL_PATH;
  isLoadingSupplierName: Boolean = false;
  INVOICE_PAYMENT_CONST = INVOICE_PAYMENT_CONST;
  ACTION_TYPES = ACTION_TYPES;
  INVOICE_STATUS_FLAG = INVOICE_STATUS_FLAG;
  PURCHASE_ORDER_CONST = PURCHASE_ORDER_CONST;
  INVOICE_LIST_STATUS_CONST = INVOICE_LIST_STATUS_CONST;
  PAYMENT_STATUS = PAYMENT_STATUS;
  PROJECT_TYPES = PROJECT_TYPES;
  showLoadingFlg: Boolean = false;
  invoiceList: any = [];
  MODULE_ID: any;
  totalItems: any;
  myDateRangePickerOptions: IMyDrpOptions = defaultDateRangepickerOptions;
  currentPage: any = CustomTableConfig.pageNumber;
  itemsPerPage: any = CustomTableConfig.pageSize;
  public maxSize: any = 5;
  public numPages: any = 1;
  index: any = 1;
  targetUnit: any = 1;
  public page: any = 1;
  uiAccessPermissionsObj: any;
  currentCurrencyObj: any;
  searchClicked: Boolean = false;
  subscription: Subscription;
  renderPage: Boolean = false;
  supplierDropDown: any = [];
  approvedSpinnerFlag: Boolean = false;
  public searchSupplierName = new BehaviorSubject<string>('');
  supplierNameSubscription: Subscription;
  submitSpinnerFlag: Boolean = false;
  disableButtonFlag: Boolean = false;
  projectTypeId: string;
  loadingFlag: boolean;
  supplierKeyArr: any = Common.keyValueDropdownArr(INVOICE_FOR_SUPPLIER_LABELS_CONST, 'id', 'text');
  statusKeyArr: any = Common.keyValueDropdownArr(INVOICE_LIST_STATUS_CONST, 'id', 'text');
  onHoldReasonsKeyArr: any = Common.keyValueDropdownArr(ONHOLD_REASONS, 'id', 'text');
  rejectionReasonsKeyArr: any = Common.keyValueDropdownArr(REJECTION_REASONS, 'id', 'text');
  @ViewChild('paymentHistoryModal') public paymentHistoryModal: ModalDirective;
  @ViewChild('classicModal') public classicModal: ModalDirective;
  @ViewChild('approvalStatusModal') public approvalStatusModal: ModalDirective;
  @ViewChild('reasonsModal') public reasonsModal: ModalDirective;
  paymentHistory: any;
  selectedInvoiceNumber: '';
  selectedSupplierName: '';
  delete: any;
  cancelDelete: any;
  LISTING_TYPE = LISTING_TYPE;
  invoiceApprovalHierarchyURL: any = {
    approveUrl: API_URL.approveInvoiceUrl,
    rejectUrl: API_URL.rejectInvoiceUrl,
    onHoldUrl: API_URL.onHoldInvoiceUrl
  };
  public config: any = {
    paging: true,
    filtering: { filterString: '' },
    className: ['table-striped', 'table-bordered', 'mb-0', 'd-table-fixed']
  };
  INVOICE_LIST_QUERY_PARAMS = {
    'pageSize': 'pageSize',
    'pageNo': 'pageNo',
    'projectBudgetId': 'projectBudgetId',
    'invoiceId': 'invoiceId',
    'status': 'status',
    'purchaseOrderNo': 'purchaseOrderNo',
    'invoiceNo': 'invoiceNo',
    'supplierName': 'supplierName',
    'supplierType': 'supplierType',
    'invoiceDateFrom': 'invoiceDateFrom',
    'invoiceDateTo': 'invoiceDateTo',
    'paymentDateFrom': 'paymentDateFrom',
    'paymentDateTo': 'paymentDateTo',
    'name': 'name',
    'supplierId': 'supplierId'
  };
  invoiceListDataObj: any = {
    all: {},
    generated: {},
    pending: {},
    rejected: {},
    cancelled: {},
    approved: {}
  };
  invoiceDetails: any = {};
  ROUTER_LINKS = ROUTER_LINKS;
  INVOICE_APPROVAL_CONST = INVOICE_APPROVAL_CONST;
  OTHER_REASONS = OTHER_REASONS;
  budgetId: any;
  commonLocaleObj: any;
  paymentStatusKeyArr: any[];
  selectedThirdPartyVendor: string;
  paymentModalOpened: Boolean;
  invoiceTypeDropdown: any;
  statusType: any = '';
  userInfo: any;
  typeKeyArr: any[];
  currencyValidationFlag: Boolean;
  approvalHierarchyArr: any;
  invoiceStatusKeyArr: any[];
  projectId: any;
  onHoldReasons = [];
  rejectionReasons = [];
  showReasonsBox: Boolean = false;
  showOthersReason: Boolean = false;
  showSelectAtLeastOneReasonMsg: Boolean = false;
  submittedReasonFlag: Boolean = false;
  reasonsArr = [];
  supplierDropDownArr: any;
  permissionObj: any = {};
  // use to initialize members of class
  constructor(private fb: FormBuilder,
    private _invoiceListService: InvoiceListService,
    private sessionlocalstorage: SessionService,
    private triggerService: TriggerService,
    private navigationService: NavigationService,
    private route: ActivatedRoute,
    private router: Router,
    private _sharedService: SharedService,
    private sharedData: SharedData,
    private toastrService: ToastrService,
    private projectsData: ProjectsData,
    private translateService: TranslateService,
    private sessionService: SessionService) { }

  ngOnInit() {
    Common.scrollTOTop();
    this.projectId = this.projectsData.projectId;
    this.budgetId = this.projectsData.budgetId;
    this.triggerService.clearEvent();
    this.checkDefaultCurrencyAdded();
    this.setPermissionsDetails();
    this.getLocalizedResons();
    this.getAllInvoices([INVOICE_APPROVAL_CONST.generated, INVOICE_APPROVAL_CONST.pending,
    INVOICE_APPROVAL_CONST.approved, INVOICE_APPROVAL_CONST.rejected,
    INVOICE_APPROVAL_CONST.cancelled, INVOICE_APPROVAL_CONST.autoapproved]);
    this.setLocaleTranslation();
    this.createForm();
    this.createReasonsForm();
    this.userInfo = this.sharedData.getUsersInfo();
    this.subscription = this.triggerService.getEvent().subscribe((data) => {
      if (data.event) {
        // tslint:disable-next-line:triple-equals
        if (data.event.type && (data.event.type == EVENT_TYPES.currencyEvent)) {
          this.currentCurrencyObj = data.event.currentValue;
        }
        if (data.event.type === EVENT_TYPES.approve) {
          const currentValue = data.event.currentValue;
          if (currentValue.list === LISTING_TYPE.invoice) {
            this.approvalStatusModal.hide();
            this.invoiceList = [];
            this.getAllInvoices([INVOICE_APPROVAL_CONST.approved, INVOICE_APPROVAL_CONST.pending]);
          }
        }
        if (data.event.type === EVENT_TYPES.onHold) {
          const currentValue = data.event.currentValue;
          if (currentValue.list === LISTING_TYPE.invoice) {
            this.approvalStatusModal.hide();
            this.invoiceList = [];
            this.getAllInvoices([INVOICE_APPROVAL_CONST.pending]);
          }
        }
        if (data.event.type === EVENT_TYPES.reject) {
          const currentValue = data.event.currentValue;
          if (currentValue.list === LISTING_TYPE.invoice) {
            this.approvalStatusModal.hide();
            this.invoiceList = [];
            this.getAllInvoices([INVOICE_APPROVAL_CONST.rejected, INVOICE_APPROVAL_CONST.pending]);
          }
        }
      }
    });
    this.paymentStatusKeyArr = Common.keyValueDropdownArr(PAYMENT_STATUS, 'id', 'text');
    this.getDropdownValues();
    this.setEventType({ type: EVENT_TYPES.currencyResetEvent, prevValue: {}, currentValue: true });
    this.detectChangedInput();
    this.getSupplierList();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.triggerService.clearEvent(); if (this.supplierNameSubscription) {
      this.supplierNameSubscription.unsubscribe();
    }
    this.currentCurrencyObj = {};
  }
  getDropdownValues() {
    this.invoiceTypeDropdown = Common.changeDropDownValues(this.translateService, INVOICELIST_TYPE_CONST);
    this.invoiceStatusKeyArr = Common.keyValueDropdownArr(INVOICE_LIST_STATUS_CONST, 'id', 'text');
    this.typeKeyArr = Common.keyValueDropdownArr(INVOICE_FOR_TYPE_LABELS_CONST, 'id', 'text');
    this.paymentStatusKeyArr = Common.keyValueDropdownArr(INVOICE_PAYMENT_STATUS, 'id', 'text');
  }
  getLocalizedResons() {
    this.onHoldReasons = Common.changeDropDownValues(this.translateService, ONHOLD_REASONS, 'projects.reasons.onHoldPaymentOrder');
    this.rejectionReasons = Common.changeDropDownValues(this.translateService, REJECTION_REASONS, 'projects.reasons.rejectPaymentOrder');
  }
  /*All life cycle events whichever required after initialization of constructor*/
  ngAfterViewInit() {
    $('.nav-link_0').addClass('active');
  }
  /**
   *To get the data for all status tabs
   * @param statusArr as Invoice list status array
   */
  getAllInvoices(statusArr) {
    this.getListInvoice(INVOICE_APPROVAL_CONST.all, (this.statusType === INVOICE_APPROVAL_CONST.all ? true : false));
    this.getListInvoice(INVOICE_APPROVAL_CONST.cancelled, (this.statusType === INVOICE_APPROVAL_CONST.cancelled ? true : false));
    if (statusArr.includes(INVOICE_APPROVAL_CONST.pending) || statusArr.includes(INVOICE_APPROVAL_CONST.generated)) {
      this.getListInvoice(INVOICE_APPROVAL_CONST.pending, (this.statusType === INVOICE_APPROVAL_CONST.pending ? true : false));
    }
    if (statusArr.includes(INVOICE_APPROVAL_CONST.approved)) {
      this.getListInvoice(INVOICE_APPROVAL_CONST.approved, (this.statusType === INVOICE_APPROVAL_CONST.approved ? true : false));
    }
    if (statusArr.includes(INVOICE_APPROVAL_CONST.rejected)) {
      this.getListInvoice(INVOICE_APPROVAL_CONST.rejected, (this.statusType === INVOICE_APPROVAL_CONST.rejected ? true : false));
    }
  }
  /**
   *method to  open approval hierarchy status modal
   @param invoice  as object for getting settlement approvalList data
   */
  openApprovalModal(invoice) {
    this.setEventType({ type: EVENT_TYPES.modalOpen, prevValue: {}, currentValue: true });
    this.approvalHierarchyArr = invoice.approvalList;
    this.invoiceDetails = invoice;
    this.invoiceDetails['id'] = this.invoiceDetails.invoiceId;
    if (this.approvalHierarchyArr && this.approvalHierarchyArr.length > 0) {
      for (let index = 0; index < this.approvalHierarchyArr.length; index++) {
        const tempDetails = this.approvalHierarchyArr[index];
        tempDetails['percent'] = this.getLengthStyle(this.approvalHierarchyArr.length + 1, index + 1);
      }
      this.approvalStatusModal.show();
    }
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
      params = params.append(this.INVOICE_LIST_QUERY_PARAMS.name, searchStr.toString());
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
    this.supplierDropDown = [];
    this.supplierDropDownArr = [];
    this.isLoadingSupplierName = true;
    this._invoiceListService.getSuppliers(this.getSupplierQueryParam(searchStr)).subscribe((response: any) => {
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
   *  Sets Invoice listing role permissions
   */
  setPermissionsDetails() {
    this.permissionObj = this.sharedData.getRolePermissionData();
    this.MODULE_ID = this.route.snapshot.parent.data['moduleID'];
    const modulePermissionObj = this.permissionObj[this.MODULE_ID];
    if (modulePermissionObj.uiAccess) {
      this.uiAccessPermissionsObj = modulePermissionObj.uiAccess;
    }
  }
  setEventType(event: any) {
    this.triggerService.setEvent(event);
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
  createReasonsFormGroup() {
    return this.fb.group({
      id: [''],
      text: [''],
      selected: [false]
    });
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
  // create invoice form
  createForm() {
    this.invoiceFilterForm = this.fb.group({
      poNumber: [''],
      invoiceNumber: [''],
      invoiceDateRange: [''],
      paymentDateRange: [''],
      supplierName: [''],
      type: [''],
      status: ['']
    });
  }
  /**
   * Clears search filter
   */
  clear() {
    this.isSearchClicked = true;
    this.resetForm();
    this.clearFormDetails();
    this.resetPagination();
    this.invoiceList = [];
    this.getInvoiceDetails();
  }
  clearFormDetails() {
    this.invoiceFilterForm.patchValue({
      poNumber: '',
      invoiceNumber: '',
      invoiceDate: '',
      paymentDate: '',
      supplierName: '',
      type: '',
      status: ''
    });
  }
  /**
   * Reset invoice filter form
   */
  resetForm() {
    this.invoiceFilterForm.reset();
  }
  /**
   * Resets pagination
   */
  resetPagination() {
    this.currentPage = 1;
    this.page = 1;
    this.index = 1 + (20 * (this.currentPage - 1));
  }
  /**
   * Method to check USD to MXN currency conversion added or not for project
   */
  checkDefaultCurrencyAdded() {
    if (this.budgetId) {
      this._sharedService.checkDefaultCurrencyAdded(this.budgetId).subscribe((response: any) => {
        if (response && response.header) {
          if (Common.checkStatusCode(response.header.statusCode)) {
            this.currencyValidationFlag = true;
          } else {
            this.currencyValidationFlag = false;
          }
        }
      }, error => {
        this.currencyValidationFlag = false;
      });
    }
  }
  /**
   * Sets page to default state
   */
  setdefaultPage() {
    this.currentPage = 1;
    this.page = 1;
  }
  /**
   * Sets filter data as query params for the invoice filter service
   * @param status
   */
  getSearchQueryParam(status) {
    let params: HttpParams = new HttpParams();

    params = params.append(this.INVOICE_LIST_QUERY_PARAMS.pageSize, this.itemsPerPage.toString());
    params = params.append(this.INVOICE_LIST_QUERY_PARAMS.pageNo, this.currentPage.toString());
    params = params.append(this.INVOICE_LIST_QUERY_PARAMS.projectBudgetId, this.budgetId.toString());
    // tslint:disable-next-line:triple-equals
    if (status || status == 0) {
      params = params.append(this.INVOICE_LIST_QUERY_PARAMS.status, status);
    }
    if (this.invoiceFilterForm && this.isSearchClicked) {
      const formValues = this.invoiceFilterForm.value;
      if (formValues.poNumber) {
        params = params.append(this.INVOICE_LIST_QUERY_PARAMS.purchaseOrderNo, formValues.poNumber.trim());
      }

      if (formValues.invoiceNumber) {
        params = params.append(this.INVOICE_LIST_QUERY_PARAMS.invoiceNo, formValues.invoiceNumber.trim());
      }


      if (formValues.supplierName) {
        params = params.append(this.INVOICE_LIST_QUERY_PARAMS.supplierId, formValues.supplierName.toString().trim());
      }


      if (formValues.type || formValues.type === 0) {
        params = params.append(this.INVOICE_LIST_QUERY_PARAMS.supplierType, formValues.type);
      }

      if (formValues.invoiceDateRange) {
        const daterange = this.invoiceFilterForm.controls['invoiceDateRange'].value;
        const dobObj = Common.setOffsetToUTCMyRangeDatePicker(daterange);
        params = params.append(this.INVOICE_LIST_QUERY_PARAMS.invoiceDateFrom, dobObj['fromDate']);
        params = params.append(this.INVOICE_LIST_QUERY_PARAMS.invoiceDateTo, dobObj['toDate']);
      }

      if (formValues.paymentDateRange) {
        const daterange = this.invoiceFilterForm.controls['paymentDateRange'].value;
        const dobObj = Common.setOffsetToUTCMyRangeDatePicker(daterange);
        params = params.append(this.INVOICE_LIST_QUERY_PARAMS.paymentDateFrom, dobObj['fromDate']);
        params = params.append(this.INVOICE_LIST_QUERY_PARAMS.paymentDateTo, dobObj['toDate']);
      }
    }

    return params;
  }
  /**
   * Get statuswise invoices
   */
  getInvoiceDetails() {
    this.setdefaultPage();
    this.getAllInvoices([INVOICE_APPROVAL_CONST.generated, INVOICE_APPROVAL_CONST.pending,
    INVOICE_APPROVAL_CONST.approved, INVOICE_APPROVAL_CONST.rejected,
    INVOICE_APPROVAL_CONST.cancelled, INVOICE_APPROVAL_CONST.autoapproved]);
  }
  /**
  *Updates current tab data
  @param status as number for getting Invoice status
  */
  updateCurrentTabData(status) {
    const obj = this.getInvoiceData(status);
    this.invoiceList = obj.data;
    this.totalItems = obj.totalItems;
    this.currentPage = obj.currentPage;
  }
  /**
*method to naviagte in between Invoice tabs
@param event as object to get target  element
@param statusType as Invoice status as per selected tab
*/
  showInvoices(event, statusType = '') {
    window.scrollTo(0, 0);
    this.currentPage = CustomTableConfig.pageNumber;
    this.statusType = statusType;
    $(event.target).parents('ul').find('.nav-link').removeClass('active');
    $(event.target).addClass('active');
    const dataObj = this.getInvoiceData(statusType);
    // tslint:disable-next-line:triple-equals
    if (dataObj.currentPage != CustomTableConfig.pageNumber) {
      this.invoiceList = [];
      this.getListInvoice(statusType, true);
    }
    else {
      this.invoiceList = dataObj.data;
      this.totalItems = dataObj.totalItems;
    }
  }
  /**
   *Method to fetch invoice list data
   * @param status to fetch data according to status
   * @param canUpdateList to check which status tab needs to be updated
   */
  getListInvoice(status, canUpdateList: Boolean = false) {
    this.showLoadingFlg = true;
    this._invoiceListService.getInvoiceList(this.getSearchQueryParam(status)).subscribe((response: any) => {
      if (response && response.header) {
        if (Common.checkStatusCode(response.header.statusCode)) {
          if (response.payload && response.payload.results) {
            const invoiceListData = ManageInvoiceListData.getInvoiceListDetails(response.payload.results);
            this.setInvoiceData(status, invoiceListData, response.payload.totalItems, this.currentPage);
            if (canUpdateList) {
              this.showLoadingFlg = false;
              this.updateCurrentTabData(status);
            }
            this.renderPage = true;
          } else {
            this.showLoadingFlg = false;
            this.setInvoiceData(status, [], 0, this.currentPage);
          }
        } else {
          this.showLoadingFlg = false;
          this.setInvoiceData(status, [], 0, this.currentPage);
        }
      }
    }, error => {
      this.showLoadingFlg = false;
      this.setInvoiceData(status, [], 0, this.currentPage);
    },
    );
  }
  /**
   * To fetch data for particular status tab
   * @param status for which status tab the data needs to be updated
   */
  getInvoiceData(status) {
    const dataObj = {
      data: [],
      totalItems: 0,
      currentPage: 1
    };
    dataObj.data = this.invoiceListDataObj[this.invoiceStatusKeyArr[status]].data;
    dataObj.totalItems = this.invoiceListDataObj[this.invoiceStatusKeyArr[status]].totalItems;
    dataObj.currentPage = this.invoiceListDataObj[this.invoiceStatusKeyArr[status]].currentPage;
    return dataObj;
  }
  /**
  Method to get Invoice data as per selected status
 @param status number as Invoice status
 @param data as object of Invoice data,totalItems,currentPage as per selected status
 @param totalItems  as number for getting total number of Invoice
 @param currentPage  as number for tracking current page for selected tab
 */
  setInvoiceData(status, data, totalItems, currentPage) {
    this.invoiceListDataObj[this.invoiceStatusKeyArr[status]].data = data;
    this.invoiceListDataObj[this.invoiceStatusKeyArr[status]].totalItems = totalItems;
    this.invoiceListDataObj[this.invoiceStatusKeyArr[status]].currentPage = currentPage;
  }
  public pageChanged(event: any): void {
    this.invoiceList = [];
    if (!this.isSearchClicked) {
      this.invoiceFilterForm.reset();
    }
    this.currentPage = event.page;
    this.getListInvoice(this.statusType, true);
  }

  /**
   * Used to search for particular invoice
   */
  search() {
    this.isSearchClicked = true;
    this.invoiceList = [];
    this.getInvoiceDetails();
  }

  /**
   * Updates invoice amount according to change in currency
   * @param  usdAmount invoice amount in USD
   * @param  amount    invvoice amount
   * @return           convertedValue according to currency
   */
  getConvertedValue(usdAmount, amount) {
    let convertedValue = 0;
    if (this.currentCurrencyObj) {
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
   * Navigates to manage invoice screen with particulat invoice Id data
   * @param invoiceId for which the invoice needs to be updated
   * @param poId to get invoice PO details
   * @param canPayFlag to check if the payment is scheduled
   */
  editInvoice(invoice) {
    if (invoice.canEdit && !invoice.ownInvoice) {
      const url = Common.sprintf(ROUTER_LINKS_FULL_PATH.managePaymentOrder, [this.projectId, this.budgetId, invoice.invoiceId]);
      this.router.navigate([url], { queryParams: { poId: invoice.purchaseOrderId } });
    }
  }
  /**
   * Navigates to manage invoice screen with particulat invoice Id data
   * @param invoiceId for which the invoice needs to be updated
   * @param poId to get invoice PO details
   * @param canPayFlag to check if the payment is scheduled
   */
  viewInvoiceDetails(invoiceId, poId) {
    const url = Common.sprintf(ROUTER_LINKS_FULL_PATH.viewInvoiceDetails, [this.projectId, this.budgetId, invoiceId]);
    this.router.navigate([url], { queryParams: { poId: poId } });
  }
  /**
   * Navigates to view invoice screen with particulat invoice Id data
   * @param invoiceId for which the invoice needs to be viewed
   * @param poId to get invoice PO details
   */
  viewInvoice(invoiceId, poId) {
    // const url = Common.sprintf(ROUTER_LINKS_FULL_PATH.viewInvoice, [this.projectId, this.budgetId, invoiceId]);
    // this.router.navigate([url], { queryParams: { poId: poId } });
    const path = Common.sprintf(ROUTER_LINKS_FULL_PATH.viewInvoice, [invoiceId]);
    window.open(window.location.origin + path);
  }
  /**
   * Navigates to manage payment screen with particulat invoice Id data
   * @param invoiceId for which the invoice payment needs to be scheduled
   * @param canPayFlag to check if the payment is scheduled
   */
  navigateToPaymment(invoiceId, canPayFlag) {
    if (canPayFlag) {
      const url = Common.sprintf(ROUTER_LINKS_FULL_PATH.managePayment, [this.projectId, this.budgetId, invoiceId]);
      this.router.navigate([url], { queryParams: { projectId: this.projectId, budgetId: this.budgetId } });
    }
  }
  /**
   * Translates component side text messages
   */
  setLocaleTranslation() {
    this.translateService.get('common').subscribe(res => {
      this.commonLocaleObj = res;
    });
  }
  /**
   * Method to cancel invoice
   * @param invoiceId for which invoice needs to be cancelled
   * @param cancelInvoiceFlag to check if invoice is cancelled already
   * @param status to check the current status of the invoice
   */
  cancelInvoice(invoice) {
    if (invoice) {
      const status = invoice['status'] ? invoice['status'] : '';
      const cancelInvoiceFlag = invoice['canCancel'] ? invoice['canCancel'] : '';
      const invoiceId = invoice['invoiceId'] ? invoice['invoiceId'] : '';
      const ownInvoice = invoice['ownInvoice'] ? invoice['ownInvoice'] : '';

      if (cancelInvoiceFlag && !ownInvoice) {
        if (this.commonLocaleObj) {
          const textMsg = this.commonLocaleObj.labels.warningInvoiceMsg;
          const swalObj = Common.swalConfirmPopupObj(textMsg,
            true, true, this.commonLocaleObj.labels.yes,
            this.commonLocaleObj.labels.cancelDelete, '',
            this.commonLocaleObj.labels.confirmationMsg);

          swal(swalObj, (isConfirm) => {
            if (isConfirm) {
              this._invoiceListService.removeInvoice(invoiceId).subscribe((response: any) => {
                if (response && response.header) {
                  if (Common.checkStatusCodeInRange(response.header.statusCode)) {
                    this.setdefaultPage();
                    this.invoiceList = [];
                    this.setdefaultPage();
                    this.getAllInvoices([status]);
                    this.toastrService.success(response.header.message);
                  } else {
                    this.toastrService.error(this.commonLocaleObj.labels.error);
                  }
                }
              },
                error => {
                  this.toastrService.error(this.commonLocaleObj.labels.error);
                }
              );
            }
          });
        }
      }
    }
  }
  /**
   * Resets payment modal
   */
  resetPaymentModal() {
    this.paymentHistory = [];
    this.selectedInvoiceNumber = '';
    this.selectedSupplierName = '';
    this.selectedThirdPartyVendor = '';
  }

  /**
   * Gets payment list details
   * @param invoice as invoice details to fetch payment details
   */
  getPaymentList(invoice) {
    this._invoiceListService.getPaymentsList(this.getPaymentsQueryParam(invoice.invoiceId)).subscribe((response: any) => {
      if (response && response.header) {
        if (Common.checkStatusCode(response.header.statusCode)) {
          if (response.payload.results) {
            this.selectedInvoiceNumber = invoice.invoiceNumber;
            this.selectedSupplierName = invoice.supplierName;
            if (invoice.thirdPartyVendor && invoice.thirdPartyVendor.name) {
              this.selectedThirdPartyVendor = invoice.thirdPartyVendor.name;
            }
            const tempList = ManageInvoiceListData.getPaymentsListDetails(response.payload.results);
            for (let i = 0; i < tempList.length; i++) {
              // tslint:disable-next-line:triple-equals
              if (tempList[i].paymentCurrencyCode != DEFAULT_CURRENCY.name && tempList[i].conversionRate != 0) {
                tempList[i].paymentAmountInMXN = (parseFloat(tempList[i].paymentAmount) / parseFloat(tempList[i].conversionRate));
                tempList[i].invoiceAmountInMXN = (parseFloat(tempList[i].invoiceAmount) / parseFloat(tempList[i].conversionRate));
              }
            }
            this.paymentHistory = tempList;
            this.paymentHistoryModal.show();
          } else {
            // this.futureSchedulePaymentsList = [];
            // this.totalFutureSchedulePaymentsItems = 0;
          }
        } else {
          this.toastrService.error(response.header.message);
        }
      }
    }, error => {
      this.toastrService.error(this.commonLocaleObj.errorMessages.error);
    });
  }
  /**
   * Method to show payment details pop up
   * @param invoice for which invoice the payment details should be shown
   */
  openPaymentModal(invoice) {
    this.paymentModalOpened = true;
    this.resetPaymentModal();
    if (invoice) {
      this.getPaymentList(invoice);
    }
  }

  // It closes the pop-up and sets all flags to default as required
  closeModal() {
    this.paymentHistoryModal.hide();
    this.paymentModalOpened = false;
  }

  // It closes the pay and edit pop-up on ESC key press
  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      if (this.paymentModalOpened) {
        this.closeModal();
      }
      this.approvalStatusModal.hide();
      this.reasonsModal.hide();
    }
    if (event.keyCode === 13) {
      if (!this.approvalStatusModal.isShown && !this.reasonsModal.isShown) {
        event.preventDefault();
        this.search();
      }
    }
  }
  /**
   * To set payment query params
   * @param invoiceId for which invoice id payment query params need to be set
   */
  getPaymentsQueryParam(invoiceId) {
    let params: HttpParams = new HttpParams();
    params = params.append(this.INVOICE_LIST_QUERY_PARAMS.pageSize, '100');
    params = params.append(this.INVOICE_LIST_QUERY_PARAMS.invoiceId, invoiceId.toString());
    params = params.append(COOKIES_CONSTANTS.xCurrency, DEFAULT_CURRENCY.name);
    // params = params.append(COOKIES_CONSTANTS.xCurrency, this.sessionService.getCookie(COOKIES_CONSTANTS.xCurrency));
    return params;
  }
  openReasonsModal(invoice) {
    this.invoiceDetails = invoice;
    this.reasonsModal.show();
  }
}
