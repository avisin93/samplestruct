import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { FormControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ROUTER_LINKS, ROUTER_LINKS_FULL_PATH, OPERATION_MODES, PURCHASE_ORDER_CONST, CFDI_CONST,
  LOCAL_STORAGE_CONSTANTS, COOKIES_CONSTANTS, CONTRACT_STATUS_CONST, defaultDatepickerOptions, OPERATION_TYPES_ARR
} from '@app/config';
import { Common, SessionService, NavigationService, CustomValidators } from '@app/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedData } from '@app/shared/shared.data';
import { SharedService } from '@app/shared/shared.service';
import { AddFreelancerPOService } from './add-po-freelancer.service';
import { AddPOFreelancerData } from './add-po-freelancer.data.model';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { ProjectsData } from '../../../../projects.data';

declare var $: any;

@Component({
  selector: 'app-add-po-freelancer',
  templateUrl: './add-po-freelancer.component.html',
  styleUrls: ['./add-po-freelancer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddPoFreelancerComponent implements OnInit {
  ROUTER_LINKS_FULL_PATH = ROUTER_LINKS_FULL_PATH;
  OPERATION_MODES = OPERATION_MODES;
  CONTRACT_STATUS_CONST = CONTRACT_STATUS_CONST;
  CFDI_CONST = CFDI_CONST;
  currencies: any = [];
  modesOfOperation: any = [];
  freelancersList: any = [];
  budgetLineList: any = [];
  requestedByList: any = [];
  defaultValueObj: any = {};
  thirdPartyVendorName = '';
  totalAmount: any;
  subTotal: any;
  noBudgetLineFlag = false;
  noFreelancerFlag = false;
  submmitedFormFlag = false;
  incompleteProfileDetailsFlag: Boolean = false;
  isClicked = false;
  spinnerFlag = false;
  projectId: any;
  currency: any;
  value: any;
  freelancers: any = [];
  freelancerPOForm: FormGroup;
  error: any;
  mode: any = [];
  freelancerPOId: any;
  editFreelancerPOData: any;
  freelancerPOFormDetails: any;
  freelancerSelectedId: any;
  dobDatePickerOptions = JSON.parse(JSON.stringify(defaultDatepickerOptions));
  isrWitholdingAmt = 0;
  vatWitholdingAmt = 0;
  defaultCurrency: any = {};
  renderPage: boolean;
  currencyConversionRate: any[];
  budgetId: String = '';
  payableAmount: Number = 0;
  vatAmt: number;

  constructor(
    private router: Router,
    private sharedData: SharedData,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private navigationService: NavigationService,
    private fb: FormBuilder,
    private _addFreelancerPOService: AddFreelancerPOService,
    private _sharedService: SharedService,
    private sessionService: SessionService,
    private projectsData: ProjectsData,
    private toastrService: ToastrService, private translate: TranslateService
  ) {
    this.dobDatePickerOptions.disableUntil = {
      year: Common.getTodayDate().getFullYear(), month: Common.getTodayDate().getMonth() + 1, day: Common.getTodayDate().getDate() - 1
    };
  }

  ngOnInit() {
    Common.scrollTOTop();
    this.projectId = this.projectsData.projectId;
    this.budgetId = this.projectsData.budgetId;
    // const projectData: any = this.projectsData.getProjectsData();
    // this.defaultCurrency['id'] = projectData.defaultCurrencyId;
    // this.defaultCurrency['name'] = projectData.defaultCurrencyCode;
    this.createAddFreelancerPOForm();
    this.getPageDetails();
    //this.setPODefaultValues();
    this.route.params.subscribe(params => {
      this.freelancerPOId = params['id'];
      this.getEditPODetails();
      this.setPODefaultValues();
    });
    this.translate.get('common').subscribe(res => {
      this.error = res;
    });
    if (!this.freelancerPOId) {
      this.renderPage = true;
    }
  }

  /**
* Submits on enter key
* @param event as enter key event
*/
  // @HostListener('document:keydown', ['$event'])
  // onKeyDownHandler(event: KeyboardEvent) {
  //   if (event.keyCode === 13) {
  //     event.preventDefault();
  //     if (!this.spinnerFlag) {
  //       this.addFreelancerPO();
  //     }
  //   }
  // }
  getEditPODetails() {
    this.getPODefaultValues();
    this._addFreelancerPOService.getFreelancerPObyID(this.freelancerPOId).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        this.editFreelancerPOData = response.payload.result;
        this.freelancerPOFormDetails = AddPOFreelancerData.setWebServiceDetails(this.editFreelancerPOData);
        this.totalAmount = this.freelancerPOFormDetails.totalAmountRequested;
        this.setFreelancerPOFormValues(this.freelancerPOFormDetails);
      }
    });
  }
  removedBudgetLine() {
    this.freelancersList = [];
  }
  setFreelancerPOFormValues(freelancerPOFormDetails) {
    this.freelancerSelectedId = (freelancerPOFormDetails.freelancerId);
    this.getFreelancersList(freelancerPOFormDetails.budgetLine);
    this.freelancerPOForm.patchValue({
      budgetLine: freelancerPOFormDetails.budgetLine,
      freelancerId: freelancerPOFormDetails.freelancerId,
      totalAmountRequested: freelancerPOFormDetails.totalAmountRequested,
      currencyId: freelancerPOFormDetails.currencyId,
      vat: freelancerPOFormDetails.vat,
      isrWithholding: freelancerPOFormDetails.isrWithholding,
      vatWithholding: freelancerPOFormDetails.vatWithholding,
      modeOfOperation: freelancerPOFormDetails.modeOfOperation,
      requestedBy: freelancerPOFormDetails.requestedBy,
      serviceDescription: freelancerPOFormDetails.i18n.serviceDescription,
      notes: freelancerPOFormDetails.i18n.notes,
      paymentDate: freelancerPOFormDetails.paymentDate,
      typeSelection: freelancerPOFormDetails.typeSelection

    });
    this.onCurrencyChange(freelancerPOFormDetails.currencyId);
    this.updateSubtotal();
    this.updateVatWitholding();
    this.updateISRWitholding();
    this.updatePayableAmount();
    this.renderPage = true;
  }
  createAddFreelancerPOForm() {
    this.freelancerPOForm = this.fb.group({
      budgetLine: ['', [CustomValidators.required]],
      freelancerId: ['', [CustomValidators.required]],
      totalAmountRequested: ['', [CustomValidators.requiredWithout0, CustomValidators.requiredNumber, CustomValidators.checkDecimal]],
      currencyId: ['', [CustomValidators.required]],
      vat: ['', [CustomValidators.checkUptoFourDecimal]],
      isrWithholding: ['', [CustomValidators.checkUptoFourDecimal]],
      vatWithholding: ['', [CustomValidators.checkUptoFourDecimal]],
      modeOfOperation: ['', [CustomValidators.required]],
      requestedBy: [''],
      serviceDescription: ['', [CustomValidators.required]],
      notes: [''],
      paymentDate: ['', [CustomValidators.required]],
      typeSelection: [0],

    });
  }
  // validateFloatKeyPress(controlName) {
  //   var v = parseFloat(this.freelancerPOForm.controls[controlName].value);
  //   let value = (isNaN(v)) ? '' : v.toFixed(2);
  //   this.freelancerPOForm.controls[controlName].setValue(value);
  // }
  getPageDetails() {
    this.getPOBudgetLine(this.budgetId);
    this.getCurrencies();
    this.getModesOfOperation();
    this.getPODefaultValues();
    this.getRequestedByList();
  }
  /**
 * checks weather total requested amount is NAN if yes then it sets to 0
 */
  checkAmount() {
    if (isNaN(this.freelancerPOForm.value.totalAmountRequested)) {
      this.freelancerPOForm.controls['totalAmountRequested'].setValue(0);
    }
  }
  getPOBudgetLine(projectId) {
    this._sharedService.getPOBudgetLine(projectId, PURCHASE_ORDER_CONST.freelancer).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.results) {
          const budgetLineList = response.payload.results;
          this.budgetLineList = Common.getMultipleSelectArr(budgetLineList, ['id'], ['budgetLine']);
        } else {
          this.budgetLineList = [];
        }

      } else {
        this.toastrService.error(response.header.message);
        this.budgetLineList = [];
      }
    },
      error => {
        this.budgetLineList = [];
      });
  }

  /**
   * Sets and binds VAT,ISR,Vatwitholdng default values
   */
  setPODefaultValues() {
    this._addFreelancerPOService.getPODefaultDetails().subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.result) {
          this.defaultValueObj = response.payload.result;
          if (!this.freelancerPOId) {
            // tslint:disable-next-line:triple-equals
            if (this.freelancerPOForm.controls['typeSelection'].value == CFDI_CONST.honorarious) {
              this.freelancerPOForm.patchValue({
                vat: this.defaultValueObj.vat,
                vatWithholding: this.defaultValueObj.vatWithHolding,
                isrWithholding: this.defaultValueObj.isrWithHolding,
              });
            } else {
              this.freelancerPOForm.patchValue({
                vat: this.defaultValueObj.vat,
                vatWithholding: '',
                isrWithholding: '',
              });
            }
          }
          // } else {
          //   if (this.freelancerPOForm.controls['typeSelection'].value === CFDI_CONST.honorarious) {
          //     this.freelancerPOForm.patchValue({
          //       vat: this.freelancerPOFormDetails.vat,
          //       isrWithholding: this.freelancerPOFormDetails.isrWithholding,
          //       vatWithholding: this.freelancerPOFormDetails.vatWithholding,
          //     });
          //   } else {
          //     this.freelancerPOForm.patchValue({
          //       vat: this.defaultValueObj.vat,
          //       vatWithholding: '',
          //       isrWithholding: '',
          //     });
          //   }
          // }
        } else {
          this.defaultValueObj = [];
        }
      }
      else {
        this.defaultValueObj = [];
      }
    },
      error => {
        this.defaultValueObj = [];
      });

  }
  /**
    * Changes po type
    */
  changeType(typeValue) {
    // tslint:disable-next-line:triple-equals
    if (typeValue == CFDI_CONST.honorarious) {
      if (!this.freelancerPOId) {
        this.freelancerPOForm.patchValue({
          vat: this.defaultValueObj.vat,
          vatWithholding: this.defaultValueObj.vatWithHolding,
          isrWithholding: this.defaultValueObj.isrWithHolding,
        });
      } else {
        if (this.freelancerPOFormDetails.typeSelection === 1) {
          this.freelancerPOForm.patchValue({
            vat: this.freelancerPOFormDetails.vat,
            vatWithholding: this.freelancerPOFormDetails.vatWithholding,
            isrWithholding: this.freelancerPOFormDetails.isrWithholding,
          });
        } else {
          this.freelancerPOForm.patchValue({
            vat: this.defaultValueObj.vat,
            vatWithholding: this.defaultValueObj.vatWithHolding,
            isrWithholding: this.defaultValueObj.isrWithHolding,
          });
        }
      }
      this.updateVatWitholding();
      this.updateISRWitholding();
      this.updatePayableAmount();
    } else {
      if (!this.freelancerPOId) {
        this.freelancerPOForm.patchValue({
          vat: this.defaultValueObj.vat,
          vatWithholding: '',
          isrWithholding: '',
        });
      } else {
        if (this.freelancerPOFormDetails.typeSelection === 0) {
          this.freelancerPOForm.patchValue({
            vat: this.freelancerPOFormDetails.vat,
            vatWithholding: '',
            isrWithholding: '',
          });
        } else {
          this.freelancerPOForm.patchValue({
            vat: this.defaultValueObj.vat,
            vatWithholding: '',
            isrWithholding: '',
          });
        }
      }
    }
    this.updateSubtotal();
    this.updatePayableAmount();
  }

  /**
 * Updates VAT witholding
 */
  updateVatWitholding() {
    const formvalue = this.freelancerPOForm.value;
    this.vatWitholdingAmt = 0;
    if (isNaN(formvalue.vatWithholding) || formvalue.vatWithholding === '.') {
      this.freelancerPOForm.patchValue({
        vatWithholding: 0
      });
    }
    if (formvalue.vatWithholding > 100) {
      this.freelancerPOForm.patchValue({
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
   * Updates ISR witholding
   */
  updateISRWitholding() {
    const formvalue = this.freelancerPOForm.value;
    this.isrWitholdingAmt = 0;
    if (isNaN(formvalue.isrWithholding) || formvalue.isrWithholding === '.') {
      this.freelancerPOForm.patchValue({
        isrWithholding: 0
      });
    }
    if (formvalue.isrWithholding > 100) {
      this.freelancerPOForm.patchValue({
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

  setValueZero(field) {
    const formvalue = this.freelancerPOForm.value;
    if (!formvalue[field]) {
      this.freelancerPOForm.controls[field].setValue(0);
    }
  }

  getCurrencies() {
    this._sharedService.getProjectCurrencies(this.budgetId).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.result) {
          this.currencies = response.payload.result;
          this.currency = Common.getMultipleSelectArr(this.currencies, ['id'], ['code']);
          this.currencyConversionRate = Common.getMultipleSelectArr(this.currencies, ['id'], ['targetUnit']);
        } else {
          this.currencies = [];
        }
      } else {
        this.currencies = [];
      }
    },
      error => {
        this.currencies = [];
      });
  }
  getModesOfOperation() {
    this.mode = Common.changeDropDownValues(this.translateService, OPERATION_TYPES_ARR);
  }
  onCurrencyChange(currencyId) {
    this.defaultCurrency.id = currencyId;
    const currencyobj = _.find(this.currency, { 'id': currencyId });
    if (currencyobj) {
      this.defaultCurrency.name = currencyobj.text;
    } else {
      this.defaultCurrency.name = '';
    }
  }
  getRequestedByList() {
    this._sharedService.getReuestedByFreelancers().subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.results) {
          const requestedByList = response.payload.results;
          this.requestedByList = Common.getMultipleSelectArr(requestedByList, ['id'], ['i18n', 'name']);
        } else {
          this.requestedByList = [];
        }
      } else {
        this.requestedByList = [];
      }
    },
      error => {
        this.requestedByList = [];
      });
  }
  getPODefaultValues() {
    this._sharedService.getPODefaultValues().subscribe((response: any) => {

      if (Common.checkStatusCode(response.header.statusCode)) {
        this.defaultValueObj = response.payload.result;
        if (!this.freelancerPOId) {
          this.freelancerPOForm.patchValue({
            vat: this.defaultValueObj.vat,
            isrWithholding: this.defaultValueObj.isrWithHolding,
            vatWithholding: this.defaultValueObj.vatWithHolding
          });
        } else {
          this.defaultValueObj = {};
        }
      } else {
        this.defaultValueObj = {};
      }
    },
      error => {
        this.defaultValueObj = {};
      });
  }
  getFreelancersList(budgetLineId) {
    if (typeof budgetLineId === 'string') {
      this._sharedService.getPOFreelancers(budgetLineId).subscribe((response: any) => {
        if (Common.checkStatusCodeInRange(response.header.statusCode)) {
          if (response.payload && response.payload.results) {
            this.freelancers = response.payload.results;
            // tslint:disable-next-line:max-line-length
            this.freelancersList = Common.getMultipleSelectArr(this.freelancers, ['id'], ['i18n', 'name'], ['contractStatus'], CONTRACT_STATUS_CONST.activeContracts);
            if (this.freelancerPOId && this.freelancerSelectedId) {
              this.freelancerSelected(this.freelancerSelectedId, false);
            }
          } else {
            this.freelancersList = [];
          }
        } else {
          this.toastrService.error(response.header.message);
          this.freelancersList = [];
        }
      },
        error => {
          this.freelancersList = [];
        });
    }
  }
  budgetLineSelected(budgetLine) {
    this.freelancersList = [];
    this.thirdPartyVendorName = '';
    this.getFreelancersList(budgetLine);
    this.freelancerPOForm.controls['budgetLine'].setValue(budgetLine);
  }
  freelancerSelected(freeLancerId, isUpdateCurrency: boolean) {
    const freelancerObj = _.find(this.freelancers, { 'id': freeLancerId });
    if (freelancerObj) {
      this.thirdPartyVendorName = (freelancerObj.thirdPartyVendorName && freelancerObj.thirdPartyVendorName.commercialName) ? freelancerObj.thirdPartyVendorName.commercialName : '';
      if (isUpdateCurrency) {
        const currencyobj = _.find(this.currency, { 'id': freelancerObj.currencyId });
        if (currencyobj) {
          this.freelancerPOForm.patchValue({
            currencyId: freelancerObj.currencyId,
            modeOfOperation: freelancerObj.operationId
          });
        } else {
          this.freelancerPOForm.patchValue({
            currencyId: '',
            modeOfOperation: freelancerObj.operationId
          });
        }
        this.onCurrencyChange(freelancerObj.currencyId);
      }

    }
    else {
      this.thirdPartyVendorName = '';
    }
  }
  resetFreelancerDetail() {
    this.freelancerSelectedId = '';
    this.freelancerPOForm.patchValue({
      freelancerId: '',
      modeOfOperation: '',
      currencyId: ''
    });
    this.thirdPartyVendorName = '';
    this.defaultCurrency['id'] = '';
    this.defaultCurrency['name'] = '';
  }
  requestedBySelected(requestedById) {
    this.freelancerPOForm.controls['requestedBy'].setValue(requestedById);
  }
  updateSubtotal() {
    const formvalue = this.freelancerPOForm.value;
    this.totalAmount = formvalue.totalAmountRequested;
    this.subTotal = 0;
    if (formvalue.vat > 100) {
      this.freelancerPOForm.patchValue({
        vat: 100
      });
      formvalue.vat = 100;
    }
    if (isNaN(formvalue.vat) || formvalue.vat === '.') {
      this.freelancerPOForm.patchValue({
        vat: 0,
      });
      formvalue.vat = 0;
    }
    if (formvalue.vat === 0 || !formvalue.vat) {
      const totalAmountRequested = formvalue.totalAmountRequested ? formvalue.totalAmountRequested : 0;
      this.subTotal = formvalue.vat + parseFloat(totalAmountRequested);
    }
    if (formvalue.vat && formvalue.totalAmountRequested) {
      const calculatedValue: any = (parseFloat(formvalue.totalAmountRequested) * parseFloat(formvalue.vat)) / 100;
      this.subTotal = parseFloat(calculatedValue) + parseFloat(formvalue.totalAmountRequested);
    }
    this.updateISRWitholding();
    this.updateVatWitholding();
    this.updatePayableAmount();
  }
  checkField() {
    const formvalue = this.freelancerPOForm.value;
    if (!formvalue.vatWithholding) {
      this.freelancerPOForm.patchValue({
        vatWithholding: 0,
      });
    }
    if (!formvalue.isrWithholding) {
      this.freelancerPOForm.patchValue({
        isrWithholding: 0,
      });
    }
  }
  addFreelancerPO() {
    // this.spinnerFlag = true;
    this.submmitedFormFlag = true;
    if (this.freelancerPOForm.valid) {
      this.isClicked = true;
      this.spinnerFlag = true;
      const formvalue = this.freelancerPOForm.value;
      formvalue['langCode'] = this.sessionService.getCookie(COOKIES_CONSTANTS.langCode);
      const finalPOData = AddPOFreelancerData.getWebServiceDetails(formvalue);
      finalPOData['projectId'] = this.projectId;
      finalPOData['projectBudgetId'] = this.budgetId;
      if (!this.freelancerPOId) {
        this._addFreelancerPOService.postData(finalPOData).
          subscribe((responseData: any) => {
            this.submmitedFormFlag = false;
            if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
              // this.router.navigate(['../', ROUTER_LINKS_FULL_PATH.purchaseOrderList], { relativeTo: this.route }).then(() =>
              //   this.toastrService.success(responseData.header.message)
              // );
              this.toastrService.success(responseData.header.message);
              this.navigateTo();
            } else {

              this.toastrService.error(responseData.header.message);
            }
            this.isClicked = false;
            this.spinnerFlag = false;
          },
            error => {
              this.isClicked = false;
              this.spinnerFlag = false;
            });
      } else {
        this._addFreelancerPOService.postDataById(finalPOData, this.freelancerPOId).
          subscribe((responseData: any) => {
            this.isClicked = false;
            this.spinnerFlag = false;
            this.submmitedFormFlag = false;
            if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
              // this.router.navigate(['../../', ROUTER_LINKS_FULL_PATH.purchaseOrderList], { relativeTo: this.route }).then(() =>
              // );
              this.toastrService.success(responseData.header.message);
              this.navigateTo();
            } else {

              this.spinnerFlag = false;
              this.toastrService.error(responseData.header.message);
            }
          },
            error => {
              this.spinnerFlag = false;
              this.isClicked = false;
              this.spinnerFlag = false;
            });
      }

    }
    else {
      this.spinnerFlag = false;
      let target;
      for (const i in this.freelancerPOForm.controls) {
        if (!this.freelancerPOForm.controls[i].valid) {
          target = this.freelancerPOForm.controls[i];
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

  navigateTo() {
    this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.purchaseOrder, [this.projectId, this.budgetId])]);
  }
  updatePayableAmount() {

    if (this.subTotal) {
      this.payableAmount = (this.subTotal - (this.isrWitholdingAmt + this.vatWitholdingAmt));
    } else {
      this.payableAmount = 0;
    }
  }

}
