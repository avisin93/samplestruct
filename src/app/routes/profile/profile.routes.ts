/**
* Component     : Routing
* Author        : Boston Byte LLC
* Creation Date : 27th April 2018
*/

import { Routes } from '@angular/router';
import { ACTION_TYPES, MODULE_ID, ROLES_CONST } from '@app/config';
import { ProfileComponent } from './profile.component';
import { RoleGuard } from '@app/common';

export const profileRoutes: any = [
  { path: '', component: ProfileComponent },
  {
    path: 'edit-freelancer-profile/:id',
    loadChildren: '../users/freelancers/edit-freelancer/edit-freelancer.module#EditFreelancerModule',
    data: {
      profile: true,
      type: ACTION_TYPES.EDIT,
      moduleID: MODULE_ID.profile
    },
    canActivate: [RoleGuard]
  },
  {
    path: 'edit-vendor-profile/:id',
    loadChildren: '../users/vendors/edit-vendor/edit-vendor.module#EditVendorModule',
    data: {
      profile: true,
      type: ACTION_TYPES.EDIT,
      moduleID: MODULE_ID.profile
    },
    canActivate: [RoleGuard]
  }
];
