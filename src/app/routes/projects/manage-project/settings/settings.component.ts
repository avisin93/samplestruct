import { Component, OnInit } from '@angular/core';
import { ROUTER_LINKS_FULL_PATH, UI_ACCESS_PERMISSION_CONST, ROUTER_LINKS } from '@app/config';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedData } from '@app/shared/shared.data';
import { Common } from '@app/common';
import { ProjectsData } from '../../projects.data';

declare var $: any;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  ROUTER_LINKS_FULL_PATH = ROUTER_LINKS_FULL_PATH;
  ROUTER_LINKS = ROUTER_LINKS;
  uiAccessPermissionsObj: any;
  UI_ACCESS_PERMISSION_CONST = UI_ACCESS_PERMISSION_CONST;
  MODULE_ID: any;

  navLinks = [{
    path: ROUTER_LINKS_FULL_PATH.configuration,
    label: 'Configuration'
  },
  {
    path: ROUTER_LINKS_FULL_PATH.paymentTerms,
    label: 'Payment Terms'
  },
  {
    path: ROUTER_LINKS_FULL_PATH.approvalHirerachy,
    label: 'Approval Hierarchy'
  }];
  constructor(
    private sharedData: SharedData,
    private router: Router,
    private projectsData: ProjectsData,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.setPermissionsDetails();
    $('.currency-dropdown').hide();
  }


  setPermissionsDetails() {
    const permissionObj = this.sharedData.getRolePermissionData();
    this.MODULE_ID = this.route.parent.snapshot.data['moduleID'];
    const modulePermissionObj = permissionObj[this.MODULE_ID];
    if (modulePermissionObj.uiAccess) {
      this.uiAccessPermissionsObj = modulePermissionObj.uiAccess;
    }
  }

  navigateTo(link) {
    this.router.navigate([Common.sprintf(link, [this.projectsData.projectId])]);
  }
}
