import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ROUTER_LINKS, UI_ACCESS_PERMISSION_CONST, ACTION_TYPES, ROLES_CONST, PROJECT_TYPES, LOCAL_STORAGE_CONSTANTS } from '../../../../config';
import { SharedData } from '../../../../shared/shared.data';
import { Router, ActivatedRoute } from '@angular/router';
import { Common, SessionService, NavigationService } from '../../../../common'
import { ProjectsData } from '../../projects.data';
declare var $:any;
@Component({
  selector: 'app-payment-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProjectDetailsComponent implements OnInit {
  ROUTER_LINKS=ROUTER_LINKS;
  UI_ACCESS_PERMISSION_CONST = UI_ACCESS_PERMISSION_CONST;
  MODULE_ID: any;
  ACTION_TYPES = ACTION_TYPES;
  PROJECT_TYPES = PROJECT_TYPES;
  userInfo: any;
  ROLES_CONST = ROLES_CONST;
  uiAccessPermissionsObj: any;
  project: any;
  constructor(private sharedData: SharedData,
    private route: ActivatedRoute,
    private router: Router,
    private projectsData: ProjectsData,
    private sessionService: SessionService) { }

  ngOnInit() {

    this.userInfo = this.sharedData.getUsersInfo();
    this.setPermissionsDetails();
    this.project = this.projectsData.getProjectsData();
    $(".budget-details-tab").addClass("active");
    $(".currency-dropdown").show();
  }
  //set module permission details
  setPermissionsDetails() {
    var permissionObj = this.sharedData.getRolePermissionData();
    this.MODULE_ID = this.route.snapshot.parent.data['moduleID'];
    var modulePermissionObj = permissionObj[this.MODULE_ID];
    if (modulePermissionObj.uiAccess) {
      this.uiAccessPermissionsObj = modulePermissionObj.uiAccess;
    }
  }

  ngOnDestroy() {
    $(".project-details-tab").removeClass("active");
  }
  navigateTo(link) {
    this.router.navigate([Common.sprintf(link, [this.projectsData.projectId])]);
  }
}
