/** 1.Import third party components
2. Import created modules
3. Import crated services
4. Import created classes
5. Import created constants **/
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Common, NavigationService, TriggerService, CustomValidators } from '@app/common';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormArray, ValidatorFn } from '@angular/forms';
import { ProductionParameters } from './production-parameters';
import { SharedData } from '@app/shared/shared.data';
import { UI_ACCESS_PERMISSION_CONST, EVENT_TYPES, DEFAULT_MASTER_CONFIG_CURRENCY, ACTION_TYPES } from '@app/config';
import { ManageProductionParametersData } from './production-parameters.data.model';
import { ManageBidData } from '../manage-bid.data';
import { TAB_NAME_KEYS, STATUS_CODES, TAB_CONST, MILEAGE_CONST, PERMIT_TYPES_CONST, BIDDING_ROUTER_LINKS_FULL_PATH } from '../../Constants';
const swal = require('sweetalert');
declare var $: any;

@Component({
  selector: 'app-production-parameters',
  templateUrl: './production-parameters.component.html',
  styleUrls: ['./production-parameters.component.scss']
})
export class ProductionParametersComponent implements OnInit, OnDestroy {
  /*declare variables above constructor in sequence -imported constants,public variable,private variables*/
  UI_ACCESS_PERMISSION_CONST = UI_ACCESS_PERMISSION_CONST;
  DEFAULT_MASTER_CONFIG_CURRENCY = DEFAULT_MASTER_CONFIG_CURRENCY;
  uiAccessPermissionsObj: any;
  MODULE_ID: string;
  productionParametersForm: FormGroup;
  commonLabels: any = {};
  ACTION_TYPES = ACTION_TYPES;
  projectId: string;
  submmitedFormFlag: boolean = false;
  disableButtonFlag: boolean = false;
  spinnerFlag: boolean = false;
  productionParametersDetails: any = {};
  FORM_GROUP_CONST = {
    "cityPermits": 1,
    "commonWithDays": 2,
    "commonWithoutDays": 3,
    "commonWithoutName": 4
  }
  currencies: any[] = [];
  LOCALIZED_MILEAGE_CONST: { id: number; text: string; }[];
  LOCALIZED_PERMIT_TYPES_CONST: { id: number; text: string; }[];
  mileageUnitArr: any = Common.keyValueDropdownArr(MILEAGE_CONST, 'text', 'id');
  mileageUnit = [this.mileageUnitArr.kms];
  subscription: Subscription;
  biddingsLabelsObj: any = {};
  permissionObject: any;
  /*declare variables above constructor in sequence -imported constants,public variable,private variables*/

  /*inicialize constructor after declaration of all variables*/
  constructor(
    private productionParameters: ProductionParameters,
    private sharedData: SharedData,
    private navigationService: NavigationService,
    private translateService: TranslateService,
    public manageBidData: ManageBidData,
    private triggerService: TriggerService,
    private route: ActivatedRoute) { }
  /*inicialize constructor after declaration of all variables*/

  /*all life cycle events whichever required after inicialization of constructor*/
  ngOnInit() {
    Common.scrollTOTop();
    this.manageBidData.initialize(TAB_CONST.productionParameters, TAB_NAME_KEYS.productionParameters, 'production-parameters-tab');
    this.manageBidData.disableTabs.productionParameters = false;
    this.manageBidData.disableTabs.talent = false;
    this.manageBidData.disableTabs.editingAndPost = false;
    this.manageBidData.disableTabs.aicp = false;
    this.setLocaleObj();
    this.setPermissionsDetails();
    this.setLocalizedDropdownValues()
    this.productionParametersForm = this.productionParameters.createProductionParametersForm();
    this.subscription = this.triggerService.getEvent().subscribe((data) => {
      if (data.event) {
        if (data.event.type == EVENT_TYPES.bidDetailsEvent) {
          const currentValue = data.event.currentValue;
          if (currentValue) {
            if (this.manageBidData.disableProjectInputs) {
              this.manageBidData.navigateToPassesTab();
            } else {
              this.setCurrencies();
              this.setProductionParametersDetails();
            }
          }
        }

      }
    });
    this.setCurrencies();
    this.setProductionParametersDetails();

  }

