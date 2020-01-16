/**
* Component     : Locations Review
* Author        : Boston Byte LLC
* Creation Date : 24th June 2019
*/

import { Routes } from '@angular/router';
import { ACTION_TYPES, MODULE_ID } from '@app/config';
import { ReviewComponent } from './review.component';
import { RoleGuard } from '@app/common';


export const locationReviewRoutes: Routes = [
  {
    path: '',
    component: ReviewComponent,
    children: [{
      path: '',
      loadChildren: './list-review/list-review.module#ListReviewModule',
      data: {
        type: ACTION_TYPES.VIEW,
        moduleID: MODULE_ID.review
      },
      canActivate: [RoleGuard]
    },
    {
      // path: 'manage/:reviewId',
      path: 'manage/:id',

      loadChildren: './manage-review/manage-review.module#ManageReviewModule',
      data: {
        type: ACTION_TYPES.EDIT,
        moduleID: MODULE_ID.review
      },
      canActivate: [RoleGuard]
    },
    {
      path: '**',
      redirectTo: ''
    }]
  }
];
