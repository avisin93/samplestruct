import { Component, OnInit, ViewEncapsulation, HostListener, OnDestroy } from '@angular/core';
import { CustomValidators, Common, NavigationService, SessionService } from '@app/common';
import { PURCHASE_ORDER_TYPE, ROUTER_LINKS, PAYMENT_TYPES_CONST, INVOICE_STATUS, COOKIES_CONSTANTS, defaultDatepickerOptions, ROUTER_LINKS_FULL_PATH, PAYEE_ACCOUNT_INFO, MODULE_ID } from '../../../config';
import { PAYMENT_TYPES_CONST as PAYMENT_TYPES } from '../constants'
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ManagePaymentData } from './manage-payment.data.model'
import { ManagePaymentService } from './manage-payment.services';
import { SharedService } from '@app/shared/shared.service';
import { HttpParams } from '@angular/common/http';
import { INVOICE_PAYMENT_TYPES, PAYMENT_STATUS } from './constants';
import { ToastrService } from 'ngx-toastr';
import { ShowTwoDecimalPipe } from '@app/shared/pipes';
import { SharedData } from '@app/shared/shared.data';
declare var $: any;
@Component({
  selector: 'app-manage-payment',
  templateUrl: './manage-payment.component.html',
  styleUrls: ['./manage-payment.component.scss']
})
export class ManagePaymentComponent implements OnInit, OnDestroy {
  ROUTER_LINKS = ROUTER_LINKS;
  PAYMENT_TYPES_CONST = PAYMENT_TYPES_CONST;
  INVOICE_PAYMENT_TYPES = INVOICE_PAYMENT_TYPES;
  PAYEE_ACCOUNT_INFO = PAYEE_ACCOUNT_INFO;
  datePickerOptions = JSON.parse(JSON.stringify(defaultDatepickerOptions));
  managePaymentForm: FormGroup;
  partialPaymentFlag: Boolean = false;
  submitPaymentForm: Boolean = false;
  showISRMsg: Boolean = false;
  showVATMsg: Boolean = false;
  paymentAmount: any = 1000;
  showMsg: Boolean = false;
  renderPage: Boolean = false;
  PURCHASE_ORDER_TYPE = PURCHASE_ORDER_TYPE;
  invoiceId: any;
  paymentInvoiceDetails: any;
  paymentInvoiceData: any;
  operationDropdown: any[];
  operation: any[];
  paymentsHistory: any;
  paymentsHistoryKeyArr: any[];
  vatWitholdingAmt: any = 0;
  isrWitholdingAmt: any = 0;
  amount: number;
  paymentHistoryTotal: any = 0;
  tempVat: any = 0;
  tempISR: any = 0;
  tempSimpleVat: any = 0;
  detailsVatWitholdingAmt: any = 0;
  detailsVATAmt: any = 0;
  vatAmt: any = 0;
  detailsISRWitholdingAmt: any = 0;
  paymentISRTotal: any = 0;
  paymentVatTotal: any = 0;
  paymentSimpleVatTotal: any = 0;
  vatAmount: any = 0;
  vatISRAmount: any = 0;
  disableSaveButtonFlag: Boolean = false;
  showSimpleVATMsg: Boolean = false;
  spinnerFlag: Boolean = false;
  transFormedValue: any;
  transFormedISRValue: any;
  transVatFormedValue: any;
  projectID: {};
  PAYMENT_STATUS = PAYMENT_STATUS;
  budgetId: any;
  breadcrumbData: any = {
    title: 'payments.labels.managePaymentsTitle',
    subTitle: 'payments.labels.addPaymentsSub',
    data: [{
      text: 'common.labels.home',
      link: '/'
    },
    {
      text: 'payments.labels.paymentsList',
      link: ROUTER_LINKS.payments
    },
    {
      text: 'payments.labels.managePaymentsTitle',
      link: ''
    }
    ]
  };
  fixedInvoiceAmount: any;
  showMasterInvoiceListingBackToList: Boolean = false;
  paymentModulePermissions: any = {};
  markupAmount: any;
  agencyFeeAmount: any;
  ivaAmount: any;
  cost: any;
  detailsAgencyAmt: any;
  detailsIVAAmount: any;
  detailsMarkupAmount: any;


