import { Component, OnInit } from '@angular/core';
import { ROUTER_LINKS_FULL_PATH, defaultDatepickerOptions, LOCAL_STORAGE_CONSTANTS, ADVANCES_FOR_CONST, DEDUCTION_TYPES, SETTLEMENT_STATUS_CONST, MEDIA_SIZES } from '../../../../../../../config';
import { SharedData } from '../../../../../../../shared/shared.data';
import { FormControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Common, CustomValidators, SessionService } from '../../../../../../../common';
import { ManageSettlementData } from './manage-settlement.data.model';
import { ManageSettlementService } from './manage-settlement.service';
import { ToastrService } from 'ngx-toastr';
import { HttpParams } from '@angular/common/http';
import { SharedService } from '../../../../../../../shared/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { SettlementListService } from '../list-settlement/list-settlement.service';
import * as _ from 'lodash';
import { ProjectsData } from '../../../../../projects.data';
declare var $: any;

const swal = require('sweetalert');

@Component({
  selector: 'app-manage-settlement',
  templateUrl: './manage-settlement.component.html',
  styleUrls: ['./manage-settlement.component.scss']
})
export class ManageSettlementComponent implements OnInit {
  ROUTER_LINKS_FULL_PATH = ROUTER_LINKS_FULL_PATH;
  ADVANCES_FOR_CONST = ADVANCES_FOR_CONST;
  SETTLEMENT_STATUS_CONST = SETTLEMENT_STATUS_CONST;
  // DEDUCTION_TYPES = DEDUCTION_TYPES;
  datePickerOptions = JSON.parse(JSON.stringify(defaultDatepickerOptions));
  settleAdvancesForm: FormGroup;
  amountReceivedOrPaid: any = 0;
  value: any;
  isSettled: boolean = false;
  add_input_error: boolean = false;
  isClicked: boolean = false;
  submitReceiptForm: boolean = false;
  submitAmountReceivedForm: boolean = false;
  submitPaybackAmountForm: boolean = false;
  submitSpinnerFlag: boolean = false;
  saveSpinnerFlag: boolean = false;
  projectId: any;
  settlementId: any;
  advancesIdsArr: any = [];
  advancesList: any = [];
  userName = "";
  advancesFor: any;
  currencyCode: any;
  modesOfOperation: any = [];
  budgetLineList: any = [];
  userId: any;
  commonLabels: any;
  settlementDetails: any;
  submmitedFormFlag: boolean = false;
  budgetLineListData: any = [];
  isSubmitClicked: boolean = false;
  disableButtonFlag: boolean = false;
  multipleDocumentUpload = [];
  defaultCurrency: any = {};
  DEDUCTION_TYPES: { id: number; text: string; }[];
  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _sharedService: SharedService,
    private sessionService: SessionService,
    private _manageSettlementService: ManageSettlementService,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private projectsData: ProjectsData,
    private sharedData: SharedData) {
    this.datePickerOptions.disableUntil = { year: Common.getTodayDate().getFullYear(), month: Common.getTodayDate().getMonth() + 1, day: Common.getTodayDate().getDate() - 1 }

  }
  ngOnDestroy() {
    $("#settlement-tab").removeClass("active");
    $("#advances-tab").addClass("active");
    $(".currency-dropdown").show();
    this.sessionService.removeLocalStorageItem(LOCAL_STORAGE_CONSTANTS.selectedAdvances);
  }

  ngOnInit() {
    this.getDropdownValues();
    Common.scrollTOTop();
    $("#settlement-tab").addClass("active");
    $("#advances-tab").removeClass("active");
    $(".currency-dropdown").hide();
    this.projectId = this.projectsData.projectId;
    let projectData: any = this.projectsData.getProjectsData();
    this.defaultCurrency['id'] = projectData.defaultCurrencyId;
    this.defaultCurrency['name'] = projectData.defaultCurrencyCode;
    this.route.params.subscribe(params => {
      this.settlementId = params['id'];
    })
    this.translateService.get('common').subscribe((res: string) => {
      this.commonLabels = res;
    });
    this.createForm();
    let advancesArr: any = this.sessionService.getLocalStorageItem(LOCAL_STORAGE_CONSTANTS.selectedAdvances);
    if (advancesArr) {
      this.advancesIdsArr = JSON.parse(advancesArr);
    }
    this.getPageDetails();
  }
  getDropdownValues() {
    this.DEDUCTION_TYPES = Common.changeDropDownValues(this.translateService, DEDUCTION_TYPES);
  }

  getPageDetails() {
    this.getModesOfOperation();
    this.getAdvanceSettleBudgetLines();
    if (this.settlementId)
      this.getSettlementDetails();
    if (this.advancesIdsArr && this.advancesIdsArr.length > 0)
      this.getAdvancesList();
  }
  getSettlementDetails() {
    this._manageSettlementService.getSettlementDetails(this.settlementId).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload) {
          let settlementDetails = response.payload;
          this.settlementDetails = ManageSettlementData.getFormDetails(settlementDetails);
          this.setFormValues(this.settlementDetails);
          if (this.settlementDetails.advances && this.settlementDetails.advances.length > 0) {
            this.advancesIdsArr = this.settlementDetails.advances;
            this.getAdvancesList();
          }
        }

      }
    },
      error => {
        this.settlementDetails = {}
      });

  }
  setFormValues(settlementDetails) {
    this.settleAdvancesForm.patchValue({
      date: settlementDetails.date
    })
    if (settlementDetails.receiptsArr && settlementDetails.receiptsArr.length > 0) {
      const receiptsArray = <FormArray>this.settleAdvancesForm.get('receiptsArr');
      for (var i = 0; i < settlementDetails.receiptsArr.length; i++) {
        this.addReceipt();
        if (!this.multipleDocumentUpload[i]) {
          this.multipleDocumentUpload[i] = [];
        }
        const filesArray = <FormArray>receiptsArray.controls[i].get("files");
        let receipt = settlementDetails.receiptsArr[i];
        for (let j = 0; j < receipt.files.length; j++) {
          filesArray.push(this.createFileGroup());
          this.multipleDocumentUpload[i][j] = true;
        }
        receiptsArray.controls[i].patchValue({
          "budgetLine": receipt.budgetLine,
          "amount": receipt.amount,
          "vat": receipt.vat,
          "receiptType": receipt.receiptType,
          "files": receipt.files,
          "description": receipt.description,
          "budgetLineName": receipt.budgetLineName,
          "isAttachedImg": receipt.isAttachedImg
        });
      }
    }
    else {
      this.addReceipt();
    }
    if (settlementDetails.amountToBeReceivedArr && settlementDetails.amountToBeReceivedArr.length > 0) {
      const amountToBeReceivedArr = <FormArray>this.settleAdvancesForm.get('amountToBeReceivedArr');
      for (var i = 0; i < settlementDetails.amountToBeReceivedArr.length; i++) {
        this.addAmountToBeReceived();
        let receipt = settlementDetails.amountToBeReceivedArr[i];
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
      const paybackAmountArr = <FormArray>this.settleAdvancesForm.get('paybackAmountArr');
      for (var i = 0; i < settlementDetails.paybackAmountArr.length; i++) {
        this.addPaybackAmount();
        let receipt = settlementDetails.paybackAmountArr[i];
        paybackAmountArr.controls[i].patchValue({
          amount: receipt.amount,
          mode: receipt.mode
        });
      }
    }
    else {
      this.addPaybackAmount();
    }
  }
  getAdvancesList() {
    let params: HttpParams = new HttpParams();
    params = params.append('advanceIds', this.advancesIdsArr);
    this._manageSettlementService.getAdvanceSettlementList(params).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.results) {
          this.advancesList = response.payload.results;
          if (this.advancesList.length > 0) {
            this.userName = this.advancesList[0].i18n.name;
            this.advancesFor = this.advancesList[0].advancesFor;
            this.currencyCode = this.advancesList[0].currency.code;
            this.userId = this.advancesList[0].freelancerId;
            if (this.advancesFor == ADVANCES_FOR_CONST.freelancer) {
              this.userId = this.advancesList[0].freelancerId ? this.advancesList[0].freelancerId : "";
            }
            if (this.advancesFor == ADVANCES_FOR_CONST.vendor) {
              this.userId = this.advancesList[0].vendorId ? this.advancesList[0].vendorId : "";
            }
          }
        } else {
          this.advancesList = [];
        }

      } else {
        this.toastrService.error(response.header.message);
        this.advancesList = [];
      }
    },
      error => {
        this.advancesList = [];
      });
  }
  getTotalAmount(list) {
    let sum: any = 0;
    list.forEach((obj) => {
      if (obj.amount) {
        sum = parseFloat(sum) + parseFloat(obj.amount);
      }
    });
    return sum;
  }
  getAdvanceSettleBudgetLines() {
    this._sharedService.getAdvanceSettleBudgetLines(this.projectId).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.results) {
          this.budgetLineListData = response.payload.results;
          this.budgetLineList = Common.getMultipleSelectArr(this.budgetLineListData, ["id"], ["budgetLine"]);
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

  getModesOfOperation() {
    this._sharedService.getModesOfOperation().subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.results) {
          let modesOfOperation = response.payload.results;
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
  createForm() {
    this.settleAdvancesForm = this.fb.group({
      date: [Common.getTodayDateObj(), [CustomValidators.required]],
      totalAmtToSettle: [''],
      status: [''],
      settlementAmount: [''],
      payBackAmount: [''],
      receiptAmount: [''],
      amountToBeReceived: [''],
      receiptsArr: this.fb.array([]),
      amountToBeReceivedArr: this.fb.array([]),
      paybackAmountArr: this.fb.array([]),
    })
    if (!this.settlementId) {
      this.addReceipt();
      this.addAmountToBeReceived();
      this.addPaybackAmount();
    }
  }
  checkField(receipt: FormGroup) {
    if (!receipt.value.vat) {
      receipt.controls['vat'].setValue(0)
    }
  }
  deleteFile(receipt: FormGroup, index) {
    let filesArr = <FormArray>receipt.controls['files'];
    filesArr.removeAt(index);
  }
  createReceiptFormGroup() {
    return this.fb.group({
      budgetLine: ['', [CustomValidators.required]],
      budgetLineName: [''],
      amount: ['', [CustomValidators.required, CustomValidators.checkDecimal]],
      description: ['', [CustomValidators.required]],
      files: this.fb.array([]),
      receiptType: ['', [CustomValidators.required]],
      vat: ['', CustomValidators.checkDecimal],
      isAttachedImg: ['']
    });
  }
  createAmountFormGroup() {
    return this.fb.group({
      amount: ['', [CustomValidators.required, CustomValidators.checkDecimal]],
      mode: ['']
    });
  }

  addReceipt() {
    const control = <FormArray>this.settleAdvancesForm.controls['receiptsArr'];
    control.push(this.createReceiptFormGroup());
  }
  addReceiptRow(formGroup: FormGroup) {
    if (formGroup.valid) {
      this.addReceipt();
      this.submitReceiptForm = false;
    }
    else {
      this.submitReceiptForm = true;
    }
  }
  addAmountToBeReceived() {
    const control = <FormArray>this.settleAdvancesForm.controls['amountToBeReceivedArr'];
    control.push(this.createAmountFormGroup());
  }
  addAmountToBeReceivedRow(formGroup: FormGroup) {
    if (formGroup.valid) {
      this.addAmountToBeReceived();
      this.submitAmountReceivedForm = false;
    }
    else {
      this.submitAmountReceivedForm = true;
    }
  }
  addPaybackAmount() {
    const control = <FormArray>this.settleAdvancesForm.controls['paybackAmountArr'];
    control.push(this.createAmountFormGroup());
  }
  addPayBackAmountRow(formGroup: FormGroup) {
    if (formGroup.valid) {
      this.addPaybackAmount();
      this.submitPaybackAmountForm = false;
    }
    else {
      this.submitPaybackAmountForm = true;
    }
  }

  removeReceipt(index) {
    const control = <FormArray>this.settleAdvancesForm.controls['receiptsArr'];
    control.removeAt(index);
  }
  removeAmountToBeReceived(index) {
    const control = <FormArray>this.settleAdvancesForm.controls['amountToBeReceivedArr'];
    control.removeAt(index);
  }
  removePaybackAmount(index) {
    const control = <FormArray>this.settleAdvancesForm.controls['paybackAmountArr'];
    control.removeAt(index);
  }
  budgetLineSelected(id, receipt: FormGroup) {
    let dataObj = _.find(this.budgetLineListData, { 'id': id });
    if (dataObj) {
      receipt.controls["budgetLineName"].setValue(dataObj.budgetLine)
    }
  }
  amountChanged(frmGrp: FormGroup) {
    if (frmGrp.value.amount == 0) {
      frmGrp.controls['mode'].setValidators([]);
    }
    else {
      frmGrp.controls['mode'].setValidators([CustomValidators.required]);
    }
    frmGrp.controls['mode'].updateValueAndValidity();
  }

  fileChangeListener(event, receipt: FormGroup, index) {
    let imagesCounter = 0;
    let imagesReceived = event.target.files.length;
    for (let i = 0; i < event.target.files.length; i++) {
      if (event.target.files[i]) {
        let file: any = event.target.files[i];
        let type = Common.getFileType(file);
        if (Common.checkFileType(type)) {
          if (file.size < MEDIA_SIZES.BYTES_10MB) {
            let formData = Common.setFormData(file);
            let filesArr = <FormArray>receipt.controls['files'];
            let formGroup = this.createFileGroup();
            formGroup.controls['loader'].setValue(true);
            filesArr.push(formGroup);
            if (!this.multipleDocumentUpload[index]) {
              this.multipleDocumentUpload[index] = [];
            }
            if (!this.multipleDocumentUpload[index][i]) {
              this.multipleDocumentUpload[index][i] = false;
            }
            this.multipleDocumentUpload[index][i] = false;
            this.disableButtonFlag = true;
            this._sharedService.uploadFile(formData).subscribe((response: any) => {
              this.multipleDocumentUpload[index][i] = true;
              formGroup.controls['loader'].setValue(false);
              if (Common.checkStatusCode(response.header.statusCode)) {
                let data = response.payload.result;
                formGroup.patchValue({
                  id: data.id,
                  name: data.name,
                  fileUrl: data.url
                });
                receipt.controls['isAttachedImg'].setValue('uploaded');

              } else {
                if (response.header) {
                  this.toastrService.error(response.header.message);
                } else {
                  this.toastrService.error(this.commonLabels.errorMessages.error);
                }
              }
            },
              error => {
                formGroup.controls['loader'].setValue(false);
                this.toastrService.error(this.commonLabels.errorMessages.error);
                this.multipleDocumentUpload[index][i] = true;
              }
            );
          }
          else {
            this.toastrService.error(this.commonLabels.errorMessages.uploadFileLessThan + ' ' + MEDIA_SIZES.DOCUMENTS_IN_MB);
          }
        }
        else {
          this.toastrService.error(this.commonLabels.errorMessages.invalidFileType);
        }
      }
    }
  }
  createFileGroup() {
    return this.fb.group({
      id: [''],
      name: [''],
      loader: [false],
      fileUrl: ['']
    });
  }
  deleteAdvance(index) {
    if (this.advancesList.length > 1) {
      var swalObj = Common.swalConfirmPopupObj(this.commonLabels.labels.deleteAdvanceMsg, true, true, this.commonLabels.labels.delete, this.commonLabels.labels.cancelDelete);
      swal(swalObj, (isConfirm) => {
        if (isConfirm) {
          this.advancesList.splice(index, 1)
        } else {
        }
      });
    }

  }
  submitSettlement() {
    let amountToBeReceivedArr = <FormArray>this.settleAdvancesForm.controls['amountToBeReceivedArr'];
    amountToBeReceivedArr.controls.forEach((c: FormGroup) => {
      if (c.value.amount != 0) {
        c.controls['mode'].setValidators([CustomValidators.required]);
        c.controls['mode'].updateValueAndValidity();
      }
    });
    let paybackAmountArr = <FormArray>this.settleAdvancesForm.controls['paybackAmountArr'];
    paybackAmountArr.controls.forEach((c: FormGroup) => {
      if (c.value.amount != 0) {
        c.controls['mode'].setValidators([CustomValidators.required]);
        c.controls['mode'].updateValueAndValidity();
      }
    });
    this.submmitedFormFlag = true;
    this.submitPaybackAmountForm = true;
    this.submitReceiptForm = true;
    this.submitAmountReceivedForm = true;
    this.isSubmitClicked = true;
    let receiptData = this.settleAdvancesForm.value.receiptsArr;
    let filteredData = _.find(receiptData, { 'isAttachedImg': '' });
    if (this.settleAdvancesForm.valid && !filteredData) {
      this.submitSpinnerFlag = true;
      this.isSubmitClicked = false;
      this.submmitedFormFlag = false;
      this.submitPaybackAmountForm = false;
      this.submitReceiptForm = false;
      this.submitAmountReceivedForm = false;
      this.saveSettlement(SETTLEMENT_STATUS_CONST.settled);
    }
  }
  saveAsDraftSettlement() {
    {
      this.submmitedFormFlag = true;
      this.submitReceiptForm = true;
      this.isSubmitClicked = false;
      this.submitPaybackAmountForm = false;
      this.submitAmountReceivedForm = false;
      let receiptsArr = <FormArray>this.settleAdvancesForm.controls['receiptsArr'];;
      if (this.settleAdvancesForm.value.date && receiptsArr.valid) {
        this.saveSpinnerFlag = true;
        this.submmitedFormFlag = false;
        this.submitReceiptForm = false;
        this.saveSettlement(SETTLEMENT_STATUS_CONST.draft);
      }
    }
  }
  saveSettlement(status) {
    this.isClicked = true;
    let formValue = this.settleAdvancesForm.value;
    formValue["projectId"] = this.projectId;
    formValue["currencyId"] = this.defaultCurrency.id;
    formValue["advancesFor"] = this.advancesFor;
    formValue["userId"] = this.userId;
    formValue["status"] = status;
    let finalSettlementData = ManageSettlementData.getWebServiceDetails(formValue, this.advancesList);
    if (this.settlementId) {
      this.updateSettlement(finalSettlementData);
    }
    else {
      this.createSettlement(finalSettlementData);
    }
  }
  /*method to scroll to invalid form control if validation fails*/
  scrollToInvalidControl() {
    let target;
    for (var i in this.settleAdvancesForm.controls) {
      if (!this.settleAdvancesForm.controls[i].valid) {
        target = this.settleAdvancesForm.controls[i];
        break;
      }
    }
    if (target) {
      this.saveSpinnerFlag = false;
      this.submitSpinnerFlag = false;
      let el = $('.ng-invalid:not(form):first');
      $('html,body').animate({ scrollTop: (el.offset().top - 100) }, 'slow', () => {
        el.focus();
      });
    }
  }
  /*method to scroll to invalid form control if validation fails*/

  /*method to create new freelancer advance */
  createSettlement(advanceFormData) {
    this._manageSettlementService.postAdvanceSettle(advanceFormData).
      subscribe((responseData: any) => {
        this.submitSpinnerFlag = false;
        this.saveSpinnerFlag = false;
        this.isClicked = false;
        if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
          this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.settlementList, [this.projectId])]).then(data => {
            this.toastrService.success(responseData.header.message);
          })

        } else {
          if (responseData.header.message) {
            this.toastrService.error(responseData.header.message);
          }

        }
      }, error => {
        this.submitSpinnerFlag = false;
        this.saveSpinnerFlag = false;
        this.isClicked = false;
        this.toastrService.error(this.commonLabels.errorMessages.responseError);

      });
  }
  /*method to create new freelancer advance */


  /*method to update existing freelancer advance */
  updateSettlement(advanceFormData) {
    advanceFormData['id'] = this.settlementId;
    this._manageSettlementService.putAdvanceSettle(this.settlementId, advanceFormData).
      subscribe((responseData: any) => {
        this.submitSpinnerFlag = false;
        this.saveSpinnerFlag = false;
        this.isClicked = false;
        if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
          this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.settlementList, [this.projectId])]).then(data => {
            this.toastrService.success(responseData.header.message);
          })

        } else {
          if (responseData.header.message) {
            this.toastrService.error(responseData.header.message);
          }

        }
      }, error => {
        this.submitSpinnerFlag = false;
        this.saveSpinnerFlag = false;
        this.isClicked = false;
        this.toastrService.error(this.commonLabels.errorMessages.responseError);

      });
  }
  /*method to update existing freelancer advance */
  ngDoCheck() {
    let formValue = this.settleAdvancesForm.value;
    if (this.advancesList && this.advancesList.length > 0) {

      let settlementAmount = this.getTotalAmount(this.advancesList);
      let receiptAmount = this.getTotalAmount(formValue.receiptsArr);
      let amountToBeReceived = this.getTotalAmount(formValue.amountToBeReceivedArr);
      let payBackAmount = this.getTotalAmount(formValue.paybackAmountArr);
      this.settleAdvancesForm.controls['amountToBeReceived'].setValue(amountToBeReceived);
      this.settleAdvancesForm.controls['payBackAmount'].setValue(payBackAmount);
      this.settleAdvancesForm.controls['receiptAmount'].setValue(receiptAmount);
      this.settleAdvancesForm.controls['settlementAmount'].setValue(settlementAmount);
      if (((parseFloat(settlementAmount) + parseFloat(payBackAmount)) - (parseFloat(receiptAmount) + parseFloat((amountToBeReceived)))) == 0) {
        this.settleAdvancesForm.controls['status'].setValue(SETTLEMENT_STATUS_CONST.settled);
      }
      else {
        this.settleAdvancesForm.controls['status'].setValue(SETTLEMENT_STATUS_CONST.draft);
      }
    }
    else {
      this.settleAdvancesForm.controls['settlementAmount'].setValue(0);
      this.settleAdvancesForm.controls['status'].setValue('');
    }

    this.checkFileUploadingStatus();
  }
  checkFileUploadingStatus() {
    if (this.multipleDocumentUpload.length > 0 && this.disableButtonFlag) {
      let disableButtonFlag = false;
      for (var documentArr in this.multipleDocumentUpload) {
        for (var index = 0; index < this.multipleDocumentUpload[documentArr].length; index++) {
          if (!this.multipleDocumentUpload[documentArr][index]) {
            this.disableButtonFlag = true;
            disableButtonFlag = true;
            break;
          }
        }
        if (disableButtonFlag) {
          break;
        }
      }
      if (!disableButtonFlag) {
        this.disableButtonFlag = false;
      }
    }
  }
  updateAmount() {
    let formValue = this.settleAdvancesForm.value;
    if (formValue.settlementAmount && formValue.receiptAmount) {
      const amountToBeReceivedControl = <FormArray>this.settleAdvancesForm.controls['amountToBeReceivedArr'];
      let amountToBeReceivedFormGroup = <FormGroup>amountToBeReceivedControl.controls[0];
      const paybackAmountControl = <FormArray>this.settleAdvancesForm.controls['paybackAmountArr'];
      let paybackAmountFormGroup = <FormGroup>paybackAmountControl.controls[0];
      if (formValue.settlementAmount > formValue.receiptAmount) {
        let amount = parseFloat(formValue.settlementAmount) - parseFloat(formValue.receiptAmount);
        if (formValue.amountToBeReceivedArr.length == 1) {
          amountToBeReceivedFormGroup.controls['amount'].setValue(amount);
        }
        if (formValue.paybackAmountArr.length == 1) {
          paybackAmountFormGroup.controls['amount'].setValue(0);
          paybackAmountFormGroup.controls['mode'].setValidators([]);
        }
      }
      else {
        let amount = parseFloat(formValue.receiptAmount) - parseFloat(formValue.settlementAmount);
        if (formValue.paybackAmountArr.length == 1) {
          paybackAmountFormGroup.controls['amount'].setValue(amount);
        }
        if (formValue.amountToBeReceivedArr.length == 1) {
          amountToBeReceivedFormGroup.controls['amount'].setValue(0);
          amountToBeReceivedFormGroup.controls['mode'].setValidators([]);
        }
      }
      amountToBeReceivedFormGroup.controls['mode'].updateValueAndValidity();
      paybackAmountFormGroup.controls['mode'].updateValueAndValidity();
    }
  }
  selectAllRows(e, amount1, amount2) {
    let sum = 0;
    this.settleAdvancesForm.controls['totalAmtToSettle'].setValue(0);
    if (e.target.checked) {
      sum = parseFloat(this.settleAdvancesForm.value.totalAmtToSettle) + parseFloat(amount1) + parseFloat(amount2);
      $("#defaultCheck1").prop('checked', true);
      $("#defaultCheck2").prop('checked', true);
    }
    else {
      // sum = parseFloat(this.settleAdvancesForm.value.totalAmtToSettle) - parseFloat(amount1) - parseFloat(amount2);
      $("#defaultCheck1").prop('checked', false);
      $("#defaultCheck2").prop('checked', false);
    }
    this.settleAdvancesForm.controls['totalAmtToSettle'].setValue(sum);

  }
  setTotal(e, amount) {
    let sum = 0;
    if (!this.settleAdvancesForm.value.totalAmtToSettle)
      this.settleAdvancesForm.controls['totalAmtToSettle'].setValue(0);
    if (e.target.checked) {
      sum = parseFloat(this.settleAdvancesForm.value.totalAmtToSettle) + parseFloat(amount);
    }
    else {
      $("#defaultCheckAll").prop('checked', false);
      sum = parseFloat(this.settleAdvancesForm.value.totalAmtToSettle) - parseFloat(amount);
    }
    this.settleAdvancesForm.controls['totalAmtToSettle'].setValue(sum);
  }
  calculateTotal() {
    const amountArr = <FormArray>this.settleAdvancesForm.controls['amountArr'];
    let sum = 0;
    for (let i = 0; i < amountArr.length; i++) {
      const amountArrFormGrp = amountArr.controls[i];
      sum = sum + parseFloat(amountArrFormGrp.value.amount);
    }
    this.amountReceivedOrPaid = sum;
  }
  navigateTo() {
    this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.settlementList, [this.projectId])])
  }
}
