/**
* Component     : Routing
* Author        : Boston Byte LLC
* Creation Date : 27th April 2018
*/

import { Routes } from '@angular/router';
import { ACTION_TYPES, MODULE_ID} from '../../../config'
import { RoleGuard } from '@app/common';

export const freelancersRoutes: Routes =  [
  {
    path: '',
    loadChildren: './list-freelancers/list-freelancers.module#ListFreelancersModule',
    data: {
      type: ACTION_TYPES.VIEW,
      moduleID: MODULE_ID.freelancers
    },
    canActivate: [RoleGuard]
  },
  {
    path: 'add-freelancer',
    loadChildren: './add-freelancer/add-freelancer.module#AddFreelancerModule',
    data: {
      type: ACTION_TYPES.ADD,
      moduleID: MODULE_ID.freelancers
    },
    canActivate: [RoleGuard]
  },
  {
    path: 'edit-freelancer/:id',
    loadChildren: './edit-freelancer/edit-freelancer.module#EditFreelancerModule',
    data: {
      type: ACTION_TYPES.EDIT,
      moduleID: MODULE_ID.freelancers
    },
    canActivate: [RoleGuard]
  }
];
