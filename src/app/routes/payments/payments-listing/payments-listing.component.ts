import { Component, OnInit, HostListener, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpParams, HttpClient } from '@angular/common/http';
import { ModalDirective } from 'ngx-bootstrap';
import { IMyDrpOptions } from 'mydaterangepicker';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { FileUploader } from 'ng2-file-upload';
import * as _ from 'lodash';
import { Common, SessionService } from '@app/common';
import { CustomValidators } from '@app/common/custom-validators';
import { SharedService } from '@app/shared/shared.service';
import {
  FILE_TYPES, OPERATION_TYPES_ARR, CustomTableConfig, UI_ACCESS_PERMISSION_CONST, FILE_SIZE, COOKIES_CONSTANTS,
  PAYMENT_FOR, ACCEPT_ATTACHMENT_FILE_FORMATS, ROUTER_LINKS, defaultDatepickerOptions, DATE_FORMAT, DATE_FORMATS,
  ROUTER_LINKS_FULL_PATH,PROJECT_TYPES, ACTION_TYPES
} from '@app/config';
import { PaymentsListingService } from './payments-listing.service';
import { PaymentsListData } from './payments-listing.data.model';
import { SharedData } from '@app/shared/shared.data';
import { PERIODIC_STATUS_CONST, PURCHASE_ORDER_TYPES_CONST, PURCHASE_ORDER_TYPES_DROPDOWN_VALUES, PURCHASE_ORDER_TYPES_CONSTANTS } from '../constants';
import { INVOICE_FOR_SUPPLIER_LABELS_CONST,PURCHASE_ORDER_CONST } from '@app/routes/projects/manage-project/project-details/invoice/invoice.constants';
const URL = '';
declare var $: any;
const swal = require('sweetalert');

