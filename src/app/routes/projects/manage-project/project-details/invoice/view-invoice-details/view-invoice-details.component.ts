import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import {
  ROUTER_LINKS_FULL_PATH, FILE_TYPES, INVOICE_STATUS_FLAG, defaultDisabledDatepickerOptions,
  COOKIES_CONSTANTS, INVOICE_STATUS, PURCHASE_ORDER_TYPE, PAYMENT_TYPES_CONST, EVENT_TYPES, CFDI_CONST,
  PRESENTATION_FILE_TYPES, DOC_FILE_TYPES, PDF_FILE_TYPES, IMAGE_FILE_TYPES,
  SPREADSHEET_FILE_TYPES, ACCEPT_ATTACHMENT_FILE_FORMATS, PAYEE_ACCOUNT_INFO
} from '../../../../../../config';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { CustomValidators, Common, SessionService, TriggerService } from '../../../../../../common';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { SharedService } from '../../../../../../shared/shared.service';
import { ManageInvoiceData } from './view-invoice-details.data.model';
import { ViewInvoiceDetailsService } from './view-invoice-details.service';
import { HttpParams } from '@angular/common/http';
import { ShowTwoDecimalPipe } from '../../../../../../shared/pipes';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { ProjectsData } from '../../../../projects.data';
import { PURCHASE_ORDER_CONST } from '../../purchase-order/purchase-order.constants';