  constructor(private router: Router, private _sharedService: SharedService,
    private route: ActivatedRoute, private fb: FormBuilder,
    private navigationService: NavigationService,
    private _paymentService: ManagePaymentService,
    public sessionService: SessionService,
    private toastrService: ToastrService,
    private _twoDecimal: ShowTwoDecimalPipe,
    private sharedData: SharedData, ) {
    this.datePickerOptions.disableUntil = { year: Common.getTodayDate().getFullYear(), month: Common.getTodayDate().getMonth() + 1, day: Common.getTodayDate().getDate() - 1 }
  }

  ngOnInit() {
    $('#invoice-tab').addClass('active');
    $('.currency-dropdown').hide();
    this.setPaymentModulePermissions();
    // this.projectID = this.sessionService.getLocalStorageItem('projectID');
    this.partialPaymentFlag = false;
    this.projectID = this.route.snapshot.queryParams['projectId'];
    this.budgetId = this.route.snapshot.queryParams['budgetId'];
    this.route.params.subscribe(params => {
      this.invoiceId = params['id'];
      if (params.data === 'masterInvoiceListing') {
        this.showMasterInvoiceListingBackToList = true;
      }
    });
    this.getInvoice();
    this.getModesOfOperation();

  }
  /* method to set role permissions  */
  setPaymentModulePermissions() {
    const permissionObj = this.sharedData.getRolePermissionData();
    this.paymentModulePermissions = permissionObj[MODULE_ID.payments];
  }
  /* method to set role permissions  */
  ngOnDestroy() {
    $('#invoice-tab').removeClass('active');
    $('.currency-dropdown').show();
    this.showMasterInvoiceListingBackToList = false;
  }
  /* Get Invoice data*/
  getInvoice() {
    this._paymentService.getInvoiceData(this.invoiceId).subscribe((response: any) => {
      if (Common.checkStatusCode(response.header.statusCode)) {
        this.paymentInvoiceDetails = response.payload.result;
        this.paymentInvoiceData = ManagePaymentData.getFormDetails(this.paymentInvoiceDetails);
        this.fixedInvoiceAmount = this.paymentInvoiceData.invoiceAmount;
        this.createAddForm();
        this.getPaymentsHistory();
        this.paymentTypeChanged();

        this.setInvoiceFormData(this.paymentInvoiceData);
      } else {
        this.paymentInvoiceDetails = '';
      }
    }, error => {
      this.paymentInvoiceDetails = '';
    });
  }
  /* Get Invoice data*/

  /* Get Mode of operation*/
  getModesOfOperation() {
    this._sharedService.getModesOfOperation().subscribe((data: any) => {
      if (Common.checkStatusCodeInRange(data.header.statusCode)) {
        if (data.payload && data.payload.results) {
          this.operationDropdown = [];
          this.operationDropdown = data.payload.results;
          this.operation = Common.getMultipleSelectArr(this.operationDropdown, ['id'], ['i18n', 'name']);
        } else {
          this.operationDropdown = [];
        }
      } else {
        this.operationDropdown = [];
      }
    }, error => {
      this.operationDropdown = [];
    });
  }
  /* Get Mode of operation*/

