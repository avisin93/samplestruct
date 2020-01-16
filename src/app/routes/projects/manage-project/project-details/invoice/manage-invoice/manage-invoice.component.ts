import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, ViewEncapsulation, OnDestroy, HostListener } from '@angular/core';
import {
  ROUTER_LINKS_FULL_PATH, FILE_TYPES, INVOICE_STATUS_FLAG, defaultDatepickerOptions,
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
import { ManageInvoiceData } from './manage-invoice.data.model';
import { ManageInvoicesService } from './manage-invoice.service';
import { HttpParams } from '@angular/common/http';
import { ShowTwoDecimalPipe } from '../../../../../../shared/pipes';
import { Observable } from 'rxjs/Observable';
import { ProjectsData } from '../../../../projects.data';
import { PURCHASE_ORDER_CONST } from '../../purchase-order/purchase-order.constants';
const swal = require('sweetalert');
import { CALCULATION_TYPES } from '../invoice.constants';
declare var $: any;
const URL = '';
@Component({
  selector: 'app-manage-invoice',
  templateUrl: './manage-invoice.component.html',
  styleUrls: ['./manage-invoice.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ManageInvoiceComponent implements OnInit, OnDestroy {
  totalAmt: any;
  fee: any;
  payeeFormDtails: any;
  markupFee: any;
  poData: any = [];
  CFDI_CONST = CFDI_CONST;
  showIsrOrVatWithholding: boolean = false;
  PURCHASE_ORDER_CONST = PURCHASE_ORDER_CONST;
  ROUTER_LINKS_FULL_PATH = ROUTER_LINKS_FULL_PATH;
  PURCHASE_ORDER_TYPE = PURCHASE_ORDER_TYPE;
  PAYEE_ACCOUNT_INFO = PAYEE_ACCOUNT_INFO;
  PAYMENT_TYPES_CONST = PAYMENT_TYPES_CONST;
  ACCEPT_ATTACHMENT_FILE_FORMATS = ACCEPT_ATTACHMENT_FILE_FORMATS;
  INVOICE_STATUS = INVOICE_STATUS;
  manageInvoiceForm: FormGroup;
  submitInvoiceForm: boolean = false;
  spinnerFlag: boolean = false;
  datePickerOptions = JSON.parse(JSON.stringify(defaultDatepickerOptions));
  documents: any = {
    invoiceAttachmentsDocs: []
  }
  filesCounter: any = 0;
  isClicked: boolean = false;
  showMsg: boolean = false;
  renderPage: boolean = false;
  url?: string;
  enableSaveButtonFlag: boolean = true;
  showBrowseButton: boolean = true;
  filesReceived: any = 0;
  operationDropdown: any[];
  checkInvoiceAttachments: Boolean = false;
  invoicesHistory: any;
  operation: any[];
  defaultValueObj: any;
  subTotal: number = 0;
  poId: any;
  poDataArr: any = [];
  amount: number = 0;
  invoiceStatusKeyArr: any = [];
  invoiceHistoryTotal: any = 0;
  invoiceId: any;
  invoiceDetails: any;
  invoiceFormDetails: any;
  defaultCurrency: any;
  presentationIcon: boolean = false;
  docIcon: boolean = false;
  pdfIcon: boolean = false;
  showMasterPOBackToList: Boolean = false;
  imageIcon: boolean = false;
  spreadsheetIcon: boolean = false;
  pptIcon: boolean = false;
  vatWitholdingAmt: number = 0;
  isrWitholdingAmt: number = 0;
  projectID: any;
  commonLabelsObj: any;
  disableButtonFlag: boolean = false;
  budgetId: any;
  payableAmount: Number = 0;
  agencyFeeAmount: any = 0;
  markupAmount: any = 0;
  totalAmount: any = 0;
  showMasterInvoiceListingBackToList: boolean = false;
  CALCULATION_TYPES = CALCULATION_TYPES;
  cost: any;
  ivaAmount: any;
  poMarkupAmount: any;
  poIvaAmount: any;
  poAgencyFeeAmount: any;
  poTotalAmount: any;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private _sharedService: SharedService,
    public sessionService: SessionService,
    private _addInvoiceService: ManageInvoicesService,
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
      if (params.data === 'masterPO') {
        this.showMasterPOBackToList = true;
      } else if (params.data === 'masterInvoiceListing') {
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
    this._addInvoiceService.getPurchaseOrder(this.poId).subscribe((response: any) => {
      if (Common.checkStatusCode(response.header.statusCode)) {
        this.poData = response.payload.result;
        // this.poData.purchaseOrderFor = 5;
        // this.poData.payeeAccountInfoFor = 5;

        this.createAddForm();
        this.getModesOfOperation();
        this.getPODefaultValues();
        this.getInvoicesHistory();
        this.showIsrOrVatWithholdingFields();
        this.calCulatePOPayableAmount();
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
    if (this.poData.purchaseOrderFor == PURCHASE_ORDER_CONST.location) {
      this.showIsrOrVatWithholding = true;
    }
    else {
      if (this.poData.cfdiType == CFDI_CONST.honorarious) {
        this.showIsrOrVatWithholding = true;
      }
    }
  }
  getInvoiceById() {
    this._addInvoiceService.getInvoiceData(this.invoiceId).subscribe((response: any) => {
      if (Common.checkStatusCode(response.header.statusCode)) {
        this.invoiceDetails = response.payload.result;
        this.invoiceFormDetails = ManageInvoiceData.getFormData(this.invoiceDetails, this.poData.purchaseOrderFor);
        this.setInvoiceFormData(this.invoiceFormDetails);
      } else {
        this.invoiceDetails = '';
        this.toastrService.error(response.header.message);
        this.renderPage = true;
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
    this.updateBackToListPath();
    $('.currency-dropdown').show();
    this.showMasterPOBackToList = false;
    this.showMasterInvoiceListingBackToList = false;
  }
  /**
  * Updates list path to budget list
  */
  updateBackToListPath() {
    const url = Common.sprintf(ROUTER_LINKS_FULL_PATH.budgetSheets, [this.projectsData.projectId]);
    this.setEventType({ type: EVENT_TYPES.backToListEvent, prevValue: '', currentValue: url });
  }
  manageInvoiceFormGroup(): FormGroup {
    return this.fb.group({
      freelancerPayeeInfo: this.freelancerPayeeInfo(),
      talentPayeeInfo: this.talentPayeeInfo(),
      vendorPayeeInfo: this.vendorPayeeInfo(),
      locationPayeeInfo: this.locationPayeeInfo(),
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
      invoicePercentage: ['', [CustomValidators.checkDecimal, CustomValidators.requiredWithout0]],
      invoiceVat: ['', [CustomValidators.checkUptoFourDecimal]],
      invoiceISRWitholding: ['', [CustomValidators.checkUptoFourDecimal]],
      invoiceVATWitholding: ['', [CustomValidators.checkUptoFourDecimal]],
      notes: [''],
      invoiceAttachments: [''],
      calculationType: [CALCULATION_TYPES.amount],
      percentAgencyFee: ['0', [CustomValidators.checkUptoFourDecimal]],
      percentMarkup: ['0', [CustomValidators.checkUptoFourDecimal]],
      iva: ['0', [CustomValidators.checkUptoFourDecimal]],
    });
  }

  freelancerPayeeInfo(): FormGroup {
    if (this.poData.payeeAccountInfoFor == PURCHASE_ORDER_TYPE.freelancer) {
      return this.fb.group({
        accountNumber: ['', [CustomValidators.required]],
        bankName: ['', [CustomValidators.required]],
        clabe: ['', [CustomValidators.required]],
        taxId: ['', [CustomValidators.required]],
        address: ['', [CustomValidators.required]],
        branch: ['', [CustomValidators.required]]
      });
    } else {
      return this.fb.group({
        accountNumber: [''],
        bankName: [''],
        clabe: [''],
        taxId: [''],
        address: [''],
        branch: ['']
      });
    }
  }

  talentPayeeInfo(): FormGroup {
    if (this.poData.purchaseOrderFor == PURCHASE_ORDER_TYPE.talent) {
      return this.fb.group({
        accountNumber: ['', [CustomValidators.required]],
        accountName: ['', [CustomValidators.required]],
        bankName: ['', [CustomValidators.required]],
        clabe: ['', [CustomValidators.required]],
        taxId: ['', [CustomValidators.required]],
        address: ['', [CustomValidators.required]],
        branch: ['', [CustomValidators.required]]
      });
    }
    else {
      return this.fb.group({
        accountNumber: [''],
        // accountName: [''],
        bankName: [''],
        clabe: [''],
        taxId: [''],
        address: [''],
        branch: ['']
      });
    }
  }

  setEventType(event: any) {
    this.triggerService.setEvent(event);
  }

  vendorPayeeInfo(): FormGroup {
    if (this.poData.payeeAccountInfoFor == PURCHASE_ORDER_TYPE.vendor) {
      return this.fb.group({
        accountName: ['', [CustomValidators.required]],
        accountNumber: ['', [CustomValidators.required]],
        bankName: ['', [CustomValidators.required]],
        branch: ['', [CustomValidators.required]],
        clabe: ['', [CustomValidators.required]],
        taxId: ['', [CustomValidators.required]],
        sortCode: ['', [CustomValidators.required]],
        mode: ['', [CustomValidators.required]],
        abaCode: ['', [CustomValidators.required]],
        swiftCode: ['', [CustomValidators.required]]
      });
    } else {
      return this.fb.group({
        accountName: [''],
        accountNumber: [''],
        bankName: [''],
        branch: [''],
        clabe: [''],
        taxId: [''],
        sortCode: [''],
        mode: [''],
        abaCode: [''],
        swiftCode: [''],
      });
    }
  }
  locationPayeeInfo(): FormGroup {
    if (this.poData.payeeAccountInfoFor == PURCHASE_ORDER_TYPE.location) {
      return this.fb.group({
        accountNumber: ['', [CustomValidators.required]],
        bankName: ['', [CustomValidators.required]],
        branch: ['', [CustomValidators.required]],
        address: ['', [CustomValidators.required]],
        clabe: ['', [CustomValidators.required]],
        taxId: ['', [CustomValidators.required]]
      })
    } else {
      return this.fb.group({
        accountNumber: [''],
        bankName: [''],
        branch: [''],
        address: [''],
        clabe: [''],
        taxId: [''],
      })
    }
  }

  showFileSpecificIcons(filetype, index) {
    let presentationIcon = _.find(PRESENTATION_FILE_TYPES, { 'type': filetype.toLowerCase() });
    if (presentationIcon) {
      //this.presentationIcon = true;
      this.invoiceAttachments.queue[index]['file']['iconType'] = 'fa fa-file-powerpoint-o mr-2';
    }
    let docIcon = _.find(DOC_FILE_TYPES, { 'type': filetype.toLowerCase() });
    if (docIcon) {
      this.invoiceAttachments.queue[index]['file']['iconType'] = 'fa fa-file-word-o mr-2';
    }
    let pdfIcon = _.find(PDF_FILE_TYPES, { 'type': filetype.toLowerCase() });
    if (pdfIcon) {
      this.invoiceAttachments.queue[index]['file']['iconType'] = 'fa fa-file-pdf-o mr-2';
    }
    let imageIcon = _.find(IMAGE_FILE_TYPES, { 'type': filetype.toLowerCase() });
    if (imageIcon) {
      this.invoiceAttachments.queue[index]['file']['iconType'] = 'fa fa-file-image-o mr-2';
    }
    let spreadSheetIcon = _.find(SPREADSHEET_FILE_TYPES, { 'type': filetype.toLowerCase() });
    if (spreadSheetIcon) {
      this.invoiceAttachments.queue[index]['file']['iconType'] = 'fa fa-file-excel-o mr-2';
    }

  }
  removeFiles(index, item) {
    const swalObj = Common.swalConfirmPopupObj(this.commonLabelsObj.labels.deleteAdvanceMsg, true, true);
    swal(swalObj, (isConfirm) => {
      if (isConfirm) {
        item.remove();
        this.documents.invoiceAttachmentsDocs.splice(index, 1);
        this.checkInvoiceDocs();
      }
    });
  }
  setPOFormData(payeeFormDtails) {
    if (this.poData && (this.poData.payeeAccountInfoFor || this.poData.payeeAccountInfoFor == 0)) {
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
      talentPayeeInfo: this.talentPayeeInfo(),
      locationPayeeInfo: this.locationPayeeInfo(),
      invoiceNo: invoiceFormDetails.invoiceNumber ? invoiceFormDetails.invoiceNumber : '',
      // invoiceType: invoiceFormDetails.invoiceType ? JSON.stringify(invoiceFormDetails.invoiceType) : '',
      invoiceDate: invoiceFormDetails.invoiceDate ? invoiceFormDetails.invoiceDate : '',
      paymentDate: invoiceFormDetails.paymentDate ? invoiceFormDetails.paymentDate : '',
      invoiceAmount: invoiceFormDetails.invoiceAmount ? invoiceFormDetails.invoiceAmount : 0,
      percentAgencyFee: invoiceFormDetails.percentAgencyFee ? invoiceFormDetails.percentAgencyFee : 0,
      percentMarkup: invoiceFormDetails.percentMarkup ? invoiceFormDetails.percentMarkup : 0,
      iva: invoiceFormDetails.iva ? invoiceFormDetails.iva : 0,
      invoicePercentage: invoiceFormDetails.invoicePercentage ? invoiceFormDetails.invoicePercentage : 0,
      invoiceVat: invoiceFormDetails.percentVAT ? invoiceFormDetails.percentVAT : 0,
      invoiceISRWitholding: invoiceFormDetails.percentISRWithholding ? invoiceFormDetails.percentISRWithholding : 0,
      invoiceVATWitholding: invoiceFormDetails.percentVATWithholding ? invoiceFormDetails.percentVATWithholding : 0,
      notes: invoiceFormDetails.i18n.notes ? invoiceFormDetails.i18n.notes : '',
    });
    this.updateSubtotal();
    this.calculateAllAmounts();
    if (this.poData && (this.poData.payeeAccountInfoFor || this.poData.payeeAccountInfoFor == 0)) {
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
        case PAYEE_ACCOUNT_INFO.agency:
          this.setPayeeTalent(invoiceFormDetails);
          break;
        case PAYEE_ACCOUNT_INFO.individual:
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
      if (this.invoiceAttachments.queue.length > 0) {
        this.showBrowseButton = false;
      }
    }


    this.renderPage = true;
  }
  setPayeelocation(invoiceFormDetails) {
    const payeeLocationFrmGrp = <FormGroup>this.manageInvoiceForm.controls['locationPayeeInfo'];
    payeeLocationFrmGrp.patchValue({
      accountNumber: invoiceFormDetails.accountNumber ? invoiceFormDetails.accountNumber : '',
      bankName: invoiceFormDetails.bankName ? invoiceFormDetails.bankName : '',
      address: invoiceFormDetails.address ? invoiceFormDetails.address : '',
      branch: invoiceFormDetails.branch ? invoiceFormDetails.branch : '',
      clabe: invoiceFormDetails.clabe ? invoiceFormDetails.clabe : '',
      taxId: invoiceFormDetails.taxId ? invoiceFormDetails.taxId : '',
    });
  }
  setPayeeFreelancer(invoiceFormDetails) {
    const payeeFreelancerFrmGrp = <FormGroup>this.manageInvoiceForm.controls['freelancerPayeeInfo'];
    payeeFreelancerFrmGrp.patchValue({
      accountNumber: invoiceFormDetails.accountNumber ? invoiceFormDetails.accountNumber : '',
      bankName: invoiceFormDetails.bankName ? invoiceFormDetails.bankName : '',
      clabe: invoiceFormDetails.clabe ? invoiceFormDetails.clabe : '',
      taxId: invoiceFormDetails.taxId ? invoiceFormDetails.taxId : '',
      address: invoiceFormDetails.address ? invoiceFormDetails.address : '',
      branch: invoiceFormDetails.branch ? invoiceFormDetails.branch : '',
    });
  }

  setPayeeTalent(invoiceFormDetails) {

    const payeeTalentFrmGrp = <FormGroup>this.manageInvoiceForm.controls['talentPayeeInfo'];
    payeeTalentFrmGrp.patchValue({
      accountNumber: invoiceFormDetails.accountNumber ? invoiceFormDetails.accountNumber : '',
      accountName: invoiceFormDetails.accountName ? invoiceFormDetails.accountName : '',
      bankName: invoiceFormDetails.bankName ? invoiceFormDetails.bankName : '',
      clabe: invoiceFormDetails.clabe ? invoiceFormDetails.clabe : '',
      taxId: invoiceFormDetails.taxId ? invoiceFormDetails.taxId : '',
      address: invoiceFormDetails.address ? invoiceFormDetails.address : '',
      branch: invoiceFormDetails.branch ? invoiceFormDetails.branch : '',
    });
  }
  setPayeeVendor(invoiceFormDetails) {
    const payeeVendorFrmGrp = <FormGroup>this.manageInvoiceForm.controls['vendorPayeeInfo'];
    payeeVendorFrmGrp.patchValue({
      accountName: invoiceFormDetails.accountName ? invoiceFormDetails.accountName : '',
      accountNumber: invoiceFormDetails.accountNumber ? invoiceFormDetails.accountNumber : '',
      bankName: invoiceFormDetails.bankName ? invoiceFormDetails.bankName : '',
      branch: invoiceFormDetails.branch ? invoiceFormDetails.branch : '',
      clabe: invoiceFormDetails.clabe ? invoiceFormDetails.clabe : '',
      taxId: invoiceFormDetails.taxId ? invoiceFormDetails.taxId : '',
      sortCode: invoiceFormDetails.sortCode ? invoiceFormDetails.sortCode : '',
      address: invoiceFormDetails.address ? invoiceFormDetails.address : '',
      mode: invoiceFormDetails.modeofOperation ? invoiceFormDetails.modeofOperation : '',
      abaCode: invoiceFormDetails.abaCode ? invoiceFormDetails.abaCode : '',
      swiftCode: invoiceFormDetails.swiftCode ? invoiceFormDetails.swiftCode : '',
    });
  }

  getInvoicesHistory() {
    let params: HttpParams = new HttpParams();
    params = params.append('purchaseOrderId', this.poId);
    if (this.invoiceId) {
      params = params.append('excludeInvoiceId', this.invoiceId);
    }
    this._addInvoiceService.getInvoiceHistoryList(params).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        this.invoicesHistory = response.payload.result;
        this.invoiceStatusKeyArr = Common.keyValueDropdownArr(INVOICE_STATUS, 'id', 'text');
        this.invoicesHistory.forEach(obj => {
          this.invoiceHistoryTotal = parseFloat((this.invoiceHistoryTotal + obj.invoiceAmount).toFixed(2));
        });
        this.updateSubtotal();
      } else {
        this.invoicesHistory = [];
      }
    })
  }
  addFiles(event) {
    this.enableSaveButtonFlag = false;
    this.checkDocumentValidation();
  }
  checkDocumentValidation() {
    this.filesCounter = 0;
    this.filesReceived = this.invoiceAttachments.queue.length;
    let totalAttachFileSize = 0;
    for (let i in this.invoiceAttachments.queue) {
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
        let filesize = this.invoiceAttachments.queue[i].file.size;
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
          let file = this.invoiceAttachments.queue[i]._file;
          let type = this.getFileType(file, i);
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
              let formData = this.setFormData(file);
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
  //It uploads the file
  uploadFile(formData, isDocument, obj: any = {}, index: any = 0) {

    this._sharedService.uploadFile(formData).subscribe((imageResponse: any) => {
      if (Common.checkStatusCode(imageResponse.header.statusCode)) {
        let data = imageResponse.payload.result;
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
        this.showBrowseButton = true;
        this.filesCounter++;
        if (this.filesCounter === this.filesReceived) {
          this.enableSaveButtonFlag = true;
        }
      });
  }
  checkInvoiceDocs() {
    if (this.documents.invoiceAttachmentsDocs.length === 0) {
      this.checkInvoiceAttachments = true;
      this.showBrowseButton = true;
    } else {
      this.checkInvoiceAttachments = false;
      this.showBrowseButton = false;
    }
  }
  // It sets the document id in required document array
  setDocumentId(documentId) {
    this.documents.invoiceAttachmentsDocs.push(documentId);
    this.checkInvoiceDocs();
  }

  getFileType(file, i) {
    let fileNameArr = file.name.split('.');
    let type = fileNameArr[fileNameArr.length - 1];
    this.showFileSpecificIcons(type, i);
    return type;
  }
  checkFileType(filetype) {
    let validtype = _.find(FILE_TYPES, { 'type': filetype.toLowerCase() });
    if (validtype)
      return true;
    else
      return false;
  }
  setFormData(file) {
    let formData: FormData = new FormData();
    formData.append('file', file);
    return formData;
  }
  checkInvoiceTyepOnSave() {
    let payeeVendorFrmGrp = <FormGroup>this.manageInvoiceForm.controls['vendorPayeeInfo'];
    let payeeLocationFrmGrp = <FormGroup>this.manageInvoiceForm.controls['locationPayeeInfo'];
    if (this.poData.paymentType == PAYMENT_TYPES_CONST.domestic) {
      payeeVendorFrmGrp.controls['abaCode'].setValidators(null);
      payeeVendorFrmGrp.controls['abaCode'].updateValueAndValidity();
      payeeVendorFrmGrp.controls['swiftCode'].setValidators(null);
      payeeVendorFrmGrp.controls['swiftCode'].updateValueAndValidity();
    }
    if (this.poData.paymentType == PAYMENT_TYPES_CONST.international) {
      payeeVendorFrmGrp.controls['clabe'].setValidators(null);
      payeeVendorFrmGrp.controls['clabe'].updateValueAndValidity();
      payeeVendorFrmGrp.controls['taxId'].setValidators(null);
      payeeVendorFrmGrp.controls['taxId'].updateValueAndValidity();
      payeeVendorFrmGrp.controls['sortCode'].setValidators(null);
      payeeVendorFrmGrp.controls['sortCode'].updateValueAndValidity();
    }
    if (!this.poData.isScouterBeneficiary) {
      payeeLocationFrmGrp.controls['taxId'].setValidators(null);
      payeeLocationFrmGrp.controls['taxId'].updateValueAndValidity();
    }
  }
  saveInvoice() {
    this.checkInvoiceTyepOnSave();
    this.spinnerFlag = true;
    this.submitInvoiceForm = true;
    this.checkInvoiceDocs();
    if (this.manageInvoiceForm.valid && !this.showMsg && !this.checkInvoiceAttachments) {
      this.enableSaveButtonFlag = false;
      const formvalue = this.manageInvoiceForm.value;
      formvalue['langCode'] = this.sessionService.getCookie(COOKIES_CONSTANTS.langCode);
      formvalue['purchaseOrderId'] = this.poId;
      formvalue['purchaseOrderCurrency'] = this.poData.currencyCode;
      const finalInvoiceData = ManageInvoiceData.setFormData(formvalue, this.documents, this.poData);
      if (!this.invoiceId) {
        this._addInvoiceService.postInvoiceDetails(finalInvoiceData).subscribe((response: any) => {
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
        this._addInvoiceService.putInvoiceDetails(this.invoiceId, finalInvoiceData).subscribe((response: any) => {
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
      Common.scrollToInvalidControl(this, this.manageInvoiceForm, 'spinnerFlag');
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
        invoiceVATWitholding: this.poData.percentVATWithholding,
        percentAgencyFee: this.poData.percentAgencyFee ? this.poData.percentAgencyFee : 0,
        percentMarkup: this.poData.percentMarkup ? this.poData.percentMarkup : 0,
        iva: this.poData.percentIVA ? this.poData.percentIVA : 0,

      });
    }

  }
  /*
     Checking IS NAN condition for invoice amount.
   */
  checkAmount() {
    let formvalue = this.manageInvoiceForm.value;
    if (isNaN(formvalue.invoiceVat) || formvalue.invoiceVat === '.') {
      this.manageInvoiceForm.controls['invoiceVat'].setValue(0);
    }
    if (isNaN(this.manageInvoiceForm.value.invoiceAmount)) {
      this.manageInvoiceForm.controls['invoiceAmount'].setValue(0);
    }
  }
  updateSubtotal() {
    this.checkAmount();
    this.updateISRWitholding();
    this.updateVatWitholding();

    let formvalue = this.manageInvoiceForm.value;

    // if (!formvalue.invoiceVat) {
    //   this.manageInvoiceForm.patchValue({
    //     invoiceVat: 0,
    //   })
    // }
    if (!formvalue.invoiceVATWitholding) {
      this.manageInvoiceForm.patchValue({
        invoiceVATWitholding: 0,
      })
    }
    if (!formvalue.invoiceISRWitholding) {
      this.manageInvoiceForm.patchValue({
        invoiceISRWitholding: 0,
      })
    }
    this.amount = parseFloat((parseFloat(this.poData.totalAmountRequested) - parseFloat(this.invoiceHistoryTotal)).toFixed(2));
    if (formvalue.invoiceAmount > this.amount) {
      this.showMsg = true;
    } else {
      this.showMsg = false;
    }
    if (formvalue.invoiceVat == 0) {
      this.subTotal = formvalue.invoiceVat + parseFloat(formvalue.invoiceAmount)
    }
    if (formvalue.invoiceVat && formvalue.invoiceAmount) {
      let invoiceAmountFlag = isNaN(formvalue.invoiceAmount);
      let invoiceVatFlag = isNaN(formvalue.invoiceVat);
      if (!invoiceAmountFlag && !invoiceVatFlag) {
        let calculatedSubtotalValue: any = (parseFloat(formvalue.invoiceAmount) * parseFloat(formvalue.invoiceVat)) / 100;
        this.subTotal = parseFloat(calculatedSubtotalValue) + parseFloat(formvalue.invoiceAmount)
      } else {
        this.subTotal = 0;
      }
    }
    if (formvalue.invoiceAmount > this.poData.totalAmountRequested) {
      this.manageInvoiceForm.controls['invoicePercentage'].setValue(0);
    }
    if ((this.poData.totalAmountRequested && formvalue.invoiceAmount) && (formvalue.invoiceAmount <= this.poData.totalAmountRequested)) {
      let calculatedPercentageValue: any = (parseFloat(formvalue.invoiceAmount) * 100) / parseFloat(this.poData.totalAmountRequested);
      let transFormedValue = this._twoDecimal.transform(calculatedPercentageValue);
      if (transFormedValue) {
        this.manageInvoiceForm.patchValue({
          invoicePercentage: transFormedValue
        })
      } else {
        this.manageInvoiceForm.patchValue({
          invoicePercentage: 0
        })
      }
    }
    if (!formvalue.invoiceAmount) {
      this.subTotal = 0;
    }
    this.updatePayableAmount();
  }

  // totalAmount(payeeFormDtails) {
  //   this.fee = payeeFormDtails.totalAmountRequested * (payeeFormDtails.agencyFee / 100);
  //   this.markupFee = ((payeeFormDtails.totalAmountRequested + this.fee) * (payeeFormDtails.percentMarkup / 100));
  //   this.totalAmt = (payeeFormDtails.totalAmountRequested + this.fee + this.markupFee);
  //   console.log(this.totalAmt, '0000000000');

  // }
  /**
   * Calculates Talent po taxation amounts
   */
  calculateAllAmounts() {
    this.updateAgencyFeeAmount();
    this.updateMarkupAmount();
    this.updateIvaAmount();
    this.updateTotalAmount();
  }

  /**
   * Updated total talent
   */
  updateTotalTalent() {
    this.checkAmount();
    const formvalue = this.manageInvoiceForm.value;
    this.amount = parseFloat((parseFloat(this.poData.totalAmountRequested) - parseFloat(this.invoiceHistoryTotal)).toFixed(2));
    if (formvalue.invoiceAmount > this.amount) {
      this.showMsg = true;
    } else {
      this.showMsg = false;
    }
    if (formvalue.invoiceAmount > this.poData.totalAmountRequested) {
      this.manageInvoiceForm.controls['invoicePercentage'].setValue(0);
    }
    if ((this.poData.totalAmountRequested && formvalue.invoiceAmount) && (formvalue.invoiceAmount <= this.poData.totalAmountRequested)) {
      let calculatedPercentageValue: any = (parseFloat(formvalue.invoiceAmount) * 100) / parseFloat(this.poData.totalAmountRequested);
      let transFormedValue = this._twoDecimal.transform(calculatedPercentageValue);
      if (transFormedValue) {
        this.manageInvoiceForm.patchValue({
          invoicePercentage: transFormedValue
        })
      } else {
        this.manageInvoiceForm.patchValue({
          invoicePercentage: 0
        })
      }
    }
    if (!formvalue.invoiceAmount) {
      this.subTotal = 0;
    }
    this.updatePayableAmount();
  }

  // @HostListener('document:keydown', ['$event'])
  // onKeyDownHandler(event: KeyboardEvent) {
  //   if (event.keyCode === 13) {
  //     event.preventDefault();
  //     if (!this.spinnerFlag && this.enableSaveButtonFlag) {
  //       this.saveInvoice();
  //     }
  //   }
  // }

  updateInvoiceAmt() {
    const formvalue = this.manageInvoiceForm.value;
    if (isNaN(formvalue.invoicePercentage) || formvalue.invoicePercentage === '.') {
      this.manageInvoiceForm.controls['invoicePercentage'].setValue(0);
      this.manageInvoiceForm.patchValue({
        invoiceAmount: 0
      });
      formvalue.invoicePercentage = 0;
    }
    formvalue.invoiceAmount = 0;

    if (formvalue.invoicePercentage > 100) {
      this.manageInvoiceForm.controls['invoicePercentage'].setValue(100);
      formvalue.invoicePercentage = 100;
    }
    if (this.poData.totalAmountRequested && formvalue.invoicePercentage) {
      const calculatedInvoiceAmountValue: any = (parseFloat(this.poData.totalAmountRequested) * parseFloat(formvalue.invoicePercentage)) / 100;
      const transFormedInvoiceValue = this._twoDecimal.transform(calculatedInvoiceAmountValue);

      if (transFormedInvoiceValue) {
        this.manageInvoiceForm.patchValue({
          invoiceAmount: transFormedInvoiceValue
        })

        this.updateSubTotalOnInvoicePercentage();
        this.updateVatWitholding();
        this.updateISRWitholding();
        this.updatePayableAmount();
      } else {
        this.manageInvoiceForm.patchValue({
          invoiceAmount: 0
        });
      }
      this.amount = parseFloat((parseFloat(this.poData.totalAmountRequested) - parseFloat(this.invoiceHistoryTotal)).toFixed(2));

      if (this.manageInvoiceForm.controls['invoiceAmount'].value > this.amount) {
        this.showMsg = true;
      } else {
        this.showMsg = false;
      }
    }
    if (!formvalue.invoicePercentage) {
      this.manageInvoiceForm.patchValue({
        invoicePercentage: 0,
      })
    }

  }


  updateInvoiceAmountTalent() {
    let formvalue = this.manageInvoiceForm.value;
    if (isNaN(formvalue.invoicePercentage) || formvalue.invoicePercentage === '.') {
      this.manageInvoiceForm.controls['invoicePercentage'].setValue(0);
      this.manageInvoiceForm.patchValue({
        invoiceAmount: 0
      });
      formvalue.invoicePercentage = 0;
    }
    formvalue.invoiceAmount = 0;

    if (formvalue.invoicePercentage > 100) {
      this.manageInvoiceForm.controls['invoicePercentage'].setValue(100);
      formvalue.invoicePercentage = 100;
    }
    if (this.poData.totalAmountRequested && formvalue.invoicePercentage) {
      let calculatedInvoiceAmountValue: any = (parseFloat(this.poData.totalAmountRequested) * parseFloat(formvalue.invoicePercentage)) / 100;
      let transFormedInvoiceValue = this._twoDecimal.transform(calculatedInvoiceAmountValue);

      if (transFormedInvoiceValue) {
        this.manageInvoiceForm.patchValue({
          invoiceAmount: transFormedInvoiceValue
        })

        this.updateTotalOnInvoicePercentageTalent();
        // this.updateVatWitholding();
        // this.updateISRWitholding();
        // this.updatePayableAmount();
      } else {
        this.manageInvoiceForm.patchValue({
          invoiceAmount: 0
        })
      }
      this.amount = parseFloat((parseFloat(this.poData.totalAmountRequested) - parseFloat(this.invoiceHistoryTotal)).toFixed(2));
      if (this.manageInvoiceForm.controls['invoiceAmount'].value > this.amount) {
        this.showMsg = true;
      } else {
        this.showMsg = false;
      }
    }
    if (!formvalue.invoicePer) {
      this.manageInvoiceForm.patchValue({
        invoicePer: 0,
      })
    }

  }
  updateSubTotalOnInvoicePercentage() {
    let formvalue = this.manageInvoiceForm.value;
    if (isNaN(formvalue.invoiceVat) || formvalue.invoiceVat === '.') {
      this.manageInvoiceForm.controls['invoiceVat'].setValue(0);
    }
    if (formvalue.invoiceVat == 0) {
      this.subTotal = formvalue.invoiceVat + parseFloat(formvalue.invoiceAmount)
    }
    if (formvalue.invoiceVat && formvalue.invoiceAmount) {
      let invoiceAmountFlag = isNaN(formvalue.invoiceAmount);
      let invoiceVatFlag = isNaN(formvalue.invoiceVat);
      if (!invoiceAmountFlag && !invoiceVatFlag) {
        let calculatedSubtotalValue: any = (parseFloat(formvalue.invoiceAmount) * parseFloat(formvalue.invoiceVat)) / 100;
        this.subTotal = parseFloat(calculatedSubtotalValue) + parseFloat(formvalue.invoiceAmount)
      } else {
        this.subTotal = 0;
      }
    }
  }



  updateTotalOnInvoicePercentageTalent() {
    let formvalue = this.manageInvoiceForm.value;
    if (formvalue.invoiceVat && formvalue.invoiceAmount) {
      let invoiceAmountFlag = isNaN(formvalue.invoiceAmount);
      let invoiceVatFlag = isNaN(formvalue.invoiceVat);
      if (!invoiceAmountFlag && !invoiceVatFlag) {
        let calculatedSubtotalValue: any = (parseFloat(formvalue.invoiceAmount)) / 100;
      } else {
        this.subTotal = 0;
      }
    }
  }






  updateVatWitholding() {
    let formvalue = this.manageInvoiceForm.value;
    if (isNaN(formvalue.invoiceVATWitholding) || formvalue.invoiceVATWitholding === '.') {
      this.manageInvoiceForm.controls['invoiceVATWitholding'].setValue(0);
    }
    // if (formvalue.invoiceVATWitholding && formvalue.invoiceAmount) {
      let invoiceAmountFlag = isNaN(formvalue.invoiceAmount);
      let invoiceVatFlag = isNaN(formvalue.invoiceVATWitholding);
      if (!invoiceAmountFlag && !invoiceVatFlag) {
        this.vatWitholdingAmt = (( formvalue.invoiceAmount ? parseFloat(formvalue.invoiceAmount) : 0) * ( formvalue.invoiceVATWitholding ? parseFloat(formvalue.invoiceVATWitholding) : 0)) / 100;

      } else {
        this.vatWitholdingAmt = 0;
      }
    // }
  }
  updateISRWitholding() {
    let formvalue = this.manageInvoiceForm.value;
    if (isNaN(formvalue.invoiceISRWitholding) || formvalue.invoiceISRWitholding === '.') {
      this.manageInvoiceForm.controls['invoiceISRWitholding'].setValue(0);
    }
    // if (formvalue.invoiceISRWitholding && formvalue.invoiceAmount) {
      let invoiceAmountFlag = isNaN(formvalue.invoiceAmount);
      let invoiceISRFlag = isNaN(formvalue.invoiceISRWitholding);
      if (!invoiceAmountFlag && !invoiceISRFlag) {
        this.isrWitholdingAmt = (( formvalue.invoiceAmount ? parseFloat(formvalue.invoiceAmount) : 0) * ( formvalue.invoiceISRWitholding ? parseFloat(formvalue.invoiceISRWitholding) : 0 )) / 100;

      } else {
        this.isrWitholdingAmt = 0;
      }
    // }
  }
  navigateTo() {
    if (this.showMasterInvoiceListingBackToList) {
      this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.masterPaymentOrder, [])]);
    } else {
      if (this.invoiceId) {
        this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.paymentOrder, [this.projectID, this.budgetId])]);
      } else if (!this.invoiceId && !this.showMasterPOBackToList) {
        this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.purchaseOrder, [this.projectID, this.budgetId])]);
      } else if (!this.invoiceId && this.showMasterPOBackToList) {
        this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.masterPO, [])]);
      }
    }
  }
  updatePayableAmount() {
    if (this.subTotal) {
      this.payableAmount = (this.subTotal - (this.isrWitholdingAmt + this.vatWitholdingAmt));
    } else {
      this.payableAmount = 0;
    }
  }

  /**
** Checks entered value is integer or not for markup insurance & exchange rate formgroups
** @param formGroup as FormGroup  to get form value
** @param formControlName as string 
**/
  checkIntegerValue(formControlName: string) {
    const formvalue = this.manageInvoiceForm.value;
    let value = formvalue[formControlName];
    if (isNaN(formvalue[formControlName])) {
      value = 0;
    } else if ((formControlName != 'invoiceAmount') && formvalue[formControlName] > 100) {
      value = 100;
    }
    this.manageInvoiceForm.controls[formControlName].setValue(value);
  }

  /**
   * Updates blank input to 0
   * @param formControlName as control name
   */
  updateInput(formControlName: string) {
    const formvalue = this.manageInvoiceForm.value;
    let value = formvalue[formControlName];
    if (!formvalue[formControlName]) {
      value = 0;
    }
    this.manageInvoiceForm.controls[formControlName].setValue(value);
  }

  updateTotalPOAmount() {
    const formValue = this.manageInvoiceForm.value;
    this.totalAmount = 0;
    const amount = (this.poData.totalAmountRequested) ? parseFloat(this.poData.totalAmountRequested) : 0;
    const agencyFee = (this.poAgencyFeeAmount) ? parseFloat(this.poAgencyFeeAmount) : 0;
    const iva = (this.poIvaAmount) ? parseFloat(this.poIvaAmount) : 0;
    const markup = (this.poMarkupAmount) ? parseFloat(this.poMarkupAmount) : 0;
    this.poTotalAmount = amount + agencyFee + iva + markup;
  }

  calCulatePOPayableAmount() {
    this.updatePOAgencyFeeAmount();
    this.updatePOIvaAmount();
    this.updatePOMarkupAmount();
    this.updateTotalPOAmount();
  }


  /**
 * Calculate markup amount
 */
  updatePOMarkupAmount() {
    if (this.poData.totalAmountRequested) {
      this.poMarkupAmount = 0;
      this.poMarkupAmount = ((parseFloat(this.poData.totalAmountRequested) + parseFloat(this.poAgencyFeeAmount)) * (parseFloat(this.poData.percentMarkup) / 100));

    }
  }
  /**
   * Calculates agency fee amount
   */
  updatePOAgencyFeeAmount() {
    if (this.poData.totalAmountRequested) {
      this.poAgencyFeeAmount = 0;
      this.poAgencyFeeAmount = (parseFloat(this.poData.totalAmountRequested) * (parseFloat(this.poData.percentAgencyFee) / 100));

    }
  }
  /**
   * Calculates IVA amount
   */
  updatePOIvaAmount() {
    if (this.poData.totalAmountRequested) {
      this.poIvaAmount = 0;
      this.poIvaAmount = (parseFloat(this.poData.totalAmountRequested) + parseFloat(this.poAgencyFeeAmount)) * (parseFloat(this.poData.percentIVA) / 100);

    }

  }
  /**
   * Update talent PO total amount
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
    this.markupAmount = ((formValue.invoiceAmount ? parseFloat(formValue.invoiceAmount) : 0 ) + (this.agencyFeeAmount ? parseFloat(this.agencyFeeAmount) : 0)) * ((formValue.percentMarkup ? parseFloat(formValue.percentMarkup) : 0) / 100);
    // formValue.percentMarkup = (formValue.percentMarkup) ? parseFloat(formValue.percentMarkup) : 0;
    // this.manageInvoiceForm.controls['percentMarkup'].setValue(formValue.percentMarkup);
  }
  /**
   * Calculates agency fee amount
   */
  updateAgencyFeeAmount() {
    const formValue = this.manageInvoiceForm.value;
    this.agencyFeeAmount = 0;
    this.agencyFeeAmount = ((formValue.invoiceAmount ? parseFloat(formValue.invoiceAmount) : 0 ) * (( formValue.percentAgencyFee ? parseFloat(formValue.percentAgencyFee) : 0 ) / 100));
  }
  /**
   * Calculates IVA amount
   */
  updateIvaAmount() {
    const formValue = this.manageInvoiceForm.value;
    const agencyFeeAmount = this.agencyFeeAmount ? this.agencyFeeAmount : 0;
    this.cost = (parseFloat(formValue.invoiceAmount) + parseFloat(agencyFeeAmount));
    this.ivaAmount = 0;
    this.ivaAmount = (( this.cost ? parseFloat(this.cost) : 0 ) * ((formValue.iva ? parseFloat(formValue.iva) : 0 ) / 100));

  }

  setValueZero(field) {
    const formvalue = this.manageInvoiceForm.value;
    if (!formvalue[field]) {
      this.manageInvoiceForm.controls[field].setValue(0);
    }
  }
}
