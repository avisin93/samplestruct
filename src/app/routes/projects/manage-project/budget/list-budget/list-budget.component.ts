import {
  Component, OnInit, ViewEncapsulation, OnDestroy
} from '@angular/core';
import {
  FormGroup, FormBuilder, FormArray
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import {
  ROUTER_LINKS_FULL_PATH,
  COMPANY,
  PROJECT_DIVISION,
  PROJECT_TYPES,
  UI_ACCESS_PERMISSION_CONST,
  ACTION_TYPES,
  CustomTableConfig,
  COOKIES_CONSTANTS,
  CURRENCY_CONVERSION_CONST,
  DEFAULT_COMPANY,
  DEFAULT_CURRENCY,
  ROUTER_LINKS,
  ROLES_CONST,
  EVENT_TYPES,
  STATUS_CODES
} from '@app/config';
import { LocalStorageService } from 'angular-2-local-storage';
import * as _ from 'lodash';
import { SharedData } from '@app/shared/shared.data';
import { ProjectsData } from '../../../projects.data';
import { SessionService, Common, TriggerService, NavigationService } from '@app/common';
import { ListBudgetService } from './list-budget.services';
import { ManageBudgetListData } from './list-budget.data.model';
import { Subscription } from 'rxjs/Subscription';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AddBudgetComponent } from '../add-budget/add-budget.component';
import { SharedService } from '@app/shared/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-list-budget',
  templateUrl: './list-budget.component.html',
  styleUrls: ['./list-budget.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListBudgetComponent implements OnInit, OnDestroy {
  // array2 = [];
  // sum2 = 100;
  UI_ACCESS_PERMISSION_CONST = UI_ACCESS_PERMISSION_CONST;
  ROUTER_LINKS_FULL_PATH = ROUTER_LINKS_FULL_PATH;
  PROJECT_TYPES = PROJECT_TYPES;
  PROJECT_DIVISION = PROJECT_DIVISION;
  permissionObj: any = {};
  BUDGET_LIST_QUERY_PARAMS = {
    'pageSize': 'pageSize',
    'pageNo': 'pageNo',
  };
  subscription: Subscription;
  MODULE_ID: any;
  langCode: any;
  ACTION_TYPES = ACTION_TYPES;
  viewBudgetFlag: Boolean = false;
  addWorkingFlag: Boolean = false;
  userInfo: any;
  uiAccessPermissionsObj: any;
  public page: any = 1;
  currentPage: any = CustomTableConfig.pageNumber;
  itemsPerPage: any = 9;
  hideCurrencyDropdownFlag: Boolean = false;
  budgetSheetsArr: any = [];
  currencies: any = [];
  budgetListForm: FormGroup;
  dropdownLabel: any = DEFAULT_COMPANY.name;
  companyFilter: any = DEFAULT_COMPANY.id;
  spinnerFlag: Boolean = false;
  showLoaderFlag: Boolean = true;
  bsModalRef: BsModalRef;
  projectDetails: any;
  project: any;
  STATUS_CODES = STATUS_CODES;
  breadcrumbData: any = {
    title: 'projects.labels.budgetList',
    subTitle: 'projects.labels.budgetListsub',
    data: [{
      text: 'common.labels.home',
      link: '/'
    },
    {
      text: 'projects.labels.projectList',
      link: ROUTER_LINKS.projects
    },
    {
      text: 'projects.labels.budgetList',
      link: ''
    }
    ]
  };
  error: any;
  common: any;

  constructor(private fb: FormBuilder,
    private _listBudgetService: ListBudgetService,
    private router: Router,
    private triggerService: TriggerService,
    private sharedData: SharedData,
    private projectsData: ProjectsData,
    private route: ActivatedRoute,
    private sessionService: SessionService,
    private _sharedService: SharedService,
    private translateService: TranslateService,
    private toastrService: ToastrService,
    private modalService: BsModalService,
    private navigationService: NavigationService) {
  }
  ngOnInit() {
    this.project = this.projectsData.getProjectsData();

    this.userInfo = this.sharedData.getUsersInfo();
    this.langCode = this.sessionService.getCookie(COOKIES_CONSTANTS.langCode);
    this.translateFunc();
    this.createForm();
    this.setPermissionsDetails();
    this.setInitialProjectList();
    // this.setEventType({ type: EVENT_TYPES.addBudgetEvent, prevValue: {}, currentValue: true });
    this.subscription = this.triggerService.getEvent().subscribe((data) => {
      if (data.event) {
        // tslint:disable-next-line:triple-equals
        if ((data.event.type == EVENT_TYPES.showBudgetModalEvent) && data.event.currentValue) {
          const initialState = {
            budgetTypeIds: []
          };
          const availabeBudgetTypeIds = [];
          for (let budgetIndex = 0; budgetIndex < this.budgetListForm.value.budgetSheetsArr.length; budgetIndex++) {
            initialState.budgetTypeIds.push(this.budgetListForm.value.budgetSheetsArr[budgetIndex].budgetTypeId);
            availabeBudgetTypeIds.push(this.budgetListForm.value.budgetSheetsArr[budgetIndex].budgetTypeId);
          }
          let budgetTypesArr = [];
          this._sharedService.getBudgetTypes().subscribe((response: any) => {
            if (Common.checkStatusCode(response.header.statusCode)) {
              if (response.payload && response.payload.results) {
                budgetTypesArr = response.payload.results;
                for (let index = 0; index < availabeBudgetTypeIds.length; index++) {
                  const objectIndex = _.findIndex(budgetTypesArr, { 'id': availabeBudgetTypeIds[index] });
                  budgetTypesArr.splice(objectIndex, 1);
                }
                initialState.budgetTypeIds = budgetTypesArr;
                this.bsModalRef = this.modalService.show(AddBudgetComponent, { initialState });
              } else {
                budgetTypesArr = [];
                this.toastrService.error(response.header.message);
              }
            }
            else {
              budgetTypesArr = [];
              this.toastrService.error(response.header.message);
            }
          }, error => {
            budgetTypesArr = [];
            this.toastrService.error(this.error.errorMessages.responseError);
          });
        }
        if ((data.event.type === EVENT_TYPES.refreshBudgetListEvent) && data.event.currentValue) {
          if (this.budgetListForm) {
            const BudgetListArrayLength = this.budgetListForm.value.budgetSheetsArr.length;
            // this.budgetListForm.controls.budgetSheetsArr.setValue([]);
            for (let index = 0; index < BudgetListArrayLength; index++) {
              const budgetArr = <FormArray>this.budgetListForm.controls['budgetSheetsArr'];
              budgetArr.removeAt(0);
            }
            this.setInitialProjectList();
          }
        }
      }
    });

  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.triggerService.setEvent({ type: EVENT_TYPES.addBudgetEvent, prevValue: {}, currentValue: false });
  }
  createForm() {
    this.budgetListForm = this.fb.group({
      budgetSheetsArr: this.fb.array([])
    });
  }
  translateFunc() {
    this.translateService.get('common').subscribe(res => {
      this.common = res;
    });
    this.translateService.get('error').subscribe(res => {
      this.error = res;
    });
  }
  // set module permission details
  setPermissionsDetails() {
    this.permissionObj = this.sharedData.getRolePermissionData();
    this.MODULE_ID = this.route.snapshot.parent.data['moduleID'];
    const modulePermissionObj = this.permissionObj[this.MODULE_ID];

    if (modulePermissionObj.uiAccess) {
      this.uiAccessPermissionsObj = modulePermissionObj.uiAccess;

      if (this.uiAccessPermissionsObj && this.uiAccessPermissionsObj['removeFields'] &&
        this.uiAccessPermissionsObj['removeFields']['currency']) {
        this.hideCurrencyDropdownFlag = true;
      }
      if (this.uiAccessPermissionsObj && this.uiAccessPermissionsObj['removeActions'] &&
        this.uiAccessPermissionsObj['removeActions']['addWorking']) {
        this.viewBudgetFlag = true;
      }
      if (this.uiAccessPermissionsObj && this.uiAccessPermissionsObj['removeActions'] &&
        this.uiAccessPermissionsObj['removeActions']['viewBudget']) {
        this.addWorkingFlag = true;
      }
    }
  }
  setEventType(event: any) {
    this.triggerService.setEvent(event);
  }
  setInitialProjectList() {
    this.currentPage = 1;
    this.setLoaderFlagsAndUpdateListArr(true, false, true);
  }
  setLoaderFlagsAndUpdateListArr(showLoaderFlag: boolean, spinnerFlag: boolean, canMakeApiCall: boolean) {
    this.showLoaderFlag = showLoaderFlag;
    if (canMakeApiCall) {
      this.setBudgetSheetListArr();
    }
    else {
      this.budgetSheetsArr = [];
    }
  }
  createProjectFormArr(projects) {
    const budgetSheetsArr = <FormArray>this.budgetListForm.get('budgetSheetsArr');
    for (let budgetIndex = 0; budgetIndex < projects.length; budgetIndex++) {
      budgetSheetsArr.push(this.createProjectFormGroup());
    }
    budgetSheetsArr.setValue(projects);
  }
  createProjectFormGroup(): FormGroup {
    return this.fb.group({
      id: [''],
      name: [''],
      budgetTypeId: [''],
      errorsCount: [''],
      defaultCurrencyId: [''],
      defaultCurrencyCode: [''],
      currencyConversions: [''],
      currencyId: [''],
      currencyCode: [''],
      currencySymbol: [''],
      projectEstimation: [''],
      purchaseOrderEstimation: [''],
      actualEstimation: [''],
      budgetSheetUrl: ['']
    });
  }
  setBudgetSheetListArr() {
    this._listBudgetService.getbudgetList(this.getSearchQueryParam(), this.project.projectId).subscribe((response: any) => {
      if (response.header.statusCode && Common.checkStatusCodeInRange(response.header.statusCode)) {
        this.showLoaderFlag = false;
        if (response.payload && response.payload.result) {
          const projectListDataArr = ManageBudgetListData.getbudgetListDetails(response.payload.result);
          this.budgetSheetsArr = projectListDataArr;
          if (this.budgetSheetsArr.length === 6) {
            this.setEventType({ type: EVENT_TYPES.addBudgetEvent, prevValue: {}, currentValue: false });
          } else {
            this.setEventType({ type: EVENT_TYPES.addBudgetEvent, prevValue: {}, currentValue: true });
          }
          this.createProjectFormArr(this.budgetSheetsArr);
        } else {
          this.budgetSheetsArr = [];
        }
      } else {
        this.budgetSheetsArr = [];
        this.showLoaderFlag = false;
        this.toastrService.error(response.header.message);
        this.setEventType({ type: EVENT_TYPES.addBudgetEvent, prevValue: {}, currentValue: true });

      }
    },
      error => {
        this.setLoaderFlagsAndUpdateListArr(false, false, false);
        this.toastrService.error(this.common.errorMessages.responseError);
      });
  }

  getSearchQueryParam() {
    let params: HttpParams = new HttpParams();
    params = params.append(this.BUDGET_LIST_QUERY_PARAMS.pageSize, this.itemsPerPage.toString());
    params = params.append(this.BUDGET_LIST_QUERY_PARAMS.pageNo, this.currentPage.toString());
    return params;
  }
  currencyChanged(projectFormGroup: FormGroup, i) {
    const formValue = projectFormGroup.value;
    const project = JSON.parse((JSON.stringify(this.budgetSheetsArr[i])));
    const currencies = project.currencyConversions;
    const currencyId = formValue.currencyId;
    const currencyObj = _.find(currencies, { 'targetId': currencyId });
    const projectEstimation = project.projectEstimation;
    const purchaseOrderEstimation = project.purchaseOrderEstimation;
    const actualEstimation = project.actualEstimation;
    // tslint:disable-next-line:max-line-length
    const convertedProjectEstimation = Common.convertValue(CURRENCY_CONVERSION_CONST.defaultToOthers, projectEstimation, currencyObj.targetUnit);
    // tslint:disable-next-line:max-line-length
    const convertedPurchaseOrderEstimation = Common.convertValue(CURRENCY_CONVERSION_CONST.defaultToOthers, purchaseOrderEstimation, currencyObj.targetUnit);
    // tslint:disable-next-line:max-line-length
    const convertedActualEstimation = Common.convertValue(CURRENCY_CONVERSION_CONST.defaultToOthers, actualEstimation, currencyObj.targetUnit);
    projectFormGroup.controls['projectEstimation'].setValue(convertedProjectEstimation.toFixed(2));
    projectFormGroup.controls['purchaseOrderEstimation'].setValue(convertedPurchaseOrderEstimation.toFixed(2));
    projectFormGroup.controls['actualEstimation'].setValue(convertedActualEstimation.toFixed(2));
    projectFormGroup.controls['currencyCode'].setValue(currencyObj.targetCode);
    projectFormGroup.controls['currencySymbol'].setValue(currencyObj.targetSymbol);
  }


  manageBudgetSheet(budget) {
    this.project['budgetName'] = budget.name;
    // this.project['currencyId'] = budget.currencyId;
    this.project['defaultCurrencyId'] = budget.defaultCurrencyId;
    this.project['defaultCurrencyCode'] = budget.defaultCurrencyCode;
    this.projectsData.setProjectsData(this.project);
    // this.sessionService.setCookie(COOKIES_CONSTANTS.currency, budget.currencyCode);
    // if (this.uiAccessPermissionsObj && this.uiAccessPermissionsObj.disableFields) {
    //   const disableFields = this.uiAccessPermissionsObj.disableFields;
    // if (disableFields.projecPalTab) {
    this.navigationService.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.purchaseOrder, [this.projectsData.projectId, budget.id])]);
    // }
    // else {
    //   this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.assignmentNew, [this.projectsData.projectId])]);
    // }
    // }
  }
  budgetInfo(budget) {
    this.project['budgetId'] = budget.id;
    this.projectsData.setProjectsData(this.project);
    this.navigationService.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.budgetReport,
      [this.projectsData.projectId, budget.id])]);
  }
  navigateToBudgetWorking(budget) {
    this.navigationService.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.manageBudgetWorking, [this.projectsData.projectId, budget.id])]);
  }
}
