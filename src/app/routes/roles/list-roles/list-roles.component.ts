import { Component, OnInit } from '@angular/core';
import { CustomTableConfig, ACTION_TYPES, Status, State, ROUTER_LINKS_FULL_PATH } from '@app/config';
import { NavigationService, Common } from '@app/common';
import { ListRolesService } from './list-roles.service';
import { HttpParams } from '@angular/common/http';
import { SharedData } from '@app/shared/shared.data';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list-roles',
  templateUrl: './list-roles.component.html',
  styleUrls: ['./list-roles.component.scss']
})
export class ListRolesComponent implements OnInit {

  totalItems: any;
  currentPage: any = CustomTableConfig.pageNumber;
  itemsPerPage: Number = CustomTableConfig.pageSize;
  maxPageLinkSize: Number = CustomTableConfig.maxPageLinkSize;
  ACTION_TYPES = ACTION_TYPES;
  permissionArr: any;
  uiAccessPermissionsObj: any;
  page: any = 1;
  MODULE_ID: any;
  status = Status;
  state = State;
  showLoadingFlg: boolean = false;
  breadcrumbData: any = {
    title: 'roles.labels.roleList',
    subTitle: 'roles.labels.listOfRoles',
    data: [{
      text: 'common.labels.home',
      link: '/'
    },
    {
      text: 'roles.labels.rolesList',
      link: ''
    }
    ]
  };
  ROLES_LIST_QUERY_PARAMS = {
    'pageSize': 'pageSize',
    'pageNo': 'pageNo'
  };

  showLoaderFlag: Boolean = false;
  rolesListingArr: any = [];
  index: any = 1;
  constructor(
    private navigationService: NavigationService,
    private listRolesService: ListRolesService,
    private sharedData: SharedData,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.setRolesListArr();
    this.setPermissionsDetails();
  }

  /*set action & ui control permissions based on role of logged in agency*/

  setPermissionsDetails() {
    this.permissionArr = this.sharedData.getRolePermissionData();
    this.MODULE_ID = this.activatedRoute.snapshot.parent.parent.parent.data['moduleID'];
    const modulePermissionObj = this.permissionArr[this.MODULE_ID];
    if (modulePermissionObj.uiAccess) {
      this.uiAccessPermissionsObj = modulePermissionObj.uiAccess;
    }
  }

  /**
   * Redirecting to Manage roles screen
   * @param roleId as String of Role Id
   */
  navigateTo(roleId?: String) {
    if (roleId) {
      this.navigationService.navigate([ROUTER_LINKS_FULL_PATH['manageRoles'], roleId]);
    } else {
      this.navigationService.navigate([ROUTER_LINKS_FULL_PATH['manageRoles']]);
    }
  }

  /**
 * It gives service call to roles listing service and gets the data as required.
 */
  setRolesListArr() {
    this.showLoaderFlag = true;
    this.listRolesService.getRolesList(this.getSearchQueryParam()).subscribe((response: any) => {
      if (response.header.statusCode && Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.results) {
          this.totalItems = response.payload.count;
          this.rolesListingArr = response.payload.results;
        } else {
          this.rolesListingArr = [];
        }
        this.showLoaderFlag = false;
      } else {
        this.rolesListingArr = [];
        this.showLoaderFlag = false;
      }
    },
      error => {
        this.rolesListingArr = [];
        this.showLoaderFlag = false;
      });
  }

  /**
   * method to get PO data as per selected status
   * @param event  as pagination object for getting cutrent/selected page
   */
  public pageChanged(event: any): void {
    this.currentPage = event.page;
    this.showLoadingFlg = true;
    this.rolesListingArr = [];
    this.index = 1 + (20 * (this.currentPage - 1));
    this.setRolesListArr();
  }

  /**
   * Gets all search query parameters from the filter form and returns it.
   */
  getSearchQueryParam() {
    let params: HttpParams = new HttpParams();
    params = params.append(this.ROLES_LIST_QUERY_PARAMS.pageSize, this.itemsPerPage.toString());
    params = params.append(this.ROLES_LIST_QUERY_PARAMS.pageNo, this.currentPage.toString());
    return params;
  }

}
