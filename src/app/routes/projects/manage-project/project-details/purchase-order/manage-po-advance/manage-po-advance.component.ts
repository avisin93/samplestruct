import { Component, OnInit, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IMyDrpOptions } from 'mydaterangepicker';
import { ModalDirective } from 'ngx-bootstrap';
import { ProjectsData } from '../../../../projects.data';
import { Common, CustomValidators, SessionService } from '@app/common';
import { ToastrService } from 'ngx-toastr';
import { AdvancePOService } from './manage-po-advance.service';
import { HttpParams } from '@angular/common/http';
import { SharedService } from '@app/shared/shared.service';
import { ManageAdvancePOData } from './manage-po-advance.data.model';
import * as _ from 'lodash';
import { TAG_NAME_TEXTAREA } from '@app/config';
import {
  defaultDatepickerOptions,
  ROUTER_LINKS_FULL_PATH,
  ADVANCE_PO_FOR,
  CONTRACT_STATUS_CONST,
  COOKIES_CONSTANTS,
  CURRENCY_CHANGE_CONST,
  ADVANCES_FOR_CONST,
  OPERATION_TYPES_ARR
} from '@app/config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { TranslateService } from '@ngx-translate/core';
declare var $: any;
const swal = require('sweetalert');
@Component({
  selector: 'app-manage-po-advance',
  templateUrl: './manage-po-advance.component.html',
  styleUrls: ['./manage-po-advance.component.scss']
})
export class ManagePoAdvanceComponent implements OnInit, OnDestroy {

