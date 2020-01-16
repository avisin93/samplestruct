import { TranslateService } from '@ngx-translate/core';
/** 1.Import third party components
2. Import created modules
3. Import crated services
4. Import created classes
5. Import created constants **/
import { Component, OnInit, ViewChild, HostListener, OnDestroy } from '@angular/core';
import {
  ROUTER_LINKS_FULL_PATH,
  defaultDatepickerOptions, TAG_NAME_TEXTAREA,
  MEDIA_SIZES, DEDUCTION_TYPES, ADVANCE_PO_FOR, DEFAULT_CURRENCY
} from '@app/config';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap';
import { IMyDrpOptions } from 'mydaterangepicker';
import { ProjectsData } from '../../../../projects.data';
import { SharedService } from '@app/shared/shared.service';
import { Common, CustomValidators } from '@app/common';
import * as _ from 'lodash';
import { ManagePOSettlementData } from './manage-settlement.data.model';
import { ManageSettlementService } from './manage-settlement.service';
import { SETTLEMENT_APPROVAL_CONST, SETTLE_FILE_TYPES } from '../settlement.constants';
declare var $: any;

const swal = require('sweetalert');
@Component({
  selector: 'app-manage-settlement',
  templateUrl: './manage-settlement.component.html',
  styleUrls: ['./manage-settlement.component.scss']
})
export class ManageSettlementComponent implements OnInit, OnDestroy {
  /*declare variables above constructor in sequence -imported constants,public variable,private variables*/
  @ViewChild('addReceiptModal') public addReceiptModal: ModalDirective;
  SETTLEMENT_APPROVAL_CONST = SETTLEMENT_APPROVAL_CONST;
  // DEDUCTION_TYPES = DEDUCTION_TYPES;
  datePickerOptions = JSON.parse(JSON.stringify(defaultDatepickerOptions));
  advancesList: any;
  ADVANCE_PO_FOR = ADVANCE_PO_FOR;
  modalOpen: Boolean = false;
  modesOfOperation: any = [];
  budgetLineList: any = [];
  receiptTypeKeyArr: any;
  settlePOForm: FormGroup;
  addReceiptForm: FormGroup;
  settlementId: any;
  submitReceiptForm: Boolean = false;
  submitAmountReceivedForm: Boolean = false;
  submitPaybackAmountForm: Boolean = false;
  isDraftClicked: Boolean = false;
  submitDraftSpinnerFlag: Boolean = false;
  isClicked: Boolean = false;
  renderPage: Boolean = false;
  submitSpinnerFlag: Boolean = false;
  saveSpinnerFlag: Boolean = false;
  submmitedFormFlag: Boolean = false;
  editReceiptFlag: Boolean = false;
  myDatePickerOptions: IMyDrpOptions = defaultDatepickerOptions;
  subTotal: number;
  receiptIndex: number;
  files: any = [];
  projectId: any;
  defaultCurrency: any = {};
  budgetLineListData: any = [];
  poId: any;
  poData: any;
  multipleDocumentUpload = [];
  settlementDetails: any;
  commonLabelObj: any;
  disableButtonFlag: Boolean = false;
  DEDUCTION_TYPES: { id: number; text: string; }[];
  budgetId: any;
  /*declare variables above constructor in sequence -imported constants,public variable,private variables*/

  /*inicialize contsructor after declaration of all variables*/
  constructor(private fb: FormBuilder, private route: ActivatedRoute,
    private toastrService: ToastrService,
    private router: Router, private _sharedService: SharedService,
    private translateService: TranslateService,
    private projectsData: ProjectsData, private _settlePOService: ManageSettlementService) {
    this.datePickerOptions.disableUntil = {
      year: Common.getTodayDate().getFullYear(),
      month: Common.getTodayDate().getMonth() + 1,
      day: Common.getTodayDate().getDate() - 1
    };
  }
  /*inicialize contsructor after declaration of all variables*/

