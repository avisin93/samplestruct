import { Component, OnInit, ViewEncapsulation, HostListener, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomValidators } from 'ng2-validation';
import { TranslateService } from '@ngx-translate/core';
import { HttpParams } from '@angular/common/http';
import { ListProjectsService } from './list-projects.service';
import { SharedData } from '@app/shared/shared.data';
import { Common } from '@app/common';
import { ProjectsData } from '../projects.data';
import { ManageProjectListData } from './list-projects.data.model';
declare var $: any;
import {
  ROUTER_LINKS_FULL_PATH, COMPANY, PROJECT_DIVISION, PROJECT_TYPES_ARR, PROJECT_TYPES, UI_ACCESS_PERMISSION_CONST,
  ROLES_CONST, ACTION_TYPES, CustomTableConfig, PROJECT_DIVISION_CONST, DEFAULT_COMPANY
} from '@app/config';
import { setTimeout } from 'timers';
import { PROJECT_LIST_PAGE_SIZE } from '../constants';

@Component({
  selector: 'app-list-projects',
  templateUrl: './list-projects.component.html',
  styleUrls: ['./list-projects.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListProjectsComponent implements OnInit, OnDestroy {
  UI_ACCESS_PERMISSION_CONST = UI_ACCESS_PERMISSION_CONST;
  PROJECT_DIVISION_CONST = PROJECT_DIVISION_CONST;
  ROUTER_LINKS_FULL_PATH = ROUTER_LINKS_FULL_PATH;
  ROLES_CONST = ROLES_CONST;
  PROJECT_TYPES = PROJECT_TYPES;
  MODULE_ID: any;
  langCode: any;
  ACTION_TYPES = ACTION_TYPES;
  companyChangeFlag: Boolean = false;
  isSearchClicked: Boolean = false;
  COMPANY = COMPANY;
  userInfo: any;
  counter = 0;
  PROJECT_LIST_QUERY_PARAMS = {
    'pageSize': 'pageSize',
    'pageNo': 'pageNo',
    'companyId': 'companyId',
    'projectName': 'projectName',
    'projectTypeId': 'projectTypeId',
    'division': 'division'
  };
  uiAccessPermissionsObj: any;
  page: any = CustomTableConfig.pageNumber;
  currentPage: any = CustomTableConfig.pageNumber;
  itemsPerPage: Number = PROJECT_LIST_PAGE_SIZE;
  projectsArr: any = [];
  projectFilterForm: FormGroup;
  selectedCompanyName: string = '';
  selectedCompanyId: any = DEFAULT_COMPANY.id;
  showLoaderFlag: Boolean = true;
  showSpinnerFlag: Boolean = false;
  companiesList: any = [];
  breadcrumbData: any = {
    title: 'projects.labels.projectList',
    subTitle: 'projects.labels.projectListsub',
    data: [{
      text: 'common.labels.home',
      link: '/'
    },
    {
      text: 'projects.labels.projectList',
      link: ''
    }
    ]
  };
  projects: any = [];

  totalItems: any;
  showLoader: Boolean = false;
  // spinnerFlag: boolean = true;
  companies: any;
  PROJECT_DIVISION: { id: number; text: string; }[];
  PROJECT_TYPES_ARR: { id: number; text: string; }[];
  commonLabels: any;
  apiCallCount: any = 0;
  permissionObj:any={};
  constructor(private fb: FormBuilder,
    private translateService: TranslateService,
    private _listProjectsService: ListProjectsService,
    private router: Router,
    private projectsData: ProjectsData,
    private sharedData: SharedData,
    private route: ActivatedRoute
    , ) {
  }
  ngOnInit() {
    this.translateService.get('pages').subscribe((res: string) => {
      this.commonLabels = res;
    });
    this.createForm();
    this.getDropdownValues();
  }

  ngOnDestroy() {
    this.isSearchClicked = false;
  }
  getDropdownValues() {
    this.PROJECT_DIVISION = Common.changeDropDownValues(this.translateService, PROJECT_DIVISION);
    this.PROJECT_TYPES_ARR = Common.changeDropDownValues(this.translateService, PROJECT_TYPES_ARR);

    this.setPermissionsDetails();
    this.setCompanyListArr();
    this.setInitialProjectList();
  }

  /**
* Submits on enter key
* @param event as enter key event
*/
  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.search();
    }
  }
  createForm() {
    this.projectFilterForm = this.fb.group({
      name: [''],
      type: [''],
      division: ['']
    });
  }
  search() {
    this.isSearchClicked = true;
    this.companyChangeFlag = false;
    this.counter = 0;
    this.projectsArr = [];
    this.setInitialProjectList();
  }
  clear() {
    this.isSearchClicked = false;
    this.companyChangeFlag = false;
    this.clearFilterForm();
    this.counter = 0;
    this.projectsArr = [];
    this.setInitialProjectList();
  }
  clearFilterForm() {
    this.projectFilterForm.reset();
    this.projectFilterForm.patchValue({
      name: '',
      type: '',
      division: '',
    });
  }
  setDefaultPage() {
    this.currentPage = CustomTableConfig.pageNumber;
    this.page = CustomTableConfig.pageNumber;
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
  getSearchQueryParam() {
    let params: HttpParams = new HttpParams();
    params = params.append(this.PROJECT_LIST_QUERY_PARAMS.pageSize, this.itemsPerPage.toString());
    params = params.append(this.PROJECT_LIST_QUERY_PARAMS.pageNo, this.currentPage.toString());
    if (this.selectedCompanyId) {
      params = params.append(this.PROJECT_LIST_QUERY_PARAMS.companyId, this.selectedCompanyId);
    }

    if (this.projectFilterForm) {
      const formValues = this.projectFilterForm.value;
      if (formValues.name && !this.companyChangeFlag) {
        params = params.append(this.PROJECT_LIST_QUERY_PARAMS.projectName, formValues.name.trim());
      }

      if (formValues.type && !this.companyChangeFlag) {
        params = params.append(this.PROJECT_LIST_QUERY_PARAMS.projectTypeId, formValues.type);
      }

      if (formValues.division && !this.companyChangeFlag) {
        params = params.append(this.PROJECT_LIST_QUERY_PARAMS.division, formValues.division);
      }
    }

    return params;
  }

  setCompanyListArr() {
    this._listProjectsService.getCompanyList().subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.results) {
          this.companiesList = response.payload.results;
        } else {
          this.companiesList = [];
        }
      } else {
        this.companiesList = [];
      }
    },
      error => {
        this.companiesList = [];
      });
  }
  setInitialProjectList() {
    this.setDefaultPage();
    this.setLoaderFlagsAndUpdateListArr(true, false, true, true);
  }
  onScrollDown() {
    if (!this.showLoaderFlag && !this.showSpinnerFlag) {
      this.currentPage += 1;
      this.setLoaderFlagsAndUpdateListArr(false, true, true, false);
    }
  }
  setLoaderFlagsAndUpdateListArr(showLoaderFlag: boolean, showSpinnerFlag: boolean, canMakeApiCall: boolean, canReassignListArr: boolean) {
    this.showLoaderFlag = showLoaderFlag;
    this.showSpinnerFlag = showSpinnerFlag;
    if (canMakeApiCall) {
      this.setProjectListArr(canReassignListArr);
    }
    else {
      this.projectsArr = [];
    }
  }

  setProjectListArr(canReassignListArr: boolean) {
    ++this.apiCallCount;
    this.counter++;
    this._listProjectsService.getProjectsList(this.getSearchQueryParam()).subscribe((response: any) => {
      if (response.header.statusCode && Common.checkStatusCodeInRange(response.header.statusCode)) {
        --this.apiCallCount;
        if (response.payload && response.payload.results) {
          const projectListDataArr = ManageProjectListData.getProjectListDetails(response.payload.results);
          if (canReassignListArr) {
            this.projectsArr = projectListDataArr;
          }
          else {
            for (let projectIndex = 0; projectIndex < projectListDataArr.length; projectIndex++) {
              this.projectsArr.push(projectListDataArr[projectIndex]);
            }
          }
          if ((this.counter < 4) && (projectListDataArr.length > 0)) {
            setTimeout(() => {
              if ($(document).height() == $(window).height()) {
                this.onScrollDown();
              }
            }, 500);
          }
          if (this.apiCallCount <= 0) {
            this.showSpinnerFlag = false;
            this.showLoaderFlag = false;
          }
        } else {
          --this.apiCallCount;
          this.projectsArr = [];
          this.isSearchClicked = false;
        }
      } else {
        --this.apiCallCount;
        this.projectsArr = [];
        this.isSearchClicked = false;
        if (this.apiCallCount <= 0) {
          this.showSpinnerFlag = false;
          this.showLoaderFlag = false;
        }
      }
    },
      error => {
        --this.apiCallCount;
        this.isSearchClicked = false;
        this.setLoaderFlagsAndUpdateListArr(false, false, false, false);
      });
  }


  companyChanged(company) {
    this.companyChangeFlag = true;
    if (this.selectedCompanyId != company.id) {
      this.projectsArr = [];
      this.isSearchClicked = false;
      this.clearFilterForm();
      if (company) {
        this.selectedCompanyId = company.id;
        this.selectedCompanyName = company.i18n.name;
      }
      this.counter = 0;
      this.setInitialProjectList();
    }
  }
  manageProject(project) {
    const tempProjectData = {
      projectName: project.name,
      projectType: project.type,
      projectId: project.id,
      projectTypeId: project.projectTypeId
    };
    this.projectsData.setProjectsData(tempProjectData);
    if (this.uiAccessPermissionsObj) {
      const removeTabs = this.uiAccessPermissionsObj.removeTabs;
      if (removeTabs && removeTabs.projecTab) {
        if (removeTabs.projecPalTab) {
          this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.budgetSheets, [project.id])]);
        } else {
          if (project.projectTypeId !== PROJECT_TYPES.corporate) {
            this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.assignmentNew, [project.id])]);
          } else {
            this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.budgetSheets, [project.id])]);
          }
        }
      } else {
        if (project.projectTypeId !== PROJECT_TYPES.corporate) {
          this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.projectDetails, [project.id])]);
        }
        else {
          this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.budgetSheets, [project.id])]);
        }
      }
    } else {
      this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.projectDetails, [project.id])]);
    }
  }
}
