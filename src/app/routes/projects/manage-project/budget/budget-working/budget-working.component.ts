import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ROUTER_LINKS_FULL_PATH, EVENT_TYPES, COOKIES_CONSTANTS, DEFAULT_WORKING_CURRENCY } from '@app/config';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { TriggerService, Common, SessionService, CustomValidators, NavigationService } from '@app/common';
import { ProjectsData } from '../../../projects.data';
import { BudgetDetailsService } from '../budget.services';
import { ListWorkingService } from './budget-working.service';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ManageWorkingData } from './budget-working.data.model';
import { ToastrService } from 'ngx-toastr';
import { ShowTwoDecimalPipe } from '@app/shared/pipes';
declare var $: any;

@Component({
  selector: 'app-budget-working',
  templateUrl: './budget-working.component.html',
  styleUrls: ['./budget-working.component.scss']
})
export class BudgetWorkingComponent implements OnInit, OnDestroy {
  showAdditionalColumns: Boolean = false;
  workingForm: FormGroup;
  projectId: any;
  workingDetails: any;
  budgetDetails: any;
  count: any = 0;
  projectBudgetId: any;
  DEFAULT_MASTER_CONFIG_CURRENCY: any;
  renderPage: Boolean = false;
  submitWorkingForm: Boolean = false;
  isClicked: Boolean = false;
  spinnerFlag: Boolean = false;
  DEFAULT_WORKING_CURRENCY = DEFAULT_WORKING_CURRENCY;
  workingTotal: any = 0;
  common: any;
  showFloatingBtn: boolean = true;
  // Currencies
  constructor(private _listWorkingService: ListWorkingService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private triggerService: TriggerService,
    private projectsData: ProjectsData,
    private _budgetDetailsService: BudgetDetailsService,
    private toastrService: ToastrService,
    private sessionService: SessionService,
    private _twoDecimal: ShowTwoDecimalPipe,
    private navigationService: NavigationService) { }


  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectBudgetId = params['id'];
    });
    this.getWorkingList();
    this.createWorkingForm();
    this.addWorkingFormGroup();
    this.projectId = this.projectsData.projectId;
    $('#manage-project-tabs').hide();
    $('#manage-project-tabs:not(#budget-type)').hide();
    this.getBudgetData();
    this.updateBackToListPath();
    this.setEventType({ type: EVENT_TYPES.updateBudgetWokingBreadcrumbEvent, prevValue: {}, currentValue: {} });
  }
   /**
* Submits on enter key
* @param event as enter key event
*/
@HostListener('document:keydown', ['$event'])
onKeyDownHandler(event: KeyboardEvent) {
  if (event.keyCode === 13) {
    event.preventDefault();
    if (!this.spinnerFlag) {
    this.saveWorkingChart();
    }
  }
}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showFloatingBtn = Common.isInView($('#fixed-btn')) ? false : true;
  }
  /**
   * OnDestroy Lifecycle hook
   */
  ngOnDestroy() {
    this.setEventType({ type: EVENT_TYPES.backToListEvent, prevValue: {}, currentValue:{clearBudgetName:true}  });
    $('#manage-project-tabs').show();
  }
  /**
   * Creates Working list form group
   */
  createWorkingForm() {
    this.workingForm = this.workingListFormGroup();
  }
  /**
   * Creates parent form array in Parent Form group
   */
  workingListFormGroup(): FormGroup {
    return this.fb.group({
      workingArr: this.fb.array([])
    });
  }
  /**
  * Creates form gorup in form array structure
  */
  createWorkingArr(): FormGroup {
    return this.fb.group({
      categoryId: [''],
      budgetLine: [''],
      categoryName: [''],
      workingTotal: [''],
      subWorkingArr: this.fb.array([])
    });
  }
  /**
  * Creates form group sub form array structure
  */
  createSubWorkingArray(): FormGroup {
    return this.fb.group({
      subCategoryId: [''],
      subBudgetLine: [''],
      subCategoryName: [''],
      workingRate: ['', [CustomValidators.checkDecimal]],
      currency: ['']
    });
  }

  /**
     * Adds form group in form array
     */
  addWorkingFormGroup() {
    const workingArr = <FormArray>this.workingForm.controls['workingArr'];
    workingArr.push(this.createWorkingArr());

  }
  /**
* Adds form group in sub form array
*/
  addSubWorkingFormGroup(index) {
    const subWorkingArr = <FormArray>this.workingForm.controls['workingArr'];
    const subForm = <FormGroup>subWorkingArr.controls[index];
    const subFormArray = <FormArray>subForm.controls['subWorkingArr'];
    subFormArray.push(this.createSubWorkingArray());
  }
  /**
   * Toggles sub-category
   * @param category as which category to toggle
   * @param type as to show or hide
   * @param e as event
   */
  showHideCategoryDetails(category, type, e) {
    e.stopPropagation();
    if (type === 'show') {
      $('.sub-category_' + category.value.budgetLine).show();
      $('.category-plus.category_' + category.value.budgetLine).hide();
      $('.category-minus.category_' + category.value.budgetLine).show();
      this.showAdditionalColumns = true;
      this.count++;
    } else {
      $('.sub-category_' + category.value.budgetLine).hide();
      $('.category-plus.category_' + category.value.budgetLine).show();
      $('.category-minus.category_' + category.value.budgetLine).hide();
      this.showAdditionalColumns = true;
      this.count--;
    }
    if (this.count === 0) {
      this.showAdditionalColumns = false;
    }
    this.onWindowScroll();
  }

  // Get Base Rate list from JSON
  getWorkingList() {
    this._listWorkingService.getWorkingListData(this.projectBudgetId).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.results) {
          this.workingDetails = response.payload.results;
          this.setFormArrayData(this.workingDetails);
        }
      }
    }, error => {
      this.workingDetails = [];
    });
  }
  /**
   * Sets web servie data to form structure
   * @param workingListArr as  working details fetched from web service
   */
  setFormArrayData(workingListArr) {
    if (workingListArr) {
      const workingArray = <FormArray>this.workingForm.controls['workingArr'];
      for (let i = 0; i < workingListArr.length; i++) {
        if (i && workingListArr[i].budgetLine) {
          this.addWorkingFormGroup();
        }
        const workingFormGroup = <FormGroup>workingArray.controls[i];
        workingArray.controls[i].patchValue({
          'categoryId': workingListArr[i].id ? workingListArr[i].id : '',
          'budgetLine': workingListArr[i].budgetLine ? workingListArr[i].budgetLine : '',
          'categoryName': workingListArr[i].i18n.mappingName ? workingListArr[i].i18n.mappingName : '',
          'workingTotal': workingListArr[i].working ? workingListArr[i].working : ''
        });
        const subWorking = <FormArray>workingFormGroup.controls['subWorkingArr'];
        for (let j = 0; j < workingListArr[i].accounts.length; j++) {
          if (workingListArr[i].accounts[j].budgetLine) {
            this.addSubWorkingFormGroup(i);
          }
          subWorking.controls[j].patchValue({
            'subCategoryId': workingListArr[i].accounts[j].id ? workingListArr[i].accounts[j].id : '',
            'subBudgetLine': workingListArr[i].accounts[j].budgetLine ? workingListArr[i].accounts[j].budgetLine : '',
            'subCategoryName': workingListArr[i].accounts[j].i18n.mappingName ? workingListArr[i].accounts[j].i18n.mappingName : '',
            'workingRate': workingListArr[i].accounts[j].working ? workingListArr[i].accounts[j].working : '',
            // 'currency': workingListArr[i].accounts[j].budgetLineNo
          });
        }
        this.renderPage = true;
      }
    }
  }
  /**
   * Gets Budget Data
   */
  getBudgetData() {
    this._budgetDetailsService.getBudgetDetails(this.projectId, this.projectBudgetId).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.result) {
          this.budgetDetails = response.payload.result;
          const budgetName = (this.budgetDetails && this.budgetDetails.budget && this.budgetDetails.budget.name) ? this.budgetDetails.budget.name : '';
          this.setEventType({ type: EVENT_TYPES.budgetTableEvent, prevValue: {}, currentValue:  { budgetName: budgetName }});
        }
      }
    }, error => {
      this.budgetDetails = [];
    });
  }
  /**
   * Sets event to carry out component interaction
   * @param event as event
   */
  setEventType(event: any) {
    this.triggerService.setEvent(event);
  }
  /**
 * Updates list path to budget list
 */
  updateBackToListPath() {
    const url = Common.sprintf(ROUTER_LINKS_FULL_PATH.budgetSheets, [this.projectsData.projectId]);
    this.setEventType({ type: EVENT_TYPES.backToListEvent, prevValue: '', currentValue: url });
  }

  /**
   * Cancel button navigates to budget list
   */
  navigateToBudgetList() {
    this.navigationService.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.budgetSheets, [this.projectId])]);
  }
 /**
  ** Checks entered value is integer or not
   ** @param formGroup as FormGroup  to get form value
  ** @param formControlName as string
  **/
 checkIntegerValue(formGroup: FormGroup, formControlName: string) {
  if (isNaN(formGroup.value[formControlName])) {
    const obj = { [formControlName]: 0 };
    formGroup.patchValue(obj);
  }
}
  /**
  * Posts Working list data to web service
  */
  saveWorkingChart() {
    this.submitWorkingForm = true;
    this.spinnerFlag = true;
    this.isClicked = true;
    if (this.workingForm.valid) {
      const formObj = this.workingForm.value;
      const langCode = this.sessionService.getCookie(COOKIES_CONSTANTS.langCode);
      for (let i = 0; i < formObj.workingArr.length; i++) {
        this.workingTotal = 0;
        for (let j = 0; j < formObj.workingArr[i].subWorkingArr.length; j++) {
          if (formObj.workingArr[i].subWorkingArr[j].workingRate === "") {
            formObj.workingArr[i].subWorkingArr[j].workingRate = 0;
          }
          // tslint:disable-next-line:radix
          this.workingTotal = this._twoDecimal.transform(parseFloat(this.workingTotal) +
           parseFloat(formObj.workingArr[i].subWorkingArr[j].workingRate));
        }
        formObj.workingArr[i].workingTotal = parseFloat(this.workingTotal);
      }
      const formvalue = ManageWorkingData.setManageWorkingData(formObj, langCode);
      this._listWorkingService.putWorkingList(this.projectBudgetId, formvalue).subscribe((response: any) => {
        this.isClicked = false;
        this.spinnerFlag = false;
        if (Common.checkStatusCodeInRange(response.header.statusCode)) {
          this.toastrService.success(response.header.message);
        } else {
          this.spinnerFlag = false;
          this.isClicked = false;
          this.toastrService.error(response.header.message);
        }
      }, error => {
        this.spinnerFlag = false;
        this.isClicked = false;
        this.toastrService.error(this.common.errorMessages.responseError);
      });
    } else {
      this.spinnerFlag = false;
      this.isClicked = false;
      let target;
      for (const i in this.workingForm.controls) {
        if (!this.workingForm.controls[i].valid) {
          target = this.workingForm.controls[i];
          break;
        }
      }
      if (target) {
        this.spinnerFlag = false;
        const el = $('.ng-invalid:not(form):first');
        $('html,body').animate({ scrollTop: (el.offset().top - 100) }, 'slow', () => {
          el.focus();
        });
      }
    }
  }
}
