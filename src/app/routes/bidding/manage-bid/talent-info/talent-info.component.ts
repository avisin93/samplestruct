/** 1.Import third party components
2. Import created modules
3. Import crated services
4. Import created classes
5. Import created constants **/
import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { TalentData } from './talent-info.data.model';
import { SharedData } from '@app/shared/shared.data';
import { TalentInfo } from './talent-info';
import { ManageBidData } from '../manage-bid.data';
import { Subscription } from 'rxjs/Subscription';
import { CustomValidators, TriggerService, Common } from '@app/common';
import { TAB_NAME_KEYS, STATUS_CODES, TAB_CONST, BIDDING_ROUTER_LINKS_FULL_PATH } from '../../Constants';
import { EVENT_TYPES, CURRENCY_CONSTANTS, ACTION_TYPES } from '@app/config';
const swal = require('sweetalert');
declare var $: any;

@Component({
  selector: 'app-talent-info',
  templateUrl: './talent-info.component.html',
  styleUrls: ['./talent-info.component.scss']
})
export class TalentInfoComponent implements OnInit {
  /*declare variables above constructor in sequence -imported constants,public variable,private variables*/
  biddingsLabelsObj: any = {};
  addSecondariesFlag: boolean;
  addPrincipalFlag: boolean;
  addCrowdsFlag: boolean;
  addSpecialExtrasFlag: boolean;
  ACTION_TYPES = ACTION_TYPES;
  addGenericExtrasFlag: boolean;
  addFeaturedExtrasFlag: boolean;
  manageTalentForm: FormGroup;

  FORM_GROUP_ARR_TYPE = {
    'formArrWithCost': 'formArrWithCost',
    'formArrWithQuantity': 'formArrWithQuantity',
  }

  FORM_ARRAY_CONST_1 = [
    'principals',
    'secondries'
  ];
  FORM_ARRAY_CONST_2 = [
    'featuredExtras',
    'crowds',
    'genericExtras',
    'specialExtras'
  ];
  FORM_GROUP_CONST_1 = [
    'principalsForm',
    'secondriesForm'
  ];
  FORM_GROUP_CONST_2 = [
    'featuredExtrasForm',
    'crowdsForm',
    'genericExtrasForm',
    'specialExtrasForm'
  ];

  FORM_CONST = {
    'principalsForm': 1,
    'secondaries': 2,
    'featuredExtra': 3,
    'genericExtra': 4,
    'specialExtra': 5,
    'crowds': 6
  };
  formArrayFlags = {
    principals: true,
    secondries: true,
    featuredExtras: true,
    crowds: true,
    genericExtras: true,
    specialExtras: true
  };
  arrayRecordEmptyFlag = {
    principals: false,
    secondries: false,
    featuredExtras: false,
    crowds: false,
    genericExtras: false,
    specialExtras: false
  };

  validContactPersonDetails: boolean;
  bidId: any;
  talentDetails: any;
  userInfo: any;
  spinnerFlag: boolean;
  isClicked: boolean;
  commonJsonTextMessages: any;
  confirmationessMsg: any;
  warningMsg: any;
  saveMsg: any;
  cancelMsg: any;
  errMsg: any;
  MODULE_ID: string;
  uiAccessPermissionsObj: any;
  currencies: any[];
  formSubmittedFlag: boolean;
  subscription: Subscription;
  CURRENCY_CONSTANTS = CURRENCY_CONSTANTS;
  permissionObject: any;
  /*declare variables above constructor in sequence -imported constants,public variable,private variables*/

  /*inicialize constructor after declaration of all variables*/
  constructor(private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private sharedData: SharedData,
    private translateService: TranslateService,
    private triggerService: TriggerService,
    public manageBidData: ManageBidData,
    private talentInfo: TalentInfo) { }
  /*inicialize constructor after declaration of all variables*/

