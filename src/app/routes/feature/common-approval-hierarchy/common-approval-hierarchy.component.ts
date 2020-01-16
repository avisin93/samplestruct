import { Component, OnInit, Input, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Common, CustomValidators, TriggerService } from '@app/common';
import { ManagePOListData } from '@app/routes/projects/manage-project/project-details/purchase-order/po-listing/po-listing.data.model';
import { FormBuilder, FormArray, FormGroup, ValidatorFn } from '@angular/forms';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { CommonApprovalHierarchyService } from './common-approval-hierachy.service';
import { PROJECT_TYPES, PO_APPROVAL_CONST, EVENT_TYPES, LISTING_TYPE } from '@app/config';
import { ToastrService } from 'ngx-toastr';
// tslint:disable-next-line:import-blacklist
import { Subscription } from 'rxjs';
import { INVOICE_APPROVAL_CONST } from '@app/routes/projects/manage-project/project-details/invoice/invoice.constants';
import { APPROVAL_STATUS } from './constants';
import { SharedData } from '@app/shared/shared.data';
@Component({
  selector: 'app-common-approval-hierarchy',
  templateUrl: './common-approval-hierarchy.component.html',
  styleUrls: ['./common-approval-hierarchy.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CommonApprovalHierarchyComponent implements OnInit, OnDestroy {

  @Input() listDetails: any;
  @Input() projectTypeId: String;
  @Input() statusKeyArr: any;
  @Input() onHoldReasonArrConstant: any;
  @Input() otherReasonArrConstant: any;
  @Input() rejectionReasonArrConstant: any;
  @Input() approvalRejectURL: any;
  @Input() lisType: any;
  @Input() showReasonsBox: Boolean = false;
  hideModal: Boolean = false;
  submitSpinnerFlag: Boolean = false;
  approvedSpinnerFlag: Boolean = false;
  LISTING_TYPE = LISTING_TYPE;
  showReasonBox: Boolean = false;
  disableButtonFlag: Boolean = false;
  PO_APPROVAL_CONST = PO_APPROVAL_CONST;
  INVOICE_APPROVAL_CONST = INVOICE_APPROVAL_CONST;
  PROJECT_TYPES = PROJECT_TYPES;
  APPROVAL_STATUS = APPROVAL_STATUS;
  reasonsForm: FormGroup;
  selectedStatus: String = '';
  onHoldReasons: any = [];
  showSelectAtLeastOneReasonMsg: Boolean = false;
  submittedReasonFlag: Boolean = false;
  rejectionReasons: any = [];
  showOthersReason: Boolean = false;
  subscription: Subscription;
  commonLabels: any;
  userInfo: any;
  constructor(
    private fb: FormBuilder,
    private _commonApprovalListService: CommonApprovalHierarchyService,
    private toastrService: ToastrService,
    private triggerService: TriggerService,
    private translateService: TranslateService,
    private sharedData: SharedData,
  ) { }

  ngOnInit() {
    this.userInfo = this.sharedData.getUsersInfo();
    this.onHoldReasons = this.onHoldReasonArrConstant;
    this.rejectionReasons = this.rejectionReasonArrConstant;
    this.createReasonsForm();
    this.hideReasons();
    this.subscription = this.triggerService.getEvent().subscribe((data) => {
      if (data.event) {
        if (data.event.type === EVENT_TYPES.modalOpen) {
          const currentValue = data.event.currentValue;
          if (currentValue) {
            this.hideReasons();
          }
        }
      }
    });
    this.translateService.get('common').subscribe(res => {
      this.commonLabels = res;
    });

  }
  /**
   * Angular lifecyle hook
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.triggerService.clearEvent();
  }

  /**
   * Creates Reasons setion formgroup
   */
  createReasonsForm() {
    this.reasonsForm = this.fb.group({
      onHoldReasonsArr: this.fb.array([]),
      rejectionReasonsArr: this.fb.array([]),
      othersReason: [''],
      showOthersReason: [false]
    });
    this.createReasonsFormArray('onHoldReasonsArr', this.onHoldReasons);
    this.createReasonsFormArray('rejectionReasonsArr', this.rejectionReasons);
  }

  /**
   * Patches reasons form array
   * @param formArrayName as form array name
   * @param dataArr as form array data
   */
  createReasonsFormArray(formArrayName: string, dataArr: any = []) {
    const formArr = <FormArray>this.reasonsForm.controls[formArrayName];
    formArr.controls = [];
    for (let index = 0; index < dataArr.length; index++) {
      const formGroup = this.createReasonsFormGroup();
      formGroup.patchValue(dataArr[index]);
      formArr.push(formGroup);
    }
  }
  /**
   * Creates reasons form
   */
  createReasonsFormGroup() {
    return this.fb.group({
      id: [''],
      text: [''],
      selected: [false]
    });
  }
  /**
   * Approves type of record pass to it i.e PO,Invoice or Bidding
   */
  approve() {
    this.approvedSpinnerFlag = true;
    this.showReasonBox = false;
    this.disableButtonFlag = true;
    this._commonApprovalListService.approve(this.listDetails.id, this.approvalRejectURL.approveUrl).
      subscribe((responseData: any) => {
        this.approvedSpinnerFlag = false;
        this.disableButtonFlag = false;
        if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
          this.setEventType({ type: EVENT_TYPES.approve, prevValue: {}, currentValue: { 'list': this.lisType } });
          this.toastrService.success(responseData.header.message);
        } else {
          this.toastrService.error(responseData.header.message);
        }
      },
        error => {
          this.approvedSpinnerFlag = false;
          this.disableButtonFlag = false;
          this.toastrService.error(this.commonLabels.errorMessages.error);
        });
  }
  /**
   * Sets status to on hold type of record pass to it i.e PO,Invoice or Bidding
   * @param reasonsList as list of reason to be rendered
   */
  setOnhold(reasonsList) {
    this.submitSpinnerFlag = true;
    this.disableButtonFlag = true;
    const finalUserData = ManagePOListData.setApprovalData(this.listDetails.approver, reasonsList);
    this._commonApprovalListService.setOnHold(this.listDetails.id, finalUserData, this.approvalRejectURL.onHoldUrl).
      subscribe((responseData: any) => {
        this.submitSpinnerFlag = false;
        this.disableButtonFlag = false;
        if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
          this.setEventType({ type: EVENT_TYPES.onHold, prevValue: {}, currentValue: { 'list': this.lisType } });
          this.toastrService.success(responseData.header.message);
        } else {
          this.toastrService.error(responseData.header.message);
        }
      },
        error => {
          this.submitSpinnerFlag = false;
          this.disableButtonFlag = false;
          this.toastrService.error(this.commonLabels.errorMessages.error);
        });
  }
  /**
   * Rejects type of record pass to it i.e PO,Invoice or Bidding
   * @param reasonsList as list of reasons
   */
  reject(reasonsList) {
    this.submitSpinnerFlag = true;
    this.disableButtonFlag = true;
    const finalUserData = ManagePOListData.setApprovalData(this.listDetails.approver, reasonsList);
    this._commonApprovalListService.reject(this.listDetails.id, finalUserData, this.approvalRejectURL.rejectUrl).
      subscribe((responseData: any) => {
        this.submitSpinnerFlag = false;
        this.disableButtonFlag = false;
        if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
          this.setEventType({ type: EVENT_TYPES.onHold, prevValue: {}, currentValue: { 'list': this.lisType } });
          this.toastrService.success(responseData.header.message);
        } else {
          this.toastrService.error(responseData.header.message);
          this.submitSpinnerFlag = false;
          this.disableButtonFlag = false;
        }
      },
        error => {
          this.submitSpinnerFlag = false;
          this.disableButtonFlag = false;
          this.toastrService.error(this.commonLabels.errorMessages.error);
        });
  }
  /**
   * Sets other reasons section in the reasons section
   * @param formGroup as FormGroup
   */
  setOtherReasonDataIfAvailable(formGroup: FormGroup) {
    const otherReasonObj = _.find(this.listDetails.approver.reasons, { 'id': formGroup.value.id });
    this.reasonsForm.controls['othersReason'].setValue(otherReasonObj.text);
    this.reasonsForm.controls['showOthersReason'].setValue(true);
    this.setValidatorsAndUpdateValue('othersReason', [CustomValidators.required]);
  }
  /**
   * Updated form group validity
   * @param formControlName as formControlName
   * @param validators as default validators
   */
  setValidatorsAndUpdateValue(formControlName: string, validators: ValidatorFn[]) {
    this.reasonsForm.controls[formControlName].setValidators(validators);
    if (validators.length === 0) {
      this.reasonsForm.controls[formControlName].setErrors(null);
    }
    this.reasonsForm.controls[formControlName].updateValueAndValidity();
  }

  /**
   * Checks atleast one reson is selected
   */
  checkAtLeastOneReasonSelectedOrNot() {
    let formValue;
    if (this.selectedStatus === 'pending') {
      formValue = this.reasonsForm.controls['onHoldReasonsArr'].value;
    } else {
      formValue = this.reasonsForm.controls['rejectionReasonsArr'].value;
    }
    const isReasonSelected = _.find(formValue, { 'selected': true });
    this.showSelectAtLeastOneReasonMsg = isReasonSelected ? false : true;
  }
  /**
   * Resets cutom flag selected added in form array
   * @param formArrayName as FormArrayName
   */
  resetSelectedFlagInFormArr(formArrayName: string) {
    const formArr: FormArray = <FormArray>this.reasonsForm.controls[formArrayName];
    for (let index = 0; index < formArr.length; index++) {
      const formGroup: FormGroup = <FormGroup>formArr.controls[index];
      formGroup.controls['selected'].setValue(false);
    }
  }
  /**
    * Sets cutom flag selected added in form array
   * @param formArrayName as FormArrayName
   */
  setSelectedFlagInFormArr(formArrayName: string) {
    const reasons: any = Object.assign([], this.listDetails.approver.reasons);
    const mappedReasons = _.map(reasons, 'id');
    const reasonsFormArr = <FormArray>this.reasonsForm.controls[formArrayName];
    for (let index = 0; index < reasonsFormArr.length; index++) {
      const formGroup: FormGroup = <FormGroup>reasonsFormArr.controls[index];
      if (mappedReasons.includes(formGroup.value.id)) {
        formGroup.controls['selected'].setValue(true);
        if (formGroup.value.id == this.otherReasonArrConstant.onhold) {
          this.setOtherReasonDataIfAvailable(formGroup);
        }
      }
    }
  }

  /**
   * Submits selected reason
   */
  submitReason() {
    this.submittedReasonFlag = this.reasonsForm.controls['showOthersReason'].value;
    this.checkAtLeastOneReasonSelectedOrNot();
    if (!this.showSelectAtLeastOneReasonMsg && this.reasonsForm.valid) {
      if (this.selectedStatus === 'pending') {
        const selectedReasonsList = this.getSelectedReasons('onHoldReasonsArr', this.otherReasonArrConstant.onhold);
        this.setOnhold(selectedReasonsList);
      } else {
        const selectedReasonsList = this.getSelectedReasons('rejectionReasonsArr', this.otherReasonArrConstant.rejection);
        this.reject(selectedReasonsList);
      }

    }
  }
  /**
   * Gets selected Reasons by the user
   * @param formArrayName as FormArrayName
   * @param otherId as Other reason list Id
   */
  getSelectedReasons(formArrayName: string, otherId) {
    const formValue = this.reasonsForm.controls[formArrayName].value;
    const selectedReasons = _.filter(JSON.parse(JSON.stringify(formValue)), { 'selected': true });
    const otherReason = _.find(selectedReasons, { 'id': otherId, 'selected': true });
    if (otherReason) {
      otherReason['text'] = this.reasonsForm.controls['othersReason'].value;
    }
    return selectedReasons;
  }
  /**
   * Selects reason through checkbox
   * @param formGroup as Form Group
   * @param event as checked
   */
  selectReason(formGroup, event) {
    const formValue = formGroup.value;
    this.showSelectAtLeastOneReasonMsg = false;
    if (event.target.checked && ((formValue.id === this.otherReasonArrConstant.onhold) || (formValue.id === this.otherReasonArrConstant.rejection))) {
      this.reasonsForm.controls['showOthersReason'].setValue(true);
      formGroup.controls['selected'].setValue(true);
      this.setValidatorsAndUpdateValue('othersReason', [CustomValidators.required]);
    } else {
      if (event.target.checked) {
        formGroup.controls['selected'].setValue(true);
      } else {
        formGroup.controls['selected'].setValue(false);
        if (((formValue.id === this.otherReasonArrConstant.onhold) || (formValue.id === this.otherReasonArrConstant.rejection))) {
          this.reasonsForm.controls['showOthersReason'].setValue(false);
          this.reasonsForm.controls['othersReason'].reset();
          this.setValidatorsAndUpdateValue('othersReason', []);
        }
      }
    }
    if (!event.target.checked) {
      this.submittedReasonFlag = false;
    }

  }
  /**
   * Renders reasons list
   * @param selectedStatus as Boolean
   */
  showReasons(selectedStatus) {
    this.selectedStatus = selectedStatus;
    this.showReasonsBox = true;
    this.resetAllFieldsAndFlags();
    if (this.listDetails.approver.reasons.length > 0) {
      if (this.selectedStatus === 'pending') {
        this.setSelectedFlagInFormArr('onHoldReasonsArr');
      } else {
        this.setSelectedFlagInFormArr('rejectionReasonsArr');
      }
    }

  }
  /**
   * Resets Status flag and hides reason section
   */
  hideReasons() {
    this.selectedStatus = '';
    this.showReasonsBox = false;
    this.resetAllFieldsAndFlags();
  }
  /**
   * Resets all fields and flags
   */
  resetAllFieldsAndFlags() {
    this.showOthersReason = false;
    this.showSelectAtLeastOneReasonMsg = false;
    this.submittedReasonFlag = false;
    this.reasonsForm.controls['showOthersReason'].setValue(false);
    this.reasonsForm.controls['othersReason'].reset();
    this.setValidatorsAndUpdateValue('othersReason', []);
    this.resetSelectedFlagInFormArr('onHoldReasonsArr');
    this.resetSelectedFlagInFormArr('rejectionReasonsArr');
  }


  /**
  ** triggers events for child components
  ** @param event as object with type,prevValue & currentValue fields
  **/
  setEventType(event: any) {
    this.triggerService.setEvent(event);
  }
}
