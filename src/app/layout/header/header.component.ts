import { Component, OnInit } from '@angular/core';
import { UserblockService } from '../sidebar/userblock/userblock.service';
import { SettingsService } from '@app/core/settings/settings.service';
import { MenuService } from '@app/core/menu/menu.service';
import { ROUTER_LINKS_FULL_PATH, COOKIES_CONSTANTS, LOCAL_STORAGE_CONSTANTS, EVENT_TYPES } from '@app/config';
import { NavigationService, Common, SessionService, ToasterService, TriggerService } from '@app/common';
import { SharedData } from '@app/shared/shared.data';
import { RolePermission } from '@app/shared/role-permission';
import { LayoutService } from '../layout.service';
import { LayoutData } from '../layout.data';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
const screenfull = require('screenfull');
const browser = require('jquery.browser');
declare var $: any;


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  /*declare variables above constructor in sequence -imported constants,public variable,private variables*/

  navCollapsed = true; // for horizontal layout
  menuItems = []; // for horizontal layout
  isNavSearchVisible: boolean;
  landingPage: any = '';
  showLoaderFlag: boolean = false;
  commonLabelsObj: any;
  rolesDetailsArr = [];
  userInfo: any;
  selectedRoleId: any;
  /*declare variables above constructor in sequence -imported constants,public variable,private variables*/

  /*inicialize contructor after declaration of all variables*/

  constructor(
    public menu: MenuService,
    private navigationService: NavigationService,
    public userblockService: UserblockService,
    public settings: SettingsService,
    private sharedData: SharedData,
    private sessionService: SessionService,
    public _rolePermission: RolePermission,
    private layoutService: LayoutService,
    private layoutData: LayoutData,
    private toasterService: ToasterService,
    private triggerService: TriggerService,
    private translateService : TranslateService
  ) {

  }
  /*inicialize contructor after declaration of all variables*/

  /*all life cycle events whichever required after inicialization of constructor*/
  ngOnInit() {
    this.isNavSearchVisible = false;
    this.setRolesDetails();

  }

  /*Sets common labels from language jsons*/
  setLocaleObj() {
    this.translateService.get('common').subscribe(res => {
      this.commonLabelsObj = res;
    });
  }

  setRolesDetails() {
    const userInfo = this.sharedData.getUsersInfo();
    this.selectedRoleId = userInfo['roleId'];
    this.rolesDetailsArr = userInfo['rolesDetails'];
  }
  /*all life cycle events whichever required after inicialization of constructor*/

  /*user defined functions/methods after life cycle events in sequence-public methods,private methods*/

  /*method to toggle user profile section*/
  toggleUserBlock(event) {
    event.preventDefault();
    this.userblockService.toggleVisibility();
  }

  /*method to logout user & navigate back to login page*/
  logout() {
    this.layoutService.logout().subscribe((result: any) => {
      if (Common.checkStatusCode(result.header.statusCode)) {
        this.sessionService.removeLocalStorageItem(LOCAL_STORAGE_CONSTANTS.userInfo);
        this.sessionService.removeSessionItem(COOKIES_CONSTANTS.authToken);
        this.sharedData.setUsersInfo(null);
        this.sessionService.clearSession();
        this.sessionService.removeSession();
        this.sessionService.deleteCookie(COOKIES_CONSTANTS.authToken);
        this.navigationService.navigate(ROUTER_LINKS_FULL_PATH.login);
      }
    });
  }
  /*nav bar toggle functions*/
  openNavSearch(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setNavSearchVisible(true);
  }

  setNavSearchVisible(stat: boolean) {
    this.isNavSearchVisible = stat;
  }

  getNavSearchVisible() {
    return this.isNavSearchVisible;
  }

  toggleOffsidebar() {
    this.settings.layout.offsidebarOpen = !this.settings.layout.offsidebarOpen;
  }

  toggleCollapsedSideabar() {
    this.settings.layout.isCollapsed = !this.settings.layout.isCollapsed;
  }

  isCollapsedText() {
    return this.settings.layout.isCollapsedText;
  }

  /*nav bar toggle functions*/

  setAccessRolePermissionDetails(id) {
    if (id) {
      this.layoutData.siteLoaderFlag = true;
      this.layoutService.getAccessRolePermissionDetails(id).subscribe((response: any) => {
        if (response.header.statusCode && Common.checkStatusCodeInRange(response.header.statusCode)) {
          if (response.payload && response.payload.result) {
            const userInfo = response.payload.result;
            const userInfoDetails = this.sharedData.getUsersInfo();
            this.sessionService.setSessionItem(COOKIES_CONSTANTS.authToken, userInfo['authToken']);
            this.sessionService.setCookie(COOKIES_CONSTANTS.authToken, userInfo['authToken']);
            if (userInfo.rolePermissions) {
              userInfoDetails['rolePermission'] = userInfo.rolePermissions;
            }
            userInfoDetails['roleId'] = userInfo['id'];
            const roleDetailsObj = _.find(userInfoDetails.rolesDetails, { 'id': userInfo['id'] });
            userInfoDetails['roleName'] = roleDetailsObj['roleName'];
            this.sharedData.setUsersInfo(userInfoDetails);
            this._rolePermission.setRolePermissionObj(userInfo);
            this.setEventType({ type: EVENT_TYPES.roleAccessPermission, prevValue: {}, currentValue: true });

          } else {
          }
          this.layoutData.siteLoaderFlag = false;
        } else {
          this.layoutData.siteLoaderFlag = false;
          this.toasterService.error(response.header.message);
        }
      },
        error => {
          this.toasterService.error(this.commonLabelsObj.errorMessages.error);
          this.layoutData.siteLoaderFlag = false;
        });
    }
  }

  /**
  ** It triggers an event which will notify manage payment component.
  ** @param event event data to be triggered
  **/
 setEventType(event: any) {
  this.triggerService.setEvent(event);
}

  /*user defined functions/methods after life cycle events in sequence-public methods,private methods*/

}
