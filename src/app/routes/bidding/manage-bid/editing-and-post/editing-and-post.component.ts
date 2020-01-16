/** 1.Import third party components
2. Import created modules
3. Import crated services
4. Import created classes
5. Import created constants **/
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormArray, ValidatorFn } from '@angular/forms';
import { SharedData } from '@app/shared/shared.data';
import { EditingAndPostDataModel } from './editing-and-post.data.model';
import { EditingAndPost } from './editing-and-post';
import { ManageBidData } from '../manage-bid.data';
import { CustomValidators, TriggerService, Common } from '@app/common';
import { TAB_NAME_KEYS, STATUS_CODES, TAB_CONST, BIDDING_ROUTER_LINKS_FULL_PATH } from '../../Constants';
import { EVENT_TYPES, CURRENCY_CONSTANTS, ACTION_TYPES } from '@app/config';
const swal = require('sweetalert');
declare var $: any;

@Component({
  selector: 'app-editing-and-post',
  templateUrl: './editing-and-post.component.html',
  styleUrls: ['./editing-and-post.component.scss']
})
export class EditingAndPostComponent implements OnInit, OnDestroy {
  /*declare variables above constructor in sequence -imported constants,public variable,private variables*/
  STATUS_CODES = STATUS_CODES;
  editingAndPostForm: FormGroup;
  FORM_GROUP_CONST = {
    'editorAndPost': 1,
    'music': 2,
    'animation': 3,
    'imageVersions': 4
  };
  editingAndPostDetails: any;
  MODULE_ID: string;
  uiAccessPermissionsObj: any;
  ACTION_TYPES = ACTION_TYPES;
  currencies: any[];
  subscription: Subscription;
  CURRENCY_CONSTANTS = CURRENCY_CONSTANTS;
  latestPassDetails: any;
  biddingsLabelsObj: any = {};
  commercialTitleArr: any = [];
  permissionObject: any;
  /*declare variables above constructor in sequence -imported constants,public variable,private variables*/

  /*inicialize constructor after declaration of all variables*/
  constructor(private router: Router,
    private route: ActivatedRoute,
    private sharedData: SharedData,
    private translateService: TranslateService,
    private triggerService: TriggerService,
    public manageBidData: ManageBidData,
    private editingAndPost: EditingAndPost) { }
  /*inicialize constructor after declaration of all variables*/

