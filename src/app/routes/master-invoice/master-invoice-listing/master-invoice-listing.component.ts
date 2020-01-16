import { Component, ViewChild, OnInit, HostListener, OnDestroy } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, FormArray, Validators, ValidatorFn } from '@angular/forms';
import {
  ROUTER_LINKS_FULL_PATH, INVOICE_TYPE_CONST,
  INVOICE_STATUS_FLAG, CustomTableConfig, defaultDateRangepickerOptions,
  UI_ACCESS_PERMISSION_CONST, INVOICE_FOR, ROUTER_LINKS, DEFAULT_CURRENCY, PAYMENT_STATUS, API_URL, LISTING_TYPE, EVENT_TYPES, ACTION_TYPES
} from '@app/config';
import { HttpParams } from '@angular/common/http';
import { MasterInvoiceListingService } from './master-invoice-listing.service';
import { IMyDrpOptions } from 'mydaterangepicker';
import { SharedData } from '@app/shared/shared.data';
import { Router, ActivatedRoute } from '@angular/router';
import { Common, NavigationService, CustomValidators, TriggerService } from '@app/common';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ViewEncapsulation } from '@angular/core';
import { COOKIES_CONSTANTS, ROLES_CONST, PROJECT_TYPES } from '@app/config';
import { ManageMasterInvoiceListData } from './master-invoice-listing.data.model';
import {
  INVOICE_APPROVAL_ALL_STATUS_ARR, INVOICE_FOR_TYPES,
  INVOICE_PAYMENT_COUNT,
  ONHOLD_REASONS,
  REJECTION_REASONS,
  OTHER_REASONS,
  INVOICE_APPROVAL_STATUS_ARR,
  INVOICE_APPROVAL_STATUS,
} from '../constants';
import { SharedService } from '@app/shared/shared.service';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import {
  INVOICE_FOR_SUPPLIER_LABELS_CONST, PURCHASE_ORDER_CONST
} from '@app/routes/projects/manage-project/project-details/invoice/invoice.constants';
const swal = require('sweetalert');
declare var $: any;
@Component({
  selector: 'app-master-invoice-listing',
  templateUrl: './master-invoice-listing.component.html',
  styleUrls: ['./master-invoice-listing.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MasterInvoiceListingComponent implements OnInit, OnDestroy {
  invoiceFilterForm: FormGroup;
  reasonsForm: FormGroup;
  INVOICE_FOR = INVOICE_FOR;
  isSearchClicked: Boolean = false;
  UI_ACCESS_PERMISSION_CONST = UI_ACCESS_PERMISSION_CONST;
  ROUTER_LINKS_FULL_PATH = ROUTER_LINKS_FULL_PATH;
  INVOICE_PAYMENT_COUNT = INVOICE_PAYMENT_COUNT;
  PURCHASE_ORDER_CONST = PURCHASE_ORDER_CONST;
  INVOICE_STATUS_FLAG = INVOICE_STATUS_FLAG;
  INVOICE_APPROVAL_ALL_STATUS_ARR = INVOICE_APPROVAL_ALL_STATUS_ARR;
  PAYMENT_STATUS = PAYMENT_STATUS;
  showLoadingFlg: Boolean = false;
  disableExportBtn: Boolean = false;
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
  searchClicked: Boolean = false;
  subscription: Subscription;
  renderPage: Boolean = false;
  approvedSpinnerFlag = false;
  exportSpinnerFlag: Boolean = false;
  projectTypeCorporateFlag: Boolean = false;
  submitSpinnerFlag = false;
  disableButtonFlag = false;
  INVOICE_APPROVAL_STATUS = INVOICE_APPROVAL_STATUS;
  statusKeyArr: any = Common.keyValueDropdownArr(INVOICE_APPROVAL_ALL_STATUS_ARR, 'id', 'text');
  INVOICE_APPROVAL_STATUS_OBJ: any = Common.keyValueDropdownArr(INVOICE_APPROVAL_ALL_STATUS_ARR, 'text', 'id');
  onHoldReasonsKeyArr: any = Common.keyValueDropdownArr(ONHOLD_REASONS, 'id', 'text');
  rejectionReasonsKeyArr: any = Common.keyValueDropdownArr(REJECTION_REASONS, 'id', 'text');
  @ViewChild('paymentHistoryModal') public paymentHistoryModal: ModalDirective;
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
  projectTypeId: String;
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
    'supplierId': 'supplierId',
    'supplierType': 'supplierType',
    'invoiceDateFrom': 'invoiceDateFrom',
    'invoiceDateTo': 'invoiceDateTo',
    'paymentDateFrom': 'paymentDateFrom',
    'paymentDateTo': 'paymentDateTo',
    'projectName': 'projectId',
    'name': 'name',
    'projectType': 'projectTypeId'
  };
  breadcrumbData: any = {
    title: 'projects.labels.paymentOrders',
    subTitle: 'projects.labels.listPaymentOrders',
    data: [{
      text: 'common.labels.home',
      link: '/'
    },
    {
      text: 'projects.labels.paymentOrders',
      link: ''
    }
    ]
  };
  invoiceDetails: any = {};
  ROUTER_LINKS = ROUTER_LINKS;
  OTHER_REASONS = OTHER_REASONS;
  budgetId: any;
  commonLocaleObj: any;
  paymentStatusKeyArr: any[];
  paymentStatusKeyObj: any = {};
  selectedThirdPartyVendor: string;
  paymentModalOpened: Boolean;
  invoiceTypeDropdown: any;
  statusType: any = '';
  userInfo: any;
  typeKeyArr: any[];
  supplierTtpeArr: any[];
  currencyValidationFlag: boolean;
  approvalHierarchyArr: any;
  invoiceStatusKeyArr: any[];
  projectId: any;
  onHoldReasons = [];
  rejectionReasons = [];
  showReasonsBox = false;
  showOthersReason = false;
  showSelectAtLeastOneReasonMsg = false;
  submittedReasonFlag = false;
  otherReason = '';
  selectedStatus = '';
  reasonsArr = [];
  dropDownArr: any;
  projectsDropdown: any[];
  public searchSupplierName = new BehaviorSubject<string>('');
  searchSupplierSubscription: Subscription;
  isLoadingSupplierName: boolean;
  supplierDropDownArr: any;
  supplierDropDown: any[];
  statusArr: any;
  totalCount: any;
  PROJECT_TYPES = PROJECT_TYPES;
  currentCurrencyObj: any;
  permissionObj:any={};
  ACTION_TYPES=ACTION_TYPES;
  // use to initialize members of class
  constructor(private fb: FormBuilder,
    private _invoiceListService: MasterInvoiceListingService,
    private navigationService: NavigationService,
    private route: ActivatedRoute,
    private router: Router,
    private _sharedService: SharedService,
    private sharedData: SharedData,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private triggerService: TriggerService) { }

  ngOnInit() {
    this.createForm();
    this.userInfo = this.sharedData.getUsersInfo();
    this.checkUserLogin(this.userInfo);
    this.triggerService.clearEvent();
    this.checkDefaultCurrencyAdded();
    this.getDropdownValues();
    this.setPermissionsDetails();
    this.getLocalizedResons();
    this.getAllInvoices();
    this.getProjects();
    this.setLocaleTranslation();
    this.createReasonsForm();
    this.detectChangedInput();
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
            this.getAllInvoices();
          }
        }
        if (data.event.type === EVENT_TYPES.onHold) {
          const currentValue = data.event.currentValue;
          if (currentValue.list === LISTING_TYPE.invoice) {
            this.approvalStatusModal.hide();
            this.invoiceList = [];
            this.getAllInvoices();
          }
        }
        if (data.event.type === EVENT_TYPES.reject) {
          const currentValue = data.event.currentValue;
          if (currentValue.list === LISTING_TYPE.invoice) {
            this.approvalStatusModal.hide();
            this.invoiceList = [];
            this.getAllInvoices();
          }
        }
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    if (this.searchSupplierSubscription) {
      this.searchSupplierSubscription.unsubscribe();
    }
  }

  getDropdownValues() {
    this.invoiceTypeDropdown = Common.changeDropDownValues(this.translateService, INVOICE_TYPE_CONST);
    this.invoiceStatusKeyArr = Common.keyValueDropdownArr(INVOICE_APPROVAL_ALL_STATUS_ARR, 'id', 'text');
    this.typeKeyArr = Common.keyValueDropdownArr(INVOICE_FOR_TYPES, 'id', 'text');
    this.supplierTtpeArr = Common.keyValueDropdownArr(INVOICE_FOR_SUPPLIER_LABELS_CONST, 'id', 'text');
    this.paymentStatusKeyArr = Common.keyValueDropdownArr(PAYMENT_STATUS, 'id', 'text');
    this.paymentStatusKeyObj = Common.keyValueDropdownArr(PAYMENT_STATUS, 'text', 'id');
    this.statusArr = Common.changeDropDownValues(this.translateService, INVOICE_APPROVAL_STATUS_ARR);
  }
  getLocalizedResons() {
    this.onHoldReasons = Common.changeDropDownValues(this.translateService, ONHOLD_REASONS, 'projects.reasons.onHoldPaymentOrder');
    this.rejectionReasons = Common.changeDropDownValues(this.translateService, REJECTION_REASONS, 'projects.reasons.rejectPaymentOrder');
  }
  /*All life cycle events whichever required after initialization of constructor*/

  /**
   *To get the data for all status tabs
   * @param statusArr as Invoice list status array
   */
  // getAllInvoices(statusArr) {
  getAllInvoices() {
    this.getListInvoice();
  }
  /**
   *method to  open approval hierarchy status modal
   @param invoice  as object for getting settlement approvalList data
   */
  openApprovalModal(invoice) {
    // tslint:disable-next-line:triple-equals
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
      this.invoiceFilterForm.patchValue({
        projectType: PROJECT_TYPES.corporate,
      });
    } else {
      this.invoiceFilterForm.patchValue({
        projectType: '',
      });
    }

  }


  detectChangedInput() {
    this.invoiceFilterForm.valueChanges.subscribe(value => console.log(value));
    this.searchSupplierSubscription = this.searchSupplierName
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
  getSupplierList(str = '') {
    if (str) {
      str = str.trim();
    }
    this.supplierDropDown = [];
    this.isLoadingSupplierName = true;
    this._invoiceListService.getSuppliers(this.getSupplierQueryParam(str)).subscribe((response: any) => {
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
    this.MODULE_ID = this.route.snapshot.data['moduleID'];
    const modulePermissionObj = this.permissionObj[this.MODULE_ID];
    if (modulePermissionObj.uiAccess) {
      this.uiAccessPermissionsObj = modulePermissionObj.uiAccess;
    }
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
      projectType: [''],
      status: [''],
      projectName: [''],
    });
  }
  /**
   * Clears search filter
   */
  clear() {
    this.isSearchClicked = true;
    this.resetForm();
    this.clearFormDetails();
    this.setProjectTypeCorporate();
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
      projectType: '',
      type: '',
      status: '',
      projectName: ''
    });
  }
  /**
   * Get project drpdown list
   */
  getProjects() {
    this._invoiceListService.getActiveProjects().subscribe((response: any) => {
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
  getSearchQueryParam() {
    let params: HttpParams = new HttpParams();
    params = params.append(this.INVOICE_LIST_QUERY_PARAMS.pageSize, this.itemsPerPage.toString());
    params = params.append(this.INVOICE_LIST_QUERY_PARAMS.pageNo, this.currentPage.toString());
    if (this.invoiceFilterForm.value.projectType) {
      params = params.append(this.INVOICE_LIST_QUERY_PARAMS.projectType, this.invoiceFilterForm.value.projectType);
    }
    if (this.invoiceFilterForm && this.isSearchClicked) {
      const formValues = this.invoiceFilterForm.value;
      if (formValues.poNumber) {
        params = params.append(this.INVOICE_LIST_QUERY_PARAMS.purchaseOrderNo, formValues.poNumber.trim());
      }

      if (formValues.invoiceNumber) {
        params = params.append(this.INVOICE_LIST_QUERY_PARAMS.invoiceNo, formValues.invoiceNumber.trim());
      }
      if (formValues.status) {
        params = params.append(this.INVOICE_LIST_QUERY_PARAMS.status, formValues.status);
      }
      if (formValues.projectName) {
        params = params.append(this.INVOICE_LIST_QUERY_PARAMS.projectName, formValues.projectName);
      }
      if (formValues.supplierName) {
        params = params.append(this.INVOICE_LIST_QUERY_PARAMS.supplierId, formValues.supplierName.toString());
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
    this.getAllInvoices();
  }

  /**
   *Method to fetch invoice list data
   * @param status to fetch data according to status
   * @param canUpdateList to check which status tab needs to be updated
   */
  getListInvoice() {
    this.showLoadingFlg = true;
    this._invoiceListService.getInvoiceList(this.getSearchQueryParam()).subscribe((response: any) => {
      this.showLoadingFlg = false;
      if (response && response.header) {
        if (Common.checkStatusCode(response.header.statusCode)) {
          if (response.payload && response.payload.results) {
            this.invoiceList = ManageMasterInvoiceListData.getInvoiceListDetails(response.payload.results);
            this.totalItems = response.payload.totalItems;
            this.totalCount = response.payload.totalItems
            this.renderPage = true;
          } else {
            this.invoiceList = [];
          }
        } else {
          this.invoiceList = [];
        }
      }
    }, error => {
      this.showLoadingFlg = false;
      this.invoiceList = [];
    },
    );
  }

  public pageChanged(event: any): void {
    this.invoiceList = [];
    if (!this.isSearchClicked) {
      this.invoiceFilterForm.reset();
      this.setProjectTypeCorporate();
    }
    this.currentPage = event.page;
    this.getListInvoice();
  }

  /**
   * Used to search for particular invoice
   */
  search() {
    this.isSearchClicked = true;
    this.invoiceList = [];
    // this.getSearchQueryParam();
    this.getInvoiceDetails();
  }



  /**
   * Navigates to manage invoice screen with particulat invoice Id data
   * @param invoiceId for which the invoice needs to be updated
   * @param poId to get invoice PO details
   * @param canPayFlag to check if the payment is scheduled
   */
  editInvoice(invoice) {
    if (invoice.canEdit && !invoice.ownInvoice) {
      const url = Common.sprintf(ROUTER_LINKS_FULL_PATH.manageInvoice, [invoice.projectId, invoice.projectBudgetId, invoice.invoiceId]);
      this.router.navigate([url, { data: 'masterInvoiceListing' }], { queryParams: { poId: invoice.purchaseOrderId } });
    }
  }
  /**
   * Navigates to manage invoice screen with particulat invoice Id data
   * @param invoiceId for which the invoice needs to be updated
   * @param poId to get invoice PO details
   * @param canPayFlag to check if the payment is scheduled
   */
  viewInvoiceDetails(invoiceId, poId, projectId, projectBudgetId) {
    const url = Common.sprintf(ROUTER_LINKS_FULL_PATH.viewInvoiceDetails, [projectId, projectBudgetId, invoiceId]);
    this.router.navigate([url, { data: 'masterInvoiceListing' }], { queryParams: { poId: poId } });
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
  navigateToPaymment(invoice, canPayFlag) {
    if (canPayFlag) {
      const url = Common.sprintf(ROUTER_LINKS_FULL_PATH.managePayment, [invoice.projectId, invoice.projectBudgetId, invoice.invoiceId]);
      this.router.navigate([url, { data: 'masterInvoiceListing' }], { queryParams: { projectId: invoice.projectId, budgetId: invoice.projectBudgetId } });
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
                    this.getAllInvoices();
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
            const tempList = ManageMasterInvoiceListData.getPaymentsListDetails(response.payload.results);
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
  /**
   * Downloads Master excel
   */
  // downloadExcel() {
  //   this.setLoaderFlags(true);
  //   this._invoiceListService.getMasterExcel(this.getSearchQueryParam()).subscribe((response: any) => {
  //     if (Common.checkStatusCodeInRange(response.header.statusCode)) {
  //       if (response.payload && response.payload.result) {
  //         this.setLoaderFlags(false);
  //         Common.downloadFile(response.payload.result);
  //       }
  //     } else {
  //       this.setLoaderFlags(false);
  //       this.toastrService.error(response.header.message);
  //     }
  //   }, error => {
  //     this.setLoaderFlags(false);
  //     this.toastrService.error(this.commonLocaleObj.errorMessages.error);
  //   });
  // }
  setLoaderFlags(value) {
    this.exportSpinnerFlag = value;
  }
  /**
  ** triggers events for child components
  ** @param event as object with type,prevValue & currentValue fields
  **/
 setEventType(event: any) {
  this.triggerService.setEvent(event);
}
}
