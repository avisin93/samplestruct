import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ROUTER_LINKS_FULL_PATH, ROLES_CONST, COOKIES_CONSTANTS } from '@app/config';
import { Common, SessionService, NavigationService } from '@app/common';
import { SharedData } from '@app/shared/shared.data';
import * as _ from 'lodash';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private router: Router,
    private navigationService: NavigationService,
    private sessionService: SessionService,
    private sharedData: SharedData) { }

  ngOnInit() {
    const userInfo = this.sharedData.getUsersInfo();
    // const userInfo = Common.parseJwt(this.sessionService.getCookie(COOKIES_CONSTANTS.authToken));

    const isParentVendor = _.find(userInfo.rolesDetails, { 'parentRoleId': ROLES_CONST.vendor });
    const isVendor = _.find(userInfo.rolesDetails, { 'id': ROLES_CONST.vendor });
    const isParentFreelancer = _.find(userInfo.rolesDetails, { 'parentRoleId': ROLES_CONST.freelancer });
    const isFreelancer = _.find(userInfo.rolesDetails, { 'id': ROLES_CONST.freelancer });

    if (isParentFreelancer || isFreelancer) {
      this.navigationService.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.editFreelancerProfile, [userInfo.id])]);
    } else if (isVendor || isParentVendor) {
      this.navigationService.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.editVendorProfile, [userInfo.id])]);
    }
  }


}