  /*all life cycle events whichever required after inicialization of constructor*/
  ngOnInit() {
    Common.scrollTOTop();
    this.manageBidData.initialize(TAB_CONST.editingAndPost, TAB_NAME_KEYS.editingAndPost, 'editing-and-post-tab');
    this.manageBidData.disableTabs.editingAndPost = false;
    this.editingAndPostForm = this.editingAndPost.createEditingAndPostFormGroup();
    this.setLocaleObj();
    this.setPermissionsDetails();
    this.setCurrencyDropdownArr();
    this.subscription = this.triggerService.getEvent().subscribe((data) => {
      if (data.event) {
        if (data.event.type === EVENT_TYPES.bidDetailsEvent) {
          const currentValue = data.event.currentValue;
          if (currentValue) {
            if (this.manageBidData.disableProjectInputs) {
              this.manageBidData.navigateToPassesTab();
            } else {
              this.setCurrencyDropdownArr();
              this.setCommercialTitleArr();
              this.setEditingAndPostDetails();
            }
          }
        }
      }
    });
    this.setCurrencyDropdownArr();
    this.setCommercialTitleArr();
    this.setEditingAndPostDetails();
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

  /**
   *method to set role permissions for current module
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
   *method to set commercial titles array from basic info tab
   */
  setCommercialTitleArr() {
    if (this.manageBidData.bidData && this.manageBidData.bidData.basicInfo && this.manageBidData.bidData.basicInfo.commercialTitle && this.manageBidData.bidData.basicInfo.commercialTitle.length > 0) {
      this.commercialTitleArr = this.manageBidData.bidData.basicInfo.commercialTitle;
    }
  }
  /**
   *method to set editing and post tab detailss
   */
  setEditingAndPostDetails() {
    this.editingAndPostDetails = (this.manageBidData.bidFormsData &&
      this.manageBidData.bidFormsData.editingAndPost) ? this.manageBidData.bidFormsData.editingAndPost : EditingAndPostDataModel.getFormDetails(this.manageBidData.bidData.editingAndPost, this.manageBidData.defaultCurrencyId);
    if (this.editingAndPostDetails) {
      this.createFormArrayControlsAndSetFormValues(this.editingAndPostDetails);
    }
  }
  /**
  **  method to create & set editing & post form values
  ** @param editingAndPostDetails as editing & post details object
  **/
  createFormArrayControlsAndSetFormValues(editingAndPostDetails) {
    if (editingAndPostDetails.image) {
      // this.createNestedPanelControls('image', 'versions', editingAndPostDetails.image.versions, this.FORM_GROUP_CONST.imageVersions);
      this.createNestedPanelControls('image', 'animation', editingAndPostDetails.image.animation, this.FORM_GROUP_CONST.animation);
    }
    const imageFormGroup = <FormGroup>this.editingAndPostForm.controls['image'];
    const imageVersionsFormArray = <FormArray>imageFormGroup.controls['versions'];
    imageVersionsFormArray.controls = [];
    this.createMainPanelControls('editorAndPost', editingAndPostDetails.editorAndPost, this.FORM_GROUP_CONST.editorAndPost);
    this.createMainPanelControls('music', editingAndPostDetails.music, this.FORM_GROUP_CONST.music);
    this.editingAndPostForm.setValue(editingAndPostDetails);
    this.manageBidData.validFormFlag = this.editingAndPostForm.valid ? true : false;
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
  **  method to add  formgroup for locations,art department panels
  ** @param formGroupName as string for getting parent form group
  ** @param formArrayName as string for adding formgroups in formarray
  ** @param dataArray as array for creating formarray as per data
  ** @param formGroupConst as number for which formgroup to be added
  ** add class on which user has clicked as active
  **/
  createNestedPanelControls(formGroupName: string, formArrayName: string, dataArray, formGroupConst: Number) {
    let formGroup: FormGroup = <FormGroup>this.editingAndPostForm.controls[formGroupName];
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
    let formArray: FormArray = <FormArray>this.editingAndPostForm.controls[formArrayName];
    if (dataArray && dataArray.length > 0) {
      formArray.controls = [];
      for (let index = 0; index < dataArray.length; index++) {
        this.addFormGroup(formArray, formGroupConst);
      }
    }
  }
  /**
 **  method to add  formgroup as per formGroupConst
 ** @param formArray as FormArray for adding formgroups into it
 ** @param formGroupConst as number for which form group to added
 **/
  addFormGroup(formArray: FormArray, formGroupConst: Number, checkValidation: boolean = false, formGroup: any = {}) {
    switch (formGroupConst) {
      case this.FORM_GROUP_CONST.editorAndPost: {
        let imageFormGroup = <FormGroup>this.editingAndPostForm.controls['image'];
        let imageVersionsFormArray = <FormArray>imageFormGroup.controls['versions'];
        if (checkValidation) {
          this.setEditorAndPostValidators(formGroup);
          if (formGroup.valid) {
            formArray.push(this.editingAndPost.CreateEditorAndPostFormGroup());
            imageVersionsFormArray.push(this.editingAndPost.CreateImageVersionsFormGroup());
          }
          formGroup.controls['invalidFlag'].setValue(formGroup.status);
        } else {
          formArray.push(this.editingAndPost.CreateEditorAndPostFormGroup());
          imageVersionsFormArray.push(this.editingAndPost.CreateImageVersionsFormGroup());
        }

        break;
      }
      case this.FORM_GROUP_CONST.music:
        if (checkValidation) {
          if (formGroup.valid) {
            let musicFormGroup = this.editingAndPost.CreateMusicsFormGroup();
            this.setMusicValidators(musicFormGroup);
            formArray.push(musicFormGroup);
          }
          formGroup.controls['invalidFlag'].setValue(formGroup.status);
        } else {
          formArray.push(this.editingAndPost.CreateMusicsFormGroup());
        }
        break;
      case this.FORM_GROUP_CONST.imageVersions:
        formArray.push(this.editingAndPost.CreateImageVersionsFormGroup());
        break;
      case this.FORM_GROUP_CONST.animation:
        if (checkValidation) {
          let formvalue = formGroup.value;
          if (formvalue.amount) {
            formArray.push(this.editingAndPost.CreateAnimationFormGroup());
            formGroup.controls['amount'].setErrors(null);
          } else {
            formGroup.controls['amount'].setErrors({ 'checkRequired': true });
          }
        }
        else {
          formArray.push(this.editingAndPost.CreateAnimationFormGroup());
        }
        break;
    }
  }
  /**
  **  method to set  validators  to all controls of  editor and post formgroup
  ** @param formGroup as FormGroup
  **/
  setEditorAndPostValidators(formGroup: FormGroup) {
    this.setValidatorsAndUpdateValue(formGroup, 'title', [CustomValidators.required]);
    this.setValidatorsAndUpdateValue(formGroup, 'version', [CustomValidators.required]);
    if (!formGroup.value.editorCutdowns) {
      this.setValidatorsAndUpdateValue(formGroup, 'pcCutdowns', [CustomValidators.required, CustomValidators.checkDecimal]);
    } else {
      this.setValidatorsAndUpdateValue(formGroup, 'pcCutdowns', [CustomValidators.checkDecimal]);

    }
    if (!formGroup.value.pcCutdowns) {
      this.setValidatorsAndUpdateValue(formGroup, 'editorCutdowns', [CustomValidators.required, CustomValidators.checkDecimal]);
    } else {
      this.setValidatorsAndUpdateValue(formGroup, 'editorCutdowns', [CustomValidators.checkDecimal]);

    }
  }
  /**
   **  method to set  validators  to all controls of  music formgroup
   ** @param formGroup as FormGroup
   **/
  setMusicValidators(formGroup: FormGroup) {
    this.setValidatorsAndUpdateValue(formGroup, 'original', [CustomValidators.required, CustomValidators.checkDecimal]);
    this.setValidatorsAndUpdateValue(formGroup, 'rights', [CustomValidators.required, CustomValidators.checkDecimal]);
    this.setValidatorsAndUpdateValue(formGroup, 'buyOut', [CustomValidators.required, CustomValidators.checkDecimal]);
  }
  /**
  **  method to set  validators  to all controls of  animation formgroup
  ** @param formGroup as FormGroup
  **/
  setAnimationValidators(formGroup: FormGroup) {
    this.setValidatorsAndUpdateValue(formGroup, 'amount', [CustomValidators.required, CustomValidators.checkDecimal]);
  }
  /**
  **  method to set & remove validators  of editor & post formgroup  on change event
  ** @param formGroupConst as number 
  **@param formGroupConst as FormGroup 
  **/
  updateEditorAndPostValidations(formGroupConst: number, formGroup: FormGroup) {
    const formValue = formGroup.value;
    if (!formValue.title.trim() && !formValue.version && !formValue.editorCutdowns && !formValue.pcCutdowns) {
      this.removeValidators(formGroupConst, formGroup);
      formGroup.controls['invalidFlag'].setValue(false);
    } else {
      this.setEditorAndPostValidators(formGroup);
      // tslint:disable-next-line:max-line-length
      if (formGroup.controls['title'].touched && formGroup.controls['version'].touched && (formGroup.controls['editorCutdowns'].touched || formGroup.controls['pcCutdowns'].touched)) {
        formGroup.controls['invalidFlag'].setValue(true);
        this.manageBidData.invalidFlag = false;
      }
    }
  }

  /**
  **  method to update respective image formgroup values on change of editor & post formgroup
  ** @param formGroup as FormGroup 
  **@param index as number 
  **@param formControlName as string 
  **/
  updateImageVersionValues(formGroup: FormGroup, index: number, formControlName: string) {
    let controlValue = formGroup.value[formControlName];
    let imageFormGroup = <FormGroup>this.editingAndPostForm.controls['image'];
    let imageVersionsFormArray = <FormArray>imageFormGroup.controls['versions'];
    let versionFormGroup = <FormGroup>imageVersionsFormArray.controls[index];
    if (controlValue.trim()) {
      versionFormGroup.controls[formControlName].setValue(controlValue);
    } else {
      versionFormGroup.controls[formControlName].setValue('-');
    }
  }
  /**methods to set & remove validators of music form group on change of controls- original,rights & buyout **/
  originalValueChanged(formGroup: FormGroup) {
    const formValue = formGroup.value;
    if (formValue.original) {
      this.setValidatorsAndUpdateValue(formGroup, 'rights', [CustomValidators.checkDecimal]);
      this.setValidatorsAndUpdateValue(formGroup, 'buyOut', [CustomValidators.checkDecimal]);
    } else {
      if (!formValue.rights && !formValue.buyOut) {
        this.setMusicValidators(formGroup);
      } else {
        this.setValidatorsAndUpdateValue(formGroup, 'original', [CustomValidators.checkDecimal]);
      }
    }
  }
  rightsValueChanged(formGroup: FormGroup) {
    const formValue = formGroup.value;
    if (formValue.rights) {
      this.setValidatorsAndUpdateValue(formGroup, 'original', [CustomValidators.checkDecimal]);
      this.setValidatorsAndUpdateValue(formGroup, 'buyOut', [CustomValidators.checkDecimal]);
    } else {
      if (!formValue.original && !formValue.buyOut) {
        this.setMusicValidators(formGroup);
      } else {
        this.setValidatorsAndUpdateValue(formGroup, 'rights', [CustomValidators.checkDecimal]);
      }
    }
  }
  buyOutValueChanged(formGroup: FormGroup) {
    const formValue = formGroup.value;
    if (formValue.buyOut) {
      this.setValidatorsAndUpdateValue(formGroup, 'original', [CustomValidators.checkDecimal]);
      this.setValidatorsAndUpdateValue(formGroup, 'rights', [CustomValidators.checkDecimal]);
    } else {
      if (!formValue.rights && !formValue.original) {
        this.setMusicValidators(formGroup);
      } else {
        this.setValidatorsAndUpdateValue(formGroup, 'buyOut', [CustomValidators.checkDecimal]);
      }
    }
  }
  /**methods to set & remove validators of music form group on change of controls- original,rights & buyout **/

  /**
  **  method to remove Validators of specified formgroup
  ** @param formGroupConst as number 
  ** @param formGroup as FormGroup 
  **/
  removeValidators(formGroupConst: number, formGroup: FormGroup) {
    switch (formGroupConst) {
      case this.FORM_GROUP_CONST.editorAndPost: {
        this.setValidatorsAndUpdateValue(formGroup, 'title', []);
        this.setValidatorsAndUpdateValue(formGroup, 'version', []);
        this.setValidatorsAndUpdateValue(formGroup, 'editorCutdowns', []);
        this.setValidatorsAndUpdateValue(formGroup, 'pcCutdowns', []);
        formGroup.controls['invalidFlag'].setValue(false);
        break;
      }
      case this.FORM_GROUP_CONST.music:
        this.setValidatorsAndUpdateValue(formGroup, 'original', []);
        this.setValidatorsAndUpdateValue(formGroup, 'rights', []);
        this.setValidatorsAndUpdateValue(formGroup, 'buyOut', []);
        formGroup.controls['invalidFlag'].setValue(false);
        break;
      case this.FORM_GROUP_CONST.animation:
        this.setValidatorsAndUpdateValue(formGroup, 'amount', []);
        break;
    }

  }
  /**
  **  method to set  validators  to music formgroup
  ** @param formGroup as FormGroup
  **/
  setValidators(formGroup) {
    this.setValidatorsAndUpdateValue(formGroup, 'original', [CustomValidators.required]);
    this.setValidatorsAndUpdateValue(formGroup, 'rights', [CustomValidators.required]);
    this.setValidatorsAndUpdateValue(formGroup, 'buyOut', [CustomValidators.required, CustomValidators.checkDecimal]);
    this.setValidatorsAndUpdateValue(formGroup, 'currencyId', [CustomValidators.required]);

  }
  /**
  **  method to set validators to specified form control
  ** @param formGroup as FormGroup 
  **@param formControlName as strring  
  **@param validators as validator functions array;
  **/
  setValidatorsAndUpdateValue(formGroup: FormGroup, formControlName: string, validators: ValidatorFn[]) {
    formGroup.controls[formControlName].setValidators(validators);
    if (validators.length === 0) {
      formGroup.controls[formControlName].setErrors(null);
    }
    formGroup.controls[formControlName].updateValueAndValidity();
  }
  /**
   * It gets curriencies from the server with respect to current bid.
   */
  setCurrencyDropdownArr() {
    this.currencies = this.manageBidData.exchangeCurrencyDropdownArr;
  }
  /**
  **  method to get particuler form group controls
  ** @param formGroupName as string 
  ** @param formControlName as string 
  **/
  getFormGroupControls(formGroupName: string, formControlName: string) {
    const formGroup = this.editingAndPostForm.get(formGroupName) as FormGroup;
    return formGroup.controls[formControlName];
  }

  /*method to scroll to invalid form control if validation fails*/
  scrollToInvalidControl() {
    let target;
    for (const i in this.editingAndPostForm.controls) {
      if (!this.editingAndPostForm.controls[i].valid) {
        target = this.editingAndPostForm.controls[i];
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
   * It routes to next page.
   * @param url is url of page where it is to be navigated.
   */
  navigateTo(url) {
    this.router.navigate([Common.sprintf(url, [2])]);
  }
  /*method to set biddings labels from language jsons*/
  setLocaleObj() {
    this.translateService.get('biddings').subscribe(res => {
      this.biddingsLabelsObj = res;
    });
  }

  /**
   ** Opens AICP reflection intimation popup if form is valid & next tab is not disabled
   **/
  openAICPReflectionIntimationPopup() {
    if (!this.manageBidData.disableTabs.aicp && this.manageBidData.AICPGeneratedStatus) {
      this.checkAndRemoveValidators();
      if (this.editingAndPostForm.valid) {
        let aicpButtonLabel = (this.manageBidData.latestPassDetails && this.manageBidData.latestPassDetails.status === STATUS_CODES.PUBLISH) ? this.biddingsLabelsObj.buttons.generateAICP : this.biddingsLabelsObj.labels.updateAICP;
        var swalObj = Common.swalConfirmPopupObj(this.biddingsLabelsObj.labels.epAICPRelectionMsg, true, true, aicpButtonLabel, this.biddingsLabelsObj.labels.cancelDelete);
        swal(swalObj, (isConfirm) => {
          if (isConfirm) {
            this.triggerEventToSaveData(true)
          }
        });
      } else {
        this.scrollToInvalidControl();
      }
    } else {
      this.saveTalentData();
    }
  }
  /**
   ** Triggers event for parent component to save basic info tab data
   ** @param generateAICPFlag of type boolean 
   **/
  triggerEventToSaveData(generateAICPFlag: Boolean = false) {
    this.manageBidData.disableButtonFlag = true;
    this.manageBidData.spinnerFlag = true;
    this.manageBidData.bidFormsData.editingAndPost = this.editingAndPostForm.value;
    this.setEventType({
      type: EVENT_TYPES.updateBidEvent, prevValue: {},
      currentValue: { 'tabId': TAB_CONST.editingAndPost, 'navigationUrl': BIDDING_ROUTER_LINKS_FULL_PATH['bidAicp'], 'generateAICP': generateAICPFlag }
    });
  }


  /**
   * It checks all the validations in editing & cost form, and if invalid
   * sets the invalidFlag and removes emoty form array entry
   */
  saveTalentData() {
    this.checkAndRemoveValidators();
    if (this.editingAndPostForm.valid) {
      this.triggerEventToSaveData(true);
    }
    else {
      this.scrollToInvalidControl();
    }
  }
  /**
   * It checks all the validations in talent form, and if invalid
   * sets the invalidFlag and removes emoty form array entry
   */
  checkAndRemoveValidators() {
    this.checkAndRemoveMainPanelValidators('editorAndPost', this.FORM_GROUP_CONST.editorAndPost);
    this.checkAndRemoveMainPanelValidators('music', this.FORM_GROUP_CONST.music);
    this.checkAndRemoveNestedPanelValidators('image', 'animation', this.FORM_GROUP_CONST.animation);
  }
  /**
   **  method to check & remove nested panel(interior,exterior,special,city permits,set construction,others) validators
   ** @param formGroupName as string for gedtting form group name
   ** @param formArrayName as string  for gedtting form array name
   ** @param formGroupConst as number 
   **/
  checkAndRemoveNestedPanelValidators(formGroupName: string, formArrayName: string, formGroupConst: number) {
    let parentFormGroup: FormGroup = <FormGroup>this.editingAndPostForm.controls[formGroupName];
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
    let formArray: FormArray = <FormArray>this.editingAndPostForm.controls[formArrayName];
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
      case this.FORM_GROUP_CONST.editorAndPost: {
        if (!formValue.title.trim() && !formValue.version && !formValue.editorCutdowns && !formValue.pcCutdowns) {
          this.removeEitherFormgroupOrValidatorIfInvalid(formGroupConst, formGroup, formArray, index);
        } else {
          if (this.commercialTitleArr.length == 0) {
            this.removeEitherFormgroupOrValidatorIfInvalid(formGroupConst, formGroup, formArray, index);
          } else {
            formGroup.controls['invalidFlag'].setValue(true);
          }

        }
        break
      }
      case this.FORM_GROUP_CONST.music: {
        if (!formValue.original && !formValue.rights && !formValue.buyOut) {
          this.removeEitherFormgroupOrValidatorIfInvalid(formGroupConst, formGroup, formArray, index);
        } else {
          formGroup.controls['invalidFlag'].setValue(true);
        }
        break
      }
      case this.FORM_GROUP_CONST.animation: {
        if (!formValue.amount) {
          this.removeEitherFormgroupOrValidatorIfInvalid(formGroupConst, formGroup, formArray, index);
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
      this.removeFormGroup(formArray, index, formGroupConst);
    } else {
      this.removeValidators(formGroupConst, formGroup);
    }
  }
  /**
   * method to update form status in managebid shared data
   */
  updateFormStatus() {
    this.manageBidData.currentTabDataChangeFlag = true;
    if (this.editingAndPostForm.valid) {
      this.manageBidData.validFormFlag = true;
      this.manageBidData.bidFormsUnsavedData['editingAndPost'] = this.editingAndPostForm.value;
    } else {
      this.manageBidData.validFormFlag = false;
    }
  }
  /**
  **  method to remove  formgroup at particular index
  ** @param formArray as FormArray for adding formgroups into it
  ** @param index as number for removing formgroup at particular index
  **/
  removeFormGroup(formArray: FormArray, index: number, formGroupConst: number) {
    formArray.removeAt(index);
    if (formGroupConst == this.FORM_GROUP_CONST.editorAndPost) {
      let imageFormGroup = <FormGroup>this.editingAndPostForm.controls['image'];
      let imageVersionsFormArray = <FormArray>imageFormGroup.controls['versions'];
      imageVersionsFormArray.removeAt(index);
    }
    this.updateFormStatus();
  }

  /**
   * It triggers an event which will notify manage payment component.
   * @param event event data to be triggered
   */
  setEventType(event: any) {
    this.triggerService.setEvent(event);
  }
}
