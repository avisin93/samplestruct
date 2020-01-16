/** 1.Import third party components
2. Import created modules
3. Import crated services
4. Import created classes
5. Import created constants **/
import { Component, OnInit, Host, HostListener, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ManageBusinessTermData } from './business-terms.data.model';
import { ManageBidData } from '../manage-bid.data';
import { BusinessTerms } from './business-terms';
import { Subscription } from 'rxjs/Subscription';
import { ManageBidComponent } from '../manage-bid.component';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { Common, TriggerService } from '@app/common';
import { CURRENCY_CONSTANTS, EVENT_TYPES, ACTION_TYPES } from '@app/config';
import { DEFAULT_CURRENCY, MARKUP_INSURANCE, TAB_NAME_KEYS, STATUS_CODES, TAB_CONST, BIDDING_ROUTER_LINKS_FULL_PATH } from '../../Constants';
import { SharedData } from '@app/shared/shared.data';
const swal = require('sweetalert');
declare var $: any;

@Component({
  selector: 'app-buisness-terms',
  templateUrl: './business-terms.component.html',
  styleUrls: ['./business-terms.component.scss']
})
export class BuisnessTermsComponent implements OnInit, OnDestroy {
  /*declare variables above constructor in sequence -imported constants,public variable,private variables*/
  CURRENCY_CONSTANTS = CURRENCY_CONSTANTS;
  buisnessTermsForm: FormGroup;
  projectId: string;
  currencyId: 1;
  submmitedFormFlag: Boolean = false;
  ACTION_TYPES = ACTION_TYPES;
  spinnerFlag: Boolean = false;
  subscription: Subscription;
  disableButtonFlag: Boolean = false;
  businessTermDetails: any = {};
  DEFAULT_CURRENCY = DEFAULT_CURRENCY;
  currencies = [];
  currency: any[];
  filteredCurrencies = [];
  currencyKeyArr: any[] = [];
  defaultCurrencyErrorFlag: Boolean = false;
  biddingsLabelsObj: any = {};
  MODULE_ID: any;
  uiAccessPermissionsObj: any;
  permissionObject: any;
  /*declare variables above constructor in sequence -imported constants,public variable,private variables*/

  /*inicialize constructor after declaration of all variables*/
  constructor(private router: Router,
    private fb: FormBuilder,
    private sharedData: SharedData,
    private businessTerms: BusinessTerms,
    public manageBidData: ManageBidData,
    private triggerService: TriggerService,
    private route: ActivatedRoute,
    private manageBidComponent: ManageBidComponent, private translateService: TranslateService) {
  }
  /*inicialize constructor after declaration of all variables*/