declare var $: any;
const URL = '';
@Component({
  selector: 'app-view-invoice-details',
  templateUrl: './view-invoice-details.component.html',
  styleUrls: ['./view-invoice-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ViewInvoiceDetailsComponent implements OnInit, OnDestroy {
  poData: any = [];
  CFDI_CONST = CFDI_CONST;
  showIsrOrVatWithholding: Boolean = false;
  PURCHASE_ORDER_CONST = PURCHASE_ORDER_CONST;
  ROUTER_LINKS_FULL_PATH = ROUTER_LINKS_FULL_PATH;
  PURCHASE_ORDER_TYPE = PURCHASE_ORDER_TYPE;
  PAYMENT_TYPES_CONST = PAYMENT_TYPES_CONST;
  ACCEPT_ATTACHMENT_FILE_FORMATS = ACCEPT_ATTACHMENT_FILE_FORMATS;
  INVOICE_STATUS = INVOICE_STATUS;
  manageInvoiceForm: FormGroup;
  submitInvoiceForm: Boolean = false;
  spinnerFlag: Boolean = false;
  datePickerOptions = JSON.parse(JSON.stringify(defaultDisabledDatepickerOptions));
  documents: any = {
    invoiceAttachmentsDocs: []
  };
  filesCounter: any = 0;
  isClicked: Boolean = false;
  showMsg: Boolean = false;
  renderPage: Boolean = false;
  url?: string;
  enableSaveButtonFlag: Boolean = true;
  filesReceived: any = 0;
  operationDropdown: any[];
  invoicesHistory: any;
  operation: any[];
  defaultValueObj: any;
  subTotal = 0;
  poId: any;
  poDataArr: any = [];
  amount: Number = 0;
  invoiceStatusKeyArr: any = [];
  invoiceHistoryTotal: any = 0;
  invoiceId: any;
  invoiceDetails: any;
  invoiceFormDetails: any;
  subscription: Subscription;
  defaultCurrency: any;
  presentationIcon: Boolean = false;
  docIcon: Boolean = false;
  pdfIcon: Boolean = false;
  imageIcon: Boolean = false;
  spreadsheetIcon: Boolean = false;
  pptIcon: Boolean = false;
  vatWitholdingAmt = 0;
  isrWitholdingAmt = 0;
  projectID: any;
  commonLabelsObj: any;
  budgetId: any;
  payableAmount: any = 0;
  agencyFeeAmount: any = 0;
  markupAmount: any = 0;
  totalAmount: any = 0;
  showMasterInvoiceListingBackToList: boolean = false;
  ivaAmount: any;
  cost: any;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private _sharedService: SharedService,
    public sessionService: SessionService,
    private __viewInvoiceDetailsService: ViewInvoiceDetailsService,
    private _twoDecimal: ShowTwoDecimalPipe,
    private projectsData: ProjectsData,
    private triggerService: TriggerService,
    private translateService: TranslateService
  ) { }
  public invoiceAttachments: FileUploader = new FileUploader({ url: URL }
  );

  ngOnInit() {
    Common.scrollTOTop();
    this.projectID = this.projectsData.projectId;
    this.budgetId = this.projectsData.budgetId;
    this.route.params.subscribe(params => {
      this.invoiceId = params['id'];
      if (params.data === 'masterInvoiceListing') {
        this.showMasterInvoiceListingBackToList = true;
      }
    });
    this.poId = this.route.snapshot.queryParams['poId'];
    this.getPO();
    $('.currency-dropdown').hide();

    this.translateService.get('common').subscribe((res: string) => {
      this.commonLabelsObj = res;
    });

  }

  getPO() {
    this.__viewInvoiceDetailsService.getPurchaseOrder(this.poId).subscribe((response: any) => {
      if (Common.checkStatusCode(response.header.statusCode)) {
        this.poData = response.payload.result;
        this.createAddForm();
        this.getModesOfOperation();
        this.getPODefaultValues();
        this.getInvoicesHistory();
        this.showIsrOrVatWithholdingFields();
        if (!this.invoiceId) {
          this.setPOFormData(this.poData);
        } else {
          this.getInvoiceById();
        }
      } else {
        this.poDataArr = [];
        this.poData = [];
      }
    }, error => {
      this.operationDropdown = [];
    });

  }

  showIsrOrVatWithholdingFields() {
    if (this.poData.purchaseOrderFor === PURCHASE_ORDER_CONST.location) {
      this.showIsrOrVatWithholding = true;
    }
    else {
      if (this.poData.cfdiType === CFDI_CONST.honorarious) {
        this.showIsrOrVatWithholding = true;
      }
    }
  }
  getInvoiceById() {
    this.__viewInvoiceDetailsService.getInvoiceData(this.invoiceId).subscribe((response: any) => {
      if (Common.checkStatusCode(response.header.statusCode)) {
        this.invoiceDetails = response.payload.result;
        this.invoiceFormDetails = ManageInvoiceData.getFormData(this.invoiceDetails, this.poData.purchaseOrderFor);
        this.setInvoiceFormData(this.invoiceFormDetails);
      } else {
        this.invoiceDetails = '';
      }
    }, error => {
      this.invoiceDetails = '';
    });

  }
  //   renderInvoicePage() {
  //     const render = Observable.forkJoin(
  //     );
  //     render.subscribe((latestValues: any) => {
  //     })
  // }
  createAddForm() {
    this.manageInvoiceForm = this.manageInvoiceFormGroup();
  }

  ngOnDestroy() {
    $('.currency-dropdown').show();
  }

  manageInvoiceFormGroup(): FormGroup {
    return this.fb.group({
      freelancerPayeeInfo: this.freelancerPayeeInfo(),
      vendorPayeeInfo: this.vendorPayeeInfo(),
      locationPayeeInfo: this.locationPayeeInfo(),
      talentPayeeInfo: this.talentPayeeInfo(),
      invoiceTable: [''],
      mode: [''],
      accountName: [''],
      sortCode: [''],
      abaCode: [''],
      swiftCode: [''],
      branch: [''],
      invoiceNo: ['', [CustomValidators.required]],
      // invoiceType: ['2'],
      invoiceDate: [''],
      paymentDate: [''],
      purchaseOrderCurrency: [''],
      invoiceAmount: ['', [CustomValidators.requiredWithout0, CustomValidators.checkDecimal]],
      invoicePercentage: ['', [CustomValidators.checkDecimal]],
      invoiceVat: ['', [CustomValidators.checkDecimal]],
      invoiceISRWitholding: ['', [CustomValidators.checkDecimal]],
      invoiceVATWitholding: ['', [CustomValidators.checkDecimal]],
      notes: [''],
      invoiceAttachments: [''],
      percentAgencyFee: ['0'],
      percentMarkup: ['0'],
      iva: ['0'],
    });
  }

  freelancerPayeeInfo(): FormGroup {
    if (this.poData.payeeAccountInfoFor === PURCHASE_ORDER_TYPE.freelancer) {
      return this.fb.group({
        accNo: ['', [CustomValidators.required]],
        bankName: ['', [CustomValidators.required]],
        clabe: ['', [CustomValidators.required]],
        rfcCode: ['', [CustomValidators.required]],
        address: ['', [CustomValidators.required]],
        branch: ['', [CustomValidators.required]]
      });
    } else {
      return this.fb.group({
        accNo: [''],
        bankName: [''],
        clabe: [''],
        rfcCode: [''],
        address: [''],
        branch: ['']
      });
    }
  }

  vendorPayeeInfo(): FormGroup {
    if (this.poData.payeeAccountInfoFor === PURCHASE_ORDER_TYPE.vendor) {
      return this.fb.group({
        accountName: ['', [CustomValidators.required]],
        accNo: ['', [CustomValidators.required]],
        bankName: ['', [CustomValidators.required]],
        branch: ['', [CustomValidators.required]],
        clabe: ['', [CustomValidators.required]],
        rfcCode: ['', [CustomValidators.required]],
        sortCode: ['', [CustomValidators.required]],
        mode: ['', [CustomValidators.required]],
        abaCode: ['', [CustomValidators.required]],
        swiftCode: ['', [CustomValidators.required]]
      });
    } else {
      return this.fb.group({
        accountName: [''],
        accNo: [''],
        bankName: [''],
        branch: [''],
        clabe: [''],
        rfcCode: [''],
        sortCode: [''],
        mode: [''],
        abaCode: [''],
        swiftCode: [''],
      });
    }
  }
  locationPayeeInfo(): FormGroup {
    if (this.poData.payeeAccountInfoFor === PURCHASE_ORDER_TYPE.location) {
      return this.fb.group({
        accNo: ['', [CustomValidators.required]],
        bankName: ['', [CustomValidators.required]],
        branch: ['', [CustomValidators.required]],
        address: ['', [CustomValidators.required]],
        clabe: ['', [CustomValidators.required]],
        rfcCode: ['', [CustomValidators.required]]
      });
    } else {
      return this.fb.group({
        accNo: [''],
        bankName: [''],
        branch: [''],
        address: [''],
        clabe: [''],
        rfcCode: [''],
      });
    }
  }
  talentPayeeInfo(): FormGroup {
    return this.fb.group({
      accountNumber: ['', [CustomValidators.required]],
      accountName: ['', [CustomValidators.required]],
      bankName: ['', [CustomValidators.required]],
      clabe: ['', [CustomValidators.required]],
      rfcCode: ['', [CustomValidators.required]],
      address: ['', [CustomValidators.required]],
      branch: ['', [CustomValidators.required]]
    });
  }

  showFileSpecificIcons(filetype, index) {
    const presentationIcon = _.find(PRESENTATION_FILE_TYPES, { 'type': filetype.toLowerCase() });
    if (presentationIcon) {
      // this.presentationIcon = true;
      this.invoiceAttachments.queue[index]['file']['iconType'] = 'fa fa-file-powerpoint-o mr-2';
    }
    const docIcon = _.find(DOC_FILE_TYPES, { 'type': filetype.toLowerCase() });
    if (docIcon) {
      this.invoiceAttachments.queue[index]['file']['iconType'] = 'fa fa-file-word-o mr-2';
    }
    const pdfIcon = _.find(PDF_FILE_TYPES, { 'type': filetype.toLowerCase() });
    if (pdfIcon) {
      this.invoiceAttachments.queue[index]['file']['iconType'] = 'fa fa-file-pdf-o mr-2';
    }
    const imageIcon = _.find(IMAGE_FILE_TYPES, { 'type': filetype.toLowerCase() });
    if (imageIcon) {
      this.invoiceAttachments.queue[index]['file']['iconType'] = 'fa fa-file-image-o mr-2';
    }
    const spreadSheetIcon = _.find(SPREADSHEET_FILE_TYPES, { 'type': filetype.toLowerCase() });
    if (spreadSheetIcon) {
      this.invoiceAttachments.queue[index]['file']['iconType'] = 'fa fa-file-excel-o mr-2';
    }

  }
  removeFiles(index) {
    this.documents.invoiceAttachmentsDocs.splice(index, 1);
  }
  setPOFormData(payeeFormDtails) {
    if (this.poData && (this.poData.payeeAccountInfoFor || this.poData.payeeAccountInfoFor === 0)) {
      switch (this.poData.payeeAccountInfoFor) {
        case PAYEE_ACCOUNT_INFO.freelancer:
          this.setPayeeFreelancer(payeeFormDtails);
          break;
        case PAYEE_ACCOUNT_INFO.vendor:
          this.setPayeeVendor(payeeFormDtails);
          break;
        case PAYEE_ACCOUNT_INFO.location:
          this.setPayeelocation(payeeFormDtails);
          break;
        case PAYEE_ACCOUNT_INFO.individual:
          this.setPayeeTalent(payeeFormDtails);
          break;
        case PAYEE_ACCOUNT_INFO.agency:
          this.setPayeeTalent(payeeFormDtails);
          break;
      }
    }

    this.renderPage = true;
  }
  setInvoiceFormData(invoiceFormDetails) {
    this.manageInvoiceForm.patchValue({
      freelancerPayeeInfo: this.freelancerPayeeInfo(),
      vendorPayeeInfo: this.vendorPayeeInfo(),
      locationPayeeInfo: this.locationPayeeInfo(),
      invoiceNo: invoiceFormDetails.invoiceNumber ? invoiceFormDetails.invoiceNumber : '',
      // invoiceType: invoiceFormDetails.invoiceType ? JSON.stringify(invoiceFormDetails.invoiceType) : "",
      invoiceDate: invoiceFormDetails.invoiceDate ? invoiceFormDetails.invoiceDate : '',
      paymentDate: invoiceFormDetails.paymentDate ? invoiceFormDetails.paymentDate : '',
      invoiceAmount: invoiceFormDetails.invoiceAmount ? invoiceFormDetails.invoiceAmount : 0,
      invoicePercentage: invoiceFormDetails.invoicePercentage ? invoiceFormDetails.invoicePercentage : 0,
      invoiceVat: invoiceFormDetails.percentVAT ? invoiceFormDetails.percentVAT : 0,
      invoiceISRWitholding: invoiceFormDetails.percentISRWithholding ? invoiceFormDetails.percentISRWithholding : 0,
      invoiceVATWitholding: invoiceFormDetails.percentVATWithholding ? invoiceFormDetails.percentVATWithholding : 0,
      notes: invoiceFormDetails.i18n.notes ? invoiceFormDetails.i18n.notes : '',
      percentAgencyFee: invoiceFormDetails.percentAgencyFee ? invoiceFormDetails.percentAgencyFee : 0,
      percentMarkup: invoiceFormDetails.percentMarkup ? invoiceFormDetails.percentMarkup : 0,
      iva: invoiceFormDetails.iva ? invoiceFormDetails.iva : 0,
    });
    this.updateSubtotal();
    this.calculateAllAmounts();
    if (this.poData && (this.poData.payeeAccountInfoFor || this.poData.payeeAccountInfoFor === 0)) {
      switch (this.poData.payeeAccountInfoFor) {
        case PAYEE_ACCOUNT_INFO.freelancer:
          this.setPayeeFreelancer(invoiceFormDetails);
          break;
        case PAYEE_ACCOUNT_INFO.vendor:
          this.setPayeeVendor(invoiceFormDetails);
          break;
        case PAYEE_ACCOUNT_INFO.location:
          this.setPayeelocation(invoiceFormDetails);
          break;
        case (PAYEE_ACCOUNT_INFO.individual):
          this.setPayeeTalent(invoiceFormDetails);
          break;
        case PAYEE_ACCOUNT_INFO.agency:
          this.setPayeeTalent(invoiceFormDetails);
          break;
      }
    }

    const invoiceDocs = invoiceFormDetails.attachments;
    if (invoiceDocs) {
      this.invoiceAttachments.queue = [];
      for (let i = 0; i < invoiceDocs.length; i++) {
        const file = new File([''], invoiceDocs[i].fileName);
        const fileItem = new FileItem(this.invoiceAttachments, file, {});
        this.invoiceAttachments.queue.push(fileItem);
        this.invoiceAttachments.queue[i].url = invoiceDocs[i].fileUrl;
        this.setDocumentId(invoiceDocs[i].fileId);
        this.getFileType({ 'name': invoiceDocs[i].fileName }, i);
      }
    }


    this.renderPage = true;
  }
  setPayeelocation(invoiceFormDetails) {
    const payeeLocationFrmGrp = <FormGroup>this.manageInvoiceForm.controls['locationPayeeInfo'];
    payeeLocationFrmGrp.patchValue({
      accNo: invoiceFormDetails.accountNumber ? invoiceFormDetails.accountNumber : '',
      bankName: invoiceFormDetails.bankName ? invoiceFormDetails.bankName : '',
      address: invoiceFormDetails.address ? invoiceFormDetails.address : '',
      branch: invoiceFormDetails.branch ? invoiceFormDetails.branch : '',
      clabe: invoiceFormDetails.clabe ? invoiceFormDetails.clabe : '',
      rfcCode: invoiceFormDetails.rfcCode ? invoiceFormDetails.rfcCode : '',
    });
  }
  setPayeeFreelancer(invoiceFormDetails) {
    const payeeFreelancerFrmGrp = <FormGroup>this.manageInvoiceForm.controls['freelancerPayeeInfo'];
    payeeFreelancerFrmGrp.patchValue({
      accNo: invoiceFormDetails.accountNumber ? invoiceFormDetails.accountNumber : '',
      bankName: invoiceFormDetails.bankName ? invoiceFormDetails.bankName : '',
      clabe: invoiceFormDetails.clabe ? invoiceFormDetails.clabe : '',
      rfcCode: invoiceFormDetails.rfcCode ? invoiceFormDetails.rfcCode : '',
      address: invoiceFormDetails.address ? invoiceFormDetails.address : '',
      branch: invoiceFormDetails.branch ? invoiceFormDetails.branch : '',
    });
  }
  setPayeeVendor(invoiceFormDetails) {
    const payeeVendorFrmGrp = <FormGroup>this.manageInvoiceForm.controls['vendorPayeeInfo'];
    payeeVendorFrmGrp.patchValue({
      accountName: invoiceFormDetails.accountName ? invoiceFormDetails.accountName : '',
      accNo: invoiceFormDetails.accountNumber ? invoiceFormDetails.accountNumber : '',
      bankName: invoiceFormDetails.bankName ? invoiceFormDetails.bankName : '',
      branch: invoiceFormDetails.branch ? invoiceFormDetails.branch : '',
      clabe: invoiceFormDetails.clabe ? invoiceFormDetails.clabe : '',
      rfcCode: invoiceFormDetails.rfcCode ? invoiceFormDetails.rfcCode : '',
      sortCode: invoiceFormDetails.sortCode ? invoiceFormDetails.sortCode : '',
      address: invoiceFormDetails.address ? invoiceFormDetails.address : '',
      mode: invoiceFormDetails.modeofOperation ? invoiceFormDetails.modeofOperation : '',
      abaCode: invoiceFormDetails.abaCode ? invoiceFormDetails.abaCode : '',
      swiftCode: invoiceFormDetails.swiftCode ? invoiceFormDetails.swiftCode : '',
    });
  }
  setPayeeTalent(invoiceFormDetails) {
    let payeeTalentFrmGrp = <FormGroup>this.manageInvoiceForm.controls['talentPayeeInfo'];
    payeeTalentFrmGrp.patchValue({
      accountNumber: invoiceFormDetails.accountNumber ? invoiceFormDetails.accountNumber : "",
      accountName: invoiceFormDetails.accountName ? invoiceFormDetails.accountName : "",
      bankName: invoiceFormDetails.bankName ? invoiceFormDetails.bankName : "",
      clabe: invoiceFormDetails.clabe ? invoiceFormDetails.clabe : "",
      rfcCode: invoiceFormDetails.rfcCode ? invoiceFormDetails.rfcCode : "",
      address: invoiceFormDetails.address ? invoiceFormDetails.address : "",
      branch: invoiceFormDetails.branch ? invoiceFormDetails.branch : "",
    })
  }
  getInvoicesHistory() {
    let params: HttpParams = new HttpParams();
    params = params.append('purchaseOrderId', this.poId);
    if (this.invoiceId) {
      params = params.append('excludeInvoiceId', this.invoiceId);
    }
    this.__viewInvoiceDetailsService.getInvoiceHistoryList(params).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        this.invoicesHistory = response.payload.result;
        this.invoiceStatusKeyArr = Common.keyValueDropdownArr(INVOICE_STATUS, 'id', 'text');
        this.invoicesHistory.forEach(obj => {
          this.invoiceHistoryTotal = this.invoiceHistoryTotal + obj.invoiceAmount;
        });
        this.updateSubtotal();
      } else {
        this.invoicesHistory = [];
      }
    });
  }
  addFiles(event) {
    this.enableSaveButtonFlag = false;
    this.checkDocumentValidation();
  }
  checkDocumentValidation() {
    this.filesCounter = 0;
    this.filesReceived = this.invoiceAttachments.queue.length;
    let totalAttachFileSize = 0;
    // tslint:disable-next-line:forin
    for (const i in this.invoiceAttachments.queue) {
      totalAttachFileSize = totalAttachFileSize + this.invoiceAttachments.queue[i].file.size;
    }
    if (totalAttachFileSize > 50 * 1024 * 1024) {
      this.toastrService.error(this.commonLabelsObj.errorMessages.documentLessThan50);
      for (let i = 0; i < this.invoiceAttachments.queue.length; i++) {
        if (!this.invoiceAttachments.queue[i].url) {
          this.invoiceAttachments.queue[i].remove();
          i--;
        }
      }

      this.enableSaveButtonFlag = true;
    }
    else {

      for (let i = 0; i < this.invoiceAttachments.queue.length; i++) {
        const filesize = this.invoiceAttachments.queue[i].file.size;
        if (filesize > 10 * 1024 * 1024) {
          this.toastrService.error(this.commonLabelsObj.errorMessages.documentLessThan10);
          this.invoiceAttachments.queue[i].remove();
          i--;
          this.filesCounter++;
          if (this.filesCounter === this.filesReceived) {
            this.enableSaveButtonFlag = true;
          }
        }
        else {
          const file = this.invoiceAttachments.queue[i]._file;
          const type = this.getFileType(file, i);
          if (!this.invoiceAttachments.queue[i].url) {
            if (!this.checkFileType(type)) {
              this.toastrService.error(this.commonLabelsObj.errorMessages.invalidFileType);
              this.invoiceAttachments.queue[i].remove();
              i--;
              this.filesCounter++;
              if (this.filesCounter === this.filesReceived) {
                this.enableSaveButtonFlag = true;
              }
            }
            else {
              const formData = this.setFormData(file);
              this.uploadFile(formData, true, this.invoiceAttachments.queue[i], i);
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
  }
  // It uploads the file
  uploadFile(formData, isDocument, obj: any = {}, index: any = 0) {
    this._sharedService.uploadFile(formData).subscribe((imageResponse: any) => {
      if (Common.checkStatusCode(imageResponse.header.statusCode)) {
        const data = imageResponse.payload.result;
        if (isDocument) {
          obj.url = data.url;
          this.setDocumentId(data.id);
          // this.enableSaveButtonFlag = true;
        }
      } else {
        if (imageResponse.header) {
          this.toastrService.error(imageResponse.header.message);
          // this.enableSaveButtonFlag = true;
        } else {
          this.toastrService.error(this.commonLabelsObj.errorMessages.error);
          // this.enableSaveButtonFlag = true;
        }
      }
      this.filesCounter++;
      if (this.filesCounter === this.filesReceived) {
        this.enableSaveButtonFlag = true;
      }
    },
      error => {
        this.toastrService.error(this.commonLabelsObj.errorMessages.error);
        // this.enableSaveButtonFlag = true;
        this.filesCounter++;
        if (this.filesCounter === this.filesReceived) {
          this.enableSaveButtonFlag = true;
        }
      });
  }
  // It sets the document id in required document array
  setDocumentId(documentId) {
    this.documents.invoiceAttachmentsDocs.push(documentId);
  }

  getFileType(file, i) {
    const fileNameArr = file.name.split('.');
    const type = fileNameArr[fileNameArr.length - 1];
    this.showFileSpecificIcons(type, i);
    return type;
  }
  checkFileType(filetype) {
    const validtype = _.find(FILE_TYPES, { 'type': filetype.toLowerCase() });
    if (validtype) {
      return true;
    }
    else {
      return false;
    }
  }
  setFormData(file) {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return formData;
  }
  checkInvoiceTyepOnSave() {
    const payeeVendorFrmGrp = <FormGroup>this.manageInvoiceForm.controls['vendorPayeeInfo'];
    const payeeLocationFrmGrp = <FormGroup>this.manageInvoiceForm.controls['locationPayeeInfo'];
    if (this.poData.paymentType === PAYMENT_TYPES_CONST.domestic) {
      payeeVendorFrmGrp.controls['abaCode'].setValidators(null);
      payeeVendorFrmGrp.controls['abaCode'].updateValueAndValidity();
      payeeVendorFrmGrp.controls['swiftCode'].setValidators(null);
      payeeVendorFrmGrp.controls['swiftCode'].updateValueAndValidity();
    }
    if (this.poData.paymentType === PAYMENT_TYPES_CONST.international) {
      payeeVendorFrmGrp.controls['clabe'].setValidators(null);
      payeeVendorFrmGrp.controls['clabe'].updateValueAndValidity();
      payeeVendorFrmGrp.controls['rfcCode'].setValidators(null);
      payeeVendorFrmGrp.controls['rfcCode'].updateValueAndValidity();
      payeeVendorFrmGrp.controls['sortCode'].setValidators(null);
      payeeVendorFrmGrp.controls['sortCode'].updateValueAndValidity();
    }
    if (!this.poData.isScouterBeneficiary) {
      payeeLocationFrmGrp.controls['rfcCode'].setValidators(null);
      payeeLocationFrmGrp.controls['rfcCode'].updateValueAndValidity();
    }
  }
  saveInvoice() {
    this.checkInvoiceTyepOnSave();
    this.spinnerFlag = true;
    this.submitInvoiceForm = true;
    if (this.manageInvoiceForm.valid && !this.showMsg) {
      this.enableSaveButtonFlag = false;
      const formvalue = this.manageInvoiceForm.value;
      formvalue['langCode'] = this.sessionService.getCookie(COOKIES_CONSTANTS.langCode);
      formvalue['purchaseOrderId'] = this.poId;
      formvalue['purchaseOrderCurrency'] = this.poData.currencyCode;
      const finalInvoiceData = ManageInvoiceData.setFormData(formvalue, this.documents, this.poData.payeeAccountInfoFor);
      if (!this.invoiceId) {
        this.__viewInvoiceDetailsService.postInvoiceDetails(finalInvoiceData).subscribe((response: any) => {
          if (Common.checkStatusCodeInRange(response.header.statusCode)) {
            this.spinnerFlag = false;
            this.enableSaveButtonFlag = true;
            this.toastrService.success(response.header.message);
            const url = Common.getRelativePathUrl('../', this.router.url, []);
            this.router.navigateByUrl(url);
          } else {
            this.spinnerFlag = false;
            this.enableSaveButtonFlag = true;
            this.toastrService.error(response.header.message);
          }
        }, error => {
          this.spinnerFlag = false;
          this.enableSaveButtonFlag = true;
        });
      } else {
        this.__viewInvoiceDetailsService.putInvoiceDetails(this.invoiceId, finalInvoiceData).subscribe((response: any) => {
          if (Common.checkStatusCodeInRange(response.header.statusCode)) {
            this.spinnerFlag = false;
            this.enableSaveButtonFlag = true;
            this.toastrService.success(response.header.message);
            const url = Common.getRelativePathUrl('../../', this.router.url, []);
            this.router.navigateByUrl(url);
          } else {
            this.spinnerFlag = false;
            this.enableSaveButtonFlag = true;
          }
        }, error => {
          this.spinnerFlag = false;
          this.enableSaveButtonFlag = true;
        });
      }

    }
    else {
      this.spinnerFlag = false;
      let target;
      for (const i in this.manageInvoiceForm.controls) {
        if (!this.manageInvoiceForm.controls[i].valid) {
          target = this.manageInvoiceForm.controls[i];
          break;
        }
      }
      if (target) {
        this.spinnerFlag = false;
        const el = $('.ng-invalid:not(form):first');
        $('html,body').animate({ scrollTop: (el.offset().top - 100) }, 'slow', () => {
          el.focus();
        });
      }

    }
  }
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

  getPODefaultValues() {
    if (!this.invoiceId) {
      this.manageInvoiceForm.patchValue({
        invoiceVat: this.poData.percentVAT,
        invoiceISRWitholding: this.poData.percentISRWithholding,
        invoiceVATWitholding: this.poData.percentVATWithholding
      });
    }

  }
  /*
     Checking IS NAN condition for invoice amount.
   */
  checkAmount() {
    if (isNaN(this.manageInvoiceForm.value.invoiceAmount)) {
      this.manageInvoiceForm.controls['invoiceAmount'].setValue(0);
    }
  }
  calculateAllAmounts() {
    this.updateAgencyFeeAmount();
    this.updateMarkupAmount();
    this.updateIvaAmount();
    this.updateTotalAmount();
  }
  /**
   * Calculates Talent PO total amount
   */
  updateTotalAmount() {
    const formValue = this.manageInvoiceForm.value;
    this.totalAmount = 0;
    const amount = (formValue.invoiceAmount) ? parseFloat(formValue.invoiceAmount) : 0;
    const agencyFee = (this.agencyFeeAmount) ? parseFloat(this.agencyFeeAmount) : 0;
    const iva = (this.ivaAmount) ? parseFloat(this.ivaAmount) : 0;
    const markup = (this.markupAmount) ? parseFloat(this.markupAmount) : 0;
    this.totalAmount = amount + agencyFee + iva + markup;
  }
  /**
 * Calculate markup amount
 */
  updateMarkupAmount() {
    const formValue = this.manageInvoiceForm.value;
    this.markupAmount = 0;
    this.markupAmount = ((parseFloat(formValue.invoiceAmount) + parseFloat(this.agencyFeeAmount)) * (parseFloat(formValue.percentMarkup) / 100));
  }
  /**
   * Calculates agency fee
   */
  updateAgencyFeeAmount() {
    const formValue = this.manageInvoiceForm.value;
    this.agencyFeeAmount = 0;
    this.agencyFeeAmount = (parseFloat(formValue.invoiceAmount) * (parseFloat(formValue.percentAgencyFee) / 100));
  }
  /**
   * CalculatesIVA amount
   */
  updateIvaAmount() {
    const formValue = this.manageInvoiceForm.value;
    this.cost = (parseFloat(formValue.invoiceAmount) + parseFloat(this.agencyFeeAmount));
    this.ivaAmount = 0;
    this.ivaAmount = (parseFloat(this.cost) * (parseFloat(formValue.iva) / 100));
  }

  updateSubtotal() {
    this.checkAmount();
    this.updateISRWitholding();
    this.updateVatWitholding();

    const formvalue = this.manageInvoiceForm.value;

    if (!formvalue.invoiceVat) {
      this.manageInvoiceForm.patchValue({
        invoiceVat: 0,
      });
    }
    if (!formvalue.invoiceVATWitholding) {
      this.manageInvoiceForm.patchValue({
        invoiceVATWitholding: 0,
      });
    }
    if (!formvalue.invoiceISRWitholding) {
      this.manageInvoiceForm.patchValue({
        invoiceISRWitholding: 0,
      });
    }
    this.amount = parseFloat(this.poData.totalAmountRequested) - parseFloat(this.invoiceHistoryTotal);
    if (formvalue.invoiceAmount > this.amount) {
      this.showMsg = true;
    } else {
      this.showMsg = false;
    }
    if (formvalue.invoiceVat === 0) {
      this.subTotal = formvalue.invoiceVat + parseFloat(formvalue.invoiceAmount);
    }
    if (formvalue.invoiceVat && formvalue.invoiceAmount) {
      const invoiceAmountFlag = isNaN(formvalue.invoiceAmount);
      const invoiceVatFlag = isNaN(formvalue.invoiceVat);
      if (!invoiceAmountFlag && !invoiceVatFlag) {
        const calculatedSubtotalValue: any = (parseFloat(formvalue.invoiceAmount) * parseFloat(formvalue.invoiceVat)) / 100;
        this.subTotal = parseFloat(calculatedSubtotalValue) + parseFloat(formvalue.invoiceAmount);
      } else {
        this.subTotal = 0;
      }
    }
    if (formvalue.invoiceAmount > this.poData.totalAmountRequested) {
      this.manageInvoiceForm.controls['invoicePercentage'].setValue(0);
    }
    if ((this.poData.totalAmountRequested && formvalue.invoiceAmount) && (formvalue.invoiceAmount <= this.poData.totalAmountRequested)) {
      const calculatedPercentageValue: any = (parseFloat(formvalue.invoiceAmount) * 100) / parseFloat(this.poData.totalAmountRequested);
      const transFormedValue = this._twoDecimal.transform(calculatedPercentageValue);
      if (transFormedValue) {
        this.manageInvoiceForm.patchValue({
          invoicePercentage: transFormedValue
        });
      } else {
        this.manageInvoiceForm.patchValue({
          invoicePercentage: 0
        });
      }
    }
    if (!formvalue.invoiceAmount) {
      this.subTotal = 0;
    }
    this.updatePayableAmount();
  }
  updateInvoiceAmt() {
    const formvalue = this.manageInvoiceForm.value;
    formvalue.invoiceAmount = 0;

    if (formvalue.invoicePercentage > 100) {
      this.manageInvoiceForm.controls['invoicePercentage'].setValue(100);
      formvalue.invoicePercentage = 100;
    }
    if (this.poData.totalAmountRequested && formvalue.invoicePercentage) {
      // tslint:disable-next-line:max-line-length
      const calculatedInvoiceAmountValue: any = (parseFloat(this.poData.totalAmountRequested) * parseFloat(formvalue.invoicePercentage)) / 100;
      const transFormedInvoiceValue = this._twoDecimal.transform(calculatedInvoiceAmountValue);

      if (transFormedInvoiceValue) {
        this.manageInvoiceForm.patchValue({
          invoiceAmount: transFormedInvoiceValue
        });

        this.updateSubTotalOnInvoicePercentage();
        this.updateVatWitholding();
        this.updateISRWitholding();
      } else {
        this.manageInvoiceForm.patchValue({
          invoiceAmount: 0
        });
      }
      this.amount = parseFloat(this.poData.totalAmountRequested) - parseFloat(this.invoiceHistoryTotal);
      if (this.manageInvoiceForm.controls['invoiceAmount'].value > this.amount) {
        this.showMsg = true;
      } else {
        this.showMsg = false;
      }
    }
    if (!formvalue.invoicePercentage) {
      this.manageInvoiceForm.patchValue({
        invoicePercentage: 0,
      });
    }

  }
  updateSubTotalOnInvoicePercentage() {
    const formvalue = this.manageInvoiceForm.value;
    if (formvalue.invoiceVat === 0) {
      this.subTotal = formvalue.invoiceVat + parseFloat(formvalue.invoiceAmount);
    }
    if (formvalue.invoiceVat && formvalue.invoiceAmount) {
      const invoiceAmountFlag = isNaN(formvalue.invoiceAmount);
      const invoiceVatFlag = isNaN(formvalue.invoiceVat);
      if (!invoiceAmountFlag && !invoiceVatFlag) {
        const calculatedSubtotalValue: any = (parseFloat(formvalue.invoiceAmount) * parseFloat(formvalue.invoiceVat)) / 100;
        this.subTotal = parseFloat(calculatedSubtotalValue) + parseFloat(formvalue.invoiceAmount);
      } else {
        this.subTotal = 0;
      }
    }
  }
  updateVatWitholding() {
    const formvalue = this.manageInvoiceForm.value;
    if (formvalue.invoiceVATWitholding && formvalue.invoiceAmount) {
      const invoiceAmountFlag = isNaN(formvalue.invoiceAmount);
      const invoiceVatFlag = isNaN(formvalue.invoiceVATWitholding);
      if (!invoiceAmountFlag && !invoiceVatFlag) {
        this.vatWitholdingAmt = (parseFloat(formvalue.invoiceAmount) * parseFloat(formvalue.invoiceVATWitholding)) / 100;

      } else {
        this.vatWitholdingAmt = 0;
      }
    }
  }
  updateISRWitholding() {
    const formvalue = this.manageInvoiceForm.value;
    if (formvalue.invoiceISRWitholding && formvalue.invoiceAmount) {
      const invoiceAmountFlag = isNaN(formvalue.invoiceAmount);
      const invoiceISRFlag = isNaN(formvalue.invoiceISRWitholding);
      if (!invoiceAmountFlag && !invoiceISRFlag) {
        this.isrWitholdingAmt = (parseFloat(formvalue.invoiceAmount) * parseFloat(formvalue.invoiceISRWitholding)) / 100;

      } else {
        this.isrWitholdingAmt = 0;
      }
    }
  }
  navigateTo(redirectionFlag?) {
    if (!this.showMasterInvoiceListingBackToList) {
      if (redirectionFlag) {
        this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.paymentOrder, [this.projectID, this.budgetId])]);
      } else {
        this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.purchaseOrder, [this.projectID, this.budgetId])]);
      }
    } else {
      this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.masterPaymentOrder, [])]);
    }
  }
  updatePayableAmount() {
    if (this.subTotal) {
      this.payableAmount = (this.subTotal - (this.isrWitholdingAmt + this.vatWitholdingAmt));
    } else {
      this.payableAmount = 0;
    }
  }
}