@Component({
  selector: 'app-payment-listing',
  templateUrl: './payments-listing.component.html',
  styleUrls: ['./payments-listing.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PaymentsListingComponent implements OnInit {
  myDatePickerOptions: IMyDrpOptions = defaultDatepickerOptions;
  scheduleDatePickerOptions = JSON.parse(JSON.stringify(defaultDatepickerOptions));
  ROUTER_LINKS = ROUTER_LINKS;
  showLoadingFlg = false;
  showLoaderOnSaveButtonFlag: Boolean = false;
  paymentsFilterForm: FormGroup;
  payConfirmationForm: FormGroup;
  editScheduleForm: FormGroup;
  breadcrumbData: any = {
    title: 'payments.labels.paymentsList',
    subTitle: 'payments.labels.paymentsListsub',
    data: [{
      text: 'common.labels.home',
      link: '/'
    },
    {
      text: 'payments.labels.paymentsList',
      link: ''
    }
    ]
  };
  PAYMENT_LIST_QUERY_PARAMS = {
    'pageSize': 'pageSize',
    'pageNo': 'pageNo',
    'paymentPeriodicStatus': 'paymentPeriodicStatus',
    'invoiceNumber': 'invoiceNumber',
    'projectBudgetId': 'projectBudgetId',
    'supplierName': 'supplierName',
    'projectId': 'projectId',
    'invoiceDate': 'invoiceDate',
    'scheduleDate': 'scheduleDate',
    'invoiceId': 'invoiceId',
    'excludePaymentId': 'excludePaymentId',
    'paymentFor': 'paymentFor',
    'consecutiveNumber': 'consecutiveNumber',
    'purchaseOrderNumber': 'purchaseOrderNumber'

  };
  @ViewChild('editScheduleClassicModal') public editScheduleClassicModal: ModalDirective;
  @ViewChild('payConfirmationClassicModal') public payConfirmationClassicModal: ModalDirective;
  modalName: any = {
    editSchedule: 'editSchedule',
    payConfirmation: 'payConfirmation',
  };
  editSchedule = 'editSchedule';
  payConfirmation = 'payConfirmation';
  UI_ACCESS_PERMISSION_CONST = UI_ACCESS_PERMISSION_CONST;
  editModalFlag = false;
  payModalFlag = false;
  checkPaymentFlag = false;
  wirePaymentFlag = false;
  payModalOpen = false;
  editModalOpen = false;
  invoiceNumbersList: any[];
  maxPageLinkSize: any = CustomTableConfig.maxPageLinkSize;
  itemsPerPage: any = 10;
  paidTabItemsPerPage: any = 20;
  currentPaymentsPages: any = {
    overdue: 0,
    today: 0,
    tomorrow: 0,
    future: 0,
    paid: 0
  };
  public page: any = 1;
  totalItems: any;
  paymentsTypeServiceNameObj: any = {
    overdue: 'overdue',
    today: 'today',
    tomorrow: 'tomorrow',
    future: 'future',
    paid: 'paid'
  };
  listNames = ['overdue', 'today', 'tomorrow', 'future', 'paid'];
  modelFor: any = '';
  showLoadingFlags = {
    future: false,
    today: false,
    tomorrow: false,
    overdue: false,
    paid: false
  };
  enableSaveButtonFlag = true;
  filesCounter: any = 0;
  filesReceived: any = 0;
  public documentsAttached: FileUploader = new FileUploader({ url: URL });
  documents: any = {
    attachmentDocs: []
  };
  finalPayConfirmationData: any;
  spinnerFlag = false;
  projectsList: any[];
  ACCEPT_ATTACHMENT_FILE_FORMATS = ACCEPT_ATTACHMENT_FILE_FORMATS;
  PAYMENT_FOR = PAYMENT_FOR;
  totalPaymentsItems: any = {
    tomorrow: 0,
    overdue: 0,
    today: 0,
    future: 0,
    paid: 0
  };
  paymentsLists: any = {
    overdue: [],
    today: [],
    tomorrow: [],
    future: [],
    paid: [],
  };
  showMoreFlags: any = {
    overdue: true,
    today: true,
    tomorrow: true,
    future: true,
    paid: true,
  };
  submitPayConfirmationForm = false;
  submitEditScheduleForm = false;
  enableEditScheduleSaveButtonFlag = false;
  enablePayConfimationSaveButtonFlag = false;
  paymentsHistory: any;
  paymentHistoryTotal: any = 0;
  paymentInvoiceData: any;
  invoiceAmount: any;
  amount: number;
  showMsg: boolean;
  isrWitholdingAmt: number;
  vatWitholdingAmt: number;
  vatAmt: number;
  MODULE_ID: any;
  uiAccessPermissionsObj: any;
  paymentDeleteConfirmation: any;
  commonLabelsObj: any;
  operationTypesArr: any;
  budgetList: any = [];
  payableAmount: number;
  installmentType = 0;
  checkTypeDetails: any = ['chequeNumber', 'chequeBankName', 'chequeDate'];
  wireTransactionTypeDetails: any = ['wireTransactionNumber', 'wireTransactionBankName', 'wireTransactionDate'];
  paymentModes: any = Common.keyValueDropdownArr(OPERATION_TYPES_ARR, 'text', 'id');
  PURCHASE_ORDER_TYPES_CONST = PURCHASE_ORDER_TYPES_CONST;
  PURCHASE_ORDER_TYPES_DROPDOWN_VALUES = PURCHASE_ORDER_TYPES_DROPDOWN_VALUES;
  PURCHASE_ORDER_TYPES_CONSTANTS = PURCHASE_ORDER_TYPES_CONSTANTS;
  PURCHASE_ORDER_CONST = PURCHASE_ORDER_CONST;
  poTypeArray: any[];
  supplierTtpeArr: any[];
  DATE_FORMAT = DATE_FORMAT;
  DATE_FORMATS =DATE_FORMATS;
  paymentsListsTotal = {
    overdue: 0,
    today: 0,
    tomorrow: 0,
    future: 0,
    paid: 0,
  };
  poTypeArr: any;
  PROJECT_TYPES = PROJECT_TYPES;
  permissionObj:any={};
  ACTION_TYPES=ACTION_TYPES;
  agencyFeeAmount: any;
  cost: any;
  ivaAmount: any;
  markupAmount: any;
  paymentDetailsFor: any;
  constructor(
    private translateService: TranslateService,
    public http: HttpClient,
    private fb: FormBuilder,
    private _sharedService: SharedService,
    private sharedData: SharedData,
    public route: ActivatedRoute,
    private toastrService: ToastrService,
    private _PaymentsListingService: PaymentsListingService,
    private sessionService: SessionService, ) {
    this.scheduleDatePickerOptions.disableUntil = {
      year: Common.getTodayDate().getFullYear(),
      month: Common.getTodayDate().getMonth() + 1, day: Common.getTodayDate().getDate() - 1
    };
  }

  ngOnInit() {
    this.getPoKeyValueArray();
    this.createPaymentForm();
    this.createEditScheduleForm();
    this.createPayConfirmationForm();
    this.getProjectsList();
    this.getMultiplePaymentList();
    this.setPermissionsDetails();
    this.setLocaleTranslation();
    this.getDropdownValues();
  }
  /**
   * It calles function which gets payments lists from the server
   */
  getMultiplePaymentList() {
    for (let index = 0; index < this.listNames.length; index++) {
      this.getPaymentsList(true, this.listNames[index], this.currentPaymentsPages, this.showLoadingFlags, this.paymentsTypeServiceNameObj,
        this.paymentsLists, this.totalPaymentsItems, this.showMoreFlags);
    }
  }
  /**
   * It gets operation type dropdown values
   */
  getDropdownValues() {
    this.supplierTtpeArr = Common.keyValueDropdownArr(INVOICE_FOR_SUPPLIER_LABELS_CONST, 'id', 'text');

    this.poTypeArr = Common.changeDropDownValues(this.translateService, PURCHASE_ORDER_TYPES_CONSTANTS);
    this.operationTypesArr = Common.changeDropDownValues(this.translateService, OPERATION_TYPES_ARR);
  }
  /**
   * It gets po type type dropdown values
   */
  getPoKeyValueArray() {
    this.poTypeArray = Common.keyValueDropdownArr(Common.changeDropDownValues(this.translateService, this.PURCHASE_ORDER_TYPES_CONSTANTS), 'id', 'text');
  }
  /**
   * It sets roles and permissions in current module
   */
  setPermissionsDetails() {
    this.permissionObj = this.sharedData.getRolePermissionData();
    this.MODULE_ID = this.route.snapshot.parent.data['moduleID'];
    const modulePermissionObj = this.permissionObj[this.MODULE_ID];
    if (modulePermissionObj.uiAccess) {
      this.uiAccessPermissionsObj = modulePermissionObj.uiAccess;
    }
  }
  /**
   * It creates payment filter form
   */
  createPaymentForm() {
    this.paymentsFilterForm = this.fb.group({
      projectId: [''],
      budgetType: [''],
      invoiceNumber: [''],
      supplierName: [''],
      invoiceDate: [''],
      scheduleDate: [''],
      consecutiveNumber: [''],
      purchaseOrderNumber: [''],
      paymentFor: [' ']
    });
  }

  /**
   * It creates edit payment form
   */
  createEditScheduleForm() {
    this.editScheduleForm = this.fb.group({
      invoiceNumber: [''],
      supplierName: [''],
      invoiceDate: [''],
      invoiceAmount: [''],
      paymentAmount: ['', [CustomValidators.requiredWithout0, CustomValidators.requiredNumber, CustomValidators.checkDecimal]],
      scheduleDate: ['', [CustomValidators.required]],
      paymentId: [''],
      thirdPartyVendor: [''],
      paymentFor: [''],
      consecutiveNumber: [''],
      purchaseOrderNumber: [''],
      RFCcode: ['']
    });
  }

  /**
   * It creates Pay confirmation form
   */
  createPayConfirmationForm() {
    this.payConfirmationForm = this.fb.group({
      accountNumber: [''],
      bankName: [''],
      branchName: [''],
      CLABE: [''],
      RFCcode: [''],
      sortCode: [''],
      swiftCode: [''],
      thirdPartyVendor: [''],
      address: [''],
      modeOfPayment: ['',[CustomValidators.required]],
      notes: [''],
      paymentId: [''],
      chequeNumber: [''],
      chequeBankName: [''],
      chequeDate: [''],
      wireTransactionNumber: [''],
      wireTransactionBankName: [''],
      wireTransactionDate: [''],
      paymentFor: [''],
      ABAcode: [''],
      accountName: ['']
    });
  }

  getPaymentTotal(paymentsServiceName, listType) {
    this._PaymentsListingService.getTotal(this.getSearchQueryParam(paymentsServiceName[listType])).subscribe((response: any) => {
      if (Common.checkStatusCode(response.header.statusCode)) {
        this.paymentsListsTotal[listType] = response.payload.result;
      }
    });
  }

  /**
   * It gets translated labels in required language.
   */
  setLocaleTranslation() {
    this.translateService.get('payments.labels').subscribe((res: string) => {
      this.paymentDeleteConfirmation = res['paymentDeleteConfirmation'];

    });

    this.translateService.get('common').subscribe((res: string) => {
      this.commonLabelsObj = res;
    });
  }
  /**
   * It gets projects list from the services and stores in an array
   */
  getProjectsList() {
    this.projectsList = [];
    this._PaymentsListingService.getProjectsList().subscribe((response: any) => {
      if (response && response.header) {
        if (Common.checkStatusCode(response.header.statusCode)) {
          if (response.payload.results) {
            this.projectsList = [];
            const tempProjectsList = response.payload.results;
            this.projectsList = Common.getMultipleSelectArr(tempProjectsList, ['id'], ['projectName']);
          }
          else {
            this.projectsList = [];
          }
        } else {
          this.projectsList = [];
        }
      }
    }, error => {
      this.projectsList = [];
    }
    );
  }
  /**
   * It gets list of budgets against provided project
   * @param projectId ID of selected project
   */
  getBudgetList(projectId) {
    this.budgetList = [];
    this._PaymentsListingService.getBudgetList(projectId).subscribe((response: any) => {
      if (response && response.header) {
        if (Common.checkStatusCode(response.header.statusCode)) {
          if (response.payload.results) {
            this.budgetList = [];
            const tempBudgetList = response.payload.results;
            this.budgetList = Common.getMultipleSelectArr(tempBudgetList, ['id'], ['budget', 'name']);
          }
          else {
            this.budgetList = [];
          }
        }
      } else {
        this.budgetList = [];
      }
    }, error => {
      this.budgetList = [];
    }
    );
  }

  /**
   * It clears the filter form
   */
  clearFormDetails() {
    this.budgetList = [];
    this.resetPaymentFilterForm();
    this.search();
  }
  /**
   * It resets payment filter form to default values
   */
  resetPaymentFilterForm() {
    this.paymentsFilterForm.reset();
    this.paymentsFilterForm.patchValue({
      projectId: '',
      budgetType: '',
      invoiceNumber: '',
      supplierName: '',
      invoiceDate: '',
      scheduleDate: '',
      consecutiveNumber: '',
      purchaseOrderNumber: '',
      paymentFor: ' '

    });
  }
  /**
   * It is executed on search button
   * It gets record from the service and pushes in the array
   */
  search() {
    this.setdefaultPage();
    for (let index = 0; index < this.listNames.length; index++) {
      this.getPaymentsList(true, this.listNames[index], this.currentPaymentsPages, this.showLoadingFlags, this.paymentsTypeServiceNameObj,
        this.paymentsLists, this.totalPaymentsItems, this.showMoreFlags);
    }

  }
  /**
   * It is executed on show more button
  * It gets new record fromo the service and pushes in the array
   * @param serviceName name of payment service to be called, ie: today, tomorrow, future etc.
   */
  loadMorePaymentRecords(serviceName) {
    this.getPaymentsList(false, serviceName, this.currentPaymentsPages, this.showLoadingFlags, this.paymentsTypeServiceNameObj,
      this.paymentsLists, this.totalPaymentsItems, this.showMoreFlags);
  }

  /**
   * It resets all the lists, counters and flags to default
   */
  setdefaultPage() {
    this.paymentsListsTotal = {
      overdue: 0,
      today: 0,
      tomorrow: 0,
      future: 0,
      paid: 0,
    };
    this.paymentsLists = {
      overdue: [],
      today: [],
      tomorrow: [],
      future: [],
      paid: [],
    };
    this.currentPaymentsPages = {
      overdue: 0,
      today: 0,
      tomorrow: 0,
      future: 0,
      paid: 0
    };
    this.showMoreFlags = {
      overdue: true,
      today: true,
      tomorrow: true,
      future: true,
      paid: true,
    };
  }

  /**
   * It gets the payment details from the server.
   * @param searchFlag type to check if search is default search or with search parameters
   * @param listType type of list, ie: today, tomorrow, tec
   * @param currentPaymentsPage count of current page.
   * @param showLoadingFlag loader flag property.
   * @param paymentsServiceName type of service call, ie: today, tomorrow, tec
   * @param paymentsList list of payment which is to be updated
   * @param totalPaymentsItem total items in the current list
   * @param showMoreFlag type to check if all data is not fetched from server of that particular list then to show that button
   */
  getPaymentsList(searchFlag: Boolean, listType: any, currentPaymentsPage: any, showLoadingFlag: any,
    paymentsServiceName: any, paymentsList: any, totalPaymentsItem: any,
    showMoreFlag: any) {
    currentPaymentsPage[listType]++;
    if (searchFlag) {
      this.showLoadingFlg = true;
    } else {
      showLoadingFlag[listType] = true;
    }
    this.getPaymentTotal(paymentsServiceName, listType);
    this._PaymentsListingService.getPaymentsList(this.getSearchQueryParam(paymentsServiceName[listType])).subscribe((response: any) => {
      if (response && response.header) {
        if (Common.checkStatusCode(response.header.statusCode)) {
          
          showLoadingFlag[listType] = false;
          if (response.payload.results.length > 0) {
            const list = PaymentsListData.getPaymentsListDetails(response.payload.results);
            if (searchFlag) {
              paymentsList[listType] = list;
            } else {
              for (let i = 0; i < list.length; i++) {
                const object = list[i];
                paymentsList[listType].push(object);
              }
            }
            totalPaymentsItem[listType] = response.payload.totalItems;
            if (totalPaymentsItem[listType] === paymentsList[listType].length || totalPaymentsItem[listType] === 0) {
              showMoreFlag[listType] = false;
            }
          } else {
            paymentsList[listType] = [];
            totalPaymentsItem[listType] = 0;
            showMoreFlag[listType] = false;
          }
        } else {
          paymentsList[listType] = [];
          totalPaymentsItem[listType] = 0;
          showMoreFlag[listType] = false;
        }
        const self = this;
        setTimeout(function() {
          self.showLoadingFlg = false;
        }, 1000);
      }
    }, error => {
      this.showLoadingFlg = false;
      showLoadingFlag[listType] = false;
      paymentsList[listType] = [];
      totalPaymentsItem[listType] = 0;
    });
  }
  /**
   * It sets the querry parameters to be sent to the service to fetch data
   * @param serviceName name of service to be called
   */
  getSearchQueryParam(serviceName) {
    let params: HttpParams = new HttpParams();
    if (serviceName === this.paymentsTypeServiceNameObj.paid) {
      params = params.append(this.PAYMENT_LIST_QUERY_PARAMS.pageSize, this.paidTabItemsPerPage.toString());
    } else {
      params = params.append(this.PAYMENT_LIST_QUERY_PARAMS.pageSize, this.itemsPerPage.toString());
    }
    switch (serviceName) {
      case this.paymentsTypeServiceNameObj.overdue:
        params = params.append(this.PAYMENT_LIST_QUERY_PARAMS.pageNo, this.currentPaymentsPages.overdue.toString());
        params = params.append(this.PAYMENT_LIST_QUERY_PARAMS.paymentPeriodicStatus, PERIODIC_STATUS_CONST.overdue);
        break;
      case this.paymentsTypeServiceNameObj.today:
        params = params.append(this.PAYMENT_LIST_QUERY_PARAMS.pageNo, this.currentPaymentsPages.today.toString());
        params = params.append(this.PAYMENT_LIST_QUERY_PARAMS.paymentPeriodicStatus, PERIODIC_STATUS_CONST.today);
        break;
      case this.paymentsTypeServiceNameObj.tomorrow:
        params = params.append(this.PAYMENT_LIST_QUERY_PARAMS.pageNo, this.currentPaymentsPages.tomorrow.toString());
        params = params.append(this.PAYMENT_LIST_QUERY_PARAMS.paymentPeriodicStatus, PERIODIC_STATUS_CONST.tomorrow);
        break;
      case this.paymentsTypeServiceNameObj.future:
        params = params.append(this.PAYMENT_LIST_QUERY_PARAMS.pageNo, this.currentPaymentsPages.future.toString());
        params = params.append(this.PAYMENT_LIST_QUERY_PARAMS.paymentPeriodicStatus, PERIODIC_STATUS_CONST.future);
        break;
      case this.paymentsTypeServiceNameObj.paid:
        params = params.append(this.PAYMENT_LIST_QUERY_PARAMS.pageNo, this.currentPaymentsPages.paid.toString());
        params = params.append(this.PAYMENT_LIST_QUERY_PARAMS.paymentPeriodicStatus, PERIODIC_STATUS_CONST.paid);
        break;
    }

    if (this.paymentsFilterForm) {
      const formValues = this.paymentsFilterForm.value;
      if (formValues.invoiceNumber) {
        params = params.append(this.PAYMENT_LIST_QUERY_PARAMS.invoiceNumber, formValues.invoiceNumber.trim());
      }
      if (formValues.budgetType) {
        params = params.append(this.PAYMENT_LIST_QUERY_PARAMS.projectBudgetId, formValues.budgetType);
      }
      if (formValues.supplierName) {
        params = params.append(this.PAYMENT_LIST_QUERY_PARAMS.supplierName, formValues.supplierName.trim());
      }
      if (formValues.projectId) {
        params = params.append(this.PAYMENT_LIST_QUERY_PARAMS.projectId, formValues.projectId);
      }
      if (formValues.consecutiveNumber) {
        params = params.append(this.PAYMENT_LIST_QUERY_PARAMS.consecutiveNumber, formValues.consecutiveNumber.trim());
      }
      if (formValues.purchaseOrderNumber) {
        params = params.append(this.PAYMENT_LIST_QUERY_PARAMS.purchaseOrderNumber, formValues.purchaseOrderNumber.trim());
      }
      if (formValues.paymentFor) {
        params = params.append(this.PAYMENT_LIST_QUERY_PARAMS.paymentFor, formValues.paymentFor);
      }
      if (formValues.invoiceDate) {
        const date = formValues.invoiceDate;
        const dobObj = Common.setOffsetToUTC(date, '');
        params = params.append(this.PAYMENT_LIST_QUERY_PARAMS.invoiceDate, dobObj['fromDate']);
      }
      if (formValues.scheduleDate) {
        const date = formValues.scheduleDate;
        const dobObj = Common.setOffsetToUTC(date, '');
        params = params.append(this.PAYMENT_LIST_QUERY_PARAMS.scheduleDate, dobObj['fromDate']);
      }
      return params;
    }
  }

  /**
   * It sets querry parameters to be sent to payment history service to get data
   * @param paymentDetails object of payment details
   */
  setSearchQueryParamForPaymentHistory(paymentDetails) {

    let params: HttpParams = new HttpParams();
    params = params.append(this.PAYMENT_LIST_QUERY_PARAMS.invoiceId, paymentDetails.invoiceId);
    params = params.append(this.PAYMENT_LIST_QUERY_PARAMS.excludePaymentId, paymentDetails.paymentId);
    return params;

  }

  /**
   * It closes the pay and edit pop-up on ESC key press
   * @param event current event
   */
  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      if (this.editModalFlag === true) {
        this.modelFor = '';
        this.editModalFlag = false;
        this.editScheduleClassicModal.hide();
      }
      if (this.payModalFlag === true) {
        this.modelFor = '';
        this.payModalFlag = false;
        this.payConfirmationClassicModal.hide();
      }
    }
    if (event.keyCode === 13) {
      event.preventDefault();
      if (this.editModalOpen) {
        if (!this.spinnerFlag) {
        this.submitEditSchedule();
        }
      }
      if (this.payModalOpen) {
        if (!this.showLoaderOnSaveButtonFlag && !this.enablePayConfimationSaveButtonFlag) {
        this.submitPayConfimation();
        }
      }
      if (!this.payModalOpen && !this.editModalOpen) {
        this.search();
      }
    }
  }
  
  setValidatorsAndUpdateValue(controlname: string, validators: any = []) {
    this.payConfirmationForm.controls[controlname].reset();
    this.payConfirmationForm.controls[controlname].setValidators(validators);
    if (validators.length === 0) {
      this.payConfirmationForm.controls[controlname].setErrors(null);
    }
    this.payConfirmationForm.controls[controlname].updateValueAndValidity();
  }
  /**
   * It checks the mode of payment and sets validaters as required
   * @param event current event
   */
  checkModeOfPayment(event) {
    if (event === this.paymentModes.cheque) {
      this.setValidatorsAndUpdateValue('chequeNumber', [CustomValidators.required]);
      this.setValidatorsAndUpdateValue('chequeBankName', [CustomValidators.required]);
      this.setValidatorsAndUpdateValue('chequeDate', [CustomValidators.required]);
      this.setValidatorsAndUpdateValue('wireTransactionNumber', []);
      this.setValidatorsAndUpdateValue('wireTransactionBankName', []);
      this.setValidatorsAndUpdateValue('wireTransactionDate', []);
    } else if (event === this.paymentModes.wireTransfer) {
      this.setValidatorsAndUpdateValue('wireTransactionNumber', [CustomValidators.required]);
      this.setValidatorsAndUpdateValue('wireTransactionBankName', [CustomValidators.required]);
      this.setValidatorsAndUpdateValue('wireTransactionDate', [CustomValidators.required]);
      this.setValidatorsAndUpdateValue('chequeNumber', []);
      this.setValidatorsAndUpdateValue('chequeBankName', []);
      this.setValidatorsAndUpdateValue('chequeDate', []);
    } else {
      this.setValidatorsAndUpdateValue('wireTransactionNumber', []);
      this.setValidatorsAndUpdateValue('wireTransactionBankName', []);
      this.setValidatorsAndUpdateValue('wireTransactionDate', []);
      this.setValidatorsAndUpdateValue('chequeNumber', []);
      this.setValidatorsAndUpdateValue('chequeBankName', []);
      this.setValidatorsAndUpdateValue('chequeDate', []);
    }

  }

  /**
   * It is executed on click of edit or pay icon and opens required pop-up
   * It fetches payment data and payment history data from the service and stores locally
   * @param modalName name of pop-up
   * @param modelReqFor requested model for name
   * @param reqPaymentDetail object of payment details
   */
  openModal(modalName, modelReqFor, reqPaymentDetail) {
    this.documents.attachmentDocs = [];
    this.documentsAttached.queue = [];
    this.modelFor = modelReqFor;
    this.submitPayConfirmationForm = false;
    this.submitEditScheduleForm = false;
    this.enableEditScheduleSaveButtonFlag = false;
    this.enablePayConfimationSaveButtonFlag = false;
    this.paymentDetailsFor = reqPaymentDetail;
    this._PaymentsListingService.getPaymentDetails(reqPaymentDetail.paymentId).subscribe((response: any) => {
      if (response && response.header) {
        if (Common.checkStatusCode(response.header.statusCode)) {
          if (response.payload.result) {
            const paymentDetails = PaymentsListData.getPaymentDetail(response.payload.result);
            this.paymentInvoiceData = PaymentsListData.getinvoiceTaxDetail(response.payload.result);
            this.invoiceAmount = paymentDetails.invoiceAmount;
            this.installmentType = paymentDetails.installmentType;
            if (modalName === this.editSchedule) {
              this.editScheduleFormDetails(paymentDetails, reqPaymentDetail);
            } else if (modalName === this.payConfirmation) {
              this.editPayConfirmationFormDetails(paymentDetails);
            }
          }
          else {
            this.toastrService.error(response.header.message);
          }
        } else {
          this.toastrService.error(response.header.message);
        }
      }
    }, error => {
      this.toastrService.error(this.commonLabelsObj.errorMessages.error);
    }
    );
  }
  /**
   * It sets the form details of edit schedule pop-up with received details
   * @param paymentDetails object of payment details
   * @param reqPaymentDetail object of req payment details
   */
  editScheduleFormDetails(paymentDetails, reqPaymentDetail) {
    if (reqPaymentDetail.paymentFor === PURCHASE_ORDER_TYPES_CONST.advance || reqPaymentDetail.paymentFor === PURCHASE_ORDER_TYPES_CONST.adjustment) {
      this.paymentsHistory = [];
      this.setScheduleFormDetails(paymentDetails, reqPaymentDetail.paymentFor);
      this.checkPaymentAmount(reqPaymentDetail);
      this.editScheduleClassicModal.show();
    } else {
      // tslint:disable-next-line:max-line-length
      this._PaymentsListingService.getPaymentHistoryDetails(this.setSearchQueryParamForPaymentHistory(paymentDetails)).subscribe((responseData: any) => {
        if (responseData && responseData.header) {
          if (Common.checkStatusCode(responseData.header.statusCode)) {
            if (responseData.payload.results) {
              this.paymentsHistory = responseData.payload.results;
              this.paymentHistoryTotal = 0;
              this.paymentsHistory.forEach(obj => {
                this.paymentHistoryTotal = this.paymentHistoryTotal + obj.amount;
              });
              this.setScheduleFormDetails(paymentDetails, reqPaymentDetail.paymentFor);
              this.checkPaymentAmount(reqPaymentDetail);
              this.editScheduleClassicModal.show();
              this.editModalFlag = true;
            } else {
              this.paymentsHistory = [];
            }
          }
        }
      }, error => {
        this.toastrService.error(this.commonLabelsObj.errorMessages.error);
      }
      );
    }
  }
  /**
   * It sets the form details of edit payment confirmation pop-up with received details
   * @param paymentDetails object of payment details
   */
  editPayConfirmationFormDetails(paymentDetails) {
    this.payConfirmationForm.reset();
    this.payConfirmationForm.patchValue({
      accountNumber: paymentDetails.accountNumber,
      bankName: paymentDetails.bankName,
      branchName: paymentDetails.branchName,
      paymentId: paymentDetails.paymentId,
      modeOfPayment: paymentDetails.operationId,
      paymentFor: paymentDetails.paymentFor
    });

    // tslint:disable-next-line:max-line-length
    if ((paymentDetails.paymentFor === PAYMENT_FOR.freelancer || (paymentDetails.paymentFor === PAYMENT_FOR.location && paymentDetails.isBeneficiary)) && !paymentDetails.thirdPartyVendor) {
      this.payConfirmationForm.patchValue({
        CLABE: paymentDetails.CLABE,
        RFCcode: paymentDetails.RFCcode,
        address: paymentDetails.address
      });
    }
    // tslint:disable-next-line:max-line-length
    if ((paymentDetails.paymentFor === PAYMENT_FOR.freelancer || (paymentDetails.paymentFor === PAYMENT_FOR.location && paymentDetails.isBeneficiary)) && paymentDetails.thirdPartyVendor) {
      this.payConfirmationForm.patchValue({
        sortCode: paymentDetails.sortCode,
        CLABE: paymentDetails.CLABE,
        ABAcode: paymentDetails.abaCode,
        swiftCode: paymentDetails.swiftCode,
        RFCcode: paymentDetails.RFCcode,
        thirdPartyVendor: paymentDetails.thirdPartyVendor,
        accountName: paymentDetails.accountName
      });
    }
    if (paymentDetails.paymentFor === PAYMENT_FOR.vendor) {
      this.payConfirmationForm.patchValue({
        CLABE: paymentDetails.CLABE,
        RFCcode: paymentDetails.RFCcode,
        sortCode: paymentDetails.sortCode,
        ABAcode: paymentDetails.abaCode,
        swiftCode: paymentDetails.swiftCode,
        accountName: paymentDetails.accountName
      });
    }
    if (paymentDetails.paymentFor === PAYMENT_FOR.location && !paymentDetails.isBeneficiary) {
      this.payConfirmationForm.patchValue({
        address: paymentDetails.address,
        CLABE: paymentDetails.CLABE,
      });
    }
    if (paymentDetails.operationId === OPERATION_TYPES_ARR[2].id) {
      this.payConfirmationForm.patchValue({
        chequeNumber: paymentDetails.chequeNumber,
        chequeBankName: paymentDetails.chequeBankName,
        chequeDate: paymentDetails.chequeDate,
      });
    } else if (paymentDetails.operationId === OPERATION_TYPES_ARR[3].id) {
      this.payConfirmationForm.patchValue({
        wireTransactionNumber: paymentDetails.wireTransactionNumber,
        wireTransactionBankName: paymentDetails.wireTransactionBankName,
        wireTransactionDate: paymentDetails.wireTransactionDate,
      });
    }
    this.checkModeOfPayment(paymentDetails.operationId);
    this.payConfirmationClassicModal.show();
    this.payModalFlag = true;
  }
  /**
   * It binds values of received data to edit schedule form.
   * @param paymentDetails object of payment details received fo=rom service
   * @param paymentFor type of payment record, ie: freelancer, vendor, location or advance
   */
  setScheduleFormDetails(paymentDetails, paymentFor) {
    this.editScheduleForm.reset();
    this.editScheduleForm.patchValue({
      invoiceNumber: paymentDetails.invoiceNo,
      supplierName: paymentDetails.supplierName,
      invoiceDate: paymentDetails.invoiceDate,
      invoiceAmount: paymentDetails.invoiceAmount,
      paymentId: paymentDetails.paymentId,
      paymentAmount: paymentDetails.paymentAmount,
      scheduleDate: paymentDetails.scheduleDate,
      thirdPartyVendor: paymentDetails.thirdPartyVendor,
      paymentFor: paymentFor,
      consecutiveNumber: paymentDetails.consecutiveNumber,
      purchaseOrderNumber: paymentDetails.purchaseOrderNumber,
      RFCcode: paymentDetails.RFCcode

    });
  }
  /**
 * Checks Modal open event
 * @param modalFlag as to check modal onShow or onHide
 */
  checkModalOpen(modalFlag, modalName) {
    if (modalFlag && modalName === 'pay') {
      this.payModalOpen = true;
    } else {
      this.payModalOpen = false;
    }
    if (modalFlag && modalName === 'edit') {
      this.editModalOpen = true;
    } else {
      this.editModalOpen = false;
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
    * Navigates to view invoice screen with particulat invoice Id data
    * @param invoiceId for which the invoice needs to be viewed
    * @param poId to get invoice PO details
    */
  viewInvoice(invoiceFileUrl) {
    // const path = Common.sprintf(ROUTER_LINKS_FULL_PATH.viewInvoice, [invoiceId]);
    // window.open(window.location.origin + path);
    // window.open(invoiceFileUrl, '_blank').focus();
    if (invoiceFileUrl) {
      Common.downloadFile(invoiceFileUrl);
    }
  }

  /**
* checks weather total requested amount is NAN if yes then it sets to 0
*/
  checkAmount() {
    if (isNaN(this.editScheduleForm.value.paymentAmount)) {
      this.editScheduleForm.controls['paymentAmount'].setValue(0);
    }
  }
  /**
   *  It checks the total history amount and compares with invoice amount and sets required flag
   */
  checkPaymentAmount(reqPaymentDetail) {
    const formvalue = this.editScheduleForm.value;
    if (this.paymentsHistory && this.paymentsHistory.length > 0) {
      this.amount = parseFloat(this.invoiceAmount) - parseFloat(this.paymentHistoryTotal);
      if (formvalue.paymentAmount > this.amount) {
        this.showMsg = true;
      } else {
        this.showMsg = false;
      }
    } else if (formvalue.paymentAmount > parseFloat(this.invoiceAmount)) {
      this.showMsg = true;
    } else {
      this.showMsg = false;
    }
    this.checkAmount();
    if (reqPaymentDetail.paymentFor == PURCHASE_ORDER_TYPES_CONST.talent) {
    this.calculateAllAmounts();
    } else {
      this.updateVatWitholding();
      this.updateISRWitholding();
      this.updateVat();
      this.updatePayableAmount();
    }
  }

calculateAllAmounts() {
  this.updateAgencyFeeAmount();
  this.updateMarkupAmount();
  this.updateIvaAmount();
  this.updateTalentPayableAmount();
}

  updateMarkupAmount() {
    const formValue = this.editScheduleForm.value;
    this.markupAmount = 0;
    this.markupAmount = ((parseFloat(formValue.paymentAmount) + parseFloat(this.agencyFeeAmount)) * (parseFloat(this.paymentInvoiceData.percentMarkup) / 100));
    // formValue.percentMarkup = (formValue.percentMarkup) ? parseFloat(formValue.percentMarkup) : 0;
    // this.manageInvoiceForm.controls['percentMarkup'].setValue(formValue.percentMarkup);
  }
  updateAgencyFeeAmount() {
    const formValue = this.editScheduleForm.value;
    this.agencyFeeAmount = 0;
    this.agencyFeeAmount = (parseFloat(formValue.paymentAmount) * (parseFloat(this.paymentInvoiceData.percentAgencyFee) / 100));
  }
  updateIvaAmount() {
    const formValue = this.editScheduleForm.value;
    this.cost = (parseFloat(formValue.paymentAmount) + parseFloat(this.agencyFeeAmount));
    this.ivaAmount = 0;
    this.ivaAmount = (parseFloat(this.cost) * (parseFloat(this.paymentInvoiceData.iva) / 100));
  }
  /**
   * It updates the VAT amount wrt VAT%
   */
  updateVat() {
    const formvalue = this.editScheduleForm.value;

    if (formvalue.paymentAmount && this.paymentInvoiceData.vat) {
      const invoiceAmountFlag = isNaN(formvalue.paymentAmount);
      const invoiceVatFlag = isNaN(this.paymentInvoiceData.vat);
      if (!invoiceAmountFlag && !invoiceVatFlag) {
        this.vatAmt = (parseFloat(formvalue.paymentAmount) * parseFloat(this.paymentInvoiceData.vat)) / 100;
      } else {
        this.vatAmt = 0;
      }
    } else {
      this.vatAmt = 0;
    }
  }

  updateTalentPayableAmount() {
    const formValue = this.editScheduleForm.value;
    this.payableAmount = 0;
    const amount = (formValue.paymentAmount) ? parseFloat(formValue.paymentAmount) : 0;
    const agencyFee = (this.agencyFeeAmount) ? parseFloat(this.agencyFeeAmount) : 0;
    const iva = (this.ivaAmount) ? parseFloat(this.ivaAmount) : 0;
    const markup = (this.markupAmount) ? parseFloat(this.markupAmount) : 0;
    this.payableAmount = amount + agencyFee + iva + markup;
  }

  updatePayableAmount() {
    const formvalue = this.editScheduleForm.value;

    if (formvalue.paymentAmount) {
      this.payableAmount = (parseFloat(formvalue.paymentAmount) + this.vatAmt) - (this.isrWitholdingAmt + this.vatWitholdingAmt);
    } else {
      this.payableAmount = 0;
    }
  }

  /**
   * It updates the VATWitholding amount wrt VATWitholding%
   */
  updateVatWitholding() {
    const formvalue = this.editScheduleForm.value;
    if (formvalue.paymentAmount && this.paymentInvoiceData.vatWithHolding) {
      const invoiceAmountFlag = isNaN(formvalue.paymentAmount);
      const invoiceVatFlag = isNaN(this.paymentInvoiceData.vatWithHolding);
      if (!invoiceAmountFlag && !invoiceVatFlag) {
        this.vatWitholdingAmt = (parseFloat(formvalue.paymentAmount) * parseFloat(this.paymentInvoiceData.vatWithHolding)) / 100;
      } else {
        this.vatWitholdingAmt = 0;
      }
    } else {
      this.vatWitholdingAmt = 0;
    }
  }

  /**
   * It updates the ISRWitholding amount wrt ISRWitholding%
   */
  updateISRWitholding() {

    const formvalue = this.editScheduleForm.value;
    if (formvalue.paymentAmount && this.paymentInvoiceData.isrWithHolding) {
      const invoiceAmountFlag = isNaN(formvalue.paymentAmount);
      const invoiceVatFlag = isNaN(this.paymentInvoiceData.isrWithHolding);
      if (!invoiceAmountFlag && !invoiceVatFlag) {
        this.isrWitholdingAmt = (parseFloat(formvalue.paymentAmount) * parseFloat(this.paymentInvoiceData.isrWithHolding)) / 100;
      } else {
        this.isrWitholdingAmt = 0;
      }
    } else {
      this.isrWitholdingAmt = 0;
    }
  }

  /**
   * It closes the pop-up and sets all flags to default as required
   * @param modalName for which modal to close
   */
  closeModal(modalName) {
    this.documents.attachmentDocs = [];
    this.documentsAttached.queue = [];
    if (modalName === this.editSchedule) {
      this.editScheduleClassicModal.hide();
      this.modelFor = '';
      this.editModalFlag = false;
      this.enableSaveButtonFlag = true;
      this.submitEditScheduleForm = false;
    } else if (modalName === this.payConfirmation) {
      this.payConfirmationClassicModal.hide();
      this.modelFor = '';
      this.payModalFlag = false;
      this.enableSaveButtonFlag = true;
      this.enablePayConfimationSaveButtonFlag = false;
      this.submitPayConfirmationForm = false;
    }
  }

  /**
   * It opens the alert box when payment is cancled to confirm it. and once done, cancels the payment
   * @param payment for which payment needs to be cancelled
   */
  cancelPayment(payment) {
    if (payment.canCancel) {
      const swalObj = Common.swalConfirmPopupObj(this.paymentDeleteConfirmation, true, true, this.commonLabelsObj.labels.yes,
        this.commonLabelsObj.labels.cancelDelete, '', this.commonLabelsObj.labels.confirmationMsg);
      swal(swalObj, (isConfirm) => {
        if (isConfirm) {
          this._PaymentsListingService.cancelPayment(payment.paymentId).subscribe((response: any) => {
            if (response && response.header) {
              if (Common.checkStatusCode(!(response.header.statusCode))) {
                swal(this.commonLabelsObj.labels.error, this.commonLabelsObj.labels.error, 'error');
              } else {
                this.toastrService.success(response.header.message);
                this.search();
              }
            }
          }, err => {
            swal(this.commonLabelsObj.labels.cancelled, this.commonLabelsObj.errorMessages.paymentNotCancelled, 'error');
          });
        }
      }, function (dismiss) {
      });
    }
  }

  /**
   * It is called when edit schedule form is submitted and sends required data to the service
   **/
  submitEditSchedule() {
    this.submitEditScheduleForm = true;
    if (this.editScheduleForm.valid) {
      this.enableEditScheduleSaveButtonFlag = true;
      this.spinnerFlag = true;
      const formValue = this.editScheduleForm.value;
      formValue.langCode = this.sessionService.getCookie(COOKIES_CONSTANTS.langCode);
      this.finalPayConfirmationData = PaymentsListData.setSchedulePaymentDetails(formValue);
      this._PaymentsListingService.updateSchedule(formValue.paymentId, this.finalPayConfirmationData).subscribe((response: any) => {
        if (response && response.header) {
          if (Common.checkStatusCodeInRange(response.header.statusCode)) {
            this.toastrService.success(response.header.message);
            this.spinnerFlag = false;
            this.editScheduleClassicModal.hide();
            this.search();
          } else {
            this.toastrService.error(response.header.message);
            this.spinnerFlag = false;
            this.enableEditScheduleSaveButtonFlag = false;
          }
        }
      }, error => {
        this.toastrService.error(this.commonLabelsObj.errorMessages.error);
        this.spinnerFlag = false;
        this.enableEditScheduleSaveButtonFlag = false;
      });
    }
  }


  /**
   * It is called when pay confirmation form is submitted and sends required data to the service
   */
  submitPayConfimation() {
    this.submitPayConfirmationForm = true;
    if (this.payConfirmationForm.valid) {
      this.enablePayConfimationSaveButtonFlag = true;
      this.showLoaderOnSaveButtonFlag = true;
      const formValue = this.payConfirmationForm.value;
      formValue.langCode = this.sessionService.getCookie(COOKIES_CONSTANTS.langCode);
      this.finalPayConfirmationData = PaymentsListData.setPayConfirmationDetails(formValue, this.documents.attachmentDocs);
      this._PaymentsListingService.payConfirmation(formValue.paymentId, this.finalPayConfirmationData).subscribe((response: any) => {
        if (response && response.header) {
          if (Common.checkStatusCodeInRange(response.header.statusCode)) {
            this.toastrService.success(response.header.message);
            this.showLoaderOnSaveButtonFlag = false;
            this.payConfirmationClassicModal.hide();
            this.search();
          } else {
            this.toastrService.error(response.header.message);
            this.enablePayConfimationSaveButtonFlag = false;
            this.showLoaderOnSaveButtonFlag = false;
          }
        }
      }, error => {
        this.toastrService.error(this.commonLabelsObj.errorMessages.error);
        this.enablePayConfimationSaveButtonFlag = false;
        this.showLoaderOnSaveButtonFlag = false;
      });
    }
  }

  /**
   * It removes uploaded files from the array
   * @param index for which files to be removed
   */
  removeFiles(index, item) {
      const swalObj = Common.swalConfirmPopupObj(this.commonLabelsObj.labels.deleteAdvanceMsg, true, true);
    swal(swalObj, (isConfirm) => {
      if (isConfirm) {
        item.remove();
        this.documents.attachmentDocs.splice(index, 1);
      }
    });
  }

  /**
   * It adds uploaded files in the array
   */
  addFiles() {
    this.enableSaveButtonFlag = false;
    this.enablePayConfimationSaveButtonFlag = true;
    this.checkDocumentValidation();
  }

  /**
   * It validates the documents before uploading
   */
  checkDocumentValidation() {
    this.filesCounter = 0;
    this.filesReceived = this.documentsAttached.queue.length;
    let totalAttachFileSize = 0;
    // tslint:disable-next-line:forin
    for (const i in this.documentsAttached.queue) {
      totalAttachFileSize = totalAttachFileSize + this.documentsAttached.queue[i].file.size;
    }
    if (totalAttachFileSize > FILE_SIZE.FIFTYMB) {
      this.toastrService.error(this.commonLabelsObj.errorMessages.documentLessThan50);
      for (let i = 0; i < this.documentsAttached.queue.length; i++) {
        if (!this.documentsAttached.queue[i].url) {
          this.documentsAttached.queue[i].remove();
          i--;
        }
      }
      this.enableSaveButtonFlag = true;
      this.enablePayConfimationSaveButtonFlag = true;
    } else {
      for (let i = 0; i < this.documentsAttached.queue.length; i++) {
        const filesize = this.documentsAttached.queue[i].file.size;
        if (filesize > FILE_SIZE.TENMB) {
          this.toastrService.error(this.commonLabelsObj.errorMessages.documentLessThan10);
          this.documentsAttached.queue[i].remove();
          i--;
          this.filesCounter++;
          if (this.filesCounter === this.filesReceived) {
            this.enableSaveButtonFlag = true;
            this.enablePayConfimationSaveButtonFlag = true;
          }
        }
        else {
          const file = this.documentsAttached.queue[i]._file;
          const type = Common.getFileType(file);
          if (!this.documentsAttached.queue[i].url) {
            if (!this.documentsAttached.queue[i].url && !this.documentsAttached.queue[i]['inProgress']) {
            if (!Common.checkFileType(type)) {
              this.toastrService.error(this.commonLabelsObj.errorMessages.invalidFileType);
              this.documentsAttached.queue[i].remove();
              i--;
              this.filesCounter++;
              if (this.filesCounter === this.filesReceived) {
                this.enableSaveButtonFlag = true;
                this.enablePayConfimationSaveButtonFlag = true;
              }
            } else {
              const formData = Common.setFormData(file);
              this.documentsAttached.queue[i]['inProgress'] = true;
              this.uploadFile(formData, true, this.documentsAttached.queue[i], i);
            }
          }
          } else {
            this.filesCounter++;
            if (this.filesCounter === this.filesReceived) {
              this.enableSaveButtonFlag = true;
              this.enablePayConfimationSaveButtonFlag = true;
            }
          }
        }
      }
    }
  }

  /**
   * It uploads the document after validation
   * @param formData as file data
   * @param isDocument as document flag
   * @param obj as file object
   * @param index as at what index file is uploaded
   */
  uploadFile(formData, isDocument, obj: any = {}, index: any = 0) {

    this._sharedService.uploadFile(formData).subscribe((imageResponse: any) => {
      if (imageResponse && imageResponse.header) {
        if (Common.checkStatusCode(imageResponse.header.statusCode)) {
          const data = imageResponse.payload.result;
          if (isDocument) {
            obj.url = data.url;
            this.setDocumentId(data.id);
            delete obj['inProgress'];
          }
        } else {
          if (imageResponse.header) {
            this.toastrService.error(imageResponse.header.message);
          } else {
            this.toastrService.error(imageResponse.header.message);
          }
        }
      }
      this.filesCounter++;
      if (this.filesCounter === this.filesReceived) {
        this.enableSaveButtonFlag = true;
        this.enablePayConfimationSaveButtonFlag = false;

      }
    },
      error => {
        this.toastrService.error(this.commonLabelsObj.errorMessages.error);
        this.filesCounter++;
        if (this.filesCounter === this.filesReceived) {
          this.enableSaveButtonFlag = true;
          this.enablePayConfimationSaveButtonFlag = false;
        }
      });
  }

  /**
   * It sets the document Id of uploaded file in the local array
   * @param documentId as document id in attachmentdocs
   */
  setDocumentId(documentId) {
    this.documents.attachmentDocs.push(documentId);
  }
  removedProject() {
    this.budgetList = [];
  }
}