  ngOnDestroy() {
    this.manageBidData.currentTabDataChangeFlag = false;
    this.manageBidData.validFormFlag = false;
    this.subscription.unsubscribe();
    this.triggerService.clearEvent();
  }

  /**
* Submits on enter key
* @param event as enter key event
*/
  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      event.preventDefault();
      if (!this.manageBidData.spinnerFlag) {
        this.openAICPReflectionIntimationPopup();
      }
    }
  }
  /*all life cycle events whichever required after inicialization of constructor*/

  /*user defined functions/methods after life cycle events in sequence-public methods,private methods*/
  /*method to set common labels from language jsons*/
  setLocaleObj() {
    this.translateService.get('biddings').subscribe(res => {
      this.biddingsLabelsObj = res;
    });
  }
  /*method to set localized  values to dropdowns*/
  setLocalizedDropdownValues() {
    this.LOCALIZED_PERMIT_TYPES_CONST = Common.changeDropDownValues(this.translateService, PERMIT_TYPES_CONST);
    this.LOCALIZED_MILEAGE_CONST = Common.changeDropDownValues(this.translateService, MILEAGE_CONST);
  }
  /*method to set currencies*/
  setCurrencies() {
    this.currencies = this.manageBidData.exchangeCurrencyDropdownArr;

    // this._manageBidService.getCurrencies().subscribe((response: any) => {
    //   if (Common.checkStatusCodeInRange(response.header.statusCode)) {
    //     if (response.payload && response.payload.results) {
    //       const currencies = response.payload.results;
    //       this.currencies = Common.getMultipleSelectArr(currencies, ['id'], ['code']);
    //     } else {
    //       this.currencies = [];
    //     }
    //   } else {
    //     this.currencies = [];
    //   }
    // }, error => {
    //   this.currencies = [];
    // });
  }
  /**
 **  method to get particuler form group controls
 ** @param formGroupName as string 
 ** @param formControlName as string 
 **/
  getFormGroupControls(formGroupName: string, formControlName: string) {
    const formGroup = this.productionParametersForm.get(formGroupName) as FormGroup;
    return formGroup.controls[formControlName];
  }
  /*method to set role permissions for current module*/
  setPermissionsDetails() {
    this.permissionObject = this.sharedData.getRolePermissionData();
    this.MODULE_ID = this.route.snapshot.parent.data['moduleID'];
    const modulePermissionObj = this.permissionObject[this.MODULE_ID];
    if (modulePermissionObj.uiAccess) {
      this.uiAccessPermissionsObj = modulePermissionObj.uiAccess;
    }
  }

  /*method to set production parameters details*/
  setProductionParametersDetails() {
    this.productionParametersDetails = (this.manageBidData.bidFormsData &&
      this.manageBidData.bidFormsData.productionParameters) ? this.manageBidData.bidFormsData.productionParameters : ManageProductionParametersData.getFormDetails(this.manageBidData.bidData.productionParameters, this.manageBidData.defaultCurrencyId);
    if (this.productionParametersDetails) {
      this.createFormArrayControlsAndSetFormValues(this.productionParametersDetails);
    }
  }
  /**
  **  method to create & set production parameters form values
  ** @param productionParametersDetails as production parameters details object
  **/
  createFormArrayControlsAndSetFormValues(productionParametersDetails) {
    if (productionParametersDetails.locations) {
      this.createNestedPanelControls('locations', 'interior', productionParametersDetails.locations.interior, this.FORM_GROUP_CONST.commonWithDays);
      this.createNestedPanelControls('locations', 'exterior', productionParametersDetails.locations.exterior, this.FORM_GROUP_CONST.commonWithDays);
      this.createNestedPanelControls('locations', 'special', productionParametersDetails.locations.special, this.FORM_GROUP_CONST.commonWithDays);
      this.createNestedPanelControls('locations', 'cityPermits', productionParametersDetails.locations.cityPermits, this.FORM_GROUP_CONST.cityPermits);
    }
    this.createMainPanelControls('pictureVehicles', productionParametersDetails.pictureVehicles, this.FORM_GROUP_CONST.commonWithDays);
    this.createMainPanelControls('carCareAndTransport', productionParametersDetails.carCareAndTransport, this.FORM_GROUP_CONST.commonWithDays);
    this.createMainPanelControls('specialEffects', productionParametersDetails.specialEffects, this.FORM_GROUP_CONST.commonWithoutDays);
    this.createMainPanelControls('animals', productionParametersDetails.animals, this.FORM_GROUP_CONST.commonWithDays);
    this.createMainPanelControls('other1', productionParametersDetails.other1, this.FORM_GROUP_CONST.commonWithDays);
    this.createMainPanelControls('other2', productionParametersDetails.other2, this.FORM_GROUP_CONST.commonWithDays);
    if (productionParametersDetails.artDepartment) {
      this.createNestedPanelControls('artDepartment', 'setConstruction', productionParametersDetails.artDepartment.setConstruction, this.FORM_GROUP_CONST.commonWithoutDays);
      // this.createNestedPanelControls('artDepartment', 'setDressing', productionParametersDetails.artDepartment.setDressing, this.FORM_GROUP_CONST.commonWithoutDays);
      this.createNestedPanelControls('artDepartment', 'streetSingingOthers', productionParametersDetails.artDepartment.streetSingingOthers, this.FORM_GROUP_CONST.commonWithoutName);
      this.createNestedPanelControls('artDepartment', 'greens', productionParametersDetails.artDepartment.greens, this.FORM_GROUP_CONST.commonWithoutName);
      this.createNestedPanelControls('artDepartment', 'specialManufactures', productionParametersDetails.artDepartment.specialManufactures, this.FORM_GROUP_CONST.commonWithoutName);
      this.createNestedPanelControls('artDepartment', 'others', productionParametersDetails.artDepartment.others, this.FORM_GROUP_CONST.commonWithoutDays);
    }
    this.productionParametersForm.setValue(productionParametersDetails);
    this.manageBidData.validFormFlag = this.productionParametersForm.valid ? true : false;
    // this.updateFormStatus();
  }

  /**
  **  method to add  formgroup for locations,art department panels
  ** @param formGroupName as string for getting parent form group
  ** @param formArrayName as string for adding formgroups in formarray
  ** @param dataArray as array for creating formarray as per data
  ** @param formGroupConst as number for which formgroup to be added
  ** add class on which user has clicked as active
  **/
  createNestedPanelControls(formGroupName: string, formArrayName: string, dataArray, formGroupConst: Number) {
    let formGroup: FormGroup = <FormGroup>this.productionParametersForm.controls[formGroupName];
    if (dataArray && dataArray.length > 0) {
      let formArray: FormArray = <FormArray>formGroup.controls[formArrayName];
      formArray.controls = [];
      for (let index = 0; index < dataArray.length; index++) {
        this.addFormGroup(formArray, formGroupConst);
      }
    }
  }
  /**
  **  method to add  formgroup for panels-Picture vehicles,animal,carCareAndTransport,animals,other1 & other2
  ** @param formArrayName as string for adding formgroups in formarray
  ** @param dataArray as array for creating formarray as per data
  ** @param formGroupConst as number for which formgroup to be added
  ** add class on which user has clicked as active
  **/
  createMainPanelControls(formArrayName: string, dataArray, formGroupConst: Number) {
    let formArray: FormArray = <FormArray>this.productionParametersForm.controls[formArrayName];
    if (dataArray && dataArray.length > 0) {
      formArray.controls = [];
      for (let index = 0; index < dataArray.length; index++) {
        this.addFormGroup(formArray, formGroupConst);
      }
    }
  }
  /*method to update form status in managebid shared data*/
  updateFormStatus() {
    this.manageBidData.currentTabDataChangeFlag = true;
    if (this.productionParametersForm.valid) {
      this.manageBidData.validFormFlag = true;
      this.manageBidData.bidFormsUnsavedData['productionParameters'] = this.productionParametersForm.value;
    } else {
      this.manageBidData.validFormFlag = false;
    }
  }
  /**
  **  method to add  formgroup as per formGroupConst
  ** @param formArray as FormArray for adding formgroups into it
  ** @param formGroupConst as number for which form group to added
  **/
  addFormGroup(formArray: FormArray, formGroupConst: Number, checkValidation: boolean = false, formGroup: any = {}) {
    switch (formGroupConst) {
      case this.FORM_GROUP_CONST.cityPermits: {
        if (checkValidation) {
          this.setCityPermitsValidators(formGroup);
          if (formGroup.valid) {
            formArray.push(this.productionParameters.createCityPermitFormGroup());
          }
          formGroup.controls['invalidFlag'].setValue(formGroup.status);
        } else {
          formArray.push(this.productionParameters.createCityPermitFormGroup());
        }

        break;
      }
      case this.FORM_GROUP_CONST.commonWithDays:
        if (checkValidation) {
          this.setValidatorsToPanelWithDays(formGroup);
          if (formGroup.valid) {
            formArray.push(this.productionParameters.createCommonFormGroupWithDays());
          }
          formGroup.controls['invalidFlag'].setValue(formGroup.status);
        } else {
          formArray.push(this.productionParameters.createCommonFormGroupWithDays());
        }
        break;
      case this.FORM_GROUP_CONST.commonWithoutDays:
        if (checkValidation) {
          this.setValidatorsToPanelWithoutDays(formGroup);
          if (formGroup.valid) {
            formArray.push(this.productionParameters.createCommonFormGroupWithoutDays());
          }
          formGroup.controls['invalidFlag'].setValue(formGroup.status);
        } else {
          formArray.push(this.productionParameters.createCommonFormGroupWithoutDays());
        }
        break;
      case this.FORM_GROUP_CONST.commonWithoutName:
        formArray.push(this.productionParameters.createCommonFormGroupWithoutName());
        break
    }
  }
  /**
  **  method to set  validators  to all controls of  city permits formgroup
  ** @param formGroup as FormGroup
  **/
  setCityPermitsValidators(formGroup: FormGroup) {
    this.setValidatorsAndUpdateValue(formGroup, 'permitType', [CustomValidators.required]);
    this.setValidatorsAndUpdateValue(formGroup, 'name', [CustomValidators.required]);
    this.setValidatorsAndUpdateValue(formGroup, 'days', [CustomValidators.required, CustomValidators.checkDecimal]);
    this.setValidatorsAndUpdateValue(formGroup, 'category', [CustomValidators.required]);

  }
  /**
  **  method to set  validators  to all controls of formgroup with days as formcontrol
  ** @param formGroup as FormGroup
  **/
  setValidatorsToPanelWithDays(formGroup) {
    this.setValidatorsAndUpdateValue(formGroup, 'name', [CustomValidators.required]);
    this.setValidatorsAndUpdateValue(formGroup, 'days', [CustomValidators.required, CustomValidators.checkDecimal]);
    this.setValidatorsAndUpdateValue(formGroup, 'costPerDay', [CustomValidators.required, CustomValidators.checkDecimal]);
    this.setValidatorsAndUpdateValue(formGroup, 'currencyId', [CustomValidators.required]);

  }
  /**
 **  method to set  validators  to all controls of formgroup without days field
 ** @param formGroup as FormGroup
 **/
  setValidatorsToPanelWithoutDays(formGroup) {
    this.setValidatorsAndUpdateValue(formGroup, 'name', [CustomValidators.required]);
    this.setValidatorsAndUpdateValue(formGroup, 'costPerDay', [CustomValidators.required, CustomValidators.checkDecimal]);
    this.setValidatorsAndUpdateValue(formGroup, 'currencyId', [CustomValidators.required]);

  }
  /**
  **  method to set & remove validators  of city permits formgroup on change event
  ** @param formGroupConst as number 
  **@param formGroupConst as FormGroup 
  **/
  cityPermitsControlsChanged(formGroupConst: number, formGroup: FormGroup) {
    let formValue = formGroup.value;
    if (!formValue.permitType && !formValue.name && !formValue.category && !formValue.days) {
      this.removeValidators(formGroupConst, formGroup);
    } else {
      this.setCityPermitsValidators(formGroup);
      if (formGroup.controls['permitType'].touched && formGroup.controls['name'].touched && formGroup.controls['days'].touched && formGroup.controls['category'].touched) {
        formGroup.controls['invalidFlag'].setValue(true);
        this.manageBidData.invalidFlag = false;
      }
    }
  }
  /**
  **  method to set & remove validators  of  formgroup with days field on change event
  ** @param formGroupConst as number 
  **@param formGroupConst as FormGroup 
  **/
  panelWithDaysControlsChanged(formGroupConst: number, formGroup: FormGroup) {
    let formValue = formGroup.value;
    if (!formValue.name && !formValue.days && !formValue.costPerDay) {
      this.removeValidators(formGroupConst, formGroup);
    } else {
      this.setValidatorsToPanelWithDays(formGroup);
      if (formGroup.controls['name'].touched && formGroup.controls['days'].touched && formGroup.controls['costPerDay'].touched) {
        formGroup.controls['invalidFlag'].setValue(true);
        this.manageBidData.invalidFlag = false;
      }
    }
  }
  /**
  **  method to set & remove validators  of  formgroup without days field on change event
  ** @param formGroupConst as number 
  **@param formGroupConst as FormGroup 
  **/
  panelWithoutDaysControlsChanged(formGroupConst: number, formGroup: FormGroup) {
    let formValue = formGroup.value;
    if (!formValue.name && !formValue.costPerDay) {
      this.removeValidators(formGroupConst, formGroup);
    } else {
      this.setValidatorsToPanelWithoutDays(formGroup);
      if (formGroup.controls['name'].touched && formGroup.controls['costPerDay'].touched) {
        formGroup.controls['invalidFlag'].setValue(true);
        this.manageBidData.invalidFlag = false;
      }
    }

  }
  /**
  **  method to set validators to specified form control
  ** @param formGroup as FormGroup 
  **@param formControlName as strring  
  **@param validators as validator functions array;
  **/
  setValidatorsAndUpdateValue(formGroup: FormGroup, formControlName: string, validators: ValidatorFn[]) {
    formGroup.controls[formControlName].setValidators(validators);
    if (validators.length == 0) {
      formGroup.controls[formControlName].setErrors(null);
    }
    formGroup.controls[formControlName].updateValueAndValidity();
  }
  /**
  **  method to remove  formgroup at particular index
  ** @param formArray as FormArray for adding formgroups into it
  ** @param index as number for removing formgroup at particular index
  **/
  removeFormGroup(formArray: FormArray, index: number) {
    formArray.removeAt(index);
    this.updateFormStatus();
  }
  /**
 ** Opens AICP reflection intimation popup if form is valid & next tab is not disabled
 **/
  openAICPReflectionIntimationPopup() {
    if (!this.manageBidData.disableTabs.talent && this.manageBidData.AICPGeneratedStatus) {
      this.checkAndRemoveValidators();
      if (this.productionParametersForm.valid) {
        let aicpButtonLabel = (this.manageBidData.latestPassDetails && this.manageBidData.latestPassDetails.status === STATUS_CODES.PUBLISH) ? this.biddingsLabelsObj.buttons.generateAICP : this.biddingsLabelsObj.labels.updateAICP;

        var swalObj = Common.swalConfirmPopupObj(this.biddingsLabelsObj.labels.ppAICPRelectionMsg, true, true, aicpButtonLabel, this.biddingsLabelsObj.labels.cancelDelete);
        swal(swalObj, (isConfirm) => {
          if (isConfirm) {
            this.triggerEventToSaveData(true);
          }
        });
      } else {
        this.scrollToInvalidControl();
      }
    } else {
      this.saveProductionParametersData();
    }
  }
  /*method to save production parameters data*/
  saveProductionParametersData() {
    this.checkAndRemoveValidators();
    if (this.productionParametersForm.valid) {
      this.triggerEventToSaveData()
    } else {
      this.scrollToInvalidControl();
    }
  }
  /**
  ** Triggers event for parent component to save basic info tab data
  ** @param generateAICPFlag of type boolean 
  **/
  triggerEventToSaveData(generateAICPFlag: Boolean = false) {
    this.manageBidData.disableButtonFlag = true;
    this.manageBidData.spinnerFlag = true;
    let formvalue = this.productionParametersForm.value;
    this.manageBidData.bidFormsData.productionParameters = formvalue;
    this.setEventType({ type: EVENT_TYPES.updateBidEvent, prevValue: {}, currentValue: { 'tabId': TAB_CONST.productionParameters, 'navigationUrl': BIDDING_ROUTER_LINKS_FULL_PATH['biddingTalent'], 'generateAICP': generateAICPFlag } });

  }
  /*method to scroll to invalid form control if validation fails*/
  scrollToInvalidControl() {
    let target;
    for (var i in this.productionParametersForm.controls) {
      if (!this.productionParametersForm.controls[i].valid) {
        target = this.productionParametersForm.controls[i];
        break;
      }
    }
    if (target) {
      this.manageBidData.spinnerFlag = false;
      let el = $('.ng-invalid:not(form):first');
      $('html,body').animate({ scrollTop: (el.offset().top - 100) }, 'slow', () => {
        el.focus();
      });
    }
  }
  /**
  **  method to trigger event
  ** @param event as object with type,currentValue & prevValue fields
  **/
  setEventType(event: any) {
    this.triggerService.setEvent(event);
  }
  /**method to check & remove validators of all nested & main panels */
  checkAndRemoveValidators() {
    this.checkAndRemoveNestedPanelValidators('locations', 'interior', this.FORM_GROUP_CONST.commonWithDays);
    this.checkAndRemoveNestedPanelValidators('locations', 'exterior', this.FORM_GROUP_CONST.commonWithDays);
    this.checkAndRemoveNestedPanelValidators('locations', 'special', this.FORM_GROUP_CONST.commonWithDays);
    this.checkAndRemoveNestedPanelValidators('locations', 'cityPermits', this.FORM_GROUP_CONST.cityPermits);
    this.checkAndRemoveNestedPanelValidators('artDepartment', 'setConstruction', this.FORM_GROUP_CONST.commonWithoutDays);
    this.checkAndRemoveNestedPanelValidators('artDepartment', 'others', this.FORM_GROUP_CONST.commonWithoutDays);
    this.checkAndRemoveMainPanelValidators('pictureVehicles', this.FORM_GROUP_CONST.commonWithDays);
    this.checkAndRemoveMainPanelValidators('carCareAndTransport', this.FORM_GROUP_CONST.commonWithDays);
    this.checkAndRemoveMainPanelValidators('specialEffects', this.FORM_GROUP_CONST.commonWithoutDays);
    this.checkAndRemoveMainPanelValidators('animals', this.FORM_GROUP_CONST.commonWithDays);
    this.checkAndRemoveMainPanelValidators('other1', this.FORM_GROUP_CONST.commonWithDays);
    this.checkAndRemoveMainPanelValidators('other2', this.FORM_GROUP_CONST.commonWithDays);
  }
  /**
 **  method to check & remove nested panel(interior,exterior,special,city permits,set construction,others) validators
 ** @param formGroupName as string for gedtting form group name
 ** @param formArrayName as string  for gedtting form array name
 ** @param formGroupConst as number 
 **/
  checkAndRemoveNestedPanelValidators(formGroupName: string, formArrayName: string, formGroupConst: number) {
    let parentFormGroup: FormGroup = <FormGroup>this.productionParametersForm.controls[formGroupName];
    let formArray: FormArray = <FormArray>parentFormGroup.controls[formArrayName];
    let formGroup: FormGroup = <FormGroup>formArray.controls[formArray.length - 1];
    this.checkFormGroupControlsValue(formGroupConst, formGroup, formArray, formArray.length - 1);
  }
  /**
 **  method method to check & remove main panel(picture vehicles,car care & transport,special effects,animals.others1 & others2) validators
 ** @param formArrayName as string  for gedtting form array name
 ** @param formGroupConst as number 
 **/
  checkAndRemoveMainPanelValidators(formArrayName: string, formGroupConst: number) {
    let formArray: FormArray = <FormArray>this.productionParametersForm.controls[formArrayName];
    let formGroup: FormGroup = <FormGroup>formArray.controls[formArray.length - 1];
    this.checkFormGroupControlsValue(formGroupConst, formGroup, formArray, formArray.length - 1);
  }
  /**
 **  method method to check each form control's value to remove either Formgroup or Validator if Formgroup is Invalid
 ** @param formGroup as FormGroup
 ** @param formGroupConst as number 
 ** @param formArray as FormArray 
 ** @param index as number for removing particular form group
 **/
  checkFormGroupControlsValue(formGroupConst: number, formGroup: FormGroup, formArray: FormArray, index: number) {
    let formValue = formGroup.value;
    switch (formGroupConst) {
      case this.FORM_GROUP_CONST.cityPermits: {
        this
        if (!formValue.permitType && !formValue.name && !formValue.days && !formValue.costPerDay) {
          this.removeEitherFormgroupOrValidatorIfInvalid(formGroupConst, formGroup, formArray, index);
        } else {
          formGroup.controls['invalidFlag'].setValue(true);
        }
        break
      }
      case this.FORM_GROUP_CONST.commonWithDays: {
        if (!formValue.name && !formValue.days && !formValue.costPerDay) {
          this.removeEitherFormgroupOrValidatorIfInvalid(formGroupConst, formGroup, formArray, index);
        } else {
          formGroup.controls['invalidFlag'].setValue(true);
        }
        break
      }
      case this.FORM_GROUP_CONST.commonWithoutDays: {
        if (!formValue.name && !formValue.costPerDay) {
          this.removeEitherFormgroupOrValidatorIfInvalid(formGroupConst, formGroup, formArray, index);
        } else {
          formGroup.controls['invalidFlag'].setValue(true);
        }
        break
      }
    }
  }
  /**
  **  method method to remove either Formgroup or Validator if Formgroup is Invalid
  ** @param formGroup as FormGroup
  ** @param formGroupConst as number 
  ** @param formArray as FormArray 
  ** @param index as number for removing particular form group
  **/
  removeEitherFormgroupOrValidatorIfInvalid(formGroupConst: number, formGroup: FormGroup, formArray: FormArray, index: number) {
    if (index > 0) {
      formArray.removeAt(index);
    } else {
      this.removeValidators(formGroupConst, formGroup);
    }
  }
  /**
  **  method to remove Validators of specified formgroup
  ** @param formGroupConst as number 
  ** @param formGroup as FormGroup 
  **/
  removeValidators(formGroupConst: number, formGroup: FormGroup) {
    switch (formGroupConst) {
      case this.FORM_GROUP_CONST.cityPermits: {
        this.setValidatorsAndUpdateValue(formGroup, 'permitType', []);
        this.setValidatorsAndUpdateValue(formGroup, 'name', []);
        this.setValidatorsAndUpdateValue(formGroup, 'days', []);
        this.setValidatorsAndUpdateValue(formGroup, 'category', []);
        break;
      }
      case this.FORM_GROUP_CONST.commonWithDays:
        this.setValidatorsAndUpdateValue(formGroup, 'name', []);
        this.setValidatorsAndUpdateValue(formGroup, 'days', []);
        this.setValidatorsAndUpdateValue(formGroup, 'costPerDay', []);
        this.setValidatorsAndUpdateValue(formGroup, 'currencyId', []);
        break;
      case this.FORM_GROUP_CONST.commonWithoutDays:
        this.setValidatorsAndUpdateValue(formGroup, 'name', []);
        this.setValidatorsAndUpdateValue(formGroup, 'costPerDay', []);
        this.setValidatorsAndUpdateValue(formGroup, 'currencyId', []);
        break;
    }
    formGroup.controls['invalidFlag'].setValue(false);
  }
  /**
  **  method to check entered value is integer or not
  ** @param formGroup as FormGroup 
  ** @param formControlName as string 
  **/
  checkIntegerValue(formGroup: FormGroup, formControlName: string) {
    if (isNaN(formGroup.value[formControlName])) {
      formGroup.controls[formControlName].setValue(0);
    }

  }
  /**
   * method to navigate to particular page
  ** @param url as string for getting navigation url
  */
  navigateTo(url) {
    this.navigationService.navigate([Common.sprintf(url, [this.projectId])]);
  }
}
