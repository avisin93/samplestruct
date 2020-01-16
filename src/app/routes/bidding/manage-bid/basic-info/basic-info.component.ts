/** 1.Import third party components
2. Import created modules
3. Import crated services
4. Import created classes
5. Import created constants **/
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Common, TriggerService, NavigationService } from '@app/common';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SharedData } from '@app/shared/shared.data';
import { BasicInfo } from './basic-info';
import { ManageBidData } from '../manage-bid.data';
import { ManageBasicInfoData } from './basic-info.data.model';
import { ManageBidService } from '../manage-bid.service';
import { EVENT_TYPES, UI_ACCESS_PERMISSION_CONST, FILE_SIZE, ACTION_TYPES } from '@app/config';
import { TAB_NAME_KEYS, STATUS_CODES, TAB_CONST, BIDDING_ROUTER_LINKS_FULL_PATH } from '../../Constants';
const swal = require('sweetalert');
declare var $: any;

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss']
})
export class BasicInfoComponent implements OnInit, OnDestroy {
  /*declare variables above constructor in sequence -imported constants,public variable,private variables*/
  UI_ACCESS_PERMISSION_CONST = UI_ACCESS_PERMISSION_CONST;
  uiAccessPermissionsObj: any;
  MODULE_ID: string;
  basicInfoForm: FormGroup;
  projectId: string;
  ACTION_TYPES = ACTION_TYPES;
  submmitedFormFlag: Boolean = false;
  spinnerFlag: Boolean = false;
  disableNextButton: Boolean = false;
  biddingsLabelsObj: any = {};
  basicInfoDetails: any = {};
  subscription: Subscription;
  permissionObject: any;
  /*declare variables above constructor in sequence -imported constants,public variable,private variables*/

  /*inicialize constructor after declaration of all variables*/
  constructor(
    private route: ActivatedRoute,
    private sharedData: SharedData,
    public manageBidData: ManageBidData,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private triggerService: TriggerService,
    private _manageBidService: ManageBidService,
    private navigationService: NavigationService,
    private basicInfo: BasicInfo) { }
  /*inicialize constructor after declaration of all variables*/

