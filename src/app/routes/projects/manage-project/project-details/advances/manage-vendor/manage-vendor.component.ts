/** 1.Import third party components
2. Import created modules
3. Import crated services
4. Import created classes
5. Import created constants **/
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ROUTER_LINKS_FULL_PATH, ADVANCES_FOR_CONST, COOKIES_CONSTANTS, defaultDatepickerOptions, EVENT_TYPES } from '../../../../../../config';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { SharedData } from '../../../../../../shared/shared.data';
import { SharedService } from '../../../../../../shared/shared.service';
import { FormControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ManageVendorAdvanceData } from './manage-vendor.data.model'
import { CustomValidators, Common, SessionService, NavigationService, TriggerService } from '../../../../../../common';
import { ManageVendorAdvancesService } from './manage-vendor.service';
import * as _ from 'lodash';
import { ProjectsData } from '../../../../projects.data';

declare var $: any;
@Component({
  selector: 'app-manage-vendor',
  templateUrl: './manage-vendor.component.html',
  styleUrls: ['./manage-vendor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ManageVendorComponent implements OnInit {
  /*declare variables above constructor in sequence -imported constants,public variable,private variables*/
  vendorPOForm: FormGroup;
  ROUTER_LINKS_FULL_PATH = ROUTER_LINKS_FULL_PATH;
  defaultCurrency: any = {};
  vendorAdvanceForm: FormGroup;
  formvalue: any;
  tabledata: any = [];
  submmitedFormFlag: boolean = false;
  spinnerFlag: boolean = false;
  advanceId: any;
  commonLabels: any;
  modesOfOperation: any[];
  vendorsList: any = [];
  budgetLineList: any = [];
  projectId: any;
  advanceDetails: any;
  ADVANCES_FOR_CONST = ADVANCES_FOR_CONST;
  isClicked: boolean;
  datePickerOptions = JSON.parse(JSON.stringify(defaultDatepickerOptions));
  value: any;
  vendors: any = [];
  /*declare variables above constructor in sequence -imported constants,public variable,private variables*/

  /*inicialize constructor after declaration of all variables*/
  constructor(
    private router: Router,
    private sharedData: SharedData,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private _manageVendorAdvancesService: ManageVendorAdvancesService,
    private toastrService: ToastrService,
    private sessionService: SessionService,
    private navigationService: NavigationService,
    private translateService: TranslateService,
    private projectsData: ProjectsData,
    private _sharedService: SharedService,

    private triggerService: TriggerService
  ) {
    this.datePickerOptions.disableUntil = { year: Common.getTodayDate().getFullYear(), month: Common.getTodayDate().getMonth() + 1, day: Common.getTodayDate().getDate() - 1 }
  }
  /*inicialize constructor after declaration of all variables*/

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
    })
  }
  /*all life cycle events whichever required after inicialization of constructor*/

  /*method to create vendor advance  form*/
  createForm() {
    this.vendorAdvanceForm = this.fb.group({
      budgetLine: ['', [CustomValidators.required]],
      vendorId: ['', [CustomValidators.required]],
      amount: ['', [CustomValidators.required, CustomValidators.checkDecimal]],
      modeOfPayment: ['', [CustomValidators.required]],
      paymentDate: [Common.getTodayDateObj(), [CustomValidators.required]],
      purpose: ['', [CustomValidators.required]],
      currencyId: [this.defaultCurrency.id]
    })
  }
  /*method to create vendor advance  form*/

  /*method to load page's default data*/
  getPageDetails() {
    this.getModesOfOperation();
    this.getBudgetLines();
    if (this.advanceId)
      this.getAdvncesDetails();
  }
  /*method to load page's default data*/

  /*method to get vendor advance details*/
  getAdvncesDetails() {
    this._manageVendorAdvancesService.getAdvncesDetails(this.advanceId).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.result) {
          let advanceDetails = ManageVendorAdvanceData.getFormDetails(response.payload.result);
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
  /*method to get vendor advance details*/

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
    this._sharedService.getAdvancesBudgetLine(this.projectId, ADVANCES_FOR_CONST.vendor).subscribe((response: any) => {
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
  vendorSelected(vendorId) {
    let vendorObj = _.find(this.vendors, { 'id': vendorId });
    if (vendorObj) {
      this.vendorAdvanceForm.controls["modeOfPayment"].setValue(vendorObj.operationId)
    }
  }
  budgetLineSelected(budgetLine) {
    this.vendorsList = [];
    this.vendors = [];
    this.getVendors(budgetLine);
  }
  /*method to get vendors list*/
  getVendors(budgetlineId) {
    if (typeof budgetlineId === "string") {
      this._sharedService.getAdvancesVendors(budgetlineId).subscribe((response: any) => {
        if (Common.checkStatusCodeInRange(response.header.statusCode)) {
          if (response.payload && response.payload.results) {
            this.vendors = response.payload.results;
            this.vendorsList = Common.getMultipleSelectArr(this.vendors, ['id'], ['i18n', 'name']);
          } else {
            this.vendorsList = [];
          }
        } else {
          this.vendorsList = [];
        }
      }, error => {
        this.vendorsList = [];
      });
    }

  }
  /*method to get vendors list*/

  /*method to bind advances details to form*/
  setFormValues(advanceDetails) {
    this.getVendors(advanceDetails.budgetLine);
    this.vendorAdvanceForm.patchValue({
      budgetLine: advanceDetails.budgetLine,
      vendorId: advanceDetails.vendorId,
      amount: advanceDetails.amount,
      modeOfPayment: advanceDetails.modeOfPayment,
      paymentDate: advanceDetails.paymentDate ? advanceDetails.paymentDate : Common.getTodayDateObj(),
      purpose: advanceDetails.purpose,
      currencyId: advanceDetails.currencyId
    })
  }
  /*method to bind advances details to form*/

  /*method to save freelancer advance details*/
  saveAdvance() {
    this.submmitedFormFlag = true;
    this.spinnerFlag = true;
    if (this.vendorAdvanceForm.valid) {
      this.isClicked = true;
      this.submmitedFormFlag = false;
      let formValue = this.vendorAdvanceForm.value;
      formValue['langCode'] = this.sessionService.getCookie(COOKIES_CONSTANTS.langCode);
      let advanceFormData = ManageVendorAdvanceData.getWebServiceDetails(formValue);
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
    for (var i in this.vendorAdvanceForm.controls) {
      if (!this.vendorAdvanceForm.controls[i].valid) {
        target = this.vendorAdvanceForm.controls[i];
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
    this._manageVendorAdvancesService.postAdvncesDetails(advanceFormData).
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
    this._manageVendorAdvancesService.updateAdvncesDetails(this.advanceId, advanceFormData).
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