  /*all life cycle events whichever required after inicialization of constructor*/
  ngOnInit() {
    Common.scrollTOTop();
    this.manageBidData.initialize(TAB_CONST.talent, TAB_NAME_KEYS.talent, 'talent-tab');
    this.manageBidData.disableTabs.talent = false;
    this.manageTalentForm = this.talentInfo.createTalentFormGroup();
    this.setLocaleObj();
    this.setPermissionsDetails();
    this.userInfo = this.sharedData.getUsersInfo();
    this.subscription = this.triggerService.getEvent().subscribe((data) => {
      if (data.event) {
        if (data.event.type === EVENT_TYPES.bidDetailsEvent) {
          const currentValue = data.event.currentValue;
          if (currentValue) {
            if (this.manageBidData.disableProjectInputs) {
              this.manageBidData.navigateToPassesTab();
            } else {
              this.setCurrencyDropdownArr();
              this.setDefaultArr();
              this.setTalentDetails();
            }
          }
        }
      }
    });
    this.setCurrencyDropdownArr();
    this.setDefaultArr();
    this.setTalentDetails();
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
  /*method to set biddings labels from language jsons*/
  setLocaleObj() {
    this.translateService.get('biddings').subscribe(res => {
      this.biddingsLabelsObj = res;
    });
  }
  /*method to set talent details*/
  setTalentDetails() {
    this.talentDetails = (this.manageBidData.bidFormsData && this.manageBidData.bidFormsData.talent) ? TalentData.getTalentFormPatchDetails(this.manageBidData.bidFormsData.talent) : TalentData.setTalentDetails(this.manageBidData.bidData['talent']);
    this.manageTalentForm = this.talentInfo.createTalentFormGroup();
    this.setDefaultArr();
    if (this.talentDetails) {
      this.setFormValues(this.talentDetails);
    }
  }


  /**
   * It gets role permission data and gives access to users with respect to it.
   */
  setPermissionsDetails() {
    this.permissionObject = this.sharedData.getRolePermissionData();
    this.MODULE_ID = this.route.snapshot.parent.data['moduleID'];
    const modulePermissionObj = this.permissionObject[this.MODULE_ID];
    if (modulePermissionObj.uiAccess) {
      this.uiAccessPermissionsObj = modulePermissionObj.uiAccess;
    }
  }

  /**
**  method to set validators to specified form control
** @param formGroup as FormGroup 
**@param formControlName as strring  
**@param validators as validator functions array;
**/
  setValidatorsAndUpdateValue(formGroup: FormGroup, controlname: string, validators: any = []) {
    // formGroup.controls[controlname].reset();
    formGroup.controls[controlname].setValidators(validators);
    if (validators.length === 0) {
      formGroup.controls[controlname].setErrors(null);
    }
    formGroup.controls[controlname].updateValueAndValidity();
  }



  /**method to check & remove validators of all nested & main panels */
  checkAndRemoveValidators() {
    this.checkAndRemoveNestedPanelValidators('principalsForm', 'principals', this.FORM_CONST.principalsForm);
    this.checkAndRemoveNestedPanelValidators('secondriesForm', 'secondries', this.FORM_CONST.secondaries);
    this.checkAndRemoveNestedPanelValidators('featuredExtrasForm', 'featuredExtras', this.FORM_CONST.featuredExtra);
    this.checkAndRemoveNestedPanelValidators('genericExtrasForm', 'genericExtras', this.FORM_CONST.genericExtra);
    this.checkAndRemoveNestedPanelValidators('specialExtrasForm', 'specialExtras', this.FORM_CONST.specialExtra);
    this.checkAndRemoveNestedPanelValidators('crowdsForm', 'crowds', this.FORM_CONST.crowds);

  }


  /**
  **  method to check & remove nested panel(interior,exterior,special,city permits,set construction,others) validators
  ** @param formGroupName as string for gedtting form group name
  ** @param formArrayName as string  for gedtting form array name
  ** @param formGroupConst as number 
  **/
  checkAndRemoveNestedPanelValidators(formGroupName: string, formArrayName: string, formGroupConst: number) {
    let parentFormGroup: FormGroup = <FormGroup>this.manageTalentForm.controls[formGroupName];
    let formArray: FormArray = <FormArray>parentFormGroup.controls[formArrayName];
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
      case this.FORM_CONST.principalsForm:

      case this.FORM_CONST.secondaries:
        {
          if (!formValue.name && !formValue.prep && !formValue.shoot && !formValue.costPerDay) {
            this.removeEitherFormgroupOrValidatorIfInvalid(formGroupConst, formGroup, formArray, index);
          } else {
            formGroup.controls['invalidFlag'].setValue(true);
          }
          break;
        }

      case this.FORM_CONST.featuredExtra:

      case this.FORM_CONST.genericExtra:

      case this.FORM_CONST.specialExtra:

      case this.FORM_CONST.crowds:
        {
          if (!formValue.description && !formValue.days && !formValue.quantity) {
            this.removeEitherFormgroupOrValidatorIfInvalid(formGroupConst, formGroup, formArray, index);
          } else {
            formGroup.controls['invalidFlag'].setValue(true);
          }
          break;
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
      case this.FORM_CONST.principalsForm: {
        this.setValidatorsAndUpdateValue(formGroup, 'name', []);
        this.setValidatorsAndUpdateValue(formGroup, 'prep', []);
        this.setValidatorsAndUpdateValue(formGroup, 'shoot', []);
        this.setValidatorsAndUpdateValue(formGroup, 'costPerDay', []);
        break;
      }
      case this.FORM_CONST.secondaries: {
        this.setValidatorsAndUpdateValue(formGroup, 'name', []);
        this.setValidatorsAndUpdateValue(formGroup, 'prep', []);
        this.setValidatorsAndUpdateValue(formGroup, 'shoot', []);
        this.setValidatorsAndUpdateValue(formGroup, 'costPerDay', []);
        break;
      }
      case this.FORM_CONST.featuredExtra: {
        this.setValidatorsAndUpdateValue(formGroup, 'description', []);
        this.setValidatorsAndUpdateValue(formGroup, 'days', []);
        this.setValidatorsAndUpdateValue(formGroup, 'quantity', []);
        break;
      }
      case this.FORM_CONST.genericExtra: {
        this.setValidatorsAndUpdateValue(formGroup, 'description', []);
        this.setValidatorsAndUpdateValue(formGroup, 'days', []);
        this.setValidatorsAndUpdateValue(formGroup, 'quantity', []);
        break;
      }
      case this.FORM_CONST.specialExtra: {
        this.setValidatorsAndUpdateValue(formGroup, 'description', []);
        this.setValidatorsAndUpdateValue(formGroup, 'days', []);
        this.setValidatorsAndUpdateValue(formGroup, 'quantity', []);
        break;
      }
      case this.FORM_CONST.crowds: {
        this.setValidatorsAndUpdateValue(formGroup, 'description', []);
        this.setValidatorsAndUpdateValue(formGroup, 'days', []);
        this.setValidatorsAndUpdateValue(formGroup, 'quantity', []);
        break;
      }
    }
    formGroup.controls['invalidFlag'].setValue(false);
  }


  /**
  **  method to set & remove validators  of principal & secondaries formgroup  on change event
  ** @param formGroupConst as number 
  **@param formGroupConst as FormGroup 
  **/
  updatePrincipalValidations(formGroupConst: number, formGroup: FormGroup) {
    const formValue = formGroup.value;
    if (!formValue.name && !formValue.prep && !formValue.shoot && !formValue.costPerDay) {
      this.removeValidators(formGroupConst, formGroup);
      formGroup.controls['invalidFlag'].setValue(false);
    } else {
      this.setPrincipalSecondariesValidators(formGroup);
      // tslint:disable-next-line:max-line-length
      if (formGroup.controls['name'].touched && (formGroup.controls['prep'].touched || formGroup.controls['shoot'].touched) && formGroup.controls['costPerDay'].touched) {
        formGroup.controls['invalidFlag'].setValue(true);
        this.manageBidData.invalidFlag = false;
      }
    }
  }
  /**
   **  method to set & remove validators  of featuredExtras , genericExtras , specialExtras & crowds formgroups  on change event
   ** @param formGroupConst as number 
   **@param formGroupConst as FormGroup 
   **/
  updateValidations(formGroupConst: number, formGroup: FormGroup) {
    const formValue = formGroup.value;
    if (!formValue.description && !formValue.days && !formValue.quantity) {
      this.removeValidators(formGroupConst, formGroup);
      formGroup.controls['invalidFlag'].setValue(false);
    } else {
      this.setValidators(formGroup);

      if (formGroup.controls['description'].touched && formGroup.controls['days'].touched && formGroup.controls['quantity'].touched) {
        formGroup.controls['invalidFlag'].setValue(true);
        this.manageBidData.invalidFlag = false;
      }
    }
  }
  /**
    **  method to set  validators  to principal & secondaries formgroups 
    ** @param formGroup as FormGroup
    **/
  setPrincipalSecondariesValidators(formGroup) {
    this.setValidatorsAndUpdateValue(formGroup, 'name', [CustomValidators.required]);
    if (!formGroup.value.shoot) {
      this.setValidatorsAndUpdateValue(formGroup, 'prep', [CustomValidators.required, CustomValidators.checkDecimal]);
    } else {
      this.setValidatorsAndUpdateValue(formGroup, 'prep', [CustomValidators.checkDecimal]);

    }
    if (!formGroup.value.prep) {
      this.setValidatorsAndUpdateValue(formGroup, 'shoot', [CustomValidators.required, CustomValidators.checkDecimal]);
    } else {
      this.setValidatorsAndUpdateValue(formGroup, 'shoot', [CustomValidators.checkDecimal]);

    }
    this.setValidatorsAndUpdateValue(formGroup, 'costPerDay', [CustomValidators.required, CustomValidators.checkDecimal]);
  }
  /**
      **  method to set  validators  to featuredExtras , genericExtras , specialExtras & crowds formgroups 
      ** @param formGroup as FormGroup
      **/
  setValidators(formGroup) {
    this.setValidatorsAndUpdateValue(formGroup, 'description', [CustomValidators.required]);
    this.setValidatorsAndUpdateValue(formGroup, 'days', [CustomValidators.required, CustomValidators.checkDecimal]);
    this.setValidatorsAndUpdateValue(formGroup, 'quantity', [CustomValidators.required, CustomValidators.checkDecimal]);
  }
  /**
   ** Opens AICP reflection intimation popup if form is valid & next tab is not disabled
   **/
  openAICPReflectionIntimationPopup() {
    if (!this.manageBidData.disableTabs.editingAndPost && this.manageBidData.AICPGeneratedStatus) {
      this.checkAndRemoveValidators();
      if (this.manageTalentForm.valid) {
        let aicpButtonLabel = (this.manageBidData.latestPassDetails && this.manageBidData.latestPassDetails.status === STATUS_CODES.PUBLISH) ? this.biddingsLabelsObj.buttons.generateAICP : this.biddingsLabelsObj.labels.updateAICP;

        var swalObj = Common.swalConfirmPopupObj(this.biddingsLabelsObj.labels.talentAICPRelectionMsg, true, true, aicpButtonLabel, this.biddingsLabelsObj.labels.cancelDelete);
        swal(swalObj, (isConfirm) => {
          if (isConfirm) {
            this.triggerEventToSaveData(true);
          }
        });
      } else {
        this.scrollToInvalidControl();
      }
    } else {
      this.saveTalentsData();
    }
  }
  /**
   * It checks all the validations in talent form, and if invalid
   * sets the invalidFlag and removes emoty form array entry
   */
  saveTalentsData() {
    this.checkAndRemoveValidators();
    if (this.manageTalentForm.valid) {
      this.triggerEventToSaveData();
    } else {
      this.formSubmittedFlag = true;
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
    this.manageBidData.bidFormsData.talent = this.manageTalentForm.value;
    this.setEventType({
      type: EVENT_TYPES.updateBidEvent, prevValue: {},
      currentValue: { 'tabId': TAB_CONST.talent, 'navigationUrl': BIDDING_ROUTER_LINKS_FULL_PATH['bidEditingAndPost'], 'generateAICP': generateAICPFlag }
    });
  }
  /*method to scroll to invalid form control if validation fails*/
  scrollToInvalidControl() {
    let target;
    for (const i in this.manageTalentForm.controls) {
      if (!this.manageTalentForm.controls[i].valid) {
        target = this.manageTalentForm.controls[i];
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

  /*method to update form status in managebid shared data*/
  updateFormStatus() {
    this.manageBidData.currentTabDataChangeFlag = true;
    if (this.manageTalentForm.valid) {
      this.manageBidData.validFormFlag = true;
      this.manageBidData.bidFormsUnsavedData['talent'] = this.manageTalentForm.value;
    } else {
      this.manageBidData.validFormFlag = false;
    }
  }

  /**
   * It gets curriencies from the server with respect to current bid.
   */
  setCurrencyDropdownArr() {
    this.currencies = this.manageBidData.exchangeCurrencyDropdownArr;
    // this.currencies = this.CURRENCY_CONSTANTS;
  }
  /**
   * It returns controls of formGroup which are used in HTML for validations and error texts purpose.
   * @param formGroupName is name of formGroup
   * @param formArrayName is name of formArray
   */
  getFormGroupControls(formGroupName, formArrayName) {
    const formGroup = this.manageTalentForm.get(formGroupName) as FormGroup;
    const formArray = formGroup.get(formArrayName) as FormArray;
    return formGroup.controls[formArrayName];
  }
  /**
   * It returns controls of formArrays which are used in HTML for validations and error texts purpose.
   * @param formGroupName is name of formGroup
   * @param formArrayName is name of formArray
   */
  getFormArrayControls(formGroupName, formArrayName) {
    const formGroup = this.manageTalentForm.get(formGroupName) as FormGroup;
    const formArray = formGroup.get(formArrayName) as FormArray;
    return formArray.controls;
  }
  /**
   * It returns controls of formArrays which are used in HTML for validations and error texts purpose.
   * @param formGroupName is name of formGroup
   * @param formArrayName is name of formArray
   * @param formParticularGroup is name of FormControl
   * @param index is index in formArray
   */
  getFormArrayIndexControls(formGroupName, formArrayName, formParticularGroup, index: number) {
    const formGroup: FormGroup = this.manageTalentForm.get(formGroupName) as FormGroup;
    const formArray: FormArray = formGroup.get(formArrayName) as FormArray;
    const requiredFormGroup: FormGroup = <FormGroup>formArray.controls[index] as FormGroup;
    const requiredFormGroup1: FormControl = <FormControl>requiredFormGroup.controls[formParticularGroup] as FormControl;
    return requiredFormGroup1;
  }

  /**
   * It returns details of formArray with its controls which are used in HTML.
   * @param formGroupName is name of formGroup
   * @param formArrayName is name of formArray
   */
  getFormArrayDetails(formGroupName, formArrayName) {
    const formGroup = this.manageTalentForm.get(formGroupName) as FormGroup;
    return formGroup.get(formArrayName) as FormArray;
  }
  /**
   * It sets the default formGroup in FormArray on page initialization.
   */
  setDefaultArr() {
    for (let index = 0; index < this.FORM_ARRAY_CONST_1.length; index++) {
      const formObject: FormGroup = <FormGroup>this.manageTalentForm.controls[this.FORM_GROUP_CONST_1[index]];
      const arrayObject: FormArray = <FormArray>formObject.controls[this.FORM_ARRAY_CONST_1[index]];
      arrayObject.push(this.talentInfo.CreatePrincipalAndSecondriesFormGroup());
      this.formArrayFlags[this.FORM_ARRAY_CONST_1[index]] = true;
    }
    for (let index = 0; index < this.FORM_ARRAY_CONST_2.length; index++) {
      const formObject: FormGroup = <FormGroup>this.manageTalentForm.controls[this.FORM_GROUP_CONST_2[index]];
      const arrayObject: FormArray = <FormArray>formObject.controls[this.FORM_ARRAY_CONST_2[index]];
      arrayObject.push(this.talentInfo.CreateFeaturedCroudsGenericSpecialFormGroup());
      this.formArrayFlags[this.FORM_ARRAY_CONST_2[index]] = true;
    }
  }
  /**
   * It adds formGroup in particular formArray
   * @param checkValidation is flag to check if existing form is valid or not.
   * @param index is last index of recoed in formArray, after which recoed is to be added.
   * @param parm1 is name of the formGroup
   * @param parm2 is name of the formArray
   * @param groupFlag is flag which defines which structure of formGroup is to be added.
   */
  addFormGroup(checkValidation, index = 0, parm1, parm2, groupFlag) {
    const formObject: FormGroup = <FormGroup>this.manageTalentForm.controls[parm1];
    const arrayObject: FormArray = <FormArray>formObject.controls[parm2];
    if (checkValidation) {
      const repFormGrp = <FormGroup>arrayObject.controls[index];
      if (repFormGrp) {
        if (groupFlag) {
          this.setPrincipalSecondariesValidators(repFormGrp);

          if (repFormGrp.valid) {
            if (repFormGrp.value.name && (repFormGrp.value.prep || repFormGrp.value.shoot) && repFormGrp.value.costPerDay) {
              arrayObject.push(this.talentInfo.CreatePrincipalAndSecondriesFormGroup());
              this.arrayRecordEmptyFlag[parm2] = false;
            }
          } else {
            // set error flag here
            this.arrayRecordEmptyFlag[parm2] = true;
          }
          repFormGrp.controls['invalidFlag'].setValue(repFormGrp.status);
        } else {
          if (repFormGrp.valid) {
            this.setValidators(repFormGrp);
            if (repFormGrp.value.description && repFormGrp.value.days && repFormGrp.value.quantity) {
              arrayObject.push(this.talentInfo.CreateFeaturedCroudsGenericSpecialFormGroup());
              this.arrayRecordEmptyFlag[parm2] = false;
            }
          } else {
            // set error flag here
            this.arrayRecordEmptyFlag[parm2] = true;
          }
          repFormGrp.controls['invalidFlag'].setValue(repFormGrp.status);
        }
      } else {
        this.validContactPersonDetails = true;
      }
    }
    else {
      if (groupFlag) {
        arrayObject.push(this.talentInfo.CreatePrincipalAndSecondriesFormGroup());
      } else {
        arrayObject.push(this.talentInfo.CreateFeaturedCroudsGenericSpecialFormGroup());
      }
    }
  }
  /**
   * It removes selected entry from formArray
   * @param eventIndex is index of entry of recoed in formArray, which is to be removed.
   * @param parm1 is name of the formGroup
   * @param parm2 is name of the formArray
   */
  removeFormGroup(eventIndex, parm1, parm2) {
    const formObject: FormGroup = <FormGroup>this.manageTalentForm.controls[parm1];
    const arrayObject: FormArray = <FormArray>formObject.controls[parm2];
    arrayObject.removeAt(eventIndex);
    this.updateFormStatus();
  }

  /**
   * It sets all the form value to the formControl
   * @param data is the final structured data with respect to form structure,
   * so as can be patched to the formControl
   */
  setFormValues(data) {
    if (data) {
      if (data.talentBuyOut) {
        this.manageTalentForm.patchValue({
          talentBuyOutForm: ({
            term: data['talentBuyOut'].term,
            media: data['talentBuyOut'].media,
            territory: data['talentBuyOut'].territory,
            exclusivity: data['talentBuyOut'].exclusivity,
          }),
        });
      }


      for (let index = 0; index < this.FORM_ARRAY_CONST_1.length; index++) {
        const formObject: FormGroup = <FormGroup>this.manageTalentForm.controls[this.FORM_GROUP_CONST_1[index]];
        const arrayObject: FormArray = <FormArray>formObject.controls[this.FORM_ARRAY_CONST_1[index]];
        for (let index1 = 0; index1 < data[this.FORM_ARRAY_CONST_1[index]].length; index1++) {
          if (!this.formArrayFlags[this.FORM_ARRAY_CONST_1[index]]) {
            arrayObject.push(this.talentInfo.CreatePrincipalAndSecondriesFormGroup());
          }
          else {
            this.formArrayFlags[this.FORM_ARRAY_CONST_1[index]] = false;
          }
          const tempObject = <FormGroup>arrayObject.controls[index1];
          tempObject.patchValue({
            'name': data[this.FORM_ARRAY_CONST_1[index]][index1].name,
            'prep': data[this.FORM_ARRAY_CONST_1[index]][index1].prep,
            'shoot': data[this.FORM_ARRAY_CONST_1[index]][index1].shoot,
            'costPerDay': data[this.FORM_ARRAY_CONST_1[index]][index1].costPerDay,
            'currencyId': data[this.FORM_ARRAY_CONST_1[index]][index1].currencyId
          });
        }
      }

      for (let index = 0; index < this.FORM_ARRAY_CONST_2.length; index++) {
        const formObject: FormGroup = <FormGroup>this.manageTalentForm.controls[this.FORM_GROUP_CONST_2[index]];
        const arrayObject: FormArray = <FormArray>formObject.controls[this.FORM_ARRAY_CONST_2[index]];
        for (let index1 = 0; index1 < data[this.FORM_ARRAY_CONST_2[index]].length; index1++) {
          if (!this.formArrayFlags[this.FORM_ARRAY_CONST_2[index]]) {
            arrayObject.push(this.talentInfo.CreateFeaturedCroudsGenericSpecialFormGroup());
          }
          else {
            this.formArrayFlags[this.FORM_ARRAY_CONST_2[index]] = false;
          }
          const tempObject = <FormGroup>arrayObject.controls[index1];
          tempObject.patchValue({
            'description': data[this.FORM_ARRAY_CONST_2[index]][index1].description,
            'days': data[this.FORM_ARRAY_CONST_2[index]][index1].days,
            'quantity': data[this.FORM_ARRAY_CONST_2[index]][index1].quantity
          });
        }
      }
      this.manageBidData.validFormFlag = this.manageTalentForm.valid ? true : false;
    }
  }
  /**
   * It triggers an event which will notify manage bid component.
   * @param event event data to be triggered
   */
  setEventType(event: any) {
    this.triggerService.setEvent(event);
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
    }
  }
}
