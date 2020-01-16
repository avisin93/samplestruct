import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { SharedService } from '@app/shared/shared.service';
import { Common, CustomValidators, TriggerService } from '@app/common';
import { BUDGET_SHEET_FILE_TYPES, EVENT_TYPES } from '@app/config/constants';
import { AddBudgetService } from './add-budget.services';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { ProjectsData } from '../../../projects.data';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-add-budget',
  templateUrl: './add-budget.component.html',
  styleUrls: ['./add-budget.component.scss'],
  providers: [AddBudgetService]
})
export class AddBudgetComponent implements OnInit, OnDestroy {
  budgetTypesArr: any[];
  addBudgetForm: FormGroup;
  fileName: string;
  data: any;
  error: any;
  renderPage: Boolean = false;
  disableButton: Boolean = false;
  addBudgetSheetForm: Boolean = false;
  budgetTypeIds: any = [];
  project: any;
  finalBudgetSheetPostData: any = [];
  common: any;
  constructor(public bsModalRef: BsModalRef,
    private _sharedService: SharedService,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private _addBudgetService: AddBudgetService,
    private projectsData: ProjectsData,
    private triggerService: TriggerService,
    private translateService: TranslateService,
    private translate: TranslateService) { }

  ngOnInit() {
    // this.getBudgetTypes();
    this.translate.get('common').subscribe(res => {
      this.error = res;
    });
    this.project = this.projectsData.getProjectsData();
    this.budgetTypesArr = this.budgetTypeIds;
    this.createAddForm();
    this.addBudgetSheet(false);
    // this.createAddForm();

    // this.addBudgetSheet(false);
  }
  /**
* Submits on enter key
* @param event as enter key event
*/
  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      event.preventDefault();
      if (!this.disableButton) {
      this.addBudget();
      }
    }
  }
  ngOnDestroy() {
    this.triggerService.setEvent({ type: EVENT_TYPES.enableAddBudgetEvent, prevValue: {}, currentValue: true });
  }

  /**
   * Creates add budget form
   */
  createAddForm() {
    this.addBudgetForm = this.addBudgetFormGroup();
  }
  /**
   * Creates add budget Form Group
   */
  addBudgetFormGroup(): FormGroup {
    return this.fb.group({
      budgetSheetArr: this.fb.array([]),
    });
  }
  /**
   * Uploads files and assigns file name and id to form fields
   * @param event is a browse window event
   * @param index specifies for which record the file should be uploaded
   */
  fileChangeEvent(event, index) {
    const budgetSheetArray = <FormArray>this.addBudgetForm.controls['budgetSheetArr'];
    const budgetSheetFormGroup = <FormGroup>budgetSheetArray.controls[index];
    if (event.target.files[0]) {
      const file = event.target.files[0];
      const type = this.getFileType(file);
      if (this.checkFileType(type)) {
        const formData = this.setFormData(file);
        this.fileName = '';
        budgetSheetFormGroup.controls['showLoader'].setValue(true);
        this.disableButton = true;
        this._sharedService.uploadFile(formData).subscribe((response: any) => {
          if (Common.checkStatusCodeInRange(response.header.statusCode)) {
            if (response.payload && response.payload.result) {
              budgetSheetFormGroup.controls['showLoader'].setValue(false);
              this.data = response.payload.result;
              this.fileName = this.data.name;
              budgetSheetFormGroup.controls['budgetSheetFileId'].setValue(this.data.id);
              budgetSheetFormGroup.controls['budgetSheetName'].setValue(this.data.name);
              this.disableButton = false;
            } else {
              budgetSheetFormGroup.controls['showLoader'].setValue(false);
              this.data = [];
              this.disableButton = false;
            }
          } else {
            budgetSheetFormGroup.controls['showLoader'].setValue(false);
            this.disableButton = false;
            this.data = [];
            if (response.header) {
              this.toastrService.error(response.header.message);
            } else {
              this.toastrService.error(this.error.errorMessages.responseError);
            }
          }

        },
          error => {
            budgetSheetFormGroup.controls['showLoader'].setValue(false);
            this.data = [];
            this.disableButton = false;
          });
      }
      else {
        this.toastrService.error(this.error.errorMessages.invalidFileType);
      }
    }
  }
  /**
   * Sets file which will be sent to the upload service
   * @param file is a file which which will be uploaded
   */
  setFormData(file) {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return formData;
  }
  /**
   * Budget sheet form group which will be pushed in budgetSheetArr
   */
  budgetSheetRecordForm(): FormGroup {
    return this.fb.group({
      budgetSheetType: ['', [CustomValidators.required]],
      budgetSheetFileId: ['', [CustomValidators.required]],
      budgetSheetName: [''],
      showLoader: [false],
      filteredBudgetList: [this.getFilteredBudgetType()]
    });
  }
  /**
   * Filters budget sheet dropdown when multiple budget sheet records are added
   */
  getFilteredBudgetType() {
    const formValue = this.addBudgetForm.value;
    const selectedBudgetIds = _.map(formValue.budgetSheetArr, 'budgetSheetType');
    const companies = JSON.parse(JSON.stringify(this.budgetTypesArr));
    let filteredBudgetIds = [];
    if (selectedBudgetIds.length > 0) {
      companies.forEach((obj, index) => {
        if (!selectedBudgetIds.includes(obj.id)) {
          obj['text'] = obj.name;
          filteredBudgetIds.push(obj);
        }
      });
    }
    else {
      filteredBudgetIds = Common.getMultipleSelectArr(JSON.parse(JSON.stringify(companies)), ['id'], ['name']);
    }

    this.renderPage = true;
    return filteredBudgetIds;


  }
  /**
   * Filters budget sheet values on budget type change
   * @param value which needs to be filtered
   */
  budgetTypeChanged(value) {
    const budgetTypeArr = <FormArray>this.addBudgetForm.get('budgetSheetArr');
    for (let i = 0; i < budgetTypeArr.length; i++) {
      const formGroup = <FormGroup>budgetTypeArr.controls[i];
      if (value !== formGroup.value.budgetSheetType) {
        const budgetTypesArr: any = JSON.parse(JSON.stringify(formGroup.value.filteredBudgetList));
        _.remove(budgetTypesArr, { 'id': value });
        formGroup.controls['filteredBudgetList'].setValue(budgetTypesArr);
      }

    }
  }
  /**
   * Removes budget sheet record and updated budgetsheet dropdown
   * @param eventIndex as string which defines which record is to be removed
   * @param formGrp as FormGroup in budgetsheetArr
   */
  removeRole(eventIndex, formGrp: FormGroup) {
    const roleArray = <FormArray>this.addBudgetForm.get('budgetSheetArr');
    const userId = formGrp.value.budgetSheetType;
    roleArray.removeAt(eventIndex);
    for (let i = 0; i < roleArray.length; i++) {
      const formGroup = <FormGroup>roleArray.controls[i];
      const budgetTypesArr: any = JSON.parse(JSON.stringify(this.budgetTypesArr));
      const filteredUsers: any = formGroup.value.filteredBudgetList;
      budgetTypesArr.forEach((obj) => {
        obj['text'] = obj.name;
      });
      const budgetType = _.find(budgetTypesArr, { 'id': userId });
      filteredUsers.push(budgetType);
      formGroup.controls['filteredBudgetList'].setValue(filteredUsers);
    }

  }
  /**
   * Adds budget sheet record
   * @param addOnPageLoad as boolean which specifies to load initial FormGroup on page load
   * @param index as number to add Budget sheet record at that particular index
   */
  addBudgetSheet(addOnPageLoad, index = 0) {
    this.addBudgetSheetForm = false;
    const budgetSheetArray = <FormArray>this.addBudgetForm.controls['budgetSheetArr'];
    const budgetSheetFormGroup = <FormGroup>budgetSheetArray.controls[index];
    if (addOnPageLoad) {
      if (budgetSheetFormGroup.valid) {
        budgetSheetArray.push(this.budgetSheetRecordForm());
      }
      else {
        this.addBudgetSheetForm = true;
      }
    } else {
      budgetSheetArray.push(this.budgetSheetRecordForm());
    }
  }
  /**
   * Returns file type
   * @param file as filename
   */
  getFileType(file) {
    const fileNameArr = file.name.split('.');
    const type = fileNameArr[fileNameArr.length - 1];
    return type;
  }
  /**
   * Retuns true if file type valid and false on invalid file type
   * @param filetype as file extension
   */
  checkFileType(filetype) {
    const validtype = _.find(BUDGET_SHEET_FILE_TYPES, { 'type': filetype.toLowerCase() });
    if (validtype) {
      return true;
    }
    else {
      return false;
    }

  }
  /**
   * Posts budget sheet records
   */
  addBudget() {
    this.disableButton = true;
    this.addBudgetSheetForm = false;
    const lastIndex = _.findLastIndex(this.addBudgetForm.value.budgetSheetArr);
    const budgetSheetArray = <FormArray>this.addBudgetForm.controls['budgetSheetArr'];
    const budgetSheetFormGroup = <FormGroup>budgetSheetArray.controls[lastIndex];
    if (budgetSheetFormGroup.valid) {

      this.finalBudgetSheetPostData = [];
      const budgetSheetArrayData = budgetSheetArray.value;
      for (let index = 0; index <= lastIndex; index++) {
        const dataObj = {};
        dataObj['budgetFileId'] = budgetSheetArrayData[index].budgetSheetFileId;
        dataObj['budgetTypeId'] = budgetSheetArrayData[index].budgetSheetType;
        this.finalBudgetSheetPostData.push(dataObj);
      }
      this._addBudgetService.addBudget(this.finalBudgetSheetPostData, this.project.projectId).subscribe((response: any) => {
        if (Common.checkStatusCodeInRange(response.header.statusCode)) {
          this.setEventType({ type: EVENT_TYPES.refreshBudgetListEvent, prevValue: {}, currentValue: EVENT_TYPES.addBudgetEvent });
          this.setEventType({ type: EVENT_TYPES.syncWholeProject, prevValue: '', currentValue: '' });
          this.disableButton = false;
          this.toastrService.success(response.header.message);
          this.bsModalRef.hide();
        } else {

          this.toastrService.error(response.header.message);
          this.disableButton = false;
        }
      },
        error => {
          this.disableButton = false;
          this.toastrService.error(this.common.errorMessages.responseError);
        });
    }
    else {
      this.disableButton = false;
      this.addBudgetSheetForm = true;
    }
    // this.setEventType({ type: EVENT_TYPES.addBudgetEvent, prevValue: {}, currentValue: EVENT_TYPES.addBudgetEvent });
  }
  /**
   * Sets triigerservice events
   * @param event
   */
  setEventType(event: any) {
    this.triggerService.setEvent(event);
  }
}
