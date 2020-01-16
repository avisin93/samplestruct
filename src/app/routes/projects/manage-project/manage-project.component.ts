import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ROUTER_LINKS, ROUTER_LINKS_FULL_PATH, ACTION_TYPES, UI_ACCESS_PERMISSION_CONST,
  PROJECT_TYPES, EVENT_TYPES, LOCAL_STORAGE_CONSTANTS, MODULE_ID as MODULE_IDS,
  COOKIES_CONSTANTS,
} from '@app/config';
import { SharedData } from '@app/shared/shared.data';
import { SharedService } from '@app/shared/shared.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService, NavigationService, TriggerService, Common } from '@app/common';
import { Subscription } from 'rxjs/Subscription';
import { ToastrService } from 'ngx-toastr';
import { ManageProjectService } from './manage-project.service';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { ProjectsData } from '../projects.data';

@Component({
  selector: 'app-manage-project',
  templateUrl: './manage-project.component.html',
  styleUrls: ['./manage-project.component.scss']
})
export class ManageProjectComponent implements OnInit, OnDestroy {
  ROUTER_LINKS = ROUTER_LINKS;
  PROJECT_TYPES = PROJECT_TYPES;
  project: any;
  projectTypeId: String = '';
  currencies: any;
  currenciesArr: any;
  isDocSaveClicked: Boolean = false;
  cropperSettings: Boolean = false;
  addBudgetFlag: Boolean = false;
  subscription: Subscription;
  loadingFlag: Boolean = false;
  error: any;
  oldValue: any;
  userInfo: any;
  ACTION_TYPES = ACTION_TYPES;
  uiAccessPermissionsObj: any;
  UI_ACCESS_PERMISSION_CONST = UI_ACCESS_PERMISSION_CONST;
  MODULE_ID: any;
  MODULE_IDS = MODULE_IDS;
  projectId: any;
  projectName: any;
  projectErrorsArr: any;
  currency: any;
  projectDetails: any = {};
  backToListPath = ROUTER_LINKS_FULL_PATH.projects;
  budgetName: any;
  permissionObj: any;
  manageProjectBreadCrumbData = {
    title: 'projects.labels.manageProjectTitle',
    subTitle: 'projects.labels.manageProjectSubTitle',
    data: [{
      text: 'common.labels.home',
      link: '/'
    },
    {
      text: 'projects.labels.projectList',
      link: ROUTER_LINKS_FULL_PATH.projects
    },
    {
      text: 'projects.labels.manageProjectTitle',
      link: ''
    }
    ]
  };
  breadcrumbData: any = {};
  budgetReportBreadCrumbData = {
    title: 'common.labels.viewBudget',
    subTitle: 'common.labels.budgetViewSubTitle',
    data: [{
      text: 'common.labels.home',
      link: '/'
    },
    {
      text: 'projects.labels.projectList',
      link: ROUTER_LINKS_FULL_PATH.projects
    },
    {
      text: 'projects.labels.manageProjectTitle',
      link: ''//updating path on event subscription
    },
    {
      text: 'common.labels.budgets',
      link: ''//updating path on event subscription
    },
    {
      text: 'common.labels.viewBudget',
      link: ''
    }]
  };
  budgetWorkingBreadCrumbData = {
    title: 'common.labels.addWorking',
    subTitle: 'common.labels.addWorkingSubtitle',
    data: [{
      text: 'common.labels.home',
      link: '/'
    },
    {
      text: 'projects.labels.projectList',
      link: ROUTER_LINKS_FULL_PATH.projects
    },
    {
      text: 'projects.labels.manageProjectTitle',
      link: ''//updating path on event subscription
    },
    {
      text: 'common.labels.budgets',
      link: '',//updating path on event subscription
    },
    {
      text: 'common.labels.addWorking',
      link: ''
    }]
  };
  manageBudgetBreadCrumbData: any = {
    title: 'projects.labels.manageProjectTitle',
    subTitle: 'projects.labels.manageProjectSubTitle',
    data: [{
      text: 'common.labels.home',
      link: '/'
    },
    {
      text: 'projects.labels.projectList',
      link: ROUTER_LINKS_FULL_PATH.projects
    },
    {
      text: 'projects.labels.manageProjectTitle',
      link: ''//updating path on event subscription
    },
    {
      text: 'common.labels.budgets',
      link: '',//updating path on event subscription
    },
    {
      text: 'common.labels.managebudget',
      link: ''
    }]
  };
  constructor(private sharedData: SharedData,
    private projectsData: ProjectsData,
    private route: ActivatedRoute,
    private sessionService: SessionService,
    private triggerService: TriggerService,
    private _sharedService: SharedService,
    private navigationService: NavigationService,
    private _projectService: ManageProjectService,
    private toastrService: ToastrService, private translate: TranslateService) {
    this.breadcrumbData = this.manageProjectBreadCrumbData;
  }

