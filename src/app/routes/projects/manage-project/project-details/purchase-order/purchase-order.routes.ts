import { Routes } from '@angular/router';
import { PurchaseOrderComponent } from './purchase-order.component';
import { PoListingComponent } from './po-listing/po-listing.component';
import { AddPoFreelancerComponent } from './add-po-freelancer/add-po-freelancer.component';
import { AddPoVendorComponent } from './add-po-vendor/add-po-vendor.component';
import { ManagePoAdvanceComponent } from './manage-po-advance/manage-po-advance.component';
import { ManageTalentPoComponent } from './manage-talent-po/manage-talent-po.component';
import { ACTION_TYPES, MODULE_ID } from '@app/config';
import { RoleGuard } from '@app/common';
// import { AddPoVendorComponent } from './add-po-vendor/add-po-vendor.component';
// import { AddPoTalentComponent } from './add-po-talent/add-po-talent.component';
export const poRoutes: Routes = [
  {
    path: '',
    component: PurchaseOrderComponent,
    children: [
      {
        path: '',
        component: PoListingComponent
      },
      {
        path: 'manage-freelancer',
        component: AddPoFreelancerComponent,
        data: {
          type: ACTION_TYPES.ADD,
          moduleID: MODULE_ID.freelancerPO
        },
        canActivate: [RoleGuard]
      },
      
      {
        path: 'manage-freelancer/:id',
        component: AddPoFreelancerComponent,
        data: {
          type: ACTION_TYPES.EDIT,
          moduleID: MODULE_ID.freelancerPO
        },
        canActivate: [RoleGuard]
      },
      {
        path: 'manage-location',
        loadChildren: './manage-location/manage-location.module#POManageLocationModule',
        data: {
          type: ACTION_TYPES.ADD,
          moduleID: MODULE_ID.locationPO
        },
        canActivate: [RoleGuard]
      },
      {
        path: 'manage-location/:id',
        loadChildren: './manage-location/manage-location.module#POManageLocationModule',
        data: {
          type: ACTION_TYPES.EDIT,
          moduleID: MODULE_ID.locationPO
        },
        canActivate: [RoleGuard]
      },
      {
        path: 'manage-vendor',
        component: AddPoVendorComponent,
        data: {
          type: ACTION_TYPES.ADD,
          moduleID: MODULE_ID.vendorPO
        },
        canActivate: [RoleGuard]
      },
      {
        path: 'manage-vendor/:id',
        component: AddPoVendorComponent,
        data: {
          type: ACTION_TYPES.EDIT,
          moduleID: MODULE_ID.vendorPO
        },
        canActivate: [RoleGuard]
      },
      {
        path: 'manage-advance',
        component: ManagePoAdvanceComponent,
        data: {
          type: ACTION_TYPES.ADD,
          moduleID: MODULE_ID.advancePO
        },
        canActivate: [RoleGuard]
      },
      {
        path: 'manage-advance/:id',
        component: ManagePoAdvanceComponent,
        data: {
          type: ACTION_TYPES.EDIT,
          moduleID: MODULE_ID.advancePO
        },
        canActivate: [RoleGuard]
      },
      {
        path: 'manage-talent',
        component: ManageTalentPoComponent,
        data: {
          type: ACTION_TYPES.ADD,
          moduleID: MODULE_ID.talentPO
        },
        canActivate: [RoleGuard]
      },
      {
        path: 'manage-talent/:talentPoId',
        component: ManageTalentPoComponent,
        data: {
          type: ACTION_TYPES.EDIT,
          moduleID: MODULE_ID.talentPO
        },
        canActivate: [RoleGuard]
      },
      { path: '**', redirectTo: '' }

    ]
  }
];
