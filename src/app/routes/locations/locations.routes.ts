/**
* Component     : locations
 
* Creation Date : 27th April 2018
*/

import { Routes } from '@angular/router';
import { ACTION_TYPES, MODULE_ID } from '@app/config';
import { RoleGuard } from '@app/common';
export const locationRoutes: Routes = [
  {
    path: 'view',
    loadChildren: './location-list/location-list.module#LocationListModule',
    data: {
      type: ACTION_TYPES.VIEW,
      moduleID: MODULE_ID.locations
    },
    canActivate: [RoleGuard]
  },
  {
    path: 'review',
    loadChildren: './review/review.module#ReviewModule',
    data: {
      type: ACTION_TYPES.VIEW,
      moduleID: MODULE_ID.review
    },
    canActivate: [RoleGuard]
  },
  {
    path: 'category',
    loadChildren: './category-list/category-list.module#CategoryListModule',
    data: {
      type: ACTION_TYPES.VIEW,
      moduleID: MODULE_ID.category
    },
    canActivate: [RoleGuard]
  },
  {
    path: 'presentation',
    loadChildren: './presentation/presentation.module#PresentationModule',
    data: {
      type: ACTION_TYPES.VIEW,
      moduleID: MODULE_ID.presentation
    },
    canActivate: [RoleGuard]
  },
  {
    path: 'scouter',
    loadChildren: './location-scouter/location-scouter.module#LocationScouterModule',
    data: {
      type: ACTION_TYPES.VIEW,
      moduleID: MODULE_ID.scouterAccess
    },
    canActivate: [RoleGuard]
  },
  { path: '**', redirectTo: 'view' }
];