  ngOnInit() {
    Common.scrollTOTop();
    this.project = this.projectsData.getProjectsData();
    this.userInfo = this.sharedData.getUsersInfo();
    this.route.params.subscribe(params => {
      if (this.project) {
        this.project.projectId = params.id;
      } else {
        this.project = {
          "projectId": params.id
        };
      }
      this.projectsData.setProjectsData(this.project);
      this.projectId = params.id;
      this.projectsData.projectId = this.projectId;
      this.getProjectDetails();
    });
    this.handleTriggerEvents();
    this.translate.get('common').subscribe(res => {
      this.error = res;
    });
    this.setPermissionsDetails();
  }
  handleTriggerEvents() {
    this.subscription = this.triggerService.getEvent().subscribe((data) => {
      if (data.event && data.event.type) {
        switch (data.event.type) {
          case EVENT_TYPES.backToListEvent:
            this.backToListPath = data.event.currentValue ? data.event.currentValue : ROUTER_LINKS_FULL_PATH.projects;
            this.breadcrumbData = this.manageProjectBreadCrumbData;
            if (data.event.currentValue && data.event.currentValue.clearBudgetName) {
              this.budgetName = '';
            }
            break;
          case EVENT_TYPES.syncWholeProject:
            this.getProjectDetails();
            break;
          case EVENT_TYPES.addBudgetEvent:
            this.addBudgetFlag = data.event.currentValue;
            break;
          case EVENT_TYPES.manageBudgetEvent:
            this.breadcrumbData = this.manageBudgetBreadCrumbData;
            this.setBreadCrumbRouterLinks();
            break;
          case EVENT_TYPES.budgetReportEvent:
            this.breadcrumbData = this.budgetReportBreadCrumbData;
            this.setBreadCrumbRouterLinks();
            break;
          case EVENT_TYPES.budgetTableEvent:
            this.budgetName = (data.event.currentValue && data.event.currentValue.budgetName) ? data.event.currentValue.budgetName : '';
            break;
          case EVENT_TYPES.updateBudgetWokingBreadcrumbEvent:
            this.breadcrumbData = this.budgetWorkingBreadCrumbData;
            this.setBreadCrumbRouterLinks();
            break;
        }
      }
    });
  }
  setBreadCrumbRouterLinks() {
    this.breadcrumbData.data[2]['link'] = Common.sprintf(ROUTER_LINKS_FULL_PATH.manageProject, [this.projectId]);
    this.breadcrumbData.data[3]['link'] = Common.sprintf(ROUTER_LINKS_FULL_PATH.budgetSheets, [this.projectId]);
  }
  showBudgetModal() {
    this.setEventType({ type: EVENT_TYPES.showBudgetModalEvent, prevValue: {}, currentValue: EVENT_TYPES.showBudgetModalEvent });
  }
  getProjectDetails() {
    this.loadingFlag = true;
    this._projectService.getProjectDetails(this.projectId).subscribe((response: any) => {
      this.loadingFlag = false;
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.result) {
          this.projectDetails = response.payload.result;
          this.projectsData.projectsDetails = this.projectDetails;
          this.projectTypeId = this.projectDetails.projectType.id;
          this.projectErrorsArr = this.projectDetails.errors;
          this.setEventType({ type: EVENT_TYPES.projectDetailsEvent, prevValue: {}, currentValue: this.projectDetails });
        } else {
          this.projectDetails = {};
          this.projectsData.projectsDetails = this.projectDetails;
        }
      }
      else {
        this.projectDetails = {};
        this.projectsData.projectsDetails = this.projectDetails;
        this.toastrService.error(response.header.message);
      }
    }, error => {
      this.loadingFlag = false;
      this.projectDetails = {};
      this.projectsData.projectsDetails = this.projectDetails;
    });
  }



  setEventType(event: any) {
    this.triggerService.setEvent(event);
  }

  // set module permission details
  setPermissionsDetails() {
    this.permissionObj = this.sharedData.getRolePermissionData();
    this.MODULE_ID = this.route.snapshot.parent.data['moduleID'];

    const modulePermissionObj = this.permissionObj[this.MODULE_ID];
    if (modulePermissionObj.uiAccess) {
      this.uiAccessPermissionsObj = modulePermissionObj.uiAccess;
    }
  }

  clearErrorArr() {
    this.projectErrorsArr = [];
  }

  navigateTo() {
    this.navigationService.navigate(this.backToListPath);
    if (this.backToListPath == ROUTER_LINKS_FULL_PATH.projects) {
      this.sessionService.removeLocalStorageItem(LOCAL_STORAGE_CONSTANTS.projectData);
      this.projectsData.projectId = '';
    }
    else {
      delete this.project['budgetName'];
      delete this.project['currencyId'];
      delete this.project['defaultCurrencyId'];
      delete this.project['defaultCurrencyCode'];
      this.projectsData.budgetId = '';
      this.projectsData.setProjectsData(this.project);
      this.sessionService.deleteCookie(COOKIES_CONSTANTS.currency);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.projectsData.setProjectsData({});
    this.triggerService.setEvent({ type: EVENT_TYPES.errorDisplayEvent, prevValue: [], currentValue: [] });
    this.projectErrorsArr = [];
    this.sessionService.deleteCookie(COOKIES_CONSTANTS.currency);
  }

}
