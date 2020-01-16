import { Component, OnInit, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
import {
  ROUTER_LINKS_FULL_PATH, defaultDatepickerOptions,
  CONTRACT_STATUS_CONST, CFDI_CONST, COOKIES_CONSTANTS, OPERATION_TYPES_ARR
} from '@app/config';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedData } from '@app/shared/shared.data';
import { FormControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators, SessionService, Common } from '@app/common';
import { OPERATION_MODES, TAG_NAME_TEXTAREA } from '@app/config';
import { IMyDrpOptions } from 'mydaterangepicker';
import { ModalDirective } from 'ngx-bootstrap';
import { ProjectsData } from '../../../../projects.data';
import { AddPOService } from './add-po-vendor.service';
import { SharedService } from '@app/shared/shared.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { HttpParams } from '@angular/common/http';
import { ManageVendorPOData } from './add-po-vendor.data.model';
import { HostListener } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
declare var $: any;
const swal = require('sweetalert');

@Component({
  selector: 'app-add-po-vendor',
  templateUrl: './add-po-vendor.component.html',
  styleUrls: ['./add-po-vendor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddPoVendorComponent implements OnInit, OnDestroy {
  @ViewChild('addServiceModal') public addServiceModal: ModalDirective;
  datePickerOptions = JSON.parse(JSON.stringify(defaultDatepickerOptions));
  vendorService: FormGroup;
  ROUTER_LINKS_FULL_PATH = ROUTER_LINKS_FULL_PATH;
  CFDI_CONST = CFDI_CONST;
  OPERATION_MODES = OPERATION_MODES;
  factura: Boolean = false;
  honorarious: Boolean = false;
  modalOpen: Boolean = false;
  formvalue: any;
  tabledata: any = [];
  showtable: Boolean = false;
  spinnerFlag: Boolean = false;
  incompleteProfileDetailsFlag: boolean = false;
  vatWithholding: any;
  isrWithholding: any;
  vat: any;
  totalAmount: any;
  subTotal: any;
  currency: any;
  renderPage: Boolean = false;
  submitVendorForm: Boolean = false;
  showUpdateButton: Boolean = false;
  buttonDisable: Boolean = false;
  disableAddButton: Boolean = false;
  saveVendorForm: Boolean = false;
  projectId: any;
  currencyDropdown: any;
  defaultCurrency: any = {};
  currencyArr: any[];
  updateIndex: any;
  poVendors: any;
  poVendorDropdown: any[];
  budgetlineDropdown: any;
  budgetLineList: any[];
  budgetLineName: any[];
  vendorPOId: any;
  defaultValues: any;
  vendorSubmitForm: FormGroup;
  editPOData: any;
  vendorPOFormDetails: any;
  operation: any;
  mode: any;
  commonLabelObj: any;
  isrWitholdingAmt = 0;
  vatWitholdingAmt = 0;
  error: any;
  currencyKeyValueArr: any;
  selectedCurrency: any;
  budgetId: String = '';
  payableAmount: Number = 0;

  constructor(
    private router: Router,
    private sharedData: SharedData,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private fb: FormBuilder,
    private _addPOService: AddPOService,
    private sessionlocalstorage: SessionService,
    private projectsData: ProjectsData,
    private _sharedService: SharedService,
    private sessionService: SessionService,
    private toastrService: ToastrService, private translate: TranslateService
  ) {
    this.datePickerOptions.disableUntil = {
      year: Common.getTodayDate().getFullYear(),
      month: Common.getTodayDate().getMonth() + 1,
      day: Common.getTodayDate().getDate() - 1
    };
  }
  ngOnInit() {
    this.projectId = this.projectsData.projectId;
    this.budgetId = this.projectsData.budgetId;
    this.setModeOfOperation();
    this.setCurrency();
    this.route.params.subscribe(params => {
      this.vendorPOId = params['id'];
    });
    if (!this.vendorPOId) {
      this.renderPage = true;
    }
    this.createAddForm();
    const projectData: any = this.projectsData.getProjectsData();
    this.defaultCurrency['id'] = projectData.defaultCurrencyId;
    this.defaultCurrency['name'] = projectData.defaultCurrencyCode;
    // this.selectedCurrency = this.defaultCurrency['name'];
    this.setVendordetails(false, true);
    this.setPODefaultValues();
    this.translate.get('common').subscribe(res => {
      this.error = res;
    });
    $('.currency-dropdown').hide();
    this.translateService.get('common').subscribe((res: string) => {
      this.commonLabelObj = res;
    });
  }
  ngOnDestroy() {
    $('.currency-dropdown').show();
  }
  /**
   * Creates FormGroups for Modal pop up and PO form
   */
  createAddForm() {
    this.vendorService = this.addManageVendorFormGroup();
    this.vendorSubmitForm = this.addVendorFormGroup();
  }
  /**
    * PO Service FormGroup
    */
  addManageVendorFormGroup(): FormGroup {
    return this.fb.group({
      budgetline: ['', [CustomValidators.required]],
      description: ['', [CustomValidators.required]],
      quantity: ['', [CustomValidators.requiredNumber, CustomValidators.checkDecimal, CustomValidators.requiredWithout0]],
      amount: ['', [CustomValidators.requiredNumber, CustomValidators.checkDecimal, CustomValidators.requiredWithout0]]
    });
  }
  /**
  * Vendor PO FormGroup
  */
  addVendorFormGroup(): FormGroup {
    return this.fb.group({
      vendorName: ['', [CustomValidators.required]],
      typeSelection: [0],
      currencyId: ['', [CustomValidators.required]],
      vat: ['', [CustomValidators.checkUptoFourDecimal]],
      totalAmount: [''],
      vatWithholding: ['', [CustomValidators.checkUptoFourDecimal]],
      isrWithholding: ['', [CustomValidators.checkUptoFourDecimal]],
      mode: ['', [CustomValidators.required]],
      notes: [''],
      paymentDate: ['', [CustomValidators.required]]
    });
  }
  /*
     checking is NAN condtion for amount rate
   */
  checkAmount() {
    if (isNaN(this.vendorService.value.amount)) {
      this.vendorService.controls['amount'].setValue(0);
    }
  }
  /**
 * Opens Modal popup
 */
  addService() {
    this.submitVendorForm = false;
    this.disableAddButton = false;
    this.showUpdateButton = false;
    this.updateIndex = null;
    this.vendorService.patchValue({
      budgetline: '',
      description: '',
      quantity: '',
      amount: ''
    });
    this.vendorService.markAsUntouched();
    this.vendorService.updateValueAndValidity();
    this.addServiceModal.show();
  }
  /**
 * Sets project currency
 */
  setCurrency() {
    this._sharedService.getProjectCurrencies(this.budgetId).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.result) {
          this.currencyDropdown = response.payload.result;
          this.currencyArr = Common.getMultipleSelectArr(this.currencyDropdown, ['id'], ['code']);
          this.currencyKeyValueArr = Common.keyValueDropdownArr(this.currencyDropdown, 'id', 'code');
          if (this.vendorPOId) {
            this.editPODetails();
          }
        } else {
          this.currencyArr = [];
        }
      } else {
        this.currencyArr = [];
      }
    },
      error => {
        this.currencyArr = [];
      });
  }
  /**
   * Auto selects based on vendor Id selected
   * @param vendorId as Sring to fetch operantion details
   */
  setMode(vendorId) {
    const selectedVendor = _.find(this.poVendors, { 'id': vendorId });
    if (selectedVendor) {
      // this.incompleteProfileDetailsFlag = (selectedVendor.incompleteProfile) ? true : false;
    }
    this.vendorSubmitForm.controls['mode'].setValue(selectedVendor.operationId);
  }
  /**
 * Sets Mode of operation
 */
  setModeOfOperation() {
    this.mode = Common.changeDropDownValues(this.translateService, OPERATION_TYPES_ARR);
  }
  /**
 * Sets Budgetlines
 */
  setBudgetLines(response) {
    if (Common.checkStatusCodeInRange(response.header.statusCode)) {
      this.budgetlineDropdown = response.payload.results;
      this.budgetlineDropdown.forEach(obj => {
        obj['name'] = obj['budgetLine'];
      });
      this.budgetLineList = Common.getMultipleSelectArr(this.budgetlineDropdown, ['id'], ['name']);
      this.budgetLineName = Common.keyValueDropdownArr(this.budgetLineList, 'id', 'text');
    }
    else {
      this.budgetLineList = [];
      this.toastrService.error(response.header.message);
    }
    // },
    // error => {
    //   this.budgetLineList = [];
    // });
  }
  /**
* Patches Vendor PO form
*/
  editPODetails() {
    this._addPOService.getVendorPObyID(this.vendorPOId).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        this.editPOData = response.payload.result;
        this.vendorPOFormDetails = ManageVendorPOData.getFormData(this.editPOData);
        this.tabledata = this.vendorPOFormDetails.tabledata;
        this.showtable = true;
        this.setVendorPOFormValues(this.vendorPOFormDetails);
      }
    });
  }
  updateCurrencyFormConrol(vendorPOFormDetails) {
    const currencyobj = _.find(this.currencyArr, { 'id': vendorPOFormDetails.currencyId });
    if (currencyobj) {
      this.vendorSubmitForm.patchValue({
        currencyId: vendorPOFormDetails.currencyId
      });
      this.selectedCurrency = currencyobj.text;
    } else {
      this.vendorSubmitForm.patchValue({
        currencyId: ''
      });
      this.selectedCurrency = '';
    }
  }
  /**
   * Patches Edit vendor PO form
   * @param vendorPOFormDetails as Object as to patch the form values
   */
  setVendorPOFormValues(vendorPOFormDetails) {
    this.totalBudgetlieAmount();
    this.setVendordetails(false, false);
    this.updateCurrencyFormConrol(vendorPOFormDetails);
    this.vendorSubmitForm.patchValue({
      vendorName: vendorPOFormDetails.vendorName,
      vat: vendorPOFormDetails.vat,
      vatWithholding: vendorPOFormDetails.vatWithHolding,
      isrWithholding: vendorPOFormDetails.isrWithHolding,
      mode: vendorPOFormDetails.mode,
      notes: vendorPOFormDetails.i18n.notes,
      paymentDate: vendorPOFormDetails.paymentDate,
      typeSelection: vendorPOFormDetails.typeSelection
    });
    this.updateSubtotal();
    if (vendorPOFormDetails.typeSelection) {
      this.updateISRWitholding();
      this.updateVatWitholding();
      this.updatePayableAmount();
    }
    this.setVendordetails(true, false);
  }
  /**
   * Sets and binds VAT,ISR,Vatwitholdng default values
   */
  setPODefaultValues() {
    this._addPOService.getPODefaultDetails().subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.result) {
          this.defaultValues = response.payload.result;
          if (!this.vendorPOId) {
            // tslint:disable-next-line:triple-equals
            if (this.vendorSubmitForm.controls['typeSelection'].value == CFDI_CONST.honorarious) {
              this.vendorSubmitForm.patchValue({
                vat: this.defaultValues.vat,
                vatWithholding: this.defaultValues.vatWithHolding,
                isrWithholding: this.defaultValues.isrWithHolding,
              });
            } else {
              this.vendorSubmitForm.patchValue({
                vat: this.defaultValues.vat,
                vatWithholding: '',
                isrWithholding: '',
              });
            }
          }
        } else {
          this.defaultValues = [];
        }
      }
      else {
        this.defaultValues = [];
      }
    },
      error => {
        this.defaultValues = [];
      });

  }
  /**
 * Adds vendor po service
 */
  vendorPOAdd() {
    this.submitVendorForm = true;
    this.disableAddButton = false;
    if (this.vendorService.valid) {
      this.disableAddButton = true;
      this.showtable = true;
      // tslint:disable-next-line:triple-equals
      if (this.updateIndex || this.updateIndex == 0) {
        this.formvalue = this.vendorService.value;
        const details = this.formvalue;
        this.tabledata[this.updateIndex] = Object.assign({}, details);
        this.updateIndex = null;
        this.setVendordetails(false, false);
        this.totalBudgetlieAmount();
      }
      else {
        this.formvalue = this.vendorService.value;
        const details = this.formvalue;
        this.tabledata.push(details);
        this.setVendordetails(false, false);
        this.totalBudgetlieAmount();
      }
      this.submitVendorForm = false;
      this.clearVendorService();
      this.vendorSubmitForm.patchValue({
        vendorName: '',
        mode: ''
      });
    }
    this.updateSubtotal();
    this.updateISRWitholding();
    this.updateVatWitholding();
    this.updatePayableAmount();
  }
  /**
   * Clears/Resets modal po service form
   */
  clearVendorService() {
    this.vendorService.reset();
    this.addServiceModal.hide();
    this.vendorService.patchValue({
      budgetline: '',
      description: '',
      quantity: '',
      amount: ''
    });
  }
  /**
   * Edits vendor po service form
   * @param details as Object
   * @param index as Index
   */
  editBudgetLine(details, index) {
    this.disableAddButton = false;
    this.showUpdateButton = true;
    this.updateIndex = index;
    this.vendorService.patchValue({
      budgetline: details.budgetline,
      description: details.description,
      quantity: details.quantity,
      amount: details.amount
    });
    this.addServiceModal.show();
  }
  getSearchQueryParam() {

    let params: HttpParams = new HttpParams();
    for (let i = 0; i < this.tabledata.length; i++) {
      params = params.append('budgetLines', this.tabledata[i]['budgetline']);
    }
    return params;
  }
  /**
   * Sets vendors dropdown according to budgetline selection
   */
  setVendorDropdown(response) {

    if (Common.checkStatusCodeInRange(response.header.statusCode)) {
      if (response.payload && response.payload.results) {

        this.poVendors = response.payload.results;
        this.poVendors.forEach(obj => {
          obj['name'] = obj['i18n']['commercialName'];
        });
        // tslint:disable-next-line:max-line-length
        this.poVendorDropdown = Common.getMultipleSelectArr(this.poVendors, ['id'], ['name'], ['contractStatus'], CONTRACT_STATUS_CONST.activeContracts);

      } else {
        this.poVendors = [];
      }
    } else {
      this.poVendors = [];
      this.toastrService.error(response.header.message);
    }
    //}
    // error => {
    //   this.poVendors = [];
    // });
  }
  /**
   * Adds service to table
   */
  vendorPOSubmit() {
    this.showtable = true;
    this.formvalue = this.vendorService.value;
    const details = this.formvalue;
    this.tabledata.push(details);
    this.totalBudgetlieAmount();
    this.vendorService.reset();
    this.addServiceModal.hide();
  }
  /**
   * Navigates to PO listing on 'Cancel' and 'Back to list' click
   */
  navigateTo() {
    this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.purchaseOrder, [this.projectId, this.budgetId])]);
  }
  /**
    * Changes po type
    */
  changeType(typeValue) {
    // tslint:disable-next-line:triple-equals
    if (typeValue == CFDI_CONST.honorarious) {
      if (!this.vendorPOId) {
        this.vendorSubmitForm.patchValue({
          vat: this.defaultValues.vat,
          vatWithholding: this.defaultValues.vatWithHolding,
          isrWithholding: this.defaultValues.isrWithHolding,
        });
      } else {
        if (this.vendorPOFormDetails.typeSelection === 1) {
          this.vendorSubmitForm.patchValue({
            vat: this.vendorPOFormDetails.vat,
            vatWithholding: this.vendorPOFormDetails.vatWithHolding,
            isrWithholding: this.vendorPOFormDetails.isrWithHolding,
          });
        } else {
          this.vendorSubmitForm.patchValue({
            vat: this.defaultValues.vat,
            vatWithholding: this.defaultValues.vatWithHolding,
            isrWithholding: this.defaultValues.isrWithHolding,
          });
        }
      }
      this.updateVatWitholding();
      this.updateISRWitholding();
      this.updatePayableAmount();
    } else {
      if (!this.vendorPOId) {
        this.vendorSubmitForm.patchValue({
          vat: this.defaultValues.vat,
          vatWithholding: '',
          isrWithholding: '',
        });
      } else {
        if (this.vendorPOFormDetails.typeSelection === 0) {
          this.vendorSubmitForm.patchValue({
            vat: this.vendorPOFormDetails.vat,
            vatWithholding: '',
            isrWithholding: '',
          });
        } else {
          this.vendorSubmitForm.patchValue({
            vat: this.defaultValues.vat,
            vatWithholding: '',
            isrWithholding: '',
          });
        }
      }
      this.vatWitholdingAmt = 0;
      this.isrWitholdingAmt = 0;
    }
    this.updateSubtotal();
    this.updatePayableAmount();
  }
  /**
   * Deletes service records from service table
   */
  deleteRecord(index) {

    const swalObj = Common.swalConfirmPopupObj(this.commonLabelObj.labels.deleteAdvanceMsg, true, true);
    swal(swalObj, (isConfirm) => {
      if (isConfirm) {
        this.tabledata.splice(index, 1);
      }
    });
    if (this.tabledata.length === 0) {
      this.showtable = false;
      //  this.poVendorDropdown = [];
    }
    else {
      this.setVendordetails(false, false);
      this.setModeOfOperation();
    }
    // this.vendorSubmitForm.patchValue({
    //   mode: ''
    // });
    this.totalBudgetlieAmount();
    this.updateVatWitholding();
    this.updateISRWitholding();
    this.updatePayableAmount();
  }
  changeDisplayCurrency(ev) {

    this.selectedCurrency = this.currencyKeyValueArr[ev];
  }
  /**
  * Calculates total budget line amount
  */
  totalBudgetlieAmount() {
    this.totalAmount = 0;
    for (let i = 0; i < this.tabledata.length; i++) {
      this.totalAmount = this.totalAmount + (parseFloat(this.tabledata[i]['amount']) * parseFloat(this.tabledata[i]['quantity']));
    }
    this.updateSubtotal();
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
   * Closes pop up on 'Esc'
   * @param event
   */
  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.addServiceModal.hide();
    }
    if(event && event.target && event.target['tagName'] != TAG_NAME_TEXTAREA) {
      if (event.keyCode === 13) {
        event.preventDefault();
        if (!this.modalOpen) {
          if (!this.spinnerFlag) {
            this.addVendorPO();
          }
        } else {
          this.vendorPOAdd();
        }
      }
    }
  }
  /**
  * Calculates/Updates subtotal
  */
  updateSubtotal() {
    const formvalue = this.vendorSubmitForm.value;
    if (formvalue.vat > 100) {
      this.vendorSubmitForm.patchValue({
        vat: 100
      });
      formvalue.vat = 100;
    }
    const totalAmountFlag = isNaN(this.totalAmount);
    const vatFlag = isNaN(formvalue.vat);
    if (!totalAmountFlag && !vatFlag) {
      // tslint:disable-next-line:max-line-length
      const calculatedValue: any = (parseFloat(this.totalAmount ? this.totalAmount : 0) * parseFloat(formvalue.vat ? formvalue.vat : 0)) / 100;
      this.subTotal = parseFloat(calculatedValue) + parseFloat(this.totalAmount);
    } else {
      this.subTotal = this.totalAmount;
    }
    if (isNaN(formvalue.vat)) {
      this.vendorSubmitForm.patchValue({
        vat: 0
      });
    }
    this.updatePayableAmount();
  }
  /**
   * Calculates/Updates VAT witholding
   */
  updateVatWitholding() {
    this.vatWitholdingAmt = 0;
    const formvalue = this.vendorSubmitForm.value;
    if (isNaN(formvalue.vatWithholding)) {
      this.vendorSubmitForm.patchValue({
        vatWithholding: 0
      });
    }
    if (formvalue.vatWithholding > 100) {
      this.vendorSubmitForm.patchValue({
        vatWithholding: 100
      });
      formvalue.vatWithholding = 100;
    }
    if (formvalue.vatWithholding && this.totalAmount) {
      const totalAmountFlag = isNaN(this.totalAmount);
      const vatWithholdingFlag = isNaN(formvalue.vatWithholding);
      if (!totalAmountFlag && !vatWithholdingFlag) {
        this.vatWitholdingAmt = (parseFloat(this.totalAmount) * parseFloat(formvalue.vatWithholding)) / 100;

      } else {
        this.vatWitholdingAmt = 0;
      }
    }
  }
  /**
   * Calculates/Updates ISR witholding
   */
  updateISRWitholding() {
    this.isrWitholdingAmt = 0;
    const formvalue = this.vendorSubmitForm.value;
    if (isNaN(formvalue.isrWithholding)) {
      this.vendorSubmitForm.patchValue({
        isrWithholding: 0
      });
    }
    if (formvalue.isrWithholding > 100) {
      this.vendorSubmitForm.patchValue({
        isrWithholding: 100
      });
      formvalue.isrWithholding = 100;
    }
    if (formvalue.isrWithholding && this.totalAmount) {
      const totalAmountFlag = isNaN(this.totalAmount);
      const isrWithholdingFlag = isNaN(formvalue.isrWithholding);
      if (!totalAmountFlag && !isrWithholdingFlag) {
        this.isrWitholdingAmt = (parseFloat(this.totalAmount) * parseFloat(formvalue.isrWithholding)) / 100;

      } else {
        this.isrWitholdingAmt = 0;
      }
    }
  }
  /**
   * this method is used to call Budgetline and vendor service together
   * @param flag is used to call Budgetline and vendor service together when the record id edited
   * @param loadonlybudgetline is used to call only budget line service when new vendor po is being added
   */
  setVendordetails(flag, loadonlybudgetline) {
    if (loadonlybudgetline) {
      this._addPOService.getBudgetLine(this.budgetId).subscribe((response: any) => {
        this.setBudgetLines(response);
      }, error => {
        this.poVendors = [];
      });
    }
    if (flag) {
      const combined = Observable.forkJoin(
        this._addPOService.getPOVendor(this.getSearchQueryParam()),
        this._addPOService.getBudgetLine(this.budgetId)
      );
      combined.subscribe((response: any) => {
        const vendors: any = response[0];
        const budgetlines: any = response[1];
        this.setVendorDropdown(vendors);
        this.setBudgetLines(budgetlines);
        this.renderPage = true;
      });
    } else if (!loadonlybudgetline) {
      this._addPOService.getPOVendor(this.getSearchQueryParam()).subscribe((response: any) => {
        this.setVendorDropdown(response);
      }, error => {
        this.poVendors = [];
        this.budgetLineList = [];
        this.toastrService.error(this.error.errorMessages.responseError);
      });
    }
  }

  setValueZero(field) {
    const formvalue = this.vendorSubmitForm.value;
    if (!formvalue[field]) {
      this.vendorSubmitForm.controls[field].setValue(0);
    }
  }

  /**
     * Saves/Adds Vendor PO
     */
  addVendorPO() {
    this.spinnerFlag = true;
    this.saveVendorForm = true;
    if (this.vendorSubmitForm.valid && this.tabledata.length !== 0) {
      this.buttonDisable = true;
      this.spinnerFlag = true;
      const formvalue = this.vendorSubmitForm.value;
      formvalue['langCode'] = this.sessionService.getCookie(COOKIES_CONSTANTS.langCode);
      const finalUserData = ManageVendorPOData.setFormData(formvalue, this.tabledata);
      finalUserData['projectId'] = this.projectId;
      finalUserData['projectBudgetId'] = this.budgetId;
      finalUserData['totalAmountRequested'] = this.totalAmount;
      if (!this.vendorPOId) {
        this._addPOService.postPOData(finalUserData).subscribe((responseData: any) => {
          this.buttonDisable = false;
          if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
            this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.purchaseOrder, [this.projectId, this.budgetId])]).then(() =>
              this.toastrService.success(responseData.header.message)
            );
          } else {
            this.buttonDisable = false;
            this.spinnerFlag = false;
            this.toastrService.error(responseData.header.message);
          }
        }, error => {
          this.buttonDisable = false;
          this.spinnerFlag = false;
          this.toastrService.error(this.error.errorMessages.responseError);
        });
      } else {
        this._addPOService.putPOData(finalUserData, this.vendorPOId).subscribe((responseData: any) => {
          this.buttonDisable = false;
          this.spinnerFlag = false;
          if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
            this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.purchaseOrder, [this.projectId, this.budgetId])]).then(() =>
              this.toastrService.success(responseData.header.message)
            );
          } else {
            this.buttonDisable = false;
            this.spinnerFlag = false;
            this.toastrService.error(responseData.header.message);
          }
        }, error => {
          this.buttonDisable = false;
          this.spinnerFlag = false;
          this.toastrService.error(this.error.errorMessages.responseError);
        });
      }

    }
    else {
      this.spinnerFlag = false;
      let target;
      for (const i in this.vendorSubmitForm.controls) {
        if (!this.vendorSubmitForm.controls[i].valid) {
          target = this.vendorSubmitForm.controls[i];
          break;
        }
      }
      if (target) {

        const el = $('.ng-invalid:not(form):first');
        $('html,body').animate({ scrollTop: (el.offset().top - 100) }, 'slow', () => {
          el.focus();
        });
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
}
