/**
* Component     : Routing
 
* Creation Date : 27th April 2018
*/

import { Routes } from '@angular/router';
import { ACTION_TYPES, MODULE_ID } from '../../config';
import { RoleGuard } from '../../common';

export const usersRoutes: Routes = [
  {
    path: 'freelancers',
    loadChildren: './freelancers/freelancers.module#FreelancersModule',
    data: {
      type: ACTION_TYPES.VIEW,
      moduleID: MODULE_ID.freelancers
    },
    canActivate: [RoleGuard]
  },
  {
    path: 'vendors',
    loadChildren: './vendors/vendors.module#VendorsModule',
    data: {
      type: ACTION_TYPES.VIEW,
      moduleID: MODULE_ID.vendors
    },
    canActivate: [RoleGuard]
  }
];