  /*all life cycle events whichever required after inicialization of constructor*/
  ngOnInit() {
    Common.scrollTOTop();
    this.manageBidData.initialize(TAB_CONST.businessTerms, TAB_NAME_KEYS.businessTerms, 'business-terms-tab');
    this.manageBidData.disableTabs.businessTerms = false;
    this.setLocaleObj();
    this.buisnessTermsForm = this.businessTerms.createBuisnessTermsForm();
    this.projectId = this.manageBidData.projectId;
    this.subscription = this.triggerService.getEvent().subscribe((data) => {
      if (data.event) {
        if (data.event.type === EVENT_TYPES.bidDetailsEvent) {
          const currentValue = data.event.currentValue;
          if (currentValue) {
            if (this.manageBidData.disableProjectInputs) {
              this.manageBidData.navigateToPassesTab();
            } else {
              this.currencyKeyArr = Common.keyValueDropdownArr(this.manageBidData.currencies, 'id', 'text');
              this.setPageDetails();
            }
          }
        }
      }
    });
  
    this.setPageDetails();
    if (this.manageBidData.currencies.length > 0) {
      this.currencyKeyArr = Common.keyValueDropdownArr(this.manageBidData.currencies, 'id', 'text');
    }
    this.setPermissionsDetails();
  }
  ngOnDestroy() {
    this.manageBidData.currentTabDataChangeFlag = false;
    this.manageBidData.validFormFlag = false;
    this.subscription.unsubscribe();
    this.triggerService.clearEvent();
  }
  setPermissionsDetails() {
   this.permissionObject = this.sharedData.getRolePermissionData();
    this.MODULE_ID = this.route.snapshot.parent.parent.parent.data['moduleID'];
    const modulePermissionObj =  this.permissionObject[this.MODULE_ID];
    if (modulePermissionObj.uiAccess) {
      this.uiAccessPermissionsObj = modulePermissionObj.uiAccess;
    }
  }
  /**
* Submits on enter key
* @param event as enter key event
*/
  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      event.preventDefault();
      if ( !this.manageBidData.spinnerFlag) {
        this.openAICPReflectionIntimationPopup();
      }
    }
  }
  /*all life cycle events whichever required after inicialization of constructor*/

  /*Set page details & set default form arrays if data not available*/
  setPageDetails() {
    if (this.manageBidData.bidData['businessTerms']) {
      this.setBusinessTermsDetails();
    } else {
      if (this.manageBidData.bidFormsData['businessTerms']) {
        this.setBusinessTermsDetails();
      } else {
        this.setInitialMarkupInsuranceArr();
        this.setExchangeRateCurrenciesArr();
      }
    }
  }
  /*Sets Default markup insurance form array*/
  setInitialMarkupInsuranceArr() {
    const budgetLineMarkupArr = <FormArray>this.buisnessTermsForm.controls['budgetLineMarkup'];
    budgetLineMarkupArr.controls = [];
    for (let index = 0; index < MARKUP_INSURANCE.length; index++) {
      let formGroup = this.businessTerms.createMarkupFormGroup();
      formGroup.setValue(MARKUP_INSURANCE[index]);
      budgetLineMarkupArr.push(formGroup);
    }
  }
  /*Sets exchange rate currency form array*/
  setExchangeRateCurrenciesArr() {
    const exchangeRateArr = <FormArray>this.buisnessTermsForm.controls['exchangeRate'];
    let firstFormGroup = <FormGroup>exchangeRateArr.controls[0];
    firstFormGroup.controls['currencies'].setValue(this.manageBidData.filteredCurrencies);
  }
  /*Sets biddings labels from language jsons*/
  setLocaleObj() {
    this.translateService.get('biddings').subscribe(res => {
      this.biddingsLabelsObj = res;
    });
  }

  /**
  **  method to set business Term form values
  ** @param businessTermDetails as business term details object
  ** add class on which user has clicked as active
  **/
  setFormValues(businessTermDetails) {
    if (businessTermDetails) {
      if (businessTermDetails.exchangeRate && businessTermDetails.exchangeRate.length > 0) {
        const exchangeRateArr = <FormArray>this.buisnessTermsForm.controls['exchangeRate'];
        exchangeRateArr.controls = [];
        for (let index = 0; index < businessTermDetails.exchangeRate.length; index++) {
          this.addExchangeRate();
          let formGroup = exchangeRateArr.controls[index];
          let dataObj = businessTermDetails.exchangeRate[index];
          formGroup.patchValue({
            sourceCurrencyId: dataObj.sourceCurrencyId,
            targetCurrency: dataObj.targetCurrency,
            unit: dataObj.unit,
            exchangeRate: dataObj.exchangeRate,
          });
        }
        this.sourceCurrencyChanged();
      }
      if (businessTermDetails.budgetLineMarkup && businessTermDetails.budgetLineMarkup.length > 0) {
        const markupArr = <FormArray>this.buisnessTermsForm.controls['budgetLineMarkup'];
        markupArr.controls = [];
        for (let index = 0; index < businessTermDetails.budgetLineMarkup.length; index++) {
          this.addMarkup();
        }
      }
      this.buisnessTermsForm.patchValue({
        'commission': businessTermDetails.commission,
        'financialCost': businessTermDetails.financialCost,
        'erAdjustment': businessTermDetails.erAdjustment,
        'baseRateAdjustment': businessTermDetails.baseRateAdjustment,
        'targetAgencyFees': businessTermDetails.targetAgencyFees,
        'targetPayrollFees': businessTermDetails.targetPayrollFees,
        'targetLabourFees': businessTermDetails.targetLabourFees,
        'currency': businessTermDetails.currency,
        'budgetLineMarkup': businessTermDetails.budgetLineMarkup,
      });
      if (businessTermDetails.currency) {
        this.buisnessTermsForm.get('currency').disable();
      }

      this.manageBidData.validFormFlag = this.buisnessTermsForm.valid ? true : false;
      // this.updateFormStatus();
    }
  }


  /**
  **  Adds exchange rate form group into form array if valid
  ** @param checkValidation as boolean to checks formgroup's validity
  ** @param formGroup as object to get form value
  **/
  addExchangeRate(checkValidation: boolean = false, formGroup: any = {}) {
    const exchangeRateArr = <FormArray>this.buisnessTermsForm.controls['exchangeRate'];
    if (checkValidation) {
      const formvalue = formGroup.value;
      if (formvalue.sourceCurrencyId.trim() && formvalue.exchangeRate) {
        this.submmitedFormFlag = false;
        const formgroup = this.businessTerms.createExchangeRateFormGroup();
        formgroup.controls.currencies.setValue(this.getFilteredCurrencies());
        exchangeRateArr.push(formgroup);
      } else {
        this.submmitedFormFlag = true;
      }
    }
    else {
      const formgroup = this.businessTerms.createExchangeRateFormGroup();
      formgroup.controls.currencies.setValue(this.getFilteredCurrencies());
      exchangeRateArr.push(formgroup);
    }
  }
  /**
   **  Adds markup form group into form array 
   **/
  addMarkup() {
    const markupArr = <FormArray>this.buisnessTermsForm.controls['budgetLineMarkup'];
    const formgroup = this.businessTerms.createMarkupFormGroup();
    markupArr.push(formgroup);
  }
  /**
   **  Removes exchange rate form group of respective index
   ** @param index as number 
   **/
  removeExchangeRate(index) {
    const exchangeRateArr = <FormArray>this.buisnessTermsForm.get('exchangeRate');
    exchangeRateArr.removeAt(index);
    this.updateFormStatus();
  }
  /**
   ** Check exchange rate added or not for selected default currency
   **/
  checkDefaultCurrencyErrorFlag() {
    // if (this.buisnessTermsForm.controls['exchangeRate'].touched) {
    if (this.businessTermDetails.currency) {
      this.buisnessTermsForm.controls['currency'].enable();
    }

    const formValue = this.buisnessTermsForm.value;
    const selectedCurrencyIds = _.map(formValue.exchangeRate, 'sourceCurrencyId');
    this.defaultCurrencyErrorFlag = ((formValue.currency !== DEFAULT_CURRENCY.id) && !selectedCurrencyIds.includes(formValue.currency)) ? true : false;
    if (this.businessTermDetails.currency) {
      this.buisnessTermsForm.controls['currency'].disable();
    }

    // }
  }
  /**
  ** Opens AICP reflection intimation popup if form is valid & next tab is not disabled
  **/
  openAICPReflectionIntimationPopup() {
    if (!this.manageBidData.disableTabs.productionParameters && this.manageBidData.AICPGeneratedStatus) {
      this.submmitedFormFlag = true;
      this.checkAndRemoveFormGroup();
      this.checkDefaultCurrencyErrorFlag();
      if (this.buisnessTermsForm.valid && !this.defaultCurrencyErrorFlag) {

        let aicpButtonLabel = (this.manageBidData.latestPassDetails && this.manageBidData.latestPassDetails.status === STATUS_CODES.PUBLISH) ? this.biddingsLabelsObj.buttons.generateAICP : this.biddingsLabelsObj.labels.updateAICP;

        var swalObj = Common.swalConfirmPopupObj(this.biddingsLabelsObj.labels.btAICPRelectionMsg, true, true, aicpButtonLabel, this.biddingsLabelsObj.labels.cancelDelete);
        swal(swalObj, (isConfirm) => {
          if (isConfirm) {
            this.triggerEventToSaveData(true);
          }
        });
      } else {
        this.scrollToInvalidControl();
      }
    } else {
      this.saveBusinessTermData();
    }
  }

  /**
   ** Trigger event to save data if form is valid otherwise scroll to invalid control
   **/
  saveBusinessTermData() {
    this.submmitedFormFlag = true;
    this.checkAndRemoveFormGroup();
    this.checkDefaultCurrencyErrorFlag();
    if (this.buisnessTermsForm.valid && !this.defaultCurrencyErrorFlag) {
      this.triggerEventToSaveData();
    }
    else {
      this.scrollToInvalidControl();
    }
  }
  /**
   ** Triggers event for parent component to save basic info tab data
   ** @param generateAICPFlag of type boolean 
   **/
  triggerEventToSaveData(generateAICPFlag: Boolean = false) {
    this.submmitedFormFlag = false;
    this.defaultCurrencyErrorFlag = false;
    this.manageBidData.disableButtonFlag = true;
    this.manageBidData.spinnerFlag = true;
    this.buisnessTermsForm.controls['currency'].enable();
    const formValue = this.buisnessTermsForm.value;
    this.manageBidData.defaultCurrencyId = formValue.currency;
    this.manageBidData.bidFormsData.businessTerms = formValue;
    this.buisnessTermsForm.controls['currency'].disable();
    this.manageBidComponent.setProjectBidCurrencyDropdown();
    this.setEventType({ type: EVENT_TYPES.updateBidEvent, prevValue: {}, currentValue: { 'tabId': TAB_CONST.businessTerms, 'navigationUrl': BIDDING_ROUTER_LINKS_FULL_PATH['biddingproductionParameters'], 'generateAICP': generateAICPFlag } });
  }
  /**
  ** Get last formgroup of exchange rate formarray
  **/
  checkAndRemoveFormGroup() {
    let formArray: FormArray = <FormArray>this.buisnessTermsForm.controls['exchangeRate'];
    let formGroup: FormGroup = <FormGroup>formArray.controls[formArray.length - 1];
    this.checkFormGroupControlsValue(formGroup, formArray, formArray.length - 1);
  }
  /**
 ** Remove whole formgroup from  formarray if no any field is filled
 **/
  checkFormGroupControlsValue(formGroup: FormGroup, formArray: FormArray, index: number) {
    let formValue = formGroup.value;
    if (!formValue.sourceCurrencyId && !formValue.exchangeRate) {
      if (index > 0) {
        formArray.removeAt(index);
      }
    }
  }
  /**
  ** triggers events for child components
  ** @param event as object with type,prevValue & currentValue fields
  **/
  setEventType(event: any) {
    this.triggerService.setEvent(event);
  }

  /*method to update form status in managebid shared data*/
  updateFormStatus() {
    this.manageBidData.currentTabDataChangeFlag = true;
    if (this.buisnessTermsForm.valid) {
      this.manageBidData.validFormFlag = true;
      if (this.businessTermDetails.currency) {
        this.buisnessTermsForm.controls['currency'].enable();
      }
      this.manageBidData.bidFormsUnsavedData['businessTerms'] = this.buisnessTermsForm.value;
      if (this.businessTermDetails.currency) {
        this.buisnessTermsForm.controls['currency'].disable();
      }
    } else {
      this.manageBidData.validFormFlag = false;
    }
  }

  /*method to set business terms tab details*/
  setBusinessTermsDetails() {
    // tslint:disable-next-line:max-line-length
    this.businessTermDetails = this.manageBidData.bidFormsData['businessTerms'] ? this.manageBidData.bidFormsData['businessTerms'] : ManageBusinessTermData.getFormDetails(this.manageBidData.bidData['businessTerms']);
    if (this.businessTermDetails) {
      this.setFormValues(this.businessTermDetails);
    }
  }
  /* method to display filtered currency as per selection*/
  getFilteredCurrencies() {
    const formValue = this.buisnessTermsForm.value;
    const selectedCurrencyIds = _.map(formValue.exchangeRate, 'sourceCurrencyId');
    const currencies = JSON.parse(JSON.stringify(this.manageBidData.filteredCurrencies));
    let filteredCurrencyIds = [];
    if (selectedCurrencyIds.length > 0) {
      currencies.forEach((obj, index) => {
        if (!selectedCurrencyIds.includes(obj.id)) {
          obj['text'] = obj.text;
          filteredCurrencyIds.push(obj);
        }
      });
    }
    else {
      filteredCurrencyIds = Common.getMultipleSelectArr(JSON.parse(JSON.stringify(currencies)), ['id'], ['code']);
    }
    return filteredCurrencyIds;
  }

  /* method called on source currency change to remove selected currency from all other dropdowns*/
  sourceCurrencyChanged() {
    const exchangeRateArr = <FormArray>this.buisnessTermsForm.get('exchangeRate');
    const formValue = this.buisnessTermsForm.value;
    let selectedCurrencyIds = _.map(formValue.exchangeRate, 'sourceCurrencyId');
    selectedCurrencyIds = _.reject(selectedCurrencyIds, function (element) { return element === ' '; })
    const unSelectedCurrencies = _.filter(this.manageBidData.filteredCurrencies, function (obj) {
      return !selectedCurrencyIds.includes(obj.id);
    });
    for (let index = 0; index < exchangeRateArr.length; index++) {
      const formGroup = <FormGroup>exchangeRateArr.controls[index];
      let currencies = [];
      const alreadySelectedCurrency = _.find(this.manageBidData.filteredCurrencies, { 'id': formGroup.value.sourceCurrencyId });;
      if (alreadySelectedCurrency) {
        currencies.push(alreadySelectedCurrency);
      }
      currencies = _.union(currencies, unSelectedCurrencies);
      formGroup.controls['currencies'].setValue(currencies);
    }
  }

  /*method to scroll to invalid form control if validation fails*/
  scrollToInvalidControl() {
    let target;
    for (const i in this.buisnessTermsForm.controls) {
      if (!this.buisnessTermsForm.controls[i].valid) {
        target = this.buisnessTermsForm.controls[i];
        break;
      }
    }
    if (target) {
      this.manageBidData.spinnerFlag = false;
      const el = $('.ng-invalid:not(form):first');
      $('html,body').animate({ scrollTop: (el.offset().top - 100) }, 'slow', () => {
        el.focus();
      });
    }
  }
  /**
  ** Navigate to specified url
  ** @param url as string 
  **/
  navigateTo(url) {
    this.router.navigate([Common.sprintf(url, [2])]);
  }
  /**
  ** Checks entered value is integer or not for markup insurance & exchange rate formgroups
   ** @param formGroup as FormGroup  to get form value
  ** @param formControlName as string 
  **/
  checkIntegerValue(formGroup: FormGroup, formControlName: string) {
    if (isNaN(formGroup.value[formControlName])) {
      const obj = { [formControlName]: 0 };
      formGroup.patchValue(obj);
    } else if ((formControlName != 'exchangeRate') && formGroup.value[formControlName] > 100) {
      const obj = { [formControlName]: 100 };
      formGroup.patchValue(obj);
    }
  }
  /**
  ** Checks entered value is integer or not for all controls except markup insurance & exchange rate formgroup
  ** @param formControlName as string 
  **/
  updateNumeriValues(formControlName) {
    const formvalue = this.buisnessTermsForm.value;
    const tempObj = {};
    if (isNaN(formvalue[formControlName])) {
      tempObj[formControlName] = 0;
    } else if (((formControlName != 'erAdjustment') && (formControlName != 'baseRateAdjustment')) && formvalue[formControlName] > 100) {
      tempObj[formControlName] = 100;
    }
    this.buisnessTermsForm.patchValue(tempObj);
  }


}