  /*all life cycle events whichever required after inicialization of constructor*/
  ngOnInit() {
    Common.scrollTOTop();
    $('.currency-dropdown').hide();
    this.route.params.subscribe(params => {
      this.settlementId = params['id'];
    });
    this.poId = this.route.snapshot.queryParams['poId'];
    const projectData: any = this.projectsData.getProjectsData();
    this.projectId = this.projectsData.projectId;
    this.budgetId = this.projectsData.budgetId;
    this.defaultCurrency['id'] = DEFAULT_CURRENCY.id;
    this.defaultCurrency['name'] = DEFAULT_CURRENCY.name;
    this.createForm();
    this.createReceiptForm();
    this.setPurchaseOrderDetails();
    this.getDropdownValues();
    this.translateService.get('common').subscribe((res: string) => {
      this.commonLabelObj = res;
    });
  }
  ngOnDestroy() {
    $('.currency-dropdown').show();
  }
  getDropdownValues() {
    this.DEDUCTION_TYPES = Common.changeDropDownValues(this.translateService, DEDUCTION_TYPES);
    this.receiptTypeKeyArr = Common.keyValueDropdownArr(this.DEDUCTION_TYPES, 'id', 'text');
  }
  setSettlementDetails() {
    this._settlePOService.getSettlementDetails(this.settlementId).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload) {
          const settlementDetails = response.payload.result;
          this.settlementDetails = ManagePOSettlementData.getFormDetails(settlementDetails);
          this.setFormValues(this.settlementDetails);
        }

      }
    },
      error => {
        this.settlementDetails = {};
      });
  }
  /**
   * Sets purchase order details
   */
  setPurchaseOrderDetails() {
    this._settlePOService.getPODetails(this.poId).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        this.poData = response.payload.result;
        if (this.poData.supplierType == ADVANCE_PO_FOR.vendor || this.poData.supplierType == ADVANCE_PO_FOR.freelancer) {
          if (this.poData && this.poData.services[0]) {
            this.poData.services[0]['amount'] = this.poData.totalAmountRequested;
          }
        }
        this.advancesList = this.poData.services;
        this.settlePOForm.patchValue({
          settlementAmount: this.getTotalAmount(this.advancesList),
          payBackAmount: 0,
          receiptAmount: 0,
          amountToBeReceived: 0
        });
        if (!this.settlementId) {
          this.renderPage = true;
        }
        this.getPageDetails();
      }
    });
  }
  /**
* Sets Budgetlines
*/
  /*all life cycle events whichever required after inicialization of constructor*/

  /*method to get all page details*/
  getPageDetails() {
    this.getModesOfOperation();
    this.setAdvanceSettleBudgetLines();
    if (this.settlementId) {
      this.setSettlementDetails();
    }

  }
  /*method to get all page details*/

  /*method to get list of mode of operations*/
  getModesOfOperation() {
    this._sharedService.getModesOfOperation().subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.results) {
          const modesOfOperation = response.payload.results;
          this.modesOfOperation = Common.getMultipleSelectArr(modesOfOperation, ['id'], ['i18n', 'name']);
        } else {
          this.modesOfOperation = [];
        }
      } else {
        this.modesOfOperation = [];
      }
    },
      error => {
        this.modesOfOperation = [];
      });
  }
  /*method to get list of mode of operations*/

  /*method to get list of po budget lines*/
  setAdvanceSettleBudgetLines() {
    this._sharedService.getAdvanceSettleBudgetLines(this.budgetId).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.results) {
          this.budgetLineListData = response.payload.results;
          this.budgetLineList = Common.getMultipleSelectArr(this.budgetLineListData, ['id'], ['budgetLine']);
        } else {
          this.budgetLineList = [];
        }

      } else {
        this.toastrService.error(response.header.message);
        this.budgetLineList = [];
        this.budgetLineListData = [];
      }
    },
      error => {
        this.budgetLineList = [];
        this.budgetLineListData = [];
      });
  }
  /*method to get list of po budget lines*/

  /**
   * method to set  budgetLineName control value
    @param id as string for getting name of respective  budget line
   */
  budgetLineSelected(id) {
    const dataObj = _.find(this.budgetLineListData, { 'id': id });
    if (dataObj) {
      this.addReceiptForm.controls['budgetLineName'].setValue(dataObj.budgetLine);
    }
  }

  /**
   * generic method to get total/summation of amount field of all records
    @param list as array of objects for getting data list
    @param fieldName as string for getting name of field
    return sum as number
   */
  getTotalAmount(list, fieldName: string = 'amount') {
    let sum: any = 0;
    list.forEach((obj) => {
      if (fieldName) {
        sum = parseFloat(sum) + parseFloat(obj[fieldName]);
      }
    });
    return sum;
  }
  /*method to create po settlement form*/
  createForm() {
    this.settlePOForm = this.fb.group({
      totalAmtToSettle: [''],
      status: [''],
      date: [Common.getTodayDateObj(), [CustomValidators.required]],
      settlementAmount: [''],
      payBackAmount: [''],
      receiptAmount: [''],
      amountToBeReceived: [''],
      receiptsArr: this.fb.array([]),
      amountToBeReceivedArr: this.fb.array([]),
      paybackAmountArr: this.fb.array([]),
    });
    if (!this.settlementId) {
      this.addAmountToBeReceived();
      this.addPaybackAmount();
    }
  }

  setFormValues(settlementDetails) {
    this.settlePOForm.patchValue({
      date: settlementDetails.date
    });
    if (settlementDetails.receiptsArr && settlementDetails.receiptsArr.length > 0) {
      const receiptsArray = <FormArray>this.settlePOForm.get('receiptsArr');
      // tslint:disable-next-line:no-shadowed-variable
      for (let i = 0; i < settlementDetails.receiptsArr.length; i++) {
        this.addReceipt();
        // if (!this.multipleDocumentUpload[i]) {
        //   this.multipleDocumentUpload[i] = [];
        // }
        const filesArray = <FormArray>receiptsArray.controls[i].get('files');
        const receipt = settlementDetails.receiptsArr[i];
        for (let j = 0; j < receipt.files.length; j++) {
          filesArray.push(this.createFileGroup());
          const receiptFiles = <FormGroup>filesArray.controls[j];
          receiptFiles.patchValue({
            id: receipt.files[j].fileId,
            name: receipt.files[j].fileName,
            fileUrl: receipt.files[j].fileUrl
          });
          // this.multipleDocumentUpload[i][j] = true;
        }
        receiptsArray.controls[i].patchValue({
          'budgetLine': receipt.budgetLine,
          'amount': receipt.amount,
          'vat': receipt.vat,
          'receiptType': receipt.receiptType,
          'files': receipt.files,
          'description': receipt.description,
          'budgetLineName': receipt.budgetLineName,
          'isAttachedImg': receipt.isAttachedImg
        });
        const receiptForm = <FormGroup>receiptsArray.controls[i];
        this.updateSubtotal(receiptForm);
      }
    }
    if (settlementDetails.amountToBeReceivedArr && settlementDetails.amountToBeReceivedArr.length > 0) {
      const amountToBeReceivedArr = <FormArray>this.settlePOForm.get('amountToBeReceivedArr');
      // tslint:disable-next-line:no-shadowed-variable
      for (let i = 0; i < settlementDetails.amountToBeReceivedArr.length; i++) {
        this.addAmountToBeReceived();
        const receipt = settlementDetails.amountToBeReceivedArr[i];
        amountToBeReceivedArr.controls[i].patchValue({
          amount: receipt.amount,
          mode: receipt.mode
        });
      }
    }
    else {
      this.addAmountToBeReceived();
    }
    if (settlementDetails.paybackAmountArr && settlementDetails.paybackAmountArr.length > 0) {
      const paybackAmountArr = <FormArray>this.settlePOForm.get('paybackAmountArr');
      for (let i = 0; i < settlementDetails.paybackAmountArr.length; i++) {
        this.addPaybackAmount();
        const receipt = settlementDetails.paybackAmountArr[i];
        paybackAmountArr.controls[i].patchValue({
          amount: receipt.amount,
          mode: receipt.mode
        });
      }
    }
    else {
      this.addPaybackAmount();
    }
    const formValue = this.settlePOForm.value;
    const receiptAmount = this.getTotalAmount(formValue.receiptsArr, 'subTotal');
    this.settlePOForm.controls['receiptAmount'].setValue(receiptAmount);
    this.renderPage = true;
    this.calculateAndUpdateStatus(false);
  }
  /*method to create po settlement form*/

  /*method to create receipt form*/
  createReceiptForm() {
    this.addReceiptForm = this.createReceiptFormGroup();
  }
  /*method to create receipt form*/

  /*method to create receipt form group*/
  createReceiptFormGroup() {
    return this.fb.group({
      budgetLine: ['', [CustomValidators.required]],
      budgetLineName: [''],
      amount: ['', [CustomValidators.requiredWithout0, CustomValidators.requiredNumber, CustomValidators.checkDecimal]],
      description: ['', [CustomValidators.required]],
      files: this.fb.array([]),
      receiptType: ['', [CustomValidators.required]],
      vat: ['', [CustomValidators.requiredNumber, CustomValidators.checkUptoFourDecimal]],
      subTotal: ['']
    });
  }
  /*method to create receipt form group*/

  /*method to create amount to be received/pay back amount form group*/
  createAmountFormGroup() {
    return this.fb.group({
      amount: ['', [CustomValidators.required]],
      mode: ['']
    });
  }
  /*method to create amount to be received/pay back amount form group*/

  /*method to add receipt formgroup to receiptsArr formarray*/
  addReceipt() {

    const control = <FormArray>this.settlePOForm.controls['receiptsArr'];
    const formGroup = this.createReceiptFormGroup();
    const filesArr = <FormArray>formGroup.get('files');
    this.addReceiptForm.value.files.forEach((obj) => {
      const filesFormGroup = this.createFileGroup();
      filesArr.push(filesFormGroup);
    });
    formGroup.patchValue(this.addReceiptForm.value);
    control.push(formGroup);
    this.clearReceiptForm();
  }
  /*method to add receipt formgroup to receiptsArr formarray*/

  /**
    *method to calculate and update status of settlement
     @param updateAmountFlag as Boolean value to decide to update amount or not
    */
  calculateAndUpdateStatus(updateAmountFlag: Boolean) {
    const formValue = this.settlePOForm.value;
    if (this.advancesList && this.advancesList.length > 0) {
      const settlementAmount = this.getTotalAmount(this.advancesList);
      const receiptAmount = this.getTotalAmount(formValue.receiptsArr, 'subTotal');
      this.settlePOForm.controls['receiptAmount'].setValue(receiptAmount);
      this.settlePOForm.controls['settlementAmount'].setValue(settlementAmount);
      if (updateAmountFlag) {
        this.updateAmount();
      }
      const amountToBeReceived = this.getTotalAmount(this.settlePOForm.value.amountToBeReceivedArr);
      const payBackAmount = this.getTotalAmount(this.settlePOForm.value.paybackAmountArr);
      this.settlePOForm.controls['amountToBeReceived'].setValue(amountToBeReceived);
      this.settlePOForm.controls['payBackAmount'].setValue(payBackAmount);
      const settleAmount = ((parseFloat(settlementAmount) + parseFloat(payBackAmount)) - (parseFloat(receiptAmount)
        + parseFloat((amountToBeReceived))));
      // console.log(Math.abs(settleAmount));
      if (settleAmount == 0 || Math.abs(settleAmount) < 0.02) {
        this.settlePOForm.controls['status'].setValue(SETTLEMENT_APPROVAL_CONST.settled);
      }
      else {
        this.settlePOForm.controls['status'].setValue(SETTLEMENT_APPROVAL_CONST.draft);
      }
    }
    else {
      this.settlePOForm.controls['settlementAmount'].setValue(0);
      this.settlePOForm.controls['status'].setValue('');
    }
    const receiptsArr = <FormArray>this.settlePOForm.controls['receiptsArr'];
    const amountToBeReceivedControl = <FormArray>this.settlePOForm.controls['amountToBeReceivedArr'];
    const paybackControl = <FormArray>this.settlePOForm.controls['paybackAmountArr'];
    if (receiptsArr.length === 0) {
      const resetAmount = <FormGroup>amountToBeReceivedControl.controls[0];
      const resetPaybackAmount = <FormGroup>paybackControl.controls[0];
      resetAmount.controls['amount'].setValue('');
      resetPaybackAmount.controls['amount'].setValue('');
    }
  }

  /**
 * Checks Modal open event
 * @param modalFlag as to check modal onShow or onHide
 */
  checkModalOpen(modalFlag) {
    if (modalFlag) {
      this.modalOpen = true;
    } else {
      this.modalOpen = false;
    }
  }
  /**
   * Closes Receipt pop up on escape
   * @param event;
   */
  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.addReceiptModal.hide();
    }
    if(event && event.target && event.target['tagName'] != TAG_NAME_TEXTAREA) {
      if (event.keyCode === 13) {
        event.preventDefault();
        if (this.modalOpen && !this.disableButtonFlag) {
          this.updateSubtotal(this.addReceiptForm);
          this.addReceiptRow();
        } else if (!this.modalOpen && !this.submitDraftSpinnerFlag) {
          this.submitSettlement(SETTLEMENT_APPROVAL_CONST.draft);
        }
      }
    }
  }

  /*method to clear receipt form */
  clearReceiptForm() {
    const filesArray = <FormArray>this.addReceiptForm.get('files');
    filesArray.controls = [];
    this.addReceiptForm.reset();
  }
  /*method to clear receipt form */

  /*method to add/edit receipt row */
  addReceiptRow() {

    this.submitReceiptForm = true;
    if (this.addReceiptForm.valid && this.addReceiptForm.value.files.length > 0) {
      this.disableButtonFlag = true;
      this.submitReceiptForm = false;
      // tslint:disable-next-line:triple-equals
      if (this.receiptIndex || this.receiptIndex == 0) {
        const receiptsArr = <FormArray>this.settlePOForm.controls['receiptsArr'];
        const receiptFormGroup = receiptsArr.controls[this.receiptIndex];
        const filesArr = <FormArray>receiptFormGroup.get('files');
        filesArr.controls = [];
        this.addReceiptForm.value.files.forEach((obj) => {
          const filesFormGroup = this.createFileGroup();
          filesArr.push(filesFormGroup);
        });
        receiptFormGroup.setValue(this.addReceiptForm.value);
        this.receiptIndex = null;
      }
      else {
        this.addReceipt();
      }
      this.calculateAndUpdateStatus(true);
      this.addReceiptModal.hide();
    }
  }
  /*method to add/edit receipt row */

  /*method to add amount formgroup to  amountToBeReceivedArr formArray*/
  addAmountToBeReceived() {
    const control = <FormArray>this.settlePOForm.controls['amountToBeReceivedArr'];
    control.push(this.createAmountFormGroup());
  }
  /*method to add amount formgroup to  amountToBeReceivedArr formArray*/

  /*method to check amountToBeReceived formgroup is valid or not before adding new row*/
  addAmountToBeReceivedRow(formGroup: FormGroup) {
    if (formGroup.valid) {
      this.addAmountToBeReceived();
      this.submitAmountReceivedForm = false;
    }
    else {
      this.submitAmountReceivedForm = true;
    }
  }
  /*method to check amountToBeReceived formgroup is valid or not*/

  /*method to add amount formgroup to  paybackAmountArr formArray*/
  addPaybackAmount() {
    const control = <FormArray>this.settlePOForm.controls['paybackAmountArr'];
    control.push(this.createAmountFormGroup());
  }
  /*method to add amount formgroup to  paybackAmountArr formArray*/

  /*method to check pay back amount formgroup is valid or not before adding new row*/
  addPayBackAmountRow(formGroup: FormGroup) {
    if (formGroup.valid) {
      this.addPaybackAmount();
      this.submitPaybackAmountForm = false;
    }
    else {
      this.submitPaybackAmountForm = true;
    }
  }
  /*method to check pay back amount formgroup is valid or not*/

  /**
  *method to remove receipt from receipt formArray
  @param index as number  for getting index of receipt
  */
 removeReceipt(index) {
  const swalObj = Common.swalConfirmPopupObj(this.commonLabelObj.labels.deleteAdvanceMsg, true, true);
  swal(swalObj, (isConfirm) => {
    if (isConfirm) {
      const control = <FormArray>this.settlePOForm.controls['receiptsArr'];
      control.removeAt(index);
      this.calculateAndUpdateStatus(true);
    }
  });

}
  /**
  *method to edit receipt
  @param index as number for getting index of receipt
   @param item as number for getting particular formgroup
  */
  editReceipt(item: FormGroup, index) {
    this.editReceiptFlag = true;
    this.receiptIndex = index;
    const filesArr = <FormArray>this.addReceiptForm.get('files');
    filesArr.controls = [];
    item.value.files.forEach((obj) => {
      const filesFormGroup = this.createFileGroup();
      filesArr.push(filesFormGroup);
    });
    this.addReceiptForm.setValue(item.value);
    this.disableButtonFlag = false;
    this.addReceiptModal.show();
  }

  /*method to open receipt modal*/
  openReceiptModal(event) {
    event.target.value = '';
    this.editReceiptFlag = false;
    this.submitReceiptForm = false;
    const filesArr = <FormArray>this.addReceiptForm.get('files');
    filesArr.controls = [];
    this.addReceiptForm.reset();
    this.addReceiptForm.markAsUntouched();
    this.addReceiptForm.updateValueAndValidity();
    this.disableButtonFlag = false;
    this.addReceiptModal.show();
  }
  /*method to open receipt modal*/

  /**
  *method to remove row from amount to be received formArray
  @param index as number for getting index
  */
  removeAmountToBeReceived(index) {
    const control = <FormArray>this.settlePOForm.controls['amountToBeReceivedArr'];
    control.removeAt(index);
  }
  /**
 *method to remove row from pay back amount formArray
 @param index as number for getting index
 */
  removePaybackAmount(index) {
    const control = <FormArray>this.settlePOForm.controls['paybackAmountArr'];
    control.removeAt(index);
  }

  /*method to update amount to be received & payback amount on receipt amount change*/
  updateAmount() {
    const formValue = this.settlePOForm.value;
    if (formValue.settlementAmount && formValue.receiptAmount) {
      const amountToBeReceivedControl = <FormArray>this.settlePOForm.controls['amountToBeReceivedArr'];
      const amountToBeReceivedFormGroup = <FormGroup>amountToBeReceivedControl.controls[0];
      const paybackAmountControl = <FormArray>this.settlePOForm.controls['paybackAmountArr'];
      const paybackAmountFormGroup = <FormGroup>paybackAmountControl.controls[0];
      if (formValue.settlementAmount > formValue.receiptAmount) {
        const amount = parseFloat(formValue.settlementAmount) - parseFloat(formValue.receiptAmount);
        // tslint:disable-next-line:triple-equals
        if (formValue.amountToBeReceivedArr.length == 1) {
          amountToBeReceivedFormGroup.controls['amount'].setValue(amount);
        }
        // tslint:disable-next-line:triple-equals
        if (formValue.paybackAmountArr.length == 1) {
          paybackAmountFormGroup.controls['amount'].setValue(0);
          paybackAmountFormGroup.controls['mode'].setValidators([]);
        }
      }
      else {
        const amount = parseFloat(formValue.receiptAmount) - parseFloat(formValue.settlementAmount);
        // tslint:disable-next-line:triple-equals
        if (formValue.paybackAmountArr.length == 1) {
          paybackAmountFormGroup.controls['amount'].setValue(amount);
        }
        // tslint:disable-next-line:triple-equals
        if (formValue.amountToBeReceivedArr.length == 1) {
          amountToBeReceivedFormGroup.controls['amount'].setValue(0);
          amountToBeReceivedFormGroup.controls['mode'].setValidators([]);
        }
      }
      amountToBeReceivedFormGroup.controls['mode'].updateValueAndValidity();
      paybackAmountFormGroup.controls['mode'].updateValueAndValidity();
    }
  }
  /*method to update amount to be received & payback amount on receipt amount change*/

  /**
  *method to  update sub total of receipt
  @param formGroup as FormGroup object for getting formvalue
  */
  updateSubtotal(formGroup: FormGroup) {
    const formValue = formGroup.value;
    if (formValue.vat > 100) {
      formGroup.controls['vat'].setValue(100);
      formValue.vat = 100;
    }
    if (formValue.vat == '' || isNaN(formValue.vat)) {
      formGroup.controls['vat'].setValue(0);
    }
    if (formValue.amount == '' || isNaN(formValue.amount)) {
      formGroup.controls['amount'].setValue(0);
    }
    const calculatedValue: any = (parseFloat(formValue.amount ? formValue.amount : 0)
      * parseFloat(formValue.vat ? formValue.vat : 0))
      / 100;
    formGroup.controls['subTotal'].setValue(parseFloat(calculatedValue) + parseFloat(formValue.amount));
    if (!isNaN(calculatedValue) && !isNaN(formValue.amount)) {
      formGroup.controls['subTotal'].setValue(parseFloat(calculatedValue) + parseFloat(formValue.amount));
    } else if (!isNaN(formValue.amount)) {
      formGroup.controls['subTotal'].setValue(parseFloat(formValue.amount));
    } else {
      formGroup.controls['subTotal'].setValue(0);
    }

  }
  /*method to create file formgroup*/
  createFileGroup() {
    return this.fb.group({
      id: [''],
      name: [''],
      loader: [false],
      fileUrl: ['']
    });
  }
  checkSettleFileTypes(filetype) {
    const validtype = _.find(SETTLE_FILE_TYPES, { 'type': filetype.toLowerCase() });
    if (validtype) {
      return true;
    } else {
      return false;
    }

  }
  checkFileUploadingStatus() {
    if (this.multipleDocumentUpload.length > 0 && this.disableButtonFlag) {
      let disableButtonFlag = false;
      // tslint:disable-next-line:forin
      for (const documentArr in this.multipleDocumentUpload) {
        if (!this.multipleDocumentUpload[documentArr]) {
          this.disableButtonFlag = true;
          disableButtonFlag = true;
          break;
        }
        if (disableButtonFlag) {
          break;
        }

        if (!disableButtonFlag) {
          this.disableButtonFlag = false;
        }
      }
    }
  }
  /*method to create file formgroup*/

  /**
  *method to  listen file change event
  @param event as object for getting selected files
  */
  fileChangeEvent(event) {
    const filesArray = Object.assign([File], event.target.files);
    event.target.value = '';
    for (let i = 0; i < filesArray.length; i++) {
      if (filesArray[i]) {
        const file: any = filesArray[i];
        const type = Common.getFileType(file);
        // tslint:disable-next-line:triple-equals
        if (this.checkSettleFileTypes(type)) {
          if (file.size < MEDIA_SIZES.BYTES_10MB) {
            const formData = Common.setFormData(file);
            const filesArr = <FormArray>this.addReceiptForm.get('files');
            const formGroup = this.createFileGroup();
            formGroup.controls['loader'].setValue(true);
            filesArr.push(formGroup);
            if (!this.multipleDocumentUpload[i]) {
              this.multipleDocumentUpload[i] = [];
            }
            if (!this.multipleDocumentUpload[i]) {
              this.multipleDocumentUpload[i] = false;
            }
            this.multipleDocumentUpload[i] = false;
            this.disableButtonFlag = true;
            this._sharedService.uploadFile(formData).subscribe((response: any) => {
              this.multipleDocumentUpload[i] = true;
              formGroup.controls['loader'].setValue(false);
              if (Common.checkStatusCode(response.header.statusCode)) {
                const data = response.payload.result;
                formGroup.patchValue({
                  id: data.id,
                  name: data.name,
                  fileUrl: data.url
                });
              } else {
                if (response.header) {
                  this.toastrService.error(response.header.message);
                } else {
                  this.toastrService.error(this.commonLabelObj.errorMessages.error);
                }
              }
              this.checkFileUploadingStatus();
            },
              error => {
                formGroup.controls['loader'].setValue(false);
                this.toastrService.error(this.commonLabelObj.errorMessages.error);
                this.multipleDocumentUpload[i] = true;
                this.checkFileUploadingStatus();
              }
            );
          }
          else {
            this.toastrService.error(this.commonLabelObj.errorMessages.uploadFileLessThan + ' ' + MEDIA_SIZES.DOCUMENTS_IN_MB);
          }
        }
        else {
          this.toastrService.error(this.commonLabelObj.errorMessages.invalidFileType);
        }
      }
    }
  }

  /**
  *method to  delete file
  @param index as number for getting index of file to be deleted
  */
  deleteFile(index, item) {
    const swalObj = Common.swalConfirmPopupObj(this.commonLabelObj.labels.deleteAdvanceMsg, true, true);
    swal(swalObj, (isConfirm) => {
      if (isConfirm) {
        const filesArr = <FormArray>this.addReceiptForm.get('files');
        filesArr.removeAt(index);
      }
    });
  }


  /*method to submit settlement for approval*/

  /**
  *method to checkt to add/update po settlement
  @param status as number for setting status of settlement(draft,settled)
  */
  submitSettlement(status) {
    this.submmitedFormFlag = true;
    const amountToBeReceivedArr = <FormArray>this.settlePOForm.controls['amountToBeReceivedArr'];
    amountToBeReceivedArr.controls.forEach((c: FormGroup) => {
      // tslint:disable-next-line:triple-equals
      if (c.value.amount != 0) {
        c.controls['mode'].setValidators([CustomValidators.required]);
        c.controls['mode'].updateValueAndValidity();
      } else {
        c.controls['mode'].setValidators(null);
        c.controls['mode'].updateValueAndValidity();
      }
    });


    const paybackAmountArr = <FormArray>this.settlePOForm.controls['paybackAmountArr'];
    paybackAmountArr.controls.forEach((c: FormGroup) => {
      if (c.value.amount != 0) {
        c.controls['mode'].setValidators([CustomValidators.required]);
        c.controls['mode'].updateValueAndValidity();
      } else {
        c.controls['mode'].setValidators(null);
        c.controls['mode'].updateValueAndValidity();
      }
    });
    if (this.settlePOForm.valid) {
      if (status == SETTLEMENT_APPROVAL_CONST.draft) {
        this.isDraftClicked = true;
        this.submitDraftSpinnerFlag = true;
      } else {
        this.isClicked = true;
        this.submitSpinnerFlag = true;
      }
      const formValue = this.settlePOForm.value;
      formValue['projectId'] = this.projectId;
      formValue['currencyId'] = this.defaultCurrency.id;
      formValue['purchaseOrderId'] = this.poData.id;
      const finalSettlementData = ManagePOSettlementData.getWebServiceDetails(formValue, this.advancesList, status);
      if (this.settlementId) {
        this._settlePOService.updatePOSettle(this.settlementId, finalSettlementData).
          subscribe((responseData: any) => {
            this.submitSpinnerFlag = false;
            this.isClicked = false;
            this.isDraftClicked = false;
            this.submitDraftSpinnerFlag = false;
            if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
              this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.settlement, [this.projectId, this.budgetId])]).then(data => {
                this.toastrService.success(responseData.header.message);
              });
            } else {
              if (responseData.header.message) {
                this.toastrService.error(responseData.header.message);
              }

            }
          }, error => {
            this.submitSpinnerFlag = false;
            this.isClicked = false;
            this.isDraftClicked = false;
            this.submitDraftSpinnerFlag = false;

          });
      } else {
        this._settlePOService.postPOSettle(finalSettlementData).
          subscribe((responseData: any) => {
            this.submitSpinnerFlag = false;
            this.isClicked = false;
            this.isDraftClicked = false;
            this.submitDraftSpinnerFlag = false;
            if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
              this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.settlement, [this.projectId, this.budgetId])]).then(data => {
                this.toastrService.success(responseData.header.message);
              });

            } else {
              if (responseData.header.message) {
                this.toastrService.error(responseData.header.message);
              }

            }
          }, error => {
            this.submitSpinnerFlag = false;
            this.isClicked = false;
            this.isDraftClicked = false;
            this.submitDraftSpinnerFlag = false;

          });
      }

    }
  }
  /*method to navigate back to PO listing*/
  navigateTo() {
    this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.settlement, [this.projectId, this.budgetId])]);
  }
  /*method to navigate back to PO listing*/
}