  @ViewChild('addServiceModal') public addServiceModal: ModalDirective;
  vat: any;
  subTotal: number;
  ROUTER_LINKS_FULL_PATH = ROUTER_LINKS_FULL_PATH;
  datePickerOptions = JSON.parse(JSON.stringify(defaultDatepickerOptions));
  amount: any;
  ADVANCE_PO_FOR = ADVANCE_PO_FOR;
  spinnerFlag: Boolean = false;
  supplierType: any = 0;
  poAdvanceForm: FormGroup;
  productionCoordinatorForm: FormGroup;
  tabledata: any = [];
  showtable = false;
  budgetlineDropdown: any;
  budgetLineList: any[];
  budgetLineName: any[];
  projectId: any;
  poVendors: any;
  poVendorDropdown: any[];
  freelancers: any;
  commonLabelObj: any;
  freelancersList: any[];
  renderPage: Boolean = false;
  submitVendorForm: Boolean = false;
  submitAdvancePOService: Boolean = false;
  submitAdvancePOForm: Boolean = false;
  showUpdateButton: Boolean = false;
  buttonDisable: Boolean = false;
  incompleteProfileDetailsFlag: boolean = false;
  modalOpen: Boolean = false;
  updateIndex: any;
  disableAddButton: Boolean = false;
  budgetlineUpdated: Boolean = false;
  formvalue: any;
  totalAmount: any = 0;
  advancePOId: any;
  error: any;
  currencyDropdown: any;
  currencyArr: any[];
  defaultCurrency: any = {};
  currency: any;
  operation: any;
  mode: any[];
  editAdvanceData: any;
  advancePOFormDetails: any;
  selectedVendor: any;
  thirdPartyVendorDetails: any;
  budgetId: string = '';
  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private router: Router,
    private _advancePOService: AdvancePOService,
    private toastrService: ToastrService,
    private projectsData: ProjectsData,
    private sessionService: SessionService,
    private _sharedService: SharedService) {
    this.datePickerOptions.disableUntil = {
      year: Common.getTodayDate().getFullYear(),
      month: Common.getTodayDate().getMonth()
        + 1, day: Common.getTodayDate().getDate() - 1
    };
  }

  ngOnInit() {
    this.projectId = this.projectsData.projectId;
    this.budgetId = this.projectsData.budgetId;
    this.route.params.subscribe(params => {
      this.advancePOId = params['id'];
      if (this.advancePOId) {
        this.getPODetails();
      }
    });
    const projectData: any = this.projectsData.getProjectsData();
    this.defaultCurrency['id'] = projectData.defaultCurrencyId;
    this.defaultCurrency['name'] = projectData.defaultCurrencyCode;
    this.createPoAdvanceForm();
    this.createProdCoordinatorForm();
    this.setModeOfOperation();
    if (!this.advancePOId) {
      this.renderPage = true;
      this.setSupplierData(ADVANCES_FOR_CONST.freelancer, false, '', '', true, true);
    }
    $('.currency-dropdown').hide();
    this.translateService.get('common').subscribe((res: string) => {
      this.commonLabelObj = res;
    });
  }
  ngOnDestroy() {
    $('.currency-dropdown').show();
  }
  /**
   * Creates Advance PO creation form
   */
  createPoAdvanceForm() {
    this.poAdvanceForm = this.fb.group({
      currencyId: CURRENCY_CHANGE_CONST.mxn,
      supplierType: [0],
      budgetline: ['', [CustomValidators.required]],
      description: ['', [CustomValidators.required]],
      amount: ['', [CustomValidators.requiredWithout0, CustomValidators.requiredNumber, CustomValidators.checkDecimal]],
      paymentDate: ['', [CustomValidators.required]],
      freelancerId: ['', [CustomValidators.required]],
      vendorId: ['', [CustomValidators.required]],
      modeOfOperation: ['', [CustomValidators.required]]
    });
  }
  /**
   * Creates Production coordinator modal form
   */
  createProdCoordinatorForm() {
    this.productionCoordinatorForm = this.fb.group({
      budgetline: ['', [CustomValidators.required]],
      description: ['', [CustomValidators.required]],
      amount: ['', [CustomValidators.requiredWithout0, CustomValidators.checkDecimal, CustomValidators.requiredNumber]],
    });
  }
  /**
* Patches Advance PO form
*/
  getPODetails() {
    this._advancePOService.getAdvancePObyID(this.advancePOId).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        this.editAdvanceData = response.payload.result;
        this.advancePOFormDetails = ManageAdvancePOData.getFormData(this.editAdvanceData);
        this.tabledata = this.advancePOFormDetails.services;
        this.showtable = true;
        this.setAdvancePOFormValues(this.advancePOFormDetails);
      }
    });
  }
  /**
   * Binds form values while editing the form
   * @param advancePOFormDetails as Object which contains form data which is used to edit and update data;
   */
  setAdvancePOFormValues(advancePOFormDetails) {
    this.changeSupplier(advancePOFormDetails.supplierType, false);
    this.poAdvanceForm.patchValue({
      // tslint:disable-next-line:triple-equals
      supplierType: (advancePOFormDetails || advancePOFormDetails.supplierType == 0) ? advancePOFormDetails.supplierType : '',
      budgetline: advancePOFormDetails.services[0].budgetline ? advancePOFormDetails.services[0].budgetline : '',
      description: advancePOFormDetails.services[0].description ? advancePOFormDetails.services[0].description : '',
      // tslint:disable-next-line:max-line-length
      amount: (advancePOFormDetails || advancePOFormDetails.totalAmountRequested == 0) ? parseFloat(advancePOFormDetails.totalAmountRequested) : '',
      paymentDate: advancePOFormDetails ? advancePOFormDetails.paymentDate : '',
      // tslint:disable-next-line:max-line-length
      freelancerId: (advancePOFormDetails && (advancePOFormDetails.supplierType == ADVANCE_PO_FOR.freelancer || advancePOFormDetails.supplierType == ADVANCE_PO_FOR.productionCoordinator))
        ? advancePOFormDetails.supplierId : '',
      // tslint:disable-next-line:max-line-length
      vendorId: (advancePOFormDetails && advancePOFormDetails.supplierType == ADVANCE_PO_FOR.vendor) ? advancePOFormDetails.supplierId : '',
      modeOfOperation: advancePOFormDetails ? advancePOFormDetails.operationId : '',
    });
    this.setSupplierData(advancePOFormDetails.supplierType, true, advancePOFormDetails.services[0].budgetline, false, false, false);
    // this.setCoordinatorFreelancerDropdown();
    if (ADVANCE_PO_FOR.productionCoordinator) {
      this.totalBudgetlieAmount();
    }

    // console.log(this.poAdvanceForm.value);
  }
  /**
* Opens Modal popup
*/
  addService() {
    this.submitAdvancePOService = false;
    this.disableAddButton = false;
    this.submitVendorForm = false;
    this.showUpdateButton = false;
    this.updateIndex = null;
    this.productionCoordinatorForm.patchValue({
      budgetline: '',
      description: '',
      amount: ''
    });
    this.productionCoordinatorForm.markAsUntouched();
    this.productionCoordinatorForm.updateValueAndValidity();
    this.addServiceModal.show();
  }
  removedBudgetLine() {
    this.freelancersList = [];
    this.poVendorDropdown = [];
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
            this.saveAdvancePO();
          }
        } else {
          if (this.poAdvanceForm.controls['supplierType'].value == ADVANCE_PO_FOR.productionCoordinator) {
            this.productionCooordinatorPOAdd();
          }
        }
      }
    }
  }
  /**
  * Adds vendor po service
  */
  productionCooordinatorPOAdd() {
    this.submitAdvancePOService = true;
    this.disableAddButton = false;
    if (this.productionCoordinatorForm.valid) {
      this.disableAddButton = true;
      this.showtable = true;
      // tslint:disable-next-line:triple-equals
      if (this.updateIndex || this.updateIndex == 0) {
        this.formvalue = this.productionCoordinatorForm.value;
        const details = this.formvalue;
        this.tabledata[this.updateIndex] = Object.assign({}, details);
        this.updateIndex = null;
        this.budgetlineUpdated = true;
        this.totalBudgetlieAmount();
      } else {
        this.formvalue = this.productionCoordinatorForm.value;
        const details = this.formvalue;
        this.tabledata.push(details);
        this.totalBudgetlieAmount();
      }
      this.setSupplierData(ADVANCE_PO_FOR.productionCoordinator, false, '', '', false, false);
      this.submitAdvancePOService = false;
      this.clearproductionCoordinatorForm();
      this.poAdvanceForm.patchValue({
        freelancerId: '',
        modeOfOperation: ''
      });
    }
  }
  /**
     * Edits vendor po service form
     * @param details as Object which used to update the specific budget line record
     * @param index as Index which specifies the record that needs to be updated
     */
  editBudgetLine(details, index) {
    this.disableAddButton = false;
    this.showUpdateButton = true;
    this.updateIndex = index;
    this.productionCoordinatorForm.patchValue({
      budgetline: details.budgetline,
      description: details.description,
      quantity: details.quantity,
      amount: details.amount
    });
    this.addServiceModal.show();
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
    }
    else {
      this.setSupplierData(ADVANCE_PO_FOR.productionCoordinator, false, '', '', false, false);
    }
    this.totalBudgetlieAmount();
  }
  /**
   * Navigates to PO listing
   */
  navigateTo() {
    this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.purchaseOrder, [this.projectId, this.budgetId])]);
  }
  /**
 * Clears/Resets modal po service form
 */
  clearproductionCoordinatorForm() {
    this.productionCoordinatorForm.reset();
    this.addServiceModal.hide();
    this.productionCoordinatorForm.patchValue({
      budgetline: '',
      description: '',
      amount: ''
    });
    this.thirdPartyVendorDetails = '';
  }
  /**
   * Updates form validity on supplier type change
   * @param supplierType as String takes supplier type to update form validations
   */
  updateFormValidity(supplierType) {
    switch (supplierType) {
      case ADVANCE_PO_FOR.freelancer:
        this.poAdvanceForm.controls['vendorId'].setValidators([]);
        this.poAdvanceForm.controls['vendorId'].updateValueAndValidity();
        this.poAdvanceForm.controls['freelancerId'].setValidators([CustomValidators.required]);
        this.poAdvanceForm.controls['freelancerId'].updateValueAndValidity();
        this.poAdvanceForm.controls['amount'].setValidators([CustomValidators.requiredWithout0,
        CustomValidators.requiredNumber, CustomValidators.checkDecimal]);
        this.poAdvanceForm.controls['amount'].updateValueAndValidity();
        this.poAdvanceForm.controls['budgetline'].setValidators([CustomValidators.required]);
        this.poAdvanceForm.controls['budgetline'].updateValueAndValidity();
        this.poAdvanceForm.controls['description'].setValidators([CustomValidators.required]);
        this.poAdvanceForm.controls['description'].updateValueAndValidity();
        break;

      case ADVANCE_PO_FOR.vendor:
        this.poAdvanceForm.controls['freelancerId'].setValidators([]);
        this.poAdvanceForm.controls['freelancerId'].updateValueAndValidity();
        this.poAdvanceForm.controls['vendorId'].setValidators([CustomValidators.required]);
        this.poAdvanceForm.controls['vendorId'].updateValueAndValidity();
        this.poAdvanceForm.controls['amount'].setValidators([CustomValidators.requiredWithout0,
        CustomValidators.requiredNumber, CustomValidators.checkDecimal]);
        this.poAdvanceForm.controls['amount'].updateValueAndValidity();
        this.poAdvanceForm.controls['budgetline'].setValidators([CustomValidators.required]);
        this.poAdvanceForm.controls['budgetline'].updateValueAndValidity();
        this.poAdvanceForm.controls['description'].setValidators([CustomValidators.required]);
        this.poAdvanceForm.controls['description'].updateValueAndValidity();
        break;
      case ADVANCE_PO_FOR.productionCoordinator:
        this.poAdvanceForm.controls['vendorId'].setValidators([]);
        this.poAdvanceForm.controls['vendorId'].updateValueAndValidity();
        this.poAdvanceForm.controls['amount'].setValidators([]);
        this.poAdvanceForm.controls['amount'].updateValueAndValidity();
        this.poAdvanceForm.controls['budgetline'].setValidators([]);
        this.poAdvanceForm.controls['budgetline'].updateValueAndValidity();
        this.poAdvanceForm.controls['description'].setValidators([]);
        this.poAdvanceForm.controls['description'].updateValueAndValidity();
        break;
    }
  }
  /**
   * Resets Advance PO form on Supplier type change and update form validity
   * @param supplierType as number wich specifies the type of supplier for e.g Freelancer/Vendor/Production Coordinator
   */
  changeSupplier(supplierType, changeFlag) {
    this.updateFormValidity(supplierType);
    if (changeFlag) {
      this.poAdvanceForm.patchValue({
        budgetline: '',
        description: '',
        amount: '',
        paymentDate: '',
        freelancerId: '',
        vendorId: '',
        modeOfOperation: ''
      });
      this.advancePOFormDetails = '';
      this.thirdPartyVendorDetails = '';
      this.freelancersList = [];
      this.tabledata = [];
      this.totalBudgetlieAmount();
      if (supplierType == ADVANCE_PO_FOR.productionCoordinator) {
        supplierType = ADVANCE_PO_FOR.freelancer;
        this.setSupplierData(supplierType, '', '', '', true, false);
      }
      if (supplierType == ADVANCE_PO_FOR.vendor) {
        this.setSupplierData(supplierType, '', '', '', true, false);
      }
      if (supplierType == ADVANCE_PO_FOR.freelancer) {
        this.setSupplierData(supplierType, '', '', '', true, false);
      }
    }
  }
  /**
  * Sets Budgetline
  */
  setBudgetLines(response) {
    // this._sharedService.getAdvanceBudgetLine(this.projectId, supplierType).subscribe((response: any) => {
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
    //   error => {
    //     this.budgetLineList = [];
    //   });
  }
  /**
   * Auto selects mode of operation on Freelancer/vendor selection
   * @param id as String to fetch the operation type for this specific id
   */
  setMode(id, viewFlag) {
    if (viewFlag) {
      this.budgetlineUpdated = false;
    }
    if (this.poVendors) {
      this.selectedVendor = _.find(this.poVendors, { 'id': id });
      if (this.selectedVendor) {
        // this.incompleteProfileDetailsFlag = (this.selectedVendor.incompleteProfile) ? true : false;
        this.poAdvanceForm.controls['modeOfOperation'].setValue(this.selectedVendor.operationId);
      }
    }
    if (this.freelancers) {
      // tslint:disable-next-line:prefer-const
      let tempFreelancerDetails = _.find(this.freelancers, { 'id': id });
      // this.incompleteProfileDetailsFlag = (tempFreelancerDetails.incompleteProfile) ? true : false;
      if (tempFreelancerDetails && tempFreelancerDetails.operationId && !this.budgetlineUpdated) {
        this.poAdvanceForm.controls['modeOfOperation'].setValue(tempFreelancerDetails.operationId);
      }

    }
    this.setThirdParty(id);
  }
  setThirdParty(id) {
    if (this.freelancers) {
      // tslint:disable-next-line:prefer-const
      let tempFreelancerDetails = _.find(this.freelancers, { 'id': id });
      // this.incompleteProfileDetailsFlag = (tempFreelancerDetails.incompleteProfile) ? true : false;
      if (tempFreelancerDetails && tempFreelancerDetails.thirdPartyVendorName) {
        this.thirdPartyVendorDetails = tempFreelancerDetails.thirdPartyVendorName.commercialName;
      } else {
        this.thirdPartyVendorDetails = '';
      }
    }
  }
  /**
* Sets Mode of operation dropdown
*/
  setModeOfOperation() {
    this.mode = Common.changeDropDownValues(this.translateService, OPERATION_TYPES_ARR);
  }
  /**
   *Fetches suppliers for the respective budgetline passed
   * @param budgetLineId as string to get selected budgetline passed to fetch respective suppliers
   */
  setDropdown(budgetLineId, flag) {
    if (budgetLineId) {
      // let budgetLineId = this.poAdvanceForm.value.budgetline;
      const params: HttpParams = new HttpParams();
      // tslint:disable-next-line:triple-equals
      if (this.poAdvanceForm.value.supplierType == ADVANCE_PO_FOR.freelancer) {
        if (flag) {
          this.poAdvanceForm.patchValue({
            freelancerId: '',
            modeOfOperation: ''
          });
          this.thirdPartyVendorDetails = '';
        }
        this.setSupplierData(ADVANCE_PO_FOR.freelancer, false, budgetLineId, flag, false, false);
      }
      // tslint:disable-next-line:triple-equals
      if (this.poAdvanceForm.value.supplierType == ADVANCE_PO_FOR.vendor) {
        if (flag) {
          this.poAdvanceForm.patchValue({
            vendorId: '',
            modeOfOperation: ''
          });
          this.thirdPartyVendorDetails = '';
        }
        this.setSupplierData(ADVANCE_PO_FOR.vendor, false, budgetLineId, flag, false, false);
      }
    }
  }
  /**
* Sets freelancers dropdown according to budgetline selection
*/
  setCoordinatorFreelancerDropdown(response) {
    if (Common.checkStatusCodeInRange(response.header.statusCode)) {
      if (response.payload && response.payload.results) {
        this.freelancers = response.payload.results;

        // tslint:disable-next-line:max-line-length
        this.freelancersList = Common.getMultipleSelectArr(this.freelancers, ['id'], ['i18n', 'name'], ['contractStatus'], CONTRACT_STATUS_CONST.activeContracts);


        if (this.advancePOId) {
          this.setThirdParty(this.advancePOFormDetails.supplierId);
        }
      } else {
        this.freelancersList = [];
      }
    } else {
      this.toastrService.error(response.header.message);
      this.freelancersList = [];
    }
  }
  /**
 * Sets freelancers dropdown according to budgetline selection
 */
  setFreelancerDropdown(response, flag) {
    // this._advancePOService.getPOFreelancers(budgetLineId).subscribe((response: any) => {
    if (Common.checkStatusCodeInRange(response.header.statusCode)) {
      if (response.payload && response.payload.results) {
        this.freelancers = response.payload.results;

        // tslint:disable-next-line:max-line-length
        this.freelancersList = Common.getMultipleSelectArr(this.freelancers, ['id'], ['i18n', 'name'], ['contractStatus'], CONTRACT_STATUS_CONST.activeContracts);
        if (this.advancePOId && !flag) {
          this.setThirdParty(this.advancePOFormDetails.supplierId);
        }
        // if (this.freelancerPOId) {
        //   this.freelancerSelected(this.freelancerSelectedId, false);
        // }
      } else {
        this.freelancersList = [];
      }
    } else {
      this.toastrService.error(response.header.message);
      this.freelancersList = [];
    }
    //   this.renderPage = true;
    // },
    //   error => {
    //     this.freelancersList = [];
    //   });
  }
  /**
   * Calcultes total amount for added budget line services for Production coordinator role
   */
  totalBudgetlieAmount() {
    this.totalAmount = 0;
    for (let i = 0; i < this.tabledata.length; i++) {
      if (!isNaN(this.tabledata[i]['amount'])) {
        this.totalAmount = this.totalAmount + parseFloat(this.tabledata[i]['amount']);
      }
    }
  }
  /** Sets vendors dropdown according to budgetline selection
   * @param budgetLineId as String to fetch vendors for that particular id
   */
  setVendorDropdown(response, flag) {

    // this._advancePOService.getPOVendor(budgetLineId).subscribe((response: any) => {
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
      //     }
      //     this.renderPage = true;
      //   } else {
      //     this.poVendors = [];
      //     this.toastrService.error(response.header.message);
      //   }
      // },
      //   error => {
      //     this.poVendors = [];
      //   });
    }
  }
  /**
 * Sets project currency
 */
  // setCurrency() {
  //   this.poAdvanceForm.patchValue({
  //     currencyId: this.defaultCurrency.id,
  //   });
  // }
  /**
   * Adds Budget line and description in tabledata array
   */
  updateServices() {
    this.tabledata = [];
    const service = {
      budgetline: this.poAdvanceForm.value.budgetline,
      description: this.poAdvanceForm.value.description,
    };
    this.tabledata.push(service);
  }
  /**
   * Add/Edits Advance PO form
   */
  advancePOAddEdit() {
    // tslint:disable-next-line:max-line-length
    if (this.poAdvanceForm.value.supplierType == ADVANCE_PO_FOR.freelancer || this.poAdvanceForm.value.supplierType == ADVANCE_PO_FOR.vendor) {
      this.updateServices();
    }
    this.buttonDisable = true;
    this.spinnerFlag = true;
    const formvalue = this.poAdvanceForm.value;
    formvalue['langCode'] = this.sessionService.getCookie(COOKIES_CONSTANTS.langCode);
    const finalUserData = ManageAdvancePOData.setFormData(formvalue, this.tabledata);
    finalUserData['projectId'] = this.projectId;
    finalUserData['projectBudgetId'] = this.budgetId;
    // tslint:disable-next-line:triple-equals
    if (this.poAdvanceForm.value.supplierType == ADVANCE_PO_FOR.productionCoordinator) {
      finalUserData['totalAmountRequested'] = parseFloat(this.totalAmount);
    } else {
      finalUserData['totalAmountRequested'] = parseFloat(formvalue.amount);
    }
    if (!this.advancePOId) {
      this._advancePOService.postPOData(finalUserData).subscribe((responseData: any) => {
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
        this.toastrService.error(this.error.responseError);
      });
    } else {
      this._advancePOService.putPOData(finalUserData, this.advancePOId).subscribe((responseData: any) => {
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
        this.toastrService.error(this.error.responseError);
      });
    }
  }
  setSupplierData(supplierType, flag, budgetLineId, setDropdownFlag, changeSupplierFlag, onload) {
    // tslint:disable-next-line:triple-equals
    let params: HttpParams = new HttpParams();
    if (this.poAdvanceForm.value.supplierType == ADVANCE_PO_FOR.productionCoordinator) {
      if (this.tabledata.length > 0) {
        for (let i = 0; i < this.tabledata.length; i++) {
          params = params.append('budgetLines', this.tabledata[i]['budgetline']);
        }
        if (flag) {
          const combined = Observable.forkJoin(
            this._advancePOService.getCooridinatorFreelancers(params),
            this._sharedService.getAdvanceBudgetLine(this.budgetId, supplierType)
          );
          combined.subscribe((response: any) => {
            const productionCoordinatorFreelancers: any = response[0];
            const budgetlines: any = response[1];
            this.setCoordinatorFreelancerDropdown(productionCoordinatorFreelancers);
            this.setBudgetLines(budgetlines);
            this.renderPage = true;
          }, error => {
            this.renderPage = true;
          });
        } else {
          this._advancePOService.getCooridinatorFreelancers(params).subscribe((response: any) => {
            this.renderPage = true;
            this.setCoordinatorFreelancerDropdown(response);
          }, error => {
            this.poVendors = [];
            this.renderPage = true;
          });
        }
      }
    }
    if (this.poAdvanceForm.value.supplierType == ADVANCE_PO_FOR.vendor) {
      params = params.append('budgetLines', budgetLineId);
      if (flag) {
        const combinedVendor = Observable.forkJoin(
          this._sharedService.getAdvanceBudgetLine(this.budgetId, supplierType),
          this._advancePOService.getPOVendor(params)
        );
        combinedVendor.subscribe((response: any) => {
          const budgetlines: any = response[0];
          const vendors: any = response[1];
          this.setBudgetLines(budgetlines);
          this.setVendorDropdown(vendors, setDropdownFlag);
          this.renderPage = true;
        }, error => {
          this.renderPage = true;
        });
      } else {
        this._advancePOService.getPOVendor(params).subscribe((response: any) => {
          this.renderPage = true;
          this.setVendorDropdown(response, setDropdownFlag);
        }, error => {
          this.renderPage = true;
          this.poVendors = [];
        });
      }
    }
    if (this.poAdvanceForm.value.supplierType == ADVANCE_PO_FOR.freelancer) {
      if (flag) {
        const combinedVendor = Observable.forkJoin(
          this._sharedService.getAdvanceBudgetLine(this.budgetId, supplierType),
          this._advancePOService.getPOFreelancers(budgetLineId)
        );
        combinedVendor.subscribe((response: any) => {
          const budgetlines: any = response[0];
          const freelancers: any = response[1];
          this.setBudgetLines(budgetlines);
          this.setFreelancerDropdown(freelancers, setDropdownFlag);
          this.renderPage = true;
        }
          , error => {
            this.renderPage = true;
          });
      } else if (!changeSupplierFlag) {
        this._advancePOService.getPOFreelancers(budgetLineId).subscribe((response: any) => {
          this.setFreelancerDropdown(response, setDropdownFlag);
          this.renderPage = true;
        }, error => {
          this.renderPage = true;
          this.poVendors = [];
        });
      }
    }

    if (changeSupplierFlag || onload) {
      this._sharedService.getAdvanceBudgetLine(this.budgetId, supplierType).subscribe((response: any) => {
        this.setBudgetLines(response);
      }, error => {
        this.poVendors = [];
      });
    }
  }
  checkAmount() {
    if (isNaN(this.productionCoordinatorForm.value.amount)) {
      this.productionCoordinatorForm.controls['amount'].setValue(0);
    }
    if (isNaN(this.poAdvanceForm.value.amount)) {
      this.poAdvanceForm.controls['amount'].setValue(0);
    }
  }
  /**
  * Saves/Updates Advance PO form
  */
  saveAdvancePO() {
    this.spinnerFlag = true;
    this.submitAdvancePOForm = true;
    this.updateFormValidity(this.poAdvanceForm.value.supplierType);
    if (this.poAdvanceForm.valid) {
      this.advancePOAddEdit();
    }
    else {
      this.spinnerFlag = false;
      let target;
      for (const i in this.poAdvanceForm.controls) {
        if (!this.poAdvanceForm.controls[i].valid) {
          target = this.poAdvanceForm.controls[i];
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
}
