/**
* Component     : Routing
 
* Creation Date : 27th April 2018
*/

import { Routes } from '@angular/router';
import { ACTION_TYPES, MODULE_ID } from '../../../config'
import { RoleGuard } from '@app/common';

export const vendorsRoutes: Routes = [
  {
    path: '',
    loadChildren: './list-vendors/list-vendors.module#ListVendorsModule',
    data: {
      type: ACTION_TYPES.VIEW,
      moduleID: MODULE_ID.vendors
    },
    canActivate: [RoleGuard]
  },
  {
    path: 'add-vendor',
    loadChildren: './add-vendor/add-vendor.module#AddVendorModule',
    data: {
      type: ACTION_TYPES.ADD,
      moduleID: MODULE_ID.vendors
    },
    canActivate: [RoleGuard]
  },
  {
    path: 'edit-vendor/:id',
    loadChildren: './edit-vendor/edit-vendor.module#EditVendorModule',
    data: {
      type: ACTION_TYPES.EDIT,
      moduleID: MODULE_ID.vendors
    },
    canActivate: [RoleGuard]
  }
  // {
  //   path: 'vendor-activation',
  //   loadChildren: './activation-vendors/activation-vendors.module#ActivationVendorsModule',
  //   data: {
  //     type: ACTION_TYPES.ADD,
  //     moduleID: MODULE_ID.vendors
  //   }
  // }
];