  /* Get payment histroy*/
  getPaymentsHistory() {
    let params: HttpParams = new HttpParams();
    params = params.append('invoiceId', this.invoiceId);
    // if (this.invoiceId) {
    //   params = params.append('excludePaymentId', this.paymentInvoiceData.paymentId);
    // }
    this._paymentService.getPaymentHistoryList(params).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        this.paymentsHistory = response.payload.results;
        this.paymentsHistoryKeyArr = Common.keyValueDropdownArr(PAYMENT_STATUS, 'id', 'text');
        this.paymentsHistory.forEach(obj => {
          this.paymentHistoryTotal = this.paymentHistoryTotal + obj.amount;
        });
        this.updateInvoiceAmount();
        this.renderPage = true;
      } else {
        this.paymentsHistory = [];
      }
    })
  }
  /* Get payment histroy*/

  /* Update amount to be paid*/
  updateInvoiceAmount() {
    if (this.paymentsHistory.length > 0) {
      this.paymentInvoiceData.invoiceAmount = (this.paymentInvoiceData.invoiceAmount - this.paymentHistoryTotal).toFixed(2);
      this.setInvoiceFormData(this.paymentInvoiceData);
    }
  }
  /* Update amount to be paid*/

  /* Set nvoie data amount to be paid*/
  setInvoiceFormData(paymentFormDetails) {
    this.managePaymentForm.patchValue({
      paymentAmount: paymentFormDetails.invoiceAmount ? paymentFormDetails.invoiceAmount : 0,
      installmentType: paymentFormDetails.installmentType || paymentFormDetails.installmentType == 0 ? JSON.stringify(paymentFormDetails.installmentType) : 0,

    });

    if (this.paymentInvoiceData && (this.paymentInvoiceData.payeeAccountInfoFor || this.paymentInvoiceData.payeeAccountInfoFor == 0)) {
      // this.paymentInvoiceData.payeeAccountInfoFor= 5;
      switch (this.paymentInvoiceData.payeeAccountInfoFor) {
        case PAYEE_ACCOUNT_INFO.freelancer:
          this.setPayeeFreelancer(paymentFormDetails);
          break;
        case PAYEE_ACCOUNT_INFO.vendor:
          this.setPayeeVendor(paymentFormDetails);
          break;
        case PAYEE_ACCOUNT_INFO.location:
          this.setPayeelocation(paymentFormDetails);
          break;
        case PAYEE_ACCOUNT_INFO.individual:
          this.setPayeeTalent(paymentFormDetails);
          break;
        case PAYEE_ACCOUNT_INFO.agency:
          this.setPayeeTalent(paymentFormDetails);
          break;
      }
    }


    this.updateDefaultVatWitholding();
    this.updateDefaultISRWitholding();
    this.updateDefaultVat();
    this.updateDefaultAgencyFee();
    this.updateDefaultMarkupFee();
    this.updateDefaultIVA();
    this.updateVatWitholding();
    this.updateISRWitholding();
    this.calculateAllAmounts();
    this.updateVat();
  }

  calculateAllAmounts() {
    this.updateAgencyFeeAmount();
    this.updateMarkupAmount();
    this.updateIvaAmount();
  }
  /* Set nvoie data amount to be paid*/

  /* Dynamic FormGroups creation for payee account info */
  setPayeelocation(paymentFormDetails) {
    const payeeLocationFrmGrp = <FormGroup>this.managePaymentForm.controls['locationPayeeInfo'];
    payeeLocationFrmGrp.patchValue({
      accountNumber: paymentFormDetails.accountNumber ? paymentFormDetails.accountNumber : '',
      bankName: paymentFormDetails.bankName ? paymentFormDetails.bankName : '',
      address: paymentFormDetails.address ? paymentFormDetails.address : '',
      branch: paymentFormDetails.branch ? paymentFormDetails.branch : '',
      clabe: paymentFormDetails.clabe ? paymentFormDetails.clabe : '',
      rfcCode: paymentFormDetails.rfcCode ? paymentFormDetails.rfcCode : '',
    })
  }
  setPayeeFreelancer(paymentFormDetails) {
    const payeeFreelancerFrmGrp = <FormGroup>this.managePaymentForm.controls['freelancerPayeeInfo'];
    payeeFreelancerFrmGrp.patchValue({
      accountNumber: paymentFormDetails.accountNumber ? paymentFormDetails.accountNumber : '',
      bankName: paymentFormDetails.bankName ? paymentFormDetails.bankName : '',
      clabe: paymentFormDetails.clabe ? paymentFormDetails.clabe : '',
      rfcCode: paymentFormDetails.rfcCode ? paymentFormDetails.rfcCode : '',
      address: paymentFormDetails.address ? paymentFormDetails.address : '',
      branch: paymentFormDetails.branch ? paymentFormDetails.branch : '',
    });
  }

  setPayeeTalent(paymentFormDetails) {
    const payeeTalentFrmGrp = <FormGroup>this.managePaymentForm.controls['talentPayeeInfo'];
    payeeTalentFrmGrp.patchValue({
      accountNumber: paymentFormDetails.accountNumber ? paymentFormDetails.accountNumber : '',
      bankName: paymentFormDetails.bankName ? paymentFormDetails.bankName : '',
      clabe: paymentFormDetails.clabe ? paymentFormDetails.clabe : '',
      rfcCode: paymentFormDetails.rfcCode ? paymentFormDetails.rfcCode : '',
      address: paymentFormDetails.address ? paymentFormDetails.address : '',
      accName: paymentFormDetails.accountName ? paymentFormDetails.accountName : '',
      branch: paymentFormDetails.branch ? paymentFormDetails.branch : '',
    });
  }
  setPayeeVendor(paymentFormDetails) {
    const payeeVendorFrmGrp = <FormGroup>this.managePaymentForm.controls['vendorPayeeInfo'];
    payeeVendorFrmGrp.patchValue({
      accountName: paymentFormDetails.accountName ? paymentFormDetails.accountName : '',
      accountNumber: paymentFormDetails.accountNumber ? paymentFormDetails.accountNumber : '',
      bankName: paymentFormDetails.bankName ? paymentFormDetails.bankName : '',
      branch: paymentFormDetails.branch ? paymentFormDetails.branch : '',
      clabe: paymentFormDetails.clabe ? paymentFormDetails.clabe : '',
      rfcCode: paymentFormDetails.rfcCode ? paymentFormDetails.rfcCode : '',
      sortCode: paymentFormDetails.sortCode ? paymentFormDetails.sortCode : '',
      mode: paymentFormDetails.modeofOperation ? paymentFormDetails.modeofOperation : '',
      abaCode: paymentFormDetails.abaCode ? paymentFormDetails.abaCode : '',
      swiftCode: paymentFormDetails.swiftCode ? paymentFormDetails.swiftCode : '',
    });
  }
  addPayeeInfoGroup(payeeType) {
    switch (payeeType) {
      case PURCHASE_ORDER_TYPE.freelancer:
        this.managePaymentForm.setControl('freelancerPayeeInfo', this.freelancerPayeeInfo());
        break;
      case PURCHASE_ORDER_TYPE.vendor:
        this.managePaymentForm.setControl('vendorPayeeInfo', this.vendorPayeeInfo())
        break;
      case PURCHASE_ORDER_TYPE.location:
        this.managePaymentForm.setControl('locationPayeeInfo', this.locationPayeeInfo())
        break;
      case PAYEE_ACCOUNT_INFO.individual:
        this.managePaymentForm.setControl('talentPayeeInfo', this.talentPayeeInfo())
        break;
      case PAYEE_ACCOUNT_INFO.agency:
        this.managePaymentForm.setControl('talentPayeeInfo', this.talentPayeeInfo())
        break;
    }
  }
  freelancerPayeeInfo(): FormGroup {
    return this.fb.group({
      accountNumber: ['', [CustomValidators.required]],
      bankName: ['', [CustomValidators.required]],
      clabe: ['', [CustomValidators.required]],
      rfcCode: ['', [CustomValidators.required]],
      address: ['', [CustomValidators.required]],
      branch: ['', [CustomValidators.required]]
    });
  }
  talentPayeeInfo(): FormGroup {
    return this.fb.group({
      accountNumber: ['', [CustomValidators.required]],
      accName: ['', [CustomValidators.required]],
      bankName: ['', [CustomValidators.required]],
      clabe: ['', [CustomValidators.required]],
      rfcCode: ['', [CustomValidators.required]],
      address: ['', [CustomValidators.required]],
      branch: ['', [CustomValidators.required]]
    });
  }
  vendorPayeeInfo(): FormGroup {
    return this.fb.group({
      accountName: ['', [CustomValidators.required]],
      accountNumber: ['', [CustomValidators.required]],
      bankName: ['', [CustomValidators.required]],
      branch: ['', [CustomValidators.required]],
      clabe: ['', [CustomValidators.required]],
      rfcCode: ['', [CustomValidators.required]],
      sortCode: ['', [CustomValidators.required]],
      mode: ['', [CustomValidators.required]],
      abaCode: ['', [CustomValidators.required]],
      swiftCode: ['', [CustomValidators.required]]
    });
  }
  locationPayeeInfo(): FormGroup {
    return this.fb.group({
      accountNumber: ['', [CustomValidators.required]],
      bankName: ['', [CustomValidators.required]],
      branch: ['', [CustomValidators.required]],
      address: ['', [CustomValidators.required]],
      clabe: ['', [CustomValidators.required]],
      rfcCode: ['', [CustomValidators.required]],
    });
  }
  /* Dynamic FormGroups creation for payee account info */

  /* Payment FormGroups creation */
  createAddForm() {
    this.managePaymentForm = this.managePaymentFormGroup();
    this.addPayeeInfoGroup(this.paymentInvoiceData.payeeAccountInfoFor);

  }
  managePaymentFormGroup(): FormGroup {
    return this.fb.group({
      installmentType: ['0'],
      paymentAmount: [''],
      schedulePaymentDate: ['', [CustomValidators.required]],
      modeOfPayment: ['', [CustomValidators.required]],
      notes: ['']
    });
  }

  /* Payment FormGroups creation */

  /* Payment Amount validation */
  checkPaymentAmount() {
    const formvalue = this.managePaymentForm.value;
    if (this.paymentsHistory.length > 0) {
      this.amount = parseFloat(this.fixedInvoiceAmount) - parseFloat(this.paymentHistoryTotal);
      if (formvalue.paymentAmount > this.amount) {
        this.showMsg = true;
      } else {
        this.showMsg = false;
      }
    } else {
      if (formvalue.paymentAmount > this.paymentInvoiceData.invoiceAmount) {
        this.showMsg = true;
      } else {
        this.showMsg = false;
      }
    }
    this.updateVatWitholding();
    this.updateISRWitholding();
    this.updateVat();
    this.calculateAllAmounts();
  }

  /* Payment Amount validation */

  /* Default VAT witholding calculation */
  updateDefaultVatWitholding() {
    if (this.fixedInvoiceAmount && this.paymentInvoiceData.vatWithHolding) {
      const invoiceAmountFlag = isNaN(this.fixedInvoiceAmount);
      const invoiceVatFlag = isNaN(this.paymentInvoiceData.vatWithHolding);
      if (!invoiceAmountFlag && !invoiceVatFlag) {
        this.detailsVatWitholdingAmt = (parseFloat(this.fixedInvoiceAmount) * parseFloat(this.paymentInvoiceData.vatWithHolding)) / 100;

      } else {
        this.detailsVatWitholdingAmt = 0;
      }
    } else {
      this.detailsVatWitholdingAmt = 0;
    }

  }
  /* Default VAT witholding calculation */

  /* Default ISR witholding calculation */
  updateDefaultISRWitholding() {
    if (this.fixedInvoiceAmount && this.paymentInvoiceData.isrWithHolding) {
      const invoiceAmountFlag = isNaN(this.fixedInvoiceAmount);
      const invoiceVatFlag = isNaN(this.paymentInvoiceData.isrWithHolding);
      if (!invoiceAmountFlag && !invoiceVatFlag) {
        this.detailsISRWitholdingAmt = (parseFloat(this.fixedInvoiceAmount) * parseFloat(this.paymentInvoiceData.isrWithHolding)) / 100;

      } else {
        this.detailsISRWitholdingAmt = 0;
      }
    } else {
      this.detailsISRWitholdingAmt = 0;
    }
  }
  /* Default ISR witholding calculation */

  /* Default VAT calculation */
  updateDefaultVat() {
    if (this.fixedInvoiceAmount && this.paymentInvoiceData.vat) {
      const invoiceAmountFlag = isNaN(this.fixedInvoiceAmount);
      const invoiceVatFlag = isNaN(this.paymentInvoiceData.vat);
      if (!invoiceAmountFlag && !invoiceVatFlag) {
        this.detailsVATAmt = (parseFloat(this.fixedInvoiceAmount) * parseFloat(this.paymentInvoiceData.vat)) / 100;

      } else {
        this.detailsVATAmt = 0;
      }
    } else {
      this.detailsVATAmt = 0;
    }
  }
  /* Default VAT calculation */

  /* VAT calculation on updated payment amount */
  updateVat() {
    const formvalue = this.managePaymentForm.value;

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
  /* VAT calculation on updated payment amount */

  /* VAT withholding on updated payment amount */
  updateVatWitholding() {

    const formvalue = this.managePaymentForm.value;
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
   * Calculate default agency fee
   */
  updateDefaultAgencyFee() {
    if (this.fixedInvoiceAmount && this.paymentInvoiceData.percentAgencyFee) {
      const invoiceAmountFlag = isNaN(this.fixedInvoiceAmount);
      const invoiceAgencyFlag = isNaN(this.paymentInvoiceData.percentAgencyFee);
      if (!invoiceAmountFlag && !invoiceAgencyFlag) {
        this.detailsAgencyAmt = (parseFloat(this.fixedInvoiceAmount) * parseFloat(this.paymentInvoiceData.percentAgencyFee)) / 100;

      } else {
        this.detailsAgencyAmt = 0;
      }
    } else {
      this.detailsAgencyAmt = 0;
    }
  }
  /**
  * Calculate default markup fee
  */
  updateDefaultMarkupFee() {
    if (this.fixedInvoiceAmount && this.paymentInvoiceData.percentMarkup) {
      const invoiceAmountFlag = isNaN(this.fixedInvoiceAmount);
      const invoiceMarkupFlag = isNaN(this.paymentInvoiceData.percentMarkup);
      if (!invoiceAmountFlag && !invoiceMarkupFlag) {
        this.detailsMarkupAmount = ((parseFloat(this.fixedInvoiceAmount) + parseFloat(this.detailsAgencyAmt)) * (parseFloat(this.paymentInvoiceData.percentMarkup) / 100));

      } else {
        this.detailsMarkupAmount = 0;
      }
    } else {
      this.detailsMarkupAmount = 0;
    }
  }
  /**
  * Calculate default agency fee
  */
  updateDefaultIVA() {
    if (this.fixedInvoiceAmount && this.paymentInvoiceData.iva) {
      const invoiceAmountFlag = isNaN(this.fixedInvoiceAmount);
      const invoiceivaFlag = isNaN(this.paymentInvoiceData.iva);
      if (!invoiceAmountFlag && !invoiceivaFlag) {
        this.detailsIVAAmount = ((parseFloat(this.fixedInvoiceAmount) + parseFloat(this.detailsAgencyAmt)) * (parseFloat(this.paymentInvoiceData.iva) / 100));

      } else {
        this.detailsIVAAmount = 0;
      }
    } else {
      this.detailsIVAAmount = 0;
    }
  }
  updateMarkupAmount() {
    const formValue = this.managePaymentForm.value;
    this.markupAmount = 0;
    if (formValue.paymentAmount) {
      this.markupAmount = ((parseFloat(formValue.paymentAmount) + parseFloat(this.agencyFeeAmount)) * (parseFloat(this.paymentInvoiceData.percentMarkup) / 100));
    } else {
      this.markupAmount = 0;
    }
  }
  updateAgencyFeeAmount() {
    const formValue = this.managePaymentForm.value;
    this.agencyFeeAmount = 0;
    if (formValue.paymentAmount) {
      this.agencyFeeAmount = (parseFloat(formValue.paymentAmount) * (parseFloat(this.paymentInvoiceData.percentAgencyFee) / 100));
    } else {
      this.agencyFeeAmount = 0;
    }
  }
  updateIvaAmount() {
    const formValue = this.managePaymentForm.value;
    if (formValue.paymentAmount) {
      this.cost = (parseFloat(formValue.paymentAmount) + parseFloat(this.agencyFeeAmount));
      this.ivaAmount = 0;
      this.ivaAmount = (parseFloat(this.cost) * (parseFloat(this.paymentInvoiceData.iva) / 100));
    } else {
      this.ivaAmount = 0;
    }

  }
  /* VAT withholding on updated payment amount */

  /* ISR withholding on updated payment amount */
  updateISRWitholding() {

    const formvalue = this.managePaymentForm.value;
    if (formvalue.paymentAmount && this.paymentInvoiceData.isrWithHolding) {
      const invoiceAmountFlag = isNaN(formvalue.paymentAmount);
      const invoiceVatFlag = isNaN(this.paymentInvoiceData.isrWithHolding);
      if (!invoiceAmountFlag && !invoiceVatFlag) {
        this.isrWitholdingAmt = (parseFloat(formvalue.paymentAmount) * parseFloat(this.paymentInvoiceData.isrWithHolding)) / 100;

      } else {
        this.isrWitholdingAmt = 0;
      }
    }
  }
  /* ISR withholding on updated payment amount */

  /* Updates field validation on full and partial selection */
  paymentTypeChanged() {
    this.showMsg = false;
    if (this.managePaymentForm.value.installmentType == INVOICE_PAYMENT_TYPES.partial) {
      this.managePaymentForm.controls['paymentAmount'].setValidators([CustomValidators.requiredNumber, CustomValidators.checkDecimal]);
    }
    else {
      this.managePaymentForm.controls['paymentAmount'].setValidators([]);
      this.managePaymentForm.patchValue({
        paymentAmount: this.paymentInvoiceData.invoiceAmount
      })
    }
    this.managePaymentForm.controls['paymentAmount'].updateValueAndValidity();
  }
  /* Updates field validation on full and partial selection */

  /* Updates field validation for payee info fields */
  checkInvoiceTyepOnSave() {
    const payeeVendorFrmGrp = <FormGroup>this.managePaymentForm.controls['vendorPayeeInfo'];
    if (this.paymentInvoiceData.payeeAccountInfoFor == PURCHASE_ORDER_TYPE.location) {
      const payeeLocationFrmGrp = <FormGroup>this.managePaymentForm.controls['locationPayeeInfo'];
      if (!this.paymentInvoiceData.isScouterBeneficiary) {
        payeeLocationFrmGrp.controls['rfcCode'].setValidators(null);
        payeeLocationFrmGrp.controls['rfcCode'].updateValueAndValidity();
      }
    }
    if (this.paymentInvoiceData.paymentType == PAYMENT_TYPES_CONST.domestic) {
      payeeVendorFrmGrp.controls['abaCode'].setValidators(null);
      payeeVendorFrmGrp.controls['abaCode'].updateValueAndValidity();
      payeeVendorFrmGrp.controls['swiftCode'].setValidators(null);
      payeeVendorFrmGrp.controls['swiftCode'].updateValueAndValidity();
    }
    if (this.paymentInvoiceData.paymentType == PAYMENT_TYPES_CONST.international) {
      payeeVendorFrmGrp.controls['clabe'].setValidators(null);
      payeeVendorFrmGrp.controls['clabe'].updateValueAndValidity();
      payeeVendorFrmGrp.controls['rfcCode'].setValidators(null);
      payeeVendorFrmGrp.controls['rfcCode'].updateValueAndValidity();
      payeeVendorFrmGrp.controls['sortCode'].setValidators(null);
      payeeVendorFrmGrp.controls['sortCode'].updateValueAndValidity();
    }

    if (this.paymentInvoiceData.payeeAccountInfoFor == PURCHASE_ORDER_TYPE.vendor) {
      this.managePaymentForm.controls['modeOfPayment'].setValidators(null);
      this.managePaymentForm.controls['modeOfPayment'].updateValueAndValidity();
    }

  }
  /* Updates field validation for payee info fields */

  /* Saves payment  form*/
  savePayment() {
    this.checkInvoiceTyepOnSave();
    this.spinnerFlag = true;
    this.submitPaymentForm = true;
    // this.paymentInvoiceData.payeeAccountInfoFor = 5;

    if (this.managePaymentForm.valid && !this.showMsg) {
      this.disableSaveButtonFlag = true;
      const formvalue = this.managePaymentForm.value;
      if (this.paymentsHistory.length > 0) {
        formvalue['installmentType'] = 1;
      }
      formvalue['langCode'] = this.sessionService.getCookie(COOKIES_CONSTANTS.langCode);
      formvalue['invoiceId'] = this.invoiceId;
      const finalPaymentData = ManagePaymentData.setFormDetails(formvalue, this.paymentInvoiceData);
      this._paymentService.postPaymentDetails(finalPaymentData).subscribe((response: any) => {
        if (Common.checkStatusCodeInRange(response.header.statusCode)) {
          const navigationUrl = ROUTER_LINKS_FULL_PATH.payments;
          this.navigationService.navigate(navigationUrl).then(() => {
            this.spinnerFlag = false;
            this.disableSaveButtonFlag = false;
            this.toastrService.success(response.header.message);
          });
        } else {
          this.spinnerFlag = false;
          this.disableSaveButtonFlag = false;
          this.toastrService.error(response.header.message);
        }
      }, error => {
        this.spinnerFlag = false;
        this.disableSaveButtonFlag = false;
      });


    }
    else {
      this.spinnerFlag = false;
      let target;
      for (var i in this.managePaymentForm.controls) {
        if (!this.managePaymentForm.controls[i].valid) {
          target = this.managePaymentForm.controls[i];
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

    }
  }
  /* Saves payment  form*/

  /* Cancels payment  form*/
  navigateTo() {
    if (this.showMasterInvoiceListingBackToList) {
      this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.masterPaymentOrder, [])]);
    } else {
      const url = Common.getRelativePathUrl('../../../', this.router.url, [ROUTER_LINKS.invoice]);
      this.router.navigateByUrl(url);
    }

  }
  /* Cancels payment  form*/
}
