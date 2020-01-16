/**
* Component     : locationlist
* Author        : Boston Byte LLC
* Creation Date : 11th July 2018
*/

import { Routes } from '@angular/router';
import { ACTION_TYPES, MODULE_ID } from '@app/config';
import { RoleGuard } from '@app/common/roleguard';
import { LocationListComponent } from './location-list.component';

export const locationListRoutes: Routes = [
  {
    path: '',
    component: LocationListComponent,
    children: [
      {
        path: '',
        loadChildren: './list-location/list-location.module#ListLocationModule',
        data: {
          type: ACTION_TYPES.VIEW,
          moduleID: MODULE_ID.locationList
        },
        canActivate: [RoleGuard]
      },
      {
        path: 'manage-location',
        loadChildren: './manage-location/manage-locations.module#ManageLocationsModule',
        data: {
          type: ACTION_TYPES.ADD,
          moduleID: MODULE_ID.locationList
        },
        canActivate: [RoleGuard]
      },
      {
        path: 'manage-location/:id',
        loadChildren: './manage-location/manage-locations.module#ManageLocationsModule',
        data: {
          type: ACTION_TYPES.ADD,
          moduleID: MODULE_ID.locationList
        },
        canActivate: [RoleGuard]
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
      }
    ]
  }
];