  /*all life cycle events whichever required after inicialization of constructor*/
  ngOnInit() {
    Common.scrollTOTop();
    this.manageBidData.initialize(TAB_CONST.basicInfo, TAB_NAME_KEYS.basicInfo, 'basic-info-tab');
    this.setLocaleObj();
    this.setPermissionsDetails();
    this.basicInfoForm = this.basicInfo.createBasicInfoForm();
    this.projectId = this.manageBidData.projectId;
    this.subscription = this.triggerService.getEvent().subscribe((data) => {
      if (data.event) {
        if (data.event.type == EVENT_TYPES.bidDetailsEvent) {
          const currentValue = data.event.currentValue;
          if (currentValue) {
            if (this.manageBidData.disableProjectInputs) {
              this.manageBidData.navigateToPassesTab();
            } else {
              this.setBasicInfoDetails();
            }
          }
        }

      }
    });
    if (this.manageBidData.bidData['basicInfo']) {
      this.setBasicInfoDetails();
    }
  }
  ngOnDestroy() {
    this.manageBidData.currentTabDataChangeFlag = false;
    this.manageBidData.validFormFlag = false;
    this.subscription.unsubscribe();
    this.triggerService.clearEvent();
  }
  /*all life cycle events whichever required after inicialization of constructor*/


  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent) {
    const brand = document.getElementById('brand-logo');
    if (brand) {
      if (event.keyCode === 13) {
        event.preventDefault();
        if (!this.disableNextButton && !this.manageBidData.spinnerFlag) {
        this.saveBasicInfoData();
        }
      }
    }
  }

  /*user defined functions/methods after life cycle events in sequence-public methods,private methods*/

  /*method to set biddings labels from language jsons*/
  setLocaleObj() {
    this.translateService.get('biddings').subscribe(res => {
      this.biddingsLabelsObj = res;
    });
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
  // gets formGroup controls to check error fields on UI
  getFormGroupControls(formGroupName, formControlName) {
    const formGroup = this.basicInfoForm.get(formGroupName) as FormGroup;
    return formGroup.controls[formControlName];
  }
  /*method to update form status in managebid shared data*/
  updateFormStatus() {
    this.manageBidData.currentTabDataChangeFlag = true;
    if (this.basicInfoForm.valid) {
      this.manageBidData.validFormFlag = true;
      this.manageBidData.bidFormsUnsavedData['basicInfo'] = this.basicInfoForm.value;
    } else {
      this.manageBidData.validFormFlag = false;
    }
  }

  /*method to set basic info details*/
  setBasicInfoDetails() {
    this.basicInfoDetails = (this.manageBidData.bidFormsData && this.manageBidData.bidFormsData['basicInfo']) ? this.manageBidData.bidFormsData['basicInfo'] : ManageBasicInfoData.getFormDetails(this.manageBidData.bidData['basicInfo']);
    if (this.basicInfoDetails) {
      this.setFormValues(this.basicInfoDetails);
    }
  }

  /**
  **  method to set basic info form values
  ** @param basicInfoDetails as basic info details object
  **/
  setFormValues(basicInfoDetails) {
    if (basicInfoDetails) {
      if (basicInfoDetails.commercialTitle && basicInfoDetails.commercialTitle.length > 0) {
        const commercialTitleArr = <FormArray>this.basicInfoForm.controls['commercialTitle'];
        commercialTitleArr.controls = [];
        for (let index = 0; index < basicInfoDetails.commercialTitle.length; index++) {
          this.addCommercialTitle();
        }
      }
      this.basicInfoForm.setValue(basicInfoDetails);
      this.manageBidData.validFormFlag = this.basicInfoForm.valid ? true : false;
      // this.updateFormStatus();
    }
  }

  /**  
  ** method to add new entry in commercial title form array
  ** @param checkValidation as boolean for checking validity of formgroup
  ** @param formGroup as formGroup
  **/
  addCommercialTitle(checkValidation: boolean = false, formGroup: any = {}) {
    const commercialTitleArr = <FormArray>this.basicInfoForm.controls['commercialTitle'];
    if (checkValidation) {
      let formvalue = formGroup.value;
      if (formvalue.title) {
        commercialTitleArr.push(this.basicInfo.createCommercialTitleFormGroup());
        formGroup.controls['title'].setErrors(null);
      } else {
        formGroup.controls['title'].setErrors({ "checkRequired": true });
      }
    }
    else {
      commercialTitleArr.push(this.basicInfo.createCommercialTitleFormGroup());
    }
  }
  /**  
   ** method to add remove entry from commercial title form array
   ** @param index as number 
   **/
  removeCommercialTitle(index) {
    const commercialTitleArr = <FormArray>this.basicInfoForm.get('commercialTitle');
    commercialTitleArr.removeAt(index);
    this.updateFormStatus();
  }
  /**Opens system file browser */
  openFileBrowser(event, id) {
    event.preventDefault();
    $('#' + id).click();
  }

  /**
  ** Method called when image file is selected & it cheks file type,size validations
  ** @param event of type $event 
  ** @param formGroupName of type string 
  **/
  fileChangeListener(event, formGroupName: string) {
    this.disableNextButton = true;
    if (event.target.files[0]) {
      var size = parseInt(event.target.files[0].size) * 0.001;
      if (size <= FILE_SIZE.FIVEMB) {
        const file: File = event.target.files[0];
        if (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/bmp' || file.type === 'image/png') {
          this.uploadFile(file, formGroupName);
          event.target.value = '';
        }
        else {
          event.target.value = '';
          this.toastrService.error(this.biddingsLabelsObj.errorMessages.invalidFileType);
          this.disableNextButton = false;
        }
      } else {
        event.target.value = "";
        this.toastrService.error(this.biddingsLabelsObj.errorMessages.imageSizeValidationMsg);
        this.disableNextButton = false;
      }
    }
  }
  /**
  ** Upload selected image to server
  ** @param file of type File 
  **/
  uploadFile(file, formGroupName) {
    let formData = Common.setFormData(file);
    let formgroup = <FormGroup>this.basicInfoForm.controls[formGroupName];
    formgroup.controls['showLoader'].setValue(true);
    this._manageBidService.uploadFile(formData).subscribe((imageResponse: any) => {
      formgroup.controls['showLoader'].setValue(false);
      if (Common.checkStatusCodeInRange(imageResponse.header.statusCode)) {
        if (imageResponse.payload && imageResponse.payload.result) {
          let data = imageResponse.payload.result;
          this.setUploadedData(formGroupName, data);
          this.disableNextButton = false;
        }
      } else {
        this.toastrService.error(imageResponse.header.message);
        this.disableNextButton = false;
      }
    },
      error => {
        formgroup.controls['showLoader'].setValue(false);
        this.toastrService.error(this.biddingsLabelsObj.errorMessages.error);
      });
  }
  /**
  ** Set image response data to respective formgroup
  ** @param formGroupName of type string 
  ** @param data as image response data
  **/
  setUploadedData(formGroupName: string, data: any) {
    let localThis = this;
    let basicInfoFrmGrp = <FormGroup>this.basicInfoForm.controls[formGroupName];
    basicInfoFrmGrp.controls['logoUrl'].setValue(data.url);
    basicInfoFrmGrp.controls['logoId'].setValue(data.id);
    setTimeout(function () {
      localThis.toastrService.success(localThis.biddingsLabelsObj.successMessages.imageUploadedSuccessfully);
    }, 1500);
  }

  /*method to check validatity of basic info form & to update data if form is valid*/
  saveBasicInfoData() {
    this.submmitedFormFlag = true;
    this.spinnerFlag = true;
    if (this.basicInfoForm.valid) {
      if (this.manageBidData.AICPGeneratedStatus) {
        let aicpButtonLabel = (this.manageBidData.latestPassDetails && this.manageBidData.latestPassDetails.status === STATUS_CODES.PUBLISH) ? this.biddingsLabelsObj.buttons.generateAICP : this.biddingsLabelsObj.labels.updateAICP;

        var swalObj = Common.swalConfirmPopupObj(this.biddingsLabelsObj.labels.biAICPRelectionMsg, true, true, aicpButtonLabel, this.biddingsLabelsObj.labels.cancelDelete);
        swal(swalObj, (isConfirm) => {
          if (isConfirm) {
            this.triggerEventToSaveData(true);
          }
        });
      } else {
        this.triggerEventToSaveData();
      }
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
    this.manageBidData.disableButtonFlag = true;
    this.manageBidData.spinnerFlag = true;
    let formvalue = this.basicInfoForm.value;
    this.manageBidData.bidFormsData.basicInfo = formvalue;
    this.setEventType({ type: EVENT_TYPES.updateBidEvent, prevValue: {}, currentValue: { 'tabId': TAB_CONST.basicInfo, 'navigationUrl': BIDDING_ROUTER_LINKS_FULL_PATH['biddingBuisnessTerms'], 'generateAICP': generateAICPFlag } });
  }

  /**
  ** triggers events for child components
  ** @param event as object with type,prevValue & currentValue fields
  **/
  setEventType(event: any) {
    this.triggerService.setEvent(event);
  }
  /*method to scroll to invalid form control if validation fails*/
  scrollToInvalidControl() {
    let target;
    for (var i in this.basicInfoForm.controls) {
      if (!this.basicInfoForm.controls[i].valid) {
        target = this.basicInfoForm.controls[i];
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
  /*method to scroll to invalid form control if validation fails*/
}
