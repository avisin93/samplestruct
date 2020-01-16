/** 1.Import third party components
2. Import created modules
3. Import crated services
4. Import created classes
5. Import created constants **/
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageFreelancerAdvancesService } from './manage-freelancer.service';
import { SharedService } from '../../../../../../shared/shared.service';
import { CustomValidators, Common, SessionService, NavigationService, TriggerService, DatePickerMethods } from '../../../../../../common';
import { SharedData } from '../../../../../../shared/shared.data';
import { ManageFreelancerAdvanceData } from './manage-freelancer.data.model';
import { ROUTER_LINKS_FULL_PATH, COOKIES_CONSTANTS, ADVANCES_FOR_CONST, defaultDatepickerOptions, EVENT_TYPES } from '../../../../../../config';
import * as _ from 'lodash';
import { ProjectsData } from '../../../../projects.data';

declare var $: any;
@Component({
  selector: 'app-manage-freelancer',
  templateUrl: './manage-freelancer.component.html',
  styleUrls: ['./manage-freelancer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ManageFreelancerComponent implements OnInit {
  /*declare variables above constructor in sequence -imported constants,public variable,private variables*/
  ROUTER_LINKS_FULL_PATH = ROUTER_LINKS_FULL_PATH;
  ADVANCES_FOR_CONST = ADVANCES_FOR_CONST;
  datePickerOptions = JSON.parse(JSON.stringify(defaultDatepickerOptions));
  freelancerAdvanceForm: FormGroup;
  submmitedFormFlag: boolean = false;
  spinnerFlag: boolean = false;
  advanceDetails: any;
  isClicked: boolean;
  advanceId: any;
  commonLabels: any;
  modesOfOperation: any[];
  freelancersList: any = [];
  budgetLineList: any = [];
  projectId: any;
  defaultCurrency: any = {};
  value: any
  freelancers: any;
  /*declare variables above constructor in sequence -imported constants,public variable,private variables*/

  /*inicialize constructor after declaration of all variables*/
  constructor(
    private router: Router,
    private sharedData: SharedData,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private _manageFreelancerAdvancesService: ManageFreelancerAdvancesService,
    private toastrService: ToastrService,
    private sessionService: SessionService,
    private navigationService: NavigationService,
    private translateService: TranslateService,
    private _sharedService: SharedService,
    private projectsData: ProjectsData,
    private triggerService: TriggerService
  ) {
    this.datePickerOptions.disableUntil = { year: Common.getTodayDate().getFullYear(), month: Common.getTodayDate().getMonth() + 1, day: Common.getTodayDate().getDate() - 1 }
  }
  /*instantiate constructor after declaration of all variables*/
  /*all life cycle events whichever required after inicialization of constructor*/
  ngOnDestroy() {
    // $("#settlement-tab").removeClass("active");
    // $("#advances-tab").addClass("active");
    $(".currency-dropdown").show();
  }
  ngOnInit() {
    Common.scrollTOTop();
    $(".currency-dropdown").hide();
    this.translateService.get('common').subscribe((res: string) => {
      this.commonLabels = res;
    });
    this.projectId = this.projectsData.projectId;
    let projectData: any = this.projectsData.getProjectsData();
    this.defaultCurrency['id'] = projectData.defaultCurrencyId;
    this.defaultCurrency['name'] = projectData.defaultCurrencyCode;
    this.createForm();
    this.route.params.subscribe(params => {
      this.advanceId = params['id'];
      this.getPageDetails();
    });
  }
  /*all life cycle events whichever required after inicialization of constructor*/


  /*method to create freelacer advance  form*/
  createForm() {
    this.freelancerAdvanceForm = this.fb.group({
      budgetLine: ['', [CustomValidators.required]],
      freelancerId: ['', [CustomValidators.required]],
      amount: ['', [CustomValidators.required, CustomValidators.checkDecimal]],
      modeOfPayment: ['', [CustomValidators.required]],
      paymentDate: [Common.getTodayDateObj(), [CustomValidators.required]],
      purpose: ['', [CustomValidators.required]],
      currencyId: [this.defaultCurrency.id]
    })
  }
  /*method to create freelacer advance  form*/

  /*method to load page's default data*/
  getPageDetails() {
    this.getModesOfOperation();
    this.getBudgetLines();
    if (this.advanceId)
      this.getAdvncesDetails();
  }
  /*method to load page's default data*/

  /*method to get freelancer advance details*/
  getAdvncesDetails() {
    this._manageFreelancerAdvancesService.getAdvncesDetails(this.advanceId).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.result) {
          let advanceDetails = ManageFreelancerAdvanceData.getFormDetails(response.payload.result);
          this.advanceDetails = advanceDetails;
          this.setFormValues(advanceDetails);
        }
      }
      else {
        if (response.header.message) {
          this.toastrService.error(response.header.message);
        }

      }

    })
  }
  /*method to get freelancer advance details*/

  /*method to get mode operations list*/
  getModesOfOperation() {
    this._sharedService.getModesOfOperation().subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.results) {
          let modesOfOperation = response.payload.results;
          this.modesOfOperation = Common.getMultipleSelectArr(modesOfOperation, ['id'], ['i18n', 'name']);
        } else {
          this.modesOfOperation = [];
        }
      } else {
        this.modesOfOperation = [];
      }
    }, error => {
      this.modesOfOperation = [];
    });
  }
  /*method to get mode operations list*/

  /*method to get budget lines list*/
  getBudgetLines() {
    this._sharedService.getAdvancesBudgetLine(this.projectId, ADVANCES_FOR_CONST.freelancer).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.results) {
          let budgetLineList = response.payload.results;
          this.budgetLineList = Common.getMultipleSelectArr(budgetLineList, ['id'], ['budgetLine']);
        } else {
          this.budgetLineList = [];
        }
      } else {
        this.toastrService.error(response.header.message);
        this.budgetLineList = [];
      }
    }, error => {
      this.budgetLineList = [];
    });
  }
  /*method to get budget lines list*/

  /*method to get freelancers list*/
  getFreelancers(budgetlineId) {
    if (typeof budgetlineId === "string") {
      this._sharedService.getAdvancesFreelancers(budgetlineId).subscribe((response: any) => {
        if (Common.checkStatusCodeInRange(response.header.statusCode)) {
          if (response.payload && response.payload.results) {
            this.freelancers = response.payload.results;
            this.freelancersList = Common.getMultipleSelectArr(this.freelancers, ['id'], ['i18n', 'name']);
          } else {
            this.freelancersList = [];
          }
        } else {
          this.freelancersList = [];
        }
      }, error => {
        this.freelancersList = [];
      });
    }

  }
  /*method to get freelancers list*/

  /*method to bind advances details to form*/
  setFormValues(advanceDetails) {
    this.getFreelancers(advanceDetails.budgetLine);
    this.freelancerAdvanceForm.patchValue({
      budgetLine: advanceDetails.budgetLine,
      freelancerId: advanceDetails.freelancerId,
      amount: advanceDetails.amount,
      modeOfPayment: advanceDetails.modeOfPayment,
      paymentDate: advanceDetails.paymentDate ? advanceDetails.paymentDate : Common.getTodayDateObj(),
      purpose: advanceDetails.purpose,
      currencyId: advanceDetails.currencyId
    })
  }
  /*method to bind advances details to form*/

  freelancerSelected(freeLancerId) {
    let freelancerObj = _.find(this.freelancers, { 'id': freeLancerId });
    if (freelancerObj) {
      this.freelancerAdvanceForm.controls["modeOfPayment"].setValue(freelancerObj.operationId)
    }
  }
  budgetLineSelected(budgetLine) {
    this.freelancersList = [];
    this.freelancers = [];
    this.getFreelancers(budgetLine);
  }
  /*method to save freelancer advance details*/
  saveAdvance() {
    this.submmitedFormFlag = true;
    this.spinnerFlag = true;
    if (this.freelancerAdvanceForm.valid) {
      this.isClicked = true;
      this.submmitedFormFlag = false;
      let formValue = this.freelancerAdvanceForm.value;
      formValue['langCode'] = this.sessionService.getCookie(COOKIES_CONSTANTS.langCode);
      let advanceFormData = ManageFreelancerAdvanceData.getWebServiceDetails(formValue);
      if (this.advanceId) {
        this.updateAdvance(advanceFormData);
      }
      else {
        this.createAdvance(advanceFormData);
      }
    }
    else {
      this.scrollToInvalidControl();
    }
  }
  /*method to save freelancer advance details*/

  /*method to scroll to invalid form control if validation fails*/
  scrollToInvalidControl() {
    let target;
    for (var i in this.freelancerAdvanceForm.controls) {
      if (!this.freelancerAdvanceForm.controls[i].valid) {
        target = this.freelancerAdvanceForm.controls[i];
        break;
      }
    }
    if (target) {
      this.spinnerFlag = false;

      let el = $('.ng-invalid:not(form):first');
      $('html,body').animate({ scrollTop: (el.offset().top - 100) }, 'slow', () => {
        el.focus();
      });
    }
  }
  /*method to scroll to invalid form control if validation fails*/

  /*method to create new freelancer advance */
  createAdvance(advanceFormData) {
    this._manageFreelancerAdvancesService.postAdvncesDetails(advanceFormData).
      subscribe((responseData: any) => {
        this.spinnerFlag = false;
        this.isClicked = false;
        if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
          this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.advances, [this.projectId,''])]).then(data => {
            this.toastrService.success(responseData.header.message);
          })

        } else {
          if (responseData.header.message) {
            this.toastrService.error(responseData.header.message);
          }

        }
      }, error => {
        this.spinnerFlag = false;
        this.isClicked = false;
        this.toastrService.error(this.commonLabels.errorMessages.responseError);

      }, );
  }
  /*method to create new freelancer advance */


  /*method to update existing freelancer advance */
  updateAdvance(advanceFormData) {
    advanceFormData['id'] = this.advanceId;
    this._manageFreelancerAdvancesService.updateAdvncesDetails(this.advanceId, advanceFormData).
      subscribe((responseData: any) => {
        this.spinnerFlag = false;
        this.isClicked = false;
        if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
          this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.advances, [this.projectId,''])]).then(data => {
            this.toastrService.success(responseData.header.message);
          })

        } else {
          if (responseData.header.message) {
            this.toastrService.error(responseData.header.message);
          }

        }
      }, error => {
        this.spinnerFlag = false;
        this.isClicked = false;
        this.toastrService.error(this.commonLabels.errorMessages.responseError);

      }, );
  }
  /*method to update existing freelancer advance */

  /*method to navigate advance list*/
  navigateTo() {
    this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.advances, [this.projectId])]);
}

  /*method to navigate advance list*/
}
