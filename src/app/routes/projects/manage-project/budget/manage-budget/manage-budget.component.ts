import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { CustomValidators } from 'ng2-validation';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
// tslint:disable-next-line:max-line-length
import { ROLES, ROUTER_LINKS, OPERATION_MODES, PROJECT_TYPES, UI_ACCESS_PERMISSION_CONST, ROLES_CONST, ACTION_TYPES, ROUTER_LINKS_FULL_PATH, EVENT_TYPES, DEFAULT_CURRENCY, COOKIES_CONSTANTS, LOCAL_STORAGE_CONSTANTS, ORIGINAL_CURRENCY } from '../../../../../config';
import { ManageBudgetService } from './manage-budget.services';
import { LocalStorageService } from 'angular-2-local-storage';
import { SharedData } from '@app/shared/shared.data';
import { NavigationService, TriggerService, Common, SessionService } from '@app/common';
import { ProjectsData } from '../../../projects.data';
import { SharedService } from '@app/shared/shared.service';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
const swal = require('sweetalert');

@Component({
  selector: 'app-manage-budget',
  templateUrl: './manage-budget.component.html',
  styleUrls: ['./manage-budget.component.scss']
})
export class ManageBudgetComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  UI_ACCESS_PERMISSION_CONST = UI_ACCESS_PERMISSION_CONST;
  ROUTER_LINKS = ROUTER_LINKS;
  ROLES_CONST = ROLES_CONST;
  PROJECT_TYPES = PROJECT_TYPES;
  project: any;
  MODULE_ID: any;
  ACTION_TYPES = ACTION_TYPES;
  userInfo: any;
  currenciesArr: any;
  uiAccessPermissionsObj: any;
  currency: any;
  showAddBudgetBtnFlagTrue = false;
  projects: any = [];
  budgetId: any;
  projectId: any;
  currencies: any[] = [];
  showBtnGroupFlag: Boolean = true;
  breadcrumbData: any = {
    title: 'projects.labels.projectList',
    subTitle: 'projects.labels.projectListsub',
    data: [{
      text: 'common.labels.home',
      link: '/'
    },
    {
      text: 'projects.labels.projectList',
      link: ROUTER_LINKS.projects
    },
    {
      text: 'projects.labels.manageProjectTitle',
      link: ''
    }
    ]
  };
  common: any;
  error: any;
  projectErrorsArr: any;
  projectDetails: any;
  permissionObj: any = {};
  constructor(private _manageBudgetService: ManageBudgetService, private localStorageService: LocalStorageService, private router: Router,
    private sharedData: SharedData, private route: ActivatedRoute, private projectsData: ProjectsData,
    private triggerService: TriggerService,
    private _sharedService: SharedService,
    private sessionService: SessionService,
    private translateService: TranslateService,
    private toastrService: ToastrService,
    private navigationService: NavigationService) { }

  ngOnInit() {
    $('#manage-project-tabs').hide();
    this.currency = '';
    this.project = this.projectsData.getProjectsData();
    this.projectId = this.projectsData.projectId;
    if (!this.project.defaultCurrencyId && !this.project.defaultCurrencyCode) {
      const projectData: any = {};
      projectData.defaultCurrencyId = DEFAULT_CURRENCY.id;
      projectData.defaultCurrencyCode = DEFAULT_CURRENCY.name;
      this.projectsData.setProjectsData(projectData);
      this.sessionService.setCookie(COOKIES_CONSTANTS.currency, DEFAULT_CURRENCY.name);
    }
    this.userInfo = this.sharedData.getUsersInfo();
    this.route.params.subscribe(params => {
      this.budgetId = params.id;
      this.projectsData.budgetId = this.budgetId;
    });
    this.getCurrencies();
    this.translateFunc();
    this.setBudgetDetails();
    this.setPermissionsDetails();
    this.updateBackToListPath();
    this.subscription = this.triggerService.getEvent().subscribe((data) => {
      if (data.event) {
        if ((data.event.type === EVENT_TYPES.currencyConversionEvent) && data.event.currentValue) {
          this.getCurrencies();
        } else if (data.event.type === EVENT_TYPES.currencyResetEvent) {
          this.currency = ORIGINAL_CURRENCY.id;
        }
      }
    });
    this.setEventType({ type: EVENT_TYPES.manageBudgetEvent, prevValue: {}, currentValue: EVENT_TYPES.manageBudgetEvent });
  }
  ngOnDestroy() {
    $('#manage-project-tabs').show();
    this.subscription.unsubscribe();
    this.setEventType({ type: EVENT_TYPES.backToListEvent, prevValue: {}, currentValue: '' });
  }
  /**
   * It opens swap pop0up to get confirmation if budgeet sheet is to be synced or not if yes, callls respective mrthod.
   */
  syncBudgetSheetData() {
    // tslint:disable-next-line:max-line-length
    const swalObj = Common.swalConfirmPopupObj(this.common.labels.SyncButtonMsg, true, true, this.common.labels.yes, this.common.labels.cancelDelete);
    swal(swalObj, (isConfirm) => {
      if (isConfirm) {
        $('.fa-refresh').addClass('fa-spin');
        this.toastrService.success(this.common.labels.syncWaitMsg);
        this.BudgetSheetServiceCall();
      }
    });
  }
  /**
   * Gets texts from json to be shown on UI
   */
  translateFunc() {
    this.translateService.get('common').subscribe(res => {
      this.common = res;
    });
  }
  /**
   * It syncs the budget sheet details if any updates are there, it callls method to set budget sheet details.
   */
  BudgetSheetServiceCall() {
    this._manageBudgetService.syncBudgetDetails(this.projectId, this.budgetId).subscribe((response: any) => {
      $('.fa-refresh').removeClass('fa-spin');
      this.toastrService.clear();
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        this.setBudgetDetails(true);
        this.toastrService.success(response.header.message);
      } else {
        this.toastrService.error(response.header.message);
      }
    },
      error => {
        $('.fa-refresh').removeClass('fa-spin');
        this.toastrService.clear();
        this.toastrService.error(this.common.errorMessages.responseError);
      });
  }
  /**
   * Gets the updated project details wrt budget sheet and errors if any.
   * @param canTriggerEvent idnetifies if required event is to be triggred or not
   */
  setBudgetDetails(canTriggerEvent: boolean = false) {
    this._manageBudgetService.getBudgetDetails(this.projectId, this.budgetId).subscribe((responseData: any) => {
      if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
        if (responseData.payload && responseData.payload.result) {
          this.projectDetails = responseData.payload.result;
          this.projectErrorsArr = this.projectDetails.errorList;
          if (canTriggerEvent) {
            this.setEventType({ type: EVENT_TYPES.syncWholeProject, prevValue: '', currentValue: '' });
          }
        }
      } else {
        this.toastrService.error(responseData.header.message);
        this.projectDetails = {};
        this.projectErrorsArr = [];
      }
    },
      error => {
        this.projectDetails = {};
        this.projectErrorsArr = [];
        this.toastrService.error(this.common.errorMessages.responseError);
      });
  }
  /**
   * Clears the project's error array
   */
  clearErrorArr() {
    this.projectErrorsArr = [];
  }
  /**
   * Finds the selected currency form array and triggers currency change
   * event to be handeled in po listing, settlemet listing and invoice listing with the required currency data.
   */
  currencyChanged(currency) {
    if (typeof currency === 'string') {
      const currencyObj = _.find(this.currenciesArr, { 'id': currency });
      this.setEventType({ type: EVENT_TYPES.currencyEvent, prevValue: {}, currentValue: currencyObj });
    }
  }
  /**
   * It gets the list of currencies with all related data wrt current project and budget line.
   */
  getCurrencies() {
    this._sharedService.getProjectCurrencies(this.projectsData.budgetId).subscribe((response: any) => {
      if (Common.checkStatusCode(response.header.statusCode)) {
        this.currenciesArr = response.payload.result;
        this.currencies = Common.getMultipleSelectArr(JSON.parse(JSON.stringify(this.currenciesArr)), ['id'], ['code']);
        this.appendOrignalDropdownValue();
      } else {
        this.currencies = [];
        this.currenciesArr = [];
      }
    },
      error => {
        this.currencies = [];
        this.currenciesArr = [];
      }
    );
  }
  /**
   * Appends the Orignal as default value in currency dropdown.
   */
  appendOrignalDropdownValue() {
    this.currencies.splice(0, 0, ORIGINAL_CURRENCY);
  }
  /**
   * IUpdates the path of redirectin to be done on back to list button and trigres required event.
   */
  updateBackToListPath() {
    const url = Common.sprintf(ROUTER_LINKS_FULL_PATH.budgetSheets, [this.projectsData.projectId]);
    this.setEventType({ type: EVENT_TYPES.backToListEvent, prevValue: '', currentValue: url });
  }
  /**
   * It triggers event.
   * @param event is a object having event data
   */
  setEventType(event: any) {
    this.triggerService.setEvent(event);
  }
  /**
   * It gets permission details from shared data and sets roles and permissions on the page.
   */
  setPermissionsDetails() {
    this.permissionObj = this.sharedData.getRolePermissionData();
    this.MODULE_ID = this.route.snapshot.parent.data['moduleID'];
    const modulePermissionObj = this.permissionObj[this.MODULE_ID];
    if (modulePermissionObj.uiAccess) {
      this.uiAccessPermissionsObj = modulePermissionObj.uiAccess;
    }
  }
}
