import { Component, OnInit } from '@angular/core';
import { ROUTER_LINKS, ACTION_TYPES, UI_ACCESS_PERMISSION_CONST, PROJECT_TYPES, LOCAL_STORAGE_CONSTANTS } from '../../../../config';
import { SharedData } from '@app/shared/shared.data';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from '@app/shared/shared.service';
import { NavigationService } from '@app/common';
@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss']
})
export class BudgetComponent implements OnInit {
  ROUTER_LINKS = ROUTER_LINKS;
  PROJECT_TYPES = PROJECT_TYPES;
  project: any;
  cropperSettings = false;
  breadcrumbData: any = {
    title: 'projects.labels.manageProjectTitle',
    subTitle: 'projects.labels.manageProjectSubTitle',
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


  userInfo: any;
  ACTION_TYPES = ACTION_TYPES;
  uiAccessPermissionsObj: any;
  UI_ACCESS_PERMISSION_CONST = UI_ACCESS_PERMISSION_CONST;
  MODULE_ID: any;
  currency: any;

  currenciesArr: any;
  currencies: any[] = [
    { value: '0', label: 'EUR' },
    { value: '1', label: 'USD' },
    { value: '2', label: 'MXN' },
    { value: '3', label: 'GBP' },
  ];
  constructor(
    private sharedData: SharedData,
    private _sharedService: SharedService,
    private route: ActivatedRoute,
    private navigationService: NavigationService
  ) { }

  ngOnInit() {
    this.userInfo = this.sharedData.getUsersInfo();
  }

  navigateTo() {
    this.navigationService.navigate(ROUTER_LINKS.projects);

  }
}
